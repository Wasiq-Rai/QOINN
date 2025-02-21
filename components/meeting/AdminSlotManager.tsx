"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSlot, deleteSlot } from "@/app/actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

interface Slot {
  id: string
  datetime: string
}

export default function AdminSlotManager({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState(initialSlots)
  const [newSlot, setNewSlot] = useState("")

  const handleCreateSlot = async () => {
    try {
      const createdSlot = await createSlot(newSlot)
      setSlots([...slots, createdSlot])
      setNewSlot("")
    } catch (error) {
      console.error("Error creating slot:", error)
      // Handle error (e.g., show error message to admin)
    }
  }

  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteSlot(id)
      setSlots(slots.filter((slot) => slot.id !== id))
    } catch (error) {
      console.error("Error deleting slot:", error)
      // Handle error (e.g., show error message to admin)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date and Time</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{new Date(slot.datetime).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Create New Slot</h3>
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <Label htmlFor="newSlot">New Slot Date and Time</Label>
            <Input id="newSlot" type="datetime-local" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} />
          </div>
          <Button onClick={handleCreateSlot}>Create Slot</Button>
        </div>
      </div>
    </div>
  )
}

