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

import {
  getLiveModels,
  getPerformanceData,
  saveModelData,
  TIMELINE_CONFIGS,
} from "@/utils/api";
import { ChartData } from "@/utils/types";
import FileUploadButton from "../ui/file-upload-button";
import PerformanceSummary from "./performance-summary";
import { useAdmin } from "@/context/AdminContext";
import { useTheme } from "@/context/ThemeContext";
import PerformanceTable from "./PerformanceTable";

const LINE_COLORS = {
  MODEL: "#1976d2", // Blue
  SPY: "#2e7d32", // Dark Green
  VOO: "#ffa726", // Orange
};

// Enhanced TIMELINE_CONFIGS with 5-year option
const ENHANCED_TIMELINE_CONFIGS = {
  ...TIMELINE_CONFIGS,
  "5y": {
    label: "5 Years",
    expectedLength: 1260, // Approximate days in 5 years (365 * 5)
  },
  ...TIMELINE_CONFIGS,
  "6y": {
    label: "6 Years",
    expectedLength: 1512, // Approximate days in 5 years (365 * 5)
  },
};

const PerformanceChart = () => {
  const { isAdmin } = useAdmin();
  const { theme } = useTheme();
  // Separate state for each chart
  const [simulatedData, setSimulatedData] = useState<ChartData | null>(null);
  const [realData, setRealData] = useState<ChartData | null>(null);

  const [liveModels, setLiveModels] = useState([]);
  const [activeModel, setActiveModel] = useState<string>(
    liveModels[0] || "M21"
  );
  const [activeTimeline, setActiveTimeline] = useState("2y");

  // Separate edit modes
  const [simulatedEditMode, setSimulatedEditMode] = useState(false);
  const [realEditMode, setRealEditMode] = useState(false);

  // Separate model data for each chart
  const [simulatedModelData, setSimulatedModelData] = useState<number[]>([]);
  const [realModelData, setRealModelData] = useState<number[]>([]);

  // Separate normalized data for each chart
  const [simulatedNormalizedModelData, setSimulatedNormalizedModelData] =
    useState<number[]>([]);
  const [realNormalizedModelData, setRealNormalizedModelData] = useState<
    number[]
  >([]);

  const [dataType, setDataType] = useState<"log" | "percentage" | "absolute">(
    "log"
  );
  const [absoluteMode, setAbsoluteMode] = useState<
    "normalized" | "unnormalized"
  >("normalized");

  const simulatedChartRef = useRef<HTMLDivElement>(null);
  const realChartRef = useRef<HTMLDivElement>(null);
  const [fullscreenChart, setFullscreenChart] = useState<
    "simulated" | "real" | null
  >(null);

  const [startDate, setStartDate] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ChartData | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const filterDataFromDate = (data: ChartData, date: string) => {
    if (!date || !data) return data;

    const dateIndex = data.dates.findIndex((d) => d === date);
    if (dateIndex === -1) return data;

    return {
      ...data,
      dates: data.dates.slice(dateIndex),
      spy: data.spy.slice(dateIndex),
      voo: data.voo.slice(dateIndex),
      model: [data.model[0].slice(dateIndex)],
    };
  };

  useEffect(() => {
    if (realData && startDate) {
      setFilteredData(filterDataFromDate(realData, startDate));
    } else {
      setFilteredData(realData);
    }
  }, [startDate, realData]);

  useEffect(() => {
    const getLiveChartModels = async () => {
      try {
        const liveModels = await getLiveModels();
        if (liveModels && liveModels.selected_modals.length > 0) {
          setLiveModels(liveModels.selected_modals);
        } else {
          setLiveModels([]);
        }
      } catch (error) {
        console.error("Error fetching live models:", error);
      }
    };
    getLiveChartModels();
  }, []);


  // Normalizes a series so the first value is 1 (default) or a custom value
  const normalizeSeries = (arr: number[], initial: number = 1) => {
    if (!arr.length) return [];
    const first = arr[0] === 0 ? 1 : arr[0];
    return arr.map((v) => (v / first) * initial);
  };

  // For legacy code compatibility
  const normalize = (data: ChartData): number[] => {
    return normalizeSeries(data?.model ? data.model[0] : []);
  };

  // Enhanced function to calculate Y-axis domain with custom scaling
  // Always returns [number, number] for log mode shared domain
  const calculateYAxisDomain = (data: any[]): [number, number] | ["auto", "auto"] => {
    if (!data || data.length === 0) return ["auto", "auto"];

    const allValues: number[] = [];
    data.forEach((item) => {
      if (typeof item.SPY === "number" && isFinite(item.SPY)) allValues.push(item.SPY);
      if (typeof item.VOO === "number" && isFinite(item.VOO)) allValues.push(item.VOO);
      if (typeof item.Model === "number" && isFinite(item.Model)) allValues.push(item.Model);
    });

    // For log mode, filter out non-positive values
    const positiveValues = allValues.filter((v) => v > 0);
    if (allValues.length === 0 || positiveValues.length === 0) return [1e-6, 1];

    const minValue = Math.min(...positiveValues);
    const maxValue = Math.max(...positiveValues);

    // For log mode, set min to a small positive value if needed
    const scaledMin = minValue * 0.95 > 0 ? minValue * 0.95 : 1e-6;
    const scaledMax = maxValue * 1.05;

    return [scaledMin, scaledMax];
  };

  // Fetch performance data
  const fetchData = async (model: string, timeline: string) => {
    try {
      // Fetch both simulated and real data
      const [simulatedResponse, realResponse] = await getPerformanceData(
        model,
        timeline
      );

      // Process simulated data
      setSimulatedData(simulatedResponse.data);
      setSimulatedModelData(simulatedResponse.data.model[0]);
      setSimulatedNormalizedModelData(
        simulatedResponse.data.normalized_model?.[0] ||
          normalize(simulatedResponse.data)
      );

      // Process real data
      setRealData(realResponse.data);
      setRealModelData(realResponse.data.model[0]);
      setRealNormalizedModelData(
        realResponse.data.normalized_model?.[0] || normalize(realResponse.data)
      );
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    fetchData(activeModel, activeTimeline);
  }, [activeModel, activeTimeline]);

  // Process chart data
  const processChartData = (
    data: ChartData,
    chartType: "simulated" | "real"
  ) => {
    if (!data) return [];
    const modelValues = data?.model ? data?.model[0] : [];
    const isPercentage = dataType === "percentage";
    const isLog = dataType === "log";

    // For log mode, normalize all series to start from 10, then apply log10
    let spyArr = data.spy;
    let vooArr = data.voo;
    let modelArr = modelValues;
    if (dataType === "absolute" && absoluteMode === "normalized") {
      spyArr = normalizeSeries(data.spy);
      vooArr = normalizeSeries(data.voo);
      modelArr = normalizeSeries(modelValues);
    } else if (isLog) {
      spyArr = normalizeSeries(data.spy, 10);
      vooArr = normalizeSeries(data.voo, 10);
      modelArr = normalizeSeries(modelValues, 10);
    }

    const processedData = data.dates.map((date, index) => ({
      date,
      SPY: isPercentage
        ? (data.spy[index] / data.spy[0] - 1) * 100
        : isLog
        ? Math.log10(spyArr[index] > 0 ? spyArr[index] : 1e-6)
        : dataType === "absolute" && absoluteMode === "normalized"
        ? spyArr[index]
        : data.spy[index],
      VOO: isPercentage
        ? (data.voo[index] / data.voo[0] - 1) * 100
        : isLog
        ? Math.log10(vooArr[index] > 0 ? vooArr[index] : 1e-6)
        : dataType === "absolute" && absoluteMode === "normalized"
        ? vooArr[index]
        : data.voo[index],
      Model: isPercentage
        ? (modelValues[index] / modelValues[0] - 1) * 100
        : isLog
        ? Math.log10(modelArr[index] > 0 ? modelArr[index] : 1e-6)
        : dataType === "absolute" && absoluteMode === "normalized"
        ? modelArr[index]
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

  const saveDataToBackend = async (
    chartType: "simulated" | "real",
    dates: string[],
    values: number[],
    normalizedValues: number[]
  ) => {
    if (!isAdmin) return;

    try {
      const response = await saveModelData(
        activeModel,
        activeTimeline,
        dates,
        values,
        normalizedValues,
        chartType === "simulated"
      );
    } catch (error) {
      console.error("Failed to save model data:", error);
    }
  };

  // Update both simulated handlers
  const handleSimulatedDataEdit = async (index: number, value: string) => {
    const newData = [...simulatedModelData];
    newData[index] = Number(value);
    setSimulatedModelData(newData);

    if (simulatedData) {
      const updatedChartData = {
        ...simulatedData,
        model: [newData],
      };
      setSimulatedData(updatedChartData);
      await saveDataToBackend(
        "simulated",
        simulatedData.dates,
        newData,
        simulatedNormalizedModelData
      );
    }
  };

  const handleSimulatedNormalizedDataEdit = async (
    index: number,
    value: string
  ) => {
    const newData = [...simulatedNormalizedModelData];
    newData[index] = Number(value);
    setSimulatedNormalizedModelData(newData);

    if (simulatedData) {
      const updatedChartData = {
        ...simulatedData,
        model: [newData],
      };
      setSimulatedData(updatedChartData);
      await saveDataToBackend(
        "simulated",
        simulatedData.dates,
        simulatedModelData,
        newData
      );
    }
  };

  // Update both real handlers similarly
  const handleRealDataEdit = async (index: number, value: string) => {
    const newData = [...realModelData];
    newData[index] = Number(value);
    setRealModelData(newData);

    if (realData) {
      const updatedChartData = {
        ...realData,
        model: [newData],
      };
      setRealData(updatedChartData);
      await saveDataToBackend(
        "real",
        realData.dates,
        newData,
        realNormalizedModelData
      );
    }
  };

  const handleRealNormalizedDataEdit = async (index: number, value: string) => {
    const newData = [...realNormalizedModelData];
    newData[index] = Number(value);
    setRealNormalizedModelData(newData);

    if (realData) {
      const updatedChartData = {
        ...realData,
        model: [newData],
      };
      setRealData(updatedChartData);
      await saveDataToBackend("real", realData.dates, realModelData, newData);
    }
  };

  const parseUploadedFile = (content: string): number[] => {
    // Remove all whitespace and brackets
    let cleaned = content.replace(/[\[\]]/g, "").trim();

    // Split by any whitespace or comma
    const values = cleaned.split(/[\s,]+/).filter((val) => val.trim() !== "");

    // Convert to numbers and filter out invalid entries
    return values.map((val) => parseFloat(val)).filter((val) => !isNaN(val));
  };

  const handleSimulatedFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const uploadedData = parseUploadedFile(content);

      const config = Object.values(ENHANCED_TIMELINE_CONFIGS).find(
        (cfg) => cfg.expectedLength === uploadedData.length
      );

      if (!config) {
        alert("Uploaded data must match a predefined timeline length.");
        return;
      }

      // Update local state
      setSimulatedModelData(uploadedData);

      if (simulatedData) {
        const updatedChartData = {
          ...simulatedData,
          model: [uploadedData],
        };
        setSimulatedData(updatedChartData);

        // Save to backend
        if (isAdmin) {
          await saveDataToBackend(
            "simulated",
            simulatedData.dates,
            uploadedData,
            normalize({ ...simulatedData, model: [uploadedData] })
          );
        }
      }
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      alert("Error processing file. Please check the format.");
    } finally {
      // Reset the input to allow re-uploading the same file
      event.target.value = "";
    }
  };

  // Create similar handler for real data upload
  const handleRealFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const uploadedData = parseUploadedFile(content);

      const config = Object.values(ENHANCED_TIMELINE_CONFIGS).find(
        (cfg) => cfg.expectedLength === uploadedData.length
      );

      if (!config) {
        alert("Uploaded data must match a predefined timeline length.");
        return;
      }

      // Update local state
      setRealModelData(uploadedData);

      if (realData) {
        const updatedChartData = {
          ...realData,
          model: [uploadedData],
        };
        setRealData(updatedChartData);

        // Save to backend
        if (isAdmin) {
          await saveDataToBackend(
            "real",
            realData.dates,
            uploadedData,
            normalize({ ...realData, model: [uploadedData] })
          );
        }
      }
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      alert("Error processing file. Please check the format.");
    } finally {
      // Reset the input to allow re-uploading the same file
      event.target.value = "";
    }
  };

  useEffect(() => {
    const updateChartData = (chartType: "simulated" | "real") => {
      switch (absoluteMode) {
        case "normalized":
          if (chartType === "simulated") {
            const newNormData = [...simulatedNormalizedModelData];
            if (simulatedData) {
              const updatedChartData = {
                ...simulatedData,
                model: [newNormData],
              };
              setSimulatedData(updatedChartData);
            }
          } else {
            const newNormData = [...realNormalizedModelData];
            if (realData) {
              const updatedChartData = {
                ...realData,
                model: [newNormData],
              };
              setRealData(updatedChartData);
            }
          }
          break;
        case "unnormalized":
          if (chartType === "simulated") {
            const newData = [...simulatedModelData];
            if (simulatedData) {
              const updatedChartData = {
                ...simulatedData,
                model: [newData],
              };
              setSimulatedData(updatedChartData);
            }
          } else {
            const newData = [...realModelData];
            if (realData) {
              const updatedChartData = {
                ...realData,
                model: [newData],
              };
              setRealData(updatedChartData);
            }
          }
          break;
      }
    };

    // Update both charts when absoluteMode changes
    updateChartData("simulated");
    updateChartData("real");
  }, [absoluteMode]);

  // Shared Y-axis domain for log mode
  const [sharedLogDomain, setSharedLogDomain] = useState<[number, number]>([1e-6, 1]);

  useEffect(() => {
    if (dataType === "log" && simulatedData && filteredData) {
      const simProcessed = processChartData(simulatedData, "simulated");
      const realProcessed = processChartData(filteredData, "real");
      const all = [...simProcessed, ...realProcessed];
      const domain = calculateYAxisDomain(all);
      if (Array.isArray(domain) && typeof domain[0] === 'number' && typeof domain[1] === 'number') {
        setSharedLogDomain(domain as [number, number]);
      } else {
        setSharedLogDomain([1e-6, 1]);
      }
    }
  }, [dataType, simulatedData, filteredData]);

  // Render function modified to handle both charts with enhanced Y-axis
  const renderPerformanceChart = (
    chartData: ChartData,
    chartType: "simulated" | "real",
    ref: React.RefObject<HTMLDivElement>,
    theme: any
  ) => {
    const processedData = processChartData(chartData, chartType);
    const isSimulated = chartType === "simulated";
    // Use shared domain for log mode, otherwise calculate per chart
    const yAxisDomain = dataType === "log" ? sharedLogDomain : calculateYAxisDomain(processedData);

    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent={`${isSimulated ? "center" : "space-between"}`}
          // flexWrap="wrap"
          gap={2}
        >
          {!isSimulated && <div className="w-full"></div>}
          <h1 className="text-center font-extrabold text-gray-900 dark:text-white text-3xl md:text-5xl lg:text-6xl w-full">
            <span className="font-kigelia text-transparent text-[34px] bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              {isSimulated
                ? theme.strings.simulatedPerformance
                : theme.strings.realPerformance}
            </span>
          </h1>

          {!isSimulated && (
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={1.5}
              sx={{
                background: "rgba(255,255,255,0.4)",
                borderRadius: 3,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                p: 1.5,
                width: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.8)",
                  fontSize: "1rem",
                  whiteSpace: { xs: "normal", sm: "nowrap" }, // Allow wrapping on mobile
                }}
              >
                View From:
              </Typography>

              <TextField
                type="date"
                value={startDate}
                onChange={handleDateChange}
                size="small"
                sx={{
                  flex: { xs: "1 1 auto", sm: "unset" },
                  width: { xs: "100%", sm: "auto" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(4px)",
                    "& fieldset": {
                      borderColor: "rgba(0,0,0,0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0,0,0,0.3)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 1.2,
                    px: 1.5,
                    fontSize: "0.9rem",
                    color: "rgba(0,0,0,0.9)",
                  },
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
              />

              <Button
                variant="outlined"
                size="small"
                onClick={() => setStartDate("")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  borderColor: "rgba(0,0,0,0.15)",
                  color: "rgba(0,0,0,0.8)",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(2px)",
                  width: { xs: "100%", sm: "auto" }, // Full width on mobile
                  "&:hover": {
                    borderColor: "rgba(0,0,0,0.3)",
                    backgroundColor: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          )}
        </Box>

        <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
          <Box display="flex" gap={1}>
            <IconButton onClick={() => toggleFullscreen(chartType)}>
              <Fullscreen />
            </IconButton>
            <IconButton onClick={() => downloadChart(chartType)}>
              <Download />
            </IconButton>
            {isAdmin && (
              <IconButton
                onClick={() =>
                  isSimulated
                    ? setSimulatedEditMode(!simulatedEditMode)
                    : setRealEditMode(!realEditMode)
                }
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <div ref={ref}>
          <ResponsiveContainer width="100%" height={600}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#666" }}
                tickFormatter={(tick) => format(new Date(tick), "MMM d")}
              />
              {/* Enhanced Y-axis with larger width and custom domain */}
              <YAxis
                scale={dataType === "log" ? "log" : "linear"}
                tickFormatter={(tick) =>
                  dataType === "percentage"
                    ? `${tick.toFixed(0)}%`
                    : tick.toFixed(2)
                }
                width={80}
                height={120}
                tick={{ fill: "#666", fontSize: 12 }}
                tickCount={200}
                allowDataOverflow={dataType === "log"}
                domain={yAxisDomain}
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
                wrapperStyle={{ paddingTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                iconSize={24}
                align={"center"}
                formatter={(value) => (
                  <span style={{
                    color: "#666",
                    fontSize: "22px",
                    display: 'flex',
                    alignItems: 'center',
                    height: 24,
                    gap: 8,
                  }}>
                    {value}
                  </span>
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

        {(isSimulated ? simulatedEditMode : realEditMode) && (
          <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 2, pt: 2 }}>
            <Grid container spacing={2}>
              {absoluteMode === "unnormalized" &&
                (isSimulated ? simulatedModelData : realModelData).map(
                  (value, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                      <TextField
                        fullWidth
                        label={`Day ${index + 1}`}
                        type="number"
                        variant="outlined"
                        size="small"
                        value={value}
                        onChange={(e) =>
                          isSimulated
                            ? handleSimulatedDataEdit(index, e.target.value)
                            : handleRealDataEdit(index, e.target.value)
                        }
                      />
                    </Grid>
                  )
                )}
              {absoluteMode === "normalized" &&
                (isSimulated
                  ? simulatedNormalizedModelData
                  : realNormalizedModelData
                ).map((value, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <TextField
                      fullWidth
                      label={`Day ${index + 1}`}
                      type="number"
                      variant="outlined"
                      size="small"
                      value={value}
                      onChange={(e) =>
                        isSimulated
                          ? handleSimulatedNormalizedDataEdit(
                              index,
                              e.target.value
                            )
                          : handleRealNormalizedDataEdit(index, e.target.value)
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
  <PerformanceSummary modelData={simulatedModelData} dataType={dataType === "log" ? "absolute" : dataType} />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              mb={2}
              sx={{
                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
              }}
            >
              {/* Model Selector */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: { xs: "100%", sm: 120 } }}
              >
                <InputLabel>Model</InputLabel>
                <Select
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value as string)}
                  label="Model"
                >
                  {liveModels?.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Timeline Selector */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: { xs: "100%", sm: 120 } }}
              >
                <InputLabel>Timeline</InputLabel>
                <Select
                  value={activeTimeline}
                  onChange={(e) => setActiveTimeline(e.target.value as string)}
                  label="Timeline"
                >
                  {Object.entries(ENHANCED_TIMELINE_CONFIGS).map(
                    ([key, config]) => (
                      <MenuItem key={key} value={key}>
                        {config.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* Data Type Selector */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: { xs: "100%", sm: 120 } }}
              >
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={dataType}
                  onChange={(e) =>
                    setDataType(e.target.value as "log" | "percentage" | "absolute")
                  }
                  label="Data Type"
                >
                  <MenuItem value="log">Log (Normalized)</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="absolute">Absolute</MenuItem>
                </Select>
              </FormControl>

              {/* Mode Selector (Only for Absolute) */}
              {dataType === "absolute" && (
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: { xs: "100%", sm: 120 } }}
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
              renderPerformanceChart(
                simulatedData,
                "simulated",
                simulatedChartRef,
                theme
              )}
          </Grid>
          <Grid item xs={12}>
            {filteredData &&
              renderPerformanceChart(filteredData, "real", realChartRef, theme)}
          </Grid>
        </Grid>
      </Box>
      <PerformanceTable />
    </>
  );
};

export default PerformanceChart;
