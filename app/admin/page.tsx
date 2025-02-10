'use client'
import { getAvailableSlots, createSlot } from "@/app/actions";
import AdminSlotManager from "@/components/meeting/AdminSlotManager";
import { useEquity } from "@/context/EquityContext";
import { useEffect, useState } from "react";
import { AdminEquityManager } from "./AdminEquityManager";

export default function AdminPage() {
  const { equityPercentage } = useEquity();
  const [slots, setSlots] = useState<any>([]);

  useEffect(()=>{
    const getSlots=async ()=>{
      const slots = await getAvailableSlots();
      setSlots(slots);
    }
    getSlots();

  },[])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminSlotManager initialSlots={slots} />
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Current Equity Percentage
        </h2>
        <div className="text-3xl text-blue-600">
          {equityPercentage || "N/A"}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload New Statement</h2>
        <AdminEquityManager />
      </div>
    </div>
  );
}
