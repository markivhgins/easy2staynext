'use client';

import React, { useEffect, useRef } from 'react';
import type { PublicListing } from '@/types';
import { inr, hash } from '@/lib/format';

interface ListingsMapProps {
  listings: PublicListing[];
  selectedSlug?: string;
  onMarkerClick?: (slug: string) => void;
  className?: string;
}

const PHOTO_MAP: Record<string, string[]> = {
  PG: ['1555854877-bab0e564b8d5', '1522771739844-6a9f6d5f14af', '1505691938895-1758d7feb511'],
  FLAT: ['1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb', '1554995207-c18c203602cb'],
  INDEPENDENT_HOUSE: ['1560448204-e02f11c3d0e2', '1512917774080-9991f1c4c750'],
};

export const ListingsMap: React.FC<ListingsMapProps> = ({
  listings,
  selectedSlug,
  onMarkerClick,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [slug: string]: any }>({});

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Noida center coordinates: ~28.5355° N, 77.3910° E
      const map = L.map(mapContainerRef.current, {
        center: [28.5355, 77.3910],
        zoom: 12,
        scrollWheelZoom: false,
      });

      // Standard OpenStreetMap tiles (no API key required)
      L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      renderMarkers(L, map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when listings change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((module) => {
      renderMarkers(module.default, mapInstanceRef.current);
    });
  }, [listings, selectedSlug]);

  function renderMarkers(L: any, map: any) {
    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    listings.forEach((listing) => {
      const coords = listing.publicLocation?.coordinates;
      if (!coords || coords.length < 2) return;

      // Note: GeoJSON is [longitude, latitude], Leaflet expects [latitude, longitude]
      const lat = coords[1];
      const lon = coords[0];
      const latLng = L.latLng(lat, lon);
      bounds.extend(latLng);

      const priceDisplay = inr(listing.price.amountPaise);
      const isSelected = listing.slug === selectedSlug;

      const markerHtml = `
        <div class="f2s-map-marker ${isSelected ? 'active' : ''}">
          ${priceDisplay}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pill-icon',
        html: markerHtml,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
        popupAnchor: [0, -16],
      });

      const photos = PHOTO_MAP[listing.accommodationType] || PHOTO_MAP.FLAT;
      const photoId = photos[hash(listing.slug) % photos.length];
      const photoUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=70&w=400`;

      const popupHtml = `
        <div class="f2s-popup-card">
          <img src="${photoUrl}" class="f2s-popup-thumb" alt="${listing.title}" />
          <div class="f2s-popup-body">
            <h4>${listing.title}</h4>
            <p>${listing.locality}${listing.societyName ? ' · ' + listing.societyName : ''}</p>
            <div class="f2s-popup-footer">
              <span class="f2s-popup-price">${priceDisplay}<small style="font-size:11px;color:#718096">/mo</small></span>
              <a href="/listing/${listing.slug}" class="f2s-popup-link">View Stay &rarr;</a>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker(latLng, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(listing.slug);
      });

      markersRef.current[listing.slug] = marker;
    });

    if (listings.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }

  return (
    <div className={`map-container ${className}`}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
