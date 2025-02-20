"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { fetchStockData, fetchIndicatorData } from '@/utils/api'; // Assume you have these functions
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { indicators } from '@/utils/types';

const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
];

export function StockTicker() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newPrices: Record<string, number> = {};
        const newChanges: Record<string, number> = {};

        // Fetch prices and changes for all stocks
        for (const stock of [...stocks, ...indicators]) {
          const data = await fetchStockData(stock.symbol);
          if (data) {
            newPrices[stock.symbol] = data.price;
            newChanges[stock.symbol] = data.changePercent;
          }
        }
        setPrices(newPrices);
        setChanges(newChanges);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="p-4 bg-black text-white overflow-hidden">
      <div className="flex animate-ticker">
        {[...indicators, ...stocks].map((item) => (
          <div key={item.symbol} className="flex items-center space-x-4 mr-8">
            <span className="font-bold">{stocks.includes(item) ? item.symbol : item.name}</span>
            <span>${prices[item.symbol]?.toFixed(2) || '---'}</span>
            <div className="flex items-center space-x-1">
              {changes[item.symbol] !== undefined && (
                <>
                  {changes[item.symbol] >= 0 ? (
                    <ArrowUpward className="text-green-500 animate-bounce" />
                  ) : (
                    <ArrowDownward className="text-red-500 animate-bounce" />
                  )}
                  <span
                    className={`text-sm ${
                      changes[item.symbol] >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {changes[item.symbol]?.toFixed(2)}%
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}