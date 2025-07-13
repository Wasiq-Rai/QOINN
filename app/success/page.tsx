'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePremium } from '@/context/PremiumContext';

export default function SuccessPage() {
  const router = useRouter();
  const { checkPremiumStatus } = usePremium();

  useEffect(() => {
    // Set premium in localStorage
    localStorage.setItem('isPremium', 'true');
    checkPremiumStatus();

    // Optionally redirect to dashboard or home after few seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="text-gray-600 mt-4">You are now a premium member.</p>
    </div>
  );
}
