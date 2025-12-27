/**
 * Supabase SQL Migration
 * Create the attraction_images table for storing image metadata
 * 
 * Run this migration in your Supabase SQL editor:
 * 1. Go to Supabase Dashboard > SQL Editor
 * 2. Click "New Query"
 * 3. Paste this entire file
 * 4. Click "Run"
 */

-- Create attraction_images table
CREATE TABLE IF NOT EXISTS attraction_images (
  -- Unique identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to attractions (adjust table name if needed)
  attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
  
  -- Supabase Storage path
  -- Format: attractions/taj-mahal-123/1703688000000.jpg
  storage_key TEXT NOT NULL UNIQUE,
  
  -- Public Supabase Storage URL
  -- Format: https://project-ref.supabase.co/storage/v1/object/public/hotel-photos/attractions/...
  image_url TEXT NOT NULL,
  
  -- Metadata
  is_primary BOOLEAN DEFAULT FALSE, -- Mark as primary image for attraction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Optional: Add file metadata if needed
  file_size_bytes INTEGER,
  file_mime_type TEXT DEFAULT 'image/jpeg',
  
  -- Optional: Add alt text for accessibility
  alt_text TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attraction_images_attraction_id 
  ON attraction_images(attraction_id);

CREATE INDEX IF NOT EXISTS idx_attraction_images_is_primary 
  ON attraction_images(attraction_id, is_primary);

CREATE INDEX IF NOT EXISTS idx_attraction_images_created_at 
  ON attraction_images(created_at DESC);

-- Create a trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_attraction_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_attraction_images_updated_at ON attraction_images;

CREATE TRIGGER trigger_attraction_images_updated_at
BEFORE UPDATE ON attraction_images
FOR EACH ROW
EXECUTE FUNCTION update_attraction_images_updated_at();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE attraction_images ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust based on your auth setup)
-- Allow users to read all images
CREATE POLICY "Enable read access for all users" ON attraction_images
  FOR SELECT USING (true);

-- Allow authenticated users to insert images
CREATE POLICY "Enable insert for authenticated users" ON attraction_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own images
CREATE POLICY "Enable update for own images" ON attraction_images
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow users to delete their own images
CREATE POLICY "Enable delete for own images" ON attraction_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON attraction_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON attraction_images TO authenticated;

-- Optional: Create a view for easy access to primary images
CREATE OR REPLACE VIEW attraction_primary_images AS
SELECT DISTINCT ON (attraction_id)
  attraction_id,
  id,
  storage_key,
  image_url,
  thumbnail_url,
  mobile_hero_url,
  desktop_hero_url,
  created_at
FROM attraction_images
WHERE is_primary = TRUE
ORDER BY attraction_id, created_at DESC;

-- Optional: Create a view for all images ordered by creation
CREATE OR REPLACE VIEW attraction_images_all AS
SELECT
  attraction_id,
  id,
  storage_key,
  image_url,
  thumbnail_url,
  mobile_hero_url,
  desktop_hero_url,
  is_primary,
  created_at
FROM attraction_images
ORDER BY attraction_id, created_at DESC;

-- Grant view permissions
GRANT SELECT ON attraction_primary_images TO anon, authenticated;
GRANT SELECT ON attraction_images_all TO anon, authenticated;
