import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Calendar
} from 'lucide-react';
import { Reminder } from '@/types';
import { differenceInDays, isPast } from 'date-fns';

interface ReminderStatsProps {
  reminders: Reminder[];
}

export function ReminderStats({ reminders }: ReminderStatsProps) {
  const totalReminders = reminders.length;
  const overdueReminders = reminders.filter(r => isPast(new Date(r.dueDate))).length;
  const urgentReminders = reminders.filter(r => {
    const days = differenceInDays(new Date(r.dueDate), new Date());
    return days <= 7 && days >= 0;
  }).length;
  const notifiedReminders = reminders.filter(r => r.notified).length;

  const stats = [
    {
      title: 'Total Reminders',
      value: totalReminders,
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Expirate',
      value: overdueReminders,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Urgente (≤7 zile)',
      value: urgentReminders,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Notificate',
      value: notifiedReminders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}