"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { getStocksHistory } from "@/utils/api";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
      {payload[0].payload.dailyChange && (
        <p
          className={
            payload[0].payload.dailyChange > 0
              ? "text-green-600"
              : "text-red-600"
          }
        >
          Change: {(payload[0].payload.dailyChange * 100).toFixed(2)}%
        </p>
      )}
      <p>Date: {payload[0].payload.time}</p>
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

const IndexFundTracking = () => {
  const { theme } = useTheme();

  const [isPlaying, setIsPlaying] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Map symbols to their proper names
        const symbolToName: Record<string, string> = {
          "SPY": "S&P 500 ETF",
          "VOO": "Vanguard S&P 500 ETF",
          "^DJI": "Dow Jones Industrial Average"
        };
    
        const symbols = ["SPY", "VOO", "^DJI"];
        const period = "2y"; 
        const interval = "1d"; 
    
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await getStocksHistory(symbol, period, interval);
            const data = response;
            
            const historyWithDailyChanges = data.map((entry: any, index: number) => {
              if (index === 0) {
                return {
                  time: format(new Date(entry.Date), 'MMM d, yyyy'),
                  value: entry.Close,
                  change: 0,
                  dailyChange: 0
                };
              }
              
              const prevClose = data[index - 1].Close;
              const dailyChange = ((entry.Close - prevClose) / prevClose) * 100;
              
              return {
                time: format(new Date(entry.Date), 'MMM d, yyyy'),
                value: entry.Close,
                change: ((entry.Close - data[0].Close) / data[0].Close) * 100,
                dailyChange: dailyChange
              };
            });
    
            return {
              id: symbol,
              name: symbolToName[symbol] || symbol, // Use proper name if available
              symbol: symbol,
              price: data[data.length - 1].Close,
              change: historyWithDailyChanges[historyWithDailyChanges.length - 1].dailyChange,
              history: historyWithDailyChanges,
            };
          })
        );
        setStocks(stockData);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mx-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">
          {theme.strings.indexFundTracking}
        </h1>
      </div>

      <p className="text-gray-600 mb-6">
        {theme.strings.indexFundTrackingDescription}
      </p>

      <div className="h-full w-full justify-center">
        <Image
          unoptimized
          quality={100}
          width={0}
          height={0}
          src="/img/charts/index-fund-tracking.png"
          alt="Index Funds Tracking"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      {loading ? (
        <div className="flex justify-center p-6 w-full">
          <Loader />
        </div>
      ) : (
        <Card className="w-full">
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <div key={stock.id} className="space-y-2">
                  <h3 className="font-semibold">{stock.name}</h3>
                  <p className="text-sm text-gray-600">{stock.symbol}</p>
                  <div className="h-48">
                    <StockChart data={stock.history} animated={isPlaying} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IndexFundTracking;
