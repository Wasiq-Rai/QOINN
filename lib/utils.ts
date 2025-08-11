import { indicators } from "@/utils/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStockName = (symbol: string) => {
  const indicator = indicators.find((ind) => ind.symbol === symbol);
  return indicator ? indicator.name : symbol;
};