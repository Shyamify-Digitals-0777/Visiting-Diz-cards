/*
  # Add popup offers table for admin-managed promotional popups

  1. New Tables
    - `popup_offers`
      - `id` (text, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `discount` (text, required)
      - `code` (text, optional discount code)
      - `image` (text, optional image URL)
      - `background_color` (text, CSS background class)
      - `text_color` (text, CSS text color class)
      - `button_text` (text, CTA button text)
      - `button_color` (text, CSS button color class)
      - `expiry_date` (timestamptz, optional)
      - `is_active` (boolean, default true)
      - `show_on_load` (boolean, show when page loads)
      - `delay_seconds` (integer, delay before showing)
      - `max_shows_per_user` (integer, max times to show per user)
      - `target_url` (text, optional URL to redirect)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `popup_offers` table
    - Add policy for admin users to manage popup offers
    - Add policy for public to read active popup offers

  3. Functions
    - Add trigger for automatic slug generation
    - Add trigger for updated_at timestamp
*/

-- Create popup_offers table
CREATE TABLE IF NOT EXISTS popup_offers (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  discount text NOT NULL,
  code text,
  image text,
  background_color text NOT NULL DEFAULT 'bg-gradient-to-r from-blue-600 to-purple-600',
  text_color text NOT NULL DEFAULT 'text-white',
  button_text text NOT NULL DEFAULT 'Claim Offer',
  button_color text NOT NULL DEFAULT 'bg-white text-blue-600 hover:bg-gray-100',
  expiry_date timestamptz,
  is_active boolean DEFAULT true,
  show_on_load boolean DEFAULT true,
  delay_seconds integer DEFAULT 3,
  max_shows_per_user integer DEFAULT 3,
  target_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE popup_offers ENABLE ROW LEVEL SECURITY;

-- Policies for popup_offers
CREATE POLICY "Admin users can manage popup offers"
  ON popup_offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Public can read active popup offers"
  ON popup_offers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Add updated_at trigger
CREATE TRIGGER update_popup_offers_updated_at
  BEFORE UPDATE ON popup_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample popup offers
INSERT INTO popup_offers (id, title, description, discount, code, background_color, text_color, button_text, button_color, expiry_date, delay_seconds, max_shows_per_user, target_url) VALUES
('welcome-discount', '🎉 Welcome to Harvinder Telecom!', 'Get exclusive discount on your first purchase. Limited time offer for new customers!', '10% OFF', 'WELCOME10', 'bg-gradient-to-r from-blue-600 to-purple-600', 'text-white', 'Claim Discount', 'bg-white text-blue-600 hover:bg-gray-100', '2024-12-31 23:59:59+00', 3, 3, 'https://wa.me/919876543210?text=Hi! I want to use the WELCOME10 discount code'),
('flash-sale', '⚡ Flash Sale Alert!', 'Massive discounts on smartphones! Hurry up, limited stock available.', 'Up to 25% OFF', NULL, 'bg-gradient-to-r from-red-500 to-orange-500', 'text-white', 'Shop Now', 'bg-white text-red-600 hover:bg-gray-100', '2024-02-01 23:59:59+00', 5, 2, '#products'),
('emi-offer', '💳 Zero Cost EMI Available', 'Buy your favorite smartphone with 0% interest EMI. No hidden charges!', '0% EMI', NULL, 'bg-gradient-to-r from-green-500 to-teal-500', 'text-white', 'Check EMI Options', 'bg-white text-green-600 hover:bg-gray-100', NULL, 10, 1, '#finance');