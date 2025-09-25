import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: string;
  original_price?: string;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  description?: string;
  features: string[];
  specifications?: any;
  in_stock: boolean;
  stock_quantity?: number;
  is_new?: boolean;
  is_featured?: boolean;
  discount?: string;
  rating: number;
  reviews_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id?: number;
  name: string;
  email?: string;
  rating: number;
  title: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  full_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  admin_user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  sort_order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PopupOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  image?: string;
  background_color: string;
  text_color: string;
  button_text: string;
  button_color: string;
  expiry_date?: string;
  is_active: boolean;
  show_on_load: boolean;
  delay_seconds: number;
  max_shows_per_user: number;
  target_url?: string;
  created_at: string;
  updated_at: string;
}