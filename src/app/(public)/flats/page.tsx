import React from 'react';
import Link from 'next/link';
import { searchListings } from '@/lib/listings';
import { SearchWithMap } from '@/components/listings/SearchWithMap';
import { InteractiveFilterPanel } from '@/components/listings/InteractiveFilterPanel';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    max?: string;
    bhk?: string;
    furnishing?: string;
    sort?: 'low' | 'high' | 'fresh';
  }>;
}

export const metadata = {
  title: 'Flats & Apartments in Noida & Delhi NCR for Professionals & Families | Find2Stay',
  description:
    'Discover 1RK, 1BHK, 2BHK, and 3BHK flats for rent across Noida, Greater Noida, and Ghaziabad with transparent security deposit and maintenance breakdowns.',
};

export default async function FlatsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q || '';
  const maxRent = sp.max ? parseInt(sp.max, 10) : undefined;
  const bhk = sp.bhk || '';
  const furnishing = sp.furnishing || '';
  const sort = sp.sort;

  const listings = await searchListings({
    entry: 'flats',
    q,
    max: maxRent,
    bhk: bhk || undefined,
    furnishing: furnishing || undefined,
    sort,
  });

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="wow-pill">🛡️ 100% On-Site Audited</span>
            <span className="wow-pill">⚡ Direct Owner Connect</span>
            <span className="wow-pill">🏙️ Gated &amp; Standalone Flats</span>
          </div>
          <h1>Flats &amp; Apartments in Noida &amp; Delhi NCR</h1>
          <p>
            Curated 1RK, 1BHK, 2BHK and 3BHK verified apartments across Sector 77, Sector 137, Sector 93B, and Indirapuram with itemised breakdown of rent, maintenance &amp; deposits.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <Link
              href="/flats?q=Sector%2077"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '5px 12px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              📍 Sector 77 (Metro Corridor)
            </Link>
            <Link
              href="/flats?q=Sector%20137"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '5px 12px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              📍 Sector 137 (Expressway)
            </Link>
            <Link
              href="/flats?q=Indirapuram"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '5px 12px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              📍 Indirapuram (Ghaziabad)
            </Link>
            <Link
              href="/flats?q=Sector%2093"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '5px 12px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              📍 Sector 93B (Grand Omaxe)
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap split">
        <div>
          <InteractiveFilterPanel
            type="flats"
            initialQuery={q}
            initialMax={maxRent}
            initialSort={sort}
            initialBhk={bhk}
            initialFurnishing={furnishing}
          />
        </div>

        <div>
          <SearchWithMap
            listings={listings}
            categoryTitle="verified flats"
            emptyMessage="Try raising your budget or clearing filters to see more flats."
          />
        </div>
      </div>
    </>
  );
}
