import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AdminDraftQueue } from '@/components/admin/AdminDraftQueue';
import { AdminEnquiryQueue } from '@/components/admin/AdminEnquiryQueue';
import { AdminServiceQueue } from '@/components/admin/AdminServiceQueue';
import { memoryDrafts } from '@/lib/memoryDrafts';
import { memoryConnections } from '@/lib/memoryConnections';

export const metadata = {
  title: 'Operations Desk | Find2Stay',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminOpsPage() {
  const session = await getSession();
  const roles = session.roles || [];
  const isStaff = roles.some((r) => ['OPERATIONS', 'ADMIN', 'SUPER_ADMIN', 'VERIFIER'].includes(r));

  if (!isStaff) {
    redirect('/admin/login');
  }

  let enquiries: any[] = [];
  let services: any[] = [];
  let drafts: any[] = [];
  let messages: any[] = [];

  try {
    const db = await getDb();
    [enquiries, services, drafts, messages] = await Promise.all([
      db.collection('enquiries').find().sort({ createdAt: -1 }).limit(20).toArray(),
      db.collection('serviceConnections').find().sort({ createdAt: -1 }).limit(20).toArray(),
      db.collection('drafts').find().sort({ createdAt: -1 }).limit(20).toArray(),
      db.collection('messages').find().sort({ createdAt: -1 }).limit(20).toArray(),
    ]);
    for (const md of memoryDrafts) {
      if (!drafts.some((d) => d._id?.toString() === md._id?.toString())) {
        drafts.unshift(md);
      }
    }
    for (const mc of memoryConnections) {
      if (!services.some((s) => s.requestId === mc.requestId)) {
        services.unshift(mc);
      }
    }
  } catch (err) {
    console.warn('[admin/ops] DB offline, using seed operational queues:', err);
    enquiries = [
      {
        _id: 'enq_1',
        kind: 'visit',
        listingTitle: 'Sangam Boys PG, Katra',
        name: 'Aarav Sharma',
        phone: '+919876543210',
        requestId: 'req_katra_01',
        state: 'REQUESTED',
        scheduledSlot: 'Today, 4:00 PM',
        createdAt: new Date(),
      },
      {
        _id: 'enq_2',
        kind: 'callback',
        listingTitle: 'Civil Lines Executive 2BHK',
        name: 'Priya Verma',
        phone: '+919811223344',
        requestId: 'req_cl_02',
        state: 'CONFIRMED',
        scheduledSlot: 'Tomorrow, 11:30 AM',
        createdAt: new Date(),
      },
    ];
    services = [
      {
        _id: 'svc_1',
        serviceType: 'food',
        locality: 'Katra / AU',
        userName: 'Aarav Sharma',
        userPhone: '+919876543210',
        status: 'DISPATCHED_TO_PROVIDER',
        providerName: 'Annapurna Student Tiffin',
        createdAt: new Date(),
      },
      {
        _id: 'svc_2',
        serviceType: 'water',
        locality: 'Allahpur',
        userName: 'Rohan Gupta',
        userPhone: '+919822334455',
        status: 'PENDING_DISPATCH',
        providerName: 'Bisleri / Kinley RO Depot',
        createdAt: new Date(),
      },
    ];
    services = [...memoryConnections, ...services];
    drafts = memoryDrafts;
  }

  const staffName = session.name || 'Operations Lead';

  // Apply any in-memory status overrides for instant resilience
  const overrides = (global as any)._f2sOpsStatusOverrides as Map<string, string> | undefined;

  const serializedEnquiries = enquiries.map((e) => {
    const id = e._id?.toString() || Math.random().toString();
    const overriddenState = overrides?.get(`enquiries:${id}`);
    return {
      _id: id,
      kind: e.kind || 'visit',
      listingTitle: e.listingTitle || 'Accommodation Inquiry',
      name: e.name || 'Resident Seeker',
      phone: e.phone || '',
      requestId: e.requestId || 'REQ-889',
      state: overriddenState || e.state || 'REQUESTED',
      scheduledSlot: e.scheduledSlot || 'Flexible',
      createdAt: e.createdAt ? e.createdAt.toString() : undefined,
    };
  });

  const serializedServices = services.map((s) => {
    const id = s._id?.toString() || Math.random().toString();
    const overriddenStatus = overrides?.get(`serviceConnections:${id}`);
    return {
      _id: id,
      serviceType: s.serviceType || 'food',
      locality: s.locality || s.serviceDetails?.locality || s.serviceDetails?.city || 'Noida',
      userName: s.userName || s.name || 'Resident',
      userPhone: s.userPhone || s.phone || '',
      status: overriddenStatus || s.status || s.state || 'ROUTING',
      providerName: s.providerName || 'Pending Assignment',
      serviceDetails: s.serviceDetails || {},
      createdAt: s.createdAt ? s.createdAt.toString() : undefined,
    };
  });

  const serializedDrafts = drafts.map((d) => ({
    _id: d._id?.toString() || Math.random().toString(),
    title: d.title || 'Untitled Property',
    locality: d.locality || 'Noida',
    type: d.type || 'PG',
    name: d.name || 'Owner',
    phone: d.phone || '',
    rent: Number(d.rent) || 0,
    status: d.status || 'SUBMITTED',
    createdAt: d.createdAt ? d.createdAt.toString() : undefined,
  }));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '85vh', paddingBottom: '70px' }}>
      {/* Admin Top Header Banner */}
      <section style={{ background: 'var(--navy)', color: '#fff', padding: '24px 0', borderBottom: '3px solid var(--or)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--or)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Internal Desk
              </span>
              <span style={{ fontSize: '13px', color: '#93C5FD' }}>
                Noida &amp; Delhi NCR Operations Hub
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#fff', margin: '6px 0 0' }}>
              Operations &amp; Admin Desk
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#CBD5E1' }}>
              👤 Logged in as <strong>{staffName}</strong>
            </span>
            <a
              href="/api/auth/logout"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Staff Sign Out
            </a>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ marginTop: '24px' }}>
        {/* Live Counters */}
        <div className="stats" style={{ marginTop: 0, marginBottom: '28px' }}>
          <div>
            <b>{enquiries.length}</b>
            <span>Visits &amp; Callbacks</span>
          </div>
          <div>
            <b style={{ color: 'var(--blue)' }}>{services.length}</b>
            <span>Service Routes</span>
          </div>
          <div>
            <b style={{ color: 'var(--or)' }}>{drafts.length}</b>
            <span>Property Verifications</span>
          </div>
          <div>
            <b style={{ color: 'var(--ok)' }}>{messages.length}</b>
            <span>Direct Inquiries</span>
          </div>
        </div>

        {/* Section 1: Visits & Callbacks */}
        <div className="panel" style={{ borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                1. Visit &amp; Callback Coordination Queue
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--mut)', margin: '3px 0 0' }}>
                Coordinate owner availability and dispatch confirmed visit door numbers.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)', background: 'var(--sky)', padding: '4px 10px', borderRadius: '999px' }}>
              {enquiries.length} Pending Actions
            </span>
          </div>

          <AdminEnquiryQueue initialEnquiries={serializedEnquiries} />
        </div>

        {/* Section 2: Property Verification Drafts */}
        <div className="panel" style={{ borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                2. Landlord Property Verification Queue
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--mut)', margin: '3px 0 0' }}>
                Review draft evidence, dispatch on-site physical inspection, and issue 180-day audit seal.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--or)', background: '#FFF7ED', padding: '4px 10px', borderRadius: '999px' }}>
              {drafts.length} In Review
            </span>
          </div>

          <AdminDraftQueue initialDrafts={serializedDrafts} />
        </div>

        {/* Section 3: Third-Party Service Routing */}
        <div className="panel" style={{ borderRadius: '18px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                3. Independent Service Routing (Tiffin, Water, Shifting)
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--mut)', margin: '3px 0 0' }}>
                Connect user consent records to verified local Noida &amp; Delhi NCR service operators.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '999px' }}>
              {services.length} Connections
            </span>
          </div>

          <AdminServiceQueue initialServices={serializedServices} />
        </div>
      </div>
    </div>
  );
}
