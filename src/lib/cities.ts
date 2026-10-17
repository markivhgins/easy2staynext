export interface CityInfo {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  tag: string;
  localities: Array<{
    name: string;
    sub: string;
    category: 'locality' | 'landmark';
  }>;
}

export const SUPPORTED_CITIES: CityInfo[] = [
  {
    id: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    lat: 28.5355,
    lng: 77.3910,
    tag: 'IT Parks & Modern Gated High-Rises',
    localities: [
      { name: 'Sector 62', sub: 'IT Park Hub • JSS, Jaypee & Electronic City Metro', category: 'locality' },
      { name: 'Sector 18', sub: 'Commercial Heart • Atta Market, Wave Mall & Metro', category: 'locality' },
      { name: 'Sector 137', sub: 'Expressway Society Hub • Advant Navis & Metro', category: 'locality' },
      { name: 'Sector 75 & 76', sub: 'Modern High-Rise Societies • Spectrum Mall & Metro', category: 'locality' },
      { name: 'Sector 126', sub: 'University & Tech Hub • Near Amity Gate 2 & HCL', category: 'locality' },
      { name: 'Sector 15 & 16', sub: 'Film City Corridor • Adjacent to DND & Delhi border', category: 'locality' },
      { name: 'Sector 93B', sub: 'Expressway Gated Condos • Grand Omaxe & ATS Village', category: 'locality' },
      { name: 'Sector 128', sub: 'Jaypee Wish Town • Medical & Golf Course Stays', category: 'locality' },
      { name: 'Electronic City Metro', sub: 'Blue Line Rapid Transit Terminal', category: 'landmark' },
      { name: 'Amity University Noida', sub: 'Sector 125 Premier Campus', category: 'landmark' },
      { name: 'Advant Navis Business Park', sub: 'Sector 142 Tech & Corporate Center', category: 'landmark' },
    ],
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'NCT of Delhi',
    lat: 28.6139,
    lng: 77.2090,
    tag: 'National Capital & University Hub',
    localities: [
      { name: 'North Campus (DU / GTB Nagar)', sub: 'Delhi University College Stays & Libraries', category: 'locality' },
      { name: 'South Campus (Satya Niketan)', sub: 'DU South Campus Stays, Cafes & Metro', category: 'locality' },
      { name: 'Mukherjee Nagar', sub: 'Premier UPSC & Civil Services Hub', category: 'locality' },
      { name: 'Laxmi Nagar', sub: 'East Delhi CA, CS & Student Stays', category: 'locality' },
      { name: 'Saket & Malviya Nagar', sub: 'South Delhi Metro & Professional Enclaves', category: 'locality' },
      { name: 'Dwarka (Sectors 6-14)', sub: 'Planned Societies & IP University Corridor', category: 'locality' },
      { name: 'Karol Bagh & Rajendra Nagar', sub: 'IAS Coaching & Central Delhi Hub', category: 'locality' },
      { name: 'Hauz Khas & Green Park', sub: 'IIT Delhi & Upscale Co-Living', category: 'locality' },
      { name: 'India Gate & Central Vista', sub: 'National Capital Landmark', category: 'landmark' },
      { name: 'Connaught Place (CP)', sub: 'Central Commercial & Metro Interchange', category: 'landmark' },
    ],
  },
  {
    id: 'greater-noida',
    name: 'Greater Noida',
    state: 'Uttar Pradesh',
    lat: 28.4744,
    lng: 77.5040,
    tag: 'Knowledge Park & University Hub',
    localities: [
      { name: 'Knowledge Park II & III', sub: 'Premier College Hub • Sharda, Galgotias & Bennett', category: 'locality' },
      { name: 'Pari Chowk', sub: 'Central Commercial & Aqua Line Metro Interchange', category: 'locality' },
      { name: 'Gaur City (Noida Extension)', sub: 'Modern High-Rise Gated Societies', category: 'locality' },
      { name: 'Alpha & Beta Sectors', sub: 'Quiet Scholar & Family Residential Sectors', category: 'locality' },
      { name: 'Delta 1 & 2', sub: 'Student Stays near Metro Station', category: 'locality' },
      { name: 'Sharda University Campus', sub: 'Knowledge Park III Medical & Tech Hub', category: 'landmark' },
      { name: 'India Expo Centre', sub: 'Mega Exhibition & Business Center', category: 'landmark' },
    ],
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    lat: 28.4595,
    lng: 77.0266,
    tag: 'Cyber City & Corporate Headquarters',
    localities: [
      { name: 'Cyber City & DLF Phase 3', sub: 'Major Tech MNCs & Rapid Metro Stays', category: 'locality' },
      { name: 'Golf Course Road', sub: 'Ultra Luxury & Executive Condominiums', category: 'locality' },
      { name: 'Sector 48 & Sohna Road', sub: 'Tech Parks, Subhash Chowk & Society Stays', category: 'locality' },
      { name: 'Sector 56 & 57', sub: 'Metro Terminus • Affordable High-Rise Flats', category: 'locality' },
      { name: 'Cyber Hub', sub: 'Premier Corporate Dining & Tech Hub', category: 'landmark' },
    ],
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6692,
    lng: 77.4538,
    tag: 'Indirapuram & RapidX Corridor',
    localities: [
      { name: 'Indirapuram', sub: 'Shipra Sun City, Vaibhav Khand & Habitat Centre', category: 'locality' },
      { name: 'Vaishali', sub: 'Blue Line Metro Stays • Near Anand Vihar', category: 'locality' },
      { name: 'Vasundhara', sub: 'Green Residential & Coaching Hub', category: 'locality' },
      { name: 'Raj Nagar Extension', sub: 'Modern Affordable High-Rise Societies', category: 'locality' },
      { name: 'Kaushambi', sub: 'Corporate Hub adjacent to East Delhi', category: 'locality' },
      { name: 'Shipra Mall', sub: 'Indirapuram Prime Commercial Center', category: 'landmark' },
      { name: 'Namo Bharat RapidX Station', sub: 'Delhi-Meerut High Speed Transit Corridor', category: 'landmark' },
    ],
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    state: 'Uttar Pradesh',
    lat: 25.4358,
    lng: 81.8463,
    tag: 'AU & Civil Service Hub',
    localities: [
      { name: 'Katra', sub: 'Student Hub • Walking distance to AU & libraries', category: 'locality' },
      { name: 'Civil Lines', sub: 'Central Commercial • High Court & MG Marg', category: 'locality' },
      { name: 'Allahpur', sub: 'Coaching Hub • UPPSC & civil service aspirant stays', category: 'locality' },
      { name: 'George Town', sub: 'Upscale Residential • Family 2BHK/3BHK & quiet stays', category: 'locality' },
      { name: 'Mumfordganj', sub: 'Quiet Scholar Hub • Serene study environment', category: 'locality' },
      { name: 'Teliyarganj', sub: 'Engineering Hub • Adjacent to MNNIT Allahabad', category: 'locality' },
    ],
  },
  {
    id: 'kota',
    name: 'Kota',
    state: 'Rajasthan',
    lat: 25.2138,
    lng: 75.8648,
    tag: 'JEE & NEET Coaching Capital',
    localities: [
      { name: 'Landmark City (Kunhari)', sub: 'Major Institute Campuses & Modern Hostels', category: 'locality' },
      { name: 'Talwandi', sub: 'Established Coaching & Hostel Area', category: 'locality' },
      { name: 'Rajiv Gandhi Nagar', sub: 'Premier Coaching Center Hub', category: 'locality' },
      { name: 'Vigyan Nagar', sub: 'Student Stays & Tiffin Services', category: 'locality' },
    ],
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    tag: 'Oxford of the East & IT Hub',
    localities: [
      { name: 'Kothrud', sub: 'College Hub • MIT World Peace University', category: 'locality' },
      { name: 'Viman Nagar', sub: 'Symbiosis Campus & IT Hub', category: 'locality' },
      { name: 'Hinjewadi', sub: 'Rajiv Gandhi Infotech Park', category: 'locality' },
      { name: 'Baner', sub: 'High-end Stays & Tech Stays', category: 'locality' },
    ],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    tag: 'Silicon Valley of India',
    localities: [
      { name: 'Koramangala', sub: 'Startup Hub, Cafes & Coliving', category: 'locality' },
      { name: 'HSR Layout', sub: 'Tech Professional Stays & Startups', category: 'locality' },
      { name: 'Indiranagar', sub: 'Metro Connected Commercial Hub', category: 'locality' },
      { name: 'BTM Layout', sub: 'Coaching & Tech Aspirant Hub', category: 'locality' },
    ],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    tag: 'Cyberabad & Tech Hub',
    localities: [
      { name: 'Madhapur', sub: 'Hitec City IT Corridor & Coliving', category: 'locality' },
      { name: 'Gachibowli', sub: 'Financial District & University Stays', category: 'locality' },
      { name: 'Ameerpet', sub: 'Software & Govt Exam Coaching Hub', category: 'locality' },
      { name: 'Kondapur', sub: 'Quiet Professional Apartments & Stays', category: 'locality' },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    tag: 'Automotive & IT Corridor',
    localities: [
      { name: 'OMR (Old Mahabalipuram Rd)', sub: 'IT Highway & Modern PG Clusters', category: 'locality' },
      { name: 'Guindy', sub: 'Near Anna University & Tech Parks', category: 'locality' },
      { name: 'Velachery', sub: 'Transit Hub & Student Residences', category: 'locality' },
      { name: 'Adyar', sub: 'Near IIT Madras & Coastal Stays', category: 'locality' },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    tag: 'Financial Capital & Media Hub',
    localities: [
      { name: 'Powai', sub: 'Near IIT Bombay & Tech HQs', category: 'locality' },
      { name: 'Andheri West', sub: 'Metro Hub, Media & Film Enclaves', category: 'locality' },
      { name: 'Bandra', sub: 'Cultural Hub & Premium Coliving', category: 'locality' },
      { name: 'Vashi (Navi Mumbai)', sub: 'Planned City, Colleges & Tech Hubs', category: 'locality' },
    ],
  },
];

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return R * c;
}

/**
 * Finds closest supported city to coordinates
 */
export function findNearestCity(lat: number, lng: number): CityInfo {
  let bestMatch = SUPPORTED_CITIES[0];
  let minDistance = Infinity;

  for (const c of SUPPORTED_CITIES) {
    const dist = haversineDistance(lat, lng, c.lat, c.lng);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = c;
    }
  }

  return bestMatch;
}
