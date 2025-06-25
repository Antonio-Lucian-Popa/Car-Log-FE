/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Car as CarIcon, Gauge, Wrench, Bell } from 'lucide-react';
import { CarCard } from '@/components/cars/CarCard';
import { CarForm } from '@/components/cars/CarForm';
import { Car } from '@/types';
import { carService } from '@/services/carService';
import { toast } from 'sonner';

export function DashboardPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await carService.getCars();
      setCars(data);
    } catch (error) {
      toast.error('Eroare la încărcarea mașinilor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCar = async (data: any) => {
    setFormLoading(true);
    try {
      const newCar = await carService.createCar(data);
      setCars([...cars, newCar]);
      setFormOpen(false);
      toast.success('Mașina a fost adăugată cu succes');
    } catch (error) {
      toast.error('Eroare la adăugarea mașinii');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCar = async (data: any) => {
    if (!editingCar) return;
    
    setFormLoading(true);
    try {
      const updatedCar = await carService.updateCar(editingCar.id, data);
      setCars(cars.map(car => car.id === editingCar.id ? updatedCar : car));
      setEditingCar(undefined);
      setFormOpen(false);
      toast.success('Mașina a fost actualizată cu succes');
    } catch (error) {
      toast.error('Eroare la actualizarea mașinii');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCar = async (id: string) => {
    try {
      await carService.deleteCar(id);
      setCars(cars.filter(car => car.id !== id));
      toast.success('Mașina a fost ștearsă cu succes');
    } catch (error) {
      toast.error('Eroare la ștergerea mașinii');
    }
  };

  const openEditForm = (car: Car) => {
    setEditingCar(car);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingCar(undefined);
    setFormOpen(true);
  };

  const handleViewCar = (car: Car) => {
    // Navigate to car details page
    console.log('View car:', car);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className='lg:flex lg:flex-col lg:mb-4 lg:items-start'>
          <h1 className="text-2xl lg:text-3xl font-bold">Mașinile mele</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Gestionează și monitorizează mașinile tale
          </p>
        </div>
        <Button onClick={openCreateForm} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă mașină
        </Button>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <CarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nu ai nicio mașină înregistrată</h3>
          <p className="mt-2 text-muted-foreground text-sm">
            Începe prin a adăuga prima ta mașină în carnet.
          </p>
          <Button className="mt-4" onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă prima mașină
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onEdit={openEditForm}
                onDelete={handleDeleteCar}
                onView={handleViewCar}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Mașini</CardTitle>
                <CarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cars.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alimentări luna aceasta</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reminders active</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <CarForm
        car={editingCar}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingCar ? handleEditCar : handleCreateCar}
        loading={formLoading}
      />
    </div>
  );
}