import React from 'react';
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
import { FuelLog, Car } from '@/types';
import { format } from 'date-fns';

const fuelSchema = z.object({
  date: z.string().min(1, 'Data este obligatorie'),
  odometer: z.number().min(0, 'Kilometrajul trebuie să fie pozitiv'),
  liters: z.number().min(0.1, 'Cantitatea trebuie să fie mai mare de 0'),
  pricePerLiter: z.number().min(0.1, 'Prețul pe litru trebuie să fie mai mare de 0'),
  totalPrice: z.number().min(0.1, 'Prețul total trebuie să fie mai mare de 0'),
  station: z.string().optional(),
  fuelType: z.string().min(1, 'Tipul combustibilului este obligatoriu'),
  notes: z.string().optional(),
  carId: z.string().min(1, 'Mașina este obligatorie'),
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

export function FuelForm({ fuelLog, cars, open, onOpenChange, onSubmit, loading }: FuelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FuelFormData>({
    resolver: zodResolver(fuelSchema),
    defaultValues: fuelLog ? {
      date: format(new Date(fuelLog.date), 'yyyy-MM-dd'),
      odometer: fuelLog.odometer,
      liters: fuelLog.liters,
      pricePerLiter: fuelLog.price / fuelLog.liters,
      totalPrice: fuelLog.price,
      station: fuelLog.station || '',
      fuelType: fuelLog.fuelType || 'benzina',
      notes: fuelLog.notes || '',
      carId: fuelLog.carId,
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      odometer: 0,
      liters: 0,
      pricePerLiter: 0,
      totalPrice: 0,
      station: '',
      fuelType: 'benzina',
      notes: '',
      carId: cars[0]?.id || '',
    },
  });

  const liters = watch('liters');
  const pricePerLiter = watch('pricePerLiter');

  // Auto-calculate total price
  React.useEffect(() => {
    if (liters && pricePerLiter) {
      setValue('totalPrice', Number((liters * pricePerLiter).toFixed(2)));
    }
  }, [liters, pricePerLiter, setValue]);

  const handleFormSubmit = async (data: FuelFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{fuelLog ? 'Editează alimentarea' : 'Adaugă alimentare nouă'}</DialogTitle>
          <DialogDescription>
            {fuelLog 
              ? 'Modifică detaliile alimentării.' 
              : 'Completează detaliile pentru a înregistra o nouă alimentare.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carId">Mașina</Label>
              <Select
                value={watch('carId')}
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
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                disabled={loading}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Kilometraj</Label>
              <Input
                id="odometer"
                type="number"
                placeholder="ex: 50000"
                {...register('odometer', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.odometer && (
                <p className="text-sm text-destructive">{errors.odometer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Tip combustibil</Label>
              <Select
                value={watch('fuelType')}
                onValueChange={(value) => setValue('fuelType', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tipul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benzina">Benzină</SelectItem>
                  <SelectItem value="motorina">Motorină</SelectItem>
                  <SelectItem value="gpl">GPL</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hibrid">Hibrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && (
                <p className="text-sm text-destructive">{errors.fuelType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Litri</Label>
              <Input
                id="liters"
                type="number"
                step="0.01"
                placeholder="ex: 45.5"
                {...register('liters', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.liters && (
                <p className="text-sm text-destructive">{errors.liters.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerLiter">Preț/litru (RON)</Label>
              <Input
                id="pricePerLiter"
                type="number"
                step="0.001"
                placeholder="ex: 6.85"
                {...register('pricePerLiter', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.pricePerLiter && (
                <p className="text-sm text-destructive">{errors.pricePerLiter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total (RON)</Label>
              <Input
                id="totalPrice"
                type="number"
                step="0.01"
                placeholder="ex: 311.75"
                {...register('totalPrice', { valueAsNumber: true })}
                disabled={loading}
                className="bg-muted"
                readOnly
              />
              {errors.totalPrice && (
                <p className="text-sm text-destructive">{errors.totalPrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="station">Stația de alimentare (opțional)</Label>
            <Input
              id="station"
              placeholder="ex: Petrom, OMV, Rompetrol"
              {...register('station')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notițe (opțional)</Label>
            <Textarea
              id="notes"
              placeholder="ex: Alimentare completă, preț promoțional"
              {...register('notes')}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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