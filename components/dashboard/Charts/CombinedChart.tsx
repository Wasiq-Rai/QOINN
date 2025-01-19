import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartData } from "@/utils/types"

interface CombinedChartProps {
  simulatedData: ChartData[]
  realData: ChartData[]
}

export function CombinedChart({ simulatedData, realData }: CombinedChartProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Simulated vs Real Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Model" stroke="#ff7300" dot={false} />
                <Line type="monotone" dataKey="SPY" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="VOO" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Real Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="SPY" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="VOO" stroke="#82ca9d" dot={false} />
                <Line type="monotone" dataKey="Real" stroke="#ff7300" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

