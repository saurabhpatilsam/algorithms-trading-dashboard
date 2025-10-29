import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Play, Square, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import algorithmsService, { NinePointAlgorithmConfig } from '../../services/algorithms';

interface NinePointAlgorithmProps {
  selectedAccounts: string[];
}

const NinePointAlgorithm: React.FC<NinePointAlgorithmProps> = ({ selectedAccounts }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [firstHourData, setFirstHourData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<NinePointAlgorithmConfig>({
    instrument: 'ESZ5',
    account_name: '',
    points_spacing: 9.0,
    max_orders_per_side: 5,
    stop_loss_points: 5.0,
    take_profit_points: 5.0,
    quantity_per_order: 1,
    order_type: 'limit'
  });

  useEffect(() => {
    fetchFirstHourData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.instrument]);

  const fetchFirstHourData = async () => {
    setLoading(true);
    try {
      const data = await algorithmsService.getFirstHourCandles(config.instrument);
      setFirstHourData(data);
    } catch (error) {
      console.error('Error fetching first hour data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      if (selectedAccounts.length === 0) {
        alert('Please select at least one account');
        return;
      }
      
      await algorithmsService.startNinePointAlgorithm(config, selectedAccounts);
      setIsRunning(true);
    } catch (error) {
      console.error('Error starting algorithm:', error);
      alert('Failed to start algorithm');
    }
  };

  const handleStop = async () => {
    try {
      await algorithmsService.stopNinePointAlgorithm();
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping algorithm:', error);
    }
  };

  const updateConfig = (field: keyof NinePointAlgorithmConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateOrderLevels = () => {
    if (!firstHourData) return { shortLevels: [], longLevels: [] };

    const shortLevels = [];
    const longLevels = [];

    for (let i = 1; i <= config.max_orders_per_side; i++) {
      shortLevels.push(firstHourData.high + (i * config.points_spacing));
      longLevels.push(firstHourData.low - (i * config.points_spacing));
    }

    return { shortLevels, longLevels };
  };

  const { shortLevels, longLevels } = calculateOrderLevels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Nine Point Opening Range</h2>
          <p className="text-muted-foreground mt-1">
            First hour breakout strategy with configurable point spacing
          </p>
        </div>
        <Badge variant={isRunning ? "success" : "secondary"}>
          {isRunning ? 'Running' : 'Stopped'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Set up your nine point trading parameters</CardDescription>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points-spacing">Points Spacing</Label>
                <Input
                  id="points-spacing"
                  type="number"
                  value={config.points_spacing}
                  onChange={(e) => updateConfig('points_spacing', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-orders">Max Orders/Side</Label>
                <Input
                  id="max-orders"
                  type="number"
                  value={config.max_orders_per_side}
                  onChange={(e) => updateConfig('max_orders_per_side', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity/Order</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={config.quantity_per_order}
                  onChange={(e) => updateConfig('quantity_per_order', parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sl-points">Stop Loss Points</Label>
                <Input
                  id="sl-points"
                  type="number"
                  value={config.stop_loss_points}
                  onChange={(e) => updateConfig('stop_loss_points', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tp-points">Take Profit Points</Label>
                <Input
                  id="tp-points"
                  type="number"
                  value={config.take_profit_points}
                  onChange={(e) => updateConfig('take_profit_points', parseFloat(e.target.value))}
                  step="0.25"
                />
              </div>
            </div>

            {/* First Hour Data Display */}
            {firstHourData && (
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-3">First Hour Candle Data (from Supabase)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High:</span>
                      <span className="font-medium text-green-600">{firstHourData.high?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low:</span>
                      <span className="font-medium text-red-600">{firstHourData.low?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open:</span>
                      <span className="font-medium">{firstHourData.open?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Close:</span>
                      <span className="font-medium">{firstHourData.close?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Levels Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <h4 className="font-semibold text-red-900 dark:text-red-100">Short Levels</h4>
                </div>
                <div className="space-y-1 text-sm">
                  {shortLevels.map((level, index) => (
                    <div key={index} className="flex justify-between text-red-700 dark:text-red-200">
                      <span>Level {index + 1}:</span>
                      <span className="font-medium">{level.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Long Levels</h4>
                </div>
                <div className="space-y-1 text-sm">
                  {longLevels.map((level, index) => (
                    <div key={index} className="flex justify-between text-green-700 dark:text-green-200">
                      <span>Level {index + 1}:</span>
                      <span className="font-medium">{level.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status and Control Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Control</CardTitle>
            <CardDescription>Monitor and control the algorithm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedAccounts.length === 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">No accounts selected</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!isRunning ? (
                <Button 
                  onClick={handleStart} 
                  className="flex-1"
                  disabled={selectedAccounts.length === 0 || !firstHourData}
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

            <Button 
              onClick={fetchFirstHourData} 
              variant="outline" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Market Data'}
            </Button>

            <div className="space-y-2">
              <h4 className="font-semibold">Algorithm Info</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Waits for first hour after market open</p>
                <p>• Places orders at intervals above high</p>
                <p>• Places orders at intervals below low</p>
                <p>• Each order has configurable SL/TP</p>
                <p>• Data fetched from Supabase</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Market Hours:</strong> 9:30 AM - 10:30 AM ET
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NinePointAlgorithm;
