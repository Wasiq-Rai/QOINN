import { useAuth } from '@clerk/nextjs';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const useAuthSetup = () => {
  const { getToken } = useAuth();
  
  const updateToken = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  };

  return { updateToken };
};

// Wait for auth token to be available (useful when API calls happen before AuthProvider sets the token)
export const waitForAuthToken = async (timeout = 5000): Promise<string | null> => {
  const pollInterval = 100;
  const maxAttempts = Math.ceil(timeout / pollInterval);
  let attempts = 0;

  return new Promise((resolve) => {
    const check = () => {
      const t = getAuthToken();
      if (t) return resolve(t);
      attempts += 1;
      if (attempts >= maxAttempts) return resolve(null);
      setTimeout(check, pollInterval);
    };
    check();
  });
};