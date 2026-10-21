'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface NavLinkItem {
  href: string;
  label: string;
  hasChevron?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { href: '/', label: 'Home' },
  { href: '/pg', label: 'Find Stay', hasChevron: true },
  { href: '/services/shifting', label: 'Shifting' },
  { href: '/services/tiffin', label: 'Tiffin' },
  { href: '/services/ro-water', label: 'RO Water' },
  { href: '/blog', label: 'Blog' },
  { href: '/list-your-property', label: 'List Your Property' },
  { href: '/about', label: 'About Us' },
  { href: '/help', label: 'Help' },
];

export const Header: React.FC<HeaderProps> = ({ user: initialUser }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [findRoomDropdownOpen, setFindRoomDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser || null);
  const { city, setShowModal } = useLocation();

  const findStayRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
  }, [pathname, syncSession]);

  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdowns on outside mousedown or touch
  useEffect(() => {
    const handleOutsidePointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
      if (findStayRef.current && !findStayRef.current.contains(target)) {
        setFindRoomDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsidePointer);
    document.addEventListener('touchstart', handleOutsidePointer);
    return () => {
      document.removeEventListener('mousedown', handleOutsidePointer);
      document.removeEventListener('touchstart', handleOutsidePointer);
    };
  }, []);

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
    <>
      <header className="f2s-header">
        {/* Brand Logo with Tagline */}
        <Link className="f2s-logo-wrap" href="/" aria-label="Find2Stay home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo-icon.png" alt="Find2Stay" width={38} height={38} className="f2s-logo-icon" />
          <div className="f2s-logo-texts">
            <div className="f2s-logo-title">
              Find<span>2</span>Stay
            </div>
            <span className="f2s-logo-tagline">Your Journey Begins with the Right Stay</span>
          </div>
        </Link>

        {/* Desktop Main Nav */}
        <nav id="mainnav" aria-label="Desktop Navigation" className="f2s-desktop-nav">
          {NAV_LINKS.map((link) => {
            if (link.hasChevron) {
              return (
                <div
                  key={link.href}
                  ref={findStayRef}
                  className={`f2s-nav-dropdown-wrap ${findRoomDropdownOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className={`f2s-nav-link f2s-nav-btn ${isActive(link.href) ? 'on' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFindRoomDropdownOpen((prev) => !prev);
                    }}
                    aria-expanded={findRoomDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>{link.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={`f2s-nav-chevron ${findRoomDropdownOpen ? 'open' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div className="f2s-findroom-dropdown-menu">
                    <div className="f2s-dropdown-section-title">CATEGORIES</div>
                    <Link
                      href="/pg"
                      className="f2s-dropdown-item"
                      onClick={() => setFindRoomDropdownOpen(false)}
                    >
                      <span className="f2s-item-icon">🏠</span>
                      <div>
                        <b>All Verified Stays</b>
                        <small>Explore all rooms, flats &amp; PGs</small>
                      </div>
                    </Link>
                    <Link
                      href="/pg?gender=boys"
                      className="f2s-dropdown-item"
                      onClick={() => setFindRoomDropdownOpen(false)}
                    >
                      <span className="f2s-item-icon">👨</span>
                      <div>
                        <b>Boys PG &amp; Hostels</b>
                        <small>Student &amp; executive stays</small>
                      </div>
                    </Link>
                    <Link
                      href="/pg?gender=girls"
                      className="f2s-dropdown-item"
                      onClick={() => setFindRoomDropdownOpen(false)}
                    >
                      <span className="f2s-item-icon">👩</span>
                      <div>
                        <b>Girls PG &amp; Hostels</b>
                        <small>Safe, gated &amp; warden verified</small>
                      </div>
                    </Link>
                    <Link
                      href="/pg?type=Flat"
                      className="f2s-dropdown-item"
                      onClick={() => setFindRoomDropdownOpen(false)}
                    >
                      <span className="f2s-item-icon">🏢</span>
                      <div>
                        <b>Independent Flats (1BHK / 2BHK)</b>
                        <small>Full apartments with zero brokerage</small>
                      </div>
                    </Link>
                    <Link
                      href="/pg?sharing=Double"
                      className="f2s-dropdown-item"
                      onClick={() => setFindRoomDropdownOpen(false)}
                    >
                      <span className="f2s-item-icon">👥</span>
                      <div>
                        <b>Shared Rooms &amp; Co-Living</b>
                        <small>Budget friendly sharing rooms</small>
                      </div>
                    </Link>

                    <div className="f2s-dropdown-divider" />
                    <div className="f2s-dropdown-section-title">POPULAR HUBS</div>
                    <div className="f2s-dropdown-hubs-grid">
                      <Link
                        href="/pg?q=Sector+62"
                        className="f2s-hub-chip"
                        onClick={() => setFindRoomDropdownOpen(false)}
                      >
                        📍 Sector 62 (Noida)
                      </Link>
                      <Link
                        href="/pg?q=Knowledge+Park"
                        className="f2s-hub-chip"
                        onClick={() => setFindRoomDropdownOpen(false)}
                      >
                        📍 Knowledge Park
                      </Link>
                      <Link
                        href="/pg?q=Sector+15"
                        className="f2s-hub-chip"
                        onClick={() => setFindRoomDropdownOpen(false)}
                      >
                        📍 Sector 15 (Metro)
                      </Link>
                      <Link
                        href="/pg?q=Botanical+Garden"
                        className="f2s-hub-chip"
                        onClick={() => setFindRoomDropdownOpen(false)}
                      >
                        📍 Botanical Garden
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`f2s-nav-link ${isActive(link.href) ? 'on' : ''}`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

      {/* Header Right Action Group */}
      <div className="f2s-header-right">
        {/* City Selector Pill with Pin & Chevron */}
        <button
          type="button"
          className="cityp"
          onClick={() => setShowModal(true)}
          title={`Active city: ${city.name}. Click to change.`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cityp-pin"
          >
            <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="cityp-text">{city.name}</span>
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="cityp-chevron"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Wishlist Shortcut Button */}
        <HeaderSavedButton />

        {/* Logged in Desk & Profile Buttons */}
        {isOps ? (
          <Link
            href="/admin"
            className="f2s-desk-pill admin"
            title="Operations & Verification Desk"
          >
            <span>🛡️</span>
            <span>Admin Desk</span>
          </Link>
        ) : isOwner ? (
          <Link
            href="/owner"
            className="f2s-desk-pill owner"
            title="Owner Property Management"
          >
            <span>🏡</span>
            <span>Owner Desk</span>
          </Link>
        ) : null}

        {currentUser && !isOps ? (
          <div className="f2s-auth-logged-group">
            {/* Interactive User Account Dropdown */}
            <div ref={userMenuRef} className="f2s-user-menu-container">
              <button
                type="button"
                className="f2s-user-pill-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <span className="f2s-user-avatar-icon">👤</span>
                <span className="f2s-user-name-text">
                  {currentUser.name || currentUser.phone || 'My Account'}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`f2s-user-chevron ${userDropdownOpen ? 'open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div className="f2s-user-dropdown-menu">
                  <div className="f2s-user-dropdown-header">
                    <div className="f2s-user-dropdown-name">{currentUser.name || 'User'}</div>
                    <div className="f2s-user-dropdown-phone">
                      {currentUser.phone ? `+91 ${currentUser.phone}` : 'Verified Member'}
                    </div>
                  </div>

                  <div className="f2s-user-dropdown-divider" />

                  <Link
                    href={isOwner ? '/owner' : '/account/activity'}
                    className="f2s-user-dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <span>📋</span>
                    <span>My Activity &amp; Bookings</span>
                  </Link>

                  {isOwner && (
                    <Link
                      href="/owner"
                      className="f2s-user-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <span>🏡</span>
                      <span>Owner Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/list-your-property"
                    className="f2s-user-dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <span>➕</span>
                    <span>List Your Property</span>
                  </Link>

                  <div className="f2s-user-dropdown-divider" />

                  <button
                    type="button"
                    className="f2s-user-dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : !currentUser ? (
          <div className="f2s-auth-guest-group">
            <Link 
              href="/auth" 
              className="f2s-btn-login"
              title="Login with Mobile OTP (creates an account if you don't have one)"
            >
              Login
            </Link>
          </div>
        ) : null}

        {/* Mobile Hamburger Menu Toggle */}
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
      </div>
    </header>

    {/* ── Modern Dedicated Mobile Drawer ── */}
    {mobileMenuOpen && (
      <div className="f2s-mobile-drawer-root">
        {/* Backdrop Blur Overlay */}
        <div
          className="f2s-mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-in Drawer Sheet */}
        <aside className="f2s-mobile-drawer-sheet" aria-label="Mobile Navigation">
          {/* Drawer Top Header */}
          <div className="f2s-drawer-top-header">
            <div className="f2s-drawer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo-icon.png" alt="Find2Stay" width={30} height={30} />
              <div className="f2s-drawer-brand-name">
                Find<span>2</span>Stay
              </div>
            </div>
            <button
              type="button"
              className="f2s-drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* User Account / Guest Card */}
          <div className="f2s-drawer-user-card">
            {currentUser ? (
              <div className="f2s-drawer-user-info">
                <div className="f2s-drawer-avatar">
                  {(currentUser.name || currentUser.phone || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="f2s-drawer-user-meta">
                  <b className="f2s-drawer-user-name">{currentUser.name || 'Member'}</b>
                  <small className="f2s-drawer-user-phone">
                    {currentUser.phone ? `+91 ${currentUser.phone}` : 'Verified Account'}
                  </small>
                  <span className="f2s-drawer-role-badge">
                    {isOps ? '🛡️ Admin Desk' : isOwner ? '🏡 Property Owner' : '👤 Resident'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="f2s-drawer-guest-card">
                <b>Welcome to Find2Stay</b>
                <p>Verified stays, tiffin, water &amp; zero-brokerage rooms</p>
                <Link
                  href="/auth"
                  className="f2s-drawer-login-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Login / Sign Up</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Scrollable Navigation Sections */}
          <div className="f2s-drawer-scrollable">
            {/* City Switcher Pill */}
            <button
              type="button"
              className="f2s-drawer-city-row"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowModal(true);
              }}
            >
              <div className="f2s-drawer-city-left">
                <span className="f2s-drawer-pin">📍</span>
                <div>
                  <span className="f2s-drawer-city-label">Selected City</span>
                  <b className="f2s-drawer-city-val">{city.name}</b>
                </div>
              </div>
              <span className="f2s-drawer-change-link">Change ›</span>
            </button>

            {/* Section 1: Stays & Rooms */}
            <div className="f2s-drawer-group">
              <div className="f2s-drawer-group-title">VERIFIED STAYS</div>
              <Link
                href="/pg"
                className={`f2s-drawer-link ${pathname === '/pg' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">🏠</span>
                <div className="f2s-drawer-text">
                  <b>All Verified Stays</b>
                  <small>Explore PGs, flats &amp; shared rooms</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/pg?gender=boys"
                className="f2s-drawer-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">👨</span>
                <div className="f2s-drawer-text">
                  <b>Boys PG &amp; Hostels</b>
                  <small>Student &amp; executive stays</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/pg?gender=girls"
                className="f2s-drawer-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">👩</span>
                <div className="f2s-drawer-text">
                  <b>Girls PG &amp; Hostels</b>
                  <small>Safe, gated &amp; warden verified</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/flats"
                className={`f2s-drawer-link ${pathname === '/flats' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">🏢</span>
                <div className="f2s-drawer-text">
                  <b>Flats &amp; Apartments</b>
                  <small>1BHK, 2BHK with zero brokerage</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>
            </div>

            {/* Section 2: Relocation & Living Services */}
            <div className="f2s-drawer-group">
              <div className="f2s-drawer-group-title">EVERYDAY SERVICES</div>
              <Link
                href="/services/shifting"
                className={`f2s-drawer-link ${pathname.includes('shifting') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon cyan">🚚</span>
                <div className="f2s-drawer-text">
                  <b>Easy Shifting</b>
                  <small>Local packers &amp; movers</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/services/tiffin"
                className={`f2s-drawer-link ${pathname.includes('tiffin') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon green">🍱</span>
                <div className="f2s-drawer-text">
                  <b>Healthy Tiffin</b>
                  <small>Fresh home-style delivery</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/services/ro-water"
                className={`f2s-drawer-link ${pathname.includes('ro-water') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon blue">💧</span>
                <div className="f2s-drawer-text">
                  <b>RO Water Cans</b>
                  <small>Clean 20L pure drinking water</small>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>
            </div>

            {/* Section 3: For Owners & Administration */}
            <div className="f2s-drawer-group">
              <div className="f2s-drawer-group-title">FOR OWNERS &amp; OPS</div>
              <Link
                href="/list-your-property"
                className={`f2s-drawer-link highlight ${pathname === '/list-your-property' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon orange">➕</span>
                <div className="f2s-drawer-text">
                  <b>List Your Property</b>
                  <small>Direct verified tenants</small>
                </div>
                <span className="f2s-drawer-tag-free">FREE</span>
              </Link>

              {isOwner && (
                <Link
                  href="/owner"
                  className="f2s-drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="f2s-drawer-icon">🏡</span>
                  <div className="f2s-drawer-text">
                    <b>Owner Dashboard</b>
                    <small>Manage rooms &amp; leads</small>
                  </div>
                  <span className="f2s-drawer-arrow">›</span>
                </Link>
              )}

              {isOps && (
                <Link
                  href="/admin"
                  className="f2s-drawer-link admin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="f2s-drawer-icon">🛡️</span>
                  <div className="f2s-drawer-text">
                    <b>Admin Desk</b>
                    <small>Operations &amp; verifications</small>
                  </div>
                  <span className="f2s-drawer-arrow">›</span>
                </Link>
              )}
            </div>

            {/* Section 4: Resources & Help */}
            <div className="f2s-drawer-group">
              <div className="f2s-drawer-group-title">SUPPORT &amp; ABOUT</div>
              <Link
                href="/blog"
                className={`f2s-drawer-link ${pathname === '/blog' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">📰</span>
                <div className="f2s-drawer-text">
                  <b>Blog &amp; Guides</b>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/about"
                className={`f2s-drawer-link ${pathname === '/about' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">ℹ️</span>
                <div className="f2s-drawer-text">
                  <b>About Us</b>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>

              <Link
                href="/help"
                className={`f2s-drawer-link ${pathname === '/help' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="f2s-drawer-icon">💬</span>
                <div className="f2s-drawer-text">
                  <b>Help &amp; FAQs</b>
                </div>
                <span className="f2s-drawer-arrow">›</span>
              </Link>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="f2s-drawer-bottom-bar">
            <a
              href="https://wa.me/919999999999?text=Hi%20Find2Stay%2C%20I%20need%20help"
              target="_blank"
              rel="noopener noreferrer"
              className="f2s-drawer-wa-action"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
              </svg>
              <span>WhatsApp Helpline</span>
            </a>

            {currentUser && (
              <button
                type="button"
                className="f2s-drawer-signout-btn"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLogout(e);
                }}
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    )}
  </>
  );
};

export default Header;


