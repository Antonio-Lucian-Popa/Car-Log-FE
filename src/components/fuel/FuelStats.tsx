import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { FuelLog, Car } from '@/types';

interface FuelStatsProps {
  fuelLogs: FuelLog[];
  cars: Car[];
}

export function FuelStats({ fuelLogs, cars }: FuelStatsProps) {
  // Calculate statistics
  const totalSpent = fuelLogs.reduce((sum, log) => sum + log.price, 0);
  const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
  const averagePricePerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0;
  
  // Calculate consumption (only if we have at least 2 fuel logs)
  const sortedLogs = [...fuelLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let averageConsumption = 0;
  
  if (sortedLogs.length >= 2) {
    const consumptions = [];
    for (let i = 1; i < sortedLogs.length; i++) {
      const currentLog = sortedLogs[i];
      const previousLog = sortedLogs[i - 1];
      const distance = currentLog.odometer - previousLog.odometer;
      
      if (distance > 0) {
        const consumption = (currentLog.liters / distance) * 100;
        consumptions.push(consumption);
      }
    }
    
    if (consumptions.length > 0) {
      averageConsumption = consumptions.reduce((sum, cons) => sum + cons, 0) / consumptions.length;
    }
  }

  // Monthly statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthLogs = fuelLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  });
  
  const thisMonthSpent = thisMonthLogs.reduce((sum, log) => sum + log.price, 0);
  const thisMonthLiters = thisMonthLogs.reduce((sum, log) => sum + log.liters, 0);

  // Last month comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthLogs = fuelLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === lastMonth && logDate.getFullYear() === lastMonthYear;
  });
  
  const lastMonthSpent = lastMonthLogs.reduce((sum, log) => sum + log.price, 0);
  const spendingTrend = lastMonthSpent > 0 ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100 : 0;

  // Most used fuel type
  const fuelTypeCounts = fuelLogs.reduce((acc, log) => {
    const type = log.fuelType || 'benzina';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedFuelType = Object.entries(fuelTypeCounts).reduce((a, b) => 
    fuelTypeCounts[a[0]] > fuelTypeCounts[b[0]] ? a : b
  )?.[0] || 'benzina';

  const fuelTypeLabels = {
    benzina: 'Benzină',
    motorina: 'Motorină',
    gpl: 'GPL',
    electric: 'Electric',
    hibrid: 'Hibrid',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total cheltuit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-green-600">{totalSpent.toFixed(2)} RON</div>
          <p className="text-xs text-muted-foreground">
            {fuelLogs.length} alimentări înregistrate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Luna aceasta</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{thisMonthSpent.toFixed(2)} RON</div>
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
          <CardTitle className="text-sm font-medium">Preț mediu/litru</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{averagePricePerLiter.toFixed(2)} RON</div>
          <p className="text-xs text-muted-foreground">
            {totalLiters.toFixed(1)}L total alimentați
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consum mediu</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">
            {averageConsumption > 0 ? `${averageConsumption.toFixed(1)}L` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {averageConsumption > 0 ? 'per 100km' : 'Necesare min. 2 alimentări'}
          </p>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistici detaliate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Combustibil preferat</div>
              <Badge className="mt-1">
                {fuelTypeLabels[mostUsedFuelType as keyof typeof fuelTypeLabels]}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Alimentări luna aceasta</div>
              <div className="text-lg font-semibold">{thisMonthLogs.length}</div>
            </div>
          </div>
          
          {averageConsumption > 0 && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">Estimare cost/100km</div>
              <div className="text-lg font-semibold text-primary">
                {(averageConsumption * averagePricePerLiter).toFixed(2)} RON
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Alimentări pe mașină</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cars.map(car => {
              const carLogs = fuelLogs.filter(log => log.carId === car.id);
              const carSpent = carLogs.reduce((sum, log) => sum + log.price, 0);
              const carLiters = carLogs.reduce((sum, log) => sum + log.liters, 0);
              
              return (
                <div key={car.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{car.name}</div>
                    <div className="text-xs text-muted-foreground">{car.numberPlate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{carSpent.toFixed(2)} RON</div>
                    <div className="text-xs text-muted-foreground">
                      {carLogs.length} alimentări • {carLiters.toFixed(1)}L
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