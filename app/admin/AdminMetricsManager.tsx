import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminMetricsManagerProps } from "@/utils/types"

export const AdminMetricsManager: React.FC<AdminMetricsManagerProps> = ({
  isOpen,
  onClose,
  onUpdate,
  currentAmount
}) => {
  const [amount, setAmount] = useState(currentAmount.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(Number(amount));
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Total Investments</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter total investments"
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};