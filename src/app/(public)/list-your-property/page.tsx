'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { SUPPORTED_CITIES } from '@/lib/cities';

export default function ListYourPropertyPage() {
  const { city, setCity } = useLocation();
  const [selectedCityId, setSelectedCityId] = useState(city.id);
  const [title, setTitle] = useState('');
  const [locality, setLocality] = useState('');
  const [type, setType] = useState('PG');
  const [gender, setGender] = useState('any');
  const [occupancy, setOccupancy] = useState('single');
  const [bhk, setBhk] = useState('1 BHK');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Auto-populate logged-in user contact
  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.displayName && !data.user.displayName.startsWith('User (')) {
            setName(data.user.displayName);
          }
          if (data.user.phoneE164) {
            const clean10 = data.user.phoneE164.replace(/\D/g, '').slice(-10);
            if (clean10) setPhone(clean10);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentCityObj = SUPPORTED_CITIES.find((c) => c.id === selectedCityId) || city;

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCityId(id);
    const found = SUPPORTED_CITIES.find((c) => c.id === id);
    if (found) {
      setCity(found);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    let count = 0;

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 8MB. Please choose a smaller image.`);
        return;
      }
      formData.append(`file_${count}`, file);
      count++;
    });

    if (count > 0) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data?.urls && Array.isArray(data.urls)) {
          setPhotos((prev) => [...prev, ...data.urls]);
        }
      } catch (err) {
        console.warn('Upload API error, falling back to data URL:', err);
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) setPhotos((prev) => [...prev, result]);
          };
          reader.readAsDataURL(file);
        });
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    } else {
      setIsUploading(false);
    }
  };

  const addPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setPhotos((prev) => [...prev, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const addPresetPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setStatus('error');
      setMessage('Consent is required to submit your listing for physical verification.');
      return;
    }

    if (!title.trim() || !rent) {
      setStatus('error');
      setMessage('Please enter property name and monthly rent.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!name.trim() || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setStatus('error');
      setMessage('Please enter your name and a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          locality: locality ? `${locality}, ${currentCityObj.name}` : currentCityObj.name,
          city: currentCityObj.name,
          type,
          gender,
          occupancy,
          bhk,
          rent,
          deposit: deposit || rent,
          photos,
          name,
          phone: cleanPhone,
          consent: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit property.');

      window.dispatchEvent(new Event('f2s-auth-change'));
      setStatus('success');
      setMessage(data.message);
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="hd">
            <div>
              <h1>List your property</h1>
              <p>
                ₹0 listing fee. Every property is personally audited and verified by our local field operations team before going live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap split2 py-8">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
            What happens next
          </h2>
          <ol className="steps">
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Submit Property Basics
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Fill out your property title, city/locality, rental expectations, and direct mobile number in this form.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Ownership Verification
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Our operations team connects with you to confirm authorized management before scheduling verification.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  In-Person Inspection
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Our local field verifier inspects amenities, checks electricity meters, and captures high-resolution photos.
                </p>
              </div>
            </li>
            <li>
              <div>
                <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--navy)', marginBottom: '3px' }}>
                  Go Live with Verified Badge
                </strong>
                <p style={{ margin: 0, color: 'var(--mut)', fontSize: '14px', lineHeight: 1.5 }}>
                  Your listing is published with the official Find2Stay 180-day audit seal and direct verified inquiries.
                </p>
              </div>
            </li>
          </ol>

          {/* Value Props Card */}
          <div
            style={{
              marginTop: '28px',
              padding: '20px',
              borderRadius: '16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '10px' }}>
              Why Owners Choose Find2Stay
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }}>
              <li><strong>Zero Brokerage:</strong> Connect directly with tenants without paying agent commissions.</li>
              <li><strong>Verified Tenants:</strong> Student and professional leads are authenticated via mobile OTP.</li>
              <li><strong>On-Site Trust Seal:</strong> Properties with physical inspection receive 3x more scheduled visits.</li>
            </ul>
          </div>
        </div>

        <div className="panel" style={{ padding: '28px', borderRadius: '20px', background: '#fff', border: '1px solid var(--line)' }}>
          {status === 'success' ? (
            <div style={{ padding: '24px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>🎉</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', margin: '0 0 8px' }}>
                Listing Draft Submitted!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#15803d', lineHeight: 1.6, margin: '0 0 16px' }}>
                {message || 'Our local operations team will contact you shortly to coordinate your on-site verification inspection.'}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#166534', background: '#dcfce7', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px' }}>
                📋 Your draft has been routed to the <strong>Find2Stay Operations Desk</strong> for initial moderation.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="/owner"
                  className="go"
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '0.95rem',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  🏡 Open My Owner Dashboard →
                </a>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.88rem',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  onClick={() => setStatus('idle')}
                >
                  + Submit Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
                Property Details
              </h2>

              {/* City Selection */}
              <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                City / Location
                <select
                  value={selectedCityId}
                  onChange={handleCityChange}
                  className="mt-1 w-full"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    fontWeight: 600,
                    background: '#f8fafc',
                  }}
                >
                  {SUPPORTED_CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                Property / Building Name
                <input
                  type="text"
                  placeholder="e.g. Triveni Boys Hostel, Sangam Executive Flats"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 w-full"
                />
              </label>

              <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                Locality / Area in {currentCityObj.name}
                <input
                  type="text"
                  placeholder={`e.g. ${currentCityObj.localities[0]?.name || 'Civil Lines'}, ${currentCityObj.localities[1]?.name || 'Campus Gate'}`}
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  required
                  className="mt-1 w-full"
                />
              </label>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Property Type
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 w-full"
                  >
                    <option value="PG">PG / Hostel / Room</option>
                    <option value="FLAT">Flat / Apartment</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Target Occupants
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 w-full"
                  >
                    <option value="any">Anyone / Family</option>
                    <option value="boys">Boys only</option>
                    <option value="girls">Girls only</option>
                    <option value="co-ed">Co-ed</option>
                  </select>
                </label>
              </div>

              {type === 'PG' ? (
                <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                  Room Sharing
                  <select
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value)}
                    className="mt-1 w-full"
                  >
                    <option value="single">Single occupancy</option>
                    <option value="2-share">2-sharing</option>
                    <option value="3-share">3-sharing</option>
                  </select>
                </label>
              ) : (
                <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                  Unit Size
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="mt-1 w-full"
                  >
                    <option value="1 RK">1 RK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                  </select>
                </label>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Monthly Rent (₹)
                  <input
                    type="number"
                    placeholder="e.g. 6500"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    required
                    className="mt-1 w-full"
                  />
                </label>

                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Security Deposit (₹)
                  <input
                    type="number"
                    placeholder="e.g. 6500"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="mt-1 w-full"
                  />
                </label>
              </div>

              {/* Property Photographs & Room Previews */}
              <div
                style={{
                  margin: '24px 0',
                  padding: '18px',
                  borderRadius: '14px',
                  background: '#F8FAFC',
                  border: '1.5px dashed #CBD5E1',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                    📷 Property Photographs &amp; Previews
                  </h3>
                  <span style={{ fontSize: '11.5px', background: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                    {photos.length} {photos.length === 1 ? 'photo' : 'photos'} added
                  </span>
                </div>

                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 14px', lineHeight: 1.5 }}>
                  Add your photos to showcase your rooms, washrooms, and common areas. During your on-site audit, our field verifier will take official inspection photos for the verified badge.
                </p>

                {/* Upload from device & Preset buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'var(--navy)',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{isUploading ? '⏳ Uploading Photos...' : '📁 Upload from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => addPresetPhoto('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Sample Room
                  </button>

                  <button
                    type="button"
                    onClick={() => addPresetPhoto('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Washroom
                  </button>

                  <button
                    type="button"
                    onClick={() => addPresetPhoto('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Living Area
                  </button>
                </div>

                {/* Photo URL Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="url"
                    placeholder="Or paste an image web link (https://...)"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12.5px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                    }}
                  />
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#E2E8F0',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Add Link
                  </button>
                </div>

                {/* Photo Thumbnails Preview Grid */}
                {photos.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                      gap: '10px',
                      marginTop: '12px',
                    }}
                  >
                    {photos.map((url, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          height: '75px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1.5px solid #CBD5E1',
                          background: '#000',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Uploaded preview ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          aria-label="Remove photo"
                          style={{
                            position: 'absolute',
                            top: '3px',
                            right: '3px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ✕
                        </button>
                        {idx === 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '2px',
                              background: '#1648E8',
                              color: '#fff',
                              fontSize: '9px',
                              fontWeight: 700,
                              padding: '1px 4px',
                              borderRadius: '3px',
                            }}
                          >
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginTop: '20px', marginBottom: '10px' }}>
                Owner / Caretaker Contact
              </h3>

              <label className="block mb-3 text-xs font-semibold uppercase text-gray-500">
                Your Full Name
                <input
                  type="text"
                  placeholder="e.g. Rajesh Srivastava"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="mt-1 w-full"
                />
              </label>

              <label className="block mb-4 text-xs font-semibold uppercase text-gray-500">
                10-Digit Mobile Number
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  className="mt-1 w-full"
                />
              </label>

              <label className="chk block my-4 text-xs text-gray-600" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  I declare that I own or am authorized to manage this property, and consent to Find2Stay field team visiting for on-site physical inspection.
                </span>
              </label>

              <button
                type="submit"
                className="go w-full"
                disabled={status === 'loading'}
                style={{ padding: '14px', fontSize: '1rem', borderRadius: '12px' }}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Property for Verification Audit →'}
              </button>

              {status === 'error' && (
                <p className="msg err mt-3 text-xs text-red-600" style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
