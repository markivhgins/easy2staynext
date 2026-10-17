'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { PublicListing } from '@/types';
import { ListingCard } from './ListingCard';

// Dynamically import ListingsMap with SSR disabled
const ListingsMap = dynamic(
  () => import('@/components/maps/ListingsMap').then((mod) => mod.ListingsMap),
  {
    ssr: false,
    loading: () => (
      <div className="map-container flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2 min-h-[480px]">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-gray-500">Loading interactive Noida &amp; Delhi NCR map...</span>
      </div>
    ),
  }
);

interface SearchWithMapProps {
  listings: PublicListing[];
  categoryTitle?: string;
  emptyMessage?: string;
}

type ViewMode = 'grid' | 'split' | 'map';

export function SearchWithMap({
  listings,
  categoryTitle = 'verified stays',
  emptyMessage = 'Try adjusting your filters or searching another Noida locality.',
}: SearchWithMapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);

  if (listings.length === 0) {
    return (
      <div>
        <p className="count">
          <b>0</b> {categoryTitle}
        </p>
        <div className="empty">
          <h3>Nothing matches your criteria</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View Switcher Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
        <p className="count" style={{ margin: 0 }}>
          <b>{listings.length}</b> {listings.length === 1 ? 'verified stay' : categoryTitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`map-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            aria-label="Grid view"
            title="Grid view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`map-view-toggle ${viewMode === 'split' ? 'active' : ''}`}
            aria-label="Split view (Cards & Map)"
            title="Split view (Cards & Map)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
            <span>Split</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`map-view-toggle ${viewMode === 'map' ? 'active' : ''}`}
            aria-label="Map view"
            title="Interactive Map view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Content Rendering depending on view mode */}
      {viewMode === 'grid' && (
        <div className="grid two">
          {listings.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      )}

      {viewMode === 'split' && (
        <div className="split-map-container">
          <div className="split-cards-scroll">
            {listings.map((l) => (
              <div
                key={l.slug}
                onMouseEnter={() => setSelectedSlug(l.slug)}
                style={{
                  borderRadius: '16px',
                  boxShadow: selectedSlug === l.slug ? '0 0 0 2.5px var(--blue)' : 'none',
                  transition: 'box-shadow 0.15s ease'
                }}
              >
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
          <div className="split-map-sticky">
            <div style={{ height: '100%', minHeight: '400px' }}>
              <ListingsMap
                listings={listings}
                selectedSlug={selectedSlug}
                onMarkerClick={(slug) => setSelectedSlug(slug)}
                className="h-full"
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '8px', textAlign: 'center' }}>
              Click any price badge on the map to preview property details
            </p>
          </div>
        </div>
      )}

      {viewMode === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ width: '100%', height: '520px', minHeight: '360px' }}>
            <ListingsMap
              listings={listings}
              selectedSlug={selectedSlug}
              onMarkerClick={(slug) => setSelectedSlug(slug)}
              className="h-full"
            />
          </div>
          <div className="map-card-reel">
            {listings.map((l) => (
              <div
                key={l.slug}
                className="map-card-item"
                style={{
                  borderRadius: '16px',
                  boxShadow: selectedSlug === l.slug ? '0 0 0 2.5px var(--blue)' : 'none',
                  transition: 'box-shadow 0.15s ease'
                }}
                onClick={() => setSelectedSlug(l.slug)}
              >
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
