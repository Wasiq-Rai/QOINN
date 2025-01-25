import React, { useMemo } from 'react';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartData } from '@/utils/types';

interface CombinedChartProps {
  data: ChartData;
}

// Custom tooltip for detailed information
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-4 border rounded-lg shadow-lg">
      <p className="font-bold text-sm">{format(new Date(label), 'MMM d, yyyy')}</p>
      {payload.map((entry: any) => (
        <p 
          key={entry.name} 
          className="flex items-center gap-2 text-xs"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value.toFixed(2)}%
        </p>
      ))}
    </div>
  );
};

export function CombinedPerformanceChart({ data }: CombinedChartProps) {
  // Process data to calculate percentage changes
  const processedData = useMemo(() => {
    const initialSPY = data.spy[0];
    const initialVOO = data.voo[0];
    const initialModel = data.model[0][0];

    return data.dates.map((date, index) => ({
      date,
      SPY: ((data.spy[index] / initialSPY - 1) * 100),
      VOO: ((data.voo[index] / initialVOO - 1) * 100),
      Model: ((data.model[0][index] / initialModel - 1) * 100)
    }));
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Performance Comparison</CardTitle>
          <div className="flex items-center space-x-2">
            {data.model_version && (
              <Badge variant="outline">
                Model: {data.model_version}
              </Badge>
            )}
            {data.data_source && (
              <Badge variant="secondary">
                {data.data_source} Data
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={processedData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={false} 
              stroke="#e0e0e0" 
            />
            
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => format(new Date(tick), 'MMM d')}
            />
            
            <YAxis 
              tickFormatter={(tick) => `${tick.toFixed(0)}%`} 
              label={{ 
                value: 'Performance (%)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top" 
              height={36} 
            />

            <ReferenceLine 
              y={0} 
              stroke="#666" 
              strokeDasharray="3 3" 
              label="Baseline" 
            />

            <Line
              type="monotone"
              dataKey="Model"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
            />
            
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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}