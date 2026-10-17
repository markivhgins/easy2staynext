'use client';

import React, { useEffect, useRef } from 'react';
import type { PublicLocation } from '@/types';
import { getNearestLandmarks } from '@/lib/geo';

interface DetailLocationMapProps {
  publicLocation: PublicLocation;
  locality: string;
  city?: string;
}

export const DetailLocationMap: React.FC<DetailLocationMapProps> = ({
  publicLocation,
  locality,
  city = 'Noida',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // publicLocation.coordinates is [longitude, latitude]
  const lon = publicLocation?.coordinates?.[0] || 77.3910;
  const lat = publicLocation?.coordinates?.[1] || 28.5355;

  const nearestLandmarks = getNearestLandmarks(lon, lat, 4);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 14,
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

      // Approximate radius circle (~350 meters)
      L.circle([lat, lon], {
        color: '#1A4DB3',
        fillColor: '#1A4DB3',
        fillOpacity: 0.12,
        weight: 2,
        radius: 350,
      }).addTo(map);

      // Custom center pin icon
      const pinIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div class="f2s-detail-pin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      L.marker([lat, lon], { icon: pinIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${locality}, ${city}</strong><br/><span style="font-size:12px;color:#5A6578">Approximate area for occupant privacy</span>`
        )
        .openPopup();

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, locality]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="map-container detail-map">
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{
        background: 'var(--sky)',
        border: '1px solid var(--line)',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '20px', height: '20px', color: 'var(--blue)', flexShrink: 0, marginTop: '2px' }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
            Privacy-Protected Approximate Pin
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--mut)', margin: '4px 0 0', lineHeight: 1.5 }}>
            To safeguard current occupants, the map indicates the neighbourhood radius in{' '}
            <strong style={{ color: 'var(--navy)' }}>{locality}</strong>. The exact building door number and directions are dispatched
            directly to you when our operations coordinator confirms your scheduled visit.
          </p>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '10px' }}>
          Proximity to Key Metro &amp; Tech Hubs
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {nearestLandmarks.map((lm) => (
            <div key={lm.name} className="landmark-badge">
              <div>
                <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '13px', display: 'block' }}>{lm.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--mut)' }}>{lm.category}</span>
              </div>
              <span className="landmark-dist" style={{ fontSize: '12.5px', textAlign: 'right' }}>
                {lm.distanceKm} km
                <small style={{ display: 'block', fontWeight: 400, color: 'var(--mut)', fontSize: '10.5px' }}>~{lm.driveMin} min</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
