import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Account {
  id: string;
  user_id: string | null;
  name: string;
  master_account: string;
  account_type: string;
  active: boolean;
  balance?: number;
  net_liquidating_value?: number;
  cash_balance?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Candle30m {
  id: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
  created_at: string;
}

export interface Order {
  id: string;
  account_id: string;
  strategy_name: string;
  instrument: string;
  side: 'buy' | 'sell';
  quantity: number;
  order_type: 'limit' | 'market';
  price?: number;
  stop_loss?: number;
  take_profit?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filled_price?: number;
  filled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  strategy_name: string;
  instrument: string;
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stop_loss?: number;
  take_profit?: number;
  account_name?: string;
  metadata?: any;
  status: 'pending' | 'executed' | 'cancelled';
  created_at: string;
}
