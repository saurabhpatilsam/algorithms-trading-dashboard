import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  Shield, 
  Activity,
  Settings,
  Home
} from 'lucide-react';

interface SidebarProps {
  selectedAlgorithm: string;
  onSelectAlgorithm: (algorithm: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedAlgorithm, onSelectAlgorithm }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'hedge',
      label: 'Hedge Algorithm',
      icon: Shield,
    },
    {
      id: 'nine-point',
      label: 'Nine Point Opening Range',
      icon: TrendingUp,
    },
    {
      id: 'monitoring',
      label: 'Live Monitoring',
      icon: Activity,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Algorithm Trading
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Control Center</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={selectedAlgorithm === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  selectedAlgorithm === item.id && "bg-secondary"
                )}
                onClick={() => onSelectAlgorithm(item.id)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 Trading System</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
