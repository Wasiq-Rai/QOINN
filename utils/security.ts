'use server'
import { useAuth } from '@clerk/nextjs';

export const getCsrfToken = async () => {
  try {
    const { getToken } = useAuth();
    const token = await getToken();
    if (!token) return null;
    
    // Create a CSRF token by hashing the auth token with the current timestamp
    const timestamp = new Date().getTime();
    const data = `${token}-${timestamp}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const csrfToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return csrfToken;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return null;
  }
};

export const validateRequest = async (req: Request) => {
  try {
    const { userId } = useAuth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Validate CSRF token for mutation requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
      const csrfToken = req.headers.get('X-CSRF-Token');
      if (!csrfToken) {
        throw new Error('Missing CSRF token');
      }
      // Add additional CSRF validation here if needed
    }

    return true;
  } catch (error) {
    console.error('Request validation failed:', error);
    return false;
  }
};

export const rateLimit = (() => {
  const requests = new Map<string, { count: number; timestamp: number }>();
  const WINDOW_MS = 60000; // 1 minute
  const MAX_REQUESTS = 100; // max requests per minute

  return (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // Clean up old entries
    requests.forEach((data, key) => {
      if (data.timestamp < windowStart) {
        requests.delete(key);
      }
    });

    // Get or create record for this IP
    const record = requests.get(ip) || { count: 0, timestamp: now };

    // If the record is older than our window, reset it
    if (record.timestamp < windowStart) {
      record.count = 0;
      record.timestamp = now;
    }

    // Increment count and check if it's over limit
    record.count += 1;
    requests.set(ip, record);

    return record.count <= MAX_REQUESTS;
  };
})();