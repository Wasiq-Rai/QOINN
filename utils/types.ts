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

  export interface TickerData {
    Open: number,
    High: number,
    Low: number,
    close: number,
    Volume: number,
    Dividends: number,
  }
  
  
  export interface ApiResponse {
    results: {},
    errors: {}
  }