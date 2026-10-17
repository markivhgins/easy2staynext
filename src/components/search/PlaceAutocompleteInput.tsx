'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useLocation } from '@/context/LocationContext';
import { SUPPORTED_CITIES } from '@/lib/cities';
import { searchEducationalHubs } from '@/lib/educationalHubs';

export interface PlaceSuggestion {
  id: string;
  name: string;
  sub: string;
  category: 'locality' | 'landmark' | 'tag' | 'gps' | 'college';
  badge?: string;
  queryValue: string;
  city?: string;
}

const COMMON_TAGS: PlaceSuggestion[] = [
  {
    id: 'tag-boys-pg',
    name: 'PG for Boys',
    sub: 'Single & shared rooms with student amenities',
    category: 'tag',
    badge: 'Filter',
    queryValue: 'boys pg',
  },
  {
    id: 'tag-girls-pg',
    name: 'PG for Girls',
    sub: 'Secure stays with biometric entry & verified warden',
    category: 'tag',
    badge: 'Filter',
    queryValue: 'girls pg',
  },
  {
    id: 'tag-1bhk',
    name: '1 BHK Independent Flat',
    sub: 'Private kitchen, bath & verified electricity meter',
    category: 'tag',
    badge: 'Flat',
    queryValue: '1 BHK',
  },
  {
    id: 'tag-2bhk',
    name: '2 BHK Family Flat',
    sub: 'Spacious residential apartments with parking',
    category: 'tag',
    badge: 'Flat',
    queryValue: '2 BHK',
  },
];

interface PlaceAutocompleteInputProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
  onSelect?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  autoSubmit?: boolean;
}

