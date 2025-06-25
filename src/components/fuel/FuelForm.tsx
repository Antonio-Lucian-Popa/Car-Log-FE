import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { FuelLog, Car } from '@/types';

const fuelSchema = z.object({
  carId: z.string().min(1, 'Mașina este obligatorie'),
  date: z.date({
    required_error: 'Data este obligatorie',
  }),
  odometer: z.number().min(0, 'Kilometrajul trebuie să fie pozitiv'),
  liters: z.number().min(0.1, 'Cantitatea trebuie să fie mai mare de 0'),
  price: z.number().min(0.01, 'Prețul trebuie să fie mai mare de 0'),
  station: z.string().optional(),
});

type FuelFormData = z.infer<typeof fuelSchema>;

interface FuelFormProps {
  fuelLog?: FuelLog;
  cars: Car[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FuelFormData) => Promise<void>;
  loading?: boolean;
}

export function FuelForm({ 
  fuelLog, 
  cars, 
  open, 
  onOpenChange, 
  onSubmit, 
  loading 
}: FuelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FuelFormData>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      carId: '',
      date: new Date(),
      odometer: 0,
      liters: 0,
      price: 0,
      station: '',
    },
  });

  const selectedDate = watch('date');
  const selectedCarId = watch('carId');

  // Reset form when fuelLog data changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (fuelLog) {
        reset({
          carId: fuelLog.carId,
          date: new Date(fuelLog.date),
          odometer: fuelLog.odometer,
          liters: fuelLog.liters,
          price: fuelLog.price,
          station: fuelLog.station || '',
        });
      } else {
        reset({
          carId: '',
          date: new Date(),
          odometer: 0,
          liters: 0,
          price: 0,
          station: '',
        });
      }
    }
  }, [fuelLog, open, reset]);

  const handleFormSubmit = async (data: FuelFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {fuelLog ? 'Editează Alimentarea' : 'Adaugă Alimentare Nouă'}
          </DialogTitle>
          <DialogDescription>
            {fuelLog 
              ? 'Modifică detaliile alimentării.' 
              : 'Înregistrează o nouă alimentare pentru mașina ta.'
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
            <Label>Data alimentării</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Kilometraj</Label>
              <Input
                id="odometer"
                type="number"
                min="0"
                step="1"
                placeholder="ex: 50000"
                {...register('odometer', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.odometer && (
                <p className="text-sm text-destructive">{errors.odometer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="liters">Litri</Label>
              <Input
                id="liters"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="ex: 45.5"
                {...register('liters', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.liters && (
                <p className="text-sm text-destructive">{errors.liters.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preț total (RON)</Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="ex: 250.50"
              {...register('price', { valueAsNumber: true })}
              disabled={loading}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="station">Stația (opțional)</Label>
            <Input
              id="station"
              placeholder="ex: Petrom, OMV, Rompetrol"
              {...register('station')}
              disabled={loading}
            />
            {errors.station && (
              <p className="text-sm text-destructive">{errors.station.message}</p>
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
              {loading ? 'Se salvează...' : fuelLog ? 'Actualizează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}