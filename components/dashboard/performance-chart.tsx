"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Fullscreen,
  Download,
} from "@mui/icons-material";

import { getPerformanceData, TIMELINE_CONFIGS } from "@/utils/api";
import { ChartData } from "@/utils/types";
import FileUploadButton from "../ui/file-upload-button";
import PerformanceSummary from "./performance-summary";
import { useEquity } from "@/context/EquityContext";
import { useAdmin } from "@/context/AdminContext";
import { useTheme } from "@/context/ThemeContext";

const LINE_COLORS = {
  MODEL: "#1976d2", // Blue
  SPY: "#2e7d32", // Dark Green
  VOO: "#ffa726", // Orange
};

export function PerformanceChart() {
  const {theme } = useTheme();
  const { equityPercentage } = useEquity();
  const {isAdmin} = useAdmin();
  const [simulatedData, setSimulatedData] = useState<ChartData | null>(null);
  const [realData, setRealData] = useState<ChartData | null>(null);
  const [activeModel, setActiveModel] = useState("M15");
  const [activeTimeline, setActiveTimeline] = useState("2y");
  const [editMode, setEditMode] = useState(false);
  const [simulatedModelData, setSimulatedModelData] = useState<number[]>([]);
  const [simulatedNormalizedModelData, setSimulatedNormalizedModelData] =
    useState<number[]>([]);
  const [dataType, setDataType] = useState<"percentage" | "absolute">(
    "absolute"
  );
  const [absoluteMode, setAbsoluteMode] = useState<
    "normalized" | "unnormalized"
  >("normalized");
  const simulatedChartRef = useRef<HTMLDivElement>(null);
  const realChartRef = useRef<HTMLDivElement>(null);
  const [fullscreenChart, setFullscreenChart] = useState<
    "simulated" | "real" | null
  >(null);

  const normalize = (data: ChartData) => {
    const modelValues = data?.model ? data?.model[0] : [];
    let normalizedModel: number[] = [];
    if (data?.model) {
      // Calculate normalization only if needed
      if (dataType === "absolute" && absoluteMode === "normalized") {
        const allSpyVooValues = [...data.spy, ...data.voo];
        const minValue = Math.min(...allSpyVooValues);
        const maxValue = Math.max(...allSpyVooValues);

        normalizedModel = modelValues.map((value) => {
          return (
            ((value - Math.min(...modelValues)) /
              (Math.max(...modelValues) - Math.min(...modelValues))) *
              (maxValue - minValue) +
            minValue
          );
        });
      }
    }
    return normalizedModel;
  };

  // Fetch performance data
  const fetchData = async (model: string, timeline: string) => {
    try {
      const response = await getPerformanceData(model, timeline);

      setSimulatedData(response);
      setRealData(response);
      setSimulatedModelData(response.model[0]);
      const normalizedModelData = normalize(response);
      setSimulatedNormalizedModelData(normalizedModelData);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    fetchData(activeModel, activeTimeline);
  }, [activeModel, activeTimeline]);

  // Process chart data
  const processChartData = (data: ChartData) => {
    if (!data) return [];
    const modelValues = data?.model ? data?.model[0] : [];

    const isPercentage = dataType === "percentage";

    const normalizedModel = normalize(data);

    const processedData = data.dates.map((date, index) => ({
      date,
      SPY: isPercentage
        ? (data.spy[index] / data.spy[0] - 1) * 100
        : data.spy[index],
      VOO: isPercentage
        ? (data.voo[index] / data.voo[0] - 1) * 100
        : data.voo[index],
      Model: isPercentage
        ? (modelValues[index] / modelValues[0] - 1) * 100
        : absoluteMode === "normalized"
        ? simulatedNormalizedModelData[index]
        : modelValues[index],
    }));

    return processedData;
  };

  // Toggle fullscreen
  const toggleFullscreen = (chart: "simulated" | "real") => {
    const element =
      chart === "simulated" ? simulatedChartRef.current : realChartRef.current;

    if (element) {
      if (fullscreenChart === chart) {
        document.exitFullscreen();
        setFullscreenChart(null);
      } else {
        element.requestFullscreen();
        setFullscreenChart(chart);
      }
    }
  };

  // Download chart
  const downloadChart = (chart: "simulated" | "real") => {
    const container =
      chart === "simulated" ? simulatedChartRef.current : realChartRef.current;

    if (container) {
      const svg = container.querySelector("svg");
      if (svg) {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${chart}-chart.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
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

  const handleNormalizedDataEdit = (index: number, value: string) => {
    const newData = [...simulatedNormalizedModelData];
    newData[index] = Number(value);
    setSimulatedNormalizedModelData(newData);

    if (simulatedData) {
      const updatedChartData = {
        ...simulatedData,
        model: [newData],
      };
      setSimulatedData(updatedChartData);
    }
  };

  useEffect(() => {
    switch (absoluteMode) {
      case "normalized":
        const newNormData = [...simulatedNormalizedModelData];
        if (simulatedData) {
          const updatedChartData = {
            ...simulatedData,
            model: [newNormData],
          };
          setSimulatedData(updatedChartData);
        }
        return;
      case "unnormalized":
        const newData = [...simulatedModelData];
        if (simulatedData) {
          const updatedChartData = {
            ...simulatedData,
            model: [newData],
          };
          setSimulatedData(updatedChartData);
        }
        return;
    }
  }, [absoluteMode]);

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
    isEditable: boolean = false,
    ref: any
  ) => {
    const processedData = processChartData(chartData);

    return (
      <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
        <h1 className="mb-4 text-3xl text-center pt-2 font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    <span className="font-kigelia text-transparent text-3xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                      {theme.strings.performanceCharts}
                    </span>
        </h1>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">
            {isEditable ? "Simulated Performance" : "Real Performance"}
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton onClick={() => toggleFullscreen("simulated")}>
              <Fullscreen />
            </IconButton>
            <IconButton onClick={() => downloadChart("simulated")}>
              <Download />
            </IconButton>
            {isEditable && (
              <IconButton onClick={() => setEditMode(!editMode)}>
                <EditIcon />
              </IconButton>
            )}
            {isAdmin && (
              <FileUploadButton handleFileUpload={handleFileUpload} />
            )}
          </Box>
        </Box>

        <div ref={ref}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#666" }}
                tickFormatter={(tick) => format(new Date(tick), "MMM d")}
              />
              <YAxis
                tickFormatter={(tick) =>
                  dataType === "percentage"
                    ? `${tick.toFixed(0)}%`
                    : tick.toFixed(2)
                }
                width={80}
                tick={{ fill: "#666" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span style={{ color: "#666" }}>{value}</span>
                )}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

              {/* Animated Lines with custom styles */}
              <Line
                type="monotone"
                dataKey="Model"
                stroke={LINE_COLORS.MODEL}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="SPY"
                stroke={LINE_COLORS.SPY}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="VOO"
                stroke={LINE_COLORS.VOO}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

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
              {absoluteMode === "unnormalized" &&
                simulatedModelData.map((value, index) => (
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
              {absoluteMode === "normalized" &&
                simulatedNormalizedModelData.map((value, index) => (
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
                      onChange={(e) =>
                        handleNormalizedDataEdit(index, e.target.value)
                      }
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

              {dataType === "absolute" && (
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <InputLabel>Mode</InputLabel>
                  <Select
                    value={absoluteMode}
                    onChange={(e) =>
                      setAbsoluteMode(
                        e.target.value as "normalized" | "unnormalized"
                      )
                    }
                    label="Mode"
                  >
                    <MenuItem value="normalized">Normalized</MenuItem>
                    <MenuItem value="unnormalized">Unnormalized</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            {simulatedData &&
              renderPerformanceChart(simulatedData, true, simulatedChartRef)}
          </Grid>

          <Grid item xs={12}>
            {realData && renderPerformanceChart(realData, false, realChartRef)}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PerformanceChart;
