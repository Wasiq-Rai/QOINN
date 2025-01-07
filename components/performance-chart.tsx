"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays, subMonths, subYears } from "date-fns"

interface PerformanceChartProps {
  type: "theoretical" | "real"
}

export function PerformanceChart({ type }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState("1mo")

  const generateData = (days: number) => {
    const data = []
    let qoinnValue = 100
    let vooValue = 100
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i)
      qoinnValue *= 1 + (Math.random() * 0.02 - 0.005)
      vooValue *= 1 + (Math.random() * 0.015 - 0.005)
      data.push({
        date: format(date, "yyyy-MM-dd"),
        QOINN: Number(qoinnValue.toFixed(2)),
        VOO: Number(vooValue.toFixed(2)),
      })
    }
    return data
  }

  const getDataForTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case "1w": return generateData(7)
      case "1mo": return generateData(30)
      case "3mo": return generateData(90)
      case "6mo": return generateData(180)
      case "1y": return generateData(365)
      case "3y": return generateData(1095)
      default: return generateData(30)
    }
  }

  const data = getDataForTimeframe(timeframe)

  const calculatePerformance = (data: any[]) => {
    const start = data[0]
    const end = data[data.length - 1]
    return {
      QOINN: ((end.QOINN - start.QOINN) / start.QOINN * 100).toFixed(2),
      VOO: ((end.VOO - start.VOO) / start.VOO * 100).toFixed(2)
    }
  }

  const performance = calculatePerformance(data)

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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="QOINN"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="VOO"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">QOINN Performance</div>
            <div className={`text-2xl font-bold ${Number(performance.QOINN) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performance.QOINN}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">VOO Performance</div>
            <div className={`text-2xl font-bold ${Number(performance.VOO) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performance.VOO}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

