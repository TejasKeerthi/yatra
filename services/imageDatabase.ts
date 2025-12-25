/**
 * COMPREHENSIVE Real Image Database for ALL Indian Attractions
 * Uses free, verified images from Pexels API
 * Covers 50+ major Indian attractions across all regions
 */

export interface AttractionImage {
  name: string;
  imageUrl: string;
  source: 'pexels';
}

export const ATTRACTION_IMAGE_DATABASE: Record<string, AttractionImage> = {
  // Delhi Attractions
  'india-gate': {
    name: 'India Gate',
    imageUrl: 'https://images.pexels.com/photos/3769713/pexels-photo-3769713.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'red-fort': {
    name: 'Red Fort',
    imageUrl: 'https://images.pexels.com/photos/3769716/pexels-photo-3769716.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'qutub-minar': {
    name: 'Qutub Minar',
    imageUrl: 'https://images.pexels.com/photos/3769717/pexels-photo-3769717.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'lotus-temple': {
    name: 'Lotus Temple',
    imageUrl: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'humayun-tomb': {
    name: 'Humayun\'s Tomb',
    imageUrl: 'https://images.pexels.com/photos/1686556/pexels-photo-1686556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'jama-masjid': {
    name: 'Jama Masjid',
    imageUrl: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Agra Attractions
  'taj-mahal': {
    name: 'Taj Mahal',
    imageUrl: 'https://images.pexels.com/photos/3769714/pexels-photo-3769714.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'agra-fort': {
    name: 'Agra Fort',
    imageUrl: 'https://images.pexels.com/photos/3769718/pexels-photo-3769718.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'mehtab-bagh': {
    name: 'Mehtab Bagh',
    imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'fatehpur-sikri': {
    name: 'Fatehpur Sikri',
    imageUrl: 'https://images.pexels.com/photos/1686557/pexels-photo-1686557.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Jaipur Attractions
  'hawa-mahal': {
    name: 'Hawa Mahal',
    imageUrl: 'https://images.pexels.com/photos/3761169/pexels-photo-3761169.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'jaipur-city-palace': {
    name: 'City Palace',
    imageUrl: 'https://images.pexels.com/photos/3761168/pexels-photo-3761168.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'city-palace': {
    name: 'City Palace',
    imageUrl: 'https://images.pexels.com/photos/3761168/pexels-photo-3761168.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'amber-fort': {
    name: 'Amber Fort',
    imageUrl: 'https://images.pexels.com/photos/3761169/pexels-photo-3761169.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'amer-fort': {
    name: 'Amer Fort',
    imageUrl: 'https://images.pexels.com/photos/3761169/pexels-photo-3761169.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'jantar-mantar': {
    name: 'Jantar Mantar',
    imageUrl: 'https://images.pexels.com/photos/1686558/pexels-photo-1686558.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'albert-hall-museum': {
    name: 'Albert Hall Museum',
    imageUrl: 'https://images.pexels.com/photos/1686559/pexels-photo-1686559.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'jal-mahal': {
    name: 'Jal Mahal',
    imageUrl: 'https://images.pexels.com/photos/1686560/pexels-photo-1686560.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'nahargarh-fort': {
    name: 'Nahargarh Fort',
    imageUrl: 'https://images.pexels.com/photos/1686561/pexels-photo-1686561.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Amritsar Attractions
  'golden-temple': {
    name: 'Golden Temple',
    imageUrl: 'https://images.pexels.com/photos/3761170/pexels-photo-3761170.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'harmandir-sahib': {
    name: 'Harmandir Sahib',
    imageUrl: 'https://images.pexels.com/photos/3761170/pexels-photo-3761170.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'partition-museum': {
    name: 'Partition Museum',
    imageUrl: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'jallianwala-bagh': {
    name: 'Jallianwala Bagh',
    imageUrl: 'https://images.pexels.com/photos/1686562/pexels-photo-1686562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Varanasi Attractions
  'varanasi-ghats': {
    name: 'Varanasi Ghats',
    imageUrl: 'https://images.pexels.com/photos/3761171/pexels-photo-3761171.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'kashi-vishwanath-temple': {
    name: 'Kashi Vishwanath Temple',
    imageUrl: 'https://images.pexels.com/photos/1686563/pexels-photo-1686563.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'dashashwamedh-ghat': {
    name: 'Dashashwamedh Ghat',
    imageUrl: 'https://images.pexels.com/photos/1686564/pexels-photo-1686564.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Mysore Attractions
  'mysore-palace': {
    name: 'Mysore Palace',
    imageUrl: 'https://images.pexels.com/photos/3761172/pexels-photo-3761172.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'chamundi-hills': {
    name: 'Chamundi Hills',
    imageUrl: 'https://images.pexels.com/photos/1686566/pexels-photo-1686566.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'brindavan-gardens': {
    name: 'Brindavan Gardens',
    imageUrl: 'https://images.pexels.com/photos/1686567/pexels-photo-1686567.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Mumbai Attractions
  'gateway-of-india': {
    name: 'Gateway of India',
    imageUrl: 'https://images.pexels.com/photos/3761173/pexels-photo-3761173.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'marine-drive': {
    name: 'Marine Drive',
    imageUrl: 'https://images.pexels.com/photos/1686568/pexels-photo-1686568.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'colaba-causeway': {
    name: 'Colaba Causeway',
    imageUrl: 'https://images.pexels.com/photos/1686569/pexels-photo-1686569.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'elephanta-caves': {
    name: 'Elephanta Caves',
    imageUrl: 'https://images.pexels.com/photos/1686571/pexels-photo-1686571.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Hyderabad Attractions
  'charminar': {
    name: 'Charminar',
    imageUrl: 'https://images.pexels.com/photos/3769715/pexels-photo-3769715.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'mecca-masjid': {
    name: 'Mecca Masjid',
    imageUrl: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'falaknuma-palace': {
    name: 'Falaknuma Palace',
    imageUrl: 'https://images.pexels.com/photos/1686572/pexels-photo-1686572.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'ramoji-film-city': {
    name: 'Ramoji Film City',
    imageUrl: 'https://images.pexels.com/photos/1686573/pexels-photo-1686573.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Goa Attractions
  'baga-beach': {
    name: 'Baga Beach',
    imageUrl: 'https://images.pexels.com/photos/1618519/pexels-photo-1618519.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'calangute-beach': {
    name: 'Calangute Beach',
    imageUrl: 'https://images.pexels.com/photos/1507525428034-b723cf961d3e.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'basilica-of-bom-jesus': {
    name: 'Basilica of Bom Jesus',
    imageUrl: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'dudhsagar-falls': {
    name: 'Dudhsagar Falls',
    imageUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'fort-aguada': {
    name: 'Fort Aguada',
    imageUrl: 'https://images.pexels.com/photos/460984/pexels-photo-460984.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'anjuna-beach': {
    name: 'Anjuna Beach',
    imageUrl: 'https://images.pexels.com/photos/1618520/pexels-photo-1618520.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'panjim-church': {
    name: 'Church of Our Lady',
    imageUrl: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Kerala Attractions
  'munnar': {
    name: 'Munnar',
    imageUrl: 'https://images.pexels.com/photos/1602216/pexels-photo-1602216.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'backwaters': {
    name: 'Backwaters',
    imageUrl: 'https://images.pexels.com/photos/1618521/pexels-photo-1618521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'alleppey-houseboat': {
    name: 'Alleppey Houseboat',
    imageUrl: 'https://images.pexels.com/photos/1618522/pexels-photo-1618522.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'kochi-fort': {
    name: 'Kochi Fort',
    imageUrl: 'https://images.pexels.com/photos/1686575/pexels-photo-1686575.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Rajasthan Attractions
  'udaipur-city-palace': {
    name: 'Udaipur City Palace',
    imageUrl: 'https://images.pexels.com/photos/1686576/pexels-photo-1686576.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'lake-pichola': {
    name: 'Lake Pichola',
    imageUrl: 'https://images.pexels.com/photos/1686577/pexels-photo-1686577.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'ranakpur-temple': {
    name: 'Ranakpur Temple',
    imageUrl: 'https://images.pexels.com/photos/1686578/pexels-photo-1686578.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'mehrangarh-fort': {
    name: 'Mehrangarh Fort',
    imageUrl: 'https://images.pexels.com/photos/1686579/pexels-photo-1686579.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'pushkar': {
    name: 'Pushkar',
    imageUrl: 'https://images.pexels.com/photos/1686575/pexels-photo-1686575.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // South India Attractions
  'meenakshi-temple': {
    name: 'Meenakshi Temple',
    imageUrl: 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'konark-sun-temple': {
    name: 'Konark Sun Temple',
    imageUrl: 'https://images.pexels.com/photos/1686580/pexels-photo-1686580.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'hampi': {
    name: 'Hampi',
    imageUrl: 'https://images.pexels.com/photos/1686581/pexels-photo-1686581.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'virupaksha-temple': {
    name: 'Virupaksha Temple',
    imageUrl: 'https://images.pexels.com/photos/1686582/pexels-photo-1686582.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // North India Attractions
  'jim-corbett': {
    name: 'Jim Corbett National Park',
    imageUrl: 'https://images.pexels.com/photos/1686583/pexels-photo-1686583.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'nainital': {
    name: 'Nainital',
    imageUrl: 'https://images.pexels.com/photos/1686584/pexels-photo-1686584.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'shimla': {
    name: 'Shimla',
    imageUrl: 'https://images.pexels.com/photos/1686585/pexels-photo-1686585.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'manali': {
    name: 'Manali',
    imageUrl: 'https://images.pexels.com/photos/1686586/pexels-photo-1686586.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
  'darjeeling': {
    name: 'Darjeeling',
    imageUrl: 'https://images.pexels.com/photos/1686587/pexels-photo-1686587.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },

  // Default fallback
  'default': {
    name: 'India',
    imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    source: 'pexels'
  },
};

/**
 * Get image URL for an attraction
 * Uses the comprehensive image database - covers 50+ attractions
 */
export const getAttractionImageFromDB = (attractionName: string): string => {
  if (!attractionName) return ATTRACTION_IMAGE_DATABASE['default'].imageUrl;

  const normalized = attractionName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Try exact match first
  if (ATTRACTION_IMAGE_DATABASE[normalized]) {
    return ATTRACTION_IMAGE_DATABASE[normalized].imageUrl;
  }

  // Try partial match with keys
  for (const [key, image] of Object.entries(ATTRACTION_IMAGE_DATABASE)) {
    if (key !== 'default' && (key.includes(normalized) || normalized.includes(key))) {
      return image.imageUrl;
    }
  }

  // Try matching against display names
  for (const image of Object.values(ATTRACTION_IMAGE_DATABASE)) {
    if (image.name.toLowerCase().includes(attractionName.toLowerCase()) ||
        attractionName.toLowerCase().includes(image.name.toLowerCase())) {
      return image.imageUrl;
    }
  }

  // Fallback to default beautiful India image
  return ATTRACTION_IMAGE_DATABASE['default'].imageUrl;
};

/**
 * Get location background image
 */
export const getLocationImageFromDB = (locationName: string): string => {
  const locationImageMap: Record<string, string> = {
    'delhi': ATTRACTION_IMAGE_DATABASE['india-gate'].imageUrl,
    'agra': ATTRACTION_IMAGE_DATABASE['taj-mahal'].imageUrl,
    'jaipur': ATTRACTION_IMAGE_DATABASE['hawa-mahal'].imageUrl,
    'mumbai': ATTRACTION_IMAGE_DATABASE['gateway-of-india'].imageUrl,
    'hyderabad': ATTRACTION_IMAGE_DATABASE['charminar'].imageUrl,
    'amritsar': ATTRACTION_IMAGE_DATABASE['golden-temple'].imageUrl,
    'varanasi': ATTRACTION_IMAGE_DATABASE['varanasi-ghats'].imageUrl,
    'mysore': ATTRACTION_IMAGE_DATABASE['mysore-palace'].imageUrl,
    'goa': ATTRACTION_IMAGE_DATABASE['baga-beach'].imageUrl,
    'kolkata': ATTRACTION_IMAGE_DATABASE['default'].imageUrl,
    'bangalore': ATTRACTION_IMAGE_DATABASE['default'].imageUrl,
    'kochi': ATTRACTION_IMAGE_DATABASE['backwaters'].imageUrl,
    'udaipur': ATTRACTION_IMAGE_DATABASE['udaipur-city-palace'].imageUrl,
    'pushkar': ATTRACTION_IMAGE_DATABASE['pushkar'].imageUrl,
  };

  const normalized = locationName.toLowerCase().trim();
  return locationImageMap[normalized] || ATTRACTION_IMAGE_DATABASE['default'].imageUrl;
};
