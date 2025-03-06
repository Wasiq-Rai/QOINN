import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import SubscriptionForm from "./subscription-form";
import { Modal, Box, Typography, Button } from "@mui/material";

const Subscription = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
        }}
      >
        <section id="subscribe" className="bg-background">
              <Card>
                <CardContent>
                      <SubscriptionForm />
                </CardContent>
              </Card>
        </section>
      </Box>
    </Modal>
  );
};

export default Subscription;
