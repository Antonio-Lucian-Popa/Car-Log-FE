import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wrench, MoreHorizontal, Edit, Trash2, MapPin, Calendar, DollarSign } from 'lucide-react';
import { RepairLog } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface RepairCardProps {
  repairLog: RepairLog;
  carName: string;
  onEdit: (repairLog: RepairLog) => void;
  onDelete: (id: string) => void;
}

const getRepairTypeColor = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('ulei') || desc.includes('schimb')) return 'bg-blue-100 text-blue-800';
  if (desc.includes('frane') || desc.includes('placute')) return 'bg-red-100 text-red-800';
  if (desc.includes('motor') || desc.includes('revizie')) return 'bg-orange-100 text-orange-800';
  if (desc.includes('anvelope') || desc.includes('roti')) return 'bg-green-100 text-green-800';
  if (desc.includes('baterie') || desc.includes('electric')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const getRepairTypeLabel = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('ulei')) return 'Schimb ulei';
  if (desc.includes('frane')) return 'Sistem frânare';
  if (desc.includes('motor')) return 'Motor';
  if (desc.includes('anvelope')) return 'Anvelope';
  if (desc.includes('baterie')) return 'Sistem electric';
  if (desc.includes('revizie')) return 'Revizie';
  return 'Reparație generală';
};

export function RepairCard({ repairLog, carName, onEdit, onDelete }: RepairCardProps) {
  const repairType = getRepairTypeLabel(repairLog.description);
  const colorClass = getRepairTypeColor(repairLog.description);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{carName}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(repairLog)}>
              <Edit className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(repairLog.id)}
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
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              Data:
            </span>
            <span className="font-medium">
              {format(new Date(repairLog.date), 'dd MMM yyyy', { locale: ro })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tip reparație:</span>
            <Badge className={colorClass}>
              {repairType}
            </Badge>
          </div>

          <div className="pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5 mr-1" />
                {repairLog.cost.toFixed(2)} RON
              </div>
              <div className="text-xs text-muted-foreground">Cost total</div>
            </div>
          </div>

          {repairLog.service && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                Service:
              </span>
              <span className="font-medium">{repairLog.service}</span>
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-1">Descriere:</div>
            <p className="text-sm font-medium leading-relaxed">{repairLog.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}