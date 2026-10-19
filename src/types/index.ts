/**
 * Shared TypeScript types for Find2Stay.
 * These mirror the MongoDB collection schemas defined in the architecture doc.
 */
import type { ObjectId } from 'mongodb';

// ── Shared primitives ────────────────────────────────────────────────────────

export type Role =
  | 'USER'
  | 'OWNER'
  | 'MANAGER'
  | 'PROVIDER'
  | 'VERIFIER'
  | 'OPERATIONS'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type AccommodationType =
  | 'PG'
  | 'HOSTEL'
  | 'CO_LIVING'
  | 'ROOM'
  | 'FLAT'
  | 'INDEPENDENT_HOUSE'
  | 'VILLA';

export type EntryPoint = 'pg' | 'flats' | 'society';

export type ListingStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'REVOKED'
  | 'ARCHIVED';

export type VerificationState =
  | 'UNVERIFIED'
  | 'IN_REVIEW'
  | 'VERIFIED'
  | 'VERIFIED_DUE'
  | 'LAPSED'
  | 'REVOKED';

export type ServiceType = 'food' | 'water' | 'movers';

export type ElectricityBasis =
  | 'METERED'
  | 'INCLUDED'
  | 'ACTUALS'
  | 'FIXED'
  | 'CONFIRM_WITH_OWNER';

export type PriceBasis = 'PER_BED_MONTH' | 'PER_ROOM_MONTH' | 'PER_UNIT_MONTH';

// ── GeoJSON ──────────────────────────────────────────────────────────────────

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude] — GeoJSON order
}

export interface PublicLocation {
  type: 'Point';
  coordinates: [number, number]; // Approximate — not exact door
  areaLabel: string;
  approximate: true;
}

// ── User ─────────────────────────────────────────────────────────────────────

