/**
 * Supabase Storage Service
 * Handles file uploads to Supabase Storage (completely free, no credit card needed)
 * Bucket: 'hotel-photos' (public bucket)
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
  }
} else {
  console.warn('Supabase credentials not found in environment variables');
}

const STORAGE_BUCKET = "hotel-photos";

/**
 * Upload a file to Supabase Storage
 * 
 * @param file - File to upload
 * @param attractionId - ID of the attraction (for folder organization)
 * @returns Object with public URL and storage path
 * 
 * @example
 * const result = await uploadToSupabaseStorage(file, 'taj-mahal-123');
 * console.log(result.publicUrl); // https://project.supabase.co/storage/.../file.jpg
 * console.log(result.storagePath); // attractions/taj-mahal-123/1703688000000.jpg
 */
export const uploadToSupabaseStorage = async (
  file: File,
  attractionId: string
): Promise<{
  publicUrl: string;
  storagePath: string;
  fileName: string;
}> => {
  try {
    // Validate file
    validateImageFile(file);

    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}.${fileExtension}`;

    // Create folder structure: attractions/{attractionId}/{fileName}
    const storagePath = `attractions/${attractionId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600", // Cache for 1 hour
        upsert: false, // Don't overwrite if exists
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (!data) {
      throw new Error("Upload returned no data");
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      publicUrl: publicUrlData.publicUrl,
      storagePath: storagePath,
      fileName: fileName,
    };
  } catch (error) {
    console.error("Error uploading to Supabase Storage:", error);
    throw error;
  }
};

/**
 * Generate a thumbnail URL from Supabase Storage image
 * Uses Supabase transform parameters (200x200, cropped)
 * 
 * @param publicUrl - Public URL from Supabase Storage
 * @returns URL with thumbnail transformation
 * 
 * @example
 * const thumbUrl = getThumbnailUrl('https://project.supabase.co/storage/.../image.jpg');
 * // Returns: https://project.supabase.co/storage/...?width=200&height=200
 */
export const getThumbnailUrl = (publicUrl: string): string => {
  // Parse the URL to add transform parameters
  const url = new URL(publicUrl);
  url.searchParams.set("width", "200");
  url.searchParams.set("height", "200");
  return url.toString();
};

/**
 * Generate a mobile hero URL from Supabase Storage image
 * Optimized for mobile screens (600px width)
 * 
 * @param publicUrl - Public URL from Supabase Storage
 * @returns URL with mobile optimization
 * 
 * @example
 * const mobileUrl = getMobileHeroUrl('https://project.supabase.co/storage/.../image.jpg');
 * // Returns: https://project.supabase.co/storage/...?width=600&height=400
 */
export const getMobileHeroUrl = (publicUrl: string): string => {
  const url = new URL(publicUrl);
  url.searchParams.set("width", "600");
  url.searchParams.set("height", "400");
  return url.toString();
};

/**
 * Generate a desktop hero URL from Supabase Storage image
 * Optimized for desktop screens (1200px width)
 * 
 * @param publicUrl - Public URL from Supabase Storage
 * @returns URL with desktop optimization
 * 
 * @example
 * const desktopUrl = getDesktopHeroUrl('https://project.supabase.co/storage/.../image.jpg');
 * // Returns: https://project.supabase.co/storage/...?width=1200&height=600
 */
export const getDesktopHeroUrl = (publicUrl: string): string => {
  const url = new URL(publicUrl);
  url.searchParams.set("width", "1200");
  url.searchParams.set("height", "600");
  return url.toString();
};

/**
 * Generate a custom size URL from Supabase Storage image
 * 
 * @param publicUrl - Public URL from Supabase Storage
 * @param width - Desired width in pixels
 * @param height - Desired height in pixels
 * @returns URL with custom dimensions
 * 
 * @example
 * const customUrl = getCustomSizeUrl(publicUrl, 400, 300);
 */
export const getCustomSizeUrl = (
  publicUrl: string,
  width: number,
  height?: number
): string => {
  const url = new URL(publicUrl);
  url.searchParams.set("width", width.toString());
  if (height) {
    url.searchParams.set("height", height.toString());
  }
  return url.toString();
};

/**
 * Delete a file from Supabase Storage
 * 
 * @param storagePath - Path of file to delete (e.g., 'attractions/taj-mahal-123/123456.jpg')
 * @returns true if successful
 * 
 * @example
 * await deleteFromStorage('attractions/taj-mahal-123/123456.jpg');
 */
export const deleteFromStorage = async (storagePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting from storage:", error);
    throw error;
  }
};

/**
 * Validate image file before upload
 * 
 * @param file - File to validate
 * @throws Error if validation fails
 * @returns true if valid
 */
export const validateImageFile = (file: File): boolean => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (!allowedMimes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images."
    );
  }

  // Max 50MB
  const maxSizeBytes = 50 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(
      "File size exceeds 50MB limit. Please compress your image."
    );
  }

  return true;
};

/**
 * List all images for an attraction
 * 
 * @param attractionId - ID of the attraction
 * @returns Array of file paths
 */
export const listAttractionImages = async (
  attractionId: string
): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(`attractions/${attractionId}`);

    if (error) {
      console.error("List error:", error);
      throw new Error(`Failed to list images: ${error.message}`);
    }

    return (data || [])
      .filter((item) => !item.name.startsWith("."))
      .map((item) => `attractions/${attractionId}/${item.name}`);
  } catch (error) {
    console.error("Error listing images:", error);
    throw error;
  }
};
