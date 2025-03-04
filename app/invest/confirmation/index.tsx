'use client'
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Grid
} from '@mui/material';
import { 
  CheckCircleOutlined as CheckIcon, 
  DashboardOutlined as DashboardIcon 
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Confirmation() {
  const router = useRouter();

  return (
    <Box 
      sx={{ 
        backgroundColor: '#F0F4F8', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Font Flex, Arial, sans-serif'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 6, 
            borderRadius: 4, 
            textAlign: 'center',
            boxShadow: '0 12px 32px rgba(14, 74, 128, 0.15)'
          }}
        >
          <CheckIcon 
            sx={{ 
              fontSize: 100, 
              color: '#0E4A80', 
              mb: 3 
            }} 
          />
          
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#0E4A80', 
              fontWeight: 'bold', 
              mb: 2 
            }}
          >
            Meeting Scheduled
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
          >
            Thank you for your interest in investing with QOINN. Your meeting has been scheduled successfully.
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            You will receive a confirmation email shortly with the meeting details and Zoom link.
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<DashboardIcon />}
                sx={{ 
                  backgroundColor: '#0E4A80',
                  '&:hover': {
                    backgroundColor: '#1E6BBD'
                  }
                }}
                onClick={() => router.push('/dashboard')}
              >
                Go to Main Page
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}