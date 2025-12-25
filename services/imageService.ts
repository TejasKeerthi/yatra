/**
 * Curated, accurate images for Indian attractions
 * Using Wikimedia Commons and verified sources for consistency
 */

// Exact image URLs for each attraction - these won't change
const exactAttractionImages: Record<string, string> = {
  'taj-mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1200px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
  'hawa-mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Hawa_Mahal%2C_Jaipur%2C_Rajasthan.jpg/1200px-Hawa_Mahal%2C_Jaipur%2C_Rajasthan.jpg',
  'india-gate': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/India_Gate_Delhi_1.jpg/1200px-India_Gate_Delhi_1.jpg',
  'jaipur-city-palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/City_Palace_Jaipur.jpg/1200px-City_Palace_Jaipur.jpg',
  'golden-temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Golden_Temple%2C_Amritsar.jpg/1200px-Golden_Temple%2C_Amritsar.jpg',
  'varanasi-ghats': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Varanasi_Ganges_Ghats_1.jpg/1200px-Varanasi_Ganges_Ghats_1.jpg',
  'red-fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lal_Qila_Delhi.JPG/1200px-Lal_Qila_Delhi.JPG',
  'mysore-palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mysore_Palace_Illuminated.jpg/1200px-Mysore_Palace_Illuminated.jpg',
  'gateway-of-india': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Gateway_of_India_by_Jon_Choo.jpg/1200px-Gateway_of_India_by_Jon_Choo.jpg',
  'charminar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Char_minar.jpg/1200px-Char_minar.jpg',
  'amber-fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Amer_Fort_Jaipur_1.jpg/1200px-Amer_Fort_Jaipur_1.jpg',
  'city-palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/City_Palace_Jaipur.jpg/1200px-City_Palace_Jaipur.jpg',
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
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/India_Gate_Delhi_1.jpg/1200px-India_Gate_Delhi_1.jpg';
};

/**
 * Fallback image URLs for common Indian destinations
 */
export const getBackgroundImageForLocation = (locationName: string): string => {
  const locationMap: Record<string, string> = {
    'delhi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/India_Gate_Delhi_1.jpg/1200px-India_Gate_Delhi_1.jpg',
    'agra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1200px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
    'jaipur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Hawa_Mahal%2C_Jaipur%2C_Rajasthan.jpg/1200px-Hawa_Mahal%2C_Jaipur%2C_Rajasthan.jpg',
    'mumbai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Gateway_of_India_by_Jon_Choo.jpg/1200px-Gateway_of_India_by_Jon_Choo.jpg',
    'hyderabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Char_minar.jpg/1200px-Char_minar.jpg',
    'amritsar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Golden_Temple%2C_Amritsar.jpg/1200px-Golden_Temple%2C_Amritsar.jpg',
    'varanasi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Varanasi_Ganges_Ghats_1.jpg/1200px-Varanasi_Ganges_Ghats_1.jpg',
    'mysore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mysore_Palace_Illuminated.jpg/1200px-Mysore_Palace_Illuminated.jpg',
  };
  
  const normalized = locationName.toLowerCase().trim();
  return locationMap[normalized] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/India_Gate_Delhi_1.jpg/1200px-India_Gate_Delhi_1.jpg';
};
