import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { memoryConnections } from '@/lib/memoryConnections';
import { memoryEnquiries } from '@/lib/memoryEnquiries';
import { memoryDrafts } from '@/lib/memoryDrafts';

export const metadata = {
  title: 'My Stays & Activity | Find2Stay',
};

const FL = ['Requested', 'Confirming', 'Scheduled', 'Completed'];
const FC = ['Routing', 'Accepted', 'Done'];

export default async function UserActivityPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth?next=/account/activity');
  }

  const phone = user.phoneE164 || '';
  const cleanPhone = phone.replace(/\D/g, '');
  const userPhoneClean = cleanPhone.slice(-10);
  const displayName = user.displayName || `User (${userPhoneClean.slice(-4) || '3210'})`;
  const roles = user.roleAssignments || ['USER'];

  let enquiries: any[] = [];
  let services: any[] = [];
  let bookings: any[] = [];

  try {
    const db = await getDb();
    const userId = new ObjectId(user._id);

    enquiries = await db
      .collection('enquiries')
      .find({
        $or: [{ userId }, { phone: { $regex: userPhoneClean } }],
      })
      .sort({ createdAt: -1 })
      .toArray();

    services = await db
      .collection('serviceConnections')
      .find({
        $or: [{ userId }, { phone: { $regex: userPhoneClean } }],
      })
      .sort({ createdAt: -1 })
      .toArray();

    bookings = await db
      .collection('bookings')
      .find({
        $or: [
          { userId },
          { tenantPhone: { $regex: userPhoneClean } },
          { phone: { $regex: userPhoneClean } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();
  } catch {
    // In local dev without live Atlas, keep arrays empty gracefully
  }

  // Cross-reference in-memory connections so relocation services never disappear
  for (const mc of memoryConnections) {
    const mcPhone = String(mc.phone || '').replace(/\D/g, '').slice(-10);
    const matchesUser =
      (userPhoneClean && mcPhone.includes(userPhoneClean)) ||
      (mc.userId && (mc.userId.toString() === user._id?.toString() || mc.userId === user._id?.toString()));
    if (matchesUser) {
      if (!services.some((s) => s.requestId === mc.requestId || s._id?.toString() === mc._id?.toString())) {
        services.unshift(mc);
      }
    }
  }

  // Cross-reference in-memory enquiries so visits never disappear
  for (const me of memoryEnquiries) {
    const mePhone = String(me.phone || '').replace(/\D/g, '').slice(-10);
    const matchesUser =
      (userPhoneClean && mePhone.includes(userPhoneClean)) ||
      (me.userId && (me.userId.toString() === user._id?.toString() || me.userId === user._id?.toString()));
    if (matchesUser) {
      if (!enquiries.some((e) => e.requestId === me.requestId || e._id?.toString() === me._id?.toString())) {
        enquiries.unshift(me);
      }
    }
  }

  // Check if user has listed properties (from memoryDrafts or DB)
  const userDrafts = memoryDrafts.filter((d) => {
    const dPhone = String(d.phone || '').replace(/\D/g, '').slice(-10);
    return (userPhoneClean && dPhone.includes(userPhoneClean)) || (d.ownerId && d.ownerId === user._id?.toString());
  });

  const isOwner = roles.includes('OWNER') || userDrafts.length > 0;
  const confirmedStays = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'ACTIVE' || b.status === 'RENTED');

  return (
    <>
      <section className="head">
        <div className="wrap">
          <h1>Tenant &amp; Resident Workspace</h1>
          <p>
            Track your rented accommodations, scheduled on-site visits, and everyday relocation service orders.
          </p>
        </div>
      </section>

      <div className="wrap desk" style={{ marginTop: '24px', marginBottom: '80px', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)' }}>
        <aside>
          <small>Tenant &amp; Resident Desk</small>
          <b>{displayName}</b>
          <p style={{ fontSize: '13px', color: '#BFD0FF', marginBottom: '18px' }}>
            {phone}
          </p>

          <nav>
            <Link href="/account/profile">
              👤 My Profile
            </Link>
            <Link href="/account/activity" style={{ color: '#9DB6FF', fontWeight: 700 }}>
              📋 Rented Stays &amp; Visits
            </Link>
            <Link href="/account/saved">
              ❤️ Saved Stays
            </Link>
            <Link href="/pg">
              🔍 Browse Stays
            </Link>
            <Link href="/services/food">
              🍲 Relocation Services
            </Link>

            {/* High-visibility Landlord Workspace Switcher */}
            {isOwner ? (
              <Link
                href="/owner"
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  margin: '12px 0 4px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                <span>🏡 Landlord Portal</span>
                <span style={{ fontSize: '10.5px', background: 'rgba(255,255,255,0.25)', color: '#ffffff', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  {userDrafts.length} Listed
                </span>
              </Link>
            ) : (
              <Link
                href="/list-your-property"
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  margin: '12px 0 4px',
                  textDecoration: 'none',
                }}
              >
                <span>🏡 List a Property</span>
                <span style={{ fontSize: '10.5px', background: 'rgba(255,255,255,0.25)', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                  Free
                </span>
              </Link>
            )}

            {roles.includes('OPS') && (
              <Link href="/admin">
                ⚙️ Operations Desk
              </Link>
            )}
          </nav>

          <a className="out" href="/api/auth/logout">
            Sign out
          </a>
        </aside>

        <div>
          {/* Top Workspace Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#e2e8f0', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
            <div
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                background: 'var(--blue)',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(22,72,232,0.3)',
              }}
            >
              👤 Tenant Desk (My Stays &amp; Visits)
            </div>
            <Link
              href="/owner"
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                background: 'transparent',
                color: 'var(--mut)',
              }}
            >
              🏡 Landlord Portal ({userDrafts.length > 0 ? `${userDrafts.length} Listed` : 'List Property'}) →
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="stats" style={{ marginTop: 0, marginBottom: '28px' }}>
            <div>
              <b>{confirmedStays.length}</b>
              rented stays
            </div>
            <div>
              <b>{enquiries.length}</b>
              visits &amp; callbacks
            </div>
            <div>
              <b>{services.length}</b>
              service orders
            </div>
          </div>

          {/* 1. Track Rented & Confirmed Accommodations */}
          <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--navy)' }}>
            🏡 My Rented Stays &amp; Active Stays
          </h2>

          {confirmedStays.length === 0 ? (
            <div className="panel" style={{ padding: '28px 24px', borderRadius: '16px', marginBottom: '32px', background: '#f8fafc', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '2.4rem' }}>🏠</div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                    No Active Rented Stay Registered
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: 0, lineHeight: 1.5 }}>
                    When you reserve a verified PG bed or flat on Find2Stay, your verified digital pass, rent due dates, landlord contact details, and move-in inspection reports will appear right here.
                  </p>
                </div>
                <Link href="/pg" className="go" style={{ borderRadius: '10px', padding: '9px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Find a Stay
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px', marginBottom: '32px' }}>
              {confirmedStays.map((stay) => (
                <div
                  key={stay._id.toString()}
                  style={{
                    background: '#ffffff',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1.5px solid #a7f3d0',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', textTransform: 'uppercase' }}>
                        ● Active Resident
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px' }}>
                        {stay.listingTitle || stay.propertyTitle || 'Verified Stay'}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--mut)' }}>
                        📍 {stay.locality || stay.address || 'Verified Locality'} · Unit / Room: <strong>{stay.roomNumber || 'Room A-102'}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>
                        ₹{Number(stay.rent || 8500).toLocaleString('en-IN')}<small style={{ fontSize: '0.75rem', color: 'var(--mut)' }}>/mo</small>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                        Move-in: {stay.moveInDate ? new Date(stay.moveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    {stay.ownerPhone && (
                      <a
                        href={`tel:${stay.ownerPhone}`}
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 700,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#f0fdf4',
                          border: '1px solid #86efac',
                          color: '#166534',
                          textDecoration: 'none',
                        }}
                      >
                        📞 Call Landlord ({stay.ownerPhone})
                      </a>
                    )}
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      🛡️ 180-Day Audited Premises · Wi-Fi &amp; RO Covered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Track Property Visits & Callbacks */}
          <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--navy)' }}>
            📅 Property Visits &amp; Callbacks
          </h2>

          {enquiries.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center', padding: '36px 20px', borderRadius: '14px', marginBottom: '32px' }}>
              <p style={{ color: 'var(--mut)', marginBottom: '14px' }}>
                You have not requested any property visits or callbacks yet.
              </p>
              <Link href="/pg" className="go" style={{ borderRadius: '999px', padding: '10px 22px', fontSize: '13.5px' }}>
                Browse Verified Stays
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
              {enquiries.map((enq) => {
                const stepIdx = FL.indexOf(enq.state || 'Requested');
                return (
                  <div key={enq._id.toString()} className="logrow" style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                    <span>
                      <strong>{enq.listingTitle || 'Accommodation Inquiry'}</strong>
                      <small>
                        {enq.kind} · Ref: {enq.requestId} · {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </small>
                    </span>

                    <span className="trk" title={enq.state}>
                      {FL.map((st, i) => (
                        <i key={st} className={stepIdx >= i ? 'on' : ''} />
                      ))}
                    </span>

                    <em>{enq.state}</em>
                  </div>
                );
              })}
            </div>
          )}

          <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--navy)' }}>
            Everyday Relocation Services
          </h2>

          {services.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center', padding: '36px 20px', borderRadius: '14px' }}>
              <p style={{ color: 'var(--mut)', marginBottom: '14px' }}>
                No active shifting, tiffin, or RO water delivery requests.
              </p>
              <Link href="/services/food" className="go light bd" style={{ borderRadius: '999px', padding: '10px 22px', fontSize: '13.5px' }}>
                Explore Relocation Services
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {services.map((svc) => {
                const stepIdx = FC.indexOf(svc.state || 'Routing');
                return (
                  <div key={svc._id.toString()} className="logrow" style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                    <span>
                      <strong>{svc.serviceType} Connection</strong>
                      <small>
                        Ref: {svc.requestId} · {new Date(svc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </small>
                    </span>

                    <span className="trk" title={svc.state}>
                      {FC.map((st, i) => (
                        <i key={st} className={stepIdx >= i ? 'on' : ''} />
                      ))}
                    </span>

                    <em>{svc.state}</em>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
