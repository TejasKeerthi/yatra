/**
 * Curated, accurate images for Indian attractions
 * Using specific, high-quality Unsplash photo IDs for consistency
 */

// Exact image URLs for each attraction - using Unsplash high-quality images
const exactAttractionImages: Record<string, string> = {
  'taj-mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
  'hawa-mahal': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
  'india-gate': 'https://images.unsplash.com/photo-1595053826286-2e5960912c8d?w=800&h=600&fit=crop',
  'jaipur-city-palace': 'https://images.unsplash.com/photo-1578881944693-c48c0e5e91da?w=800&h=600&fit=crop',
  'golden-temple': 'https://images.unsplash.com/photo-1606202823983-211b65b80d26?w=800&h=600&fit=crop',
  'varanasi-ghats': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  'red-fort': 'https://images.unsplash.com/photo-1595053826286-2e5960912c8d?w=800&h=600&fit=crop',
  'mysore-palace': 'https://images.unsplash.com/photo-1582562013453-e48e82253e5f?w=800&h=600&fit=crop',
  'gateway-of-india': 'https://images.unsplash.com/photo-1570019614776-aed22f17547b?w=800&h=600&fit=crop',
  'charminar': 'https://images.unsplash.com/photo-1596448224772-5dd5017ed1ea?w=800&h=600&fit=crop',
  'amber-fort': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
  'city-palace': 'https://images.unsplash.com/photo-1578881944693-c48c0e5e91da?w=800&h=600&fit=crop',
  'baga-beach': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
  'calangute-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
  'basilica-of-bom-jesus': 'https://images.unsplash.com/photo-1577720643272-265bf1daa738?w=800&h=600&fit=crop',
  'dudhsagar-falls': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
};

export const getAttractionImageUrl = (attractionName: string): string => {
  // Normalize the name
  const normalized = attractionName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Check if we have an exact image for this attraction
  if (exactAttractionImages[normalized]) {
    return exactAttractionImages[normalized];
  }
  
  // Check by partial match
  for (const [key, url] of Object.entries(exactAttractionImages)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return url;
    }
  }
  
  // Fallback to a generic India image
  return 'https://images.unsplash.com/photo-1595053826286-2e5960912c8d?w=800&h=600&fit=crop';
};

/**
 * Fallback image URLs for common Indian destinations
 */
export const getBackgroundImageForLocation = (locationName: string): string => {
  const locationMap: Record<string, string> = {
    'delhi': 'https://images.unsplash.com/photo-1595053826286-2e5960912c8d?w=800&h=600&fit=crop',
    'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    'jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    'mumbai': 'https://images.unsplash.com/photo-1570019614776-aed22f17547b?w=800&h=600&fit=crop',
    'hyderabad': 'https://images.unsplash.com/photo-1596448224772-5dd5017ed1ea?w=800&h=600&fit=crop',
    'amritsar': 'https://images.unsplash.com/photo-1606202823983-211b65b80d26?w=800&h=600&fit=crop',
    'varanasi': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'mysore': 'https://images.unsplash.com/photo-1582562013453-e48e82253e5f?w=800&h=600&fit=crop',
    'goa': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
  };
  
  const normalized = locationName.toLowerCase().trim();
  return locationMap[normalized] || 'https://images.unsplash.com/photo-1595053826286-2e5960912c8d?w=800&h=600&fit=crop';
};
