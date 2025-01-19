"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSlot, deleteSlot } from '@/app/actions'

interface Slot {
  id: string
  datetime: string
}

export default function AdminSlotManager({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState(initialSlots)
  const [newSlot, setNewSlot] = useState('')

  const handleCreateSlot = async () => {
    try {
      const createdSlot = await createSlot(newSlot)
      setSlots([...slots, createdSlot])
      setNewSlot('')
    } catch (error) {
      console.error('Error creating slot:', error)
      // Handle error (e.g., show error message to admin)
    }
  }

  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteSlot(id)
      setSlots(slots.filter(slot => slot.id !== id))
    } catch (error) {
      console.error('Error deleting slot:', error)
      // Handle error (e.g., show error message to admin)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Slots</h2>
        <ul className="space-y-2">
          {slots.map(slot => (
            <li key={slot.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{new Date(slot.datetime).toLocaleString()}</span>
              <Button variant="destructive" onClick={() => handleDeleteSlot(slot.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Create New Slot</h2>
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <Label htmlFor="newSlot">New Slot Date and Time</Label>
            <Input
              id="newSlot"
              type="datetime-local"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateSlot}>Create Slot</Button>
        </div>
      </div>
    </div>
  )
}
