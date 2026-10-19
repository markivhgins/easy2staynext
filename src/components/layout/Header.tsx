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
  { href: '/flats', label: 'Flats' },
  { href: '/services/food', label: 'Tiffin Service' },
  { href: '/services/movers', label: 'Shifting Service' },
  { href: '/services/water', label: 'RO Water' },
  { href: '/list-your-property', label: 'List Your Property' },
  { href: '/about', label: 'About Us' },
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

  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.dispatchEvent(new Event('f2s-auth-change'));
    window.location.href = '/';
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
            className={isActive(link.href) ? 'on' : ''}
            onClick={() => setMobileMenuOpen(false)}
          >
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
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleLogout(e);
            }}
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

      {/* Desktop Owner Workspace Shortcut for Owners */}
      {isOwner && (
        <Link
          href="/owner"
          style={{
            padding: '7px 12px',
            borderRadius: '999px',
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '12.5px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
          title="Open Landlord Property Workspace"
        >
          🏡 Owner Desk
        </Link>
      )}

      {/* Single Authoritative User Profile / Desk Button */}
      {currentUser ? (
        <Link className="me" href="/account/activity" title="My Activity, Rented Stays & Requests">
          👤 {currentUser.name || currentUser.phone || 'My Account'}
        </Link>
      ) : (
        <Link className="me" href="/auth">
          Login
        </Link>
      )}

      {currentUser && (
        <a
          className="so"
          href="/api/auth/logout"
          onClick={handleLogout}
          title="Sign out of account"
        >
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
