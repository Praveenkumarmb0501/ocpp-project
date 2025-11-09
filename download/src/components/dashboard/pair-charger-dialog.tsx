'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

type PairChargerDialogProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onPair: (chargerId: string) => void;
};

export function PairChargerDialog({ open, onOpenChange, onPair }: PairChargerDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const chargerId = formData.get('chargerId') as string;
    if (chargerId) {
      onPair(chargerId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Pair New Charger</DialogTitle>
            <DialogDescription>
              Scan the QR code on your charger or enter the ID manually below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <div className="w-full h-full p-8 flex items-center justify-center">
                <Camera className="w-24 h-24 text-muted-foreground/50" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="chargerId">Charger ID</Label>
              <Input id="chargerId" name="chargerId" placeholder="e.g., AMP-12345" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Pair Charger</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
