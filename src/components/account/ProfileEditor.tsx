'use client';

import React, { useState } from 'react';

interface ProfileEditorProps {
  initialName: string;
  initialEmail: string;
  phone: string;
}

export function ProfileEditor({ initialName, initialEmail, phone }: ProfileEditorProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/me/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: name,
          email,
          emergencyContact,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage('Your profile details have been saved successfully.');
      setIsError(false);
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ borderRadius: '14px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '18px' }}>
        Personal &amp; Contact Details
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Full Name
          </span>
          <input
            type="text"
            placeholder="e.g. Aarav Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderRadius: '8px', padding: '12px 14px' }}
          />
        </label>

        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Email Address
          </span>
          <input
            type="email"
            placeholder="e.g. aarav.sharma@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderRadius: '8px', padding: '12px 14px' }}
          />
          <small style={{ color: 'var(--mut)', fontSize: '11.5px' }}>
            Used for visit reminders, invoices, and service confirmations.
          </small>
        </label>

        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Registered Mobile (Read Only)
          </span>
          <input
            type="text"
            value={phone}
            disabled
            style={{ borderRadius: '8px', padding: '12px 14px', background: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
          />
        </label>

        <label style={{ display: 'grid', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Emergency Contact / Guardian Phone
          </span>
          <input
            type="tel"
            placeholder="e.g. 9812345678"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            style={{ borderRadius: '8px', padding: '12px 14px' }}
          />
        </label>

        {message && (
          <p
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              background: isError ? '#FEE2E2' : '#DCFCE7',
              color: isError ? '#991B1B' : '#166534',
            }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="go"
          disabled={loading}
          style={{
            justifySelf: 'start',
            borderRadius: '999px',
            padding: '12px 28px',
            fontSize: '14.5px',
            fontWeight: 700,
            marginTop: '6px',
          }}
        >
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
