"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { getPerformanceData } from '@/utils/api'
import { ChartData } from '@/utils/types'



export function PerformanceChart() {
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPerformanceData()
        const formattedData = response.dates.map((date: string, index: number) => ({
          date,
          spy: response.spy[index],
          voo: response.voo[index],
          qoinn_theoretical: response.qoinn_theoretical[index],
          qoinn_real: response.qoinn_real[index],
        }))
        setData(formattedData)
      } catch (error) {
        console.error("Error fetching performance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="SPY" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="VOO" stroke="#82ca9d" dot={false} />
              <Line type="monotone" dataKey="QOINN_Theoretical" stroke="#ffc658" dot={false} />
              <Line type="monotone" dataKey="QOINN_Real" stroke="#ff7300" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}

