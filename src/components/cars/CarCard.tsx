import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Car, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Car as CarType } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface CarCardProps {
  car: CarType;
  onEdit: (car: CarType) => void;
  onDelete: (id: string) => void;
  onView: (car: CarType) => void;
}

export function CarCard({ car, onEdit, onDelete, onView }: CarCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{car.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(car)}>
              <Eye className="mr-2 h-4 w-4" />
              Vizualizează
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(car)}>
              <Edit className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(car.id)}
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
            <span className="text-sm text-muted-foreground">Model:</span>
            <span className="font-medium">{car.model}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">An:</span>
            <Badge variant="secondary">{car.year}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Număr:</span>
            <span className="font-mono text-sm">{car.numberPlate}</span>
          </div>
          {car.vin && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">VIN:</span>
              <span className="font-mono text-xs">{car.vin.slice(-8)}</span>
            </div>
          )}
          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Adăugată: {format(new Date(car.createdAt), 'dd MMM yyyy', { locale: ro })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}