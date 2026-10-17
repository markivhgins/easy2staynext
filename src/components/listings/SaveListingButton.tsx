'use client';

import React, { useState, useEffect } from 'react';

interface SaveListingButtonProps {
  slug: string;
  title?: string;
  className?: string;
  showText?: boolean;
}

export function SaveListingButton({
  slug,
  title,
  className = '',
  showText = false,
}: SaveListingButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('f2s_saved_listings') || '[]');
      setIsSaved(Array.isArray(saved) && saved.includes(slug));
    } catch {
      // ignore
    }
  }, [slug]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem('f2s_saved_listings') || '[]'
      );
      let updated: string[];
      if (saved.includes(slug)) {
        updated = saved.filter((s) => s !== slug);
        setIsSaved(false);
      } else {
        updated = [...saved, slug];
        setIsSaved(true);
      }
      localStorage.setItem('f2s_saved_listings', JSON.stringify(updated));

      window.dispatchEvent(
        new CustomEvent('f2s_saved_changed', {
          detail: { slug, isSaved: !saved.includes(slug), total: updated.length },
        })
      );
    } catch (err) {
      console.error('Failed to update saved listings:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSave}
      title={isSaved ? 'Remove from saved' : 'Save this stay'}
      aria-label={isSaved ? 'Remove from saved' : 'Save this stay'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: showText ? '6px 14px' : '0',
        width: showText ? 'auto' : '36px',
        height: '36px',
        borderRadius: '999px',
        background: isSaved ? '#FFF1F2' : 'rgba(255, 255, 255, 0.95)',
        color: isSaved ? '#E11D48' : '#0B2350',
        border: isSaved ? '1px solid #FECDD3' : '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
        zIndex: 5,
      }}
      className={className}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isSaved ? '#E11D48' : 'none'}
        stroke={isSaved ? '#E11D48' : 'currentColor'}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: 16, height: 16, flexShrink: 0 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {showText && <span>{isSaved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
