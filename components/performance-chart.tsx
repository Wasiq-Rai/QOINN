"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPerformanceData } from "@/utils/api"
import { PerformanceData } from "@/utils/types"

export function PerformanceChart() {
  const [timeframe, setTimeframe] = useState("1mo")
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await getPerformanceData();
        // setPerformanceData(data); // Ensure data is an array of PerformanceData
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };
    fetchPerformance();
  }, []);

  const filterDataByTimeframe = (data: PerformanceData[], timeframe: string) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case "1w":
        startDate.setDate(now.getDate() - 7);
        break;
      case "1mo":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3mo":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6mo":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "3y":
        startDate.setFullYear(now.getFullYear() - 3);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return data.filter(item => new Date(item.date) >= startDate);
  };

  const filteredData = filterDataByTimeframe(performanceData, timeframe);

  const calculatePerformance = (data: PerformanceData[]) => {
    if (data.length < 2) return 0;
    const start = data[0].value;
    const end = data[data.length - 1].value;
    return ((end - start) / start * 100).toFixed(2);
  };

  const performance = calculatePerformance(filteredData);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1w">1 Week</SelectItem>
            <SelectItem value="1mo">1 Month</SelectItem>
            <SelectItem value="3mo">3 Months</SelectItem>
            <SelectItem value="6mo">6 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="3y">3 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium">Performance</div>
          <div className={`text-2xl font-bold ${Number(performance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {performance}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

