"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import { getStocksHistory } from "@/utils/api";
import { format } from "date-fns";
import { useTheme } from "@/context/ThemeContext";

interface StockData {
  time: number;
  value: number;
  change?: number;
}

interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  history: StockData[];
  selected: boolean;
}

interface QoinnState {
  selectedStocks: string[];
  currentStep: number;
  animationPhase: number;
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.[0]) return null;

  return (
    <div className="bg-white p-2 border rounded shadow-lg">
      <p className="text-blue-600">Value: {payload[0].value.toFixed(2)}</p>
      {payload[0].payload.change && (
        <p
          className={
            payload[0].payload.change > 0 ? "text-green-600" : "text-red-600"
          }
        >
          Change: {(payload[0].payload.change * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
};

const StockChart: React.FC<{
  data: StockData[];
  height?: string | number;
  showAxes?: boolean;
  animated?: boolean;
  color?: string;
}> = ({
  data,
  height = "100%",
  showAxes = true,
  animated = false,
  color = "#2563eb",
}) => {
  const [animatedData, setAnimatedData] = useState<StockData[]>([]);

  useEffect(() => {
    if (animated) {
      setAnimatedData([]);
      const interval = setInterval(() => {
        setAnimatedData((prev) => {
          if (prev.length >= data.length) {
            clearInterval(interval);
            return prev;
          }
          return [...prev, data[prev.length]];
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [data, animated]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={animated ? animatedData : data}>
        {showAxes && <CartesianGrid strokeDasharray="3 3" />}
        {showAxes && <XAxis dataKey="time" />}
        {showAxes && <YAxis domain={["auto", "auto"]} />}
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const StockCard: React.FC<{
  stock: Stock;
  onSelect?: (id: string) => void;
}> = ({ stock, onSelect }) => (
  <div
    className={`p-4 border rounded-lg transition-all duration-300 ${
      stock.selected ? "border-blue-500 shadow-lg" : "border-gray-200"
    }`}
    onClick={() => onSelect?.(stock.id)}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold">{stock.name}</h4>
      {stock.change > 0 ? (
        <TrendingUp className="text-green-500 w-4 h-4" />
      ) : (
        <TrendingDown className="text-red-500 w-4 h-4" />
      )}
    </div>
    <div className="h-32">
      <StockChart
        data={stock.history}
        showAxes={false}
        color={stock.change > 0 ? "#22c55e" : "#ef4444"}
      />
    </div>
    <div className="mt-2 text-sm text-gray-600">
      Change: {stock.change > 0 ? "+" : ""}
      {stock.change.toFixed(2)}%
    </div>
  </div>
);

export const QoinnExplainer: React.FC = () => {
  const [state, setState] = useState<QoinnState>({
    selectedStocks: [],
    currentStep: 0,
    animationPhase: 0,
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const symbols = ["SPY", "VOO", "^DJI"]; // Example stock symbols
        const period = "2y"; // Example period
        const interval = "1d"; // Example interval
  
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await getStocksHistory(symbol,period,interval);
            const data = response;
            return {
              id: symbol,
              name: symbol,
              symbol: symbol,
              price: data[data.length - 1].Close, // Latest closing price
              change: ((data[data.length - 1].Close - data[0].Close) / data[0].Close) * 100, // Percentage change
              history: data.map((entry: any) => ({
                time: format(new Date(entry.Date), 'MMM d, yyyy'),
                value: entry.Close,
                change: ((entry.Close - data[0].Close) / data[0].Close) * 100,
              })),
              selected: false,
            };
          })
        );
  
        setStocks(stockData);
      } catch (err) {
        console.log(err)
        setError("Failed to fetch stock data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStockData();
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleStockSelect = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedStocks: prev.selectedStocks.includes(id)
        ? prev.selectedStocks.filter((s) => s !== id)
        : [...prev.selectedStocks, id],
    }));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#2e5f7d]">
          {theme.strings.howDoesQoinnWork}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {theme.strings.howDoesQoinnWorkDescription}
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={toggleAnimation}>
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "Pause" : "Play"} Animation
          </Button>
        </div>
      </header>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{theme.strings.indexFundTracking}</CardTitle>
          <CardDescription>
            {theme.strings.indexFundTrackingDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <div key={stock.id} className="space-y-2">
                <h3 className="font-semibold">{stock.symbol}</h3>
                <p className="text-sm text-gray-600">{stock.name}</p>
                <div className="h-48">
                  <StockChart data={stock.history} animated={isPlaying} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{theme.strings.stockSelectionProcess}</CardTitle>
          <CardDescription>{theme.strings.stockSeectionProcessDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={{
                  ...stock,
                  selected: state.selectedStocks.includes(stock.id),
                }}
                onSelect={handleStockSelect}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{theme.strings.portfolioOptimization}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">
                  {theme.strings.selectedStocks}
                </h4>
                <div className="space-y-2">
                  {state.selectedStocks.map((id) => {
                    const stock = stocks.find((s) => s.id === id);
                    return (
                      stock && (
                        <div key={id} className="flex items-center space-x-2">
                          <TrendingUp className="text-green-500 w-4 h-4" />
                          <span>{stock.name}</span>
                          <span className="text-green-600">
                            {stock.change.toFixed(2)}%
                          </span>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">
                  {theme.strings.optimizationMetrics}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{theme.strings.optimizationMetricsAverageChange}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(
                        stocks.reduce((acc, s) => acc + s.change, 0) /
                        stocks.length
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{theme.strings.selectedCount}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {state.selectedStocks.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QoinnExplainer;