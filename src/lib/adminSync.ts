import { supabase } from './supabase';

// Sync service to keep main website updated with admin changes
export class AdminSyncService {
  private static eventListeners: Map<string, Function[]> = new Map();

  // Subscribe to real-time changes from admin panel
  static init() {
    // Listen for product changes
    supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          this.notifyListeners('products', payload);
        }
      )
      .subscribe();

    // Listen for review changes
    supabase
      .channel('reviews-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        (payload) => {
          this.notifyListeners('reviews', payload);
        }
      )
      .subscribe();

    // Listen for popup offer changes
    supabase
      .channel('popup-offers-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'popup_offers' },
        (payload) => {
          this.notifyListeners('popup_offers', payload);
        }
      )
      .subscribe();

    // Listen for site settings changes
    supabase
      .channel('site-settings-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          this.notifyListeners('site_settings', payload);
        }
      )
      .subscribe();
  }

  // Add event listener
  static addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  // Remove event listener
  static removeEventListener(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Notify all listeners
  private static notifyListeners(event: string, payload: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(payload));
    }
  }

  // Fetch latest data from database
  static async fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async fetchReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async fetchPopupOffers() {
    const { data, error } = await supabase
      .from('popup_offers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async fetchSiteSettings() {
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
}