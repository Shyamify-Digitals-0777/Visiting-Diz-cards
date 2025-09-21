import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Product {
  id: number;
  name: string;
  price: string;
  original_price?: string;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  description?: string;
  features: string[];
  in_stock: boolean;
  is_new?: boolean;
  discount?: string;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  name: string;
  email?: string;
  rating: number;
  title: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  full_name?: string;
  avatar_url?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}