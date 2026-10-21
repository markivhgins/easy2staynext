'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlaceAutocompleteInput } from './PlaceAutocompleteInput';
import { useLocation } from '@/context/LocationContext';

type TabType = 'rooms' | 'shifting' | 'tiffin' | 'water';

export function HeroSearchBar() {
  const [activeTab, setActiveTab] = useState<TabType>('rooms');
  const { city, setShowModal } = useLocation();

  const tabConfig = {
    rooms: {
      action: '/pg',
      placeholder: 'Search PG, Flat, Room near you...',
      buttonText: 'Search',
      chips: [
        { label: 'PG for Boys', href: '/pg?gender=boys' },
        { label: 'PG for Girls', href: '/pg?gender=girls' },
        { label: '1 BHK', href: '/flats?bhk=1+BHK' },
        { label: 'Near Metro', href: '/pg?q=Metro' },
        { label: 'Near College', href: '/pg?q=College' },
        { label: 'Shared Room', href: '/pg?occupancy=double' },
        { label: 'Furnished Room', href: '/pg?furnishing=furnished' },
      ],
    },
    shifting: {
      action: '/services/shifting',
      placeholder: 'Where do you want to shift? Enter pickup or drop...',
      buttonText: 'Search',
      chips: [
        { label: '1 BHK Shifting', href: '/services/shifting?type=1bhk' },
        { label: 'Room Shifting', href: '/services/shifting?type=room' },
        { label: 'Local Within City', href: '/services/shifting?scope=local' },
        { label: 'Hassle-free Movers', href: '/services/shifting' },
      ],
    },
    tiffin: {
      action: '/services/tiffin',
      placeholder: 'Find pure home-style tiffin delivery near you...',
      buttonText: 'Search',
      chips: [
        { label: 'North Indian Thali', href: '/services/tiffin?meal=north-indian' },
        { label: 'Healthy & Tasty', href: '/services/tiffin?diet=healthy' },
        { label: 'Monthly Meal Plan', href: '/services/tiffin?plan=monthly' },
        { label: 'Student Discount', href: '/services/tiffin' },
      ],
    },
    water: {
      action: '/services/ro-water',
      placeholder: 'Order clean 20L RO water cans at your doorstep...',
      buttonText: 'Search',
      chips: [
        { label: '20L Daily Can', href: '/services/ro-water?type=20l' },
        { label: 'Clean & Safe Water', href: '/services/ro-water?filter=ro' },
        { label: 'Monthly Pass', href: '/services/ro-water?plan=monthly' },
        { label: 'Quick Delivery', href: '/services/ro-water' },
      ],
    },
  };

  const currentConfig = tabConfig[activeTab];

  return (
    <div className="f2s-search-wrapper">
      <form id="hs" className="f2s-search-box" action={currentConfig.action} method="GET">
        {/* 4 Category Tabs */}
        <div className="f2s-search-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rooms'}
            className={`f2s-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
            </svg>
            <span>Rooms</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'shifting'}
            className={`f2s-tab-btn ${activeTab === 'shifting' ? 'active' : ''}`}
            onClick={() => setActiveTab('shifting')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Shifting</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tiffin'}
            className={`f2s-tab-btn ${activeTab === 'tiffin' ? 'active' : ''}`}
            onClick={() => setActiveTab('tiffin')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2a3 3 0 0 0-3 3v1H5a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-4V5a3 3 0 0 0-3-3z" />
              <path d="M4 11v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8" />
              <line x1="12" y1="6" x2="12" y2="22" />
            </svg>
            <span>Tiffin</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'water'}
            className={`f2s-tab-btn ${activeTab === 'water' ? 'active' : ''}`}
            onClick={() => setActiveTab('water')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span>RO Water</span>
          </button>
        </div>

        {/* Input Bar with Search, City Selector & Orange Submit Button */}
        <div className="f2s-search-bar">
          <div className="f2s-search-input-field">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="f2s-input-icon"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <PlaceAutocompleteInput
              name="q"
              placeholder={currentConfig.placeholder}
              ariaLabel={currentConfig.placeholder}
            />
          </div>

          {/* City Selector embedded in search bar */}
          <button
            type="button"
            className="f2s-search-city-btn"
            onClick={() => setShowModal(true)}
            title="Switch search city"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="f2s-city-pin"
            >
              <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="f2s-city-name">{city.name}</span>
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="f2s-city-chevron"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Vibrant Orange Search Button */}
          <button type="submit" className="f2s-search-submit-btn" aria-label="Search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <span>{currentConfig.buttonText}</span>
          </button>
        </div>
      </form>

      {/* Popular Searches Tag Row */}
      <div className="f2s-popular-chips-wrap">
        <span className="f2s-popular-label">Popular Searches:</span>
        <div className="f2s-popular-chips">
          {currentConfig.chips.map((chip) => (
            <Link key={chip.label} href={chip.href} className="f2s-chip-pill">
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

