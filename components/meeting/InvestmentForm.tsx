"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { scheduleInvestmentMeeting } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function InvestmentForm() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    investmentAmount: 0,
    message: "",
  });

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "investmentAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loader
    try {
      const response = await scheduleInvestmentMeeting(formData);
      if (response.success) {
        router.push("/invest/confirmation");
      } else {
        toast.error("Meeting scheduling failed");
      }
    } catch (error) {
      toast.error("Error scheduling meeting. Try again later");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(14, 74, 128, 0.1)",
        minHeight: "560px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          textAlign: "center",
          color: "#0E4A80",
          fontWeight: "bold",
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
              disabled={!!user?.primaryEmailAddress?.emailAddress}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading} // prevent multiple clicks
              sx={{
                mt: 2,
                backgroundColor: "#0E4A80",
                "&:hover": {
                  backgroundColor: "#1E6BBD",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Schedule Meeting"
              )}
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
