'use client';

import React from 'react';
import Link from 'next/link';
import type { PublicListing } from '@/types';
import { FloorPlan } from './FloorPlan';
import { SaveListingButton } from './SaveListingButton';
import { inr, ago, hash } from '@/lib/format';

interface ListingCardProps {
  listing: PublicListing;
}

const PH: Record<string, string[]> = {
  PG: ['1555854877-bab0e564b8d5', '1522771739844-6a9f6d5f14af', '1505691938895-1758d7feb511'],
  FLAT: ['1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb', '1554995207-c18c203602cb'],
  INDEPENDENT_HOUSE: ['1560448204-e02f11c3d0e2', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c'],
  VILLA: ['1560448204-e02f11c3d0e2', '1512917774080-9991f1c4c750'],
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const photos = PH[listing.accommodationType] || PH.FLAT;
  const photoId = photos[hash(listing.slug) % photos.length];
  const unsplashFallback = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=70&w=700`;
  const candidatePhoto = (listing as { photos?: string[] }).photos?.[0] || listing.media?.[0]?.storageKey;
  const photoUrl = candidatePhoto && (candidatePhoto.startsWith('/') || candidatePhoto.startsWith('http'))
    ? candidatePhoto
    : unsplashFallback;

  return (
    <Link className="card group" href={`/listing/${listing.slug}`}>
      <div className="art">
        <FloorPlan bhk={listing.bhk} occupancy={listing.occupancy} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ph"
          src={photoUrl}
          alt={listing.title}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src !== unsplashFallback) {
              el.src = unsplashFallback;
            } else {
              el.style.display = 'none';
            }
          }}
        />
        <span className="seal">🛡️ Verified {ago(listing.verifiedAgeDays)}</span>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
          <SaveListingButton slug={listing.slug} title={listing.title} />
        </div>
      </div>
      <div className="cb">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--blue)' }}>
            {listing.accommodationType || 'PG / STAY'}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 7px', borderRadius: '4px' }}>
            ₹0 Brokerage
          </span>
        </div>
        <h3>{listing.title}</h3>
        <p style={{ fontSize: '13px', color: 'var(--mut)', marginBottom: '8px' }}>
          📍 {listing.locality}
          {listing.societyName ? ` · ${listing.societyName}` : ''}
        </p>
        <p className="tags" style={{ margin: '0 0 12px 0' }}>
          {listing.occupancy && <i>{listing.occupancy}</i>}
          {listing.bhk && <i>{listing.bhk}</i>}
          {listing.gender && <i>{listing.gender === 'any' ? listing.furnishing || 'Anyone' : `${listing.gender} PG`}</i>}
          {listing.meals && <i>🍽️ {listing.meals}</i>}
        </p>
        <div className="pr" style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <b>{inr(listing.price.amountPaise)}</b>
              <span style={{ display: 'inline', marginLeft: '4px' }}>/mo</span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--blue)', fontWeight: 700 }}>
              View Stay →
            </span>
          </div>
          <small style={{ display: 'block', marginTop: '4px', fontSize: '11.5px' }} className={listing.stale ? 'warn' : ''}>
            {listing.stale
              ? `● Vacancy confirmed ${ago(listing.availAgeDays)}`
              : `● Immediate Move-in · ${inr(listing.moveInEstimatePaise)} deposit`}
          </small>
        </div>
      </div>
    </Link>
  );
};
