'use client';

import React, { useState } from 'react';

interface PreviewRow {
  rowIndex: number;
  title: string;
  city: string;
  locality: string;
  type: string;
  rent: number;
  phone: string;
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
  propertyId?: string;
}

export const BulkPropertyUploader: React.FC<{ onImportSuccess?: () => void }> = ({ onImportSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    totalRows: number;
    validCount: number;
    failedCount: number;
    rows: PreviewRow[];
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadTemplate = () => {
    window.location.href = '/api/owner/bulk-template';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatusMessage(null);

    // Run preview validation immediately
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selected);
    formData.append('dryRun', 'true');

    try {
      const res = await fetch('/api/owner/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to parse CSV file.');
      setPreviewData(data);
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dryRun', 'false');

    try {
      const res = await fetch('/api/owner/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Import failed.');
      setStatusMessage({ type: 'success', text: data.message });
      setPreviewData(null);
      setFile(null);
      if (onImportSuccess) {
        setTimeout(() => {
          onImportSuccess();
        }, 1500);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '9px 16px',
          borderRadius: '10px',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          color: 'var(--navy)',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>📁</span> Bulk Upload (Brokers &amp; PG Chains)
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: '16px',
            padding: '24px',
            background: '#ffffff',
            border: '1.5px solid #bfdbfe',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(11,35,80,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px' }}>
                Bulk Property Upload (Excel / CSV)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--mut)', margin: 0 }}>
                Upload multiple listings in seconds. Every property is validated and duplicate-checked before submission.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: 'var(--blue)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              📥 Download CSV Template
            </button>
          </div>

          {/* Upload input zone */}
          <div
            style={{
              border: '2px dashed #93c5fd',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              background: '#f8fafc',
              marginBottom: '16px',
            }}
          >
            <input
              type="file"
              id="bulkCsvFile"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="bulkCsvFile"
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '2rem' }}>📊</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>
                {file ? file.name : 'Click to select or drop your .csv file here'}
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--mut)' }}>
                CSV format supported (Max 500 listings per batch)
              </span>
            </label>
          </div>

          {isLoading && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--blue)', fontSize: '0.9rem', fontWeight: 600 }}>
              ⏳ Processing and validating records...
            </div>
          )}

          {statusMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: statusMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: statusMessage.type === 'success' ? '#166534' : '#991b1b',
                border: `1px solid ${statusMessage.type === 'success' ? '#86efac' : '#fca5a5'}`,
              }}
            >
              {statusMessage.text}
            </div>
          )}

          {/* Validation & Preview Table */}
          {previewData && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 700 }}>
                  Preview: {previewData.validCount} valid properties ({previewData.failedCount} with errors or duplicates)
                </div>
                {previewData.validCount > 0 && (
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={isLoading}
                    className="go"
                    style={{
                      padding: '8px 18px',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                    }}
                  >
                    Confirm &amp; Import {previewData.validCount} Properties →
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead style={{ background: '#f1f5f9', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px 12px' }}>#</th>
                      <th style={{ padding: '8px 12px' }}>Property Title</th>
                      <th style={{ padding: '8px 12px' }}>Locality</th>
                      <th style={{ padding: '8px 12px' }}>Rent</th>
                      <th style={{ padding: '8px 12px' }}>Phone</th>
                      <th style={{ padding: '8px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #e2e8f0', background: r.isValid ? '#ffffff' : '#fef2f2' }}>
                        <td style={{ padding: '8px 12px', color: 'var(--mut)' }}>{r.rowIndex}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.title || 'Untitled'}</td>
                        <td style={{ padding: '8px 12px' }}>{r.locality}, {r.city}</td>
                        <td style={{ padding: '8px 12px' }}>₹{r.rent}</td>
                        <td style={{ padding: '8px 12px' }}>{r.phone}</td>
                        <td style={{ padding: '8px 12px' }}>
                          {r.isValid ? (
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Ready</span>
                          ) : (
                            <span style={{ color: '#dc2626', fontWeight: 600 }}>
                              ✕ {r.errors.join(', ')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
