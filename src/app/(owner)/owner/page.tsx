import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { memoryDrafts } from '@/lib/memoryDrafts';
import { OwnerDashboardClient } from '@/components/owner/OwnerDashboardClient';

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
      if (!myDrafts.some((m) => m._id?.toString() === d._id?.toString() || m.propertyId === d.propertyId)) {
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
        .limit(15)
        .toArray();
    }
  } catch (err) {
    console.warn('[owner/dashboard] DB query offline, using memory queue:', err);
  }

  // If no drafts submitted yet, provide a demo verified listing and pending entry so the owner sees the working dashboard
  if (myDrafts.length === 0) {
    myDrafts = [
      {
        _id: 'draft_demo_live',
        propertyId: 'F2S-NOI-84920',
        title: 'Aura Executive PG & Co-Living',
        locality: 'Sector 62',
        city: 'Noida',
        type: 'PG',
        gender: 'boys',
        occupancy: 'single',
        sharing: 'Single',
        rent: 8500,
        deposit: 8500,
        status: 'PUBLISHED',
        isVerified: true,
        availabilityStatus: 'AVAILABLE',
        availableRooms: 3,
        totalRooms: 12,
        electricityBasis: 'METERED',
        createdAt: new Date(),
      },
      {
        _id: 'draft_demo_pending',
        propertyId: 'F2S-NOI-12903',
        title: 'Silicon City 2BHK High-Rise',
        locality: 'Sector 76',
        city: 'Noida',
        type: 'Flat',
        gender: 'any',
        occupancy: 'family',
        rent: 24000,
        deposit: 24000,
        status: 'INSPECTION_SCHEDULED',
        isVerified: false,
        availabilityStatus: 'AVAILABLE',
        availableRooms: 1,
        totalRooms: 1,
        electricityBasis: 'INCLUDED',
        createdAt: new Date(),
      },
    ];
  }

  // Serialize drafts for client component
  const serializedDrafts = myDrafts.map((d) => ({
    _id: d._id?.toString() || Math.random().toString(),
    propertyId: d.propertyId || `F2S-NOI-${d._id?.toString().slice(-5)}`,
    title: d.title || 'Untitled Property',
    locality: d.locality || 'Noida',
    city: d.city || 'Noida',
    type: d.type || 'PG',
    gender: d.gender || 'any',
    occupancy: d.occupancy || 'single',
    sharing: d.sharing || 'Single',
    bhk: d.bhk || '1 BHK',
    rent: Number(d.rent) || 0,
    deposit: Number(d.deposit) || Number(d.rent) || 0,
    availableRooms: Number(d.availableRooms) || 1,
    totalRooms: Number(d.totalRooms) || 1,
    electricityBasis: d.electricityBasis || 'METERED',
    photos: Array.isArray(d.photos) ? d.photos : [],
    status: d.status || 'SUBMITTED',
    isVerified: !!d.isVerified || d.status === 'PUBLISHED',
    availabilityStatus: d.availabilityStatus || 'AVAILABLE',
    createdAt: d.createdAt ? d.createdAt.toString() : new Date().toISOString(),
  }));

  const serializedEnquiries = myEnquiries.map((e) => ({
    _id: e._id?.toString() || Math.random().toString(),
    name: e.name || 'Tenant Seeker',
    phone: e.phone || '',
    listingTitle: e.listingTitle || 'Accommodation Inquiry',
    preferredSlot: e.preferredSlot || e.scheduledSlot || 'Flexible',
    state: e.state || 'CONFIRMED',
    createdAt: e.createdAt ? e.createdAt.toString() : new Date().toISOString(),
  }));

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Owner &amp; Partner Desk
              </span>
              <h1 style={{ marginTop: '8px' }}>Property Management Workspace</h1>
              <p>
                Welcome back, <strong>{session.name || user?.displayName || 'Property Owner'}</strong> ({phone}). Manage live availability, edit listings, and download Verified QR codes.
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
        <OwnerDashboardClient
          initialDrafts={serializedDrafts}
          initialEnquiries={serializedEnquiries}
          userPhone={phone}
          userName={session.name || user?.displayName || 'Property Owner'}
        />

        {/* Section 2: Tenant Visit & Callback Inquiries */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', padding: '26px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px' }}>
            Student &amp; Seeker Inquiries
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
            In-person visits and callback requests confirmed by Find2Stay Operations.
          </p>

          {serializedEnquiries.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {serializedEnquiries.map((enq, idx) => (
                <div
                  key={enq._id || idx}
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
                      Property: <strong>{enq.listingTitle}</strong> · Requested Slot: {enq.preferredSlot}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: '#dcfce7', color: '#166534' }}>
                    {enq.state}
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
