import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function SubscriptionSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>Abonament activat cu succes!</CardTitle>
          <CardDescription>
            Mulțumim pentru alegerea planului PRO. Acum ai acces la toate funcționalitățile premium.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vei fi redirecționat automat către dashboard în câteva secunde...
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Mergi la Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}