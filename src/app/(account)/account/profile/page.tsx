import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { memoryDrafts } from '@/lib/memoryDrafts';
import { ProfileEditor } from '@/components/account/ProfileEditor';

export const metadata = {
  title: 'My Profile | Find2Stay',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth?next=/account/profile');
  }

  const roles = user.roleAssignments || ['USER'];
  if (roles.some((r: string) => ['ADMIN', 'OPERATIONS', 'SUPER_ADMIN'].includes(r))) {
    redirect('/admin');
  }

  const phone = user.phoneE164 || '';
  const displayName = user.displayName || `User (${phone.slice(-4)})`;
  const email = user.email || '';

  // Query user's listed properties
  let userListings: any[] = [];
  const cleanPhone = phone.replace(/\D/g, '');
  const clean10 = cleanPhone.slice(-10);

  try {
    const db = await getDb();
    const dbDrafts = await db
      .collection('drafts')
      .find({
        $or: [
          { ownerId: user._id?.toString() },
          { phone: { $regex: clean10 } },
          { ownerPhone: { $regex: clean10 } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    userListings = dbDrafts;
  } catch {
    // DB offline fallback
  }

  // Cross-reference in-memory drafts
  for (const md of memoryDrafts) {
    if (
      (md.phone && md.phone.includes(clean10)) ||
      (md.ownerId && md.ownerId === user._id?.toString())
    ) {
      if (!userListings.some((l) => l._id?.toString() === md._id?.toString())) {
        userListings.unshift(md);
      }
    }
  }

  const isOwner = roles.includes('OWNER') || userListings.length > 0;
  const isStaff = roles.some((r: string) => ['ADMIN', 'OPERATIONS', 'OPS', 'SUPER_ADMIN'].includes(r));

  return (
    <>
      <section className="head">
        <div className="wrap">
          <h1>My Account &amp; Profile</h1>
          <p>
            Manage your personal profile, contact information, and verified stays.
          </p>
        </div>
      </section>

      <div className="wrap desk" style={{ marginTop: '24px', marginBottom: '80px', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)' }}>
        <aside>
          <small>Verified Account</small>
          <b>{displayName}</b>
          <p style={{ fontSize: '13px', color: '#BFD0FF', marginBottom: '18px' }}>
            {phone}
          </p>

          <nav>
            <Link href="/account/profile" style={{ color: '#9DB6FF', fontWeight: 700 }}>
              👤 My Profile
            </Link>
            <Link href="/account/saved">
              ❤️ Saved Stays
            </Link>
            <Link href="/account/activity">
              📋 Rented Stays &amp; Visits
            </Link>
            <Link href="/pg">
              🔍 Browse Stays
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
                  {userListings.length} Listed
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

            {isStaff && (
              <Link href="/admin" style={{ color: '#93C5FD', fontWeight: 600 }}>
                🛡️ Operations Desk
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
              🏡 Landlord Portal ({userListings.length > 0 ? `${userListings.length} Listed` : 'List Property'}) →
            </Link>
          </div>

          {/* Identity & Verification Card */}
          <div className="panel" style={{ borderRadius: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '12.5px', marginBottom: '8px' }}>
                  ✓ Mobile Number Verified
                </span>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--navy)' }}>
                  {phone}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--mut)', marginTop: '4px' }}>
                  Protected by 256-bit encrypted session authentication.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'var(--mut)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  Account Status
                </span>
                <strong style={{ fontSize: '15px', color: isOwner ? '#059669' : 'var(--navy)' }}>
                  {isOwner ? 'Verified Host / Owner' : 'Verified Resident'}
                </strong>
              </div>
            </div>
          </div>

          {/* ── Dedicated Property Owner Section ──────────────────────── */}
          <div className="panel" style={{ borderRadius: '14px', marginBottom: '24px', border: isOwner ? '1.5px solid #A7F3D0' : '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                  🏡 {isOwner ? 'Your Listed Properties & Owner Desk' : 'Own a PG, Hostel, or Rental Home?'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--mut)', margin: '4px 0 0' }}>
                  {isOwner
                    ? `You have ${userListings.length} property listed on Find2Stay. Track audits and room availability.`
                    : 'List your property for free. Our team conducts on-site verification and connects you with verified tenants.'}
                </p>
              </div>

              <div>
                {isOwner ? (
                  <Link
                    href="/owner"
                    className="go"
                    style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}
                  >
                    Open Owner Dashboard →
                  </Link>
                ) : (
                  <Link
                    href="/list-your-property"
                    className="go"
                    style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}
                  >
                    List Your Property →
                  </Link>
                )}
              </div>
            </div>

            {/* If user has listings, preview them right on their profile */}
            {userListings.length > 0 && (
              <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                {userListings.map((l, idx) => (
                  <div
                    key={l._id?.toString() || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      padding: '12px 14px',
                      background: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '14.5px', color: 'var(--navy)' }}>
                        {l.title || 'Untitled Property'}
                      </strong>
                      <span style={{ fontSize: '12.5px', color: 'var(--mut)', marginLeft: '8px' }}>
                        · {l.locality || 'City'} ({l.type || 'PG'})
                      </span>
                      <div style={{ fontSize: '12px', color: 'var(--mut)', marginTop: '2px' }}>
                        Rent: ₹{Number(l.rent || 0).toLocaleString('en-IN')}/mo
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: l.status === 'VERIFIED' ? '#DCFCE7' : '#FEF3C7',
                          color: l.status === 'VERIFIED' ? '#15803D' : '#B45309',
                        }}
                      >
                        {l.status === 'VERIFIED' ? '✓ Verified' : 'Audit Pending'}
                      </span>
                      <Link
                        href="/owner"
                        style={{ fontSize: '12.5px', color: 'var(--blue)', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Editor Component */}
          <ProfileEditor
            initialName={displayName}
            initialEmail={email}
            phone={phone}
          />
        </div>
      </div>
    </>
  );
}
