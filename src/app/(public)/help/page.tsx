'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  q: string;
  a: string;
  cat: 'stays' | 'verification' | 'services' | 'trust';
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Do I pay any fees to search or request an in-person room visit?',
    a: 'No. Searching properties, viewing transparent price breakdowns, requesting callbacks, and scheduling physical in-person visits on Find2Stay are 100% free for all students, scholars, and working professionals. We charge ₹0 brokerage.',
    cat: 'stays',
    tag: 'Free Stays',
  },
  {
    q: 'Who sees my mobile number when I schedule a visit or request a callback?',
    a: 'Only Find2Stay operations and the verified landlord or caretaker handling your specific appointment. We never sell mobile numbers, share records with third-party telemarketers, or spam you with unwanted ads.',
    cat: 'trust',
    tag: 'Privacy & Safety',
  },
  {
    q: 'Do you collect online rent or advance booking tokens on Find2Stay?',
    a: 'In Phase 1, Find2Stay operates strictly as a discovery and physical coordination marketplace. We do not collect online rent, advance token payments, or security deposits. You inspect the room in person, verify facilities with your own eyes, and pay the owner directly after signing your rental agreement.',
    cat: 'stays',
    tag: 'Rent & Payments',
  },
  {
    q: 'How does physical on-site verification work?',
    a: 'Our field operations team visits the physical premises in person. We test running water and power backups, inspect individual sub-meters, check biometric locks and CCTV, take authentic unfiltered photos, and verify authorized ownership. Each audit is valid for 180 days with mandatory 14-day availability renewals.',
    cat: 'verification',
    tag: 'Audit Process',
  },
  {
    q: 'What if a property looks different from photos or the owner asks for higher rent?',
    a: 'Report the listing immediately using the "Report Inaccurate Stay" link or email complaints@find2stay.in. Every published stay on Find2Stay is bound to a verified revision timestamp. If an owner violates verified rental terms or fails to honor quoted rent, we pause or revoke their listing immediately.',
    cat: 'trust',
    tag: 'Dispute & Guarantee',
  },
  {
    q: 'How do student meal (tiffin) and RO drinking water subscriptions work?',
    a: 'When you submit a service request, our operations desk routes your requirement directly to a verified local provider serving your exact pin code. The provider calls you to confirm trial meal deliveries or 20L water jar timings. You only pay the provider after your trial.',
    cat: 'services',
    tag: 'Services',
  },
  {
    q: 'Can owners list their property for free? How long does moderation take?',
    a: 'Yes, listing your property on Find2Stay is completely free. After you submit your draft via the "For Owners" portal, our operations team reviews your draft details within 24 hours and coordinates a physical field audit before granting the official Find2Stay Verified seal.',
    cat: 'verification',
    tag: 'For Owners',
  },
  {
    q: 'How does home shifting & packing coordination work?',
    a: 'Submit your pick-up locality, destination area, and shifting date. Our partner team reviews vehicle access, inventory size (single room, 1BHK, or family), and dispatches verified local movers with upfront transparent pricing.',
    cat: 'services',
    tag: 'Shifting',
  },
];

export default function HelpPage() {
  const [activeCat, setActiveCat] = useState<'all' | 'stays' | 'verification' | 'services' | 'trust'>('all');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = activeCat === 'all' || faq.cat === activeCat;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase()) ||
      faq.tag.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="hd">
            <div>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Support Center &amp; Help Desk
              </span>
              <h1 style={{ marginTop: '8px' }}>How can we help you?</h1>
              <p>
                Clear answers regarding search, visit coordination, verified audits, shifting, tiffin delivery, and tenant safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ maxWidth: '980px', margin: '32px auto 80px', padding: '0 16px' }}>
        {/* Search Input Bar */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#94a3b8' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search questions (e.g. rent, visit fees, verification, tiffin, dispute)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 48px',
              borderRadius: '16px',
              border: '1.5px solid var(--line)',
              background: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 4px 14px rgba(11, 35, 80, 0.04)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'stays', label: 'Stays & Rooms' },
            { id: 'verification', label: 'Physical Verification' },
            { id: 'services', label: 'Tiffin & Shifting' },
            { id: 'trust', label: 'Trust & Safety' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: activeCat === c.id ? '1.5px solid var(--bl)' : '1px solid var(--line)',
                background: activeCat === c.id ? '#EFF6FF' : '#ffffff',
                color: activeCat === c.id ? 'var(--bl)' : 'var(--navy)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: isOpen ? '1.5px solid #BFDBFE' : '1px solid var(--line)',
                  borderRadius: '16px',
                  boxShadow: isOpen ? '0 8px 24px -8px rgba(29, 91, 216, 0.12)' : '0 2px 6px rgba(11, 35, 80, 0.03)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#F1F5F9',
                        color: '#475569',
                      }}
                    >
                      {faq.tag}
                    </span>
                    <strong style={{ fontSize: '1rem', color: 'var(--navy)', fontWeight: 700 }}>
                      {faq.q}
                    </strong>
                  </div>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isOpen ? '#EFF6FF' : '#F8FAFC',
                      color: isOpen ? 'var(--bl)' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 18px 20px',
                      fontSize: '0.92rem',
                      color: '#334155',
                      lineHeight: 1.65,
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '14px',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px', background: '#fff', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔎</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
                No matching answers found
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 16px' }}>
                Try searching with another keyword or contact our support desk directly.
              </p>
              <button
                type="button"
                className="go"
                onClick={() => setSearch('')}
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Direct Contact & Support Channels */}
        <div
          style={{
            marginTop: '36px',
            padding: '28px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0B2350 0%, #1D5BD8 100%)',
            color: '#ffffff',
            boxShadow: '0 16px 40px -10px rgba(11, 35, 80, 0.25)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Human Assistance
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '8px 0 6px', color: '#fff' }}>
              Still have questions or facing an issue?
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#DBEAFE', lineHeight: 1.6, margin: '0 0 20px' }}>
              Our local field operations and support coordinators in Noida &amp; Delhi NCR are active Monday through Saturday (9:00 AM – 8:00 PM) to help you resolve landlord disputes or coordinate inspections.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: '#ffffff',
                color: 'var(--navy)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
            >
              💬 Submit Support Request
            </Link>

            <a
              href="mailto:complaints@find2stay.in"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              ✉️ Email Complaints Desk
            </a>

            <Link
              href="/list-your-property"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'rgba(255,122,26,0.9)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              🏡 Landlord Portal →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
