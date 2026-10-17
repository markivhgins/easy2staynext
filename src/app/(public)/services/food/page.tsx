import React from 'react';
import { ServiceIntakeForm } from '@/components/ui/ServiceIntakeForm';

export const metadata = {
  title: 'Tiffin & Home-Style Meal Services in Noida & Delhi NCR | Find2Stay',
  description:
    'Connect with vetted tiffin centers and home kitchens across Noida and Delhi NCR delivering healthy daily meals.',
};

export default function FoodServicePage() {
  return (
    <>
      <section className="head">
        <div className="wrap hd">
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="wow-pill">🥗 FSSAI-Audited Kitchens</span>
              <span className="wow-pill">⚡ Direct Kitchen Pricing</span>
              <span className="wow-pill">🍲 Free Sample Trial Options</span>
            </div>
            <h1>Tiffin &amp; Daily Meals in Noida &amp; Delhi NCR</h1>
            <p>
              Wholesome home-style meals from approved local kitchens. Providers set their price directly: transparent menu, zero middleman markups.
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
                  Meal Preference &amp; Locality
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Select your dietary choices (veg/non-veg) and delivery locality across Noida, Greater Noida, or Ghaziabad.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Approved Kitchen Routing
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  We route your requirement to an FSSAI-audited kitchen partner in your specific neighbourhood.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Provider Direct Contact
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  The kitchen operator contacts you with trial meal pricing, menu options, and delivery schedules.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Hygiene Quality Guarantee
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Rate and provide feedback on your meal quality to ensure transparent standards.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <ServiceIntakeForm service="food" submitLabel="Connect me to kitchen">
          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Delivery Locality
            <input
              type="text"
              name="locality"
              placeholder="e.g. Sector 62, Sector 126, Indirapuram"
              required
              className="mt-1 w-full"
            />
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Meals per day
            <select name="meals" className="mt-1 w-full" defaultValue="2 meals (Lunch + Dinner)">
              <option value="1 meal (Lunch or Dinner)">1 meal a day (Lunch or Dinner)</option>
              <option value="2 meals (Lunch + Dinner)">2 meals a day (Lunch + Dinner)</option>
              <option value="3 meals (Breakfast + Lunch + Dinner)">3 meals a day (All meals)</option>
            </select>
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Dietary Preference
            <select name="diet" className="mt-1 w-full" defaultValue="Vegetarian">
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Non-vegetarian">Non-vegetarian allowed</option>
              <option value="Jain food">Jain preparation</option>
            </select>
          </label>

          <label className="block mb-2 text-xs font-semibold uppercase text-gray-500">
            Start Date
            <input
              type="date"
              name="startDate"
              className="mt-1 w-full"
            />
          </label>
        </ServiceIntakeForm>
      </div>
    </>
  );
}
