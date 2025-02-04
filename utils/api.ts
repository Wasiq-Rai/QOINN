import axios from "axios";
import {
  AIInsightsProps,
  ApiResponse,
  ChartData,
  IndicatorData,
  indicators,
  Insight,
  LoginResponse,
  PerformanceData,
  Portfolio,
  PortfolioSummary,
  RegisterResponse,
  Stock,
  StockData,
  TickerData,
} from "./types";
const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {}; // Ensure headers exist
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const getStocks = async (symbols: string[]): Promise<ApiResponse> => {
  const allSymbols = [
    ...indicators.map(i => i.symbol),
    ...symbols.filter(s => !indicators.find(i => i.symbol === s))
  ];
  
  const symbolParams = allSymbols.map(s => `symbol=${encodeURIComponent(s)}`).join('&');
  const response = await api.get<ApiResponse>(
    `/stocks/fetch_current_value/?${symbolParams}`
  );
  return response.data;
};

export const getPortfolio = async (): Promise<Portfolio> => {
  const response = await api.get<Portfolio[]>("/portfolios/");
  return response.data[0]; // Assuming user has only one portfolio
};

export const addStockToPortfolio = async (
  portfolioId: number,
  stockId: number,
  quantity: number,
  purchasePrice: number
): Promise<Stock> => {
  const response = await api.post<Stock>(
    `/portfolios/${portfolioId}/add_stock/`,
    {
      stock_id: stockId,
      quantity,
      purchase_price: purchasePrice,
    }
  );
  return response.data;
};

export const getPerformanceData = async (
  model: string,
  timeframe: string
): Promise<ChartData> => {
  const response = await api.get<ChartData>(
    `/performance/chart_data/?model=${model}&timeframe=${timeframe}`
  );
  return response.data;
};

export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
  const response = await api.get<PortfolioSummary>("/portfolios/summary/");
  return response.data || null;
};

export const fetchStockData = async (symbol: string): Promise<StockData> => {
  const response = await api.get<TickerData>(
    `/indicators/fetch_current_value/?symbol=${symbol}`
  );
  if (!response) {
    throw new Error(`Failed to fetch data for ${symbol}`);
  }
  return {
    symbol,
    name: "", // You can fetch the name separately if needed
    price: response.data.close,
    changePercent: response.data.changePercent || 0, // Default to 0 if not provided
  };
};

export const fetchIndicatorData = async (
  symbol: string
): Promise<IndicatorData> => {
  const response = await api.get<TickerData>(
    `/indicators/fetch_current_value/?symbol=${symbol}`
  );
  if (!response) {
    throw new Error(`Failed to fetch data for ${symbol}`);
  }
  return {
    symbol,
    name: "", // You can fetch the name separately if needed
    price: response.data.close,
    changePercent: response.data.changePercent || 0, // Default to 0 if not provided
  };
};

export const getAIInsights = async (): Promise<Insight[]> => {
  const response = await api.get<Insight[]>("/ai-insights/");
  return response.data || null;
};

export const getUserPremiumStatus = async () => {
  const response = await api.get<any>("/user-profiles/premium_status/");
  return response.data.is_premium;
};

export const TIMELINE_CONFIGS = {
  "2w": { period: "2w", label: "2 Weeks", expectedLength: 10 },
  "1m": { period: "1mo", label: "1 Month", expectedLength: 21 },
  "3m": { period: "3mo", label: "3 Months", expectedLength: 63 },
  "6m": { period: "6mo", label: "6 Months", expectedLength: 126 },
  "1y": { period: "1y", label: "1 Year", expectedLength: 252 },
  "2y": { period: "2y", label: "2 Years", expectedLength: 510 },
};

export default api;
