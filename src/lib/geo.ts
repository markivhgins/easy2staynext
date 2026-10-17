/**
 * geo.ts — Geospatial utilities and Prayagraj landmarks
 */

export interface Landmark {
  name: string;
  category: 'Education' | 'Transit' | 'Judiciary' | 'Landmark';
  // [longitude, latitude] GeoJSON format
  coordinates: [number, number];
}

export const ALL_LANDMARKS: Landmark[] = [
  // Noida & Delhi NCR Key Hubs
  {
    name: 'Sector 62 Metro & IT Complex (Noida)',
    category: 'Transit',
    coordinates: [77.3713, 28.6280],
  },
  {
    name: 'Sector 18 Metro & Mall of India (Noida)',
    category: 'Landmark',
    coordinates: [77.3248, 28.5708],
  },
  {
    name: 'Amity University Campus (Sector 126)',
    category: 'Education',
    coordinates: [77.3332, 28.5448],
  },
  {
    name: 'Sector 137 Metro & Advant Navis Park',
    category: 'Transit',
    coordinates: [77.4042, 28.5028],
  },
  {
    name: 'Knowledge Park & Pari Chowk (Gr. Noida)',
    category: 'Education',
    coordinates: [77.5037, 28.4650],
  },
  {
    name: 'Botanical Garden Metro Interchange',
    category: 'Transit',
    coordinates: [77.3342, 28.5642],
  },
  {
    name: 'Shipra Mall & Swarna Jayanti Park (Indirapuram)',
    category: 'Landmark',
    coordinates: [77.3705, 28.6360],
  },
  {
    name: 'DLF Cyber City & Phase 3 (Gurugram)',
    category: 'Transit',
    coordinates: [77.0878, 28.4950],
  },
  // Prayagraj Hubs
  {
    name: 'University of Allahabad (Arts Campus)',
    category: 'Education',
    coordinates: [81.8596, 25.4593],
  },
  {
    name: 'MNNIT Allahabad (Teliarganj)',
    category: 'Education',
    coordinates: [81.8636, 25.4925],
  },
  {
    name: 'Allahabad High Court',
    category: 'Judiciary',
    coordinates: [81.8267, 25.4484],
  },
  {
    name: 'Prayagraj Junction (Main Railway Station)',
    category: 'Transit',
    coordinates: [81.8335, 25.4431],
  },
  {
    name: 'Civil Lines Central Hub / MG Marg',
    category: 'Transit',
    coordinates: [81.834, 25.453],
  },
  {
    name: 'Anand Bhawan & Chandrashekhar Azad Park',
    category: 'Landmark',
    coordinates: [81.858, 25.455],
  },
  {
    name: 'Triveni Sangam Ghat',
    category: 'Landmark',
    coordinates: [81.8845, 25.4295],
  },
];

export const PRAYAGRAJ_LANDMARKS = ALL_LANDMARKS;

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface NearbyLandmarkDistance {
  name: string;
  category: string;
  distanceKm: number;
  driveMin: number;
}

/**
 * Returns sorted nearest landmarks for given listing coordinates
 */
export function getNearestLandmarks(
  lon: number,
  lat: number,
  limit = 4
): NearbyLandmarkDistance[] {
  return PRAYAGRAJ_LANDMARKS.map((lm) => {
    const dist = calculateDistanceKm(lon, lat, lm.coordinates[0], lm.coordinates[1]);
    // Estimate drive time: ~25 km/h city average in Prayagraj + 2 mins base
    const driveMin = Math.max(3, Math.round((dist / 25) * 60) + 2);
    return {
      name: lm.name,
      category: lm.category,
      distanceKm: dist,
      driveMin,
    };
  })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
