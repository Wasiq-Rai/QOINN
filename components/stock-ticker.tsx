"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchStockData } from "@/utils/api";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { indicators } from "@/utils/types"; // {symbol, name}
import clsx from "clsx";

export function StockTicker() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newPrices: Record<string, number> = {};
        const newChanges: Record<string, number> = {};

        for (const stock of indicators) {
          const data = await fetchStockData(stock.symbol);
          if (data) {
            newPrices[stock.symbol] = data.price;
            newChanges[stock.symbol] = data.changePercent;
          }
        }
        setPrices(newPrices);
        setChanges(newChanges);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="rounded-none relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div
        className={clsx(
          "flex whitespace-nowrap items-center",
          "md:justify-start md:overflow-x-visible",
          "overflow-x-auto scroll-smooth no-scrollbar" // mobile scroll
        )}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {indicators.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center px-6 gap-2 border-r border-gray-700"
          >
            <span className="font-semibold text-lg">{item.symbol}</span>
            <span className="text-gray-300">
              ${prices[item.symbol]?.toFixed(2) || "---"}
            </span>

            {changes[item.symbol] !== undefined && (
              <div className="flex items-center gap-1">
                {changes[item.symbol] >= 0 ? (
                  <ArrowUpward className="text-green-400" fontSize="small" />
                ) : (
                  <ArrowDownward className="text-red-400" fontSize="small" />
                )}
                <span
                  className={clsx(
                    "text-sm font-medium",
                    changes[item.symbol] >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  {changes[item.symbol]?.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Hide scrollbar for mobile scrolling */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Card>
  );
}
