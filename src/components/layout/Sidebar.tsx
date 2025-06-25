import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Car,
  Gauge,
  Wrench,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logo from "../../assets/logo.png";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

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

export function Sidebar({ collapsed, onToggle, mobile = false }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-r bg-background transition-all duration-300',
        mobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 lg:h-16 items-center justify-between px-4">
        {(!collapsed || mobile) && (
          // <h2 className="text-lg font-semibold text-primary">Car Log</h2>
          <img src={logo} alt="Car Log" className='w-20' />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(mobile ? '' : 'ml-auto')}
        >
          {mobile ? <X className="h-4 w-4" /> : null}
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href} onClick={mobile ? onToggle : undefined}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    collapsed && !mobile && 'px-2'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {(!collapsed || mobile) && <span className="ml-3">{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      <div className="p-3">
        <Separator className="mb-3" />
        <div className="space-y-2">
          <Link to="/settings" onClick={mobile ? onToggle : undefined}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start',
                collapsed && !mobile && 'px-2'
              )}
            >
              <Settings className="h-4 w-4" />
              {(!collapsed || mobile) && <span className="ml-3">Setări</span>}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive',
              collapsed && !mobile && 'px-2'
            )}
            onClick={() => {
              if (mobile) onToggle();
              logout();
            }}
          >
            <LogOut className="h-4 w-4" />
            {(!collapsed || mobile) && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}