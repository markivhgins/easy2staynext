'use client';

import React, { useState } from 'react';

interface OwnerPropertyEditModalProps {
  draft: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const OwnerPropertyEditModal: React.FC<OwnerPropertyEditModalProps> = ({
  draft,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [title, setTitle] = useState(draft.title || '');
  const [rent, setRent] = useState(draft.rent?.toString() || '');
  const [deposit, setDeposit] = useState(draft.deposit?.toString() || '');
  const [locality, setLocality] = useState(draft.locality || '');
  const [status, setStatus] = useState(draft.status || 'SUBMITTED');
  const [availabilityStatus, setAvailabilityStatus] = useState(draft.availabilityStatus || 'AVAILABLE');
  const [availableRooms, setAvailableRooms] = useState(draft.availableRooms?.toString() || '1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draft._id,
          propertyId: draft.propertyId,
          action: 'SAVE_DRAFT',
          title,
          rent: Number(rent),
          deposit: Number(deposit),
          locality,
          status,
          availabilityStatus,
          availableRooms: Number(availableRooms),
          type: draft.type,
          name: draft.name,
          phone: draft.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to update property.');
      onUpdated();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px' }}>
          Edit Property Details
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--mut)', margin: '0 0 20px' }}>
          Property ID: <strong>{draft.propertyId || draft._id}</strong>
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
              Property Title
            </label>
            <input
              type="text"
              className="in"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                className="in"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                Security Deposit (₹)
              </label>
              <input
                type="number"
                className="in"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                Locality / Area
              </label>
              <input
                type="text"
                className="in"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                Available Rooms / Beds
              </label>
              <input
                type="number"
                min="0"
                className="in"
                value={availableRooms}
                onChange={(e) => setAvailableRooms(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
              Occupancy Status
            </label>
            <select
              className="in"
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
            >
              <option value="AVAILABLE">Available (Vacant &amp; Open for Visits)</option>
              <option value="OCCUPIED">Occupied (Full - No vacant beds)</option>
              <option value="UNAVAILABLE">Temporarily Unavailable</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="go"
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
