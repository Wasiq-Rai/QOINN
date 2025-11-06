'use client';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/utils/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const updateToken = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);
      } catch (error) {
        console.error('Error setting auth token:', error);
      }
    };

    updateToken();
    // Set up a refresh interval
    const intervalId = setInterval(updateToken, 1000 * 60 * 14); // Refresh every 14 minutes

    return () => clearInterval(intervalId);
  }, [getToken]);

  return <>{children}</>;
}