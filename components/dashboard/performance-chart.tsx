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
  const [hasInitializedActiveModel, setHasInitializedActiveModel] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState("2y");

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
    "percentage"
  );
  const [absoluteMode, setAbsoluteMode] = useState<
    "normalized" | "unnormalized"
  >("normalized");

  const simulatedChartRef = useRef<HTMLDivElement>(null);
  const realChartRef = useRef<HTMLDivElement>(null);
  const [fullscreenChart, setFullscreenChart] = useState<
    "simulated" | "real" | null
  >(null);

  const [dateRange, setDateRange] = useState<{from: string; to: string}>({ from: "", to: "" });
  const [filteredRealData, setFilteredRealData] = useState<ChartData | null>(null);
  const [filteredSimulatedData, setFilteredSimulatedData] = useState<ChartData | null>(null);

  const handleDateChange = (type: 'from' | 'to') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({ ...prev, [type]: e.target.value }));
  };

  const filterDataByDateRange = (data: ChartData, range: {from: string; to: string}) => {
    if (!data || !data.dates) return data;
    if (!range.from && !range.to) return data;

    // Convert dates to timestamps for comparison
    const fromDate = range.from ? new Date(range.from).getTime() : -Infinity;
    const toDate = range.to ? new Date(range.to).getTime() : Infinity;

    // Find indices that fall within the range
    const fromIndex = data.dates.findIndex(
      (d) => new Date(d).getTime() >= fromDate
    );
    const toIndexRaw = data.dates.findIndex(
      (d) => new Date(d).getTime() > toDate
    );
    const toIndex = toIndexRaw === -1 ? data.dates.length : toIndexRaw;


    // If no valid range found, return original data
    if (fromIndex === -1 || fromIndex >= data.dates.length) {
      return data;
    }

    const filtered = {
      ...data,
      dates: data.dates.slice(fromIndex, toIndex),
      spy: data.spy.slice(fromIndex, toIndex),
      voo: data.voo.slice(fromIndex, toIndex),
      model: data.model.slice(fromIndex, toIndex),
    };

    return filtered;
  };

  useEffect(() => {
    if (realData) {
      const filteredReal = filterDataByDateRange(realData, dateRange);
      setFilteredRealData(filteredReal);
    } else {
      setFilteredRealData(null);
    }
    if (simulatedData) {
      const filteredSimulated = filterDataByDateRange(simulatedData, dateRange);
      setFilteredSimulatedData(filteredSimulated);
    } else {
      setFilteredSimulatedData(null);
    }
  }, [dateRange, realData, simulatedData]);

  useEffect(() => {
    const getLiveChartModels = async () => {
      try {
        const liveModels = await getLiveModels();

        if (liveModels && liveModels.selected_modals.length > 0) {
          setLiveModels(liveModels.selected_modals);

          // Initialize activeModel from backend on first load
          if (!hasInitializedActiveModel) {
            if (liveModels.active_modal && liveModels.selected_modals.includes(liveModels.active_modal)) {
              setActiveModel(liveModels.active_modal);
            } else {
              setActiveModel(liveModels.selected_modals[0]);
            }
            setHasInitializedActiveModel(true);
          }
        } else {
          setLiveModels([]);
        }
      } catch (error) {
        console.error("Error fetching live models:", error);
      }
    };
    getLiveChartModels();
  }, []);


  // Replaces trailing un-key-in placeholder values (0 or 1, per the same
  // sentinel convention used elsewhere in this file) with the last real
  // (keyed-in) value, so the line flattens instead of dropping to zero.
  const flattenTrailingPlaceholders = (arr: number[]) => {
    if (!arr || arr.length === 0) return arr;
    let lastRealIdx = -1;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] !== 0 && arr[i] !== 1) {
        lastRealIdx = i;
        break;
      }
    }
    if (lastRealIdx === -1 || lastRealIdx === arr.length - 1) return arr;
    const lastRealValue = arr[lastRealIdx];
    return arr.map((v, i) => (i > lastRealIdx ? lastRealValue : v));
  };

  // Normalizes a series so the first meaningful (non-1, non-zero) value is used as base
  // If no meaningful base found, falls back to arr[0] (or 1 if arr[0] === 0)
  const normalizeSeries = (arr: number[], initial: number = 1, isQOINN = false) => {
    if (!arr.length) return [];
    // Prefer the first element that is not 1 and not 0 (meaningful data)
    const firstMeaningfulIdx = arr.findIndex((v) =>  v !== 1 && v !== 0);
    const first = isQOINN ? 1 : firstMeaningfulIdx !== -1 ? arr[firstMeaningfulIdx] : (arr[0] === 0 ? 1 : arr[0]);
    return arr.map((v) => v !==0 && v !== 1 ? (v / first) * initial : v);
  };

  // For legacy code compatibility
  const normalize = (data: ChartData): number[] => {
    return normalizeSeries(data?.model ? data.model : []);
  };

  // Enhanced function to calculate Y-axis domain with custom scaling
  // Returns [number, number] or ["auto","auto"] when data is missing
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

    // Determine a padding that is either a fraction of the range or a sensible minimum
    const dataRange = maxValue - minValue;
    let padding: number;
    if (dataRange <= 0) {
      // All values equal or nearly equal: provide a small absolute padding
      padding = Math.max(Math.abs(minValue) * 0.02, 0.1);
    } else {
      // Use smaller padding (5% of range) with a smaller minimum
      padding = Math.max(dataRange * 0.05, 0.05);
    }

    let scaledMin = minValue - padding;
    let scaledMax = maxValue + padding;

    // Special-case: if values are clustered between 1 and 2, expand to at least [0.8, 1.9]
    if (minValue > 1 && maxValue < 2) {
      scaledMin = Math.min(scaledMin, 0.8);
      scaledMin = Math.max(scaledMin, 0.8); // ensure not above 0.8
      scaledMax = Math.max(scaledMax, 1.9);
    }

    // For log mode ensure the min is positive
    if (dataType === "log") {
      scaledMin = Math.max(scaledMin, 1e-6);
    }

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
      // Normalize shapes: backend may return model as nested array [ [ ... ] ]
      const simModelRaw = simulatedResponse.data.model;
      const simModel = flattenTrailingPlaceholders(
        Array.isArray(simModelRaw) && Array.isArray(simModelRaw[0]) ? simModelRaw[0] : simModelRaw || []
      );
      const simNormalizedRaw = simulatedResponse.data.normalized_model;
      const simNormalized = flattenTrailingPlaceholders(
        Array.isArray(simNormalizedRaw) && Array.isArray(simNormalizedRaw[0]) ? simNormalizedRaw[0] : simNormalizedRaw
      );
      const simSpy = flattenTrailingPlaceholders(simulatedResponse.data.spy);
      const simVoo = flattenTrailingPlaceholders(simulatedResponse.data.voo);

      // Process simulated data
      setSimulatedData({ ...simulatedResponse.data, model: simModel, normalized_model: simNormalized, spy: simSpy, voo: simVoo });
      setSimulatedModelData(simModel);
      setSimulatedNormalizedModelData(simNormalized || normalize({ ...simulatedResponse.data, model: simModel }));

      // Normalize shapes for real data as well
      const realModelRaw = realResponse.data.model;
      const realModel = flattenTrailingPlaceholders(
        Array.isArray(realModelRaw) && Array.isArray(realModelRaw[0]) ? realModelRaw[0] : realModelRaw || []
      );
      const realNormalizedRaw = realResponse.data.normalized_model;
      const realNormalized = flattenTrailingPlaceholders(
        Array.isArray(realNormalizedRaw) && Array.isArray(realNormalizedRaw[0]) ? realNormalizedRaw[0] : realNormalizedRaw
      );
      const realSpy = flattenTrailingPlaceholders(realResponse.data.spy);
      const realVoo = flattenTrailingPlaceholders(realResponse.data.voo);

      // Process real data
      setRealData({ ...realResponse.data, model: realModel, normalized_model: realNormalized, spy: realSpy, voo: realVoo });
      setRealModelData(realModel);
      setRealNormalizedModelData(realNormalized || normalize({ ...realResponse.data, model: realModel }));
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
    const modelValues = data?.model || [];
    const isPercentage = dataType === "percentage";
    const isLog = dataType === "log";

    // For log mode, normalize all series to start from 10, then apply natural log
    const COMPARISON_START_DATE = new Date('2024-10-10');
    
    // Set both SPY and VOO to 1 before the model data starts (2024/10/10)
    let spyArr = chartType === 'real'
      ? data.spy.map((value, i) => new Date(data.dates[i]) < COMPARISON_START_DATE ? 1 : value)
      : data.spy;
    let vooArr = chartType === 'real'
      ? data.voo.map((value, i) => new Date(data.dates[i]) < COMPARISON_START_DATE ? 1 : value)
      : data.voo;
    let modelArr = modelValues;
    // Normalize/transform the already-modified arrays (so pre-2024/10/10 replacements persist)
    if (dataType === "absolute" && absoluteMode === "normalized") {
      spyArr = normalizeSeries(spyArr);
      vooArr = normalizeSeries(vooArr);
      modelArr = normalizeSeries(modelArr, 1 , true);
    } else if (isLog) {
      spyArr = normalizeSeries(spyArr, 10);
      vooArr = normalizeSeries(vooArr, 10);
      modelArr = normalizeSeries(modelArr, 10);
    }

    // Determine first-non-one index to use as baseline for percentage calculations
    let baseIndex = modelArr.findIndex((v) => isFinite(v) && v !== 1 && v !== 0);
    if (baseIndex === -1) baseIndex = spyArr.findIndex((v) => isFinite(v) && v !== 1 && v !== 0);
    if (baseIndex === -1) baseIndex = vooArr.findIndex((v) => isFinite(v) && v !== 1 && v !== 0);
    if (baseIndex === -1) baseIndex = 0;

    const processedData = data.dates.map((date, index) => {
      const currentDate = new Date(date);
      // Use the comparison start date defined earlier (COMPARISON_START_DATE)
      const vooValue = currentDate < COMPARISON_START_DATE ? 1 : vooArr[index];
      // compute baseline values for percentage mode using baseIndex
      const spyBase = spyArr[baseIndex] ?? spyArr[0] ?? 1;
      const vooBase = vooArr[baseIndex] ?? vooArr[0] ?? 1;
      const modelBase = modelArr[baseIndex] ?? modelArr[0] ?? 1;

      return {
        date,
        SPY: isPercentage
          ? spyArr[index] !==0 && spyArr[index] !== 1 ? (spyArr[index] / spyBase - 1) * 100 :  0
          : isLog
          ? Math.log(spyArr[index] > 0 ? spyArr[index] : 1e-6)
          : dataType === "absolute" && absoluteMode === "normalized"
          ? spyArr[index]
          : spyArr[index],
        VOO: isPercentage
          ? vooArr[index] !== 0 && vooArr[index] !== 1 ? (vooArr[index] / vooBase - 1) * 100 : 0
          : isLog
          ? Math.log(vooValue > 0 ? vooValue : 1e-6)
          : dataType === "absolute" && absoluteMode === "normalized"
          ? vooArr[index]
          : vooArr[index],
        Model: isPercentage
          ? modelArr[index] !==0 && modelArr[index] !== 1 ? (modelArr[index] / modelBase - 1) * 100 : 0
          : isLog
          ? Math.log(modelArr[index] > 0 ? modelArr[index] : 1e-6)
          : dataType === "absolute" && absoluteMode === "normalized"
          ? modelArr[index]
          : modelValues[index],
      };
    });

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

  // Keep normalized simulated data in sync whenever absolute simulatedModelData changes
  useEffect(() => {
    if (simulatedModelData && simulatedModelData.length > 0) {
      const normalized = normalizeSeries(simulatedModelData);
      setSimulatedNormalizedModelData(normalized);
      // also reflect in simulatedData.model if needed
      if (simulatedData) {
        setSimulatedData({ ...simulatedData, model: simulatedModelData });
      }
    }
  }, [simulatedModelData]);

  // Keep normalized real data in sync whenever realModelData changes
  useEffect(() => {
    if (realModelData && realModelData.length > 0) {
      const normalized = normalizeSeries(realModelData);
      setRealNormalizedModelData(normalized);
      if (realData) {
        setRealData({ ...realData, model: realModelData });
      }
    }
  }, [realModelData]);

  useEffect(() => {
    const updateChartData = (chartType: "simulated" | "real") => {
      switch (absoluteMode) {
        case "normalized":
          if (chartType === "simulated") {
            const newNormData = [...simulatedNormalizedModelData];
            if (simulatedData) {
              const updatedChartData = {
                ...simulatedData,
                model: newNormData,
              };
              setSimulatedData(updatedChartData);
            }
          } else {
            const newNormData = [...realNormalizedModelData];
            if (realData) {
              const updatedChartData = {
                ...realData,
                model: newNormData,
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
                model: newData,
              };
              setSimulatedData(updatedChartData);
            }
          } else {
            const newData = [...realModelData];
            if (realData) {
              const updatedChartData = {
                ...realData,
                model: newData,
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

  // Version counter to force chart re-mount and trigger animations on key changes
  const [chartVersion, setChartVersion] = useState(0);

  // we intentionally removed shared log domain so each chart computes its own domain

  // bump chartVersion to trigger re-mount (and therefore animations) when important controls change
  useEffect(() => {
    setChartVersion((v) => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModel, activeTimeline, dataType, absoluteMode, dateRange]);

  // Also force remount when new fetched data arrives
  useEffect(() => {
    setChartVersion((v) => v + 1);
  }, [simulatedData, realData]);

  // Render function modified to handle both charts with enhanced Y-axis
  const renderPerformanceChart = (
    chartData: ChartData,
    chartType: "simulated" | "real",
    ref: React.RefObject<HTMLDivElement>,
    theme: any
  ) => {
    const processedData = processChartData(chartData, chartType);
    const isSimulated = chartType === "simulated";
    // Always calculate per-chart Y axis domain so simulated and real charts can differ
    const yAxisDomain = calculateYAxisDomain(processedData);

    // decide if Y-axis numbers are large (more than two digits) so we can move the label
    let labelPositionProps: any = {};
    let yAxisWidth = 100;
    if (Array.isArray(yAxisDomain) && typeof yAxisDomain[0] === 'number' && typeof yAxisDomain[1] === 'number') {
      const maxAbs = Math.max(Math.abs(yAxisDomain[0]), Math.abs(yAxisDomain[1]));
      const isLarge = maxAbs >= 1000; // three or more digits (>=100)
      if (isLarge) {
        // place label at top of Y axis line, nudge right (dx) and add top padding (dy)
        labelPositionProps = {
          position: 'top',
          angle: 0,
          offset: 0,
          dx: 58, // translate right so label centers above axis line
          dy: 5, // push down a bit so it has top padding and isn't clipped
        };
        yAxisWidth = 80; // reduce left width since label sits on top
      } else {
        // default: outside left
        labelPositionProps = {
          position: 'outsideLeft',
          angle: -90,
          offset: 18,
          dx: -20
        };
        yAxisWidth = 90;
      }
    } else {
      // fallback
      labelPositionProps = { position: 'outsideLeft', angle: -90, offset: 18 };
      yAxisWidth = 100;
    }

    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          pl: 0, // reduce left padding to reclaim horizontal space
          ml: 0,
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
          <h1 className="text-center font-extrabold text-gray-900 dark:text-white text-3xl md:text-5xl lg:text-6xl w-full">
            <span className="font-kigelia text-transparent text-[34px] bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              {isSimulated
                ? theme.strings.simulatedPerformance
                : theme.strings.realPerformance}
            </span>
          </h1>


        </Box>

        <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
          <Box display="flex" gap={1}>
            <IconButton onClick={() => toggleFullscreen(chartType)}>
              <Fullscreen />
            </IconButton>
            <IconButton onClick={() => downloadChart(chartType)}>
              <Download />
            </IconButton>
          </Box>
        </Box>

        <div ref={ref}>
          <ResponsiveContainer width="100%" height={600}>
            <LineChart key={`chart-${chartVersion}`} data={processedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                width={yAxisWidth}
                height={120}
                tick={{ fill: "#666", fontSize: 12 }}
                tickCount={8}
                allowDataOverflow={dataType === "log"}
                domain={yAxisDomain}
                label={{ 
                  value: `Value (${dataType === "log" ? "Natural Log" : dataType === "percentage" ? "Percentage" : absoluteMode === "normalized" ? "Normalized" : "Absolute"})`,
                  // spread computed label position props
                  ...labelPositionProps,
                  style: { 
                    fill: '#333',
                    fontSize: 18,
                    fontWeight: 700,
                    textAnchor: 'middle'
                  }
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (dataType === "percentage") {
                    return [`${value.toFixed(2)}%`, name];
                  }
                  return [value, name];
                }}
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
                animationDuration={900}
                animationEasing="ease-out"
                isAnimationActive={true}
                animationBegin={100}
              />
              <Line
                type="monotone"
                dataKey="SPY"
                stroke={LINE_COLORS.SPY}
                strokeWidth={2}
                dot={false}
                animationDuration={900}
                animationEasing="ease-out"
                isAnimationActive={true}
                animationBegin={150}
              />
              <Line
                type="monotone"
                dataKey="VOO"
                stroke={LINE_COLORS.VOO}
                strokeWidth={2}
                dot={false}
                animationDuration={900}
                animationEasing="ease-out"
                isAnimationActive={true}
                animationBegin={200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    );
  };

  return (
    <>
  <PerformanceSummary modelData={realModelData} dataType={dataType === "log" ? "absolute" : dataType} />
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

              {/* Date Range Selector */}
              <Box
                display="flex"
                gap={1}
                sx={{
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  minWidth: { xs: '100%', sm: 'auto' },
                  flexGrow: 1,
                }}
              >
                <TextField
                  type="date"
                  label="From Date"
                  value={dateRange.from}
                  onChange={handleDateChange('from')}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    minWidth: { xs: '100%', sm: 160 },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }
                  }}
                  inputProps={{
                    max: dateRange.to || new Date().toISOString().split("T")[0],
                  }}
                />
                <TextField
                  type="date"
                  label="To Date"
                  value={dateRange.to}
                  onChange={handleDateChange('to')}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    minWidth: { xs: '100%', sm: 160 },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }
                  }}
                  inputProps={{
                    min: dateRange.from,
                    max: new Date().toISOString().split("T")[0],
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDateRange({ from: '', to: '' })}
                  sx={{
                    height: 40,
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Reset Dates
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {filteredRealData &&
              renderPerformanceChart(filteredRealData, "real", realChartRef, theme)}
          </Grid>
          <Grid item xs={12}>
            {filteredSimulatedData &&
              renderPerformanceChart(
                filteredSimulatedData,
                "simulated",
                simulatedChartRef,
                theme
              )}
          </Grid>
        </Grid>
      </Box>
      <PerformanceTable />
    </>
  );
};

export default PerformanceChart;
