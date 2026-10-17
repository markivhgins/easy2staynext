/**
 * listings.ts — Listing query and repository services.
 */

import { getDb } from './db';
import type { Listing, PublicListing, EntryPoint } from '@/types';
import { ObjectId } from 'mongodb';

const day = (n: number) => new Date(Date.now() - n * 864e5);

export const SEED_LISTINGS: Array<Partial<Listing>> = [
  {
    slug: 'noida-sec62-aura-pg',
    title: 'Aura Elite Co-Living & PG',
    accommodationType: 'PG',
    entryPoints: ['pg'],
    city: 'Noida',
    locality: 'Sector 62',
    locationPrivate: { type: 'Point', coordinates: [77.362, 28.628] },
    addressPrivate: 'B-34, Stellar IT Park Road, Sector 62, Noida',
    publicLocation: { type: 'Point', coordinates: [77.364, 28.629], areaLabel: 'Sector 62', approximate: true },
    price: {
      amountPaise: 850000,
      basis: 'PER_BED_MONTH',
      depositPaise: 850000,
      maintenancePaise: 0,
      electricityBasis: 'METERED',
      foodIncluded: true,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(1),
    },
    gender: 'boys',
    occupancy: '2-share',
    meals: 'All 3 Meals Included',
    gateTime: '11:00 pm',
    amenities: ['High Speed Wi-Fi', 'Power Backup', 'Attached Washroom', 'RO Water', 'Housekeeping'],
    rules: ['Biometric entry access', 'Quiet hours after 11 pm', 'Visitors in lounge only'],
    media: [{ storageKey: 'pg-1', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(4), validUntil: new Date(Date.now() + 86 * 864e5), scope: 'Physical on-site audit & verified meter' },
    availability: { status: 'AVAILABLE', confirmedAt: day(1) },
    createdAt: day(30),
    updatedAt: day(1),
  },
  {
    slug: 'noida-sec126-hive-girls-pg',
    title: 'The Hive Luxury Girls Residency',
    accommodationType: 'PG',
    entryPoints: ['pg'],
    city: 'Noida',
    locality: 'Sector 126',
    locationPrivate: { type: 'Point', coordinates: [77.338, 28.544] },
    addressPrivate: 'Plot 18, Near Amity University Gate 2, Sector 126, Noida',
    publicLocation: { type: 'Point', coordinates: [77.339, 28.545], areaLabel: 'Sector 126', approximate: true },
    price: {
      amountPaise: 1100000,
      basis: 'PER_BED_MONTH',
      depositPaise: 1100000,
      maintenancePaise: 0,
      electricityBasis: 'METERED',
      foodIncluded: true,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(2),
    },
    gender: 'girls',
    occupancy: 'single',
    meals: 'Breakfast + Dinner Buffet',
    gateTime: '10:00 pm',
    amenities: ['Air Conditioned', 'Wi-Fi', '24x7 Female Warden', 'CCTV Security', 'Lift', 'Laundry'],
    rules: ['Gate closes at 10:00 pm', 'Digital sign-in for visitors', 'Strict safety protocols'],
    media: [{ storageKey: 'pg-2', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(7), validUntil: new Date(Date.now() + 83 * 864e5), scope: 'Complete 360 security & kitchen hygiene audit' },
    availability: { status: 'AVAILABLE', confirmedAt: day(2) },
    createdAt: day(40),
    updatedAt: day(2),
  },
  {
    slug: 'greater-noida-scholars-residency',
    title: 'Knowledge Park Scholars Residency',
    accommodationType: 'PG',
    entryPoints: ['pg'],
    city: 'Greater Noida',
    locality: 'Knowledge Park II',
    locationPrivate: { type: 'Point', coordinates: [77.492, 28.468] },
    addressPrivate: 'Plot 22, Institutional Area, Knowledge Park II, Greater Noida',
    publicLocation: { type: 'Point', coordinates: [77.493, 28.469], areaLabel: 'Knowledge Park II', approximate: true },
    price: {
      amountPaise: 720000,
      basis: 'PER_BED_MONTH',
      depositPaise: 720000,
      maintenancePaise: 0,
      electricityBasis: 'ACTUALS',
      foodIncluded: true,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(3),
    },
    gender: 'co-ed',
    occupancy: '2-share',
    meals: '3 Meals + Evening Tea',
    gateTime: '10:30 pm',
    amenities: ['Wi-Fi', 'Gym Facility', 'Study Library', 'RO Drinking Water', 'Free Shuttle to Metro'],
    rules: ['Quiet study environment', 'College ID mandatory for registration'],
    media: [{ storageKey: 'pg-3', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(10), validUntil: new Date(Date.now() + 80 * 864e5), scope: 'Premises, water TDS & fire safety certified' },
    availability: { status: 'AVAILABLE', confirmedAt: day(3) },
    createdAt: day(35),
    updatedAt: day(3),
  },
  {
    slug: 'noida-sec77-express-zenith-2bhk',
    title: 'Express Zenith 2BHK High-Rise',
    accommodationType: 'FLAT',
    entryPoints: ['flats', 'society'],
    city: 'Noida',
    locality: 'Sector 77',
    societyName: 'Express Zenith',
    locationPrivate: { type: 'Point', coordinates: [77.388, 28.572] },
    addressPrivate: 'Tower C, 9th Floor, Express Zenith, Sector 77, Noida',
    publicLocation: { type: 'Point', coordinates: [77.389, 28.573], areaLabel: 'Sector 77', approximate: true },
    price: {
      amountPaise: 2400000,
      basis: 'PER_UNIT_MONTH',
      depositPaise: 4800000,
      maintenancePaise: 250000,
      electricityBasis: 'METERED',
      foodIncluded: false,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(1),
    },
    bhk: '2 BHK',
    furnishing: 'Semi-furnished',
    amenities: ['Club House', 'Swimming Pool', '24x7 Power Backup', 'Covered Parking', 'High Speed Lifts'],
    rules: ['Gated society bylaws apply', 'Tenant police verification required', 'Notice period: 1 month'],
    media: [{ storageKey: 'flat-1', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(2), validUntil: new Date(Date.now() + 88 * 864e5), scope: 'Society RWA authority & property paperwork inspected' },
    availability: { status: 'AVAILABLE', confirmedAt: day(1) },
    createdAt: day(18),
    updatedAt: day(1),
  },
  {
    slug: 'noida-sec137-paras-tierea-1bhk',
    title: 'Paras Tierea Executive 1BHK Studio',
    accommodationType: 'FLAT',
    entryPoints: ['flats'],
    city: 'Noida',
    locality: 'Sector 137',
    societyName: 'Paras Tierea',
    locationPrivate: { type: 'Point', coordinates: [77.404, 28.513] },
    addressPrivate: 'Tower 4, 14th Floor, Paras Tierea, Sector 137, Expressway, Noida',
    publicLocation: { type: 'Point', coordinates: [77.405, 28.514], areaLabel: 'Sector 137', approximate: true },
    price: {
      amountPaise: 1650000,
      basis: 'PER_UNIT_MONTH',
      depositPaise: 3300000,
      maintenancePaise: 180000,
      electricityBasis: 'METERED',
      foodIncluded: false,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(2),
    },
    bhk: '1 BHK',
    furnishing: 'Fully furnished',
    amenities: ['Walking distance to Metro', 'Sofa & Bed', 'AC', 'Modular Kitchen', 'Club Access'],
    rules: ['Working professionals preferred', 'No sub-letting permitted'],
    media: [{ storageKey: 'flat-2', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(5), validUntil: new Date(Date.now() + 85 * 864e5), scope: 'On-site appliance, electrical & key check passed' },
    availability: { status: 'AVAILABLE', confirmedAt: day(2) },
    createdAt: day(22),
    updatedAt: day(2),
  },
  {
    slug: 'noida-sec93-grand-omaxe-3bhk',
    title: 'Grand Omaxe Gated Society 3BHK',
    accommodationType: 'FLAT',
    entryPoints: ['society', 'flats'],
    city: 'Noida',
    locality: 'Sector 93B',
    societyName: 'Grand Omaxe',
    locationPrivate: { type: 'Point', coordinates: [77.382, 28.518] },
    addressPrivate: 'Tower Forest, 11th Floor, Grand Omaxe, Sector 93B, Noida',
    publicLocation: { type: 'Point', coordinates: [77.383, 28.519], areaLabel: 'Sector 93B', approximate: true },
    price: {
      amountPaise: 3800000,
      basis: 'PER_UNIT_MONTH',
      depositPaise: 7600000,
      maintenancePaise: 350000,
      electricityBasis: 'METERED',
      foodIncluded: false,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(1),
    },
    bhk: '3 BHK',
    furnishing: 'Semi-furnished',
    amenities: ['Expansive Green Parks', 'Tennis Court', 'Olympic Pool', 'Covered Reserved Stilt Parking', 'Gym'],
    rules: ['Families preferred', 'Quiet residential hours enforced by RWA'],
    media: [{ storageKey: 'flat-3', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(6), validUntil: new Date(Date.now() + 84 * 864e5), scope: 'Physical audit of electrical safety, society NOC & balcony guards' },
    availability: { status: 'AVAILABLE', confirmedAt: day(1) },
    createdAt: day(28),
    updatedAt: day(1),
  },
  {
    slug: 'noida-sec128-jaypee-kalypso',
    title: 'Jaypee Kalypso Court Golf Suite 3BHK',
    accommodationType: 'INDEPENDENT_HOUSE',
    entryPoints: ['society'],
    city: 'Noida',
    locality: 'Sector 128',
    societyName: 'Jaypee Greens Wish Town',
    locationPrivate: { type: 'Point', coordinates: [77.362, 28.528] },
    addressPrivate: 'Tower 8, Kalypso Court, Jaypee Greens, Sector 128, Noida',
    publicLocation: { type: 'Point', coordinates: [77.363, 28.529], areaLabel: 'Sector 128', approximate: true },
    price: {
      amountPaise: 4600000,
      basis: 'PER_UNIT_MONTH',
      depositPaise: 9200000,
      maintenancePaise: 420000,
      electricityBasis: 'METERED',
      foodIncluded: false,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(3),
    },
    bhk: '3 BHK',
    furnishing: 'Fully furnished',
    amenities: ['18-Hole Golf View', 'Clubhouse & Spa', 'Smart Home Locks', 'Tennis & Badminton Courts', 'Concierge Desk'],
    rules: ['Executive corporate or family lease', 'Strict security clearance'],
    media: [{ storageKey: 'flat-4', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(8), validUntil: new Date(Date.now() + 82 * 864e5), scope: 'Luxury unit audited: marble flooring, HVAC & society title verified' },
    availability: { status: 'AVAILABLE', confirmedAt: day(3) },
    createdAt: day(32),
    updatedAt: day(3),
  },
  {
    slug: 'ghaziabad-indirapuram-shipra-2bhk',
    title: 'Shipra Sun City 2BHK Society Flat',
    accommodationType: 'FLAT',
    entryPoints: ['flats', 'society'],
    city: 'Ghaziabad',
    locality: 'Indirapuram',
    societyName: 'Shipra Sun City',
    locationPrivate: { type: 'Point', coordinates: [77.375, 28.638] },
    addressPrivate: 'Regal Tower, 7th Floor, Shipra Sun City, Indirapuram, Ghaziabad',
    publicLocation: { type: 'Point', coordinates: [77.376, 28.639], areaLabel: 'Indirapuram', approximate: true },
    price: {
      amountPaise: 2100000,
      basis: 'PER_UNIT_MONTH',
      depositPaise: 4200000,
      maintenancePaise: 200000,
      electricityBasis: 'METERED',
      foodIncluded: false,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(2),
    },
    bhk: '2 BHK',
    furnishing: 'Semi-furnished',
    amenities: ['Market Inside Society', 'Near Electronic City Metro', '24x7 Water Supply', 'Gated Security'],
    rules: ['Family or working professionals', 'Standard society norms'],
    media: [{ storageKey: 'flat-1', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(9), validUntil: new Date(Date.now() + 81 * 864e5), scope: 'Physically inspected: piping, wiring, and society security confirmed' },
    availability: { status: 'AVAILABLE', confirmedAt: day(2) },
    createdAt: day(26),
    updatedAt: day(2),
  },
  {
    slug: 'ghaziabad-modinagar-srm-scholars-residency',
    title: 'SRM Scholars Campus Residency & Premium PG',
    accommodationType: 'PG',
    entryPoints: ['pg'],
    city: 'Ghaziabad',
    locality: 'Modinagar (Near SRM University)',
    societyName: 'SRM Scholars Enclave',
    locationPrivate: { type: 'Point', coordinates: [77.585, 28.826] },
    addressPrivate: 'Opposite SRM Institute of Science & Technology Gate 2, Delhi-Meerut Road, Modinagar, Ghaziabad',
    publicLocation: { type: 'Point', coordinates: [77.586, 28.827], areaLabel: 'Near SRM University, Modinagar', approximate: true },
    price: {
      amountPaise: 850000,
      basis: 'PER_BED_MONTH',
      depositPaise: 850000,
      maintenancePaise: 0,
      electricityBasis: 'INCLUDED',
      foodIncluded: true,
      oneTimeFeesPaise: 0,
      priceConfirmedAt: day(1),
    },
    gender: 'boys',
    occupancy: 'double',
    meals: '3 meals included (North & South Indian menu)',
    gateTime: '10:00 PM',
    amenities: ['High Speed WiFi (Fiber)', '3-Tier Security & Biometric', '4 Meals Daily', 'AC & Geyser', 'Study Desk & Bookshelf', 'Daily Housekeeping', 'Power Backup 24x7'],
    rules: ['Student ID card mandatory (SRM/KIET/RKGIT)', 'No smoking/alcohol on premises', 'Biometric check-in by 10 PM'],
    media: [{ storageKey: 'pg-1', order: 1 }],
    status: 'PUBLISHED',
    verification: { state: 'VERIFIED', verifiedAt: day(2), validUntil: new Date(Date.now() + 88 * 864e5), scope: 'Physical inspection completed: fire safety, water RO, campus proximity verified' },
    availability: { status: 'AVAILABLE', confirmedAt: day(1) },
    createdAt: day(10),
    updatedAt: day(1),
  },
];

export async function seedIfEmpty(): Promise<void> {
  try {
    const db = await getDb();
    const count = await db.collection('listings').countDocuments();
    if (count === 0) {
      const defaultOwnerId = new ObjectId();
      const docs = SEED_LISTINGS.map((l) => ({
        ...l,
        _id: new ObjectId(),
        ownerId: defaultOwnerId,
      }));
      await db.collection('listings').insertMany(docs);
      console.log(`[db] Seeded ${docs.length} listings into database.`);
    }
  } catch (err) {
    console.warn('[db] Seed check warning (will retry on next request):', (err as Error).message);
  }
}

export function shapeListing(raw: any): PublicListing {
  const p = raw.price || {};
  const availConfirmed = new Date(raw.availability?.confirmedAt || Date.now());
  const verifiedOn = new Date(raw.verification?.verifiedAt || Date.now());

  const availAgeDays = Math.max(0, Math.floor((Date.now() - availConfirmed.getTime()) / 864e5));
  const verifiedAgeDays = Math.max(0, Math.floor((Date.now() - verifiedOn.getTime()) / 864e5));
  const rent = p.amountPaise || 0;
  const deposit = p.depositPaise || 0;
  const maint = p.maintenancePaise || 0;

  return {
    _id: raw._id,
    slug: raw.slug,
    title: raw.title,
    accommodationType: raw.accommodationType,
    entryPoints: raw.entryPoints || [],
    city: raw.city || 'Noida',
    locality: raw.locality || '',
    publicLocation: raw.publicLocation || {
      type: 'Point',
      coordinates: [77.3910, 28.5355],
      areaLabel: raw.locality || 'Noida',
      approximate: true,
    },
    societyId: raw.societyId,
    societyName: raw.societyName,
    price: {
      amountPaise: rent,
      basis: p.basis || 'PER_BED_MONTH',
      depositPaise: deposit,
      maintenancePaise: maint,
      electricityBasis: p.electricityBasis || 'METERED',
      foodIncluded: !!p.foodIncluded,
      oneTimeFeesPaise: p.oneTimeFeesPaise || 0,
      priceConfirmedAt: p.priceConfirmedAt || new Date(),
    },
    amenities: raw.amenities || [],
    rules: raw.rules || [],
    gender: raw.gender,
    occupancy: raw.occupancy,
    meals: raw.meals,
    gateTime: raw.gateTime,
    bhk: raw.bhk,
    furnishing: raw.furnishing,
    media: raw.media || [],
    status: raw.status || 'PUBLISHED',
    publishedRevisionId: raw.publishedRevisionId,
    verification: raw.verification || { state: 'VERIFIED' },
    availability: raw.availability || { status: 'AVAILABLE', confirmedAt: new Date() },
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    availAgeDays,
    stale: availAgeDays > 14,
    verifiedAgeDays,
    moveInEstimatePaise: rent + deposit + maint,
  } as PublicListing;
}

export interface SearchQuery {
  entry?: EntryPoint;
  q?: string;
  max?: number;
  gender?: string;
  occupancy?: string;
  bhk?: string;
  furnishing?: string;
  society?: string;
  meals?: boolean;
  sort?: 'low' | 'high' | 'fresh';
}

export async function searchListings(query: SearchQuery = {}): Promise<PublicListing[]> {
  try {
    await seedIfEmpty();
    const db = await getDb();

    const filter: any = {
      status: 'PUBLISHED',
      'verification.validUntil': { $gt: new Date() },
    };

    if (query.entry) {
      filter.entryPoints = query.entry;
    }

    if (query.q) {
      const regex = new RegExp(query.q.trim(), 'i');
      filter.$or = [
        { locality: regex },
        { title: regex },
        { societyName: regex },
        { city: regex },
        { addressPrivate: regex },
      ];
    }

    if (query.max) {
      filter['price.amountPaise'] = { $lte: query.max * 100 };
    }

    if (query.gender) filter.gender = query.gender;
    if (query.occupancy) filter.occupancy = query.occupancy;
    if (query.bhk) filter.bhk = query.bhk;
    if (query.furnishing) filter.furnishing = query.furnishing;
    if (query.society) filter.societyName = query.society;
    if (query.meals) filter['price.foodIncluded'] = true;

    let cursor = db.collection('listings').find(filter);

    if (query.sort === 'low') {
      cursor = cursor.sort({ 'price.amountPaise': 1 });
    } else if (query.sort === 'high') {
      cursor = cursor.sort({ 'price.amountPaise': -1 });
    } else {
      cursor = cursor.sort({ 'availability.confirmedAt': -1 });
    }

    const docs = await cursor.toArray();
    return docs.map(shapeListing).filter((x) => x.availAgeDays <= 14);
  } catch (err) {
    console.warn('[searchListings] DB query failed, using seeded memory set:', (err as Error).message);
    let results = SEED_LISTINGS.map(shapeListing);
    if (query.entry) results = results.filter((x) => x.entryPoints.includes(query.entry!));
    if (query.q) {
      const q = query.q.toLowerCase().trim();
      results = results.filter((x) =>
        (x.locality + ' ' + x.title + ' ' + (x.societyName || '') + ' ' + (x.city || '') + ' ' + ((x as any).addressPrivate || '')).toLowerCase().includes(q)
      );
    }
    if (query.max) results = results.filter((x) => x.price.amountPaise <= (query.max! * 100));
    if (query.gender) results = results.filter((x) => x.gender === query.gender);
    if (query.occupancy) results = results.filter((x) => x.occupancy === query.occupancy);
    if (query.bhk) results = results.filter((x) => x.bhk === query.bhk);
    if (query.furnishing) results = results.filter((x) => x.furnishing === query.furnishing);
    if (query.meals) results = results.filter((x) => x.price.foodIncluded);

    if (query.sort === 'low') results.sort((a, b) => a.price.amountPaise - b.price.amountPaise);
    else if (query.sort === 'high') results.sort((a, b) => b.price.amountPaise - a.price.amountPaise);
    else results.sort((a, b) => a.availAgeDays - b.availAgeDays);

    return results;
  }
}

export async function getListingBySlug(slug: string): Promise<PublicListing | null> {
  try {
    await seedIfEmpty();
    const db = await getDb();
    const doc = await db.collection('listings').findOne({ slug, status: 'PUBLISHED' });
    if (!doc) return null;
    return shapeListing(doc);
  } catch {
    const found = SEED_LISTINGS.find((x) => x.slug === slug);
    return found ? shapeListing(found) : null;
  }
}
