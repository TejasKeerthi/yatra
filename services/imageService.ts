/**
 * Image Service - Provides real, verified images from database
 * All images are free and sourced from Pexels API
 */

import { getAttractionImageFromDB, getLocationImageFromDB } from './imageDatabase';

/**
 * Get image URL for an attraction
 * Uses the verified image database with real photos
 */
export const getAttractionImageUrl = (attractionName: string): string => {
  return getAttractionImageFromDB(attractionName);
};

/**
 * Get background image for a location
 */
export const getBackgroundImageForLocation = (locationName: string): string => {
  return getLocationImageFromDB(locationName);
};
