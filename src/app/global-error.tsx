'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: '#071B4B',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          margin: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px', color: '#ffffff' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: '#BFD0FF', lineHeight: 1.6, margin: '0 0 24px' }}>
            An unexpected error occurred while loading this page. Please try refreshing.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#FF7A1A',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
