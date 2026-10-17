'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const TOPICS = [
  'Finding a stay in Noida & Delhi NCR',
  'Listing my property / PG',
  'Becoming a service provider (Tiffin/Water/Shifting)',
  'Reporting an inaccurate listing',
  'Partnership or corporate inquiry',
  'Something else',
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit message.');

      setStatus('success');
      setFeedback(data.message);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setFeedback((err as Error).message);
    }
  };

  return (
    <>
      <section className="head">
        <div className="wrap hd">
          <div>
            <p className="eyebrow dk">Contact us</p>
            <h1>Talk to a real person.</h1>
            <p>
              Questions about an accommodation, a verified listing, or a service partnership? Reach out directly and our
              team will respond within one working day.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap split2">
        <div>
          <h2>Ways to reach us</h2>
          <div className="cinfo">
            <div>
              <span>General &amp; Support</span>
              <a href="mailto:support@find2stay.in">support@find2stay.in</a>
            </div>
            <div>
              <span>Listing Verification Desk</span>
              <a href="mailto:verification@find2stay.in">verification@find2stay.in</a>
            </div>
            <div>
              <span>Service Partners</span>
              <a href="mailto:partners@find2stay.in">partners@find2stay.in</a>
            </div>
            <div>
              <span>Operations Base</span>
              Noida, Uttar Pradesh (Delhi NCR)
              <small>Starting here, expanding city by city.</small>
            </div>
            <div>
              <span>Operating Hours</span>
              Monday to Saturday, 9:00 am to 7:00 pm IST
            </div>
          </div>
          <p className="sm mt-6">
            Looking for immediate guidance? Browse our <Link href="/help">help &amp; FAQs</Link>.
          </p>
        </div>

        <div className="panel">
          <h2>Send us a message</h2>
          {status === 'success' ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              <p className="font-semibold mb-1">Message Sent!</p>
              <p>{feedback}</p>
              <button type="button" className="go mt-3 w-full" onClick={() => setStatus('idle')}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
                Your Name
                <input
                  type="text"
                  placeholder="e.g. Anjali Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="mt-1 w-full"
                />
              </label>

              <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
                10-Digit Mobile Number
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  className="mt-1 w-full"
                />
              </label>

              <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
                Email Address (Optional)
                <input
                  type="email"
                  placeholder="e.g. anjali@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="mt-1 w-full"
                />
              </label>

              <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
                Topic
                <select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 w-full">
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                How can we help?
                <textarea
                  rows={4}
                  placeholder="Tell us about the property, question, or service..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-1 w-full"
                />
              </label>

              <button type="submit" className="go w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending message...' : 'Send message'}
              </button>

              {status === 'error' && <p className="msg err mt-2 text-xs text-red-600">{feedback}</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
