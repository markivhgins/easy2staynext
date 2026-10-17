'use client';

import React, { useState } from 'react';

export interface DraftItem {
  _id: string;
  title: string;
  locality: string;
  type: string;
  name: string;
  phone: string;
  rent: number;
  status: string;
  photos?: string[];
  createdAt?: string | Date;
}

interface AdminDraftQueueProps {
  initialDrafts: DraftItem[];
}

export function AdminDraftQueue({ initialDrafts }: AdminDraftQueueProps) {
  const [drafts, setDrafts] = useState<DraftItem[]>(initialDrafts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null);

  const handleAction = async (draftId: string, action: 'VERIFY_AND_PUBLISH' | 'SCHEDULE_VISIT' | 'REJECT') => {
    setLoadingId(draftId);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/verify-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to update draft');
      }

      setDrafts((prev) =>
        prev.map((d) => (d._id === draftId ? { ...d, status: data.status } : d))
      );
      setFeedback({ id: draftId, msg: data.message, type: 'success' });
    } catch (err: any) {
      setFeedback({ id: draftId, msg: err?.message || 'Error occurred', type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return { background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' };
      case 'INSPECTION_SCHEDULED':
        return { background: '#E0E7FF', color: '#3730A3', border: '1px solid #A5B4FC' };
      case 'REJECTED':
        return { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' };
      default:
        return { background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' };
    }
  };

  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      {drafts.map((d) => {
        const isLoading = loadingId === d._id;
        const isPublished = d.status === 'PUBLISHED';
        const hasFeedback = feedback && feedback.id === d._id;

        return (
          <div
            key={d._id}
            style={{
              padding: '16px 20px',
              background: '#F8FAFC',
              border: isPublished ? '1.5px solid #86EFAC' : '1px solid var(--line)',
              borderRadius: '14px',
              display: 'grid',
              gap: '12px',
              transition: 'border-color 0.2s',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '16px', color: 'var(--navy)' }}>
                    {d.title}
                  </strong>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      ...getBadgeStyle(d.status),
                    }}
                  >
                    {isPublished ? '✓ VERIFIED & PUBLISHED' : d.status || 'SUBMITTED'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--mut)', marginTop: '4px' }}>
                  📍 {d.locality} · Type: <strong>{d.type}</strong> · Monthly Rent: <strong>₹{d.rent}</strong>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--navy)', marginTop: '4px' }}>
                  Landlord: <strong>{d.name}</strong> · Phone:{' '}
                  <a href={`tel:${d.phone}`} style={{ color: 'var(--blue)', fontWeight: 600 }}>
                    {d.phone}
                  </a>
                </div>

                {d.photos && d.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {d.photos.map((pUrl, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          width: '60px',
                          height: '46px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {!isPublished ? (
                  <>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAction(d._id, 'VERIFY_AND_PUBLISH')}
                      style={{
                        background: '#15803D',
                        color: '#fff',
                        border: 0,
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      ✓ Verify &amp; Publish Live
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAction(d._id, 'SCHEDULE_VISIT')}
                      style={{
                        background: '#EEF2FF',
                        color: '#3730A3',
                        border: '1px solid #C7D2FE',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Schedule Inspection
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAction(d._id, 'REJECT')}
                      style={{
                        background: '#FFF1F2',
                        color: '#BE123C',
                        border: '1px solid #FECDD3',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#15803D',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    🛡️ Live on Find2Stay Discovery
                  </span>
                )}
              </div>
            </div>

            {hasFeedback && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: feedback.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                  color: feedback.type === 'success' ? '#166534' : '#991B1B',
                  border: `1px solid ${feedback.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                }}
              >
                {feedback.msg}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
