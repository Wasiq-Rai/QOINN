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

interface PerformanceSummaryProps {
  modelData: number[];
  dataType: 'percentage' | 'absolute';
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ modelData, dataType }) => {
  // Calculate key metrics
  const currentValue = modelData[modelData.length - 1];
  const initialValue = modelData[0];
  const totalChange = currentValue - initialValue;
  const percentageChange = (totalChange / initialValue) * 100;
  const dailyChange = modelData[modelData.length - 1] - modelData[modelData.length - 2];
  const dailyPercentageChange = (dailyChange / modelData[modelData.length - 2]) * 100;

  // Determine color and icon based on performance
  const performanceColor = percentageChange >= 0 ? 'success' : 'error';
  const ChangeIcon = percentageChange >= 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Model Performance Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <MoneyIcon color="primary" />
            <Typography variant="subtitle1">
              Current Value: {currentValue ? dataType === 'percentage' 
                ? `${currentValue.toFixed(2)}%` 
                : `$${currentValue.toFixed(2)}` : 0.00}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <ChangeIcon color={performanceColor} />
            <Typography variant="subtitle1" color={performanceColor}>
              Total Change: {totalChange ? totalChange.toFixed(2) : 0.00} 
              {dataType === 'percentage' ? '%' : ''}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Chip
            label={`Total Return: ${percentageChange ? percentageChange.toFixed(2) : 0.00}%`}
            color={performanceColor}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Chip
            label={`Daily Change: ${dailyPercentageChange ? dailyPercentageChange.toFixed(2) : 0.00}%`}
            color={dailyPercentageChange >= 0 ? 'success' : 'error'}
            variant="outlined"
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