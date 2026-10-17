'use client';

import React, { useState } from 'react';

export interface EnquiryItem {
  _id: string;
  kind?: string;
  listingTitle?: string;
  name?: string;
  phone?: string;
  requestId?: string;
  state?: string;
  scheduledSlot?: string;
  createdAt?: string | Date;
}

interface AdminEnquiryQueueProps {
  initialEnquiries: EnquiryItem[];
}

const STATE_FLOW: Record<string, string> = {
  REQUESTED: 'CONFIRMED',
  CONFIRMED: 'VISIT_COMPLETED',
  VISIT_COMPLETED: 'RESOLVED',
  RESOLVED: 'CONFIRMED', // Allow toggling back if needed
};

export function AdminEnquiryQueue({ initialEnquiries }: AdminEnquiryQueueProps) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'REQUESTED' | 'CONFIRMED' | 'RESOLVED'>('ALL');

  const handleAdvance = async (item: EnquiryItem) => {
    const currentState = item.state || 'REQUESTED';
    const nextState = STATE_FLOW[currentState] || 'CONFIRMED';
    const id = item._id;

    setLoadingId(id);

    // Optimistic UI update
    setEnquiries((prev) =>
      prev.map((e) => (e._id === id ? { ...e, state: nextState } : e))
    );

    try {
      const res = await fetch('/api/ops/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'enquiries',
          id,
          nextState,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Failed to advance enquiry status:', err);
      // Revert if error
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, state: currentState } : e))
      );
    } finally {
      setLoadingId(null);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (filter === 'ALL') return true;
    return (e.state || 'REQUESTED') === filter;
  });

  return (
    <div>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['ALL', 'REQUESTED', 'CONFIRMED', 'RESOLVED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid var(--line)',
              background: filter === tab ? 'var(--navy)' : '#fff',
              color: filter === tab ? '#fff' : 'var(--mut)',
              transition: 'all 0.15s ease',
            }}
          >
            {tab === 'ALL' ? `All (${enquiries.length})` : tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {filteredEnquiries.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--mut)', background: '#F8FAFC', borderRadius: '12px', fontSize: '13.5px' }}>
            No enquiries matching {filter} filter.
          </div>
        ) : (
          filteredEnquiries.map((e, idx) => {
            const currentState = e.state || 'REQUESTED';
            const nextState = STATE_FLOW[currentState] || 'CONFIRMED';
            const isLoading = loadingId === e._id;

            return (
              <div
                key={e._id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '14px 16px',
                  background: '#F8FAFC',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  transition: 'background 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: e.kind === 'visit' ? '#DBEAFE' : '#FEF3C7',
                        color: e.kind === 'visit' ? '#1D4ED8' : '#B45309',
                      }}
                    >
                      {e.kind || 'Visit'}
                    </span>
                    <strong style={{ fontSize: '15px', color: 'var(--navy)' }}>
                      {e.listingTitle || 'Accommodation Inquiry'}
                    </strong>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--mut)', margin: '4px 0 0' }}>
                    Seeker: <strong>{e.name}</strong> ({e.phone}) · Slot: {e.scheduledSlot || 'Flexible'} · Ref: {e.requestId || 'REQ-889'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background:
                        currentState === 'CONFIRMED'
                          ? '#DCFCE7'
                          : currentState === 'VISIT_COMPLETED' || currentState === 'RESOLVED'
                          ? '#F3E8FF'
                          : '#EFF6FF',
                      color:
                        currentState === 'CONFIRMED'
                          ? '#15803D'
                          : currentState === 'VISIT_COMPLETED' || currentState === 'RESOLVED'
                          ? '#7E22CE'
                          : '#1D4ED8',
                    }}
                  >
                    {currentState}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAdvance(e)}
                    disabled={isLoading}
                    className="act"
                    style={{
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      padding: '7px 14px',
                      cursor: isLoading ? 'wait' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isLoading ? 'Updating...' : `Advance to ${nextState} →`}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
