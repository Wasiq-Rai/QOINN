import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Chip,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';

interface PerformanceSummaryProps {
  modelData: number[];
  dataType: 'percentage' | 'absolute';
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ modelData, dataType }) => {
  // Calculate key metrics
  const currentValue = [...modelData].reverse().find(value => value !== 1) ?? modelData[modelData.length - 1];
  const initialValue = 1;
  const totalChange = currentValue - initialValue;
  const percentageChange = (totalChange / initialValue) * 100;
  
  // Find last two non-one values for daily change calculation
  const reversedData = [...modelData].reverse();
  const lastNonOne = reversedData.findIndex(value => value !== 1);
  const secondLastNonOne = reversedData.slice(lastNonOne + 1).findIndex(value => value !== 1);
  const lastValue = lastNonOne !== -1 ? reversedData[lastNonOne] : modelData[modelData.length - 1];
  const prevValue = secondLastNonOne !== -1 ? reversedData[secondLastNonOne + lastNonOne + 1] : modelData[modelData.length - 2];
  
  const dailyChange = lastValue - prevValue;
  const dailyPercentageChange = (dailyChange / prevValue) * 100;
  const { theme } = useTheme();

  // Determine color and icon based on performance
  const performanceColor = percentageChange >= 0 ? 'success' : 'error';
  const ChangeIcon = percentageChange >= 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom className='font-kigelia'>
        {theme.strings.modelPerformanceSummary}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <MoneyIcon color="primary" />
            <Typography variant="h6">
              Current QOINN Value: {currentValue ? dataType === 'percentage' 
                ? `${currentValue.toFixed(4)}%` 
                : `$${currentValue.toFixed(4)}` : 0.00}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <ChangeIcon color={performanceColor} />
            <Box display="flex" alignItems="baseline" gap={1}>
              <Typography variant="h6" color={performanceColor} sx={{ fontWeight: 600 }}>
                {`Total Return: ${percentageChange ? percentageChange.toFixed(2) : 0.00}%`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                since 10/10/2024
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Chip
            label={`Daily Change: ${dailyPercentageChange ? dailyPercentageChange.toFixed(2) : 0.00}%`}
            color={dailyPercentageChange >= 0 ? 'success' : 'error'}
            variant="outlined"
            sx={{
              fontSize: "20px"
            }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Performance calculated based on {dataType} {dataType === 'percentage' ? 'change' : 'value'}
      </Typography>
    </Paper>
  );
};

export default PerformanceSummary;