import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, TrendingUp, Users, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import algorithmsService from '../../services/algorithms';

interface DashboardProps {
  selectedAccounts: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ selectedAccounts }) => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentSignals, setRecentSignals] = useState<any[]>([]);
  const algorithmStatuses = {
    hedge: 'stopped',
    ninePoint: 'stopped'
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [orders, signals] = await Promise.all([
        algorithmsService.fetchRecentOrders(10),
        algorithmsService.fetchRecentSignals(10)
      ]);
      setRecentOrders(orders || []);
      setRecentSignals(signals || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const stats = [
    {
      title: 'Active Algorithms',
      value: algorithmStatuses.hedge === 'running' || algorithmStatuses.ninePoint === 'running' ? 1 : 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Selected Accounts',
      value: selectedAccounts.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Pending Orders',
      value: recentOrders.filter(o => o.status === 'pending').length,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      title: 'Today\'s Signals',
      value: recentSignals.length,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Monitor your trading algorithms and account activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Algorithm Status */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Status</CardTitle>
            <CardDescription>Current status of your trading algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${
                    algorithmStatuses.hedge === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium">Hedge Algorithm</p>
                    <p className="text-sm text-muted-foreground">Dual account hedging strategy</p>
                  </div>
                </div>
                <Badge variant={algorithmStatuses.hedge === 'running' ? 'success' : 'secondary'}>
                  {algorithmStatuses.hedge}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${
                    algorithmStatuses.ninePoint === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium">Nine Point Opening Range</p>
                    <p className="text-sm text-muted-foreground">First hour breakout strategy</p>
                  </div>
                </div>
                <Badge variant={algorithmStatuses.ninePoint === 'running' ? 'success' : 'secondary'}>
                  {algorithmStatuses.ninePoint}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Selected trading accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAccounts.length === 0 ? (
              <div className="py-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No accounts selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select accounts to start trading
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {selectedAccounts.length} Account{selectedAccounts.length !== 1 ? 's' : ''} Selected
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  All selected accounts will execute trades when algorithms are running
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent orders
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{order.instrument}</p>
                      <p className="text-muted-foreground">
                        {order.side.toUpperCase()} - {order.quantity} @ {order.price}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        order.status === 'filled' ? 'success' : 
                        order.status === 'pending' ? 'warning' : 
                        'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Signals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signals</CardTitle>
            <CardDescription>Latest trading signals</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSignals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent signals
              </p>
            ) : (
              <div className="space-y-3">
                {recentSignals.slice(0, 5).map((signal) => (
                  <div key={signal.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{signal.instrument}</p>
                      <p className="text-muted-foreground">
                        {signal.strategy_name}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        signal.status === 'executed' ? 'success' : 
                        signal.status === 'pending' ? 'warning' : 
                        'secondary'
                      }
                    >
                      {signal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
