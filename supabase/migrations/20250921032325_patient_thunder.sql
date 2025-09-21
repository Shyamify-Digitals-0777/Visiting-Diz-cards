/*
  # Admin Panel Database Schema

  1. New Tables
    - `admin_users` - Administrator accounts with role-based access
    - `products` - Product catalog management
    - `reviews` - Customer reviews with moderation
    - `activity_logs` - Admin activity tracking
    - `site_settings` - Website configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for admin-only access
    - Create secure functions for admin operations

  3. Indexes
    - Add performance indexes for common queries
    - Full-text search indexes for products and reviews
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  full_name text,
  avatar_url text,
  is_active boolean DEFAULT true,
  last_sign_in_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE,
  price text NOT NULL,
  original_price text,
  image text,
  images text[],
  category text NOT NULL,
  brand text NOT NULL,
  description text,
  features text[],
  specifications jsonb,
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  is_new boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  discount text,
  rating numeric(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  product_id integer REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id serial PRIMARY KEY,
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  parent_id integer REFERENCES categories(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo text,
  website text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can manage admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can manage reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Public can read approved reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Public can insert reviews"
  ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can view activity logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin users can manage brands"
  ON brands
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.is_active = true
    )
  );

CREATE POLICY "Public can read active brands"
  ON brands
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_user_id ON activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_reviews_search ON reviews USING gin(to_tsvector('english', title || ' ' || message));

-- Create functions for automatic slug generation
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for automatic slug generation
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_product_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

CREATE TRIGGER auto_generate_category_slug
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

CREATE TRIGGER auto_generate_brand_slug
  BEFORE INSERT OR UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"Harvinder Telecom"', 'Website name'),
  ('site_description', '"Your trusted mobile and electronics partner"', 'Website description'),
  ('contact_email', '"info@harvinder-telecom.com"', 'Contact email address'),
  ('contact_phone', '"+91 98765 43210"', 'Contact phone number'),
  ('business_address', '"Shop No. 15, Main Market, Sector 22, Chandigarh - 160022"', 'Business address'),
  ('business_hours', '{"monday_saturday": "10:00 AM - 9:00 PM", "sunday": "11:00 AM - 8:00 PM"}', 'Business operating hours'),
  ('social_media', '{"facebook": "", "instagram": "", "twitter": "", "whatsapp": "919876543210"}', 'Social media links'),
  ('google_analytics', '""', 'Google Analytics tracking ID'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('seo_settings', '{"meta_title": "Harvinder Telecom - Digital Visiting Card", "meta_description": "Your trusted mobile and electronics partner in Chandigarh", "keywords": "mobile, electronics, smartphone, accessories"}', 'SEO configuration')
ON CONFLICT (key) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Smartphones', 'smartphones', 'Latest smartphones from top brands'),
  ('Audio', 'audio', 'Headphones, earphones, and audio accessories'),
  ('Wearables', 'wearables', 'Smartwatches and fitness trackers'),
  ('Accessories', 'accessories', 'Mobile accessories and gadgets')
ON CONFLICT (slug) DO NOTHING;

-- Insert default brands
INSERT INTO brands (name, slug, description) VALUES
  ('Apple', 'apple', 'Premium smartphones and accessories'),
  ('Samsung', 'samsung', 'Innovative mobile technology'),
  ('OnePlus', 'oneplus', 'Never settle for less'),
  ('Xiaomi', 'xiaomi', 'Innovation for everyone'),
  ('Oppo', 'oppo', 'Camera-focused smartphones'),
  ('Vivo', 'vivo', 'Perfect shots, every time'),
  ('Realme', 'realme', 'Dare to leap'),
  ('Motorola', 'motorola', 'Hello Moto')
ON CONFLICT (slug) DO NOTHING;

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (admin_user_id, action, resource_type, resource_id, details)
  VALUES (p_admin_user_id, p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_products', (SELECT count(*) FROM products),
    'total_reviews', (SELECT count(*) FROM reviews),
    'pending_reviews', (SELECT count(*) FROM reviews WHERE status = 'pending'),
    'approved_reviews', (SELECT count(*) FROM reviews WHERE status = 'approved'),
    'out_of_stock_products', (SELECT count(*) FROM products WHERE in_stock = false),
    'average_rating', (SELECT COALESCE(avg(rating), 0) FROM reviews WHERE status = 'approved'),
    'total_categories', (SELECT count(*) FROM categories WHERE is_active = true),
    'total_brands', (SELECT count(*) FROM brands WHERE is_active = true)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;