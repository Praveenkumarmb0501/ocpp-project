'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChargeStatus } from '@/components/dashboard/charge-status';
import { ChargeMetrics } from '@/components/dashboard/charge-metrics';
import { ChargeControls } from '@/components/dashboard/charge-controls';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [isCharging, setIsCharging] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground">
            Monitor and control your EV charging in real-time.
          </p>
        </div>
        <Link href="/notifications">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Charging Controls</CardTitle>
            <CardDescription>Start, stop, and manage your charging sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChargeControls isCharging={isCharging} onToggleCharging={() => setIsCharging(prev => !prev)} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Status</CardTitle>
            <CardDescription>Current battery state of charge.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChargeStatus isCharging={isCharging} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Session Metrics</CardTitle>
          <CardDescription>Key statistics for the current charging session.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChargeMetrics />
        </CardContent>
      </Card>
    </div>
  );
}
