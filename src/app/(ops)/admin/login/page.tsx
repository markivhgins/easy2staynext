'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('admin@find2stay.in');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin/ops, redirect directly to /admin
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user?.isOpsOrAdmin) {
          router.replace('/admin');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passcode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate staff.');
      }

      window.dispatchEvent(new Event('f2s-auth-change'));
      router.push(data.redirectUrl || '/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="head">
        <div className="wrap">
          <h1>Staff &amp; Operations Portal</h1>
          <p>
            Internal desk authentication for Noida &amp; Delhi NCR property verification, visits, and service routing.
          </p>
        </div>
      </section>

      <div className="wrap narrow" style={{ maxWidth: 480, margin: '30px auto 80px', padding: '0 16px' }}>
        <div
          className="panel"
          style={{
            borderRadius: '20px',
            padding: 'clamp(24px, 5vw, 36px)',
            border: '1px solid var(--line)',
            boxShadow: '0 12px 36px -10px rgba(7, 27, 75, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--navy)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '18px',
              }}
            >
              ⚙️
            </span>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                Operations Sign In
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
                Find2Stay Internal Access
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)' }}>
                Staff Email or Mobile
              </span>
              <input
                type="text"
                placeholder="admin@find2stay.in or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1.5px solid var(--line)',
                  fontSize: '15px',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mut)' }}>
                Admin Security Passcode / PIN
              </span>
              <input
                type="password"
                placeholder="Enter master admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                style={{
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1.5px solid var(--line)',
                  fontSize: '15px',
                }}
              />
            </label>

            {/* Quick credentials hint for easy access */}
            <div
              style={{
                background: 'var(--sky)',
                border: '1px solid #BFD5FD',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12.5px',
                color: 'var(--navy)',
                lineHeight: 1.5,
              }}
            >
              <strong>Staff Access Passcode:</strong> <code>prayagraj2026</code>
              <br />
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin@find2stay.in');
                  setPasscode('prayagraj2026');
                }}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'var(--blue)',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                Auto-fill staff credentials
              </button>
            </div>

            {error && (
              <p
                className="msg err"
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#FEE2E2',
                  color: '#991B1B',
                  fontSize: '13.5px',
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="go"
              disabled={loading || !passcode}
              style={{
                borderRadius: '999px',
                padding: '13px 20px',
                fontSize: '15px',
                fontWeight: 700,
                width: '100%',
                opacity: loading || !passcode ? 0.7 : 1,
                cursor: loading || !passcode ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Authenticating...' : 'Access Operations Desk →'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--line)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/auth" style={{ fontSize: '13px', color: 'var(--blue)', fontWeight: 600, textDecoration: 'underline' }}>
              Looking to book or search? Go to User Mobile Sign-In →
            </Link>
            <Link href="/" style={{ fontSize: '13px', color: 'var(--mut)', textDecoration: 'none' }}>
              ← Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
