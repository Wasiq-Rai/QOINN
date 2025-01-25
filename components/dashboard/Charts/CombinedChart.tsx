import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush, ReferenceLine, Area, ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export interface ChartData {
  dates: string[]
  spy: number[]
  voo: number[]
  model: number[]
  model_version: string
}

interface ProcessedDataPoint {
  date: string
  SPY: number
  VOO: number
  Model: number
  MA20?: number | null
}

interface CombinedChartProps {
  simulatedData: ChartData
  realData: ChartData
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-bold">{format(new Date(label), 'MMM d, yyyy')}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium">{entry.value.toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatXAxis = (tickItem: string) => {
  return format(new Date(tickItem), 'MMM d');
};

const formatYAxis = (tickItem: number) => {
  return `${tickItem.toFixed(0)}%`;
};

export function CombinedChart({ simulatedData, realData }: CombinedChartProps) {
    console.log(simulatedData)
    console.log(realData)
  const [syncId] = useState('syncCharts');
  
  // Process data into the format needed for Recharts
  const processData = (data: ChartData): ProcessedDataPoint[] => {
    console.log(data)
    return data.dates.map((date, index) => ({
      date,
      SPY: data.spy[index],
      VOO: data.voo[index],
      Model: data.model[index]
    }));
  };

  const processedSimulatedData = useMemo(() => {
    return simulatedData ? processData(simulatedData) : [];
  }, [simulatedData]);

  const processedRealData = useMemo(() => {
    return realData ? processData(realData) : [];
  }, [realData]);

  // Calculate moving averages
  const calculateMA = (data: ProcessedDataPoint[], key: keyof ProcessedDataPoint, period: number) => {
    return data.map((_, index) => {
      if (index < period - 1) return null;
      const sum = data
        .slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + (curr[key] as number), 0);
      return sum / period;
    });
  };

  const ma20 = useMemo(() => 
    calculateMA(processedSimulatedData, 'Model', 20),
    [processedSimulatedData]
  );

  // Get the last 10 items for initial view
  const initialDataLength = processedSimulatedData.length;
  const initialStartIndex = Math.max(0, initialDataLength - 10);

  const renderChart = (chartData: ProcessedDataPoint[], isSimulated: boolean) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} syncId={syncId}>
          <defs>
            <linearGradient id="colorModel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7300" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="#e0e0e0"
          />
          <XAxis 
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: '#666' }}
            padding={{ left: 20, right: 20 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12, fill: '#666' }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
          />

          {/* Model line with gradient area */}
          <Area
            type="monotone"
            dataKey="Model"
            stroke="#ff7300"
            strokeWidth={2}
            fill="url(#colorModel)"
            dot={false}
          />
          
          {/* SPY and VOO lines */}
          <Line
            type="monotone"
            dataKey="SPY"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="VOO"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />

          {/* Moving average line for simulated data */}
          {isSimulated && (
            <Line
              type="monotone"
              data={ma20.map((value, index) => ({
                date: chartData[index]?.date,
                MA20: value
              }))}
              dataKey="MA20"
              stroke="#ff7300"
              strokeDasharray="5 5"
              dot={false}
            />
          )}

          {/* Reference line at 100% */}
          <ReferenceLine 
            y={100} 
            stroke="#666"
            strokeDasharray="3 3"
            label={{ 
              value: "Base (100%)", 
              position: "left",
              fill: '#666',
              fontSize: 12
            }}
          />

          {isSimulated && (
            <Brush 
              dataKey="date"
              height={30}
              stroke="#8884d8"
              startIndex={initialStartIndex}
              tickFormatter={formatXAxis}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Simulated Performance
              {simulatedData && (
                <span className="ml-2 text-sm text-gray-500">
                  (Model: {simulatedData.model_version})
                </span>
              )}
            </CardTitle>
            <Badge variant="outline">20-Day MA</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {renderChart(processedSimulatedData, true)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {renderChart(processedRealData, false)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}