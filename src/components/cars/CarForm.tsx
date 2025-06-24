import React, { useEffect } from 'react';
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
import { Car } from '@/types';

const carSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  model: z.string().min(1, 'Modelul este obligatoriu'),
  year: z.number().min(1900).max(2030),
  numberPlate: z.string().min(1, 'Numărul de înmatriculare este obligatoriu'),
  vin: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

interface CarFormProps {
  car?: Car;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CarFormData) => Promise<void>;
  loading?: boolean;
}

export function CarForm({ car, open, onOpenChange, onSubmit, loading }: CarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: '',
      model: '',
      year: new Date().getFullYear(),
      numberPlate: '',
      vin: '',
    },
  });

  // Reset form when car data changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (car) {
        reset({
          name: car.name,
          model: car.model,
          year: car.year,
          numberPlate: car.numberPlate,
          vin: car.vin || '',
        });
      } else {
        reset({
          name: '',
          model: '',
          year: new Date().getFullYear(),
          numberPlate: '',
          vin: '',
        });
      }
    }
  }, [car, open, reset]);

  const handleFormSubmit = async (data: CarFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{car ? 'Editează mașina' : 'Adaugă mașină nouă'}</DialogTitle>
          <DialogDescription>
            {car 
              ? 'Modifică detaliile mașinii tale.' 
              : 'Completează detaliile pentru a adăuga o mașină nouă în carnet.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nume/Porecla</Label>
            <Input
              id="name"
              placeholder="ex: Mașina principală"
              {...register('name')}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              placeholder="ex: BMW X5"
              {...register('model')}
              disabled={loading}
            />
            {errors.model && (
              <p className="text-sm text-destructive">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">An fabricație</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max="2030"
              {...register('year', { valueAsNumber: true })}
              disabled={loading}
            />
            {errors.year && (
              <p className="text-sm text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberPlate">Număr înmatriculare</Label>
            <Input
              id="numberPlate"
              placeholder="ex: B123ABC"
              {...register('numberPlate')}
              disabled={loading}
            />
            {errors.numberPlate && (
              <p className="text-sm text-destructive">{errors.numberPlate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (opțional)</Label>
            <Input
              id="vin"
              placeholder="ex: 1HGBH41JXMN109186"
              {...register('vin')}
              disabled={loading}
            />
            {errors.vin && (
              <p className="text-sm text-destructive">{errors.vin.message}</p>
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
              {loading ? 'Se salvează...' : car ? 'Actualizează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}