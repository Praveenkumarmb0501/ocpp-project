import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, Zap, BatteryFull } from 'lucide-react';

const notifications = [
  {
    id: 1,
    icon: Zap,
    title: 'Charging Started',
    description: 'Your vehicle has started charging.',
    time: '2 minutes ago',
  },
  {
    id: 2,
    icon: Bell,
    title: 'Charging Update: 50%',
    description: 'Your vehicle has reached 50% charge.',
    time: '30 minutes ago',
  },
  {
    id: 3,
    icon: BatteryFull,
    title: 'Charging Complete',
    description: 'Your vehicle is fully charged at 100%.',
    time: '1 hour ago',
  },
  {
    id: 4,
    icon: Zap,
    title: 'Charging Paused',
    description: 'Charging has been paused from the app.',
    time: '3 hours ago',
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Review your recent alerts and charging updates.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg border bg-secondary/50">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <notification.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