export interface User {
  _id: ObjectId;
  phoneE164: string;           // Normalised E.164 format, e.g. +919876543210
  phoneVerifiedAt: Date;
  displayName?: string;
  email?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  roleAssignments: Role[];
  preferences: {
    notifyViaSms: boolean;
    notifyViaEmail: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Safe subset returned to the client (no auth internals)
export type SafeUser = Pick<
  User,
  '_id' | 'phoneE164' | 'displayName' | 'email' | 'roleAssignments' | 'status'
>;

// ── Session (iron-session payload) ───────────────────────────────────────────

export interface SessionData {
  userId: string;          // ObjectId as string
  roles: Role[];
  phone: string;           // Masked display — NOT for auth decisions
  name?: string;           // Display name stored in session
  rotatedAt: number;       // Timestamp — used for absolute expiry enforcement
}

// ── OTP challenge ────────────────────────────────────────────────────────────

export interface AuthChallenge {
  _id: ObjectId;
  phone: string;           // Normalised E.164
  otpDigest: string;       // hash of the OTP + salt
  requestId: string;       // Ties response to the exact challenge issued
  expiresAt: Date;
  attempts: number;
  resends: number;
  consumedAt?: Date;
  createdAt: Date;
}

// ── Listing ──────────────────────────────────────────────────────────────────

export interface ListingPrice {
  amountPaise: number;           // Rent in paise (integer)
  basis: PriceBasis;
  depositPaise: number;
  maintenancePaise: number | null;
  electricityBasis: ElectricityBasis;
  foodIncluded: boolean;
  oneTimeFeesPaise: number | null;
  priceConfirmedAt: Date;
}

export interface ListingVerification {
  state: VerificationState;
  revisionId?: string;
  verifiedAt?: Date;
  validUntil?: Date;
  scope?: string;          // Human-readable: what was checked
}

export interface ListingAvailability {
  status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  confirmedAt: Date;
  availableFrom?: Date;
}

export interface Listing {
  _id: ObjectId;
  slug: string;
  title: string;
  accommodationType: AccommodationType;
  entryPoints: EntryPoint[];
  city: string;
  locality: string;
  // Private — never returned in public API
  locationPrivate: GeoPoint;
  addressPrivate: string;
  // Public — returned in search/detail
  publicLocation: PublicLocation;
  ownerId: ObjectId;
  societyId?: ObjectId;
  societyName?: string;
  price: ListingPrice;
  amenities: string[];
  rules: string[];
  // PG-specific
  gender?: 'boys' | 'girls' | 'co-ed' | 'any';
  occupancy?: string;
  meals?: string;
  gateTime?: string;
  // Flat-specific
  bhk?: string;
  furnishing?: 'Unfurnished' | 'Semi-furnished' | 'Fully furnished';
  // Media (public photos only — evidence stored separately)
  media: Array<{ storageKey: string; caption?: string; order: number }>;
  status: ListingStatus;
  publishedRevisionId?: string;
  verification: ListingVerification;
  availability: ListingAvailability;
  createdAt: Date;
  updatedAt: Date;
}

// Public-safe projection (exact location/address stripped)
export type PublicListing = Omit<
  Listing,
  'locationPrivate' | 'addressPrivate' | 'ownerId'
> & {
  // Computed fields added by shape()
  availAgeDays: number;
  stale: boolean;
  verifiedAgeDays: number;
  moveInEstimatePaise: number;
};

// ── Enquiry / Visit ──────────────────────────────────────────────────────────

export type EnquiryState =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'OWNER_CONFIRMING'
  | 'CONTACT_PENDING'
  | 'CONTACTED'
  | 'RESOLVED'
  | 'CANCELLED';

export type VisitState =
  | 'REQUESTED'
  | 'CONFIRMING'
  | 'SCHEDULED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW_USER'
  | 'NO_SHOW_OWNER';

export interface Enquiry {
  _id: ObjectId;
  requestId: string;          // Public-safe reference ID
  idempotencyKey: string;
  userId: ObjectId | string;
  listingId: ObjectId;
  listingSlug: string;
  listingTitle: string;
  revisionId?: string;
  name: string;
  phone: string;
  priceSnapshot: ListingPrice;
  kind: 'VISIT' | 'CALLBACK';
  preferredSlot?: string;
  consentRecordId?: ObjectId;
  state: EnquiryState;
  assignedOpsId?: ObjectId;
  timeline: Array<{ state: EnquiryState; actorId: string; at: Date; note?: string }>;
  createdAt: Date;
  updatedAt: Date;
}

// ── Service connection ────────────────────────────────────────────────────────

export type ServiceConnectionState =
  | 'PENDING'
  | 'ROUTING'
  | 'PROVIDER_NOTIFIED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WAITLISTED'
  | 'NO_PROVIDER'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceConnection {
  _id: ObjectId;
  requestId: string;
  serviceType: ServiceType;
  userId: ObjectId | string;
  name: string;
  phone: string;
  consentRecordId?: ObjectId;
  serviceDetails: Record<string, unknown>;
  state: ServiceConnectionState;
  currentProviderId?: ObjectId;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Consent record ───────────────────────────────────────────────────────────

export interface ConsentRecord {
  _id: ObjectId;
  userId: ObjectId | string;
  purpose: string;
  noticeVersion: string;
  recipientType: 'OWNER_OR_MANAGER' | 'PROVIDER' | 'OPERATIONS';
  dataFieldsShared: string[];
  requestId: string;
  grantedAt: Date;
  withdrawnAt?: Date;
}

// ── API response shapes ───────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PropertyDraft {
  _id: string;
  propertyId?: string;
  ownerId: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  userType?: string;
  authorisationConfirmed?: boolean;
  title: string;
  locality: string;
  city?: string;
  fullAddress?: string;
  landmark?: string;
  nearbyMetroOrCollege?: string;
  hideExactAddress?: boolean;
  coordinates?: [number, number];
  photos?: string[];
  photosCategorized?: Array<{ url: string; category: string }>;
  videoUrl?: string;
  type: string;
  gender?: string;
  occupancy?: string;
  bhk?: string;
  furnishing?: string;
  sharing?: string;
  suitableFor?: string;
  coupleFriendly?: boolean;
  coupleConditions?: string;
  bathroomType?: string;
  kitchenAvailable?: boolean;
  totalRooms?: number;
  availableRooms?: number;
  roomSize?: string;
  rent: number;
  deposit: number;
  maintenance?: number;
  electricityBasis?: string;
  brokerage?: number;
  minimumStay?: string;
  noticePeriod?: string;
  availableFrom?: string;
  amenities?: string[];
  visitorsPolicy?: string;
  petsPolicy?: string;
  smokingPolicy?: string;
  houseRules?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'INSPECTION_SCHEDULED' | 'PUBLISHED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'OCCUPIED' | 'UNAVAILABLE';
  availabilityStatus?: 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';
  createdAt: Date;
  isVerified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  validUntil?: Date;
  adminNotes?: string;
  rejectionReason?: string;
  qrCodeUrl?: string;
}

