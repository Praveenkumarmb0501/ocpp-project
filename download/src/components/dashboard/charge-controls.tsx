'use client';
import { useState } from 'react';
import { QrCode, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PairChargerDialog } from './pair-charger-dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '../ui/card';

type ChargeControlsProps = {
  isCharging: boolean;
  onToggleCharging: () => void;
};

export function ChargeControls({ isCharging, onToggleCharging }: ChargeControlsProps) {
  const [chargerPaired, setChargerPaired] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border p-6 min-h-[190px] bg-secondary/50">
        <div className="flex items-center gap-4">
          <Badge variant={chargerPaired ? 'default' : 'secondary'} className="text-sm">
            {chargerPaired ? "Charger: My Garage" : 'No Charger Paired'}
          </Badge>
          <Badge variant={isCharging ? 'secondary' : 'outline'} className="text-sm">
            Status: {isCharging ? 'Charging' : 'Connected'}
          </Badge>
        </div>
        
        {chargerPaired ? (
          <div className="flex gap-4">
            <Button size="lg" onClick={onToggleCharging} className="w-48 shadow-lg">
              <Power className="mr-2 h-5 w-5" />
              {isCharging ? 'Stop Charging' : 'Start Charging'}
            </Button>
          </div>
        ) : (
          <Button size="lg" onClick={() => setDialogOpen(true)} className="shadow-lg">
            <QrCode className="mr-2 h-5 w-5" />
            Pair Charger
          </Button>
        )}
      </div>
      <PairChargerDialog open={dialogOpen} onOpenChange={setDialogOpen} onPair={() => { setChargerPaired(true); setDialogOpen(false); }} />
    </>
  );
}
