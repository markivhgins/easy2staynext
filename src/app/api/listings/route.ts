import { NextRequest, NextResponse } from 'next/server';
import { searchListings } from '@/lib/listings';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const rawEntry = searchParams.get('entry');
    const entry = (rawEntry === 'pg' || rawEntry === 'flats' || rawEntry === 'society') ? rawEntry : undefined;
    const max = searchParams.get('max') ? parseInt(searchParams.get('max')!, 10) : undefined;
    const slugsParam = searchParams.get('slugs');

    let listings = await searchListings({
      entry,
      q,
      max,
    });

    if (slugsParam) {
      const slugList = slugsParam.split(',').map((s) => s.trim().toLowerCase());
      listings = listings.filter((l) => slugList.includes(l.slug.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      total: listings.length,
      listings,
    });
  } catch (err: any) {
    console.error('API /api/listings error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve listings' },
      { status: 500 }
    );
  }
}
