"use client";

import { useEffect, useState } from "react";
import { getAvailableSlots } from "@/app/actions";
import { useEquity } from "@/context/EquityContext";
import AdminSlotManager from "@/components/meeting/AdminSlotManager";
import { AdminEquityManager } from "./AdminEquityManager";
import { Bell, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeEditor } from "./ThemeEditor";
import EquityDonutChart from "@/components/EquityDonutChart";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { NewsletterSubscribers } from "./NewsLetterSubscribers";
import MeetingsPanel from "@/components/meeting/AdminMeetingsPanel";

export default function AdminPage() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const { equityPercentage } = useEquity();
  const [slots, setSlots] = useState<any>([]);

  useEffect(() => {
    const getSlots = async () => {
      const slots = await getAvailableSlots();
      setSlots(slots);
    };
    getSlots();
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e4edf1] to-[#f0f7fa] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="bg-red-100 dark:bg-red-900/30 p-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-red-200 dark:bg-red-800 rounded-full blur-md opacity-75 animate-pulse"></div>
              <Lock className="h-16 w-16 text-red-600 dark:text-red-400 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Admin Access Required
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              You don't have permission to view this page
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-start mb-6">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This dashboard is restricted to administrators only. Please contact your system administrator if you believe this is an error.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
              >
                <Link href="/">
                  Return to Homepage
                </Link>
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4edf1] dark:from-gray-900 dark:to-gray-800">
      <header className="bg-[#c2d6df] dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <>
              <Link href={"/UserProfile"}>
                <span>{user?.fullName}</span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.fullName}</CardTitle>
              <CardDescription>
                Here's a summary of your admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have {slots.length} available slots and the current equity
                percentage is {equityPercentage || "N/A"}.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Equity Percentage</CardTitle>
              <CardDescription>Latest update from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {equityPercentage || "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Meetings</CardTitle>
              <CardDescription>
                Manage investment meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MeetingsPanel/>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>News Letter Subscribers</CardTitle>
              <CardDescription>
                Manage subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterSubscribers/>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Equity Statement Upload</CardTitle>
              <CardDescription>
                Upload new equity statements to update the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminEquityManager />
            </CardContent>
          </Card>
        </div>
        <Box>
          <EquityDonutChart />
          <ThemeEditor />
        </Box>
      </main>
    </div>
  );
}