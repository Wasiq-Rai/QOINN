"use client"

import { useState, useEffect } from "react"
import { getPortfolio } from "@/utils/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Portfolio } from "@/utils/types"

export function PortfolioView() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio()
        setPortfolio(data)
      } catch (error) {
        console.error("Error fetching portfolio:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
          <CardDescription>Loading your investment data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    )
  }

  if (!portfolio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
          <CardDescription>Unable to load portfolio data. Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
        <CardDescription>Overview of your current investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(portfolio.total_value)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${portfolio.total_gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolio.total_gain_loss)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${portfolio.total_gain_loss_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(portfolio.total_gain_loss_percentage)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolio.stocks.length}</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.stocks.map((stock) => {
                const marketValue = stock.quantity * stock.current_price
                const gainLoss = marketValue - (stock.quantity * stock.purchase_price)
                const gainLossPercentage = (gainLoss / (stock.quantity * stock.purchase_price)) * 100

                return (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell className="text-right">{stock.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(stock.purchase_price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(stock.current_price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(marketValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Badge variant={gainLoss >= 0 ? "default" : "destructive"} className="mr-2">
                          {gainLoss >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                        </Badge>
                        <span className={gainLoss >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(gainLoss)} ({formatPercentage(gainLossPercentage)})
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
