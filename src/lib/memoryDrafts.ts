export interface MemoryDraft {
  _id: string;
  ownerId: string;
  name: string;
  phone: string;
  title: string;
  locality: string;
  city?: string;
  photos?: string[];
  type: string;
  gender: string;
  occupancy: string;
  bhk: string;
  rent: number;
  deposit: number;
  status: string;
  availabilityStatus?: string;
  createdAt: Date;
  isVerified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  validUntil?: Date;
  adminNotes?: string;
  assignedVerifier?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var _f2sMemoryDrafts: MemoryDraft[] | undefined;
}

if (!global._f2sMemoryDrafts) {
  global._f2sMemoryDrafts = [
    {
      _id: 'draft_1',
      ownerId: 'owner_demo_1',
      title: 'Aura Stay Sector 62 Executive PG',
      locality: 'Sector 62',
      city: 'Noida',
      type: 'PG',
      gender: 'boys',
      occupancy: 'single',
      bhk: '1 Room',
      name: 'Sunil Kumar',
      phone: '+919833445566',
      rent: 8500,
      deposit: 8500,
      status: 'SUBMITTED',
      createdAt: new Date(),
    },
    {
      _id: 'draft_2',
      ownerId: 'owner_demo_2',
      title: 'Silicon City 2BHK High-Rise',
      locality: 'Sector 76',
      city: 'Noida',
      type: 'Flat',
      gender: 'any',
      occupancy: 'family',
      bhk: '2 BHK',
      name: 'Anil Tandon',
      phone: '+919844556677',
      rent: 24000,
      deposit: 24000,
      status: 'INSPECTION_SCHEDULED',
      createdAt: new Date(),
    },
  ];
}

export const memoryDrafts = global._f2sMemoryDrafts;
