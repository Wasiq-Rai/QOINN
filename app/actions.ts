"use server"

import { revalidatePath } from "next/cache"
import fs from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'

const DATA_FILE = path.join(process.cwd(), 'data.json')

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
}

export async function readData(): Promise<{ slots: Slot[], meetings: Meeting[] }> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { slots: [], meetings: [] }
  }
}

export async function getSlots(){
    const { slots, meetings } = await readData()
    return slots;

}

export async function writeData(data: { slots: Slot[], meetings: Meeting[] }) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function sendEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
  })
}

export async function scheduleInvestmentMeeting(data: {
  name: string
  email: string
  phone: string
  investmentAmount: string
  message: string
  selectedSlot: string
}) {
  try {
    const { slots, meetings } = await readData()
    const slot = slots.find(s => s.datetime === data.selectedSlot)
    if (!slot) {
      throw new Error("Selected slot is not available")
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      investmentAmount: parseFloat(data.investmentAmount),
      message: data.message,
      slotId: data.selectedSlot,
      isApproved: false,
    }

    meetings.push(newMeeting)

    await writeData({ slots, meetings })

    // Send confirmation email to user
    await sendEmail(
      data.email,
      "Investment Meeting Scheduled",
      `Dear ${data.name},\n\nYour meeting to discuss investing in QOINN has been scheduled for ${slot.datetime}.\n\nBest regards,\nQOINN Team`
    )

    // Send notification email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || "qoinninvestment@gmail.com",
      "New Investment Meeting Scheduled",
      `A new investment meeting has been scheduled:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nInvestment Amount: ${data.investmentAmount}\nMessage: ${data.message}\nSelected Slot: ${slot.datetime}`
    )

    revalidatePath('/admin')
    return { success: true, meetingId: newMeeting.id }
  } catch (error) {
    console.error("Error scheduling meeting:", error)
    return { success: false, error: "Failed to schedule meeting. Please try again." }
  }
}

export async function getAvailableSlots() {
  const { slots } = await readData()
  return slots.filter(slot => !slot.isBooked)
}

export async function createSlot(datetime: string) {
  const { slots, meetings } = await readData()
  const newSlot: Slot = {
    id: Date.now().toString(),
    datetime,
    isBooked: false,
  }
  slots.push(newSlot)
  await writeData({ slots, meetings })
  revalidatePath('/admin')
  return newSlot
}

export async function deleteSlot(id: string) {
  const { slots, meetings } = await readData()
  const updatedSlots = slots.filter(slot => slot.id !== id)
  await writeData({ slots: updatedSlots, meetings })
  revalidatePath('/admin')
  return { success: true }
}

export async function approveInvestmentMeeting(meetingId: string) {
  const { slots, meetings } = await readData()
  const meeting = meetings.find(m => m.id === meetingId)
  
  if (!meeting) {
    throw new Error("Meeting not found")
  }

  meeting.isApproved = true
  await writeData({ slots, meetings })

  // Send approval email to user
  await sendEmail(
    meeting.email,
    "Investment Meeting Approved",
    `Dear ${meeting.name},\n\nYour investment meeting scheduled for ${slots.find(s => s.id === meeting.slotId)?.datetime} has been approved. You will receive a Zoom link closer to the meeting time.\n\nBest regards,\nQOINN Team`
  )

  revalidatePath('/admin')
  return { success: true }
}

export async function getPendingMeetings() {
  const { meetings, slots } = await readData()
  return meetings
    .filter(m => !m.isApproved)
    .map(m => ({
      ...m,
      slot: slots.find(s => s.id === m.slotId)
    }))
    .sort((a, b) => new Date(a.slot?.datetime || '').getTime() - new Date(b.slot?.datetime || '').getTime())
}

