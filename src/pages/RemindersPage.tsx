import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Bell, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { ReminderForm } from '@/components/reminders/ReminderForm';
import { ReminderStats } from '@/components/reminders/ReminderStats';
import { Reminder, Car, ReminderType } from '@/types';
import { reminderService } from '@/services/reminderService';
import { carService } from '@/services/carService';
import { toast } from 'sonner';
import { differenceInDays, isPast } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [carsData] = await Promise.all([
        carService.getCars(),
      ]);
      setCars(carsData);

      // Load reminders for all cars
      if (carsData.length > 0) {
        const allReminders: Reminder[] = [];
        for (const car of carsData) {
          try {
            const carReminders = await reminderService.getReminders(car.id);
            allReminders.push(...carReminders);
          } catch (error) {
            console.error(`Failed to load reminders for car ${car.id}:`, error);
          }
        }
        setReminders(allReminders);
      }
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async (data: any) => {
    setFormLoading(true);
    try {
      const newReminder = await reminderService.createReminder(data.carId, {
        type: data.type,
        dueDate: data.dueDate.toISOString(),
        repeatDays: data.repeatDays,
        notified: false,
        carId: data.carId,
      });
      setReminders([...reminders, newReminder]);
      setFormOpen(false);
      toast.success('Reminder-ul a fost adăugat cu succes');
    } catch (error) {
      toast.error('Eroare la adăugarea reminder-ului');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditReminder = async (data: any) => {
    if (!editingReminder) return;
    
    setFormLoading(true);
    try {
      const updatedReminder = await reminderService.updateReminder(editingReminder.id, {
        type: data.type,
        dueDate: data.dueDate.toISOString(),
        repeatDays: data.repeatDays,
      });
      setReminders(reminders.map(r => r.id === editingReminder.id ? updatedReminder : r));
      setEditingReminder(undefined);
      setFormOpen(false);
      toast.success('Reminder-ul a fost actualizat cu succes');
    } catch (error) {
      toast.error('Eroare la actualizarea reminder-ului');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
      toast.success('Reminder-ul a fost șters cu succes');
    } catch (error) {
      toast.error('Eroare la ștergerea reminder-ului');
    }
  };

  const handleMarkNotified = async (id: string) => {
    try {
      const updatedReminder = await reminderService.updateReminder(id, { notified: true });
      setReminders(reminders.map(r => r.id === id ? updatedReminder : r));
      toast.success('Reminder-ul a fost marcat ca notificat');
    } catch (error) {
      toast.error('Eroare la actualizarea reminder-ului');
    }
  };

  const openEditForm = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingReminder(undefined);
    setFormOpen(true);
  };

  // Filter reminders
  const filteredReminders = reminders.filter(reminder => {
    const carMatch = selectedCar === 'all' || reminder.carId === selectedCar;
    const typeMatch = selectedType === 'all' || reminder.type === selectedType;
    return carMatch && typeMatch;
  });

  // Categorize reminders
  const overdueReminders = filteredReminders.filter(r => isPast(new Date(r.dueDate)));
  const urgentReminders = filteredReminders.filter(r => {
    const days = differenceInDays(new Date(r.dueDate), new Date());
    return days <= 7 && days >= 0;
  });
  const upcomingReminders = filteredReminders.filter(r => {
    const days = differenceInDays(new Date(r.dueDate), new Date());
    return days > 7;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">
            Gestionează notificările pentru ITP, RCA, revizie și schimb ulei
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Nu ai mașini înregistrate
            </CardTitle>
            <CardDescription>
              Pentru a crea reminders, trebuie să ai cel puțin o mașină înregistrată în sistem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Adaugă prima mașină
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className='lg:flex lg:flex-col lg:mb-4 lg:items-start'>
          <h1 className="text-2xl lg:text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Gestionează notificările pentru ITP, RCA, revizie și schimb ulei
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Adaugă Reminder
        </Button>
      </div>

      <ReminderStats reminders={filteredReminders} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtrare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedCar} onValueChange={setSelectedCar}>
                <SelectTrigger>
                  <SelectValue placeholder="Toate mașinile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate mașinile</SelectItem>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.name} - {car.numberPlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Toate tipurile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate tipurile</SelectItem>
                  <SelectItem value={ReminderType.ITP}>ITP</SelectItem>
                  <SelectItem value={ReminderType.RCA}>RCA</SelectItem>
                  <SelectItem value={ReminderType.ULEI}>Schimb Ulei</SelectItem>
                  <SelectItem value={ReminderType.REVIZIE}>Revizie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredReminders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Nu ai reminders
            </CardTitle>
            <CardDescription>
              Începe prin a adăuga primul tău reminder pentru întreținerea mașinii.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Adaugă primul reminder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              Toate ({filteredReminders.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-red-600">
              Expirate ({overdueReminders.length})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-yellow-600">
              Urgente ({urgentReminders.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Viitoare ({upcomingReminders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={openEditForm}
                  onDelete={handleDeleteReminder}
                  onMarkNotified={handleMarkNotified}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            {overdueReminders.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold text-green-600">Excelent!</h3>
                    <p className="text-muted-foreground">Nu ai reminders expirate.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overdueReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={openEditForm}
                    onDelete={handleDeleteReminder}
                    onMarkNotified={handleMarkNotified}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            {urgentReminders.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold text-green-600">Totul sub control!</h3>
                    <p className="text-muted-foreground">Nu ai reminders urgente în următoarele 7 zile.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {urgentReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={openEditForm}
                    onDelete={handleDeleteReminder}
                    onMarkNotified={handleMarkNotified}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={openEditForm}
                  onDelete={handleDeleteReminder}
                  onMarkNotified={handleMarkNotified}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <ReminderForm
        reminder={editingReminder}
        cars={cars}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingReminder ? handleEditReminder : handleCreateReminder}
        loading={formLoading}
      />
    </div>
  );
}