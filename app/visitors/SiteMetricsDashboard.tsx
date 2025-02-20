"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Eye, LogIn, DollarSign, RefreshCw } from "lucide-react";
import { SiteMetrics, User } from "@/utils/types";
import { getInvestments, getMetrics } from "@/utils/api";
import { AdminMetricsManager } from "../admin/AdminMetricsManager";
import { getTotalLogins, getTotalUsers } from "@/actions/users";
import { useAdmin } from "@/context/AdminContext";
import { UserManagementModal } from "./UserManagementModal";

export const SiteMetricsDashboard = () => {
  const { user, isLoaded } = useUser();
  const { isAdmin, isLoading } = useAdmin();
  const [allUsers, setAllUsers]= useState<User[]>([]);

  const [metrics, setSiteMetrics] = useState<SiteMetrics>({
    total_visitors: 0,
    total_logins: 0,
    total_investments: "0",
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const fetchMetrics = async () => {
    try {
      const investment = await getMetrics();
      const users = await getTotalUsers();
      setAllUsers(users)
      const logins = await getTotalLogins();
      console.log(logins);

      setSiteMetrics({
        total_visitors: metrics.total_visitors, // Keep existing value
        total_logins: users.length, // Set total_logins from users API response
        total_investments: investment.data.total_investments.toString(), // Set total_investments from investment API response
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchMetrics();
      // Set up interval for real-time updates
      const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLoaded, user]);

  const handleInvestmentUpdate = async (amount: number) => {
    if (amount && amount > 0) {
      try {
        const response = await getInvestments(amount);

        if (response.ok) {
          fetchMetrics();
        } else {
          throw new Error("Failed to update investments");
        }
      } catch (error) {
        console.error("Error updating investments:", error);
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          QOINN Performance Dashboard
        </h2>
        {isAdmin && (
          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Update Investments
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Visitors
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {metrics.total_visitors.toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            isAdmin ? "cursor-pointer transition-all hover:shadow-md" : ""
          }
          onClick={() => {
            if (isAdmin) {
              setIsUserModalOpen(true);
            }
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <LogIn className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Users
                  {isAdmin && (
                    <span className="ml-2 text-xs text-blue-600">
                      (Click to manage)
                    </span>
                  )}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {metrics.total_logins.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">
                  Conversion:{" "}
                  {(
                    (metrics.total_logins / metrics.total_visitors) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Investments
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${metrics.total_investments}
                </h3>
                <p className="text-sm text-gray-500">
                  Conversion:{" "}
                  {(
                    (Number(metrics.total_investments) / metrics.total_logins) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminMetricsManager
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleInvestmentUpdate}
        currentAmount={Number(metrics.total_investments)}
      />

      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={allUsers}
        setUsers={setAllUsers}
      />
    </div>
  );
};
