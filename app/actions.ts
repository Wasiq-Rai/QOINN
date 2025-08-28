"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";
import nodemailer from "nodemailer";
import { API_URL } from "@/utils/api";

// --- 📩 Email Transport ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // false = STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- 📌 Meetings ---
export async function scheduleInvestmentMeeting(data: {
  name: string;
  email: string;
  phone: string;
  investmentAmount: number;
  message: string;
}) {
  try {
    // Save to Django backend
    const res = await axios.post(`${API_URL}/meetings/`, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      investment_amount: data.investmentAmount,
      message: data.message,
      is_approved: false,
    });

    // --- Confirmation Email to User ---
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.email,
      subject: "QOINN - Investment Meeting Scheduled",
      text: `Hi ${data.name},\n\nYour investment meeting has been scheduled successfully. We'll confirm with you shortly.\n\nThank you!\nQOINN Team`,
    });

    // --- Notification Email to Admin ---
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      subject: "New Investment Meeting Request",
      text: `New meeting request:\n
      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone}
      Amount: ${data.investmentAmount}
      Message: ${data.message}`,
    });

    revalidatePath("/admin");
    return { success: true, meetingId: res.data.id };
  } catch (error: any) {
    console.error(
      "Error scheduling meeting:",
      error.response?.data || error.message
    );

    return { success: false, error: "Failed to schedule meeting" };
  }
}

// ✅ Get all meetings
export async function getAllMeetings() {
  try {
    const res = await fetch(`${API_URL}/meetings/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always get fresh data
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch meetings: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching meetings:", error)
    throw error
  }
}

// ✅ Approve meeting
export async function approveInvestmentMeeting(id: string) {
  try {
    const res = await fetch(`${API_URL}/meetings/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_approved: true }),
    })

    if (!res.ok) {
      throw new Error(`Failed to approve meeting: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Error approving meeting:", error)
    throw error
  }
}

// ✅ Mark meeting complete
export async function markMeetingComplete(id: string) {
  try {
    const res = await fetch(`${API_URL}/meetings/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_completed: true }),
    })

    if (!res.ok) {
      throw new Error(`Failed to mark meeting complete: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Error marking meeting complete:", error)
    throw error
  }
}
