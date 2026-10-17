'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { PublicListing } from '@/types';
import { inr } from '@/lib/format';
import { searchEducationalHubs, EducationalHub } from '@/lib/educationalHubs';

interface LocalityInfo {
  name: string;
  tagline: string;
  description: string;
  lat: number;
  lon: number;
  popularFor: string;
  queryValue?: string;
  badge?: string;
}

const LOCALITIES: LocalityInfo[] = [
  {
    name: 'Sector 62 (JSS / JIIT)',
    tagline: 'Tech & University Corridor',
    description: 'Premier educational and corporate hub in Noida. Home to JSS Academy, JIIT, Stellar IT Park, and Electronic City Metro terminal.',
    lat: 28.628,
    lon: 77.362,
    popularFor: 'Boys & Girls PGs, Single Executive Rooms',
    queryValue: 'Sector 62',
    badge: 'University Hub',
  },
  {
    name: 'Sector 126 (Amity Univ)',
    tagline: 'Amity Campus Hub',
    description: 'Major student corridor right by Amity University Gate 2, Raipur Khadar, HCL corporate campus, and Expressway stays.',
    lat: 28.544,
    lon: 77.338,
    popularFor: 'Student Residencies & Female Warden PGs',
    queryValue: 'Sector 126',
    badge: 'University',
  },
  {
    name: 'SRM University (Modinagar)',
    tagline: 'Delhi-NCR Campus Hub',
    description: 'SRM Institute of Science & Technology campus on Delhi-Meerut Expressway. Near Muradnagar, Raj Nagar Extension & student hostels.',
    lat: 28.826,
    lon: 77.585,
    popularFor: 'Hostels, Student Rooms & Flatshares',
    queryValue: 'Ghaziabad',
    badge: 'University',
  },
  {
    name: 'Knowledge Park (Sharda/Galgotias)',
    tagline: 'Greater Noida Campus City',
    description: 'Expansive student university cluster hosting Sharda University, Galgotias (GCET), GL Bajaj, Bennett & Expo Mart.',
    lat: 28.468,
    lon: 77.492,
    popularFor: 'Campus Co-Living & Affordable Student Rooms',
    queryValue: 'Knowledge Park',
    badge: 'University Cluster',
  },
  {
    name: 'Crossings Republik (ABES)',
    tagline: 'Engineering & High-Rise Hub',
    description: 'Integrated township on NH-24 near ABES Engineering College, Chipiyana, Lal Kuan & Sector 62 border.',
    lat: 28.636,
    lon: 77.447,
    popularFor: 'Student PGs & 1BHK / 2BHK High-Rise Flats',
    queryValue: 'Crossings Republik',
    badge: 'College Corridor',
  },
  {
    name: 'Sector 137 (Expressway)',
    tagline: 'Expressway Society Hub',
    description: 'Modern high-rise residential sector with dedicated metro station, Advant Navis tech center, and green parks.',
    lat: 28.513,
    lon: 77.404,
    popularFor: 'Gated High-Rise Societies & Studio Flats',
    queryValue: 'Sector 137',
    badge: 'Tech & Societies',
  },
  {
    name: 'Indirapuram (Ghaziabad)',
    tagline: 'Delhi-Noida Border Hub',
    description: 'Popular residential enclave with Shipra Sun City, Habitat Centre, Vaishali Metro connectivity & buzzing cafes.',
    lat: 28.638,
    lon: 77.375,
    popularFor: 'Modern Gated Societies & 2BHK Apartments',
    queryValue: 'Indirapuram',
    badge: 'Residential Hub',
  },
  {
    name: 'DU North Campus (GTB Nagar)',
    tagline: 'Delhi University Student Heart',
    description: 'Premier university zone hosting SRCC, Hindu, Hansraj, Miranda House, with vibrant Kamla Nagar & Hudson Lane stays.',
    lat: 28.690,
    lon: 77.207,
    popularFor: 'Student Co-Living, Single Rooms & Meals',
    queryValue: 'North Campus',
    badge: 'University',
  },
  {
    name: 'Hauz Khas (IIT & AIIMS)',
    tagline: 'Premier Institute Corridor',
    description: 'Academic enclave near IIT Delhi, AIIMS, Safdarjung, Jia Sarai & Green Park metro station.',
    lat: 28.545,
    lon: 77.193,
    popularFor: 'Co-Living Stays & Furnished 1BHKs',
    queryValue: 'Hauz Khas',
    badge: 'Institutes',
  },
  {
    name: 'Mukherjee Nagar (UPSC Hub)',
    tagline: 'Civil Services Coaching Hub',
    description: 'India’s leading preparation hub for UPSC with Drishti IAS, Vajiram, Nehru Vihar & 24/7 library rooms.',
    lat: 28.710,
    lon: 77.215,
    popularFor: 'Study-Focused PGs & Independent Rooms',
    queryValue: 'Mukherjee Nagar',
    badge: 'Coaching Hub',
  },
  {
    name: 'Cyber City (Gurugram)',
    tagline: 'DLF Corporate & Co-Living Hub',
    description: 'High-tech corporate district near Cyber Hub, DLF Phase 2/3, Rapid Metro & executive co-living towers.',
    lat: 28.495,
    lon: 77.089,
    popularFor: 'Executive PGs & Premium Studios',
    queryValue: 'Cyber City',
    badge: 'Tech Corridor',
  },
  {
    name: 'Sector 18 (Noida Central)',
    tagline: 'Commercial & Metro Heart',
    description: 'Central lifestyle district adjacent to Atta Market, Wave City Center, and DLF Mall of India.',
    lat: 28.570,
    lon: 77.323,
    popularFor: 'Executive 1BHK / 2BHK Stays & Co-Living',
    queryValue: 'Sector 18',
    badge: 'Commercial Heart',
  },
];

