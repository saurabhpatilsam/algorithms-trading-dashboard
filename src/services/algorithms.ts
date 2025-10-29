import { supabase } from './supabase';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Algorithm configurations
export interface HedgeAlgorithmConfig {
  instrument: string;
  account_a_name: string;
  account_b_name: string;
  direction: 'long' | 'short';
  quantity: number;
  entry_price: number;
  tp_distance: number;
  sl_distance: number;
  hedge_distance: number;
  order_type: 'limit' | 'market';
}

export interface NinePointAlgorithmConfig {
  instrument: string;
  account_name: string;
  points_spacing: number;
  max_orders_per_side: number;
  stop_loss_points: number;
  take_profit_points: number;
  quantity_per_order: number;
  order_type: 'limit' | 'market';
}

export interface AlgorithmStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastRun?: string;
  parameters?: any;
  message?: string;
}

class AlgorithmsService {
  // Fetch all user accounts from Supabase
  async fetchAccounts() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Fetch users from Supabase
  async fetchUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Fetch 30-minute candles for Nine Point algorithm
  async fetch30MinCandles(symbol: string, limit: number = 2) {
    const { data, error } = await supabase
      .from('candles_30m')
      .select('*')
      .eq('symbol', symbol)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Get first hour candles after market open (first two 30-min candles)
  async getFirstHourCandles(symbol: string, date?: string) {
    // Get today's date in ET timezone
    const marketDate = date || new Date().toISOString().split('T')[0];
    
    // Market opens at 9:30 AM ET, we need candles from 9:30-10:00 and 10:00-10:30
    const startTime = `${marketDate} 09:30:00`;
    const endTime = `${marketDate} 10:30:00`;

    const { data, error } = await supabase
      .from('candles_30m')
      .select('*')
      .eq('symbol', symbol)
      .gte('timestamp', startTime)
      .lt('timestamp', endTime)
      .order('timestamp', { ascending: true })
      .limit(2);

    if (error) throw error;

    // Calculate the high and low of the first hour
    if (data && data.length >= 2) {
      const high = Math.max(data[0].high, data[1].high);
      const low = Math.min(data[0].low, data[1].low);
      return {
        high,
        low,
        open: data[0].open,
        close: data[1].close,
        volume: data[0].volume + data[1].volume,
        timestamp: data[0].timestamp
      };
    }
    
    return null;
  }

  // Start Hedge Algorithm
  async startHedgeAlgorithm(config: HedgeAlgorithmConfig, selectedAccounts: string[]) {
    try {
      const response = await axios.post(`${API_URL}/algorithms/hedge/start`, {
        config,
        accounts: selectedAccounts
      });
      return response.data;
    } catch (error) {
      console.error('Error starting hedge algorithm:', error);
      throw error;
    }
  }

  // Stop Hedge Algorithm
  async stopHedgeAlgorithm() {
    try {
      const response = await axios.post(`${API_URL}/algorithms/hedge/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping hedge algorithm:', error);
      throw error;
    }
  }

  // Start Nine Point Algorithm
  async startNinePointAlgorithm(config: NinePointAlgorithmConfig, selectedAccounts: string[]) {
    try {
      const response = await axios.post(`${API_URL}/algorithms/nine-point/start`, {
        config,
        accounts: selectedAccounts
      });
      return response.data;
    } catch (error) {
      console.error('Error starting nine point algorithm:', error);
      throw error;
    }
  }

  // Stop Nine Point Algorithm
  async stopNinePointAlgorithm() {
    try {
      const response = await axios.post(`${API_URL}/algorithms/nine-point/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping nine point algorithm:', error);
      throw error;
    }
  }

  // Get algorithm status
  async getAlgorithmStatus(algorithmName: string): Promise<AlgorithmStatus> {
    try {
      const response = await axios.get(`${API_URL}/algorithms/${algorithmName}/status`);
      return response.data;
    } catch (error) {
      // If API is not available, return stopped status
      return {
        name: algorithmName,
        status: 'stopped',
        message: 'API not available'
      };
    }
  }

  // Subscribe to real-time orders
  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        callback
      )
      .subscribe();
  }

  // Subscribe to real-time signals
  subscribeToSignals(callback: (payload: any) => void) {
    return supabase
      .channel('signals_channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'signals' },
        callback
      )
      .subscribe();
  }

  // Fetch recent orders
  async fetchRecentOrders(limit: number = 50) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Fetch recent signals
  async fetchRecentSignals(limit: number = 50) {
    const { data, error } = await supabase
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export default new AlgorithmsService();
