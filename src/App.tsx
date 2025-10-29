import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import HedgeAlgorithm from './components/algorithms/HedgeAlgorithm';
import NinePointAlgorithm from './components/algorithms/NinePointAlgorithm';
import AccountSelector from './components/common/AccountSelector';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  const handleRefresh = () => {
    window.location.reload();
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return <Dashboard selectedAccounts={selectedAccounts} />;
      case 'hedge':
        return <HedgeAlgorithm selectedAccounts={selectedAccounts} />;
      case 'nine-point':
        return <NinePointAlgorithm selectedAccounts={selectedAccounts} />;
      case 'monitoring':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Live Monitoring</h2>
            <p className="text-muted-foreground">Real-time monitoring features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Configuration settings coming soon...</p>
          </div>
        );
      default:
        return <Dashboard selectedAccounts={selectedAccounts} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-background">
        <Sidebar selectedAlgorithm={selectedView} onSelectAlgorithm={setSelectedView} />
        
        <div className="flex-1 flex flex-col">
          <Header connectionStatus={connectionStatus} onRefresh={handleRefresh} />
          
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {renderContent()}
                </div>
                <div className="lg:col-span-1">
                  <AccountSelector 
                    selectedAccounts={selectedAccounts}
                    onAccountsChange={setSelectedAccounts}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
