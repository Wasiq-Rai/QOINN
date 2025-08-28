// app/admin/MeetingsPanel.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"
import { Check, DoneAll } from "@mui/icons-material"
import { approveInvestmentMeeting, getAllMeetings, markMeetingComplete } from "@/app/actions"

interface Meeting {
  id: string
  name: string
  email: string
  phone: string
  investment_amount: number
  message: string
  is_approved: boolean
  is_completed?: boolean
}

export default function MeetingsPanel() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getAllMeetings()
      setMeetings(data)
    } catch (error) {
      console.error("Error fetching meetings:", error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await approveInvestmentMeeting(id)
      fetchData()
    } catch (error) {
      console.error("Error approving meeting:", error)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      await markMeetingComplete(id)
      fetchData()
    } catch (error) {
      console.error("Error marking complete:", error)
    }
  }

  const filteredMeetings = meetings.filter((m) => {
    if (filter === "all") return true
    if (filter === "approved") return m.is_approved
    if (filter === "pending") return !m.is_approved
    if (filter === "completed") return m.is_completed
    return true
  })

  const statusSummary = {
    approved: meetings.filter((m) => m.is_approved && !m.is_completed).length,
    pending: meetings.filter((m) => !m.is_approved).length,
    completed: meetings.filter((m) => m.is_completed).length,
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Meetings Panel</h1>

      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex gap-4 text-sm">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            Approved: {statusSummary.approved}
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
            Pending: {statusSummary.pending}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            Completed: {statusSummary.completed}
          </div>
        </div>

        <FormControl className="min-w-[200px]">
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="max-h-[500px] overflow-auto rounded-xl border border-gray-200">
        <TableContainer component={Paper} className="rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{meeting.name}</TableCell>
                  <TableCell>{meeting.email}</TableCell>
                  <TableCell>{meeting.phone}</TableCell>
                  <TableCell>${meeting.investment_amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {meeting.is_completed
                      ? "Completed"
                      : meeting.is_approved
                      ? "Approved"
                      : "Pending"}
                  </TableCell>
                  <TableCell>
                    {!meeting.is_approved && (
                      <Button
                        onClick={() => handleApprove(meeting.id)}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Check />}
                        className="mr-2"
                      >
                        Approve
                      </Button>
                    )}
                    {meeting.is_approved && !meeting.is_completed && (
                      <Button
                        onClick={() => handleComplete(meeting.id)}
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<DoneAll />}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}
