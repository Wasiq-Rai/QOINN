import axios from "axios";
import {
  AIInsightsProps,
  ApiResponse,
  ChartData,
  IndicatorData,
  indicators,
  Insight,
  LoginResponse,
  News,
  NormalApiResponse,
  PerformanceData,
  Portfolio,
  PortfolioSummary,
  RegisterResponse,
  Stock,
  StockData,
  TickerData,
} from "./types";
import { ThemeContent } from "./themes";
// const API_URL = "http://localhost:8000/api";
// // const API_URL = "https://qoinn-backend-django-production.up.railway.app/api";
const API_URL = "https://web-production-9b972.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For file uploads (different Content-Type)
const apiMultipart = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
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

export const getStocks = async (symbols: string[]): Promise<NormalApiResponse> => {
  const allSymbols = [
    ...indicators.map(i => i.symbol),
    ...symbols.filter(s => !indicators.find(i => i.symbol === s))
  ];
  
  const symbolParams = allSymbols.map(s => `symbol=${encodeURIComponent(s)}`).join('&');
  const response = await api.get<NormalApiResponse>(
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
  timeline: string
): Promise<any> => {
  const response = await Promise.all([
          api.get<ChartData>(`/performance/chart_data/?model=${model}&timeframe=${timeline}&simulated=true`),
          api.get<ChartData>(`/performance/chart_data/?model=${model}&timeframe=${timeline}&simulated=false`)
        ]);
  return response;
};

// api.ts
export const saveModelData = async (
  model: string,
  timeframe: string,
  dates: string[],
  values: number[],
  normalizedValues: number[] | null,
  isSimulated: boolean
): Promise<{status: string, created: boolean}> => {
  const response = await api.post('/performance/save_model_data/', {
    model,
    timeframe,
    dates,
    values,
    normalized_values: normalizedValues,
    is_simulated: isSimulated
  });
  return response.data;
};

export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
  const response = await api.get<PortfolioSummary>("/portfolios/summary/");
  return response.data || null;
};

export const getStocksHistory = async (symbol: string, period: string, interval: string): Promise<any> => {
  const response = await api.get(`/stocks/${symbol}/${period}/${interval}/`);
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

export const getStockNews = async (): Promise<News[]> => {
  const response = await api.get<any>("/stock-news/getNews/");
  return response.data.feed;
};

export const uploadPDF = async (formData: any): Promise<any> => {
  await api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getEquity = async (): Promise<any> => {
  const response = await api.get("/equity");
  return response;
};

export const getEquityStocks = async (): Promise<any> => {
  const response = await api.get("/equity-stocks/");
  return response;
};

export const getMetrics = async (): Promise<any> => {
  try {
    const response = await api.get(`/metrics/`);
    return response;
  } catch (error) {
    console.error("Error fetching metrics:", error);
  }
};

export const getInvestments = async (amount: number): Promise<any> => {
  try {
    const response = await api.put(`/metrics/investments/?total_investments=${amount}`);
    return response;
  } catch (error) {
    console.error("Error fetching investments:", error);
  }
};

export const themeApi = {
  getActiveTheme: async (): Promise<ApiResponse<ThemeContent>> => {
    const response = await api.get<ApiResponse<ThemeContent>>("/theme/active/");
    return response.data;
  },

  getAllThemes: async (): Promise<ApiResponse<ThemeContent[]>> => {
    const response = await api.get<ApiResponse<ThemeContent[]>>("/theme/");
    return response.data;
  },

  updateTheme: async (themeData: Partial<ThemeContent>): Promise<ApiResponse<ThemeContent>> => {
    const response = await api.post<ApiResponse<ThemeContent>>("/theme/", themeData);
    return response.data;
  },

  createTheme: async (themeData: Partial<ThemeContent>): Promise<ApiResponse<ThemeContent>> => {
    const response = await api.post<ApiResponse<ThemeContent>>("/theme/", {
      ...themeData,
      is_active: true
    });
    return response.data;
  },

  deleteTheme: async (themeId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/theme/${themeId}/`);
    return response.data;
  },
};

export const withErrorHandling = async <T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    return await apiCall();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "An unexpected error occurred"
    };
  }
};

export const uploadMedia = async (file: File, mediaType: 'image' | 'video'): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mediaType', mediaType);

  try {
    const response = await api.post('/media/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Ensure the URL is absolute
    let mediaUrl = response.data.mediaUrl;
    if (!mediaUrl.startsWith('http')) {
      mediaUrl = `${window.location.origin}${mediaUrl}`;
    }
    
    return { ...response.data, mediaUrl };
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

export const getUploadedImages = async (): Promise<string[]> => {
  try {
    const response = await api.get('/media/images/');
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Image Upload API
export const UploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiMultipart.post('/upload-image/', formData);
  return response.data;
};


export const updateTeamMemberImage = async (memberName: string, imageUrl: string): Promise<void> => {
  try {
    await api.patch('/team/update-image/', {
      memberName,
      imageUrl
    });
  } catch (error) {
    console.error('Error updating team member image:', error);
    throw error;
  }
};

export const subscribeToNewsLetter = async (email: string): Promise<any> => {
  try {
    const response = await api.post('/newsletter/subscribe/', {
      email,
    });
    return response
  } catch (error) {
    console.error("Error subscribing to news letter for user: ", email, error);
    return error;
  }
};

export const fetchNewsLetterSubscribers = async (): Promise<any> => {
  try {
    const response = await api.get('/newsletter/subscribers/');
    return response.data
  } catch (error) {
    console.error("Failed to fetch subscribers: ", error);
    return error;
  }
};
export const toggleNewsLetterSubscriptionStatus = async (id: number): Promise<any> => {
  try {
    const response = await api.patch(`/newsletter/subscribers/${id}/toggle/`);
    return response.data
  } catch (error) {
    console.error("Failed to update subscriber: ", error);
    return error;
  }
};

export const deleteNewsLetterSubscriber = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/newsletter/subscribers/${id}/`);
    return response;
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return false;
  }
};

export const addNewsLetterSubscriber = async (email: string): Promise<any | null> => {
  try {
    const response = await api.post('/newsletter/subscribers/', {
       email
    });
    
    if (!response) throw new Error('Failed to add subscriber');
    return await response.data;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (email: string): Promise<{
  isSubscribed: boolean;
  isActive: boolean;
}> => {
  try {
    const response = await api.get(`/newsletter/status?email=${encodeURIComponent(email)}`);
    if (!response.data) throw new Error('Failed to check status');
    return await response.data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw error;
  }
};

export const unsubscribeFromNewsLetter = async (email: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await api.post('/newsletter/unsubscribe', {
      email
    });
    
    if (!response.data) {
      const errorData = await response.data;
      throw new Error(errorData.message || 'Unsubscribe failed');
    }
    
    return await response.data;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    throw error;
  }
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
