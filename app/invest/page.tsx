import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircleOutline as CheckIcon } from "@mui/icons-material";
import InvestmentForm from "@/components/meeting/InvestmentForm";

export default function InvestPage() {
  return (
    <Box
      sx={{
        backgroundColor: "#F0F4F8",
        minHeight: "100vh",
        py: 2,
        "& *": {
          fontFamily: "Font Flex, Arial, sans-serif",
        },
      }}
    >
      <img
        src="/logo-name.png"
        alt="QOINN Logo"
        style={{ maxWidth: 250, marginBottom: 16, justifySelf: "center" }}
      />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Side - Company Information */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                boxShadow: "0 8px 24px rgba(14, 74, 128, 0.1)",
                p: 3,
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "#0E4A80",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Schedule an Investment Meeting
                </Typography>
              </Box>

              <Typography
                variant="body1"
                paragraph
                sx={{ color: "text.secondary" }}
              >
                QOINN is an innovative investment model that leverages
                cutting-edge technology and market insights to deliver
                exceptional returns. By investing in QOINN, you're partnering
                with a team of experts dedicated to maximizing your financial
                growth.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#0E4A80",
                  fontWeight: "bold",
                  mt: 3,
                  mb: 2,
                }}
              >
                Key Benefits:
              </Typography>

              <List>
                {[
                  "High potential returns",
                  "Diversified portfolio",
                  "Expert management",
                  "Transparent reporting",
                ].map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon sx={{ color: "#0E4A80" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit}
                      primaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mt: 3,
                }}
              >
                To learn more about this exciting opportunity and discuss your
                investment options, please schedule a Zoom meeting with our team
                using the form below.
              </Typography>
            </Paper>
          </Grid>

          {/* Right Side - Investment Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                boxShadow: "0 8px 24px rgba(14, 74, 128, 0.1)",
              }}
            >
              <InvestmentForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
