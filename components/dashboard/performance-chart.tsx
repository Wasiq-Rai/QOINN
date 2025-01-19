"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion, useAnimation } from 'framer-motion'
import { getPerformanceData } from '@/utils/api'
import { ChartData } from '@/utils/types'
import { Upload, Edit2, RefreshCw } from 'lucide-react'

export function PerformanceChart() {
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeModel, setActiveModel] = useState('M15')
  const [editMode, setEditMode] = useState(false)
  const [theoreticalData, setTheoreticalData] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    fetchData(activeModel)
  }, [activeModel])

  const fetchData = async (model: string) => {
    setIsLoading(true)
    try {
      const response = await getPerformanceData(model)
      const formattedData = response.dates.map((date: string, index: number) => ({
        date,
        SPY: response.spy[index],
        VOO: response.voo[index],
        Model: response.model[index],
      }))
      setData(formattedData)
      setTheoreticalData(response.model)
      await controls.start({ opacity: 1, y: 0 })
    } catch (error) {
      console.error("Error fetching performance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = (model: string) => {
    setActiveModel(model)
    controls.start({ opacity: 0, y: 20 })
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
  }

  const handleDataChange = (index: number, value: string) => {
    const newData = [...theoreticalData]
    newData[index] = parseFloat(value)
    setTheoreticalData(newData)
    updateChartData(newData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const uploadedData = content.split(',').map(Number)
        setTheoreticalData(uploadedData)
        updateChartData(uploadedData)
      }
      reader.readAsText(file)
    }
  }

  const updateChartData = (newTheoreticalData: number[]) => {
    const updatedData = data.map((item: any, index: any | number) => ({
      ...item,
      Model: newTheoreticalData[index],
    }))
    setData(updatedData)
  }

  const resetData = () => {
    fetchData(activeModel)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <RefreshCw className="animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QOINN Performance Chart</CardTitle>
        <CardDescription>
          Compare QOINN's performance against major market indices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="edit">Edit Data</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant={activeModel === 'M15' ? 'default' : 'outline'}
                  onClick={() => handleModelChange('M15')}
                >
                  M15
                </Button>
                <Button
                  variant={activeModel === 'M16' ? 'default' : 'outline'}
                  onClick={() => handleModelChange('M16')}
                >
                  M16
                </Button>
                <Button
                  variant={activeModel === 'M17' ? 'default' : 'outline'}
                  onClick={() => handleModelChange('M17')}
                >
                  M17
                </Button>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
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
                    <Line type="monotone" dataKey="Model" stroke="#ff7300" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </TabsContent>
          <TabsContent value="edit">
            <div className="space-y-4 max-h-screen">
              <div className="flex space-x-2">
                <Button onClick={handleEditToggle}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  {editMode ? 'View' : 'Edit'}
                </Button>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <Button onClick={resetData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              {editMode ? (
                <div className="grid grid-cols-4 gap-4 h-[400px] overflow-y-auto">
                  {theoreticalData.map((value, index) => (
                    <div key={index}>
                      <Label htmlFor={`data-${index}`}>Day {index + 1}</Label>
                      <Input
                        id={`data-${index}`}
                        type="number"
                        value={value}
                        onChange={(e) => handleDataChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theoreticalData.map((value, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{value.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

