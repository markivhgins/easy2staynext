'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { HeaderSavedButton } from './HeaderSavedButton';

interface HeaderProps {
  user?: {
    name?: string;
    phone?: string;
    role?: string;
    roles?: string[];
    isOpsOrAdmin?: boolean;
    isOwner?: boolean;
  } | null;
}

const NAV_LINKS = [
  { href: '/pg', label: 'Find a Room' },
  { href: '/services/food', label: 'Tiffin Service' },
  { href: '/services/movers', label: 'Shifting Service' },
  { href: '/services/water', label: 'RO Water' },
  { href: '/list-your-property', label: 'List Your Property', highlighted: true },
  { href: '/blog', label: 'Blog' },
  { href: '/help', label: 'Help' },
];

export const Header: React.FC<HeaderProps> = ({ user: initialUser }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser || null);
  const { city, setShowModal } = useLocation();

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

  // Sync session on mount, on route changes, and on global auth change events
  useEffect(() => {
    syncSession();

    window.addEventListener('f2s-auth-change', syncSession);
    return () => {
      window.removeEventListener('f2s-auth-change', syncSession);
    };
  }, [pathname, syncSession]);

  // Sync when initialUser prop updates from server if provided
  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isOps =
    currentUser?.isOpsOrAdmin ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'OPERATIONS' ||
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.roles?.includes('ADMIN') ||
    currentUser?.roles?.includes('OPERATIONS') ||
    currentUser?.roles?.includes('SUPER_ADMIN');

  const isOwner =
    currentUser?.isOwner ||
    currentUser?.role === 'OWNER' ||
    currentUser?.roles?.includes('OWNER');

  return (
    <header>
      <Link className="logo" href="/" aria-label="Find2Stay home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-icon.png" alt="" width={44} height={44} />
        <span>
          Find<b>2</b>Stay
        </span>
      </Link>

      <nav
        id="mainnav"
        aria-label="Main"
        className={mobileMenuOpen ? 'open' : ''}
      >
        {/* Mobile City Selector Pill inside drawer only — hidden on desktop */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            setShowModal(true);
          }}
          className="cityp mobile-only-city"
          style={{
            margin: '0 0 12px 0',
            width: '100%',
            justifyContent: 'center',
            cursor: 'pointer',
            background: '#f8fafc',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span>City: {city.name} (Change)</span>
        </button>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${isActive(link.href) ? 'on' : ''} ${link.highlighted ? 'header-highlighted-btn' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            style={
              link.highlighted
                ? {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '8px',
                    padding: '7px 14px',
                    boxShadow: '0 2px 6px rgba(29, 78, 216, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }
                : undefined
            }
          >
            {link.highlighted && <span style={{ marginRight: '4px' }}>🏡</span>}
            {link.label}
          </Link>
        ))}

        {/* Mobile drawer shortcuts only */}
        {isOps && (
          <Link
            href="/admin"
            className="mobile-only-city"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#0f172a',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              margin: '8px 0',
            }}
          >
            🛡️ Operations Desk
          </Link>
        )}

        {isOwner && (
          <Link
            href="/owner"
            className="mobile-only-city"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              margin: '8px 0',
            }}
          >
            🏡 Owner Workspace
          </Link>
        )}

        {currentUser ? (
          <a
            className="navso"
            href="/api/auth/logout"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign out
          </a>
        ) : (
          <Link
            href="/auth"
            className="navso"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login / Sign in
          </Link>
        )}
      </nav>

      {/* Single Dynamic City Switcher */}
      <button
        type="button"
        className="cityp"
        onClick={() => setShowModal(true)}
        title={`Current city: ${city.name}. Click to switch city or detect GPS location.`}
        style={{
          cursor: 'pointer',
          background: '#ffffff',
          fontFamily: 'inherit',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span>{city.name}</span>
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ opacity: 0.65, marginLeft: '2px' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Saved Listings / Wishlist Shortcut */}
      <HeaderSavedButton />

      {/* Single Authoritative User Profile / Desk Button */}
      {currentUser ? (
        <Link className="me" href="/account/profile" title="My Account & Dashboard">
          👤 {currentUser.name || currentUser.phone || 'My Desk'}
        </Link>
      ) : (
        <Link className="me" href="/auth">
          Login
        </Link>
      )}

      {currentUser && (
        <a className="so" href="/api/auth/logout" title="Sign out of account">
          Sign out
        </a>
      )}

      <button
        type="button"
        className="nt"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mainnav"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
};
