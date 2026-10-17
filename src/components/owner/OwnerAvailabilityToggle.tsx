'use client';

import React, { useState } from 'react';

interface OwnerAvailabilityToggleProps {
  draftId: string;
  initialStatus?: string;
}

export function OwnerAvailabilityToggle({ draftId, initialStatus = 'AVAILABLE' }: OwnerAvailabilityToggleProps) {
  const [status, setStatus] = useState<'AVAILABLE' | 'OCCUPIED'>(
    initialStatus === 'OCCUPIED' ? 'OCCUPIED' : 'AVAILABLE'
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const toggleStatus = async () => {
    const nextStatus = status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    setLoading(true);
    setMsg(null);

    // Optimistic UI update
    setStatus(nextStatus);

    try {
      const res = await fetch('/api/owner/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to update');
      }

      setMsg(nextStatus === 'AVAILABLE' ? 'Marked Vacant' : 'Marked Occupied');
      setTimeout(() => setMsg(null), 2500);
    } catch (err: any) {
      // Revert on error
      setStatus(status);
      setMsg(err.message || 'Error');
      setTimeout(() => setMsg(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isVacant = status === 'AVAILABLE';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        type="button"
        onClick={toggleStatus}
        disabled={loading}
        title="Click to toggle listing occupancy status"
        style={{
          padding: '7px 13px',
          borderRadius: '8px',
          border: isVacant ? '1px solid #86efac' : '1px solid #cbd5e1',
          background: isVacant ? '#f0fdf4' : '#f8fafc',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: isVacant ? '#15803d' : '#475569',
          cursor: loading ? 'wait' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s ease',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isVacant ? '#22c55e' : '#94a3b8',
            display: 'inline-block',
          }}
        />
        {loading ? 'Updating...' : isVacant ? 'Status: Vacant ✓' : 'Status: Occupied ✕'}
      </button>
      {msg && (
        <span style={{ fontSize: '0.72rem', color: isVacant ? '#166534' : '#64748b', fontWeight: 600 }}>
          {msg}
        </span>
      )}
    </div>
  );
}
