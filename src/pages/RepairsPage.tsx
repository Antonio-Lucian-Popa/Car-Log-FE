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
import { Plus, Wrench, Search, Filter, Download, BarChart3 } from 'lucide-react';
import { RepairCard } from '@/components/repairs/RepairCard';
import { RepairForm } from '@/components/repairs/RepairForm';
import { RepairStats } from '@/components/repairs/RepairStats';
import { RepairLog, Car } from '@/types';
import { repairService } from '@/services/repairService';
import { carService } from '@/services/carService';
import { toast } from 'sonner';

export function RepairsPage() {
  const [repairLogs, setRepairLogs] = useState<RepairLog[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRepairLog, setEditingRepairLog] = useState<RepairLog | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [repairData, carData] = await Promise.all([
        repairService.getAllRepairs(),
        carService.getCars()
      ]);
      setRepairLogs(repairData);
      setCars(carData);
    } catch (error) {
      toast.error('Eroare la încărcarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepairLog = async (data: any) => {
    setFormLoading(true);
    try {
      const newRepairLog = await repairService.createRepair(data);
      setRepairLogs([...repairLogs, newRepairLog]);
      setFormOpen(false);
      toast.success('Reparația a fost adăugată cu succes');
    } catch (error) {
      toast.error('Eroare la adăugarea reparației');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditRepairLog = async (data: any) => {
    if (!editingRepairLog) return;
    
    setFormLoading(true);
    try {
      const updatedRepairLog = await repairService.updateRepair(editingRepairLog.id, data);
      setRepairLogs(repairLogs.map(log => log.id === editingRepairLog.id ? updatedRepairLog : log));
      setEditingRepairLog(undefined);
      setFormOpen(false);
      toast.success('Reparația a fost actualizată cu succes');
    } catch (error) {
      toast.error('Eroare la actualizarea reparației');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRepairLog = async (id: string) => {
    try {
      await repairService.deleteRepair(id);
      setRepairLogs(repairLogs.filter(log => log.id !== id));
      toast.success('Reparația a fost ștearsă cu succes');
    } catch (error) {
      toast.error('Eroare la ștergerea reparației');
    }
  };

  const openEditForm = (repairLog: RepairLog) => {
    setEditingRepairLog(repairLog);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingRepairLog(undefined);
    setFormOpen(true);
  };

  const getRepairCategory = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('ulei')) return 'ulei';
    if (desc.includes('frane') || desc.includes('placute')) return 'frane';
    if (desc.includes('motor')) return 'motor';
    if (desc.includes('anvelope') || desc.includes('roti')) return 'anvelope';
    if (desc.includes('baterie') || desc.includes('electric')) return 'electric';
    if (desc.includes('revizie')) return 'revizie';
    return 'altele';
  };

  // Filter and sort repair logs
  const filteredAndSortedLogs = React.useMemo(() => {
    let filtered = repairLogs.filter(log => {
      const car = cars.find(c => c.id === log.carId);
      const matchesSearch = !searchTerm || 
        car?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car?.numberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCar = selectedCar === 'all' || log.carId === selectedCar;
      const matchesCategory = selectedCategory === 'all' || getRepairCategory(log.description) === selectedCategory;
      
      return matchesSearch && matchesCar && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'cost-desc':
          return b.cost - a.cost;
        case 'cost-asc':
          return a.cost - b.cost;
        default:
          return 0;
      }
    });

    return filtered;
  }, [repairLogs, cars, searchTerm, selectedCar, selectedCategory, sortBy]);

  const exportData = () => {
    const csvContent = [
      ['Data', 'Mașina', 'Descriere', 'Cost', 'Service'].join(','),
      ...filteredAndSortedLogs.map(log => {
        const car = cars.find(c => c.id === log.carId);
        return [
          log.date,
          `"${car?.name || ''}"`,
          `"${log.description}"`,
          log.cost.toFixed(2),
          `"${log.service || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reparatii_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className="space-y-6">
        <div className='flex flex-col mb-4 items-start'>
          <h1 className="text-3xl font-bold">Reparații</h1>
          <p className="text-muted-foreground">
            Ține evidența reparațiilor și cheltuielilor de întreținere
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Nicio mașină înregistrată
            </CardTitle>
            <CardDescription>
              Pentru a putea înregistra reparații, trebuie să ai cel puțin o mașină adăugată în sistem.
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
      <div className="flex items-center justify-between flex-wrap mb-4">
        <div className='flex flex-col mb-4 items-start'>
          <h1 className="text-3xl font-bold mb-2">Reparații</h1>
          <p className="text-muted-foreground text-left">
            Ține evidența reparațiilor și cheltuielilor de întreținere
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportData} disabled={repairLogs.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă reparație
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Lista reparațiilor</TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistici
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <RepairStats repairLogs={repairLogs} cars={cars} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Căutare</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Caută mașină, descriere..."
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
                  <label className="text-sm font-medium">Categorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate categoriile</SelectItem>
                      <SelectItem value="ulei">Schimb ulei</SelectItem>
                      <SelectItem value="frane">Sistem frânare</SelectItem>
                      <SelectItem value="motor">Motor</SelectItem>
                      <SelectItem value="anvelope">Anvelope</SelectItem>
                      <SelectItem value="electric">Sistem electric</SelectItem>
                      <SelectItem value="revizie">Revizie</SelectItem>
                      <SelectItem value="altele">Altele</SelectItem>
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
                      <SelectItem value="cost-desc">Cost (mare → mic)</SelectItem>
                      <SelectItem value="cost-asc">Cost (mic → mare)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCar('all');
                      setSelectedCategory('all');
                      setSortBy('date-desc');
                    }}
                    className="w-full"
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
                <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {repairLogs.length === 0 ? 'Nicio reparație înregistrată' : 'Niciun rezultat găsit'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {repairLogs.length === 0 
                    ? 'Începe prin a adăuga prima ta reparație.'
                    : 'Încearcă să modifici filtrele pentru a găsi reparațiile dorite.'
                  }
                </p>
                {repairLogs.length === 0 && (
                  <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adaugă prima reparație
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedLogs.length} reparații găsite
                  {filteredAndSortedLogs.length !== repairLogs.length && ` din ${repairLogs.length} total`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedLogs.map((repairLog) => {
                  const car = cars.find(c => c.id === repairLog.carId);
                  return (
                    <RepairCard
                      key={repairLog.id}
                      repairLog={repairLog}
                      carName={car?.name || 'Mașină necunoscută'}
                      onEdit={openEditForm}
                      onDelete={handleDeleteRepairLog}
                    />
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <RepairForm
        repairLog={editingRepairLog}
        cars={cars}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingRepairLog ? handleEditRepairLog : handleCreateRepairLog}
        loading={formLoading}
      />
    </div>
  );
}