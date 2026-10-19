import React from 'react';
import { DynamicPageTitle } from '@/components/layout/DynamicPageTitle';
import Link from 'next/link';
import { searchListings } from '@/lib/listings';
import { SearchWithMap } from '@/components/listings/SearchWithMap';
import { InteractiveFilterPanel } from '@/components/listings/InteractiveFilterPanel';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    society?: string;
    sort?: 'low' | 'high' | 'fresh';
  }>;
}

export const metadata = {
  title: 'Gated Society Flats & Communities in Noida & Delhi NCR | Find2Stay',
  description:
    'Gated society apartments, high-rise residential towers, and family homes with verified clubhouse and parking amenities across Noida and Delhi NCR.',
};

export default async function SocietyPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q || '';
  const society = sp.society || '';
  const sort = sp.sort;

  const allSocietyListings = await searchListings({ entry: 'society' });
  const distinctSocieties = Array.from(
    new Set(allSocietyListings.map((x) => x.societyName).filter(Boolean))
  ) as string[];

  const listings = await searchListings({
    entry: 'society',
    q,
    society: society || undefined,
    sort,
  });

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="wow-pill">🛡️ 24/7 Security &amp; CCTV</span>
            <span className="wow-pill">🏊 Clubhouses, Pools &amp; Parks</span>
            <span className="wow-pill">⚡ 100% Power Backup</span>
          </div>
          <DynamicPageTitle prefix="Gated Society Stays" defaultCity="Noida" />
          <p>
            High-rise societies and premium residential townships with audited clubhouse, gym, and reserved parking privileges.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <Link
              href="/society?society=Grand%20Omaxe"
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
              🏢 Grand Omaxe (Sec 93B)
            </Link>
            <Link
              href="/society?society=Express%20Zenith"
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
              🏢 Express Zenith (Sec 77)
            </Link>
            <Link
              href="/society?society=Paras%20Tierea"
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
              🏢 Paras Tierea (Sec 137)
            </Link>
            <Link
              href="/society?society=Jaypee%20Kalypso%20Court"
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
              🏢 Jaypee Greens (Sec 128)
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap split">
        <div>
          <InteractiveFilterPanel
            type="society"
            initialQuery={q}
            initialSort={sort}
            initialSociety={society}
            societiesList={distinctSocieties}
          />
        </div>

        <div>
          <SearchWithMap
            listings={listings}
            categoryTitle="verified homes"
            emptyMessage="Try clearing filters or checking other residential localities."
          />
        </div>
      </div>
    </>
  );
}
