'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

    useEffect(() => {
        checkPremiumStatus();
    }, []);

    // Function to check premium status (Replace with actual API call)
    const checkPremiumStatus = () => {
        const premiumStatus = localStorage.getItem("isPremium") === "true";  // Replace with real check
        setIsPremium(premiumStatus);
    };

    return (
        <PremiumContext.Provider value={{ isPremium, checkPremiumStatus }}>
            {children}
        </PremiumContext.Provider>
    );
};

// Custom hook to use the context
export const usePremium = () => useContext(PremiumContext);
