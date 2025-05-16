"use client";
import { useState, useEffect } from "react";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Lock,
  TrendingUp,
  Warning,
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Fade,
  styled,
  keyframes,
  Tooltip,
  TableContainerProps,
  CircularProgress,
} from "@mui/material";
import { usePremium } from "@/context/PremiumContext";
import Subscription from "@/app/subscription/subscription";
import { getStocks } from "@/utils/api";
import { indicators, Stock } from "@/utils/types";
import TradingViewWidget from "./Charts/TradingViewWidget";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@clerk/nextjs";
import EquityDonutChart from "../EquityDonutChart";
import Image from "next/image";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledTableContainer = styled(TableContainer)<TableContainerProps>(
  ({ theme }) => ({
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: theme.shadows[5],
    position: "relative",
    background: theme.palette.background.paper,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  })
);

const GradientHeader = styled(Box)(({ theme }) => ({
  background: "#c2d6df",
  color: "#2d2b2a",
  padding: theme.spacing(3),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 500,
  "&:first-of-type": {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
  },
}));

const PremiumOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(0, 0, 0, 0.85)",
  color: "white",
  zIndex: 1,
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  animation: `${fadeIn} 0.5s ease`,
  borderRadius: "16px",
  opacity: 0.6
}));

const getStockName = (symbol: string) => {
  const indicator = indicators.find((ind) => ind.symbol === symbol);
  return indicator ? indicator.name : symbol;
};

const compulsorySymbols = ["^GSPC", "^IXIC", "^DJI", "^TNX"];

export function StockList() {
  const { isPremium } = usePremium();
  const { isSignedIn } = useUser();

  const [stocks, setStocks] = useState<{ [key: string]: Stock } | undefined>();
  const [showSubscription, setShowSubscription] = useState(false);
  const [userSymbols, setUserSymbols] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSymbol, setAddedSymbol] = useState("AAPL");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStocks(userSymbols);
        setStocks(response.results);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchData();
  }, [userSymbols]);

  const handleAddSymbol = async () => {
    const symbol = inputValue.trim().toUpperCase();

    if (!symbol) {
      setInputError("Please enter a stock symbol");
      return;
    }

    if (!/^[A-Z0-9^.:-]{1,10}$/.test(symbol)) {
      setInputError("Invalid symbol format");
      return;
    }

    const isDuplicate = [...compulsorySymbols, ...userSymbols].some(
      (s) => s.toUpperCase() === symbol
    );

    if (isDuplicate) {
      setInputError(`${symbol} is already in the list`);
      return;
    }

    setIsAdding(true);
    try {
      const response = await getStocks([symbol]);
      if (!response.results) {
        throw new Error("Invalid symbol");
      }

      setUserSymbols((prev) => [...prev, symbol]);
      setAddedSymbol(symbol);
      setInputValue("");
      setInputError(null);
    } catch (error) {
      setInputError(`Failed to add ${symbol} - please verify the symbol`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setUserSymbols((prev) => prev.filter((s) => s !== symbol));
  };

  const hasData = (data: Stock | null) => {
    return data && Object.values(data).some((val) => val !== null);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <StyledTableContainer component={Paper}>
        {!isPremium && !isSignedIn ? (
          <>
            <PremiumOverlay onClick={() => setShowSubscription(true)}>
              <Lock fontSize="large" sx={{ mb: 2, fontSize: 64 }} />
              <Typography variant="h4" gutterBottom>
                {theme.strings.premiumFeaturesLockedMessage}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                {theme.strings.upgradeToPremiumMessage}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Click to upgrade
              </Typography>
            </PremiumOverlay>
            <Image
              unoptimized
              quality={100}
              width={100}
              height={100}
              src="/img/bg/blurred-prem.png"
              alt="Upgrade to Premium to View."
              className="w-full h-auto"
            />
          </>
        ) : (
          <>
            <GradientHeader>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <TrendingUp fontSize="large" />
                <Typography variant="h4" fontWeight="bold">
                  {theme.strings.marketDashboard}
                </Typography>
              </Stack>
              <Box position="relative">
                <TextField
                  fullWidth
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value.toUpperCase());
                    setInputError(null);
                  }}
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  variant="outlined"
                  error={!!inputError}
                  helperText={inputError}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSymbol()}
                  disabled={!isPremium || isAdding}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleAddSymbol}
                          disabled={
                            !inputValue.trim() || !isPremium || isAdding
                          }
                          color="primary"
                        >
                          {isAdding ? (
                            <CircularProgress size={24} />
                          ) : (
                            <AddIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <span style={{ opacity: 0.6 }}>$</span>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: (theme) => theme.palette.background.paper,
                      borderRadius: "8px",
                    },
                  }}
                />
                <Box mt={2}>
                  {compulsorySymbols.map((symbol) => (
                    <Chip
                      key={symbol}
                      label={symbol}
                      sx={{ m: 0.5 }}
                      color="primary"
                    />
                  ))}
                  {userSymbols.map((symbol) => (
                    <Chip
                      key={symbol}
                      label={symbol}
                      onDelete={() => handleRemoveSymbol(symbol)}
                      sx={{ m: 0.5 }}
                      deleteIcon={<CloseIcon />}
                      color="secondary"
                    />
                  ))}
                </Box>
              </Box>
            </GradientHeader>

            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Index/Stock</StyledTableCell>
                  <StyledTableCell align="right">Open</StyledTableCell>
                  <StyledTableCell align="right">High</StyledTableCell>
                  <StyledTableCell align="right">Low</StyledTableCell>
                  <StyledTableCell align="right">Close</StyledTableCell>
                  <StyledTableCell align="right">Volume</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks &&
                  Object.entries(stocks).map(([symbol, data]) => (
                    <TableRow
                      key={symbol}
                      sx={{
                        animation: `${fadeIn} 0.3s ease`,
                        "&:hover": { background: "rgba(0, 0, 0, 0.03)" },
                      }}
                    >
                      <StyledTableCell>
                        <Tooltip title={symbol} arrow>
                          <span>{getStockName(symbol)}</span>
                        </Tooltip>
                      </StyledTableCell>
                      {hasData(data) ? (
                        <>
                          <StyledTableCell align="right">
                            {data.Open?.toFixed(4) ?? "N/A"}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {data.High?.toFixed(4) ?? "N/A"}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {data.Low?.toFixed(4) ?? "N/A"}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {data.Close?.toFixed(4) ?? "N/A"}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {data.Volume?.toLocaleString() ?? "N/A"}
                          </StyledTableCell>
                        </>
                      ) : (
                        <TableCell colSpan={6} align="center">
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="text.secondary"
                            py={2}
                          >
                            <Warning fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              No data available for {getStockName(symbol)}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TradingViewWidget stockName={addedSymbol} />
            <EquityDonutChart />
          </>
        )}
      </StyledTableContainer>

      <Subscription
        open={showSubscription}
        onClose={() => setShowSubscription(false)}
      />
    </Box>
  );
}
