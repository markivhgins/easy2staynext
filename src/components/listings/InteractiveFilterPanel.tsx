'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PlaceAutocompleteInput } from '@/components/search/PlaceAutocompleteInput';

interface InteractiveFilterPanelProps {
  type: 'pg' | 'flats' | 'society';
  initialQuery?: string;
  initialMax?: number;
  initialSort?: string;
  // PG specific
  initialGender?: string;
  initialOccupancy?: string;
  initialMeals?: boolean;
  // Flats specific
  initialBhk?: string;
  initialFurnishing?: string;
  // Society specific
  initialSociety?: string;
  societiesList?: string[];
}

export function InteractiveFilterPanel({
  type,
  initialQuery = '',
  initialMax,
  initialSort = '',
  initialGender = '',
  initialOccupancy = '',
  initialMeals = false,
  initialBhk = '',
  initialFurnishing = '',
  initialSociety = '',
  societiesList = [],
}: InteractiveFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const minRange = type === 'pg' ? 3000 : 8000;
  const maxRange = type === 'pg' ? 25000 : 80000;
  const step = type === 'pg' ? 500 : 2000;

  const [q, setQ] = useState(initialQuery);
  const [maxRent, setMaxRent] = useState<number>(initialMax || maxRange);
  const [sort, setSort] = useState(initialSort);
  const [gender, setGender] = useState(initialGender);
  const [occupancy, setOccupancy] = useState(initialOccupancy);
  const [meals, setMeals] = useState(initialMeals);
  const [bhk, setBhk] = useState(initialBhk);
  const [furnishing, setFurnishing] = useState(initialFurnishing);
  const [society, setSociety] = useState(initialSociety);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (q.trim()) params.set('q', q.trim());
    if (maxRent < maxRange) params.set('max', String(maxRent));
    if (sort) params.set('sort', sort);

    if (type === 'pg') {
      if (gender) params.set('gender', gender);
      if (occupancy) params.set('occupancy', occupancy);
      if (meals) params.set('meals', '1');
    } else if (type === 'flats') {
      if (bhk) params.set('bhk', bhk);
      if (furnishing) params.set('furnishing', furnishing);
    } else if (type === 'society') {
      if (society) params.set('society', society);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setQ('');
    setMaxRent(maxRange);
    setSort('');
    setGender('');
    setOccupancy('');
    setMeals(false);
    setBhk('');
    setFurnishing('');
    setSociety('');
    router.push(pathname);
  };

  const activeFiltersCount = [
    q.trim(),
    maxRent < maxRange,
    sort,
    gender,
    occupancy,
    meals,
    bhk,
    furnishing,
    society,
  ].filter(Boolean).length;

  return (
    <form
      onSubmit={handleApply}
      className="panel"
      style={{
        borderRadius: '20px',
        padding: '24px 20px',
        border: '1px solid var(--line)',
        background: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'sticky',
        top: '84px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1.5px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>
            Search Filters
          </h3>
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 0,
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'var(--blue)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Locality Search Input */}
      <div>
        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '6px' }}>
          Locality, Metro or College
        </label>
        <PlaceAutocompleteInput
          name="q"
          defaultValue={q}
          placeholder={type === 'pg' ? 'Sector 62, Knowledge Park, SRM...' : 'Sector 77, Sector 137, Indirapuram...'}
          style={{
            background: '#ffffff',
            border: '1.5px solid var(--line2, #cfd8e3)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            width: '100%',
          }}
        />
      </div>

      {/* Live Max Budget Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)' }}>
            Max Monthly Rent
          </span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#1557D6', fontFamily: 'monospace' }}>
            {maxRent >= maxRange ? 'Any Budget' : `₹${maxRent.toLocaleString('en-IN')}/mo`}
          </span>
        </div>
        <input
          type="range"
          min={minRange}
          max={maxRange}
          step={step}
          value={maxRent}
          onChange={(e) => setMaxRent(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#1557D6',
            cursor: 'pointer',
            height: '6px',
            borderRadius: '999px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--mut)', marginTop: '4px' }}>
          <span>₹{(minRange / 1000).toFixed(0)}k</span>
          <span>₹{(maxRange / 2000).toFixed(0)}k</span>
          <span>₹{(maxRange / 1000).toFixed(0)}k+</span>
        </div>
      </div>

      {/* PG-Specific Filters */}
      {type === 'pg' && (
        <>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '8px' }}>
              Gender / Resident Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: '', label: 'All' },
                { id: 'boys', label: 'Boys' },
                { id: 'girls', label: 'Girls' },
                { id: 'co-ed', label: 'Co-ed' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: gender === g.id ? '2px solid #1557D6' : '1px solid var(--line)',
                    background: gender === g.id ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                    color: gender === g.id ? '#1557D6' : 'var(--navy)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '8px' }}>
              Room Occupancy
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: '', label: 'All' },
                { id: 'single', label: 'Single' },
                { id: '2-share', label: '2-Share' },
                { id: '3-share', label: '3-Share' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccupancy(o.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: occupancy === o.id ? '2px solid #1557D6' : '1px solid var(--line)',
                    background: occupancy === o.id ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                    color: occupancy === o.id ? '#1557D6' : 'var(--navy)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meals Included Modern Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              background: meals ? 'rgba(21, 87, 214, 0.06)' : 'var(--sky)',
              border: meals ? '1.5px solid #1557D6' : '1px solid var(--line)',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🍲</span>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--navy)' }}>
                Food &amp; Meals Included
              </span>
            </div>
            <input
              type="checkbox"
              checked={meals}
              onChange={(e) => setMeals(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#1557D6', cursor: 'pointer' }}
            />
          </label>
        </>
      )}

      {/* Flats-Specific Filters */}
      {type === 'flats' && (
        <>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '8px' }}>
              Apartment Size (BHK)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: '', label: 'All' },
                { id: '1 BHK', label: '1 BHK' },
                { id: '2 BHK', label: '2 BHK' },
                { id: '3 BHK', label: '3 BHK' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBhk(b.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: bhk === b.id ? '2px solid #1557D6' : '1px solid var(--line)',
                    background: bhk === b.id ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                    color: bhk === b.id ? '#1557D6' : 'var(--navy)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '6px' }}>
              Furnishing Level
            </label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              style={{ width: '100%', fontSize: '13.5px' }}
            >
              <option value="">Any furnishing</option>
              <option value="Fully furnished">Fully furnished</option>
              <option value="Semi-furnished">Semi-furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
        </>
      )}

      {/* Society-Specific Filter */}
      {type === 'society' && societiesList.length > 0 && (
        <div>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '6px' }}>
            Gated Society / Enclave
          </label>
          <select
            value={society}
            onChange={(e) => setSociety(e.target.value)}
            style={{ width: '100%', fontSize: '13.5px' }}
          >
            <option value="">All Verified Societies</option>
            {societiesList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sort By Dropdown */}
      <div>
        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)', marginBottom: '6px' }}>
          Sort Order
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ width: '100%', fontSize: '13.5px' }}
        >
          <option value="">⚡ Fresh Availability First</option>
          <option value="low">💰 Rent: Low to High</option>
          <option value="high">💎 Rent: High to Low</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="go"
        style={{
          width: '100%',
          borderRadius: '999px',
          padding: '13px',
          fontSize: '15px',
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(21, 87, 214, 0.25)',
        }}
      >
        Apply Filters &rarr;
      </button>
    </form>
  );
}
