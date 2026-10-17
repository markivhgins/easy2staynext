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

  // Modern Local Date & Time slot handling strictly preventing past selections
  const getLocalDateStr = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = getLocalDateStr(now);
  const tomorrowStr = getLocalDateStr(new Date(Date.now() + 864e5));
  const dayAfterStr = getLocalDateStr(new Date(Date.now() + 2 * 864e5));
  const maxDateStr = getLocalDateStr(new Date(Date.now() + 30 * 864e5));

  // If today is past 6 PM, default to tomorrow
  const [selectedDate, setSelectedDate] = useState(currentHour >= 18 ? tomorrowStr : todayStr);
  const [selectedSlotId, setSelectedSlotId] = useState('morning');

  const TIME_SLOTS = [
    { id: 'morning', label: 'Morning', timeRange: '10:00 AM – 12:00 PM', timeVal: '10:30', cutoffHour: 11 },
    { id: 'afternoon', label: 'Afternoon', timeRange: '12:00 PM – 03:00 PM', timeVal: '14:00', cutoffHour: 14 },
    { id: 'evening', label: 'Evening', timeRange: '03:00 PM – 06:00 PM', timeVal: '16:30', cutoffHour: 17 },
    { id: 'late', label: 'Late Evening', timeRange: '06:00 PM – 07:45 PM', timeVal: '18:30', cutoffHour: 19 },
  ];

  // Update slot value whenever selectedDate or selectedSlotId changes
  useEffect(() => {
    if (kind === 'VISIT') {
      const activeSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId) || TIME_SLOTS[0];
      setSlot(`${selectedDate}T${activeSlot.timeVal}:00`);
    }
  }, [selectedDate, selectedSlotId, kind]);

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
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
                  Preferred Visit Date
                </span>
                <span style={{ fontSize: '11px', color: '#1557D6', fontWeight: 600 }}>No past dates</span>
              </div>

              {/* Quick Date Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                <button
                  type="button"
                  disabled={currentHour >= 18}
                  onClick={() => setSelectedDate(todayStr)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: currentHour >= 18 ? 'not-allowed' : 'pointer',
                    opacity: currentHour >= 18 ? 0.45 : 1,
                    border: selectedDate === todayStr ? '2px solid #1557D6' : '1px solid #E2E8F0',
                    background: selectedDate === todayStr ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                    color: selectedDate === todayStr ? '#1557D6' : '#1E293B',
                  }}
                >
                  Today
                  <span style={{ display: 'block', fontSize: '10px', color: '#64748B', fontWeight: 400 }}>
                    {currentHour >= 18 ? 'Closed' : 'Available'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate(tomorrowStr)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedDate === tomorrowStr ? '2px solid #1557D6' : '1px solid #E2E8F0',
                    background: selectedDate === tomorrowStr ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                    color: selectedDate === tomorrowStr ? '#1557D6' : '#1E293B',
                  }}
                >
                  Tomorrow
                  <span style={{ display: 'block', fontSize: '10px', color: '#64748B', fontWeight: 400 }}>Next Day</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate(dayAfterStr)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedDate === dayAfterStr ? '2px solid #1557D6' : '1px solid #E2E8F0',
                    background: selectedDate === dayAfterStr ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                    color: selectedDate === dayAfterStr ? '#1557D6' : '#1E293B',
                  }}
                >
                  Day After
                  <span style={{ display: 'block', fontSize: '10px', color: '#64748B', fontWeight: 400 }}>Flexible</span>
                </button>
              </div>

              {/* Custom Date Input strictly bounded by min=todayStr */}
              <div style={{ marginBottom: '14px' }}>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr}
                  max={maxDateStr}
                  onChange={(e) => {
                    if (e.target.value >= todayStr) {
                      setSelectedDate(e.target.value);
                    }
                  }}
                  style={{ width: '100%', fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>

              {/* Time Slot Selection */}
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Select Time Window
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {TIME_SLOTS.map((ts) => {
                    const isToday = selectedDate === todayStr;
                    const isPassed = isToday && currentHour >= ts.cutoffHour;
                    const isSelected = selectedSlotId === ts.id && !isPassed;

                    return (
                      <button
                        key={ts.id}
                        type="button"
                        disabled={isPassed}
                        onClick={() => setSelectedSlotId(ts.id)}
                        style={{
                          padding: '9px 8px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: isPassed ? 'not-allowed' : 'pointer',
                          opacity: isPassed ? 0.45 : 1,
                          border: isSelected ? '2px solid #1557D6' : '1px solid #E2E8F0',
                          background: isSelected ? 'rgba(21, 87, 214, 0.08)' : '#fff',
                          color: isSelected ? '#1557D6' : '#1E293B',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '12px' }}>
                          {ts.label} {isPassed && <span style={{ color: '#EF4444', fontSize: '10px' }}>(Passed)</span>}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                          {ts.timeRange}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Slot Confirmation Tag */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📅</span>
                <span>
                  <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong> • {TIME_SLOTS.find(s => s.id === selectedSlotId)?.timeRange || '10:00 AM – 12:00 PM'}
                </span>
              </div>
            </div>
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
