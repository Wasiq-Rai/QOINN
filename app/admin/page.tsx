"use client"

import { useEffect, useState } from "react"
import { getAvailableSlots } from "@/app/actions"
import { useEquity } from "@/context/EquityContext"
import AdminSlotManager from "@/components/meeting/AdminSlotManager"
import { AdminEquityManager } from "./AdminEquityManager"
import { Bell, ChevronDown, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function AdminPage() {
  const { user }= useUser();
  const { equityPercentage } = useEquity()
  const [slots, setSlots] = useState<any>([])

  useEffect(() => {
    const getSlots = async () => {
      const slots = await getAvailableSlots()
      setSlots(slots)
    }
    getSlots()
  }, [])

  return (
    <div className="min-h-screen bg-[#e4edf1] dark:from-gray-900 dark:to-gray-800">
      <header className="bg-[#c2d6df] dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
                <>
                <Link href={"/UserProfile"}>
                  <span>{user?.fullName}</span>
                </Link>
              <UserButton afterSignOutUrl="/sign-in" />
                </>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.fullName}</CardTitle>
              <CardDescription>Here's a summary of your admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have {slots.length} available slots and the current equity percentage is{" "}
                {equityPercentage || "N/A"}.
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
              <CardTitle>Slot Management</CardTitle>
              <CardDescription>Create and manage available time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSlotManager initialSlots={slots} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Equity Statement Upload</CardTitle>
              <CardDescription>Upload new equity statements to update the system</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminEquityManager />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