interface LocalityMapExplorerProps {
  listings: PublicListing[];
}

export function LocalityMapExplorer({ listings }: LocalityMapExplorerProps) {
  const [selectedLocality, setSelectedLocality] = useState<LocalityInfo>(LOCALITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocalityInfo[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [name: string]: any }>({});
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const statsByLocality = LOCALITIES.reduce((acc, loc) => {
    const locKey = loc.queryValue || loc.name;
    const locListings = listings.filter((l) =>
      l.locality.toLowerCase().includes(locKey.toLowerCase()) ||
      l.title.toLowerCase().includes(locKey.toLowerCase())
    );
    const minRent =
      locListings.length > 0
        ? Math.min(...locListings.map((l) => l.price.amountPaise))
        : 450000;
    acc[loc.name] = {
      count: locListings.length,
      minRent,
    };
    return acc;
  }, {} as Record<string, { count: number; minRent: number }>);

  // Search logic for map search bar (merges educational hubs and localities)
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }

    // 1. Search in defined localities
    const matchedLocs = LOCALITIES.filter((l) =>
      l.name.toLowerCase().includes(q) ||
      l.tagline.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.popularFor.toLowerCase().includes(q)
    );

    // 2. Search in expanded educational hubs database (SRM, Amity, JSS, Sharda, etc.)
    const matchedHubs = searchEducationalHubs(q, 6);
    const hubLocs: LocalityInfo[] = matchedHubs
      .filter((h) => !matchedLocs.some((l) => l.name.toLowerCase().includes(h.shortName.toLowerCase())))
      .map((h) => ({
        name: h.name,
        tagline: `${h.badge} · ${h.city}`,
        description: h.sub,
        lat: h.lat || 28.580,
        lon: h.lon || 77.340,
        popularFor: `Stays near ${h.shortName} & ${h.locality}`,
        queryValue: h.queryValue,
        badge: h.badge,
      }));

    setSearchResults([...matchedLocs, ...hubLocs].slice(0, 7));
  }, [searchQuery]);

  // Outside click to close search results dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Default center: Delhi-NCR / Noida corridor
      const map = L.map(mapContainerRef.current, {
        center: [28.580, 77.340],
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add locality markers
      LOCALITIES.forEach((loc) => {
        const stats = statsByLocality[loc.name] || { count: 0, minRent: 450000 };
        const isCurrent = loc.name === selectedLocality.name;

        const iconHtml = `
          <div class="f2s-map-marker ${isCurrent ? 'active' : ''}" style="display:flex;flex-direction:column;align-items:center;padding:4px 10px;font-size:12px;line-height:1.2;cursor:pointer;">
            <span style="font-weight:700;">${loc.name.split('(')[0].trim()}</span>
            <span style="font-size:10px;opacity:0.85;">from ${inr(stats.minRent)}</span>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-locality-pill',
          html: iconHtml,
          iconSize: [110, 36],
          iconAnchor: [55, 18],
        });

        const marker = L.marker([loc.lat, loc.lon], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedLocality(loc);
          map.panTo([loc.lat, loc.lon], { animate: true, duration: 0.6 });
        });

        markersRef.current[loc.name] = marker;
      });

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
  }, []);

  const handleSelectLocality = (loc: LocalityInfo) => {
    setSelectedLocality(loc);
    setIsSearchOpen(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lon], 14, { duration: 0.8 });
    }
  };

  const selectedStats = statsByLocality[selectedLocality.name] || { count: 0, minRent: 450000 };

  return (
    <div className="loc-exp-wrapper">
      {/* ── Interactive Map Search Bar on Top ───────────────────────── */}
      <div
        ref={searchWrapRef}
        className="loc-map-search-bar"
        style={{
          position: 'relative',
          marginBottom: '16px',
          zIndex: 25,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            border: '1.5px solid var(--line, #dadfe8)',
            borderRadius: '16px',
            padding: '8px 16px',
            boxShadow: '0 8px 24px -6px rgba(7, 27, 75, 0.12)',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px', color: 'var(--bl)', flexShrink: 0 }}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search SRM, Amity, JSS, Sharda, DU, or any college & stay locality..."
            aria-label="Search map localities and colleges"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '14.5px',
              fontWeight: 500,
              color: 'var(--nv)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--mut)',
                padding: '2px',
              }}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '15px', height: '15px' }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown Suggestions List */}
        {isSearchOpen && searchResults.length > 0 && (
          <div
            className="loc-map-search-dropdown"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '1px solid var(--line, #dadfe8)',
              borderRadius: '16px',
              boxShadow: '0 20px 48px -10px rgba(7, 27, 75, 0.28)',
              padding: '6px',
              zIndex: 9999,
              maxHeight: '340px',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '6px 12px 4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mut)' }}>
              Colleges &amp; Localities on Map
            </div>
            {searchResults.map((item, idx) => (
              <button
                key={`${item.name}-${idx}`}
                type="button"
                onClick={() => handleSelectLocality(item)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--nv)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: '2px' }}>
                    {item.tagline}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#EEF4FF',
                    color: 'var(--bl)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}
                >
                  📍 Fly on Map
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Horizontal Pill Selector */}
      <div className="loc-pills-mobile">
        {LOCALITIES.map((loc) => {
          const isSelected = loc.name === selectedLocality.name;
          const stats = statsByLocality[loc.name] || { count: 0, minRent: 450000 };
          return (
            <button
              key={loc.name}
              type="button"
              onClick={() => handleSelectLocality(loc)}
              className={`loc-pill-btn ${isSelected ? 'active' : ''}`}
            >
              {loc.name.split('(')[0].trim()} <span style={{ opacity: 0.75, fontWeight: 'normal' }}>({stats.count})</span>
            </button>
          );
        })}
      </div>

      <div className="loc-exp">
        {/* Desktop Vertical Locality List (Left Column) */}
        <div className="loc-list-desktop">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
            {LOCALITIES.map((loc) => {
              const isSelected = loc.name === selectedLocality.name;
              const stats = statsByLocality[loc.name] || { count: 0, minRent: 450000 };

              return (
                <div
                  key={loc.name}
                  onClick={() => handleSelectLocality(loc)}
                  className={`loc-item ${isSelected ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <h4>
                      {loc.name}{' '}
                      <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--mut)' }}>
                        • {loc.tagline}
                      </span>
                    </h4>
                    <p>{loc.popularFor}</p>
                  </div>
                  <div className="loc-item-right">
                    <span className="loc-item-count">
                      {stats.count > 0 ? `${stats.count} Stays` : 'Verified Hub'}
                    </span>
                    <span className="loc-item-price">
                      from {inr(stats.minRent)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Locality Action Box */}
          <div className="loc-card-summary" style={{ marginTop: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: '#93C5FD' }}>
                Selected Hub / Locality
              </span>
              <h3 style={{ margin: '4px 0 6px' }}>
                {selectedLocality.name}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#E2E8F0', lineHeight: 1.4 }}>
                {selectedLocality.description}
              </p>
            </div>
            <Link
              href={`/pg?q=${encodeURIComponent(selectedLocality.queryValue || selectedLocality.name)}`}
              className="loc-card-btn"
              style={{ marginTop: '10px' }}
            >
              Explore Stays Near {selectedLocality.name.split('(')[0].trim()} &rarr;
            </Link>
          </div>
        </div>

        {/* Right Interactive Leaflet Map */}
        <div className="loc-map-column">
          <div
            ref={mapContainerRef}
            className="loc-map-canvas"
            style={{ width: '100%', height: '100%', minHeight: '420px', borderRadius: '18px' }}
          />
        </div>
      </div>
    </div>
  );
}
