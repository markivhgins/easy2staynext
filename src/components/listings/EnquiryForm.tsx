'use client';

import React, { useState, useEffect } from 'react';
import { inr } from '@/lib/format';

interface EnquiryFormProps {
  slug: string;
  rentPaise: number;
  moveInEstimatePaise: number;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  slug,
  rentPaise,
  moveInEstimatePaise,
}) => {
  const [kind, setKind] = useState<'VISIT' | 'CALLBACK'>('VISIT');
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Calculate min & max datetime for visit picker
  // Min: now + 1 hour (padded to YYYY-MM-DDTHH:mm)
  const now = new Date(Date.now() + 60 * 60 * 1000);
  const minDateTime = now.toISOString().slice(0, 16);
  // Max: now + 30 days
  const max = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const maxDateTime = max.toISOString().slice(0, 16);

  // Auto-fill logged in user info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.displayName && !data.user.displayName.startsWith('User (')) {
            setName(data.user.displayName);
          }
          if (data.user.phoneE164) {
            const clean10 = data.user.phoneE164.replace(/\D/g, '').slice(-10);
            if (clean10) setPhone(clean10);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setStatus('error');
      setMessage('Consent is required before we share your contact details.');
      return;
    }

    const cleanName = name.trim();
    if (cleanName.length < 2 || !/[a-zA-Z]/.test(cleanName)) {
      setStatus('error');
      setMessage('Please enter your full name (minimum 2 letters).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setStatus('error');
      setMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (/^([0-9])\1{9}$/.test(cleanPhone)) {
      setStatus('error');
      setMessage('Mobile number cannot consist of the same repeated digit.');
      return;
    }

    if (kind === 'VISIT') {
      if (!slot) {
        setStatus('error');
        setMessage('Please select a preferred date and time for your visit.');
        return;
      }
      const slotDate = new Date(slot);
      if (isNaN(slotDate.getTime())) {
        setStatus('error');
        setMessage('Please select a valid date and time.');
        return;
      }
      if (slotDate.getTime() < Date.now() + 30 * 60 * 1000) {
        setStatus('error');
        setMessage('Visit time must be in the future (at least 30 minutes in advance).');
        return;
      }
      const hours = slotDate.getHours();
      if (hours < 8 || hours >= 20) {
        setStatus('error');
        setMessage('Visiting hours are 8:00 AM to 8:00 PM. Please select a time during visiting hours.');
        return;
      }
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          kind,
          slot: kind === 'VISIT' ? slot : undefined,
          name: cleanName,
          phone: cleanPhone,
          consent: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit request.');
      }

      setStatus('success');
      setMessage(
        `Request confirmed (Ref: ${data.requestId}). Operations will coordinate with the verified property manager and contact you.`
      );
      setSlot('');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  return (
    <aside className="book">
      <b className="big">{inr(rentPaise)}</b>
      <span>/month</span>
      <p>{inr(moveInEstimatePaise)} to move in</p>

      {status === 'success' ? (
        <div style={{ padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', color: '#166534', fontSize: '13.5px' }}>
          <p style={{ fontWeight: 700, margin: '0 0 6px' }}>✓ Request Confirmed!</p>
          <p style={{ margin: 0, lineHeight: '1.5' }}>{message}</p>
          <button
            type="button"
            className="go"
            style={{ marginTop: '14px', width: '100%', textAlign: 'center', padding: '10px' }}
            onClick={() => setStatus('idle')}
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
            Request Type
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as 'VISIT' | 'CALLBACK')}
              style={{ marginTop: '4px', width: '100%', borderRadius: '6px' }}
            >
              <option value="VISIT">Request an in-person visit</option>
              <option value="CALLBACK">Request a phone callback</option>
            </select>
          </label>

          {kind === 'VISIT' && (
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
              Preferred Date &amp; Time
              <input
                type="datetime-local"
                value={slot}
                min={minDateTime}
                max={maxDateTime}
                onChange={(e) => setSlot(e.target.value)}
                style={{ marginTop: '4px', width: '100%', borderRadius: '6px' }}
                aria-label="Preferred time for visit"
                required={kind === 'VISIT'}
              />
              <small style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: '#64748B', textTransform: 'none', fontWeight: 400 }}>
                Visiting hours: 8:00 AM – 8:00 PM (Monday – Sunday)
              </small>
            </label>
          )}

          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
            Your Name
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={50}
              style={{ marginTop: '4px', width: '100%', borderRadius: '6px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '14px', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
            10-Digit Mobile Number
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              required
              style={{ marginTop: '4px', width: '100%', borderRadius: '6px' }}
            />
            <small style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: '#64748B', textTransform: 'none', fontWeight: 400 }}>
              Must start with 6, 7, 8, or 9
            </small>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ width: 'auto', marginTop: '2px' }}
              required
            />
            <span>
              I consent to share my contact details with Find2Stay operations and the verified property manager solely for coordinating this request.
            </span>
          </label>

          <button
            type="submit"
            className="go"
            style={{ width: '100%', borderRadius: '8px', padding: '12px' }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending Request...' : 'Send Request'}
          </button>

          {status === 'error' && (
            <p style={{ marginTop: '10px', fontSize: '12.5px', color: '#DC2626', fontWeight: 500, background: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', border: '1px solid #FECACA' }}>
              ⚠️ {message}
            </p>
          )}
        </form>
      )}
    </aside>
  );
};
