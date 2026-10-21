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

      {/* Desktop & Mobile Main Nav */}
      <nav id="mainnav" aria-label="Main" className={mobileMenuOpen ? 'open' : ''}>
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
                      onClick={() => {
                        setFindRoomDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
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
                      onClick={() => {
                        setFindRoomDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
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
                      onClick={() => {
                        setFindRoomDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
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
                      onClick={() => {
                        setFindRoomDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
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
                      onClick={() => {
                        setFindRoomDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
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
                        onClick={() => {
                          setFindRoomDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        📍 Sector 62 (Noida)
                      </Link>
                      <Link
                        href="/pg?q=Knowledge+Park"
                        className="f2s-hub-chip"
                        onClick={() => {
                          setFindRoomDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        📍 Knowledge Park
                      </Link>
                      <Link
                        href="/pg?q=Sector+15"
                        className="f2s-hub-chip"
                        onClick={() => {
                          setFindRoomDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        📍 Sector 15 (Metro)
                      </Link>
                      <Link
                        href="/pg?q=Botanical+Garden"
                        className="f2s-hub-chip"
                        onClick={() => {
                          setFindRoomDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
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
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{link.label}</span>
            </Link>
          );
        })}

        {/* Mobile-Only Drawer Actions */}
        <div className="mobile-only-drawer-actions">
          {isOps && (
            <Link
              href="/admin"
              className="mobile-drawer-pill admin-pill"
              onClick={() => setMobileMenuOpen(false)}
            >
              🛡️ Admin Desk
            </Link>
          )}

          {isOwner && !isOps && (
            <Link
              href="/owner"
              className="mobile-drawer-pill owner-pill"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏡 Owner Desk
            </Link>
          )}

          {currentUser && !isOps ? (
            <div className="mobile-drawer-user-row">
              <Link
                href={isOwner ? '/owner' : '/account/activity'}
                className="mobile-drawer-user-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 {currentUser.name || currentUser.phone || 'My Account'}
              </Link>
              <button
                type="button"
                className="mobile-drawer-logout"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLogout(e);
                }}
              >
                Sign out
              </button>
            </div>
          ) : !currentUser ? (
            <div className="mobile-drawer-auth-buttons">
              <Link
                href="/auth"
                className="f2s-btn-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '6px' }}>
                New user? Logging in creates your account automatically.
              </div>
            </div>
          ) : null}
        </div>
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
  );
};

export default Header;


