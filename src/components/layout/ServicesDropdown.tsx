'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ServicesDropdownProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

const SERVICES = [
  {
    href: '/services/food',
    icon: '🍱',
    label: 'Tiffin Service',
    badge: 'Meals & Food',
    desc: 'Hygienic daily home-style meals & trial tiffins',
    bg: '#fff7ed',
    border: '#fed7aa',
    color: '#c2410c',
  },
  {
    href: '/services/movers',
    icon: '🚚',
    label: 'Shifting Service',
    badge: 'Packers & Movers',
    desc: 'Vetted packers & local relocation partners',
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#1d4ed8',
  },
  {
    href: '/services/water',
    icon: '💧',
    label: 'RO Water Delivery',
    badge: 'Pure Drinking Water',
    desc: 'Sealed 20L pure drinking water jars',
    bg: '#ecfeff',
    border: '#a5f3fc',
    color: '#0e7490',
  },
  {
    href: '/services',
    icon: '⚡',
    label: 'All Relocation Services',
    badge: 'One-Stop Hub',
    desc: 'Explore complete student & professional hub',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    color: '#6d28d9',
    isHub: true,
  },
];

export const ServicesDropdown: React.FC<ServicesDropdownProps> = ({ onNavigate, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const isServicesActive = pathname.startsWith('/services');

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isMobile) {
    return (
      <div style={{ borderBottom: '1px solid var(--line)', padding: '6px 0' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 0,
            padding: '10px 0',
            fontSize: '17px',
            fontWeight: isServicesActive ? 700 : 500,
            color: isServicesActive ? 'var(--blue)' : 'var(--navy)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>🛠️</span>
            <span>Services</span>
          </span>
          <span style={{ fontSize: '13px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div style={{ display: 'grid', gap: '8px', padding: '10px', background: '#f8fafc', borderRadius: '14px', marginTop: '4px', border: '1px solid #e2e8f0' }}>
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  background: pathname === s.href ? '#eff6ff' : '#ffffff',
                  border: `1px solid ${pathname === s.href ? '#bfdbfe' : '#e2e8f0'}`,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: pathname === s.href ? 'var(--blue)' : 'var(--navy)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px' }}>
                    {s.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      <button
        type="button"
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 0,
          cursor: 'pointer',
          padding: '6px 4px',
          fontSize: '13.5px',
          fontWeight: isServicesActive ? 700 : 500,
          color: isServicesActive ? 'var(--blue)' : 'var(--mut)',
          borderBottom: isServicesActive ? '2px solid var(--blue)' : '2px solid transparent',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
          transition: 'color 0.15s ease',
        }}
      >
        <span>Services</span>
        <svg
          viewBox="0 0 24 24"
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            opacity: 0.7,
            marginLeft: '2px',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingTop: '10px',
            zIndex: 99999,
          }}
        >
          {/* Top Pointer Triangle */}
          <div
            style={{
              position: 'absolute',
              top: '5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '10px',
              height: '10px',
              background: '#ffffff',
              borderLeft: '1px solid #cbd5e1',
              borderTop: '1px solid #cbd5e1',
              zIndex: 100000,
            }}
          />

          <div
            style={{
              width: '310px',
              background: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 45px -8px rgba(7, 27, 75, 0.2), 0 0 0 1px rgba(7, 27, 75, 0.04)',
              padding: '8px',
              display: 'grid',
              gap: '4px',
              position: 'relative',
              zIndex: 99999,
            }}
          >
            {SERVICES.map((s) => {
              const active = pathname === s.href;
              return (
                <React.Fragment key={s.href}>
                  {s.isHub && (
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 6px' }} />
                  )}
                  <Link
                    href={s.href}
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate?.();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      background: active ? '#eff6ff' : 'transparent',
                      transition: 'background 0.15s ease, transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: active ? 'var(--blue)' : 'var(--navy)', lineHeight: 1.2 }}>
                          {s.label}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--mut)', opacity: 0.6 }}>→</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.desc}
                      </div>
                    </div>
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
