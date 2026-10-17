'use client';

import React, { useState, useRef } from 'react';

interface OwnerPhotoUploaderProps {
  draftId: string;
  initialPhotos?: string[];
}

export function OwnerPhotoUploader({ draftId, initialPhotos = [] }: OwnerPhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    let count = 0;

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 8MB.`);
        return;
      }
      formData.append(`file_${count}`, file);
      count++;
    });

    if (count === 0) {
      setIsUploading(false);
      return;
    }

    try {
      // 1. Upload file to server disk
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData?.urls && Array.isArray(uploadData.urls)) {
        const newUrls: string[] = uploadData.urls;

        // 2. Attach new photo URLs to the listing/draft record
        await fetch('/api/owner/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftId,
            photoUrls: newUrls,
          }),
        });

        setPhotos((prev) => [...prev, ...newUrls]);
      }
    } catch (err) {
      alert('Photo upload failed: ' + (err as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          📷 {photos.length} Photos {isOpen ? '▲' : '▼'}
        </button>

        <label
          style={{
            background: '#EEF4FF',
            border: '1px solid #C7D7FE',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#1648E8',
            cursor: isUploading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>{isUploading ? '⏳ Uploading...' : '+ Add Photos'}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={isUploading}
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {photos.length === 0 ? (
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              No photos added yet. Click &quot;+ Add Photos&quot; to upload room images.
            </span>
          ) : (
            photos.map((url, idx) => (
              <div
                key={idx}
                style={{
                  width: '64px',
                  height: '50px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #e2e8f0',
                  background: '#f1f5f9',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Photo ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
