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
import { Fuel, MoreHorizontal, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { FuelLog } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface FuelCardProps {
  fuelLog: FuelLog;
  carName: string;
  onEdit: (fuelLog: FuelLog) => void;
  onDelete: (id: string) => void;
}

const fuelTypeColors = {
  benzina: 'bg-blue-100 text-blue-800',
  motorina: 'bg-green-100 text-green-800',
  gpl: 'bg-purple-100 text-purple-800',
  electric: 'bg-yellow-100 text-yellow-800',
  hibrid: 'bg-orange-100 text-orange-800',
};

const fuelTypeLabels = {
  benzina: 'Benzină',
  motorina: 'Motorină',
  gpl: 'GPL',
  electric: 'Electric',
  hibrid: 'Hibrid',
};

export function FuelCard({ fuelLog, carName, onEdit, onDelete }: FuelCardProps) {
  const pricePerLiter = fuelLog.price / fuelLog.liters;
  const fuelType = fuelLog.fuelType || 'benzina';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Fuel className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{carName}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(fuelLog)}>
              <Edit className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(fuelLog.id)}
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
              {format(new Date(fuelLog.date), 'dd MMM yyyy', { locale: ro })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Kilometraj:</span>
            <span className="font-mono text-sm">{fuelLog.odometer.toLocaleString()} km</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Combustibil:</span>
            <Badge className={fuelTypeColors[fuelType as keyof typeof fuelTypeColors]}>
              {fuelTypeLabels[fuelType as keyof typeof fuelTypeLabels]}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{fuelLog.liters}L</div>
              <div className="text-xs text-muted-foreground">Cantitate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{fuelLog.price.toFixed(2)} RON</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Preț/litru:</span>
            <span className="font-medium">{pricePerLiter.toFixed(3)} RON</span>
          </div>

          {fuelLog.station && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                Stație:
              </span>
              <span className="font-medium">{fuelLog.station}</span>
            </div>
          )}

          {fuelLog.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground italic">{fuelLog.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}