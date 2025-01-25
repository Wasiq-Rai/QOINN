"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { getPerformanceData } from "@/utils/api"
import type { ChartData } from "@/utils/types"
import { Upload, Edit2, RefreshCw } from "lucide-react"
import { CombinedChart } from "./Charts/CombinedChart"

export function PerformanceChart() {
  const [simulatedData, setSimulatedData] = useState<ChartData>({
    dates: [],
    spy: [],
    voo: [],
    model: [],
    model_version: "M15"
  })
  const [realData, setRealData] = useState<ChartData>({
    dates: [],
    spy: [],
    voo: [],
    model: [],
    model_version: "M15"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeModel, setActiveModel] = useState("M15")
  const [activeTimeframe, setActiveTimeframe] = useState("1d")
  const [editMode, setEditMode] = useState(false)
  const [theoreticalData, setTheoreticalData] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData(activeModel, activeTimeframe)
  }, [activeModel, activeTimeframe])

  const fetchData = async (model: string, timeframe: string) => {
    setIsLoading(true)
    try {
      const response = await getPerformanceData(model, timeframe)
      setSimulatedData(response)
      setRealData(response)
      setTheoreticalData(response.model.flat())
    } catch (error) {
      console.error("Error fetching performance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = (model: string) => {
    setActiveModel(model)
  }

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe)
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
  }

  const handleDataChange = (index: number, value: string) => {
    const newData = [...theoreticalData]
    newData[index] = Number.parseFloat(value)
    setTheoreticalData(newData)
    updateChartData(newData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const uploadedData = content.split(",").map(Number)
        setTheoreticalData(uploadedData)
        updateChartData(uploadedData)
      }
      reader.readAsText(file)
    }
  }

  const updateChartData = (newTheoreticalData: number[]) => {

  }

  const resetData = () => {
    fetchData(activeModel, activeTimeframe)
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
        <CardDescription>Compare QOINN's performance against major market indices</CardDescription>
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
                <Select onValueChange={handleModelChange} defaultValue={activeModel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="M15">M15</SelectItem>
                    <SelectItem value="M16">M16</SelectItem>
                    <SelectItem value="M17">M17</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={handleTimeframeChange} defaultValue={activeTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="3m">3 Minutes</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="30m">30 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeModel}-${activeTimeframe}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <CombinedChart simulatedData={simulatedData} realData={realData} />
                </motion.div>
              </AnimatePresence>
            </div>
          </TabsContent>
          <TabsContent value="edit">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={handleEditToggle}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  {editMode ? "View" : "Edit"}
                </Button>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
                <Button onClick={resetData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto"
                  >
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[400px] overflow-y-auto"
                  >
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
                            <td>{Number(value).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

