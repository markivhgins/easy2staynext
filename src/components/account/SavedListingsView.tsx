'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PublicListing } from '@/types';
import { ListingCard } from '@/components/listings/ListingCard';

export function SavedListingsView() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('f2s_saved_listings') || '[]');
      const slugs = Array.isArray(stored) ? stored : [];
      setSavedSlugs(slugs);

      if (slugs.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/listings?slugs=${encodeURIComponent(slugs.join(','))}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.listings)) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error('Error loading saved listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();

    const handleSavedChanged = () => {
      loadSaved();
    };

    window.addEventListener('f2s_saved_changed', handleSavedChanged);
    return () => {
      window.removeEventListener('f2s_saved_changed', handleSavedChanged);
    };
  }, []);

  const clearAllSaved = () => {
    if (confirm('Are you sure you want to clear all your saved properties?')) {
      localStorage.setItem('f2s_saved_listings', '[]');
      setSavedSlugs([]);
      setListings([]);
      window.dispatchEvent(
        new CustomEvent('f2s_saved_changed', { detail: { slug: '', isSaved: false, total: 0 } })
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--mut)' }}>
        <p>Loading your saved properties...</p>
      </div>
    );
  }

  if (savedSlugs.length === 0 || listings.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFF1F2',
            color: '#E11D48',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '28px', height: '28px' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
          No Saved Properties Yet
        </h3>
        <p style={{ color: 'var(--mut)', maxWidth: '440px', margin: '0 auto 24px', fontSize: '14.5px' }}>
          Click the heart icon on any PG room, flat, or society listing to save it to your wishlist for easy comparison and booking.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/pg" className="go" style={{ padding: '10px 22px', fontSize: '14px', borderRadius: '8px' }}>
            Browse PG Rooms
          </Link>
          <Link href="/flats" className="go light" style={{ padding: '10px 22px', fontSize: '14px', borderRadius: '8px' }}>
            Explore Flats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px' }}>
          Showing <b>{listings.length}</b> saved {listings.length === 1 ? 'property' : 'properties'} in your wishlist
        </p>
        <button
          type="button"
          onClick={clearAllSaved}
          style={{
            background: 'none',
            border: 'none',
            color: '#E11D48',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Clear all saved
        </button>
      </div>

      <div className="grid two" style={{ gap: '24px' }}>
        {listings.map((l) => (
          <ListingCard key={l.slug} listing={l} />
        ))}
      </div>
    </div>
  );
}
