import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { memoryDrafts } from '@/lib/memoryDrafts';
import { OwnerAvailabilityToggle } from '@/components/owner/OwnerAvailabilityToggle';
import { OwnerPhotoUploader } from '@/components/owner/OwnerPhotoUploader';

export const metadata = {
  title: 'Owner Workspace & Dashboard | Find2Stay',
  description: 'Manage your verified properties, monitor physical inspection audits, and handle student visit requests.',
};

export const dynamic = 'force-dynamic';

export default async function OwnerDashboardPage() {
  const session = await getSession();
  if (!session.userId) {
    redirect('/auth?next=/owner');
  }

  const user = await getCurrentUser();
  const phone = session.phone || user?.phoneE164 || '';
  const cleanPhone = phone.replace(/\D/g, '');

  let myDrafts: any[] = [];
  let myEnquiries: any[] = [];

  // 1. Fetch from memoryDrafts
  const memMatches = memoryDrafts.filter(
    (d) =>
      (d.phone && d.phone.replace(/\D/g, '').includes(cleanPhone.slice(-10))) ||
      d.ownerId === session.userId
  );

  myDrafts = [...memMatches];

  // 2. Fetch from MongoDB if available
  try {
    const db = await getDb();
    const dbDrafts = await db
      .collection('drafts')
      .find({
        $or: [
          { ownerId: session.userId },
          { phone: { $regex: cleanPhone.slice(-10) } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    for (const d of dbDrafts) {
      if (!myDrafts.some((m) => m._id?.toString() === d._id?.toString())) {
        myDrafts.push(d);
      }
    }

    // Also get enquiries for these properties
    const propertyTitles = myDrafts.map((d) => d.title).filter(Boolean);
    if (propertyTitles.length > 0) {
      myEnquiries = await db
        .collection('enquiries')
        .find({ listingTitle: { $in: propertyTitles } })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
    }
  } catch (err) {
    console.warn('[owner/dashboard] DB query offline, using memory queue:', err);
  }

  // If no drafts submitted yet, provide a demo pending entry so the owner sees the working dashboard
  if (myDrafts.length === 0) {
    myDrafts = [
      {
        _id: 'draft_demo',
        title: 'Aura Executive PG (Sample Preview)',
        locality: 'Sector 62, Noida',
        type: 'PG',
        gender: 'boys',
        occupancy: 'single',
        rent: 8500,
        status: 'SUBMITTED',
        createdAt: new Date(),
      },
    ];
  }

  const activeStaysCount = myDrafts.filter((d) => d.status === 'PUBLISHED').length;
  const pendingAuditsCount = myDrafts.filter((d) => d.status === 'SUBMITTED' || d.status === 'INSPECTION_SCHEDULED').length;

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Owner &amp; Landlord Workspace
              </span>
              <h1 style={{ marginTop: '8px' }}>Property Management Desk</h1>
              <p>
                Welcome back, <strong>{session.name || user?.displayName || 'Property Owner'}</strong> ({phone}). Manage your listings, availability, and tenant visit schedules.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                href="/list-your-property"
                className="go"
                style={{ padding: '10px 18px', fontSize: '0.88rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>+</span> List Another Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ maxWidth: '1140px', margin: '30px auto 80px', padding: '0 16px' }}>
        {/* KPI Counter Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase' }}>Total Properties</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', marginTop: '4px' }}>{myDrafts.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px' }}>● Zero brokerage platform</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase' }}>Verified &amp; Live</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', marginTop: '4px' }}>{activeStaysCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mut)', marginTop: '4px' }}>180-Day audit seal active</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase' }}>Audits in Progress</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>{pendingAuditsCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mut)', marginTop: '4px' }}>Operations field verification</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mut)', textTransform: 'uppercase' }}>Tenant Inquiries</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{myEnquiries.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>Direct phone verified leads</div>
          </div>
        </div>

        {/* Section 1: My Properties & Stays */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', padding: '26px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                My Registered Stays &amp; Listings
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '4px 0 0' }}>
                Track verification progress, adjust monthly rent, and toggle vacancy status.
              </p>
            </div>
            <Link href="/list-your-property" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)' }}>
              + Add Property →
            </Link>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {myDrafts.map((draft, idx) => {
              const isPublished = draft.status === 'PUBLISHED';
              const isScheduled = draft.status === 'INSPECTION_SCHEDULED';

              return (
                <div
                  key={draft._id?.toString() || idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  {draft.photos && draft.photos.length > 0 && (
                    <div style={{ width: '80px', height: '62px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          background: isPublished ? '#dcfce7' : isScheduled ? '#fef3c7' : '#eff6ff',
                          color: isPublished ? '#166534' : isScheduled ? '#b45309' : '#1d4ed8',
                        }}
                      >
                        {isPublished ? '✓ Verified & Live' : isScheduled ? '⏳ Audit Scheduled' : '● Submitted For Review'}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--navy)' }}>
                        {draft.title}
                      </strong>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      📍 {draft.locality || 'Noida'} · {draft.type} · Rent: <strong style={{ color: '#0f172a' }}>₹{Number(draft.rent).toLocaleString('en-IN')}/mo</strong>
                    </div>

                    {isPublished && (
                      <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px' }}>
                        🛡️ 180-Day on-site audit active. Verified sub-meter and amenities confirmed.
                      </div>
                    )}
                    {!isPublished && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        📋 Our Noida &amp; Delhi NCR operations specialist will call you at <strong>{phone}</strong> to coordinate your on-site room check.
                      </div>
                    )}

                    <OwnerPhotoUploader
                      draftId={draft._id?.toString() || 'draft_demo'}
                      initialPhotos={draft.photos || []}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <OwnerAvailabilityToggle
                      draftId={draft._id?.toString() || 'draft_demo'}
                      initialStatus={draft.availabilityStatus || 'AVAILABLE'}
                    />

                    <Link
                      href={isPublished ? `/listing/stay_${(draft.locality || 'noida').toLowerCase().replace(/[^a-z0-9]/g, '-')}_${draft._id.toString().slice(-5)}` : '/how-verification-works'}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--blue)',
                        background: 'var(--blue)',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {isPublished ? 'View Live Stay →' : 'Audit Details →'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Tenant Visit & Callback Inquiries */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', padding: '26px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px' }}>
            Student &amp; Seeker Inquiries
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
            In-person visits and callback requests confirmed by Find2Stay Operations.
          </p>

          {myEnquiries.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {myEnquiries.map((enq, idx) => (
                <div
                  key={enq._id?.toString() || idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>{enq.name}</strong> ({enq.phone})
                    <div style={{ fontSize: '0.8rem', color: 'var(--mut)', marginTop: '2px' }}>
                      Property: {enq.listingTitle} · Requested Slot: {enq.preferredSlot || 'Flexible'}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: '#dcfce7', color: '#166534' }}>
                    {enq.state || 'CONFIRMED'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📬</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
                No Direct Inquiries Yet
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--mut)', margin: 0 }}>
                Once your property finishes the on-site physical inspection, verified student inquiries will appear here in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
