"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

const stocks = [
  { symbol: "AAPL", name: "Apple Inc.", score: 89.1 },
  { symbol: "MSFT", name: "Microsoft Corporation", score: 78.5 },
  { symbol: "NVDA", name: "NVIDIA Corporation", score: 93.8 },
  { symbol: "GOOGL", name: "Alphabet Inc.", score: 85.2 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", score: 82.7 },
  // Add more stocks as needed
]

export function StockList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>QOINN Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>{stock.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

