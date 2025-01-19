import { getAvailableSlots, createSlot } from '@/app/actions'
import AdminSlotManager from '@/components/meeting/AdminSlotManager'

export default async function AdminPage() {
  const slots = await getAvailableSlots()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminSlotManager initialSlots={slots} />
    </div>
  )
}

