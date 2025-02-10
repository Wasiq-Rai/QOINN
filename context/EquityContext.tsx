'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { getEquity } from '@/utils/api';

type EquityContextType = {
  equityPercentage: string | null;
  isLoading: boolean;
  error: string | null;
  refreshEquity: () => Promise<void>;
};

const EquityContext = createContext<EquityContextType>({
  equityPercentage: null,
  isLoading: false,
  error: null,
  refreshEquity: async () => {},
});

export const EquityProvider = ({ children }: { children: React.ReactNode }) => {
  const [equityPercentage, setEquityPercentage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquity = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getEquity();
      setEquityPercentage(response.data.percentage);
    } catch (error) {
      setError('Failed to fetch equity');
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquity();
  }, []);

  return (
    <EquityContext.Provider value={{ 
      equityPercentage, 
      isLoading,
      error,
      refreshEquity: fetchEquity 
    }}>
      {children}
    </EquityContext.Provider>
  );
};

export const useEquity = () => useContext(EquityContext);