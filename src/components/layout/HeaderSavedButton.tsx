'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export function HeaderSavedButton() {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('f2s_saved_listings') || '[]');
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setSavedCount(0);
      }
    };

    updateCount();

    const handleSavedChanged = (e: any) => {
      if (typeof e.detail?.total === 'number') {
        setSavedCount(e.detail.total);
      } else {
        updateCount();
      }
    };

    window.addEventListener('f2s_saved_changed', handleSavedChanged);
    window.addEventListener('f2s-wishlist-change', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('f2s_saved_changed', handleSavedChanged);
      window.removeEventListener('f2s-wishlist-change', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <Link
      href="/account/saved"
      className="hdr-saved-btn"
      title={savedCount > 0 ? `${savedCount} Saved Stays` : 'Saved Stays (Wishlist)'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: '#ffffff',
        border: '1px solid var(--line)',
        color: savedCount > 0 ? '#E11D48' : '#64748B',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'all 0.15s ease',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill={savedCount > 0 ? '#E11D48' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '18px', height: '18px', transition: 'transform 0.15s' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {savedCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            minWidth: '17px',
            height: '17px',
            padding: '0 4px',
            borderRadius: '999px',
            background: '#E11D48',
            color: '#ffffff',
            fontSize: '10.5px',
            fontWeight: 700,
            lineHeight: '17px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(225,29,72,0.4)',
          }}
        >
          {savedCount}
        </span>
      )}
    </Link>
  );
}
