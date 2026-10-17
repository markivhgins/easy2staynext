'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  user?: {
    name?: string;
    phone?: string;
    role?: string;
    roles?: string[];
    isOpsOrAdmin?: boolean;
    isOwner?: boolean;
  } | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({ user: initialUser }) => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(initialUser || null);

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

  // Sync session state via client API on mount, route changes, and auth change events
  useEffect(() => {
    syncSession();

    window.addEventListener('f2s-auth-change', syncSession);
    return () => {
      window.removeEventListener('f2s-auth-change', syncSession);
    };
  }, [pathname, syncSession]);

  // Sync when initialUser prop updates if provided
  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
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

  const profileHref = isOps
    ? '/admin'
    : currentUser
    ? '/account/profile'
    : '/auth';

  const profileLabel = isOps
    ? 'Ops Desk'
    : currentUser
    ? 'Profile'
    : 'Sign in';

  const profileIcon = isOps ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </svg>
  );

  const items = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      ),
    },
    {
      href: '/pg',
      label: 'PG',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7M3 15h18M6 8V5h12v3" />
        </svg>
      ),
    },
    {
      href: '/flats',
      label: 'Flats',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 21V4h10v17M14 9h6v12M8 8h2M8 12h2M8 16h2M17 13h0M17 17h0" />
        </svg>
      ),
    },
    {
      href: '/services/food',
      label: 'Services',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6z" />
        </svg>
      ),
    },
    {
      href: profileHref,
      label: profileLabel,
      icon: profileIcon,
    },
  ];

  return (
    <nav className="bnav" aria-label="Quick mobile navigation">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isCurrent(item.href) ? 'on' : ''}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
