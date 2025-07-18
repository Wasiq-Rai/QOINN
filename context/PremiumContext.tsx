'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { API_URL } from "@/utils/api";

// Define context type
interface PremiumContextType {
  isPremium: boolean;
  checkPremiumStatus: () => void;
}

// Create context with default values
const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  checkPremiumStatus: () => {},
});

// Provider component
export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    checkPremiumStatus();
  }, [isSignedIn]);

const checkPremiumStatus = async () => {
  if (!isSignedIn || !user) return;

  try {
    const res = await fetch(`${API_URL}/userprofile/premium_status/?email=${user.primaryEmailAddress?.emailAddress}`);
    console.log(res)
    const data = await res.json();
    setIsPremium(data.is_premium);
  } catch (err) {
    console.error("Failed to fetch premium status:", err);
    setIsPremium(false);
  }
};



  return (
    <PremiumContext.Provider value={{ isPremium, checkPremiumStatus }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => useContext(PremiumContext);
