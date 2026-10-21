'use client';

import React from 'react';

export interface ListingPreviewData {
  title: string;
  type: string;
  city: string;
  locality: string;
  fullAddress: string;
  hideExactAddress: boolean;
  landmark?: string;
  nearbyMetroOrCollege?: string;
  rent: number | string;
  deposit: number | string;
  maintenance: number | string;
  electricityBasis: string;
  sharing: string;
  bhk: string;
  furnishing: string;
  suitableFor: string;
  coupleFriendly?: boolean;
  coupleConditions?: string;
  bathroomType: string;
  kitchenAvailable: boolean;
  amenities: string[];
  rules?: string[];
  houseRules?: string[] | string;
  visitorsPolicy?: string;
  photos: string[];
  photosCategorized?: Array<{ url: string; category: string }>;
  videoUrl?: string;
  noticePeriod?: string;
  minimumStay?: string;
  availableFrom: string;
  propertyId?: string;
  ownerName?: string;
  ownerPhone?: string;
  userType?: string;
}

export const ListingPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: ListingPreviewData;
  onSubmit?: () => void;
}> = ({ isOpen, onClose, data, onSubmit }) => {
  if (!isOpen) return null;

  const displayAddress = data.hideExactAddress
    ? `[Exact Door / Unit number protected until visit confirmation], ${data.locality || 'Locality'}, ${data.city || 'City'}`
    : `${data.fullAddress || data.locality || 'Address'}, ${data.city || 'City'}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', textTransform: 'uppercase' }}>
              👁️ Live Listing Preview
            </span>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              This is how seekers will see your listing once published
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Photos Banner */}
          {data.photos && data.photos.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: data.photos.length > 1 ? 'repeat(auto-fit, minmax(180px, 1fr))' : '1fr',
                gap: '8px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '20px',
                maxHeight: '280px',
              }}
            >
              {data.photos.slice(0, 4).map((p, i) => (
                <div key={i} style={{ height: '200px', position: 'relative', background: '#e2e8f0' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {data.photosCategorized?.[i]?.category && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {data.photosCategorized[i].category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: '160px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: '20px' }}>
              📷 No photos uploaded yet
            </div>
          )}

          {/* Title & Price Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534' }}>
                  ✓ Find2Stay Verified Seal
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  ID: {data.propertyId || 'F2S-PENDING'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                {data.title || 'Untitled Property'}
              </h2>
              <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px' }}>
                📍 {displayAddress}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--blue)' }}>
                ₹{Number(data.rent || 0).toLocaleString('en-IN')}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>/month</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Deposit: ₹{Number(data.deposit || data.rent || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Quick Specs Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              🏠 {data.type} {data.bhk ? `(${data.bhk})` : ''}
            </span>
            <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              👥 {data.sharing} Sharing
            </span>
            <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              🚻 {data.suitableFor}
            </span>
            <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              🛋️ {data.furnishing}
            </span>
            <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              🚿 {data.bathroomType} Bathroom
            </span>
            {data.coupleFriendly && (
              <span style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#be185d' }}>
                💑 Couple Friendly {data.coupleConditions ? `(${data.coupleConditions})` : ''}
              </span>
            )}
            <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              ⚡ Electricity: {data.electricityBasis}
            </span>
          </div>

          {/* Landmarks & Location */}
          {(data.landmark || data.nearbyMetroOrCollege) && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)', marginBottom: '6px' }}>
                Nearby Transit &amp; Landmarks
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                {data.landmark && <div>🏛️ <strong>Landmark:</strong> {data.landmark}</div>}
                {data.nearbyMetroOrCollege && <div>🚇 <strong>Metro / College:</strong> {data.nearbyMetroOrCollege}</div>}
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px' }}>
              Included Facilities &amp; Amenities
            </h4>
            {data.amenities && data.amenities.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                {data.amenities.map((am, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {am}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Standard amenities will be verified during on-site visit.</div>
            )}
          </div>

          {/* Rules & Policy */}
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#92400e', marginBottom: '4px' }}>
              📋 Stay Rules &amp; Move-in Terms
            </div>
            <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.6 }}>
              <div>• Minimum Stay: <strong>{data.minimumStay || '1 Month'}</strong> | Notice Period: <strong>{data.noticePeriod || '1 Month'}</strong></div>
              <div>• Move-in Date: <strong>{data.availableFrom || 'Immediate'}</strong></div>
              {data.rules && data.rules.length > 0 && (
                <div style={{ marginTop: '4px' }}>
                  {data.rules.map((r, i) => <div key={i}>• {r}</div>)}
                </div>
              )}
            </div>
          </div>

          {data.videoUrl && (
            <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--blue)' }}>
              🎥 <strong>Video Walkthrough Link:</strong> <a href={data.videoUrl} target="_blank" rel="noreferrer">{data.videoUrl}</a>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {onSubmit ? 'Back to Edit' : 'Done Previewing'}
            </button>
            {onSubmit && (
              <button
                type="button"
                onClick={onSubmit}
                className="go"
                style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '0.88rem' }}
              >
                Submit Listing Now 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
