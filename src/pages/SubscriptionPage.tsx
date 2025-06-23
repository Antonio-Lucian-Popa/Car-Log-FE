import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard } from 'lucide-react';

const plans = [
  {
    name: 'FREE',
    price: 0,
    description: 'Perfect pentru o mașină',
    features: [
      '1 mașină',
      'Înregistrare alimentări',
      'Evidența reparațiilor',
      'Reminders de bază',
    ],
    current: true,
  },
  {
    name: 'PRO',
    price: 29,
    description: 'Pentru pasionații auto',
    features: [
      '5 mașini',
      'Toate funcționalitățile FREE',
      'Statistici avansate',
      'Export date',
      'Suport prioritar',
    ],
    popular: true,
  },
  {
    name: 'FLEET',
    price: 99,
    description: 'Pentru flote și companii',
    features: [
      'Mașini nelimitate',
      'Toate funcționalitățile PRO',
      'Management utilizatori',
      'Rapoarte detaliate',
      'API access',
    ],
  },
];

export function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Planuri de abonament</h1>
        <p className="text-muted-foreground mt-2">
          Alege planul care se potrivește nevoilor tale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default">Cel mai popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <span>{plan.name}</span>
                {plan.current && <Badge variant="secondary">Actual</Badge>}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price} RON</span>
                <span className="text-muted-foreground">/lună</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.current ? 'Plan actual' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Plăți securizate cu Stripe
          </CardTitle>
          <CardDescription>
            Toate plățile sunt procesate în siguranță prin Stripe. Poți anula oricând
            din setările contului.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}