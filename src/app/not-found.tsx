import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '32px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '56px', marginBottom: '12px' }}>🔍</div>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy, #0B2350)', margin: '0 0 12px' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--mut, #51618A)', maxWidth: '420px', margin: '0 0 24px', lineHeight: 1.5 }}>
        We couldn&apos;t find the stay, location, or page you were looking for. It may have been moved or unlisted.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--blue, #1D5BD8)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(29, 91, 216, 0.3)',
        }}
      >
        ← Back to Verified Stays
      </Link>
    </div>
  );
}
