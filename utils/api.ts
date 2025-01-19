import axios from 'axios';
import { AIInsightsProps, ChartData, Insight, LoginResponse, PerformanceData, Portfolio, PortfolioSummary, RegisterResponse, Stock } from './types';
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
  
  export const getStocks = async (): Promise<Stock[]> => {
    const response = await api.get<Stock[]>('/stocks/');
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
  
  export const getPerformanceData = async (): Promise<ChartData> => {
    const response = await api.get<ChartData>('/performance/chart_data/');
    return response.data;
  };

  export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
    const response = await api.get<PortfolioSummary>('/portfolios/summary/');
    return response.data;
  };

  
  export const getAIInsights = async (): Promise<Insight[]> => {
    const response = await api.get<Insight[]>('/ai-insights/');
    return response.data;
  };
  
  export const getUserPremiumStatus = async () => {
    const response = await api.get<any>('/user-profiles/premium_status/');
    return response.data.is_premium;
  };
  
  export default api;
  
  