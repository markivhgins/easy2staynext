import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'How Verification Works | Find2Stay',
  description:
    'Our rigorous physical on-site verification methodology. What we check, what we do not promise, and how we protect seekers.',
};

export default function HowVerificationWorksPage() {
  return (
    <>
      <section className="head">
        <div className="wrap">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="wow-pill">🛡️ 180-Day Physical Audit</span>
            <span className="wow-pill">📍 Geolocation &amp; Meter Verification</span>
            <span className="wow-pill">🚫 Zero Paid / Sponsored Badges</span>
          </div>
          <h1>What &ldquo;Verified&rdquo; means at Find2Stay</h1>
          <p>
            Specific physical checks, timestamped evidence, transparent validity limits. Never an unearned paid badge.
          </p>
        </div>
      </section>

      <div className="wrap narrow py-12 space-y-8">
        <div>
          <h2>What our field verifiers inspect</h2>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-700">
            <li>
              <strong>Physical existence &amp; GPS coordinates:</strong> A field verifier physically visits the premises
              to match exact geolocation with the published pin area.
            </li>
            <li>
              <strong>Real photographs:</strong> Verifiers shoot or confirm authentic interior room photos, washrooms,
              and common areas so you never arrive at a stock photo surprise.
            </li>
            <li>
              <strong>Management authority:</strong> We confirm the identity and management authority of the landlord or
              caretaker.
            </li>
            <li>
              <strong>Price &amp; bill transparency:</strong> We verify the exact per-bed/per-unit rent, deposit refund
              terms, and electricity billing policy (metered vs inclusive).
            </li>
          </ul>
        </div>

        <div>
          <h2>What we do not claim</h2>
          <p className="text-gray-700 leading-relaxed">
            We verify the physical property and announced terms as of the inspection date. We do not guarantee future
            behavior of landlords or roommates, and we do not provide title certification. Always review house rules
            before moving in.
          </p>
        </div>

        <div>
          <h2>Verification expires</h2>
          <p className="text-gray-700 leading-relaxed">
            Every verification certificate has a maximum validity of 180 days. Furthermore, property availability is
            tracked separately: if an owner does not reconfirm vacancy within 14 days, the listing is automatically
            flagged as stale and deprioritized in search.
          </p>
        </div>

        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Spot a listing discrepancy?</h3>
          <p className="text-sm text-blue-800 mb-4">
            If you visit a property and find that the price, room condition, or rules differ from what is published on
            Find2Stay, let our operations team know immediately. We review reports within 24 hours and pause offending
            listings.
          </p>
          <Link href="/help" className="go inline-block">
            Report an issue &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
