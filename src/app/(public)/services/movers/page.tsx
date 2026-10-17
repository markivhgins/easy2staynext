import React from 'react';
import { ServiceIntakeForm } from '@/components/ui/ServiceIntakeForm';

export const metadata = {
  title: 'Packers & Movers in Noida & Delhi NCR | Find2Stay',
  description:
    'Vetted local shifting and home relocation partners in Noida & Delhi NCR. Transparent written quotes with zero hidden charges.',
};

export default function MoversServicePage() {
  return (
    <>
      <section className="head">
        <div className="wrap hd">
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="wow-pill">📦 Zero-Damage Transit</span>
              <span className="wow-pill">⚡ Transparent Binding Quotes</span>
              <span className="wow-pill">🚚 Delhi NCR Corridors Covered</span>
            </div>
            <h1>Packers &amp; Movers in Noida &amp; Delhi NCR</h1>
            <p>
              Tell us about your shifting needs. Verified packers &amp; movers review your route and inventory to provide
              competitive quotes directly to you across Noida, Greater Noida, Ghaziabad, and Gurugram.
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
                  Move Route &amp; House Size
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Provide your pickup/drop locality and volume (1 RK, 1 BHK, 2 BHK, or luggage only).
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Verified Mover Matching
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  We route your requirement to vetted relocation partners operating along your Noida &amp; Delhi NCR transit corridor.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Transparent Quotes
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Receive clear quotes detailing labour, packing materials, and transit vehicle charges upfront.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Hassle-Free Transit
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Coordinate timing directly with your selected mover for a safe, damage-free shifting experience.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <ServiceIntakeForm service="movers" submitLabel="Get Shifting Quotes">
          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Moving From (Locality / City)
            <input
              type="text"
              name="from"
              placeholder="e.g. Sector 62, Noida"
              required
              className="mt-1 w-full"
            />
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Moving To (Locality / City)
            <input
              type="text"
              name="to"
              placeholder="e.g. Sector 137, Noida"
              required
              className="mt-1 w-full"
            />
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Approximate Move Date
            <input
              type="date"
              name="date"
              min={new Date().toISOString().slice(0, 10)}
              defaultValue={new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10)}
              required
              className="mt-1 w-full"
            />
            <small style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: '#64748B' }}>
              Select today or any upcoming relocation date.
            </small>
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Move Size
            <select name="size" className="mt-1 w-full" defaultValue="1 BHK">
              <option value="Few items / Luggage only">Few luggage items / student shifting</option>
              <option value="1 Room / 1 RK">1 Room / 1 RK setup</option>
              <option value="1 BHK">1 BHK apartment</option>
              <option value="2 BHK">2 BHK apartment</option>
              <option value="3 BHK or larger">3 BHK or villa</option>
            </select>
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Packing Assistance
            <select name="packing" className="mt-1 w-full" defaultValue="Full professional packing needed">
              <option value="Full professional packing needed">Full packing + loading + unloading</option>
              <option value="Transport & vehicle only">Vehicle &amp; transport only (self-packed)</option>
            </select>
          </label>
        </ServiceIntakeForm>
      </div>
    </>
  );
}
