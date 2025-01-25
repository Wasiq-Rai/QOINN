"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Edit2, RefreshCw } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { CombinedPerformanceChart } from './Charts/CombinedChart';
import { ChartData } from '@/utils/types';
import { getPerformanceData } from "@/utils/api";

// Configuration for different timelines
const TIMELINE_CONFIGS = {
  '2w': { period: '2w', label: '2 Weeks', expectedLength: 10 },
  '1m': { period: '1mo', label: '1 Month', expectedLength: 21 },
  '3m': { period: '3mo', label: '3 Months', expectedLength: 63 },
  '6m': { period: '6mo', label: '6 Months', expectedLength: 126 },
  '1y': { period: '1y', label: '1 Year', expectedLength: 252 },
  '2y': { period: '2y', label: '2 Years', expectedLength: 504 }
};

export function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setActiveModel] = useState("M15");
  const [activeTimeline, setActiveTimeline] = useState("1y");
  const [editMode, setEditMode] = useState(false);
  const [theoreticalData, setTheoreticalData] = useState<number[]>([]);

  // Fetch performance data
  const fetchData = async (model: string, timeline: string) => {
    setIsLoading(true);
    try {
      const response = await getPerformanceData(model, timeline);
      setChartData(response);
      setTheoreticalData(response.model[0]);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(activeModel, activeTimeline);
  }, [activeModel, activeTimeline]);

  // Handle data editing
  const handleDataEdit = (index: number, value: string) => {
    const newData = [...theoreticalData];
    newData[index] = Number(value);
    setTheoreticalData(newData);
    
    // Update chart data
    if (chartData) {
      const updatedChartData: ChartData = {
        ...chartData,
        model: [newData]
      };
      setChartData(updatedChartData);
    }
  };

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const uploadedData = content.split(",").map(Number);
        
        const config = Object.values(TIMELINE_CONFIGS).find(
          cfg => cfg.expectedLength === uploadedData.length
        );

        if (config) {
          setTheoreticalData(uploadedData);
          if (chartData) {
            const updatedChartData: ChartData = {
              ...chartData,
              model: [uploadedData]
            };
            setChartData(updatedChartData);
          }
        } else {
          alert("Uploaded data must match a predefined timeline length.");
        }
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <RefreshCw className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Performance Chart</TabsTrigger>
          <TabsTrigger value="edit">Edit Data</TabsTrigger>
        </TabsList>

        {/* Performance Chart Tab */}
        <TabsContent value="chart">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Select 
                value={activeModel} 
                onValueChange={setActiveModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M15">M15</SelectItem>
                  <SelectItem value="M16">M16</SelectItem>
                  <SelectItem value="M17">M17</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={activeTimeline} 
                onValueChange={setActiveTimeline}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Timeline" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIMELINE_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence mode="wait">
              {chartData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CombinedPerformanceChart data={chartData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Edit Data Tab */}
        <TabsContent value="edit">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={() => setEditMode(!editMode)}>
                <Edit2 className="mr-2 h-4 w-4" />
                {editMode ? "View" : "Edit"}
              </Button>
              <Button onClick={() => document.getElementById('fileUpload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
              <input 
                id="fileUpload"
                type="file" 
                className="hidden" 
                accept=".csv,.txt" 
                onChange={handleFileUpload} 
              />
            </div>

            <AnimatePresence>
              {editMode ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto"
                >
                  {theoreticalData.map((value, index) => (
                    <div key={index}>
                      <Label>Day {index + 1}</Label>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleDataEdit(index, e.target.value)}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theoreticalData.map((value, index) => (
                        <tr key={index} className="text-center">
                          <td>{index + 1}</td>
                          <td>{value.toFixed(2)}</td>
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
    </div>
  );
}