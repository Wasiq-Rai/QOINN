"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  fetchNewsLetterSubscribers, 
  toggleNewsLetterSubscriptionStatus,
  deleteNewsLetterSubscriber,
  addNewsLetterSubscriber,
} from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { 
  Loader2, 
  Mail, 
  MailCheck, 
  MailMinus, 
  RefreshCw, 
  Plus,
  Trash2,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as XLSX from 'xlsx';

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
  is_active: boolean;
}

export function NewsletterSubscribers() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNewsLetterSubscribers();
      if (!data) throw new Error('Failed to fetch subscribers');
      setSubscribers(data);
    } catch (error) {
      toast.error('Error loading subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubscriptionStatus = async (id: number) => {
    setIsUpdating(id);
    try {
      const response: any = await toggleNewsLetterSubscriptionStatus(id);
      
      if (!response) throw new Error('Failed to update subscriber');
      
      setSubscribers(subscribers.map(sub => 
        sub.id === id ? { ...sub, is_active: !sub.is_active } : sub
      ));
      toast.success('Subscription status updated');
    } catch (error) {
      toast.error('Error updating subscriber');
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteSubscriber = async (id: number) => {
    setIsDeleting(id);
    try {
      const success = await deleteNewsLetterSubscriber(id);
      if (!success) throw new Error('Failed to delete subscriber');
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      toast.success('Subscriber deleted successfully');
    } catch (error) {
      toast.error('Error deleting subscriber');
    } finally {
      setIsDeleting(null);
    }
  };

  const addSubscriber = async () => {
    if (!newSubscriberEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsAdding(true);
    try {
      const newSubscriber = await addNewsLetterSubscriber(newSubscriberEmail);
      if (!newSubscriber) throw new Error('Failed to add subscriber');
      
      setSubscribers([newSubscriber, ...subscribers]);
      setNewSubscriberEmail("");
      setIsDialogOpen(false);
      toast.success('Subscriber added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error adding subscriber');
    } finally {
      setIsAdding(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      // Option 1: Use API endpoint that returns Excel file
      // await exportNewsLetterSubscribers(); // Uncomment if using API endpoint
      
      // Option 2: Generate Excel file on client side
      const data = subscribers.map(sub => ({
        Email: sub.email,
        Status: sub.is_active ? 'Active' : 'Inactive',
        'Subscribed On': new Date(sub.created_at).toLocaleDateString(),
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
      XLSX.writeFile(workbook, "newsletter_subscribers.xlsx");
      
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Error exporting subscribers');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSubscribers();
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" />
          Newsletter Subscribers
        </h2>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscriber</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newSubscriberEmail}
                  onChange={(e) => setNewSubscriberEmail(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={addSubscriber}
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Subscriber
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel}
            disabled={isExporting || subscribers.length === 0}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            Export to Excel
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSubscribers}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSubscriptionStatus(subscriber.id)}
                        disabled={isUpdating === subscriber.id}
                      >
                        {isUpdating === subscriber.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : subscriber.is_active ? (
                          <MailMinus className="h-4 w-4" />
                        ) : (
                          <MailCheck className="h-4 w-4" />
                        )}
                        <span className="ml-2">
                          {subscriber.is_active ? "Deactivate" : "Activate"}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteSubscriber(subscriber.id)}
                        disabled={isDeleting === subscriber.id}
                      >
                        {isDeleting === subscriber.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="ml-2">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}