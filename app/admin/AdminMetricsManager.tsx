import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminMetricsManagerProps } from "@/utils/types"

export const AdminMetricsManager: React.FC<AdminMetricsManagerProps> = ({
  isOpen,
  onClose,
  onUpdate,
  currentAmount,
  currentInvestors
}) => {
  const [amount, setAmount] = useState(currentAmount.toString());
  const [ investors, setInvestors ] = useState(currentInvestors.toString());

  useEffect(() => {
    setAmount(currentAmount.toString());
  }, [currentAmount]);

  useEffect(() => {
    setInvestors(currentInvestors.toString());
  }, [currentInvestors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(Number(amount), Number(investors));
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Metrics</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="investments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Investments ($)
              </label>
              <Input
                id="investments"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter total investments"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="investors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Investors
              </label>
              <Input
                id="investors"
                type="number"
                value={investors}
                onChange={(e) => setInvestors(e.target.value)}
                placeholder="Enter total investors"
                className="w-full"
              />
            </div>
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