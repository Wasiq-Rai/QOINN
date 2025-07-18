'use client'
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { scheduleInvestmentMeeting } from '@/app/actions';
import { useUser } from '@clerk/nextjs';

export default function InvestmentForm() {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email:  '',
    phone: '',
    investmentAmount: '',
    message: '',
    selectedSlot: ''
  });

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await scheduleInvestmentMeeting(formData);
      response.success 
        ? router.push("/invest/confirmation")
        : console.error("Meeting scheduling failed");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    }
  };

  const timeSlots = [
    { value: "morning", label: "Morning 10:00 AM - 12:00 pm" },
    { value: "afternoon", label: "Afternoon 2:00 PM - 5:00 pm" },
    { value: "night", label: "Night 8:00 PM - 11:00 pm" }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(14, 74, 128, 0.1)',
        minHeight: "560px"
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          textAlign: 'center', 
          color: '#0E4A80', 
          fontWeight: 'bold' 
        }}
      >
        Schedule Investment Meeting
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={user?.primaryEmailAddress?.emailAddress ? "" : "Email"}
              name="email"
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || formData.email}
              disabled = {user?.primaryEmailAddress?.emailAddress ? true : false}
              required
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Investment Amount"
              name="investmentAmount"
              type="number"
              value={formData.investmentAmount}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Message (Optional)"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Available Time Slots</InputLabel>
              <Select
                name="selectedSlot"
                value={formData.selectedSlot}
                onChange={handleChange}
                label="Available Time Slots"
                required
              >
                {timeSlots.map((slot) => (
                  <MenuItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2,
                backgroundColor: '#0E4A80',
                '&:hover': {
                  backgroundColor: '#1E6BBD'
                }
              }}
            >
              Schedule Meeting
            </Button>
            <img 
                  src="/img/logo/logo-name.png" 
                  alt="QOINN Logo" 
                  width="auto"
                  height="auto"
                  style={{ maxWidth: 250, marginBottom: 16, paddingTop: "20px" }}
                />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}