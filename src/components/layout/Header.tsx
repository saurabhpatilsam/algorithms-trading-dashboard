import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, User, RefreshCw } from 'lucide-react';

interface HeaderProps {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ connectionStatus, onRefresh }) => {
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="success">Connected</Badge>;
      case 'connecting':
        return <Badge variant="warning">Connecting...</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Trading Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge()}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
