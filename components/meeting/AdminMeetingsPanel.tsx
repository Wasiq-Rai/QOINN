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
import { getSlots, readData, writeData } from "@/app/actions"
import { approveInvestmentMeeting } from "@/app/actions"

interface Slot {
  id: string
  datetime: string
  isBooked: boolean
}

interface Meeting {
  id: string
  name: string
  email: string
  phone: string
  investmentAmount: number
  message: string
  slotId: string
  isApproved: boolean
  isCompleted?: boolean
  slot?: Slot
}

export default function MeetingsPanel() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { slots, meetings } = await readData()
    const enrichedMeetings = meetings.map((m) => ({
      ...m,
      slot: slots.find((s) => s.id === m.slotId),
    }))
    setSlots(slots)
    setMeetings(enrichedMeetings)
  }

  const handleApprove = async (id: string) => {
    const updatedMeetings = meetings.map((m) =>
      m.id === id ? { ...m, isApproved: true } : m
    )
    await writeData({ meetings: updatedMeetings, slots })
    approveInvestmentMeeting(id);
    fetchData()
  }

  const handleComplete = async (id: string) => {
    const updatedMeetings = meetings.map((m) =>
      m.id === id ? { ...m, isCompleted: true } : m
    )
    await writeData({ meetings: updatedMeetings, slots })
    fetchData()
  }

  const filteredMeetings = meetings.filter((m) => {
    if (filter === "all") return true
    if (filter === "approved") return m.isApproved
    if (filter === "pending") return !m.isApproved
    if (filter === "completed") return m.isCompleted
    return true
  })

  const statusSummary = {
    approved: meetings.filter((m) => m.isApproved && !m.isCompleted).length,
    pending: meetings.filter((m) => !m.isApproved).length,
    completed: meetings.filter((m) => m.isCompleted).length,
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
                <TableCell>Slot</TableCell>
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
                  <TableCell>${meeting.investmentAmount.toLocaleString()}</TableCell>
                  <TableCell>{meeting.slot?.datetime || meeting.slotId}</TableCell>
                  <TableCell>
                    {meeting.isCompleted
                      ? "Completed"
                      : meeting.isApproved
                      ? "Approved"
                      : "Pending"}
                  </TableCell>
                  <TableCell>
                    {!meeting.isApproved && (
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
                    {meeting.isApproved && !meeting.isCompleted && (
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
