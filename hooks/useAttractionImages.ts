/**
 * Advanced Image Management Hook
 * Provides a complete solution for managing attraction images
 */

import { useState, useCallback } from 'react';
import { 
  getAttractionImages, 
  getPrimaryAttractionImage,
  setPrimaryImage,
  deleteAttractionImage,
  AttractionImage 
} from '../services/supabaseService';
import { getThumbnail, getMobileHero, getDesktopHero } from '../services/imageKitService';

interface UseAttractionImagesReturn {
  images: AttractionImage[];
  primaryImage: AttractionImage | null;
  loading: boolean;
  error: Error | null;
  
  // Image management functions
  fetchImages: (attractionId: string) => Promise<void>;
  fetchPrimaryImage: (attractionId: string) => Promise<void>;
  setPrimary: (imageId: string, attractionId: string) => Promise<void>;
  removeImage: (imageId: string, storageKey: string) => Promise<void>;
  
  // Helper functions
  getThumbnailUrl: (image: AttractionImage) => string;
  getMobileUrl: (image: AttractionImage) => string;
  getDesktopUrl: (image: AttractionImage) => string;
}

/**
 * useAttractionImages Hook
 * 
 * Complete image management for attractions
 * 
 * @param attractionId - The attraction to manage images for
 * @returns Object with images, functions, and helpers
 * 
 * @example
 * const { images, primaryImage, fetchImages, setPrimary } = useAttractionImages('attraction-123');
 * 
 * useEffect(() => {
 *   fetchImages('attraction-123');
 * }, []);
 */
export const useAttractionImages = (
  attractionId: string
): UseAttractionImagesReturn => {
  const [images, setImages] = useState<AttractionImage[]>([]);
  const [primaryImage, setPrimaryImageState] = useState<AttractionImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all images for an attraction
   */
  const fetchImages = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAttractionImages(id);
        setImages(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch primary image for an attraction
   */
  const fetchPrimaryImage = useCallback(
    async (id: string) => {
      try {
        const data = await getPrimaryAttractionImage(id);
        setPrimaryImageState(data);
      } catch (err) {
        console.error('Failed to fetch primary image:', err);
      }
    },
    []
  );

  /**
   * Set an image as primary
   */
  const setPrimary = useCallback(
    async (imageId: string, id: string) => {
      try {
        await setPrimaryImage(imageId, id);
        // Refresh the primary image
        await fetchPrimaryImage(id);
        // Mark in images array
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            is_primary: img.id === imageId,
          }))
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Failed to set primary image:', error);
      }
    },
    [fetchPrimaryImage]
  );

  /**
   * Remove an image
   */
  const removeImage = useCallback(
    async (imageId: string, storageKey: string) => {
      try {
        await deleteAttractionImage(imageId, storageKey);
        // Remove from images array
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Failed to delete image:', error);
      }
    },
    []
  );

  /**
   * Get thumbnail URL from image record
   */
  const getThumbnailUrl = useCallback((image: AttractionImage): string => {
    return image.thumbnail_url || getThumbnail(image.image_url);
  }, []);

  /**
   * Get mobile hero URL from image record
   */
  const getMobileUrl = useCallback((image: AttractionImage): string => {
    return image.mobile_hero_url || getMobileHero(image.image_url);
  }, []);

  /**
   * Get desktop hero URL from image record
   */
  const getDesktopUrl = useCallback((image: AttractionImage): string => {
    return image.desktop_hero_url || getDesktopHero(image.image_url);
  }, []);

  return {
    images,
    primaryImage,
    loading,
    error,
    fetchImages,
    fetchPrimaryImage,
    setPrimary,
    removeImage,
    getThumbnailUrl,
    getMobileUrl,
    getDesktopUrl,
  };
};
