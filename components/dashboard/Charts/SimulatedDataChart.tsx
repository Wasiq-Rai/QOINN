import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartData } from '@/utils/types'
import { useTheme } from '@/context/ThemeContext';

interface SimulatedDataChartProps {
  data: ChartData[]
}

export function SimulatedDataChart({ data }: SimulatedDataChartProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{theme.strings.simulatedPerformance}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Model" stroke="#ff7300" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

