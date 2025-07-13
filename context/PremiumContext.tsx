'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser , useAuth} from "@clerk/nextjs";

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
  const { getToken } = useAuth();

  useEffect(() => {
    checkPremiumStatus();
  }, [isSignedIn]);

const checkPremiumStatus = async () => {
  if (!isSignedIn || !user) return;

  try {
    // const res = await fetch(`http://localhost:8080/api/userprofile/premium_status/?email=${user.primaryEmailAddress?.emailAddress}`);
    const res = await fetch(`https://web-production-9b972.up.railway.app/api/userprofile/premium_status/?email=${user.primaryEmailAddress?.emailAddress}`);
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
