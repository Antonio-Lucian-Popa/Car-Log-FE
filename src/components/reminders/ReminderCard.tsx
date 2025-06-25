/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Reminder, ReminderType } from '@/types';
import { format, differenceInDays, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onMarkNotified: (id: string) => void;
}

const reminderTypeConfig = {
  [ReminderType.ITP]: {
    label: 'ITP',
    color: 'bg-blue-500',
    icon: CheckCircle,
  },
  [ReminderType.RCA]: {
    label: 'RCA',
    color: 'bg-green-500',
    icon: CheckCircle,
  },
  [ReminderType.ULEI]: {
    label: 'Schimb Ulei',
    color: 'bg-orange-500',
    icon: Clock,
  },
  [ReminderType.REVIZIE]: {
    label: 'Revizie',
    color: 'bg-purple-500',
    icon: Clock,
  },
};

export function ReminderCard({ reminder, onEdit, onDelete, onMarkNotified }: ReminderCardProps) {
  const config = reminderTypeConfig[reminder.type];
  const Icon = config.icon;
  const dueDate = new Date(reminder.dueDate);
  const daysUntilDue = differenceInDays(dueDate, new Date());
  const isOverdue = isPast(dueDate);
  const isUrgent = daysUntilDue <= 7 && daysUntilDue >= 0;

  const getStatusBadge = () => {
    if (isOverdue) {
      return <Badge variant="destructive">Expirat</Badge>;
    }
    if (isUrgent) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Urgent</Badge>;
    }
    if (reminder.notified) {
      return <Badge variant="outline">Notificat</Badge>;
    }
    return <Badge variant="secondary">Activ</Badge>;
  };

  const getDaysText = () => {
    if (isOverdue) {
      return `${Math.abs(daysUntilDue)} zile întârziere`;
    }
    if (daysUntilDue === 0) {
      return 'Astăzi';
    }
    if (daysUntilDue === 1) {
      return 'Mâine';
    }
    return `${daysUntilDue} zile rămase`;
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200",
      isOverdue && "border-red-200 bg-red-50/50",
      isUrgent && "border-yellow-200 bg-yellow-50/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-full", config.color)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{config.label}</CardTitle>
            {getStatusBadge()}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(reminder)}>
              <Edit className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            {!reminder.notified && (
              <DropdownMenuItem onClick={() => onMarkNotified(reminder.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marchează ca notificat
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(reminder.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Șterge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Data scadentă:</span>
            <span className="font-medium">
              {format(dueDate, 'dd MMM yyyy', { locale: ro })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={cn(
              "text-sm font-medium",
              isOverdue && "text-red-600",
              isUrgent && "text-yellow-600",
              !isOverdue && !isUrgent && "text-green-600"
            )}>
              {getDaysText()}
            </span>
          </div>

          {reminder.repeatDays && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Repetare:</span>
              <span className="text-sm">La fiecare {reminder.repeatDays} zile</span>
            </div>
          )}

          {(isOverdue || isUrgent) && (
            <div className="flex items-center space-x-2 p-2 rounded-md bg-yellow-50 border border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                {isOverdue ? 'Atenție! Acest reminder a expirat.' : 'Atenție! Scadența se apropie.'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}