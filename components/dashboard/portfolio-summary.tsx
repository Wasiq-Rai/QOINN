'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPortfolioSummary } from "@/utils/api"
import { useEffect, useState } from "react"

export function PortfolioSummary() {
  const [portfolioSummary, setPortfolioSummary] = useState({ totalValue: 0, dailyChange: 0, totalGain: 0 })

  useEffect(() => {
    const fetchData = async () => {
      const summary = await getPortfolioSummary()
      setPortfolioSummary(summary)
    }

    fetchData()
  }, [])
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${portfolioSummary.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioSummary.dailyChange >= 0 ? '+' : '-'}${Math.abs(portfolioSummary.dailyChange).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${portfolioSummary.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioSummary.totalGain >= 0 ? '+' : '-'}${Math.abs(portfolioSummary.totalGain).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

