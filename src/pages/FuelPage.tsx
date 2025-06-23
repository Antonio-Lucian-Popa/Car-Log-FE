import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

export function FuelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alimentări</h1>
        <p className="text-muted-foreground">
          Monitorizează consumul de combustibil și costurile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            În curând
          </CardTitle>
          <CardDescription>
            Această pagină va fi disponibilă în curând. Vei putea să îți înregistrezi alimentările
            și să vezi statistici detaliate despre consumul de combustibil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcționalități care vor fi disponibile:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm text-muted-foreground">
            <li>Înregistrarea alimentărilor</li>
            <li>Calculul consumului pe 100km</li>
            <li>Analiza costurilor</li>
            <li>Grafice și statistici</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}