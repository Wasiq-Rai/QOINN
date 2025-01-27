import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Avatar,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  VisibilityOutlined as VisitorsIcon,
  LoginOutlined as LoginIcon,
  AttachMoneyOutlined as InvestmentIcon
} from '@mui/icons-material';

interface SiteMetricsDashboardProps {
  totalVisitors: number;
  totalLogins: number;
  totalInvestments: number;
}

const SiteMetricsDashboard: React.FC<SiteMetricsDashboardProps> = ({
  totalVisitors,
  totalLogins,
  totalInvestments
}) => {
  // Calculate login conversion rate
  const loginConversionRate = ((totalLogins / totalVisitors) * 100).toFixed(2);
  const investmentConversionRate = ((totalInvestments / totalLogins) * 100).toFixed(2);

  return (
    <Paper elevation={4} sx={{ 
      p: 3, 
      borderRadius: 3, 
      background: 'linear-gradient(145deg, #f0f4f8 0%, #e6eaf0 100%)'
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'primary.dark',
          textAlign: 'center'
        }}
      >
        QOINN Performance Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ 
                  bgcolor: 'primary.light', 
                  width: 56, 
                  height: 56 
                }}>
                  <VisitorsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="primary.dark">
                    Total Visitors
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {totalVisitors.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ 
                  bgcolor: 'success.light', 
                  width: 56, 
                  height: 56 
                }}>
                  <LoginIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="success.dark">
                    Total Logins
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {totalLogins.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Login Conversion: {loginConversionRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ 
                  bgcolor: 'secondary.light', 
                  width: 56, 
                  height: 56 
                }}>
                  <InvestmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="secondary.dark">
                    Total Investments
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {totalInvestments.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Investment Conversion: {investmentConversionRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SiteMetricsDashboard;