import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export function RemindersPage() {
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
            În curând
          </CardTitle>
          <CardDescription>
            Această pagină va fi disponibilă în curând. Vei putea să setezi reminders pentru
            toate documentele și reviziile importante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcționalități care vor fi disponibile:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm text-muted-foreground">
            <li>Reminders pentru ITP</li>
            <li>Reminders pentru RCA</li>
            <li>Reminders pentru schimb ulei</li>
            <li>Reminders pentru revizie tehnică</li>
            <li>Notificări email și push</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}