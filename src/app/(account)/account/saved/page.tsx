import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { SavedListingsView } from '@/components/account/SavedListingsView';

export const metadata = {
  title: 'Saved Stays & Wishlist | Find2Stay',
  description: 'View and manage your saved and favorited properties.',
};

export default async function SavedStaysPage() {
  const user = await getCurrentUser();
  const phone = user?.phoneE164 || '';
  const displayName = user?.displayName || (phone ? `User (${phone.slice(-4)})` : 'Guest Visitor');

  return (
    <>
      <section className="head">
        <div className="wrap">
          <h1>Saved Stays &amp; Wishlist</h1>
          <p>
            Your favorited rooms, flats, and societies saved for easy comparison and instant visit booking.
          </p>
        </div>
      </section>

      <div
        className="wrap desk"
        style={{
          marginTop: '24px',
          marginBottom: '80px',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1px solid var(--line)',
        }}
      >
        <aside>
          <small>{user ? 'Verified Account' : 'Guest Account'}</small>
          <b>{displayName}</b>
          {phone && (
            <p style={{ fontSize: '13px', color: '#BFD0FF', marginBottom: '18px' }}>
              {phone}
            </p>
          )}

          <nav>
            <Link href="/account/profile">
              👤 My Profile
            </Link>
            <Link href="/account/saved" style={{ color: '#9DB6FF', fontWeight: 700 }}>
              ❤️ Saved Stays
            </Link>
            <Link href="/account/activity">
              📋 Visits &amp; Requests
            </Link>
            <Link href="/pg">
              🔍 Browse Stays
            </Link>
            <Link href="/owner" style={{ color: '#6EE7B7', fontWeight: 700 }}>
              🏡 Owner Workspace
            </Link>
          </nav>

          {user ? (
            <a className="out" href="/api/auth/logout">
              Sign out
            </a>
          ) : (
            <Link className="out" href="/auth" style={{ textAlign: 'center' }}>
              Sign In
            </Link>
          )}
        </aside>

        <div>
          <SavedListingsView />
        </div>
      </div>
    </>
  );
}
