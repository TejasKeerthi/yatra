import { useState, useEffect } from 'react';
import { getAttractionImages, getPrimaryAttractionImage } from '../services/supabaseService';
import { getMobileHeroUrl, getDesktopHeroUrl } from '../services/supabaseStorageService';

interface AttractionImage {
  id: string;
  attraction_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

interface UseSupabaseImagesReturn {
  primaryImage: AttractionImage | null;
  allImages: AttractionImage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch attraction images from Supabase
 * Returns primary image (for hero/card), all images (for gallery), and refetch function
 */
export const useSupabaseImages = (attractionId: string): UseSupabaseImagesReturn => {
  const [primaryImage, setPrimaryImage] = useState<AttractionImage | null>(null);
  const [allImages, setAllImages] = useState<AttractionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!attractionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch primary image
      const primary = await getPrimaryAttractionImage(attractionId);
      setPrimaryImage(primary || null);

      // Fetch all images
      const all = await getAttractionImages(attractionId);
      setAllImages(all || []);
    } catch (err) {
      console.error('Error fetching attraction images:', err);
      setError(err instanceof Error ? err.message : 'Failed to load images');
      // Don't crash the app - just show no images
      setPrimaryImage(null);
      setAllImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [attractionId]);

  return {
    primaryImage,
    allImages,
    loading,
    error,
    refetch: fetchImages,
  };
};

/**
 * Get responsive image URL for primary image
 * Returns mobile URL if on small screen, desktop otherwise
 */
export const getResponsiveImageUrl = (imageUrl: string | null, isMobile: boolean = false): string => {
  if (!imageUrl) return '';
  
  if (isMobile) {
    return getMobileHeroUrl(imageUrl); // 600x400
  }
  return getDesktopHeroUrl(imageUrl); // 1200x600
};
