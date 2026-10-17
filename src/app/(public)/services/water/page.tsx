import React from 'react';
import { ServiceIntakeForm } from '@/components/ui/ServiceIntakeForm';

export const metadata = {
  title: 'RO Water Jar Delivery in Noida & Delhi NCR | Find2Stay',
  description:
    'Reliable 20L and 10L sealed RO drinking water jar delivery to your doorstep across Noida and Delhi NCR.',
};

export default function WaterServicePage() {
  return (
    <>
      <section className="head">
        <div className="wrap hd">
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="wow-pill">💧 ISI-Certified RO Plants</span>
              <span className="wow-pill">⚡ Tamper-Proof 20L Seals</span>
              <span className="wow-pill">⏰ On-Time Morning Delivery</span>
            </div>
            <h1>RO Water Jars in Noida &amp; Delhi NCR</h1>
            <p>
              Regular drinking water jar delivery. Pricing, billing and returnable container deposit arrangements are
              handled transparently by verified suppliers across Noida and Delhi NCR.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap split2">
        <div>
          <h2>How it works</h2>
          <ol className="steps">
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Jar Requirement &amp; Locality
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Specify your weekly jar quantity (20L chilled/normal) and your street address across Noida &amp; Delhi NCR.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Licensed RO Plant Routing
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  We route your connection request to a licensed, certified RO purification supplier in your locality.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Deposit &amp; Rate Confirmation
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  The local supplier confirms standard per-jar refill pricing and refundable jar deposit terms upfront.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Predictable Doorstep Delivery
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Enjoy reliable, daily or alternate-day morning delivery directly to your room or flat.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <ServiceIntakeForm service="water" submitLabel="Connect to water supplier">
          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Delivery Address or Locality
            <input
              type="text"
              name="locality"
              placeholder="e.g. Sector 75, Sector 137, Indirapuram"
              required
              className="mt-1 w-full"
            />
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Container Size
            <select name="size" className="mt-1 w-full" defaultValue="20L jar">
              <option value="20L jar">20L sealed jar</option>
              <option value="10L jar">10L jar</option>
              <option value="Camper (chilled)">Camper (insulated chilled)</option>
            </select>
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Delivery Frequency
            <select name="freq" className="mt-1 w-full" defaultValue="Daily">
              <option value="Daily">Daily</option>
              <option value="Alternate days">Alternate days</option>
              <option value="Weekly (as needed)">Weekly (on-call)</option>
            </select>
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Number of Jars per delivery
            <input
              type="number"
              name="qty"
              min="1"
              defaultValue="1"
              className="mt-1 w-full"
            />
          </label>
        </ServiceIntakeForm>
      </div>
    </>
  );
}
