'use client';

import React, { useState } from 'react';

interface ServiceIntakeFormProps {
  service: 'food' | 'water' | 'movers';
  submitLabel: string;
  children: React.ReactNode;
}

export const ServiceIntakeForm: React.FC<ServiceIntakeFormProps> = ({
  service,
  submitLabel,
  children,
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const consent = formData.get('consent') === 'on';

    if (!consent) {
      setStatus('error');
      setMessage('Consent is required to share request details with verified service providers.');
      return;
    }

    if (!name || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setStatus('error');
      setMessage('Please enter your name and a valid 10-digit mobile number.');
      return;
    }

    const details: Record<string, unknown> = {};
    for (const [key, val] of formData.entries()) {
      if (!['name', 'phone', 'consent'].includes(key)) {
        details[key] = val;
      }
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          name,
          phone,
          consent: true,
          details,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit request.');
      }

      setStatus('success');
      setMessage(`Request submitted (Ref: ${data.requestId}). A verified provider in your locality will contact you shortly.`);
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  return (
    <div className="panel">
      <h2>Request a connection</h2>
      {status === 'success' ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          <p className="font-semibold mb-1">Request Received!</p>
          <p>{message}</p>
          <button
            type="button"
            className="go mt-3 w-full"
            onClick={() => setStatus('idle')}
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Your Name
            <input
              type="text"
              name="name"
              placeholder="e.g. Priya Srivastava"
              autoComplete="name"
              required
              className="mt-1 w-full"
            />
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            10-Digit Mobile Number
            <input
              type="tel"
              name="phone"
              placeholder="e.g. 9876543210"
              inputMode="numeric"
              autoComplete="tel"
              required
              className="mt-1 w-full"
            />
          </label>

          {children}

          <label className="chk block my-3 text-xs text-gray-600">
            <input
              type="checkbox"
              name="consent"
              className="mr-2"
              required
            />
            I agree to share my contact details with Find2Stay and approved service providers serving my locality.
          </label>

          <button
            type="submit"
            className="go w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Connecting...' : submitLabel}
          </button>

          {status === 'error' && (
            <p className="msg err mt-2 text-xs text-red-600">{message}</p>
          )}
        </form>
      )}
    </div>
  );
};
