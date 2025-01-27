"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";

import {
  Grid,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Edit as EditIcon,
  UploadFile as UploadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { getPerformanceData, TIMELINE_CONFIGS } from "@/utils/api";
import { ChartData } from "@/utils/types";
import FileUploadButton from "../ui/file-upload-button";
import PerformanceSummary from "./performance-summary";

export function PerformanceChart() {
  const [simulatedData, setSimulatedData] = useState<ChartData | null>(null);
  const [realData, setRealData] = useState<ChartData | null>(null);
  const [activeModel, setActiveModel] = useState("M15");
  const [activeTimeline, setActiveTimeline] = useState("1y");
  const [editMode, setEditMode] = useState(false);
  const [simulatedModelData, setSimulatedModelData] = useState<number[]>([]);
  const [dataType, setDataType] = useState<"percentage" | "absolute">(
    "percentage"
  );

  // Fetch performance data
  const fetchData = async (model: string, timeline: string) => {
    try {
      const response = await getPerformanceData(model, timeline);

      setSimulatedData(response);
      setRealData(response);
      setSimulatedModelData(response.model[0]);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    fetchData(activeModel, activeTimeline);
  }, [activeModel, activeTimeline]);

  // Process chart data
  const processChartData = (data: ChartData, isPercentage: boolean) => {
    if (!data) return [];

    const initialValues = {
      spy: data.spy[0],
      voo: data.voo[0],
      model: data.model[0][0],
    };

    return data.dates.map((date, index) => ({
      date,
      SPY: isPercentage
        ? (data.spy[index] / initialValues.spy - 1) * 100
        : data.spy[index],
      VOO: isPercentage
        ? (data.voo[index] / initialValues.voo - 1) * 100
        : data.voo[index],
      Model: isPercentage
        ? (data.model[0][index] / initialValues.model - 1) * 100
        : data.model[0][index],
    }));
  };

  // Handle data editing
  const handleDataEdit = (index: number, value: string) => {
    const newData = [...simulatedModelData];
    newData[index] = Number(value);
    setSimulatedModelData(newData);

    if (simulatedData) {
      const updatedChartData = {
        ...simulatedData,
        model: [newData],
      };
      setSimulatedData(updatedChartData);
    }
  };

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const uploadedData = content
          .split(/[,\s]+/) // Split by commas or spaces
          .map((value) => parseFloat(value)) // Convert to numbers
          .filter((value) => !isNaN(value)); // Filter out invalid numbers

        const config = Object.values(TIMELINE_CONFIGS).find(
          (cfg) => cfg.expectedLength === uploadedData.length
        );

        if (config) {
          setSimulatedModelData(uploadedData);
          if (simulatedData) {
            const updatedChartData: ChartData = {
              ...simulatedData,
              model: [uploadedData],
            };
            setSimulatedData(updatedChartData);
          }
        } else {
          alert("Uploaded data must match a predefined timeline length.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Render performance chart
  const renderPerformanceChart = (
    chartData: ChartData,
    isEditable: boolean = false
  ) => {
    const processedData = processChartData(
      chartData,
      dataType === "percentage"
    );

    return (
      <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {isEditable ? "Simulated Performance" : "Real Performance"}
          </Typography>
          {isEditable && (
            <Box display="flex" gap={1}>
              <IconButton onClick={() => setEditMode(!editMode)}>
                <EditIcon />
              </IconButton>
              <FileUploadButton handleFileUpload={handleFileUpload} />
            </Box>
          )}
        </Box>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => format(new Date(tick), "MMM d")}
            />
            <YAxis
              tickFormatter={(tick) =>
                dataType === "percentage"
                  ? `${tick.toFixed(0)}%`
                  : tick.toFixed(2)
              }
            />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="Model"
              stroke="#ff7300"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="SPY"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="VOO"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        {isEditable && editMode && (
          <Box
            sx={{
              maxHeight: 200,
              overflowY: "auto", // Enable vertical scrolling
              mt: 2,
              pt: 2,
            }}
          >
            <Grid container spacing={2}>
              {simulatedModelData.map((value, index) => (
                <Grid
                  item
                  key={index}
                  xs={12} // 1 column on small screens
                  sm={6} // 2 columns on small-medium screens (optional, adjust as needed)
                  md={4} // 3 columns on medium screens
                  lg={3} // 4 columns on large screens
                >
                  <TextField
                    fullWidth
                    label={`Day ${index + 1}`}
                    type="number"
                    variant="outlined"
                    size="small"
                    value={value}
                    onChange={(e) => handleDataEdit(index, e.target.value)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <>
      <PerformanceSummary modelData={simulatedModelData} dataType={dataType} />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" gap={2} mb={2}>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel>Model</InputLabel>
                <Select
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value as string)}
                  label="Model"
                >
                  {["M15", "M16", "M17"].map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel>Timeline</InputLabel>
                <Select
                  value={activeTimeline}
                  onChange={(e) => setActiveTimeline(e.target.value as string)}
                  label="Timeline"
                >
                  {Object.entries(TIMELINE_CONFIGS).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={dataType}
                  onChange={(e) =>
                    setDataType(e.target.value as "percentage" | "absolute")
                  }
                  label="Data Type"
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="absolute">Absolute</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {simulatedData && renderPerformanceChart(simulatedData, true)}
          </Grid>

          <Grid item xs={12}>
            {realData && renderPerformanceChart(realData)}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PerformanceChart;
