import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const sessionHistory = [
  { id: 1, date: '2024-07-28', duration: '4h 15m', energy: '30.2 kWh', cost: '$3.62' },
  { id: 2, date: '2024-07-26', duration: '2h 30m', energy: '18.0 kWh', cost: '$2.16' },
  { id: 3, date: '2024-07-24', duration: '5h 0m', energy: '35.0 kWh', cost: '$4.20' },
  { id: 4, date: '2024-07-22', duration: '3h 45m', energy: '26.8 kWh', cost: '$3.21' },
  { id: 5, date: '2024-07-20', duration: '1h 55m', energy: '13.5 kWh', cost: '$1.62' },
  { id: 6, date: '2024-07-18', duration: '6h 10m', energy: '42.1 kWh', cost: '$5.05' },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
        <p className="text-muted-foreground">
          Review your past charging sessions and costs.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Energy Delivered</TableHead>
                <TableHead className="text-right">Estimated Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionHistory.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.date}</TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>{session.energy}</TableCell>
                  <TableCell className="text-right">{session.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
