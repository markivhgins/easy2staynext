'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    phone?: string;
    role?: string;
    isOpsOrAdmin?: boolean;
    isOwner?: boolean;
  } | null>(null);

  const syncSession = useCallback(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated) {
          setCurrentUser(data.user);
        } else if (data && !data.authenticated) {
          setCurrentUser(null);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    syncSession();
    window.addEventListener('f2s-auth-change', syncSession);
    return () => {
      window.removeEventListener('f2s-auth-change', syncSession);
    };
  }, [syncSession]);

  return (
    <footer>
      <div>
        <Link className="flogo" href="/" aria-label="Find2Stay home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logo-wide.webp"
            alt="Find2Stay: Your Journey Begins with the Right Stay"
            width={300}
            height={98}
            className="max-w-full h-auto"
          />
        </Link>
        <p>Verified stays and everyday relocation services across India.</p>
      </div>

      <div>
        <h4>Stays</h4>
        <Link href="/pg">PG for students</Link>
        <Link href="/flats">Flats for professionals</Link>
        <Link href="/society">Society homes</Link>
      </div>

      <div>
        <h4>Services</h4>
        <Link href="/services/food">Tiffin</Link>
        <Link href="/services/water">Water jars</Link>
        <Link href="/services/movers">Packers &amp; movers</Link>
      </div>

      <div>
        <h4>Company</h4>
        <Link href="/how-verification-works">How we verify</Link>
        <Link href="/list-your-property">List your property</Link>
        <Link href="/about">About us</Link>
        <Link href="/contact">Contact us</Link>
        <Link href="/help">Help &amp; FAQs</Link>
        {currentUser ? (
          <>
            <Link href="/account/profile" style={{ color: '#60a5fa', fontWeight: 600 }}>
              👤 My Account ({currentUser.name || 'Verified'})
            </Link>
            {currentUser.isOpsOrAdmin && (
              <Link href="/admin" style={{ color: '#7FA2FF', fontWeight: 600 }}>
                🛡️ Staff &amp; Ops Desk
              </Link>
            )}
            {currentUser.isOwner && (
              <Link href="/owner" style={{ color: '#34d399', fontWeight: 600 }}>
                🏡 Owner Desk
              </Link>
            )}
            <a
              href="/api/auth/logout"
              onClick={async (e) => {
                e.preventDefault();
                await fetch('/api/auth/logout', { method: 'POST' });
                window.dispatchEvent(new Event('f2s-auth-change'));
                window.location.href = '/';
              }}
              style={{ color: '#94a3b8' }}
            >
              Sign out
            </a>
          </>
        ) : (
          <>
            <Link href="/auth">Sign in</Link>
            <Link href="/admin" style={{ color: '#7FA2FF', fontWeight: 600 }}>
              Staff &amp; Ops Desk →
            </Link>
          </>
        )}
      </div>

      <div className="fbar">
        <span>
          &copy; {currentYear} Find2Stay. Verified stays and services across India.
        </span>
        <span>Your Journey Begins with the Right Stay</span>
      </div>
    </footer>
  );
};
