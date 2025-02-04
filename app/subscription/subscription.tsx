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
        <section id="subscribe" className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-sm mx-auto">
              <Card>
                <CardContent className="pt-6 bg-white/50 border-2">
                  <div className="text-center space-y-4">
                    <div className="container mx-auto py-10 text-center">
                      <h1 className="text-3xl font-bold">
                        Welcome to QOINN
                      </h1>
                      <SubscriptionForm />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Box>
    </Modal>
  );
};

export default Subscription;
