/**
 * Supabase Service
 * Handles database operations for image metadata storage
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AttractionImage {
  id?: string;
  attraction_id: string;
  storage_key: string;
  image_url: string;
  thumbnail_url: string;
  mobile_hero_url: string;
  desktop_hero_url: string;
  is_primary?: boolean;
  created_at?: string;
}

/**
 * Save image metadata to Supabase
 * Call this after successful R2 upload
 * 
 * @param attractionId - ID of the attraction
 * @param storageKey - Storage key from R2 (e.g., 'attractions/1703688000000-taj-mahal.jpg')
 * @param imageUrl - Public R2 URL
 * @param thumbnailUrl - ImageKit thumbnail URL
 * @param mobileHeroUrl - ImageKit mobile URL
 * @param desktopHeroUrl - ImageKit desktop URL
 * @returns Created image record
 */
export const saveAttractionImage = async (
  attractionId: string,
  storageKey: string,
  imageUrl: string,
  thumbnailUrl: string,
  mobileHeroUrl: string,
  desktopHeroUrl: string,
  isPrimary: boolean = false
): Promise<AttractionImage> => {
  const { data, error } = await supabase
    .from("attraction_images")
    .insert([
      {
        attraction_id: attractionId,
        storage_key: storageKey,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        mobile_hero_url: mobileHeroUrl,
        desktop_hero_url: desktopHeroUrl,
        is_primary: isPrimary,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error saving image metadata:", error);
    throw new Error("Failed to save image metadata");
  }

  return data;
};

/**
 * Get all images for an attraction
 * 
 * @param attractionId - ID of the attraction
 * @returns Array of images
 */
export const getAttractionImages = async (
  attractionId: string
): Promise<AttractionImage[]> => {
  const { data, error } = await supabase
    .from("attraction_images")
    .select("*")
    .eq("attraction_id", attractionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images");
  }

  return data || [];
};

/**
 * Get primary image for an attraction
 * 
 * @param attractionId - ID of the attraction
 * @returns Primary image or null
 */
export const getPrimaryAttractionImage = async (
  attractionId: string
): Promise<AttractionImage | null> => {
  const { data, error } = await supabase
    .from("attraction_images")
    .select("*")
    .eq("attraction_id", attractionId)
    .eq("is_primary", true)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching primary image:", error);
  }

  return data || null;
};

/**
 * Delete an image
 * 
 * @param imageId - ID of the image record
 * @param storageKey - Storage key for R2 deletion
 */
export const deleteAttractionImage = async (
  imageId: string,
  storageKey: string
): Promise<void> => {
  // Delete from database
  const { error: dbError } = await supabase
    .from("attraction_images")
    .delete()
    .eq("id", imageId);

  if (dbError) {
    console.error("Error deleting image from database:", dbError);
    throw new Error("Failed to delete image");
  }

  // Delete from R2 (you'll need to implement this on your backend)
  // For now, just return success from DB deletion
};

/**
 * Set an image as primary for an attraction
 * 
 * @param imageId - ID of the image to set as primary
 * @param attractionId - ID of the attraction
 */
export const setPrimaryImage = async (
  imageId: string,
  attractionId: string
): Promise<void> => {
  // First, unset any existing primary
  const { error: unsetError } = await supabase
    .from("attraction_images")
    .update({ is_primary: false })
    .eq("attraction_id", attractionId)
    .eq("is_primary", true);

  if (unsetError) {
    console.error("Error unsetting primary image:", unsetError);
    throw new Error("Failed to update primary image");
  }

  // Set new primary
  const { error: setError } = await supabase
    .from("attraction_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (setError) {
    console.error("Error setting primary image:", setError);
    throw new Error("Failed to set primary image");
  }
};
