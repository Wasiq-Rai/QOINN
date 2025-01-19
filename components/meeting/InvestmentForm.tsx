'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scheduleInvestmentMeeting } from "@/app/actions";

export default function InvestmentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      email,
      phone,
      investmentAmount,
      message,
      selectedSlot,
    });
    try {
      await scheduleInvestmentMeeting({
        name,
        email,
        phone,
        investmentAmount,
        message,
        selectedSlot,
      }).then(async (response) => {
        console.log("data", response);
        response.success
          ? router.push("/invest/confirmation")
          : console.log("EMail could not be sent");
      });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white shadow-md rounded px-4 py-6">
          <h2 className="text-lg font-bold mb-2">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded px-4 py-6 mt-4">
          <h2 className="text-lg font-bold mb-2">Investment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investmentAmount">Investment Amount</Label>
              <Input
                id="investmentAmount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded px-4 py-6 mt-4">
          <h2 className="text-lg font-bold mb-2">Available Slots</h2>
          <div>
            <Select onValueChange={setSelectedSlot} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {/* These would be dynamically populated from the server */}
                <SelectItem value="2024-01-01T10:00:00.000Z">
                  January 1, 2024 - 10:00 AM
                </SelectItem>
                <SelectItem value="2024-01-01T11:00:00.000Z">
                  January 1, 2024 - 11:00 AM (Booked)
                </SelectItem>
                <SelectItem value="2024-01-01T12:00:00.000Z">
                  January 1, 2024 - 12:00 PM
                </SelectItem>
                <SelectItem value="2024-01-01T13:00:00.000Z">
                  January 1, 2024 - 1:00 PM (Booked)
                </SelectItem>
                <SelectItem value="2024-01-01T14:00:00.000Z">
                  January 1, 2024 - 2:00 PM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="mt-4 bg-[#3498db] text-white hover:bg-[#2980b9] transition duration-300">
          Schedule Meeting
        </Button>
      </form>
    </div>
  );
}