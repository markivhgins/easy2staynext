import React from 'react';
import Link from 'next/link';
import { searchListings } from '@/lib/listings';
import { SearchWithMap } from '@/components/listings/SearchWithMap';
import { PlaceAutocompleteInput } from '@/components/search/PlaceAutocompleteInput';

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
        <form className="filters" action="/flats" method="GET">
          <h3>Filters</h3>

          <label>
            Locality or landmark
            <div style={{ marginTop: '4px' }}>
              <PlaceAutocompleteInput
                name="q"
                defaultValue={q}
                placeholder="Sector 77, Sector 137, Indirapuram..."
                style={{
                  background: '#fff',
                  border: '1px solid var(--line)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              />
            </div>
          </label>

          <label>
            Max rent: <span>{maxRent ? `₹${maxRent.toLocaleString('en-IN')}` : 'Any'}</span>
            <input
              type="range"
              name="max"
              min="8000"
              max="80000"
              step="2000"
              defaultValue={maxRent || 80000}
            />
          </label>

          <label>
            Size / BHK
            <select name="bhk" defaultValue={bhk}>
              <option value="">Any size</option>
              <option value="1 RK">1 RK</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
            </select>
          </label>

          <label>
            Furnishing
            <select name="furnishing" defaultValue={furnishing}>
              <option value="">Any</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-furnished">Semi-furnished</option>
              <option value="Fully furnished">Fully furnished</option>
            </select>
          </label>

          <label>
            Sort by
            <select name="sort" defaultValue={sort || ''}>
              <option value="">Recently confirmed</option>
              <option value="low">Rent, low to high</option>
              <option value="high">Rent, high to low</option>
            </select>
          </label>

          <button type="submit" className="go">
            Apply
          </button>
          <Link href="/flats" className="text-center block text-sm">
            Clear all
          </Link>
        </form>

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
