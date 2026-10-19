import React from 'react';
import { DynamicPageTitle } from '@/components/layout/DynamicPageTitle';
import Link from 'next/link';
import { searchListings } from '@/lib/listings';
import { SearchWithMap } from '@/components/listings/SearchWithMap';
import { InteractiveFilterPanel } from '@/components/listings/InteractiveFilterPanel';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    max?: string;
    gender?: string;
    occupancy?: string;
    meals?: string;
    sort?: 'low' | 'high' | 'fresh';
  }>;
}

export const metadata = {
  title: 'PG & Co-Living in Noida & Delhi NCR | Verified Student & Executive Stays | Find2Stay',
  description:
    'Find verified boys, girls, and co-ed PG accommodation across Sector 62, Sector 126 Amity, Knowledge Park Greater Noida, and Indirapuram with 100% on-site verified amenities and ₹0 brokerage.',
};

export default async function PgPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q || '';
  const maxRent = sp.max ? parseInt(sp.max, 10) : undefined;
  const gender = sp.gender || '';
  const occupancy = sp.occupancy || '';
  const meals = sp.meals === '1';
  const sort = sp.sort;

  const listings = await searchListings({
    entry: 'pg',
    q,
    max: maxRent,
    gender: gender || undefined,
    occupancy: occupancy || undefined,
    meals: meals || undefined,
    sort,
  });

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="wow-pill">🛡️ 100% On-Site Audited</span>
            <span className="wow-pill">⚡ ₹0 Brokerage</span>
            <span className="wow-pill">🍽️ Hygienic Mess &amp; Wi-Fi</span>
          </div>
          <DynamicPageTitle prefix="Verified PGs &amp; Co-Living" defaultCity="Noida" />
          <p>
            Curated student and working professional stays across Sector 62, Sector 126 Amity, Knowledge Park Greater Noida, and Indirapuram with transparent per-bed pricing.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <Link
              href="/pg?q=Sector%2062"
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
              📍 Sector 62 (IT Hub)
            </Link>
            <Link
              href="/pg?q=Sector%20126"
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
              🎓 Amity Univ / Sector 126
            </Link>
            <Link
              href="/pg?q=Knowledge%20Park"
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
              📚 Knowledge Park Gr. Noida
            </Link>
            <Link
              href="/pg?q=Indirapuram"
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
              🏢 Indirapuram Ghaziabad
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap split">
        <div>
          <InteractiveFilterPanel
            type="pg"
            initialQuery={q}
            initialMax={maxRent}
            initialSort={sort}
            initialGender={gender}
            initialOccupancy={occupancy}
            initialMeals={meals}
          />
        </div>

        <div>
          <SearchWithMap
            listings={listings}
            categoryTitle="verified PGs"
            emptyMessage="Try adjusting your max rent, clearing gender filter, or searching another locality."
          />
        </div>
      </div>
    </>
  );
}
