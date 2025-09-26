import { supabase } from './supabase';
import { Product, Review, PopupOffer } from './supabase';

// API service for admin operations
export class AdminAPI {
  // Products API
  static async getProducts(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
  }) {
    const { page = 1, limit = 10, search, category, brand } = filters || {};
    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (brand && brand !== 'all') {
      query = query.eq('brand', brand);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      products: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProduct(id: number, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Reviews API
  static async getReviews(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, status, search } = filters || {};
    const offset = (page - 1) * limit;

    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,title.ilike.%${search}%,message.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      reviews: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  static async updateReviewStatus(id: number, status: 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteReview(id: number) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Popup Offers API
  static async getPopupOffers() {
    const { data, error } = await supabase
      .from('popup_offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createPopupOffer(offer: Omit<PopupOffer, 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('popup_offers')
      .insert([{
        ...offer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updatePopupOffer(id: string, updates: Partial<PopupOffer>) {
    const { data, error } = await supabase
      .from('popup_offers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deletePopupOffer(id: string) {
    const { error } = await supabase
      .from('popup_offers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Dashboard Stats
  static async getDashboardStats() {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) throw error;
    return data;
  }

  // Categories API
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Brands API
  static async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Site Settings API
  static async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) throw error;
    
    // Convert to key-value object
    const settings: Record<string, any> = {};
    data?.forEach(setting => {
      try {
        settings[setting.key] = JSON.parse(setting.value);
      } catch {
        settings[setting.key] = setting.value;
      }
    });
    
    return settings;
  }

  static async updateSiteSettings(settings: Record<string, any>) {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });
    
    if (error) throw error;
  }
}