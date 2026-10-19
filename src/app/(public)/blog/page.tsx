import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Find2Stay Blog | Student & Working Professional Rental Guides',
  description: 'Verified insights, tenant rights, PG inspection checklists, and property owner guides for seamless renting.',
};

export default function BlogPage() {
  const articles = [
    {
      title: 'How Find2Stay Field Ops Audits PGs: The 180-Day Trust Protocol',
      category: 'Inspection & Trust',
      date: 'October 16, 2026',
      readTime: '4 min read',
      excerpt:
        'Discover how our trained ground teams verify electrical sub-meters, RO water filtration TDS levels, Wi-Fi latency, and room ventilation before granting the verified audit seal.',
      slug: 'how-find2stay-audits-pgs',
    },
    {
      title: 'Landlord Guide: 5 Ways to Attract Genuine Tenants & Reduce Vacancy',
      category: 'Owner Insights',
      date: 'October 12, 2026',
      readTime: '6 min read',
      excerpt:
        'High-resolution photos, upfront electricity disclosure, transparent security deposit terms, and verified QR listings significantly accelerate tenant occupancy in Delhi NCR and Noida.',
      slug: 'landlord-guide-reduce-vacancy',
    },
    {
      title: 'First-Time Renters Checklist: What to Check During an In-Person PG Visit',
      category: 'Tenant Guide',
      date: 'October 8, 2026',
      readTime: '5 min read',
      excerpt:
        'Never get surprised by unexpected utility bills or food cut-offs. Here is the exact checklist every student and working professional needs before paying a booking token.',
      slug: 'first-time-renters-checklist',
    },
  ];

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="hd">
            <div>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Find2Stay Knowledge Hub
              </span>
              <h1 style={{ marginTop: '8px' }}>Rental Guides &amp; Insights</h1>
              <p>
                Transparent, verified knowledge for students, working professionals, and property owners across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ maxWidth: '1080px', margin: '40px auto 80px', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {articles.map((art, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(11,35,80,0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>{art.readTime}</span>
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4, margin: '0 0 10px' }}>
                  {art.title}
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {art.excerpt}
                </p>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>{art.date}</span>
                <Link
                  href="/pg"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--blue)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Explore Stays →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          style={{
            marginTop: '48px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
              Have a PG or Flat to list?
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#334155', margin: 0 }}>
              Join thousands of verified owners and reach genuine tenants without brokerage commissions.
            </p>
          </div>
          <Link
            href="/list-your-property"
            className="go"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            🏡 List Your Property Now →
          </Link>
        </div>
      </div>
    </>
  );
}
