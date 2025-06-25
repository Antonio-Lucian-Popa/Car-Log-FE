import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Car,
  Gauge,
  Wrench,
  Bell,
  CreditCard,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Mașini',
    href: '/dashboard',
    icon: Car,
  },
  {
    title: 'Alimentări',
    href: '/fuel',
    icon: Gauge,
  },
  {
    title: 'Reparații',
    href: '/repairs',
    icon: Wrench,
  },
  {
    title: 'Reminders',
    href: '/reminders',
    icon: Bell,
  },
  {
    title: 'Abonament',
    href: '/subscription',
    icon: CreditCard,
  },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs transition-colors',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}