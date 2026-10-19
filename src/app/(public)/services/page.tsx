import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Essential Resident & Relocation Services | Find2Stay',
  description: 'Verified student meals, pure 20L RO water jar delivery, and reliable packers and movers across Noida and Delhi NCR.',
};

export default function ServicesHubPage() {
  const services = [
    {
      title: 'Daily Student & Executive Tiffin Service',
      description: 'Hygienic home-style meals with vegetarian & non-vegetarian subscription plans. Delivered hot right to your room or PG door.',
      icon: '🍱',
      href: '/services/food',
      features: ['Pure RO cooked food', 'Flexible daily/monthly plans', 'Cancel or pause meal anytime', 'Free delivery to your stay'],
      badge: 'Popular for Students',
    },
    {
      title: '20L Pure RO Drinking Water Delivery',
      description: 'Safe, sanitized, laboratory TDS-verified 20-litre sealed water jars delivered to your floor with doorstep placement.',
      icon: '💧',
      href: '/services/water',
      features: ['TDS 80-120 ppm guaranteed', 'Sealed ISI/FSSAI compliant jars', 'Same-day scheduled drop', 'Refill exchange subscription'],
      badge: 'Essential Daily Need',
    },
    {
      title: 'Verified Home & Student Room Shifting',
      description: 'Experienced local packers and movers. Transparent upfront quotes without hidden surge charges, with careful furniture handling.',
      icon: '📦',
      href: '/services/movers',
      features: ['Single room / 1BHK / 2BHK options', 'Free bubble & carton packing', 'Floor lift handling included', 'Zero transit damage pledge'],
      badge: 'Hassle-Free Move',
    },
  ];

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="hd">
            <div>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Everyday Resident Services
              </span>
              <h1 style={{ marginTop: '8px' }}>Relocation &amp; Stay Services</h1>
              <p>
                Everything you need for a comfortable stay after moving in. Verified local service providers with transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ maxWidth: '1080px', margin: '40px auto 80px', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {services.map((svc, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: '20px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(11,35,80,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '2.4rem' }}>{svc.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    {svc.badge}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 10px' }}>
                  {svc.title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 18px' }}>
                  {svc.description}
                </p>

                <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
                  {svc.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href={svc.href}
                  className="go"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                  }}
                >
                  Book Service →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
