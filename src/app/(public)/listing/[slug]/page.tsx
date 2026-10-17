import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListingBySlug } from '@/lib/listings';
import { inr, ago } from '@/lib/format';
import { EnquiryForm } from '@/components/listings/EnquiryForm';
import { ListingGallery } from '@/components/listings/ListingGallery';
import { SaveListingButton } from '@/components/listings/SaveListingButton';
import { DetailLocationMap } from '@/components/maps/DetailLocationMap';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ELEC_MAP: Record<string, string> = {
  METERED: 'Metered (billed per unit consumption)',
  INCLUDED: 'Included in rent',
  ACTUALS: 'Billed on actuals (shared meter)',
  FIXED: 'Fixed monthly surcharge',
  CONFIRM_WITH_OWNER: 'Confirm with owner',
};

const PHOTO_MAP: Record<string, string[]> = {
  PG: ['1555854877-bab0e564b8d5', '1522771739844-6a9f6d5f14af', '1505691938895-1758d7feb511', '1595526114035-0d45ed16cfbf'],
  FLAT: ['1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb', '1554995207-c18c203602cb'],
  INDEPENDENT_HOUSE: ['1560448204-e02f11c3d0e2', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c'],
  VILLA: ['1560448204-e02f11c3d0e2', '1512917774080-9991f1c4c750'],
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: 'Listing Not Found | Find2Stay' };
  const cityName = listing.city || 'Noida';
  return {
    title: `${listing.title} in ${listing.locality}, ${cityName} | Find2Stay`,
    description: `Verified ${listing.accommodationType} in ${listing.locality}, ${cityName}. Rent ₹${Math.round(listing.price.amountPaise / 100).toLocaleString('en-IN')}/mo. Complete price breakdown & verified amenities.`,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const x = await getListingBySlug(slug);

  if (!x) {
    notFound();
  }

  const p = x.price;
  const backEntry = x.entryPoints[0] || 'pg';
  const photoIds = PHOTO_MAP[x.accommodationType] || PHOTO_MAP.FLAT;
  const cityName = x.city || 'Noida';

  return (
    <>
      <div className="wrap crumbs">
        <div>
          <Link href="/">Home</Link> / <Link href={`/${backEntry}`}>{backEntry.toUpperCase()}</Link> / {x.title}
        </div>
      </div>

      <div className="wrap detail">
        <div>
          <ListingGallery
            slug={x.slug}
            title={x.title}
            verifiedAgo={ago(x.verifiedAgeDays)}
            photoIds={photoIds}
            photos={x.media}
            bhk={x.bhk}
            occupancy={x.occupancy}
          />

          <h1>{x.title}</h1>
          <p className="sub">
            {x.locality}, {cityName}
            {x.societyName ? ` · ${x.societyName}` : ''}
          </p>

          <nav className="jump" aria-label="Page sections">
            <a href="#unit">Unit</a>
            <a href="#price">Pricing</a>
            <a href="#amen">Amenities</a>
            <a href="#rules">Rules</a>
            <a href="#loc">Location &amp; Map</a>
            <a href="#ver">Verification</a>
          </nav>

          <h2 id="unit">Unit Options</h2>
          <div className="kv">
            <div>
              <span>Type</span>
              {x.accommodationType}
            </div>
            <div>
              <span>{x.bhk ? 'Size' : 'Sharing'}</span>
              {x.bhk || x.occupancy || '1 Room'}
            </div>
            <div>
              <span>Suitable For</span>
              {x.gender === 'any' ? 'Anyone' : x.gender || 'Any'}
            </div>
            <div>
              <span>Furnishing</span>
              {x.furnishing || 'Furnished bed + storage'}
            </div>
          </div>

          <h2 id="price">Transparent Pricing</h2>
          <table>
            <tbody>
              <tr>
                <td>Monthly Rent</td>
                <td>{inr(p.amountPaise)} / month</td>
              </tr>
              <tr>
                <td>Security Deposit (refundable)</td>
                <td>{inr(p.depositPaise)}</td>
              </tr>
              <tr>
                <td>Maintenance Charges</td>
                <td>{p.maintenancePaise ? `${inr(p.maintenancePaise)} / month` : 'Included in rent'}</td>
              </tr>
              <tr>
                <td>Electricity</td>
                <td>{ELEC_MAP[p.electricityBasis] || p.electricityBasis}</td>
              </tr>
              <tr className="tot">
                <td>Estimated Move-in Total</td>
                <td>{inr(x.moveInEstimatePaise)}</td>
              </tr>
            </tbody>
          </table>

          <h2 id="amen">Amenities</h2>
          <p className="tags big">
            {x.amenities.map((a) => (
              <i key={a}>{a}</i>
            ))}
            {x.meals && <i>{x.meals}</i>}
          </p>

          <h2 id="rules">House &amp; Gate Rules</h2>
          <p>
            {x.gateTime ? `Gate closes at ${x.gateTime}. ` : ''}
            {x.accommodationType === 'PG'
              ? 'Visitors are permitted only in the ground-floor visitor lounge. Quiet hours apply after 10:30 pm.'
              : 'Standard society bylaws and residential lease terms apply. 1-month notice period before move-out.'}
          </p>
          {x.rules.length > 0 && (
            <ul style={{ paddingLeft: '20px', marginTop: '10px', color: '#374151', lineHeight: '1.7' }}>
              {x.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}

          <h2 id="loc">Location &amp; Proximity Map</h2>
          <div style={{ marginTop: '14px' }}>
            <DetailLocationMap
              publicLocation={x.publicLocation}
              locality={x.locality}
              city={cityName}
            />
          </div>

          <h2 id="ver">Verification Audit</h2>
          <div className="ver">
            <p>
              <strong>Verified on-site {ago(x.verifiedAgeDays)}:</strong> Verified premises coordinates and authentic
              room photographs matched.
            </p>
            <p>
              Availability confirmed {ago(x.availAgeDays)}. Verification certificate valid until{' '}
              {x.verification.validUntil
                ? new Date(x.verification.validUntil).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '180 days from inspection'}
              .
            </p>
            <Link href="/help">Report a listing mismatch &rarr;</Link>
          </div>
        </div>

        <EnquiryForm
          slug={x.slug}
          rentPaise={p.amountPaise}
          moveInEstimatePaise={x.moveInEstimatePaise}
        />
      </div>
    </>
  );
}
