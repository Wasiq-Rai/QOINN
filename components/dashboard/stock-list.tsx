'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStocks } from "@/utils/api"
import { Stock } from "@/utils/types"
import { Lock } from 'lucide-react'
import { useEffect, useState } from "react"

export function StockList() {
      const [stocks, setStocks] = useState<Stock[]>([])
      const [isPremium, setIsPremium] = useState(false)
    
      useEffect(() => {
        const fetchData = async () => {

          const stocksData = await getStocks()
          console.log(stocksData)
          setStocks(stocksData)
    
          // TODO: Fetch user's premium status
          setIsPremium(false)
        }
    
        fetchData()
      }, [])
  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.slice(0, isPremium ? stocks.length : 5).map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell className="text-right">${stock.current_price.toFixed(2)}</TableCell>
              <TableCell className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? '+' : '-'}${Math.abs(stock.change).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isPremium && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <Lock className="mx-auto mb-2" />
            <p className="font-semibold">Upgrade to Premium to see all stocks</p>
          </div>
        </div>
      )}
    </div>
  )
}

