'use client'
import { Lock } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { getStocks } from "@/utils/api";
import { Stock } from "@/utils/types";
import TradingViewWidget from "./Charts/TradingViewWidget";
import { usePremium } from "@/context/PremiumContext";

export function StockList() {
  const [stocks, setStocks] = useState<{ [key: string]: Stock } | undefined>();
  const {isPremium} = usePremium();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStocks();
                setStocks(response.results);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <TableContainer component={Paper} sx={{ position: 'relative' }}>
            {!isPremium && (
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(1,0,0,0.9)',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        zIndex: 1,
                    }}
                >
                    <Lock fontSize="large" /> Unlock with Premium
                </Box>
            )}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Stock</TableCell>
                        <TableCell>Open</TableCell>
                        <TableCell>High</TableCell>
                        <TableCell>Low</TableCell>
                        <TableCell>Close</TableCell>
                        <TableCell>Volume</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stocks && Object.entries(stocks).map(([symbol, data]) => (
                        <TableRow key={symbol}>
                            <TableCell>{symbol}</TableCell>
                            <TableCell>{data.Open}</TableCell>
                            <TableCell>{data.High}</TableCell>
                            <TableCell>{data.Low}</TableCell>
                            <TableCell>{data.Close}</TableCell>
                            <TableCell>{data.Volume}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TradingViewWidget stockName="SPY" />
        </TableContainer>
    );
}
