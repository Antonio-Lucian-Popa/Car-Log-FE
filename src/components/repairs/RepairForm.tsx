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
import { RepairLog, Car } from '@/types';
import { format } from 'date-fns';

const repairSchema = z.object({
  date: z.string().min(1, 'Data este obligatorie'),
  description: z.string().min(1, 'Descrierea este obligatorie'),
  cost: z.number().min(0, 'Costul trebuie să fie pozitiv'),
  service: z.string().optional(),
  carId: z.string().min(1, 'Mașina este obligatorie'),
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

const commonRepairTypes = [
  'Schimb ulei motor',
  'Schimb filtru ulei',
  'Schimb plăcuțe frână',
  'Schimb discuri frână',
  'Schimb anvelope',
  'Echilibrare roți',
  'Schimb baterie',
  'Revizie tehnică',
  'Schimb bujii',
  'Schimb filtru aer',
  'Schimb filtru combustibil',
  'Schimb lichid frână',
  'Schimb antigel',
  'Reparație motor',
  'Reparație transmisie',
  'Reparație suspensie',
  'Reparație sistem electric',
  'Reparație aer condiționat',
];

export function RepairForm({ repairLog, cars, open, onOpenChange, onSubmit, loading }: RepairFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues: repairLog ? {
      date: format(new Date(repairLog.date), 'yyyy-MM-dd'),
      description: repairLog.description,
      cost: repairLog.cost,
      service: repairLog.service || '',
      carId: repairLog.carId,
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      cost: 0,
      service: '',
      carId: cars[0]?.id || '',
    },
  });

  const handleFormSubmit = async (data: RepairFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleQuickSelect = (description: string) => {
    setValue('description', description);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{repairLog ? 'Editează reparația' : 'Adaugă reparație nouă'}</DialogTitle>
          <DialogDescription>
            {repairLog 
              ? 'Modifică detaliile reparației.' 
              : 'Completează detaliile pentru a înregistra o nouă reparație.'
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

          <div className="space-y-2">
            <Label htmlFor="description">Descrierea reparației</Label>
            <Textarea
              id="description"
              placeholder="ex: Schimb ulei motor și filtru ulei"
              {...register('description')}
              disabled={loading}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
            
            {/* Quick select buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Selectare rapidă:</Label>
              <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                {commonRepairTypes.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => handleQuickSelect(type)}
                    disabled={loading}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (RON)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="ex: 250.00"
                {...register('cost', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.cost && (
                <p className="text-sm text-destructive">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service (opțional)</Label>
              <Input
                id="service"
                placeholder="ex: AutoService SRL"
                {...register('service')}
                disabled={loading}
              />
            </div>
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
              {loading ? 'Se salvează...' : repairLog ? 'Actualizează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}