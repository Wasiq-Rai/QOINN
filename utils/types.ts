export interface LoginResponse {
    access: string;
    refresh?: string; // Optional, depending on your API
  }
  
  export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
  }
  
  export interface Stock {
    Close: number,
    Dividends: number,
    High: number,
    Low:  number,
    Open: number,
    StockSplits:number,
    Volume: number
  }
  
  export interface Portfolio {
    id: number
    user: {
      username: string
    }
    stocks: Stock[]
    total_value: number
    total_gain_loss: number
    total_gain_loss_percentage: number
  }
  
  export interface PerformanceData {
    date: string;
    value: number;
  }
  
  export interface Performance {
    portfolio_id: number;
    profit: number;
    growth: number;
  }

  export interface PortfolioSummary {
    totalValue: number;
    dailyChange: number;
    totalGain: number;
  }

  export interface Insight {
    id: number
    title: string
    description: string
    tags: string[]
  }
  
  export interface AIInsightsProps {
    insights: Insight[]
    isPremium: boolean
  }

  export interface ChartDataPoint {
    date: string;
    SPY: number;
    VOO: number;
    Model: number;
  }
  
  export interface ChartData {
    dates: string[];
    spy: number[];
    voo: number[];
    model: number[][];
    model_version: string;
    data_source?: string;
  }
  
  export interface ApiResponse {
    results: {},
    errors: {}
  }

  // Interface for stock data
  export interface StockData {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
  }
  
  // Interface for indicator data
  export interface IndicatorData {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
  }
  
  // Interface for API response
  export interface TickerData {
    close: number;
    changePercent?: number;
  }

  export type StockSymbol = {
    symbol: string;
    name: string;
  };

  export const indicators = [
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^IXIC", name: "NASDAQ" },
    { symbol: "^DJI", name: "Dow Jones" },
    { symbol: "^TNX", name: "US 10-Year Yield" },
  ];