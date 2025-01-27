import axios from 'axios';
import { AIInsightsProps, ApiResponse, ChartData, Insight, LoginResponse, PerformanceData, Portfolio, PortfolioSummary, RegisterResponse, Stock, TickerData } from './types';
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {}; // Ensure headers exist
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


export const login = async (username: string, password: string) => {
    const response = await api.post<LoginResponse>('/token/', { username, password });
    localStorage.setItem('token', response.data.access);
    return response.data;
  };
  
  export const register = async (username: string, email: string, password: string) => {
    const response = await api.post<RegisterResponse>('/register/', { username, email, password });
    return response.data;
  };
  
  export const forgotPassword = async (email: string) => {
    const response = await api.post('/password-reset/', { email });
    return response.data;
  };
  
  export const resetPassword = async (token: string, password: string) => {
    const response = await api.post('/password-reset/confirm/', { token, password });
    return response.data;
  };  
  
  export const getStocks = async (): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>('/stocks/fetch_current_value/?symbol=AAPL&symbol=GOOGL&symbol=TSLA');
    return response.data;
  };
  
  export const getPortfolio = async (): Promise<Portfolio> => {
    const response = await api.get<Portfolio[]>('/portfolios/');
    return response.data[0]; // Assuming user has only one portfolio
  };
  
  export const addStockToPortfolio = async (
    portfolioId: number,
    stockId: number,
    quantity: number,
    purchasePrice: number
  ): Promise<Stock> => {
    const response = await api.post<Stock>(`/portfolios/${portfolioId}/add_stock/`, {
      stock_id: stockId,
      quantity,
      purchase_price: purchasePrice,
    });
    return response.data;
  };
  
  export const getPerformanceData = async (
    model: string,
    timeframe: string,
  ): Promise<ChartData> => {
    const response = await api.get<ChartData>(
      `/performance/chart_data/?model=${model}&timeframe=${timeframe}`,
    )
    return response.data
  }

  export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
    const response = await api.get<PortfolioSummary>('/portfolios/summary/');
    return response.data || null;
  };

export const fetchStockData = async (symbol: string): Promise<number> => {
    const response = await api.get<TickerData>(`/stocks/fetch_current_value/?symbol=${symbol}`);
    if (!response) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }
    return response.data.close; 
};

  export const getAIInsights = async (): Promise<Insight[]> => {
    const response = await api.get<Insight[]>('/ai-insights/');
    return response.data || null;
  };
  
  export const getUserPremiumStatus = async () => {
    const response = await api.get<any>('/user-profiles/premium_status/');
    return response.data.is_premium;
  };

  export const TIMELINE_CONFIGS = {
    '2w': { period: '2w', label: '2 Weeks', expectedLength: 10 },
    '1m': { period: '1mo', label: '1 Month', expectedLength: 21 },
    '3m': { period: '3mo', label: '3 Months', expectedLength: 63 },
    '6m': { period: '6mo', label: '6 Months', expectedLength: 126 },
    '1y': { period: '1y', label: '1 Year', expectedLength: 252 },
    '2y': { period: '2y', label: '2 Years', expectedLength: 510 }
  };
  
  export default api;
  
  