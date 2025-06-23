import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Fuel, Search, Filter, Download, BarChart3 } from 'lucide-react';
import { FuelCard } from '@/components/fuel/FuelCard';
import { FuelForm } from '@/components/fuel/FuelForm';
import { FuelStats } from '@/components/fuel/FuelStats';
import { FuelLog, Car } from '@/types';
import { fuelService } from '@/services/fuelService';
import { carService } from '@/services/carService';
import { toast } from 'sonner';

export function FuelPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState<FuelLog | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState<string>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fuelData, carData] = await Promise.all([
        fuelService.getAllFuelLogs(),
        carService.getCars()
      ]);
      setFuelLogs(fuelData);
      setCars(carData);
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFuelLog = async (data: any) => {
    setFormLoading(true);
    try {
      const newFuelLog = await fuelService.createFuelLog(data);
      setFuelLogs([...fuelLogs, newFuelLog]);
      setFormOpen(false);
      toast.success('Alimentarea a fost adăugată cu succes');
    } catch (error) {
      toast.error('Eroare la adăugarea alimentării');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditFuelLog = async (data: any) => {
    if (!editingFuelLog) return;
    
    setFormLoading(true);
    try {
      const updatedFuelLog = await fuelService.updateFuelLog(editingFuelLog.id, data);
      setFuelLogs(fuelLogs.map(log => log.id === editingFuelLog.id ? updatedFuelLog : log));
      setEditingFuelLog(undefined);
      setFormOpen(false);
      toast.success('Alimentarea a fost actualizată cu succes');
    } catch (error) {
      toast.error('Eroare la actualizarea alimentării');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteFuelLog = async (id: string) => {
    try {
      await fuelService.deleteFuelLog(id);
      setFuelLogs(fuelLogs.filter(log => log.id !== id));
      toast.success('Alimentarea a fost ștearsă cu succes');
    } catch (error) {
      toast.error('Eroare la ștergerea alimentării');
    }
  };

  const openEditForm = (fuelLog: FuelLog) => {
    setEditingFuelLog(fuelLog);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingFuelLog(undefined);
    setFormOpen(true);
  };

  // Filter and sort fuel logs
  const filteredAndSortedLogs = React.useMemo(() => {
    let filtered = fuelLogs.filter(log => {
      const car = cars.find(c => c.id === log.carId);
      const matchesSearch = !searchTerm || 
        car?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car?.numberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.station?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCar = selectedCar === 'all' || log.carId === selectedCar;
      const matchesFuelType = selectedFuelType === 'all' || log.fuelType === selectedFuelType;
      
      return matchesSearch && matchesCar && matchesFuelType;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        case 'liters-desc':
          return b.liters - a.liters;
        case 'liters-asc':
          return a.liters - b.liters;
        default:
          return 0;
      }
    });

    return filtered;
  }, [fuelLogs, cars, searchTerm, selectedCar, selectedFuelType, sortBy]);

  const exportData = () => {
    const csvContent = [
      ['Data', 'Mașina', 'Kilometraj', 'Litri', 'Preț Total', 'Preț/Litru', 'Tip Combustibil', 'Stație', 'Notițe'].join(','),
      ...filteredAndSortedLogs.map(log => {
        const car = cars.find(c => c.id === log.carId);
        const pricePerLiter = log.price / log.liters;
        return [
          log.date,
          `"${car?.name || ''}"`,
          log.odometer,
          log.liters,
          log.price.toFixed(2),
          pricePerLiter.toFixed(3),
          log.fuelType || '',
          `"${log.station || ''}"`,
          `"${log.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `alimentari_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Datele au fost exportate cu succes');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Alimentări</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Monitorizează consumul de combustibil și costurile
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Fuel className="mr-2 h-5 w-5" />
              Nicio mașină înregistrată
            </CardTitle>
            <CardDescription>
              Pentru a putea înregistra alimentări, trebuie să ai cel puțin o mașină adăugată în sistem.
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
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Alimentări</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Monitorizează consumul de combustibil și costurile
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={exportData} disabled={fuelLogs.length === 0} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={openCreateForm} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adaugă alimentare
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="text-sm">Lista alimentărilor</TabsTrigger>
          <TabsTrigger value="stats" className="text-sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistici
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <FuelStats fuelLogs={fuelLogs} cars={cars} />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-5 w-5" />
                Filtrare și sortare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Căutare</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută mașină, stație..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mașina</label>
                  <Select value={selectedCar} onValueChange={setSelectedCar}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate mașinile</SelectItem>
                      {cars.map(car => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.name} - {car.numberPlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tip combustibil</label>
                  <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate tipurile</SelectItem>
                      <SelectItem value="benzina">Benzină</SelectItem>
                      <SelectItem value="motorina">Motorină</SelectItem>
                      <SelectItem value="gpl">GPL</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hibrid">Hibrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sortare</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Data (nou → vechi)</SelectItem>
                      <SelectItem value="date-asc">Data (vechi → nou)</SelectItem>
                      <SelectItem value="price-desc">Preț (mare → mic)</SelectItem>
                      <SelectItem value="price-asc">Preț (mic → mare)</SelectItem>
                      <SelectItem value="liters-desc">Litri (mult → puțin)</SelectItem>
                      <SelectItem value="liters-asc">Litri (puțin → mult)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCar('all');
                      setSelectedFuelType('all');
                      setSortBy('date-desc');
                    }}
                    className="w-full"
                    size="sm"
                  >
                    Resetează
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredAndSortedLogs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Fuel className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {fuelLogs.length === 0 ? 'Nicio alimentare înregistrată' : 'Niciun rezultat găsit'}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {fuelLogs.length === 0 
                    ? 'Începe prin a adăuga prima ta alimentare.'
                    : 'Încearcă să modifici filtrele pentru a găsi alimentările dorite.'
                  }
                </p>
                {fuelLogs.length === 0 && (
                  <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adaugă prima alimentare
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedLogs.length} alimentări găsite
                  {filteredAndSortedLogs.length !== fuelLogs.length && ` din ${fuelLogs.length} total`}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredAndSortedLogs.map((fuelLog) => {
                  const car = cars.find(c => c.id === fuelLog.carId);
                  return (
                    <FuelCard
                      key={fuelLog.id}
                      fuelLog={fuelLog}
                      carName={car?.name || 'Mașină necunoscută'}
                      onEdit={openEditForm}
                      onDelete={handleDeleteFuelLog}
                    />
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <FuelForm
        fuelLog={editingFuelLog}
        cars={cars}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingFuelLog ? handleEditFuelLog : handleCreateFuelLog}
        loading={formLoading}
      />
    </div>
  );
}