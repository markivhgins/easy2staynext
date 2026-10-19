'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BulkPropertyUploader } from './BulkPropertyUploader';
import { VerifiedQrModal } from './VerifiedQrModal';
import { OwnerPropertyEditModal } from './OwnerPropertyEditModal';
import { OwnerAvailabilityToggle } from './OwnerAvailabilityToggle';
import { OwnerPhotoUploader } from './OwnerPhotoUploader';

interface OwnerDashboardClientProps {
  initialDrafts: any[];
  initialEnquiries: any[];
  userPhone: string;
  userName: string;
}

export const OwnerDashboardClient: React.FC<OwnerDashboardClientProps> = ({
  initialDrafts,
  initialEnquiries,
  userPhone,
  userName,
}) => {
  const [drafts, setDrafts] = useState<any[]>(initialDrafts);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending' | 'occupied'>('all');
  const [selectedQrDraft, setSelectedQrDraft] = useState<any | null>(null);
  const [selectedEditDraft, setSelectedEditDraft] = useState<any | null>(null);
  const [actionMessage, setActionMessage] = useState<string>('');

  const refreshDrafts = async () => {
    try {
      const res = await fetch('/api/drafts');
      const data = await res.json();
      if (data.drafts) {
        setDrafts(data.drafts);
      }
    } catch {}
  };

  const handleDelete = async (id: string, propId?: string) => {
    if (!confirm(`Are you sure you want to deactivate and remove property ${propId || id}?`)) return;

    try {
      const res = await fetch(`/api/drafts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setDrafts((prev) => prev.filter((d) => d._id !== id && d.propertyId !== id));
        setActionMessage(`Property ${propId || id} was deactivated successfully.`);
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert('Failed to delete listing: ' + (err as Error).message);
    }
  };

  const totalListings = drafts.length;
  const verifiedListings = drafts.filter((d) => d.status === 'PUBLISHED' || d.isVerified);
  const pendingListings = drafts.filter((d) => d.status === 'SUBMITTED' || d.status === 'INSPECTION_SCHEDULED' || d.status === 'DRAFT');
  const occupiedListings = drafts.filter((d) => d.availabilityStatus === 'OCCUPIED');

  const totalAvailableRooms = drafts.reduce((acc, d) => {
    if (d.availabilityStatus === 'OCCUPIED') return acc;
    return acc + (Number(d.availableRooms) || 1);
  }, 0);

  const totalOccupiedRooms = drafts.reduce((acc, d) => {
    if (d.availabilityStatus === 'OCCUPIED') return acc + (Number(d.totalRooms) || 1);
    return acc;
  }, 0);

  const filteredDrafts = drafts.filter((d) => {
    if (activeTab === 'verified') return d.status === 'PUBLISHED' || d.isVerified;
    if (activeTab === 'pending') return d.status === 'SUBMITTED' || d.status === 'INSPECTION_SCHEDULED' || d.status === 'DRAFT';
    if (activeTab === 'occupied') return d.availabilityStatus === 'OCCUPIED';
    return true;
  });

  return (
    <>
      {actionMessage && (
        <div style={{ padding: '12px 20px', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: '12px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 600 }}>
          ✓ {actionMessage}
        </div>
      )}

      {/* KPI Counters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase' }}>Total Listings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginTop: '2px' }}>{totalListings}</div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '4px' }}>● Verified owner hub</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase' }}>Verified &amp; Live</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue)', marginTop: '2px' }}>{verifiedListings.length}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--mut)', marginTop: '4px' }}>QR seals active</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase' }}>Available Beds/Rooms</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>{totalAvailableRooms}</div>
          <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '4px' }}>Vacant &amp; ready</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase' }}>Occupied Units</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#64748b', marginTop: '2px' }}>{totalOccupiedRooms}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--mut)', marginTop: '4px' }}>Zero vacancy target</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase' }}>Pending Audits</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{pendingListings.length}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--mut)', marginTop: '4px' }}>Operations check</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 6px rgba(11,35,80,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase' }}>Seeker Inquiries</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{initialEnquiries.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px' }}>Direct phone visits</div>
        </div>
      </div>

      {/* Bulk Uploader Drawer for Brokers / PG Owners */}
      <div style={{ marginBottom: '24px' }}>
        <BulkPropertyUploader onImportSuccess={refreshDrafts} />
      </div>

      {/* Section 1: Listings Table / Cards */}
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', padding: '26px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
              My Registered Stays &amp; Properties
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '4px 0 0' }}>
              Manage availability, edit rent, download verified QR codes, and track verification stages.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: activeTab === 'all' ? 'var(--navy)' : '#f8fafc',
                color: activeTab === 'all' ? '#fff' : 'var(--navy)',
                cursor: 'pointer',
              }}
            >
              All ({drafts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verified')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: activeTab === 'verified' ? '#166534' : '#f8fafc',
                color: activeTab === 'verified' ? '#fff' : '#166534',
                cursor: 'pointer',
              }}
            >
              Verified ({verifiedListings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: activeTab === 'pending' ? '#b45309' : '#f8fafc',
                color: activeTab === 'pending' ? '#fff' : '#b45309',
                cursor: 'pointer',
              }}
            >
              In Audit ({pendingListings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('occupied')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: activeTab === 'occupied' ? '#475569' : '#f8fafc',
                color: activeTab === 'occupied' ? '#fff' : '#475569',
                cursor: 'pointer',
              }}
            >
              Occupied ({occupiedListings.length})
            </button>
          </div>
        </div>

        {/* Property cards list */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredDrafts.length > 0 ? (
            filteredDrafts.map((draft, idx) => {
              const isPublished = draft.status === 'PUBLISHED' || draft.isVerified;
              const isScheduled = draft.status === 'INSPECTION_SCHEDULED';
              const isOccupied = draft.availabilityStatus === 'OCCUPIED';
              const propertyId = draft.propertyId || `F2S-NOI-${(draft._id || idx).toString().slice(-5)}`;
              const listingSlug = `stay_${(draft.locality || 'noida').toLowerCase().replace(/[^a-z0-9]/g, '-')}_${draft._id?.toString().slice(-5)}`;

              return (
                <div
                  key={draft._id?.toString() || idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: '0 2px 6px rgba(11,35,80,0.02)',
                  }}
                >
                  {draft.photos && draft.photos.length > 0 && (
                    <div style={{ width: '90px', height: '70px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          background: isOccupied ? '#f1f5f9' : isPublished ? '#dcfce7' : isScheduled ? '#fef3c7' : '#eff6ff',
                          color: isOccupied ? '#475569' : isPublished ? '#166534' : isScheduled ? '#b45309' : '#1d4ed8',
                        }}
                      >
                        {isOccupied ? '🔴 Occupied' : isPublished ? '✓ Verified & Live' : isScheduled ? '⏳ Audit Scheduled' : '● In Verification'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px' }}>
                        {propertyId}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--navy)' }}>
                        {draft.title}
                      </strong>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      📍 {draft.locality || 'Noida'}, {draft.city || 'Noida'} · {draft.type} {draft.bhk ? `(${draft.bhk})` : ''} · Rent: <strong style={{ color: '#0f172a' }}>₹{Number(draft.rent).toLocaleString('en-IN')}/mo</strong>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>🛏️ Available Beds: <strong>{draft.availableRooms || 1}</strong></span>
                      {draft.electricityBasis && <span>⚡ Power: <strong>{draft.electricityBasis}</strong></span>}
                      {draft.sharing && <span>👥 Sharing: <strong>{draft.sharing}</strong></span>}
                    </div>

                    <OwnerPhotoUploader
                      draftId={draft._id?.toString() || 'draft_demo'}
                      initialPhotos={draft.photos || []}
                    />
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <OwnerAvailabilityToggle
                      draftId={draft._id?.toString() || 'draft_demo'}
                      initialStatus={draft.availabilityStatus || 'AVAILABLE'}
                    />

                    {/* QR Code Button ONLY for Verified / Published Properties */}
                    {isPublished ? (
                      <button
                        type="button"
                        onClick={() => setSelectedQrDraft({ propertyId, title: draft.title, slugOrId: listingSlug })}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: 'var(--blue)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        📱 Verified QR
                      </button>
                    ) : (
                      <span
                        title="QR codes are generated exclusively for verified listings upon physical audit completion"
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        🔒 QR Pending Audit
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedEditDraft(draft)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: 'var(--navy)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <Link
                      href={isPublished ? `/listing/${listingSlug}` : '/how-verification-works'}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: isPublished ? 'var(--blue)' : '#f1f5f9',
                        color: isPublished ? '#ffffff' : 'var(--navy)',
                        border: isPublished ? 'none' : '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {isPublished ? 'View Stay →' : 'Audit Roadmap →'}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(draft._id?.toString(), propertyId)}
                      title="Deactivate listing"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏡</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
                No properties in this filter
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 16px' }}>
                List your property to get genuine student and working professional inquiries.
              </p>
              <Link href="/list-your-property" className="go" style={{ padding: '9px 18px', fontSize: '0.85rem', borderRadius: '10px' }}>
                + List Your Property Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Verified QR Code Modal */}
      {selectedQrDraft && (
        <VerifiedQrModal
          propertyId={selectedQrDraft.propertyId}
          title={selectedQrDraft.title}
          slugOrId={selectedQrDraft.slugOrId}
          isOpen={true}
          onClose={() => setSelectedQrDraft(null)}
        />
      )}

      {/* Property Edit Modal */}
      {selectedEditDraft && (
        <OwnerPropertyEditModal
          draft={selectedEditDraft}
          isOpen={true}
          onClose={() => setSelectedEditDraft(null)}
          onUpdated={refreshDrafts}
        />
      )}
    </>
  );
};
