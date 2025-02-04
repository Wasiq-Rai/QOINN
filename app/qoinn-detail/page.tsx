"use client";
interface StockData {
  time: number;
  value: number;
  change?: number;
}

interface IndexFund {
  name: string;
  symbol: string;
  description: string;
  marketCap: number;
  data: StockData[];
}

interface Stock {
  id: string;
  name: string;
  data: StockData[];
  momentum: number;
  selected: boolean;
}

interface QoinnState {
  selectedStocks: string[];
  currentStep: number;
  animationPhase: number;
}

// utils.ts
const generateStockData = (
  trend: "up" | "down" | "neutral",
  startValue: number = 100,
  points: number = 20,
  volatility: number = 1
): StockData[] => {
  const data: StockData[] = [];
  let value = startValue;

  for (let i = 0; i < points; i++) {
    const random = (Math.random() - 0.5) * volatility;
    const trendFactor = trend === "up" ? 0.5 : trend === "down" ? -0.5 : 0;
    const change = random + trendFactor;
    value = Math.max(value * (1 + change), 20);

    data.push({
      time: i,
      value: Number(value.toFixed(2)),
      change: change,
    });
  }

  return data;
};

// constants.ts
const INDEX_FUNDS: IndexFund[] = [
  {
    name: "Vanguard S&P 500 ETF",
    symbol: "VOO",
    description: "Tracks S&P 500 index",
    marketCap: 789.4,
    data: generateStockData("up", 100, 20, 0.8),
  },
  {
    name: "SPDR S&P 500 ETF Trust",
    symbol: "SPY",
    description: "Largest ETF tracking S&P 500",
    marketCap: 420.3,
    data: generateStockData("up", 98, 20, 0.8),
  },
  {
    name: "Vanguard Total Stock Market ETF",
    symbol: "VTI",
    description: "Broad market exposure",
    marketCap: 325.7,
    data: generateStockData("up", 102, 20, 0.8),
  },
];

// QoinnExplainer.tsx
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

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.[0]) return null;

  return (
    <div className="bg-white p-2 border rounded shadow-lg">
      <p className="font-medium">Time: {label}</p>
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
      {stock.momentum > 0 ? (
        <TrendingUp className="text-green-500 w-4 h-4" />
      ) : (
        <TrendingDown className="text-red-500 w-4 h-4" />
      )}
    </div>
    <div className="h-32">
      <StockChart
        data={stock.data}
        showAxes={false}
        color={stock.momentum > 0 ? "#22c55e" : "#ef4444"}
      />
    </div>
    <div className="mt-2 text-sm text-gray-600">
      Momentum: {stock.momentum > 0 ? "+" : ""}
      {stock.momentum.toFixed(2)}%
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

  // Generate sample stocks
  const stocks = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: `stock${i + 1}`,
      name: `Stock ${i + 1}`,
      data: generateStockData(
        i % 2 === 0 ? "up" : "down",
        90 + Math.random() * 20,
        20,
        1.2
      ),
      momentum: Math.random() * 20 - 10,
      selected: false,
    }));
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep + 1) % 3,
        animationPhase: (prev.animationPhase + 1) % 4,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStockSelect = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedStocks: prev.selectedStocks.includes(id)
        ? prev.selectedStocks.filter((s) => s !== id)
        : [...prev.selectedStocks, id],
    }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#2e5f7d]">
          How does QOINN work?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Intelligent investment strategy combining index tracking with momentum
          optimization
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
          <CardTitle>Index Fund Tracking</CardTitle>
          <CardDescription>
            An index assigns weights to stocks based on factors like market
            capitalization, stock price, or equal weighting. Index funds then
            distribute investments proportionally to these weights, ensuring the
            fund’s performance closely tracks the index. However, not all funds
            are in a good period with upward trends and momentum like the red
            ones down.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {INDEX_FUNDS.map((fund) => (
              <div key={fund.symbol} className="space-y-2">
                <h3 className="font-semibold">{fund.symbol}</h3>
                <p className="text-sm text-gray-600">{fund.description}</p>
                <div className="h-48">
                  <StockChart data={fund.data} animated={isPlaying} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Selection Process</CardTitle>
          <CardDescription>What if we can choose the stocks with upward trends and wrap them up to create a smaller batch fund?</CardDescription>
          <CardDescription>As the day progresses and certain stocks lose their momentum and begin to decline, QOINN dynamically replaces those underperforming stocks (marked in red) with others that are gaining momentum, ensuring optimal portfolio </CardDescription>
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
          <CardTitle>Portfolio Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">
                  Selected Stocks
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
                            {stock.momentum.toFixed(2)}%
                          </span>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">
                  Optimization Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Average Momentum</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(
                        stocks.reduce((acc, s) => acc + s.momentum, 0) /
                        stocks.length
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Selected Count</p>
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
