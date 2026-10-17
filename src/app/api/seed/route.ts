import { NextResponse } from 'next/server';
import { seedIfEmpty, searchListings, SEED_LISTINGS } from '@/lib/listings';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await seedIfEmpty();
    let dbCount = 0;
    try {
      const db = await getDb();
      dbCount = await db.collection('listings').countDocuments();
    } catch {
      // Memory fallback
    }

    const all = await searchListings({});

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded with verified listings for Delhi NCR.`,
      dbCount,
      totalPublishedListings: all.length,
      sampleListings: all.map((l) => ({
        slug: l.slug,
        title: l.title,
        type: l.accommodationType,
        city: l.city,
        locality: l.locality,
        rent: `₹${(l.price.amountPaise / 100).toLocaleString('en-IN')}`,
        status: l.status,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Seeding failed',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
