import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Play, Square, AlertCircle } from 'lucide-react';
import algorithmsService, { HedgeAlgorithmConfig } from '../../services/algorithms';

interface HedgeAlgorithmProps {
  selectedAccounts: string[];
}

const HedgeAlgorithm: React.FC<HedgeAlgorithmProps> = ({ selectedAccounts }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [config, setConfig] = useState<HedgeAlgorithmConfig>({
    instrument: 'ESZ5',
    account_a_name: '',
    account_b_name: '',
    direction: 'long',
    quantity: 1,
    entry_price: 4750.00,
    tp_distance: 10.0,
    sl_distance: 5.0,
    hedge_distance: 0.0,
    order_type: 'limit'
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await algorithmsService.fetchAccounts();
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleStart = async () => {
    try {
      if (!config.account_a_name || !config.account_b_name) {
        alert('Please select both Account A and Account B');
        return;
      }
      
      await algorithmsService.startHedgeAlgorithm(config, selectedAccounts);
      setIsRunning(true);
    } catch (error) {
      console.error('Error starting algorithm:', error);
      alert('Failed to start algorithm');
    }
  };

  const handleStop = async () => {
    try {
      await algorithmsService.stopHedgeAlgorithm();
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping algorithm:', error);
    }
  };

  const updateConfig = (field: keyof HedgeAlgorithmConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Hedge Algorithm</h2>
          <p className="text-muted-foreground mt-1">
            Place opposite trades on two accounts with configurable parameters
          </p>
        </div>
        <Badge variant={isRunning ? "success" : "secondary"}>
          {isRunning ? 'Running' : 'Stopped'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Set up your hedge trading parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instrument">Instrument</Label>
                <Input
                  id="instrument"
                  value={config.instrument}
                  onChange={(e) => updateConfig('instrument', e.target.value)}
                  placeholder="e.g., ESZ5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction (Account A)</Label>
                <Select 
                  value={config.direction} 
                  onValueChange={(value) => updateConfig('direction', value as 'long' | 'short')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-a">Account A</Label>
                <Select 
                  value={config.account_a_name}
                  onValueChange={(value) => updateConfig('account_a_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account A" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-b">Account B</Label>
                <Select 
                  value={config.account_b_name}
                  onValueChange={(value) => updateConfig('account_b_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account B" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter(a => a.name !== config.account_a_name).map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={config.quantity}
                  onChange={(e) => updateConfig('quantity', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-price">Entry Price</Label>
                <Input
                  id="entry-price"
                  type="number"
                  value={config.entry_price}
                  onChange={(e) => updateConfig('entry_price', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tp-distance">TP Distance</Label>
                <Input
                  id="tp-distance"
                  type="number"
                  value={config.tp_distance}
                  onChange={(e) => updateConfig('tp_distance', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sl-distance">SL Distance</Label>
                <Input
                  id="sl-distance"
                  type="number"
                  value={config.sl_distance}
                  onChange={(e) => updateConfig('sl_distance', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hedge-distance">Hedge Distance</Label>
                <Input
                  id="hedge-distance"
                  type="number"
                  value={config.hedge_distance}
                  onChange={(e) => updateConfig('hedge_distance', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-type">Order Type</Label>
              <Select 
                value={config.order_type}
                onValueChange={(value) => updateConfig('order_type', value as 'limit' | 'market')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Status and Control Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Control</CardTitle>
            <CardDescription>Monitor and control the hedge algorithm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold mb-2">Current Configuration</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instrument:</span>
                  <span className="font-medium">{config.instrument}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Direction:</span>
                  <span className="font-medium">{config.direction.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{config.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry Price:</span>
                  <span className="font-medium">{config.entry_price}</span>
                </div>
              </div>
            </div>

            {selectedAccounts.length === 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">No accounts selected for trading</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!isRunning ? (
                <Button 
                  onClick={handleStart} 
                  className="flex-1"
                  disabled={selectedAccounts.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Algorithm
                </Button>
              ) : (
                <Button 
                  onClick={handleStop} 
                  variant="destructive" 
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Algorithm
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Algorithm Info</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Places opposite trades on two different accounts</p>
                <p>• Account B takes the opposite direction of Account A</p>
                <p>• Configurable TP/SL for risk management</p>
                <p>• Hedge distance creates price separation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HedgeAlgorithm;
