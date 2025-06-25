/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Calendar,
  DollarSign,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { RepairLog, Car } from '@/types';

interface RepairStatsProps {
  repairLogs: RepairLog[];
  cars: Car[];
}

export function RepairStats({ repairLogs, cars }: RepairStatsProps) {
  // Calculate statistics
  const totalSpent = repairLogs.reduce((sum, log) => sum + log.cost, 0);
  const averageCost = repairLogs.length > 0 ? totalSpent / repairLogs.length : 0;
  
  // Monthly statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthLogs = repairLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  });
  
  const thisMonthSpent = thisMonthLogs.reduce((sum, log) => sum + log.cost, 0);

  // Last month comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthLogs = repairLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === lastMonth && logDate.getFullYear() === lastMonthYear;
  });
  
  const lastMonthSpent = lastMonthLogs.reduce((sum, log) => sum + log.cost, 0);
  const spendingTrend = lastMonthSpent > 0 ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100 : 0;

  // Most expensive repair
  const mostExpensiveRepair = repairLogs.reduce((max, log) => 
    log.cost > max.cost ? log : max, repairLogs[0] || { cost: 0, description: 'N/A' }
  );

  // Repair type analysis
  const repairTypes = repairLogs.reduce((acc, log) => {
    const desc = log.description.toLowerCase();
    let category = 'Altele';
    
    if (desc.includes('ulei')) category = 'Schimb ulei';
    else if (desc.includes('frane') || desc.includes('placute')) category = 'Sistem frânare';
    else if (desc.includes('motor')) category = 'Motor';
    else if (desc.includes('anvelope') || desc.includes('roti')) category = 'Anvelope';
    else if (desc.includes('baterie') || desc.includes('electric')) category = 'Sistem electric';
    else if (desc.includes('revizie')) category = 'Revizie';
    
    acc[category] = (acc[category] || 0) + log.cost;
    return acc;
  }, {} as Record<string, number>);

  const mostExpensiveCategory = Object.entries(repairTypes).reduce((a, b) => 
    repairTypes[a[0]] > repairTypes[b[0]] ? a : b
  )?.[0] || 'N/A';

  // Yearly statistics
  const currentYearLogs = repairLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === currentYear;
  });
  
  const yearlySpent = currentYearLogs.reduce((sum, log) => sum + log.cost, 0);

  // Average monthly spending
  const monthsWithData = new Set(repairLogs.map(log => {
    const date = new Date(log.date);
    return `${date.getFullYear()}-${date.getMonth()}`;
  })).size;
  
  const averageMonthlySpending = monthsWithData > 0 ? totalSpent / monthsWithData : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total cheltuit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalSpent.toFixed(2)} RON</div>
          <p className="text-xs text-muted-foreground">
            {repairLogs.length} reparații înregistrate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Luna aceasta</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisMonthSpent.toFixed(2)} RON</div>
          <div className="flex items-center text-xs">
            {spendingTrend !== 0 && (
              <>
                {spendingTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                )}
                <span className={spendingTrend > 0 ? 'text-red-500' : 'text-green-500'}>
                  {Math.abs(spendingTrend).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs luna trecută</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost mediu/reparație</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCost.toFixed(2)} RON</div>
          <p className="text-xs text-muted-foreground">
            Media pe {repairLogs.length} reparații
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anul acesta</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{yearlySpent.toFixed(2)} RON</div>
          <p className="text-xs text-muted-foreground">
            {currentYearLogs.length} reparații în {currentYear}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Cea mai scumpă reparație
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mostExpensiveRepair.cost > 0 ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-700">
                {mostExpensiveRepair.cost.toFixed(2)} RON
              </div>
              <div className="text-sm text-red-600 mt-1">
                {mostExpensiveRepair.description}
              </div>
              <div className="text-xs text-red-500 mt-2">
                {new Date(mostExpensiveRepair.date).toLocaleDateString('ro-RO')}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nicio reparație înregistrată încă
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Categorii de reparații</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(repairTypes)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, cost]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{category}</div>
                    <div className="text-sm text-muted-foreground">
                      {((cost / totalSpent) * 100).toFixed(1)}% din total
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{cost.toFixed(2)} RON</div>
                  </div>
                </div>
              ))}
            
            {Object.keys(repairTypes).length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                Nicio categorie disponibilă încă
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Reparații pe mașină</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map(car => {
              const carRepairs = repairLogs.filter(log => log.carId === car.id);
              const carSpent = carRepairs.reduce((sum, log) => sum + log.cost, 0);
              const avgCost = carRepairs.length > 0 ? carSpent / carRepairs.length : 0;
              
              return (
                <div key={car.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="font-medium mb-2">{car.name}</div>
                  <div className="text-sm text-muted-foreground mb-3">{car.numberPlate}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total:</span>
                      <span className="font-semibold">{carSpent.toFixed(2)} RON</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Reparații:</span>
                      <span className="font-semibold">{carRepairs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medie:</span>
                      <span className="font-semibold">{avgCost.toFixed(2)} RON</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}