// utils/themeContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContent } from '@/utils/themes';
import { defaultTheme } from '@/utils/defaults';
import { themeApi, withErrorHandling } from '@/utils/api';

const ThemeContext = createContext<{
  theme: ThemeContent;
  updateTheme: (newTheme: Partial<ThemeContent>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}>({
  theme: defaultTheme,
  updateTheme: async () => {},
  isLoading: false,
  error: null,
});

export const ThemeProvider = ({ children }:{children: any}) => {
  const [theme, setTheme] = useState<ThemeContent>(defaultTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTheme = async () => {
    setIsLoading(true);
    setError(null);

    const response = await withErrorHandling(themeApi.getActiveTheme);

    if (response.success && response.data) {
      setTheme({ ...defaultTheme, ...response.data });
    } else {
      setError(response.message || "Failed to load theme");
      setTheme(defaultTheme); // Fallback to defaults
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const updateTheme = async (newTheme: Partial<ThemeContent>) => {
    setIsLoading(true);
    setError(null);

    const response = await withErrorHandling(() => themeApi.updateTheme(newTheme));

    if (response.success && response.data) {
      setTheme({ ...theme, ...response.data });
    } else {
      setError(response.message || "Failed to update theme");
    }

    setIsLoading(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isLoading, error }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);