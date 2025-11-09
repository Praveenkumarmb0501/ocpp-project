import { Zap, Bot, Clock, BatteryCharging } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const metrics = [
  { icon: Zap, label: 'Charging Power', value: '7.2 kW' },
  { icon: BatteryCharging, label: 'Energy Delivered', value: '24.5 kWh' },
  { icon: Clock, label: 'Session Duration', value: '3h 25m' },
  { icon: Bot, label: 'Est. Full Charge', value: '1h 15m' },
];

export function ChargeMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
