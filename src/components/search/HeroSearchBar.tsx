'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PlaceAutocompleteInput } from './PlaceAutocompleteInput';
import { useLocation } from '@/context/LocationContext';

type SearchCategory = 'pg' | 'flats' | 'society';

export function HeroSearchBar() {
  const [category, setCategory] = useState<SearchCategory>('pg');
  const [selectedMax, setSelectedMax] = useState('');
  const [budgetOpen, setBudgetOpen] = useState(false);
  const budgetDropdownRef = useRef<HTMLDivElement>(null);

  const { city } = useLocation();

  const actionPath = category === 'pg' ? '/pg' : category === 'flats' ? '/flats' : '/society';

  const firstLocality = city.localities[0]?.name || 'Sector 62';
  const secondLocality = city.localities[1]?.name || 'Sector 126';

  const placeholders: Record<SearchCategory, string> = {
    pg: `Search SRM, Amity, JSS, Sector 62, single room...`,
    flats: `Search 1 BHK, 2 BHK in ${city.name}...`,
    society: `Search societies & gated enclaves in ${city.name}...`,
  };

  const budgetOptions: Record<SearchCategory, Array<{ value: string; label: string }>> = {
    pg: [
      { value: '', label: 'Any budget' },
      { value: '4000', label: 'Up to ₹4,000' },
      { value: '6000', label: 'Up to ₹6,000' },
      { value: '8000', label: 'Up to ₹8,000' },
      { value: '12000', label: 'Up to ₹12,000' },
    ],
    flats: [
      { value: '', label: 'Any budget' },
      { value: '10000', label: 'Up to ₹10,000' },
      { value: '15000', label: 'Up to ₹15,000' },
      { value: '25000', label: 'Up to ₹25,000' },
      { value: '40000', label: 'Up to ₹40,000' },
    ],
    society: [
      { value: '', label: 'Any budget' },
      { value: '15000', label: 'Up to ₹15,000' },
      { value: '20000', label: 'Up to ₹20,000' },
      { value: '30000', label: 'Up to ₹30,000' },
      { value: '50000', label: 'Above ₹30,000' },
    ],
  };

  // Close budget dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(e.target as Node)) {
        setBudgetOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setBudgetOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentBudgetLabel =
    budgetOptions[category].find((b) => b.value === selectedMax)?.label || 'Any budget';

  return (
    <div className="wrap">
      <form id="hs" className="h2s" action={actionPath} method="GET">
        {/* Category Tabs */}
        <div className="h2tabs">
          <label>
            <input
              type="radio"
              name="cat"
              value="pg"
              checked={category === 'pg'}
              onChange={() => {
                setCategory('pg');
                setSelectedMax('');
              }}
            />
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7M3 15h18M6 8V5h12v3" />
              </svg>
              PG / Room
            </span>
          </label>

          <label>
            <input
              type="radio"
              name="cat"
              value="flats"
              checked={category === 'flats'}
              onChange={() => {
                setCategory('flats');
                setSelectedMax('');
              }}
            />
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 21V4h10v17M14 9h6v12M8 8h2M8 12h2M8 16h2" />
              </svg>
              1 / 2 BHK Flat
            </span>
          </label>

          <label>
            <input
              type="radio"
              name="cat"
              value="society"
              checked={category === 'society'}
              onChange={() => {
                setCategory('society');
                setSelectedMax('');
              }}
            />
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M12 7V3M7 3h10" />
              </svg>
              Society Flat
            </span>
          </label>
        </div>

        {/* Hidden input to submit budget value with form */}
        <input type="hidden" name="max" value={selectedMax} />

        {/* Input Bar */}
        <div className="h2bar">
          <label className="h2f" style={{ cursor: 'text' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <PlaceAutocompleteInput
              name="q"
              placeholder={placeholders[category]}
              ariaLabel={`Search ${city.name} locality, SRM, Amity or stay type`}
            />
          </label>

          {/* Custom Budget Selector with Official Rupee Icon (Matches Map Dropdown UI) */}
          <div
            ref={budgetDropdownRef}
            className="h2f h2b custom-budget-select-wrapper"
            style={{
              position: 'relative',
              cursor: 'pointer',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
            onClick={() => setBudgetOpen(!budgetOpen)}
            role="combobox"
            aria-expanded={budgetOpen}
            aria-haspopup="listbox"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setBudgetOpen(!budgetOpen);
              }
            }}
          >
            {/* Indian Rupee ₹ Symbol */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '17px',
                color: 'var(--bl)',
                width: '18px',
                height: '18px',
                lineHeight: 1,
                fontFamily: 'Inter, system-ui, sans-serif',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              ₹
            </span>

            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '14.5px',
                fontWeight: 600,
                color: 'var(--nv)',
              }}
            >
              {currentBudgetLabel}
            </span>

            {/* Down Chevron */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                width: '14px',
                height: '14px',
                color: 'var(--mut)',
                transform: budgetOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                flexShrink: 0,
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>

            {/* Custom Dropdown Menu matching City & Map Selection UI */}
            {budgetOpen && (
              <div
                className="f2s-budget-menu-popup"
                role="listbox"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  minWidth: '220px',
                  background: '#ffffff',
                  border: '1px solid var(--line, #dadfe8)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 48px -10px rgba(7, 27, 75, 0.28), 0 0 0 1px rgba(7, 27, 75, 0.06)',
                  padding: '6px',
                  zIndex: 99999,
                  animation: 'f2s-dropdown-fade 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    padding: '6px 12px 4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--mut)',
                  }}
                >
                  Select Monthly Budget
                </div>
                {budgetOptions[category].map((opt) => {
                  const isSelected = opt.value === selectedMax;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedMax(opt.value);
                        setBudgetOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isSelected ? '#EEF4FF' : 'transparent',
                        color: isSelected ? 'var(--bl)' : 'var(--nv)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) (e.currentTarget.style.background = '#F8FAFC');
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) (e.currentTarget.style.background = 'transparent');
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            color: isSelected ? 'var(--bl)' : 'var(--mut)',
                            fontWeight: 700,
                            fontSize: '13px',
                          }}
                        >
                          ₹
                        </span>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '16px', height: '16px', color: 'var(--bl)' }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button type="submit" className="h2go" aria-label="Search verified stays">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            Search
          </button>
        </div>
      </form>

      {/* Popular Chips with SRM and major college corridors */}
      <div className="h2chips">
        {category === 'pg' && (
          <>
            <Link href="/pg?q=SRM">🎓 Near SRM (Modinagar)</Link>
            <Link href="/pg?q=Amity">🎓 Near Amity</Link>
            <Link href="/pg?q=Sector%2062">📍 Sec 62 (JSS / JIIT)</Link>
            <Link href="/pg?q=Knowledge%20Park">🎓 Knowledge Park (Sharda/Galgotias)</Link>
            <Link href="/pg?q=North%20Campus">🎓 DU North Campus</Link>
            <Link href="/pg?gender=boys">PG for Boys</Link>
            <Link href="/pg?gender=girls">PG for Girls</Link>
            <Link href="/pg?occupancy=single">Single Room</Link>
          </>
        )}
        {category === 'flats' && (
          <>
            <Link href="/flats?bhk=1+BHK">1 BHK Flat</Link>
            <Link href="/flats?bhk=2+BHK">2 BHK Flat</Link>
            <Link href="/flats?q=Sector%20137">Sector 137 (Expressway)</Link>
            <Link href="/flats?q=Indirapuram">Indirapuram</Link>
            <Link href="/flats?furnishing=furnished">Fully Furnished</Link>
          </>
        )}
        {category === 'society' && (
          <>
            <Link href="/society">All Societies</Link>
            <Link href="/society?q=Sector%2075">Sector 75 &amp; 76</Link>
            <Link href="/society?q=Sector%20137">Sector 137 High-Rise</Link>
            <Link href="/society?gated=true">Gated Security</Link>
            <Link href="/flats">Independent Flats →</Link>
          </>
        )}
      </div>
    </div>
  );
}
