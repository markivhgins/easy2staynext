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
  const photoUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=70&w=700`;

  return (
    <Link className="card group relative" href={`/listing/${listing.slug}`}>
      <div className="art relative">
        <FloorPlan bhk={listing.bhk} occupancy={listing.occupancy} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ph"
          src={photoUrl}
          alt={listing.title}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget;
            el.remove();
          }}
        />
        <span className="seal">Checked {ago(listing.verifiedAgeDays)}</span>
        <div className="absolute top-2.5 right-2.5 z-10">
          <SaveListingButton slug={listing.slug} title={listing.title} />
        </div>
      </div>
      <div className="cb">
        <h3>{listing.title}</h3>
        <p>
          {listing.locality}
          {listing.societyName ? ` · ${listing.societyName}` : ''}
        </p>
        <p className="tags">
          {listing.occupancy && <i>{listing.occupancy}</i>}
          {listing.bhk && <i>{listing.bhk}</i>}
          {listing.gender && <i>{listing.gender === 'any' ? listing.furnishing || 'Anyone' : listing.gender}</i>}
          {listing.meals && <i>{listing.meals}</i>}
        </p>
        <div className="pr">
          <b>{inr(listing.price.amountPaise)}</b>
          <span>/month · {inr(listing.moveInEstimatePaise)} to move in</span>
        </div>
        <small className={listing.stale ? 'warn' : ''}>
          {listing.stale
            ? `Availability last confirmed ${ago(listing.availAgeDays)}`
            : `Availability confirmed ${ago(listing.availAgeDays)}`}
        </small>
      </div>
    </Link>
  );
};
