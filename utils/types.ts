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
    symbol: string
    name: string
    quantity: number
    purchase_price: number
    current_price: number
    previous_close: number
    change: number
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

  export interface ChartData {
    dates: string[]
    spy: number[]
    voo: number[]
    qoinn_theoretical: number[]
    qoinn_real: number[]
  }