export function PlaceAutocompleteInput({
  name = 'q',
  defaultValue = '',
  placeholder,
  ariaLabel,
  onSelect,
  className,
  style,
  autoSubmit = false,
}: PlaceAutocompleteInputProps) {
  const { city, selectCityByName, detectGpsLocation, isLocating } = useLocation();
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Dynamic suggestions: combining colleges, active city localities, and common tags
  const filtered = React.useMemo<PlaceSuggestion[]>(() => {
    const q = query.trim().toLowerCase();

    // 1. Search Colleges, Universities & Educational Hubs
    const collegeMatches = searchEducationalHubs(q, 5).map((hub) => ({
      id: `hub-${hub.id}`,
      name: hub.name,
      sub: hub.sub,
      category: 'college' as const,
      badge: hub.badge,
      queryValue: hub.queryValue,
      city: hub.city,
    }));

    // 2. Search Active City Localities
    const activeLocs = (city.localities || []).map((loc, idx) => ({
      id: `${city.id}-loc-${idx}`,
      name: loc.name,
      sub: `${loc.sub} • ${city.name}`,
      category: loc.category as 'locality' | 'landmark',
      badge: loc.category === 'landmark' ? 'Landmark' : idx === 0 ? 'Top Pick' : undefined,
      queryValue: loc.name,
      city: city.name,
    }));

    if (!q) {
      // Default initial view: top colleges + current city localities + tags
      return [...collegeMatches.slice(0, 3), ...activeLocs.slice(0, 5), ...COMMON_TAGS.slice(0, 2)];
    }

    const filteredActiveLocs = activeLocs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.sub.toLowerCase().includes(q) ||
        s.queryValue.toLowerCase().includes(q)
    );

    // 3. Search other cities localities if query doesn't match active city
    const otherCityMatches: PlaceSuggestion[] = [];
    if (collegeMatches.length === 0 && filteredActiveLocs.length === 0) {
      SUPPORTED_CITIES.forEach((c) => {
        if (c.id !== city.id) {
          c.localities.forEach((l, idx) => {
            if (l.name.toLowerCase().includes(q) || l.sub.toLowerCase().includes(q)) {
              otherCityMatches.push({
                id: `${c.id}-ext-${idx}`,
                name: l.name,
                sub: `${l.sub} • ${c.name}`,
                category: l.category as 'locality' | 'landmark',
                badge: c.name,
                queryValue: l.name,
                city: c.name,
              });
            }
          });
        }
      });
    }

    const tagMatches = COMMON_TAGS.filter(
      (t) => t.name.toLowerCase().includes(q) || t.queryValue.toLowerCase().includes(q)
    );

    // Merge and deduplicate
    const combined = [...collegeMatches, ...filteredActiveLocs, ...otherCityMatches.slice(0, 4), ...tagMatches];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.name.toLowerCase())) return false;
      seen.add(item.name.toLowerCase());
      return true;
    }).slice(0, 8);
  }, [city, query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (item: PlaceSuggestion) => {
    setQuery(item.queryValue);
    setIsOpen(false);
    setActiveIndex(-1);

    if (item.city && selectCityByName) {
      selectCityByName(item.city);
    }

    if (onSelect) {
      onSelect(item.queryValue);
    }

    inputRef.current?.focus();

    // If autoSubmit or inside a search form, automatically submit
    if (autoSubmit || containerRef.current?.closest('form')) {
      const form = containerRef.current?.closest('form');
      if (form) {
        setTimeout(() => {
          form.requestSubmit();
        }, 80);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        handleSelect(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const highlightMatch = (text: string, match: string) => {
    if (!match.trim()) return text;
    const parts = text.split(new RegExp(`(${match.trim()})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === match.trim().toLowerCase() ? (
        <strong key={i} style={{ color: 'var(--blue, #1648E8)', fontWeight: 700 }}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className={`f2s-autocomplete-wrap ${className || ''}`}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      <div className="f2s-autocomplete-input-row" style={{ position: 'relative', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || `Search college, locality or landmark...`}
          aria-label={ariaLabel || 'Search locality, landmark or college'}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          autoComplete="off"
          style={{ width: '100%' }}
        />

        {query && (
          <button
            type="button"
            className="f2s-autocomplete-clear-btn"
            onClick={() => {
              setQuery('');
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            aria-label="Clear search text"
            title="Clear text"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div id={listId} className="f2s-autocomplete-dropdown" role="listbox" style={{ zIndex: 9999 }}>
          {/* Top GPS location detector action */}
          <button
            type="button"
            onClick={async () => {
              const detected = await detectGpsLocation();
              if (detected) {
                setIsOpen(false);
              }
            }}
            disabled={isLocating}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f0fdf4',
              color: '#166534',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: isLocating ? 'wait' : 'pointer',
              textAlign: 'left',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{isLocating ? '⌛' : '🎯'}</span>
            <div style={{ flex: 1 }}>
              <div>{isLocating ? 'Detecting your GPS location...' : 'Use My Current Location'}</div>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 400 }}>
                Find verified stays nearest to your exact coordinates
              </div>
            </div>
          </button>

          <div className="f2s-autocomplete-group-title">
            {query.trim()
              ? `Colleges, Localities & Stays Matching "${query}"`
              : `🎓 Popular Colleges & ${city.name} Localities`}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '14px 12px', fontSize: '13px', color: 'var(--mut, #51618A)', textAlign: 'center' }}>
              No exact match for &quot;<strong>{query}</strong>&quot;. Press Search to discover all stays.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`f2s-autocomplete-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="f2s-autocomplete-item-left">
                    <div className="f2s-autocomplete-icon">
                      {item.category === 'college' && (
                        <span style={{ fontSize: '16px' }}>🎓</span>
                      )}
                      {item.category === 'locality' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                          <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      )}
                      {item.category === 'landmark' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      )}
                      {item.category === 'tag' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      )}
                    </div>
                    <div className="f2s-autocomplete-text">
                      <div className="f2s-autocomplete-name">
                        {highlightMatch(item.name, query)}
                      </div>
                      <div className="f2s-autocomplete-sub">
                        {highlightMatch(item.sub, query)}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="f2s-autocomplete-badge">{item.badge}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
