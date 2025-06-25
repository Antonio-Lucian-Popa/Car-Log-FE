import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { RepairLog, Car } from '@/types';

const repairSchema = z.object({
  carId: z.string().min(1, 'Mașina este obligatorie'),
  date: z.date({
    required_error: 'Data este obligatorie',
  }),
  description: z.string().min(1, 'Descrierea este obligatorie'),
  cost: z.number().min(0, 'Costul trebuie să fie pozitiv'),
  service: z.string().optional(),
});

type RepairFormData = z.infer<typeof repairSchema>;

interface RepairFormProps {
  repairLog?: RepairLog;
  cars: Car[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RepairFormData) => Promise<void>;
  loading?: boolean;
}

export function RepairForm({ 
  repairLog, 
  cars, 
  open, 
  onOpenChange, 
  onSubmit, 
  loading 
}: RepairFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      carId: '',
      date: new Date(),
      description: '',
      cost: 0,
      service: '',
    },
  });

  const selectedDate = watch('date');
  const selectedCarId = watch('carId');

  // Reset form when repairLog data changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (repairLog) {
        reset({
          carId: repairLog.carId,
          date: new Date(repairLog.date),
          description: repairLog.description,
          cost: repairLog.cost,
          service: repairLog.service || '',
        });
      } else {
        reset({
          carId: '',
          date: new Date(),
          description: '',
          cost: 0,
          service: '',
        });
      }
    }
  }, [repairLog, open, reset]);

  const handleFormSubmit = async (data: RepairFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {repairLog ? 'Editează Reparația' : 'Adaugă Reparație Nouă'}
          </DialogTitle>
          <DialogDescription>
            {repairLog 
              ? 'Modifică detaliile reparației.' 
              : 'Înregistrează o nouă reparație pentru mașina ta.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carId">Mașina</Label>
            <Select
              value={selectedCarId}
              onValueChange={(value) => setValue('carId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează mașina" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.name} - {car.numberPlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.carId && (
              <p className="text-sm text-destructive">{errors.carId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data reparației</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'dd MMM yyyy', { locale: ro })
                  ) : (
                    "Selectează data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setValue('date', date!)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrierea reparației</Label>
            <Textarea
              id="description"
              placeholder="ex: Schimb plăcuțe frână față, revizie motor..."
              {...register('description')}
              disabled={loading}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (RON)</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="ex: 450.00"
              {...register('cost', { valueAsNumber: true })}
              disabled={loading}
            />
            {errors.cost && (
              <p className="text-sm text-destructive">{errors.cost.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service/Atelier (opțional)</Label>
            <Input
              id="service"
              placeholder="ex: Service Auto Dacia, Bosch Car Service"
              {...register('service')}
              disabled={loading}
            />
            {errors.service && (
              <p className="text-sm text-destructive">{errors.service.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Se salvează...' : repairLog ? 'Actualizează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}