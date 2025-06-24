import React from 'react';
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
import { Reminder, ReminderType, Car } from '@/types';

const reminderSchema = z.object({
  type: z.nativeEnum(ReminderType, {
    required_error: 'Tipul de reminder este obligatoriu',
  }),
  dueDate: z.date({
    required_error: 'Data scadentă este obligatorie',
  }),
  repeatDays: z.number().min(1).max(365).optional(),
  carId: z.string().min(1, 'Mașina este obligatorie'),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  reminder?: Reminder;
  cars: Car[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReminderFormData) => Promise<void>;
  loading?: boolean;
}

const reminderTypeOptions = [
  { value: ReminderType.ITP, label: 'ITP (Inspecție Tehnică Periodică)' },
  { value: ReminderType.RCA, label: 'RCA (Asigurare Auto)' },
  { value: ReminderType.ULEI, label: 'Schimb Ulei' },
  { value: ReminderType.REVIZIE, label: 'Revizie Tehnică' },
];

export function ReminderForm({ 
  reminder, 
  cars, 
  open, 
  onOpenChange, 
  onSubmit, 
  loading 
}: ReminderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder ? {
      type: reminder.type,
      dueDate: new Date(reminder.dueDate),
      repeatDays: reminder.repeatDays || undefined,
      carId: reminder.carId,
    } : {
      type: undefined,
      dueDate: undefined,
      repeatDays: undefined,
      carId: '',
    },
  });

  const selectedDate = watch('dueDate');
  const selectedType = watch('type');

  const handleFormSubmit = async (data: ReminderFormData) => {
    // get car id selected from the form
    const carId = watch('carId');
    data.carId = carId;
    await onSubmit(data);
    reset();
  };

  const getDefaultRepeatDays = (type: ReminderType) => {
    switch (type) {
      case ReminderType.ITP:
        return 365; // 1 an
      case ReminderType.RCA:
        return 365; // 1 an
      case ReminderType.ULEI:
        return 180; // 6 luni
      case ReminderType.REVIZIE:
        return 365; // 1 an
      default:
        return undefined;
    }
  };

  const handleTypeChange = (type: ReminderType) => {
    setValue('type', type);
    const defaultDays = getDefaultRepeatDays(type);
    if (defaultDays) {
      setValue('repeatDays', defaultDays);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {reminder ? 'Editează Reminder' : 'Adaugă Reminder Nou'}
          </DialogTitle>
          <DialogDescription>
            {reminder 
              ? 'Modifică detaliile reminder-ului.' 
              : 'Creează un reminder pentru întreținerea mașinii tale.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            <Label htmlFor="type">Tipul reminder-ului</Label>
            <Select
              value={selectedType}
              onValueChange={handleTypeChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează tipul" />
              </SelectTrigger>
              <SelectContent>
                {reminderTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data scadentă</Label>
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
                  onSelect={(date) => setValue('dueDate', date!)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatDays">Repetare (zile) - opțional</Label>
            <Input
              id="repeatDays"
              type="number"
              min="1"
              max="365"
              placeholder="ex: 365 pentru anual"
              {...register('repeatDays', { valueAsNumber: true })}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Lasă gol dacă nu vrei să se repete automat
            </p>
            {errors.repeatDays && (
              <p className="text-sm text-destructive">{errors.repeatDays.message}</p>
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
              {loading ? 'Se salvează...' : reminder ? 'Actualizează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}