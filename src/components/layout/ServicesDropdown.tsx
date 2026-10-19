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
    desc: 'Hygienic daily home-style meals & trial tiffins',
  },
  {
    href: '/services/movers',
    icon: '🚚',
    label: 'Shifting Service',
    desc: 'Vetted packers & local relocation partners',
  },
  {
    href: '/services/water',
    icon: '💧',
    label: 'RO Water Delivery',
    desc: 'Sealed 20L pure drinking water jars',
  },
  {
    href: '/services',
    icon: '⚡',
    label: 'All Relocation Services',
    desc: 'Explore complete student & professional hub',
  },
];

export const ServicesDropdown: React.FC<ServicesDropdownProps> = ({ onNavigate, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isServicesActive = pathname.startsWith('/services');

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
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
          <span>Services</span>
          <span style={{ fontSize: '13px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div style={{ display: 'grid', gap: '8px', padding: '6px 0 12px 14px', background: '#f8fafc', borderRadius: '12px', marginTop: '4px' }}>
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
                  gap: '10px',
                  padding: '8px 10px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: pathname === s.href ? 700 : 500,
                  color: pathname === s.href ? 'var(--blue)' : 'var(--navy)',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <span>{s.label}</span>
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
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 0,
          cursor: 'pointer',
          padding: '6px 0',
          fontSize: '14px',
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
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            opacity: 0.7,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            width: '280px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--line, #cbd5e1)',
            boxShadow: '0 16px 36px -6px rgba(7, 27, 75, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            padding: '8px',
            zIndex: 9999,
            display: 'grid',
            gap: '4px',
          }}
        >
          {SERVICES.map((s) => {
            const active = pathname === s.href;
            return (
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
                  padding: '9px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  background: active ? '#eff6ff' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.35rem', flexShrink: 0 }}>{s.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: active ? 'var(--blue)' : 'var(--navy)', lineHeight: 1.2 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
