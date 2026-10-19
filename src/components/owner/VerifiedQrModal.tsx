'use client';

import React, { useState, useEffect } from 'react';

interface VerifiedQrModalProps {
  propertyId: string;
  title: string;
  slugOrId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VerifiedQrModal: React.FC<VerifiedQrModalProps> = ({
  propertyId,
  title,
  slugOrId,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && slugOrId) {
      setLoading(true);
      const targetUrl = `${window.location.origin}/listing/${slugOrId}`;
      fetch(`/api/listings/qr?id=${encodeURIComponent(propertyId)}&url=${encodeURIComponent(targetUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.qrDataUrl) {
            setQrDataUrl(data.qrDataUrl);
          }
        })
        .catch((err) => console.error('Failed to load QR code:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, propertyId, slugOrId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Find2Stay_${propertyId}_Verified_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          textAlign: 'center',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          ✕
        </button>

        {/* Header Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: '#dcfce7',
            color: '#166534',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          <span>✓</span> Official Find2Stay Verified Seal
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--mut)', margin: '0 0 16px' }}>
          Display this QR code at your entrance or reception desk for instant prospective tenant audits.
        </p>

        {/* QR Code Container */}
        <div
          style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            display: 'inline-block',
            margin: '0 auto 16px',
          }}
        >
          {loading ? (
            <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', fontWeight: 600 }}>
              Generating Verified QR...
            </div>
          ) : qrDataUrl ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Find2Stay Verified Property QR"
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
              <div
                style={{
                  marginTop: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--navy)',
                  letterSpacing: '0.05em',
                }}
              >
                {propertyId}
              </div>
            </div>
          ) : (
            <div style={{ color: 'red', fontSize: '0.85rem' }}>Failed to generate QR</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="go"
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📥 Download QR
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              fontWeight: 700,
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: 'var(--navy)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🖨️ Print Poster
          </button>
        </div>
      </div>
    </div>
  );
};
