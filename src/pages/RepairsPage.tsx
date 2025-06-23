import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export function RepairsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reparații</h1>
        <p className="text-muted-foreground">
          Ține evidența reparațiilor și cheltuielilor de întreținere
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="mr-2 h-5 w-5" />
            În curând
          </CardTitle>
          <CardDescription>
            Această pagină va fi disponibilă în curând. Vei putea să îți înregistrezi toate
            reparațiile și cheltuielile de întreținere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcționalități care vor fi disponibile:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm text-muted-foreground">
            <li>Înregistrarea reparațiilor</li>
            <li>Evidența cheltuielilor</li>
            <li>Istoricul întreținerii</li>
            <li>Reminders pentru service</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}