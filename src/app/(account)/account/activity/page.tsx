import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const metadata = {
  title: 'My Activity & Requests | Find2Stay',
};

const FL = ['Requested', 'Confirming', 'Scheduled', 'Completed'];
const FC = ['Routing', 'Accepted', 'Done'];

export default async function UserActivityPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth?next=/account/activity');
  }

  const phone = user.phoneE164 || '';
  const displayName = user.displayName || `User (${phone.slice(-4)})`;
  const roles = user.roleAssignments || ['USER'];

  let enquiries: any[] = [];
  let services: any[] = [];

  try {
    const db = await getDb();
    const userId = new ObjectId(user._id);
    enquiries = await db
      .collection('enquiries')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    services = await db
      .collection('serviceConnections')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
  } catch {
    // In local dev without live Atlas, keep arrays empty gracefully
  }

  return (
    <>
      <section className="head">
        <div className="wrap">
          <h1>My Activity &amp; Requests</h1>
          <p>
            Track your scheduled property visits, callback status, and everyday relocation service connections.
          </p>
        </div>
      </section>

      <div className="wrap desk" style={{ marginTop: '24px', marginBottom: '80px', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)' }}>
        <aside>
          <small>Visitor Desk</small>
          <b>{displayName}</b>
          <p style={{ fontSize: '13px', color: '#BFD0FF', marginBottom: '18px' }}>
            {phone}
          </p>

          <nav>
            <Link href="/account/profile">
              👤 My Profile
            </Link>
            <Link href="/account/saved">
              ❤️ Saved Stays
            </Link>
            <Link href="/account/activity" style={{ color: '#9DB6FF', fontWeight: 700 }}>
              📋 Visits &amp; Requests
            </Link>
            <Link href="/pg">
              🔍 Browse Stays
            </Link>
            <Link href="/services/food">
              🍲 Relocation Services
            </Link>
            {roles.includes('OWNER') && (
              <Link href="/owner">
                🏡 Owner Workspace
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
          {/* Stats Bar */}
          <div className="stats" style={{ marginTop: 0, marginBottom: '28px' }}>
            <div>
              <b>{enquiries.length}</b>
              visits &amp; callbacks
            </div>
            <div>
              <b>{services.length}</b>
              service connections
            </div>
          </div>

          <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--navy)' }}>
            Property Visits &amp; Callbacks
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
