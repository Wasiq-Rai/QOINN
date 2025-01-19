"use client"

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import yahooFinance from 'yahoo-finance2'

const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." }, // Updated from FB to META
  { symbol: "TSLA", name: "Tesla Inc." },
]

export function StockTicker() {
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const newPrices: Record<string, number> = {}

        // Fetch prices for all stocks
        for (const stock of stocks) {
          const result = await yahooFinance.quote(stock.symbol)
          console.log(result)
          newPrices[stock.symbol] = result.regularMarketPrice || 0
        }

        setPrices(newPrices)
      } catch (error) {
        console.error("Error fetching stock prices:", error)
      }
    }

    // Fetch prices immediately and then every 5 seconds
    fetchStockPrices()
    const interval = setInterval(fetchStockPrices, 5000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-4 bg-black text-white overflow-hidden">
      <div className="flex animate-ticker">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center space-x-2 mr-8">
            <span className="font-bold">{stock.symbol}</span>
            <span>${prices[stock.symbol]?.toFixed(2) || '---'}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}