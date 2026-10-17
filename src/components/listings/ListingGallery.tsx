'use client';

import React, { useState } from 'react';
import { FloorPlan } from './FloorPlan';
import { SaveListingButton } from './SaveListingButton';

interface ListingGalleryProps {
  slug: string;
  title: string;
  verifiedAgo: string;
  photoIds?: string[];
  photos?: (string | { storageKey: string; caption?: string; order?: number })[];
  bhk?: string;
  occupancy?: string;
}

export function ListingGallery({
  slug,
  title,
  verifiedAgo,
  photoIds = [],
  photos,
  bhk,
  occupancy,
}: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images =
    photos && photos.length > 0
      ? photos
          .map((p) => {
            const val = typeof p === 'string' ? p : p?.storageKey || '';
            if (!val) return '';
            if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/uploads/') || val.startsWith('/img/') || val.startsWith('data:')) {
              return val;
            }
            if (val.startsWith('pg-') || val.startsWith('flat-')) {
              return photoIds[0]
                ? `https://images.unsplash.com/photo-${photoIds[0]}?auto=format&fit=crop&q=80&w=1400`
                : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1400';
            }
            return `https://images.unsplash.com/photo-${val}?auto=format&fit=crop&q=80&w=1400`;
          })
          .filter(Boolean)
      : photoIds.map(
          (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1400`
        );

  return (
    <div style={{ position: 'relative', marginBottom: '24px' }}>
      {/* Main Gallery Card */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E2E8F0',
          background: '#0B132B',
        }}
      >
        {/* Aspect Ratio Container for Main Display */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showFloorPlan ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                background: '#0F172A',
              }}
            >
              <FloorPlan bhk={bhk} occupancy={occupancy} />
              <p
                style={{
                  fontSize: '12px',
                  color: '#94A3B8',
                  marginTop: '12px',
                  fontFamily: 'monospace',
                }}
              >
                Architectural layout reference • {bhk || occupancy || 'Verified Unit'}
              </p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[activeIndex] || images[0]}
              alt={`${title} - Photo ${activeIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                display: 'block',
              }}
              onClick={() => setIsModalOpen(true)}
            />
          )}

          {/* Verification Badge (Fixed Sizing & Positioning) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(11, 35, 80, 0.90)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.18)',
              pointerEvents: 'none',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="#60A5FA"
              style={{ width: '15px', height: '15px', flexShrink: 0, display: 'inline-block' }}
            >
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
            </svg>
            <span>On-site checked {verifiedAgo}</span>
          </div>

          {/* Save & Action Buttons */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <SaveListingButton slug={slug} title={title} />
          </div>

          {/* Prev / Next Carousel Buttons */}
          {!showFloorPlan && images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                aria-label="Previous photo"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '22px',
                  lineHeight: '1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9,
                  transition: 'background 0.2s',
                }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                aria-label="Next photo"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '22px',
                  lineHeight: '1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9,
                  transition: 'background 0.2s',
                }}
              >
                ›
              </button>
            </>
          )}

          {/* Bottom Bar Controls: Toggle View & Fullscreen */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '14px',
              right: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={() => setShowFloorPlan(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: !showFloorPlan ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
                  color: !showFloorPlan ? '#0B2350' : '#ffffff',
                  backdropFilter: 'blur(8px)',
                  boxShadow: !showFloorPlan ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                Photos ({images.length})
              </button>
              <button
                type="button"
                onClick={() => setShowFloorPlan(true)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: showFloorPlan ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
                  color: showFloorPlan ? '#0B2350' : '#ffffff',
                  backdropFilter: 'blur(8px)',
                  boxShadow: showFloorPlan ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                Floor Plan
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: '14px', height: '14px', display: 'inline-block' }}
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              View Fullscreen
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        {!showFloorPlan && images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '10px 14px',
              background: '#0B132B',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {images.map((imgUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: '64px',
                  height: '48px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: activeIndex === i ? '2px solid #3B82F6' : '2px solid transparent',
                  opacity: activeIndex === i ? 1 : 0.6,
                  cursor: 'pointer',
                  padding: 0,
                  background: '#000',
                  transform: activeIndex === i ? 'scale(1.04)' : 'none',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(10px)',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          {/* Header Controls */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              zIndex: 10000,
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600 }}>
              {activeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close fullscreen view"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Modal Main Image */}
          <div
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '82vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIndex]}
              alt={title}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                borderRadius: '12px',
                objectFit: 'contain',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                  }
                  style={{
                    position: 'absolute',
                    left: '-48px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                  }
                  style={{
                    position: 'absolute',
                    right: '-48px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
            }}
          >
            {title} · Verified by Find2Stay field auditor
          </div>
        </div>
      )}
    </div>
  );
}
