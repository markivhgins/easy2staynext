'use client';

import React, { useState } from 'react';

export interface ServiceItem {
  _id: string;
  serviceType?: string;
  locality?: string;
  userName?: string;
  userPhone?: string;
  status?: string;
  providerName?: string;
  serviceDetails?: Record<string, any>;
  createdAt?: string | Date;
}

interface AdminServiceQueueProps {
  initialServices: ServiceItem[];
}

const SERVICE_STATE_FLOW: Record<string, string> = {
  ROUTING: 'DISPATCHED_TO_PROVIDER',
  PENDING_DISPATCH: 'DISPATCHED_TO_PROVIDER',
  DISPATCHED_TO_PROVIDER: 'CONNECTED',
  CONNECTED: 'COMPLETED',
  COMPLETED: 'CONNECTED',
  ACTIVE: 'CONNECTED',
};

export function AdminServiceQueue({ initialServices }: AdminServiceQueueProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAdvance = async (item: ServiceItem) => {
    const currentStatus = item.status || 'PENDING_DISPATCH';
    const nextState = SERVICE_STATE_FLOW[currentStatus] || 'DISPATCHED_TO_PROVIDER';
    const id = item._id;

    setLoadingId(id);

    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status: nextState } : s))
    );

    try {
      const res = await fetch('/api/ops/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'serviceConnections',
          id,
          nextState,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update service status');
      }
    } catch (err) {
      console.error('Failed to advance service status:', err);
      // Revert if error
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: currentStatus } : s))
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      {services.map((s, idx) => {
        const currentStatus = s.status || 'PENDING_DISPATCH';
        const nextState = SERVICE_STATE_FLOW[currentStatus] || 'DISPATCHED_TO_PROVIDER';
        const isLoading = loadingId === s._id;

        return (
          <div
            key={s._id || idx}
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
            }}
          >
            <div>
              <strong style={{ fontSize: '15px', color: 'var(--navy)', textTransform: 'capitalize' }}>
                {s.serviceType || 'Service'} Connection
              </strong>{' '}
              <span style={{ fontSize: '12.5px', color: 'var(--mut)' }}>
                · {s.locality}
              </span>
              <p style={{ fontSize: '12.5px', color: 'var(--mut)', margin: '4px 0 0' }}>
                Customer: <strong>{s.userName}</strong> ({s.userPhone}) → Assigned Partner: <strong>{s.providerName || 'Pending Assignment'}</strong>
              </p>
              {s.serviceDetails && Object.keys(s.serviceDetails).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {Object.entries(s.serviceDetails).map(([k, v]) => (
                    <span
                      key={k}
                      style={{
                        fontSize: '11px',
                        background: '#e2e8f0',
                        color: '#334155',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {k}: {String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background:
                    currentStatus === 'CONNECTED'
                      ? '#DCFCE7'
                      : currentStatus === 'DISPATCHED_TO_PROVIDER'
                      ? '#FEF3C7'
                      : '#EFF6FF',
                  color:
                    currentStatus === 'CONNECTED'
                      ? '#15803D'
                      : currentStatus === 'DISPATCHED_TO_PROVIDER'
                      ? '#B45309'
                      : '#1D4ED8',
                }}
              >
                {currentStatus}
              </span>

              <button
                type="button"
                onClick={() => handleAdvance(s)}
                disabled={isLoading}
                className="act"
                style={{
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  padding: '7px 14px',
                  cursor: isLoading ? 'wait' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'Updating...' : `Advance to ${nextState} →`}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
