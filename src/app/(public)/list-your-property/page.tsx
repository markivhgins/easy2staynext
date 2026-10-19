'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import { SUPPORTED_CITIES } from '@/lib/cities';
import { ListingPreviewModal, ListingPreviewData } from '@/components/owner/ListingPreviewModal';
import { BulkPropertyUploader } from '@/components/owner/BulkPropertyUploader';

const AMENITIES_LIST = [
  'High-Speed Wi-Fi',
  'Air Conditioner (AC)',
  'Ceiling Fan',
  'Bed & Mattress',
  'Wardrobe / Almirah',
  'Study Table & Chair',
  'Washing Machine',
  'Geyser (Hot Water)',
  'RO Drinking Water',
  'Tiffin / Meal Service',
  '100% Power Backup',
  'Elevator / Lift',
  '2-Wheeler Parking',
  '4-Wheeler Parking',
  'CCTV & 24x7 Security',
  'Separate Entrance',
];

const USER_TYPES = [
  { id: 'Individual Property Owner', label: 'Individual Property Owner', icon: '🏡', desc: 'Direct owner renting out flat or room' },
  { id: 'Broker / Property Dealer', label: 'Broker / Property Dealer', icon: '🤝', desc: 'Authorized agent managing listings' },
  { id: 'PG / Hostel Owner', label: 'PG / Hostel Owner', icon: '🏢', desc: 'Commercial hostel or paying guest stay' },
  { id: 'Builder / Society / Property Manager', label: 'Society / Property Manager', icon: '🏙️', desc: 'Gated community, society or builder' },
];

export default function ListYourPropertyPage() {
  const { city, setCity } = useLocation();

  // Navigation & Wizard State (3 High-Level Phases / 6 Sub-steps)
  // Phase 1: Steps 1 & 2 (Basic Info & Property Type)
  // Phase 2: Steps 3, 4 & 5 (Location, Rent & Facilities)
  // Phase 3: Step 6 (Photos, Verification & Submit)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Owner / Partner Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('Individual Property Owner');
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);

  // OTP Verification Simulation & Autofill for Showcase
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Step 2: Property Details
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PG');
  const [furnishing, setFurnishing] = useState('Furnished');
  const [sharing, setSharing] = useState('Single');
  const [suitableFor, setSuitableFor] = useState('Boys');
  const [coupleFriendly, setCoupleFriendly] = useState(false);
  const [coupleConditions, setCoupleConditions] = useState('');
  const [bathroomType, setBathroomType] = useState('Attached');
  const [kitchenAvailable, setKitchenAvailable] = useState(true);
  const [bhk, setBhk] = useState('1 BHK');
  const [totalRooms, setTotalRooms] = useState('1');
  const [availableRooms, setAvailableRooms] = useState('1');
  const [roomSize, setRoomSize] = useState('');

  // Step 3: Location Details
  const [selectedCityId, setSelectedCityId] = useState(city.id);
  const [locality, setLocality] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [nearbyMetroOrCollege, setNearbyMetroOrCollege] = useState('');
  const [hideExactAddress, setHideExactAddress] = useState(true);
  const [gpsCoordinates, setGpsCoordinates] = useState<[number, number]>([77.391, 28.5355]);

  // Step 4: Rent & Availability
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [maintenance, setMaintenance] = useState('0');
  const [electricityBasis, setElectricityBasis] = useState('METERED');
  const [brokerage, setBrokerage] = useState('0');
  const [minimumStay, setMinimumStay] = useState('1 Month');
  const [noticePeriod, setNoticePeriod] = useState('1 Month');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('AVAILABLE');

  // Step 5: Facilities & Rules
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed Wi-Fi',
    'Ceiling Fan',
    'Bed & Mattress',
    'RO Drinking Water',
  ]);
  const [visitorsPolicy, setVisitorsPolicy] = useState('Allowed (Daytime)');
  const [petsPolicy, setPetsPolicy] = useState('Not Allowed');
  const [smokingPolicy, setSmokingPolicy] = useState('Strictly Prohibited');
  const [houseRules, setHouseRules] = useState('');

  // Step 6: Photos, Video & Verification
  const [photos, setPhotos] = useState<string[]>([]);
  const [photosCategorized, setPhotosCategorized] = useState<Array<{ url: string; category: string }>>([]);
  const [selectedCategoryForNextPhoto, setSelectedCategoryForNextPhoto] = useState('Room');
  const [videoUrl, setVideoUrl] = useState('');
  const [consent, setConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Duplicate Check Alert State
  const [duplicateWarning, setDuplicateWarning] = useState<{ isDuplicate: boolean; matchedTitle?: string; matchedId?: string } | null>(null);

  // Submission / Preview / Draft Status
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [createdPropertyId, setCreatedPropertyId] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Auto-populate logged-in user contact
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.displayName && !data.user.displayName.startsWith('User (')) {
            setName(data.user.displayName);
          }
          if (data.user.phoneE164) {
            const clean10 = data.user.phoneE164.replace(/\D/g, '').slice(-10);
            if (clean10) {
              setPhone(clean10);
              setOtpVerified(true);
            }
          }
          if (data.user.email) {
            setEmail(data.user.email);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Set today as min date for move-in date
  const todayDateString = new Date().toISOString().split('T')[0];

  const currentCityObj = SUPPORTED_CITIES.find((c) => c.id === selectedCityId) || city;

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCityId(id);
    const found = SUPPORTED_CITIES.find((c) => c.id === id);
    if (found) {
      setCity(found);
      setGpsCoordinates([found.lng, found.lat]);
    }
  };

  // OTP Handlers
  const handleSendOtp = () => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setOtpLoading(false);
    }, 600);
  };

  const handleAutofillOtp = () => {
    setOtpCode('123456');
    setOtpVerified(true);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length >= 4) {
      setOtpVerified(true);
    } else {
      alert('Please enter the 6-digit OTP.');
    }
  };

  // Toggle amenity
  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Duplicate Check Trigger
  const triggerDuplicateCheck = async () => {
    if (!phone || (!title && !locality)) return;
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHECK_DUPLICATE',
          phone,
          title,
          locality,
          fullAddress,
        }),
      });
      const data = await res.json();
      if (data?.isDuplicate) {
        setDuplicateWarning(data);
      } else {
        setDuplicateWarning(null);
      }
    } catch {}
  };

  // File Upload Handler (with categorized tagging)
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
          const newUrls = data.urls as string[];
          setPhotos((prev) => [...prev, ...newUrls]);
          const newCategorized = newUrls.map((url) => ({
            url,
            category: selectedCategoryForNextPhoto,
          }));
          setPhotosCategorized((prev) => [...prev, ...newCategorized]);
        }
      } catch (err) {
        console.warn('Upload API error, falling back to data URL:', err);
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) {
              setPhotos((prev) => [...prev, result]);
              setPhotosCategorized((prev) => [
                ...prev,
                { url: result, category: selectedCategoryForNextPhoto },
              ]);
            }
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

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosCategorized((prev) => prev.filter((_, i) => i !== index));
  };

  // Save As Draft Action
  const handleSaveDraft = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_DRAFT',
          title: title || 'Untitled Property Draft',
          city: currentCityObj.name,
          locality,
          fullAddress,
          landmark,
          nearbyMetroOrCollege,
          hideExactAddress,
          type,
          bhk,
          furnishing,
          sharing,
          suitableFor,
          coupleFriendly,
          coupleConditions,
          bathroomType,
          kitchenAvailable,
          totalRooms,
          availableRooms,
          roomSize,
          rent: rent || 0,
          deposit: deposit || rent || 0,
          maintenance,
          electricityBasis,
          brokerage,
          minimumStay,
          noticePeriod,
          availableFrom,
          amenities: selectedAmenities,
          visitorsPolicy,
          petsPolicy,
          smokingPolicy,
          houseRules,
          photos,
          photosCategorized,
          videoUrl,
          name: name || 'Property Owner',
          phone: phone || '',
          whatsapp: whatsappSameAsPhone ? phone : whatsapp,
          email,
          userType,
          authorisationConfirmed: ownershipConfirmed,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save draft.');
      setCreatedPropertyId(data.propertyId);
      setStatus('success');
      setMessage(`Draft saved! Property ID: ${data.propertyId}. You can find and resume editing in your Owner Dashboard.`);
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  // Submit For Verification Action
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!ownershipConfirmed && !consent) {
      setStatus('error');
      setMessage('Please confirm ownership / authorization declaration before submitting.');
      return;
    }

    if (!title.trim() || !rent) {
      setStatus('error');
      setMessage('Please enter property name and monthly rent.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!name.trim() || cleanPhone.length !== 10) {
      setStatus('error');
      setMessage('Please enter your name and a valid 10-digit mobile number.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT',
          title,
          city: currentCityObj.name,
          locality: locality || currentCityObj.name,
          fullAddress,
          landmark,
          nearbyMetroOrCollege,
          hideExactAddress,
          coordinates: gpsCoordinates,
          type,
          bhk,
          furnishing,
          sharing,
          suitableFor,
          coupleFriendly,
          coupleConditions,
          bathroomType,
          kitchenAvailable,
          totalRooms,
          availableRooms,
          roomSize,
          rent,
          deposit: deposit || rent,
          maintenance,
          electricityBasis,
          brokerage,
          minimumStay,
          noticePeriod,
          availableFrom,
          amenities: selectedAmenities,
          visitorsPolicy,
          petsPolicy,
          smokingPolicy,
          houseRules,
          photos,
          photosCategorized,
          videoUrl,
          name,
          phone: cleanPhone,
          whatsapp: whatsappSameAsPhone ? cleanPhone : whatsapp,
          email,
          userType,
          authorisationConfirmed: true,
          consent: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit property.');

      setCreatedPropertyId(data.propertyId);
      window.dispatchEvent(new Event('f2s-auth-change'));
      setStatus('success');
      setMessage(data.message);
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  // Prepare data for live preview modal
  const previewData: ListingPreviewData = {
    title: title || 'Aura Stay Executive PG & Flat',
    type,
    city: currentCityObj.name,
    locality: locality || 'Sector 62',
    fullAddress,
    hideExactAddress,
    landmark,
    nearbyMetroOrCollege,
    rent: rent || 8500,
    deposit: deposit || rent || 8500,
    maintenance,
    electricityBasis,
    sharing,
    bhk,
    furnishing,
    suitableFor,
    coupleFriendly,
    coupleConditions,
    bathroomType,
    kitchenAvailable,
    amenities: selectedAmenities,
    rules: [
      `Visitors: ${visitorsPolicy}`,
      `Pets: ${petsPolicy}`,
      `Smoking: ${smokingPolicy}`,
      houseRules,
    ].filter(Boolean),
    photos: photos.length > 0 ? photos : ['/img/hero-stay.png'],
    photosCategorized,
    videoUrl,
    noticePeriod,
    minimumStay,
    availableFrom: availableFrom || 'Immediate',
    propertyId: createdPropertyId || 'F2S-PREVIEW',
  };

  return (
    <>
      {/* 3. Hero Banner Section */}
      <section className="head">
        <div className="wrap">
          <div className="hd" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Find2Stay Owner &amp; Partner Platform
              </span>
              <h1 style={{ marginTop: '8px', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2 }}>
                List Your Property
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#e0f2fe', marginTop: '8px', lineHeight: 1.5, fontWeight: 500 }}>
                Get Genuine Tenants. Reduce Vacancy. Manage Your Listings Easily.
              </p>

              {/* Benefits Checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '0.88rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span> Zero Brokerage Direct Connections
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '0.88rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span> Verified Student &amp; Professional Leads
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '0.88rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span> 180-Day Physical On-Site Inspection Seal
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '0.88rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span> Smart Availability &amp; Verified QR Desk
                </div>
              </div>

              {/* Hero CTA Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
                <a
                  href="#listing-form"
                  className="go"
                  style={{
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    textDecoration: 'none',
                  }}
                >
                  🏡 List Your Property Now
                </a>
                <a
                  href="#how-it-works-roadmap"
                  style={{
                    padding: '12px 22px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ℹ️ How It Works
                </a>
              </div>
            </div>

            {/* Quick Bulk Upload Shortcut Card for Brokers */}
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '18px',
                padding: '22px',
                maxWidth: '340px',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🏢</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
                Brokers &amp; PG Operators?
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#e0f2fe', margin: '0 0 16px', lineHeight: 1.5 }}>
                Have 5+ flats or an entire PG building? Upload all your units at once with our validated CSV tool.
              </p>
              <BulkPropertyUploader />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Wrap */}
      <div className="wrap" id="listing-form" style={{ maxWidth: '1180px', margin: '36px auto 80px', padding: '0 16px' }}>
        {/* Success View */}
        {status === 'success' ? (
          <div style={{ padding: '36px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '24px', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#166534', margin: '0 0 8px' }}>
              Listing Successfully Registered!
            </h2>
            <div
              style={{
                display: 'inline-block',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#166534',
                background: '#dcfce7',
                padding: '6px 16px',
                borderRadius: '8px',
                margin: '8px 0 16px',
              }}
            >
              Property ID: {createdPropertyId || 'F2S-REGISTERED'}
            </div>
            <p style={{ fontSize: '0.95rem', color: '#15803d', lineHeight: 1.6, margin: '0 0 24px' }}>
              {message || 'Our local field operations specialist will connect with you to confirm authorized management and coordinate the on-site verification audit.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/owner"
                className="go"
                style={{ padding: '13px 28px', fontSize: '0.95rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}
              >
                🏡 Open Owner Dashboard →
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setCurrentStep(1);
                }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: 'var(--navy)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                + List Another Property
              </button>
            </div>
          </div>
        ) : (
          <div className="lyp-layout">
            {/* Form Column */}
            <div className="lyp-card">
              {/* 3-Phase High-Level Progress Tracker (from handwritten note) */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: currentStep <= 2 ? 'var(--blue)' : '#16a34a' }}>
                    1. Basic Info &amp; Type {currentStep > 2 ? '✓' : ''}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: currentStep >= 3 && currentStep <= 5 ? 'var(--blue)' : currentStep > 5 ? '#16a34a' : 'var(--mut)' }}>
                    2. Location &amp; Rent {currentStep > 5 ? '✓' : ''}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: currentStep === 6 ? 'var(--blue)' : 'var(--mut)' }}>
                    3. Photos &amp; Submit
                  </span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--blue)',
                      width: `${(currentStep / 6) * 100}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Sub-step indicator pills */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {[
                    { s: 1, label: 'Owner Details' },
                    { s: 2, label: 'Property Details' },
                    { s: 3, label: 'Location' },
                    { s: 4, label: 'Rent & Terms' },
                    { s: 5, label: 'Amenities & Rules' },
                    { s: 6, label: 'Photos & Verification' },
                  ].map((item) => (
                    <button
                      key={item.s}
                      type="button"
                      onClick={() => setCurrentStep(item.s)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: currentStep === item.s ? '#eff6ff' : '#f8fafc',
                        color: currentStep === item.s ? 'var(--blue)' : 'var(--mut)',
                        fontSize: '0.75rem',
                        fontWeight: currentStep === item.s ? 800 : 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Step {item.s}: {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duplicate alert if detected */}
              {duplicateWarning && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: '#fffbeb',
                    border: '1.5px solid #fde68a',
                    color: '#92400e',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>⚠️</span>
                  <div>
                    <strong>Potential duplicate listing detected:</strong> Another listing matches your address or title ({duplicateWarning.matchedTitle} - ID: {duplicateWarning.matchedId}). You may still update or save your draft.
                  </div>
                </div>
              )}

              {/* STEP 1: Owner / Partner Details */}
              {currentStep === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                    Step 1: Owner / Partner Details
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
                    Authentic contact verification guarantees direct inquiries without agent spam.
                  </p>

                  {/* 4. Who Can List? Interactive selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                      Who are you? (User Type)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      {USER_TYPES.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => setUserType(u.id)}
                          style={{
                            border: `1.5px solid ${userType === u.id ? 'var(--blue)' : '#e2e8f0'}`,
                            borderRadius: '12px',
                            padding: '12px',
                            cursor: 'pointer',
                            background: userType === u.id ? '#eff6ff' : '#ffffff',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{u.icon}</span>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>{u.label}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="in"
                        placeholder="e.g. Sunil Kumar / Sharma Properties"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Mobile Number + OTP Verification */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Mobile Number (OTP Verification) *
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                          +91
                        </span>
                        <input
                          type="tel"
                          className="in"
                          placeholder="9876543210"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, ''));
                            setOtpVerified(false);
                          }}
                          required
                          style={{ flex: 1, minWidth: '160px' }}
                        />
                        {!otpVerified ? (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading || phone.length !== 10}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: 'var(--blue)',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                          </button>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '10px 14px', background: '#dcfce7', color: '#166534', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 800 }}>
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      {/* OTP Box & Autofill for Showcase */}
                      {otpSent && !otpVerified && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <input
                              type="text"
                              className="in"
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              style={{ width: '160px' }}
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="go"
                              style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }}
                            >
                              Verify OTP
                            </button>
                            <button
                              type="button"
                              onClick={handleAutofillOtp}
                              style={{
                                padding: '8px 12px',
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                background: '#fef3c7',
                                border: '1px solid #fde68a',
                                color: '#b45309',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ⚡ Autofill Demo OTP (123456)
                            </button>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                            Use <strong>123456</strong> or click Autofill for instant demo verification.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Checkbox & Input */}
                    <div>
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--navy)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          style={{ width: '18px', height: '18px', flexShrink: 0, margin: 0, accentColor: '#1d5bd8' }}
                          checked={whatsappSameAsPhone}
                          onChange={(e) => setWhatsappSameAsPhone(e.target.checked)}
                        />
                        <span>WhatsApp number is the same as mobile number</span>
                      </label>
                      {!whatsappSameAsPhone && (
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="tel"
                            className="in"
                            placeholder="WhatsApp Number (e.g. 9811223344)"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        className="in"
                        placeholder="owner@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* Ownership / Authorization Declaration */}
                    <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          style={{ width: '18px', height: '18px', flexShrink: 0, margin: '3px 0 0 0', accentColor: '#1d5bd8' }}
                          checked={ownershipConfirmed}
                          onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                        />
                        <span>
                          <strong>Authorization Declaration:</strong> I confirm that I own this property or am officially authorized by the owner to manage, list, and schedule tenant visits on Find2Stay.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!name.trim() || phone.length !== 10) {
                          alert('Please enter your full name and 10-digit mobile number.');
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      className="go"
                      style={{ padding: '11px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      Next: Property Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Property Details */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                    Step 2: Property Type &amp; Setup
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
                    Define accommodation type, room structure, sharing options, and house suitability.
                  </p>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Property Title / Name *
                      </label>
                      <input
                        type="text"
                        className="in"
                        placeholder="e.g. Aura Stay Executive Boys PG or Silicon City 2BHK High-Rise"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          triggerDuplicateCheck();
                        }}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Property Category *
                        </label>
                        <select className="in" value={type} onChange={(e) => setType(e.target.value)}>
                          <option value="PG">PG / Paying Guest</option>
                          <option value="Hostel">Student Hostel</option>
                          <option value="Flat">Independent Flat / Apartment</option>
                          <option value="1RK">1 RK Studio</option>
                          <option value="Room">Private Room in House</option>
                        </select>
                      </div>

                      {type === 'Flat' || type === 'Room' ? (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Configuration (BHK)
                          </label>
                          <select className="in" value={bhk} onChange={(e) => setBhk(e.target.value)}>
                            <option value="1 RK">1 RK</option>
                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="3 BHK">3 BHK</option>
                            <option value="4+ BHK">4+ BHK</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Sharing Type
                          </label>
                          <select className="in" value={sharing} onChange={(e) => setSharing(e.target.value)}>
                            <option value="Single">Single Room / Private</option>
                            <option value="Double">Double Sharing</option>
                            <option value="Triple">Triple Sharing</option>
                            <option value="Multiple">4+ Multiple Sharing</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Furnishing Status
                        </label>
                        <select className="in" value={furnishing} onChange={(e) => setFurnishing(e.target.value)}>
                          <option value="Furnished">Fully Furnished</option>
                          <option value="Semi-furnished">Semi-Furnished</option>
                          <option value="Unfurnished">Unfurnished</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Suitable For (Occupants)
                        </label>
                        <select className="in" value={suitableFor} onChange={(e) => setSuitableFor(e.target.value)}>
                          <option value="Boys">Boys / Male Only</option>
                          <option value="Girls">Girls / Female Only</option>
                          <option value="Co-living">Co-Living / Any Gender</option>
                          <option value="Family">Family Friendly</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Bathroom Type
                        </label>
                        <select className="in" value={bathroomType} onChange={(e) => setBathroomType(e.target.value)}>
                          <option value="Attached">Attached Private Washroom</option>
                          <option value="Common">Common / Shared Washroom</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Kitchen Facility
                        </label>
                        <select className="in" value={kitchenAvailable ? 'yes' : 'no'} onChange={(e) => setKitchenAvailable(e.target.value === 'yes')}>
                          <option value="yes">Kitchen Available / Cooking Allowed</option>
                          <option value="no">No Kitchen / Meals Provided</option>
                        </select>
                      </div>
                    </div>

                    {/* Couple-friendly toggle & conditions (from handwritten note) */}
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          style={{ width: '18px', height: '18px', flexShrink: 0, margin: 0, accentColor: '#1d5bd8' }}
                          checked={coupleFriendly}
                          onChange={(e) => setCoupleFriendly(e.target.checked)}
                        />
                        <span>💑 Couple-Friendly Property</span>
                      </label>
                      {coupleFriendly && (
                        <div style={{ marginTop: '10px' }}>
                          <input
                            type="text"
                            className="in"
                            placeholder="Specify clear conditions (e.g. Valid government ID proof required)"
                            value={coupleConditions}
                            onChange={(e) => setCoupleConditions(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Total Number of Rooms / Units
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="in"
                          value={totalRooms}
                          onChange={(e) => setTotalRooms(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Room Size (Sq Ft, Optional)
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="e.g. 150 sq ft"
                          value={roomSize}
                          onChange={(e) => setRoomSize(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{ padding: '10px 18px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!title.trim()) {
                          alert('Please enter a property title.');
                          return;
                        }
                        setCurrentStep(3);
                      }}
                      className="go"
                      style={{ padding: '11px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      Next: Location →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Location Details */}
              {currentStep === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                    Step 3: Location &amp; Landmark
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
                    Help students and working professionals locate your property easily.
                  </p>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          City *
                        </label>
                        <select className="in" value={selectedCityId} onChange={handleCityChange}>
                          {SUPPORTED_CITIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.state})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Locality / Sector *
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="e.g. Sector 62 / Civil Lines / Katra"
                          value={locality}
                          onChange={(e) => {
                            setLocality(e.target.value);
                            triggerDuplicateCheck();
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Full Street Address *
                      </label>
                      <textarea
                        className="in"
                        rows={2}
                        placeholder="e.g. C-25, Block C, Phase 2, Near Electronic City Metro"
                        value={fullAddress}
                        onChange={(e) => {
                          setFullAddress(e.target.value);
                          triggerDuplicateCheck();
                        }}
                        required
                      />
                    </div>

                    {/* Public Display Privacy Control Toggle (Handwritten note requirement) */}
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--navy)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          style={{ width: '18px', height: '18px', flexShrink: 0, margin: '2px 0 0 0', accentColor: '#1d5bd8' }}
                          checked={hideExactAddress}
                          onChange={(e) => setHideExactAddress(e.target.checked)}
                        />
                        <div>
                          <strong>Privacy Protection:</strong> Hide exact door/building number until visit confirmation.
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Seekers will see the locality and approximate vicinity on public maps. The exact building unit is only shared once an in-person visit is verified.
                          </div>
                        </div>
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Nearby Landmark
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="e.g. Opp. Fortis Hospital / Near ICICI Bank"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Nearby Metro / Office / College
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="e.g. 400m from Sector 62 Metro / SRM Campus"
                          value={nearbyMetroOrCollege}
                          onChange={(e) => setNearbyMetroOrCollege(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* GPS Location Pin display */}
                    <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                      📍 <strong>Map Pin Coordinates:</strong> Lat: {gpsCoordinates[1].toFixed(4)}, Lng: {gpsCoordinates[0].toFixed(4)} ({currentCityObj.name})
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      style={{ padding: '10px 18px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!locality.trim()) {
                          alert('Please enter your locality or sector.');
                          return;
                        }
                        setCurrentStep(4);
                      }}
                      className="go"
                      style={{ padding: '11px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      Next: Rent &amp; Terms →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Rent & Availability */}
              {currentStep === 4 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                    Step 4: Rent &amp; Availability Terms
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
                    Clear financial expectations prevent visit cancellations and disputes.
                  </p>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Monthly Rent (₹) *
                        </label>
                        <input
                          type="number"
                          className="in"
                          placeholder="e.g. 8500"
                          value={rent}
                          onChange={(e) => setRent(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Security Deposit (₹)
                        </label>
                        <input
                          type="number"
                          className="in"
                          placeholder="Default is 1 month rent"
                          value={deposit}
                          onChange={(e) => setDeposit(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Maintenance Charges (₹ / month)
                        </label>
                        <input
                          type="number"
                          className="in"
                          placeholder="0 if included"
                          value={maintenance}
                          onChange={(e) => setMaintenance(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Electricity &amp; Water Basis
                        </label>
                        <select className="in" value={electricityBasis} onChange={(e) => setElectricityBasis(e.target.value)}>
                          <option value="METERED">Sub-metered (Per Unit ₹8-10)</option>
                          <option value="INCLUDED">Included in Monthly Rent</option>
                          <option value="FIXED">Fixed ₹500 - ₹1000 Extra / Month</option>
                          <option value="ACTUALS">Shared Actual State EB Bill</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Brokerage (₹)
                        </label>
                        <input
                          type="number"
                          className="in"
                          placeholder="₹0 for Direct Owners"
                          value={brokerage}
                          onChange={(e) => setBrokerage(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Notice Period
                        </label>
                        <select className="in" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)}>
                          <option value="15 Days">15 Days</option>
                          <option value="1 Month">1 Month</option>
                          <option value="2 Months">2 Months</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Available From Date (Move-in)
                        </label>
                        <input
                          type="date"
                          className="in"
                          min={todayDateString}
                          value={availableFrom}
                          onChange={(e) => setAvailableFrom(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Available Vacant Rooms / Beds
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="in"
                          value={availableRooms}
                          onChange={(e) => setAvailableRooms(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Initial Availability Status
                      </label>
                      <select className="in" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}>
                        <option value="AVAILABLE">Available (Vacant &amp; Open for Visits)</option>
                        <option value="OCCUPIED">Occupied (Full - No vacant beds)</option>
                        <option value="UNAVAILABLE">Temporarily Unavailable</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      style={{ padding: '10px 18px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!rent || Number(rent) <= 0) {
                          alert('Please enter a valid monthly rent.');
                          return;
                        }
                        setCurrentStep(5);
                      }}
                      className="go"
                      style={{ padding: '11px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      Next: Amenities &amp; Rules →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Facilities & House Rules */}
              {currentStep === 5 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                    Step 5: Facilities &amp; Stay Rules
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 20px' }}>
                    Select confirmed amenities. Our field auditor will verify each item during the physical visit.
                  </p>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '10px' }}>
                      Select Included Amenities (Verified on-site)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                      {AMENITIES_LIST.map((am) => {
                        const checked = selectedAmenities.includes(am);
                        return (
                          <div
                            key={am}
                            onClick={() => toggleAmenity(am)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              border: `1.5px solid ${checked ? 'var(--blue)' : '#e2e8f0'}`,
                              background: checked ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              fontSize: '0.82rem',
                              fontWeight: checked ? 700 : 500,
                              color: checked ? 'var(--blue)' : '#334155',
                            }}
                          >
                            <span>{checked ? '☑' : '☐'}</span>
                            <span>{am}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Visitors Policy
                      </label>
                      <select className="in" value={visitorsPolicy} onChange={(e) => setVisitorsPolicy(e.target.value)}>
                        <option value="Allowed (Daytime)">Allowed (Daytime until 8 PM)</option>
                        <option value="24x7 Allowed">24x7 Allowed with ID</option>
                        <option value="No Visitors">Strictly No Outside Visitors</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Pets Policy
                      </label>
                      <select className="in" value={petsPolicy} onChange={(e) => setPetsPolicy(e.target.value)}>
                        <option value="Not Allowed">Not Allowed</option>
                        <option value="Allowed">Allowed</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        Smoking / Alcohol Policy
                      </label>
                      <select className="in" value={smokingPolicy} onChange={(e) => setSmokingPolicy(e.target.value)}>
                        <option value="Strictly Prohibited">Strictly Prohibited</option>
                        <option value="Balcony / Outdoor Only">Balcony / Outdoor Area Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                      Additional House Rules &amp; Move-out Guidelines
                    </label>
                    <textarea
                      className="in"
                      rows={2}
                      placeholder="e.g. Gate closes at 11 PM. Cleanliness maintained in common areas."
                      value={houseRules}
                      onChange={(e) => setHouseRules(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      style={{ padding: '10px 18px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      className="go"
                      style={{ padding: '11px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      Next: Photos &amp; Video →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: Photos, Video & Verification Submit */}
              {currentStep === 6 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                    Step 6: Photos, Video &amp; Verification
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mut)', margin: '0 0 16px' }}>
                    Per Find2Stay Quality Standards: Minimum 4 clear photos covering Room, Bathroom, Kitchen and Building.
                  </p>

                  {/* Photo Category Selector for upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>
                      Photo Tag Category:
                    </span>
                    {['Room', 'Bathroom', 'Kitchen', 'Building / Exterior'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryForNextPhoto(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: `1px solid ${selectedCategoryForNextPhoto === cat ? 'var(--blue)' : '#cbd5e1'}`,
                          background: selectedCategoryForNextPhoto === cat ? '#eff6ff' : '#ffffff',
                          color: selectedCategoryForNextPhoto === cat ? 'var(--blue)' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Photo Upload Dropzone */}
                  <div
                    style={{
                      border: '2px dashed #93c5fd',
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      marginBottom: '20px',
                    }}
                  >
                    <input
                      type="file"
                      id="propertyPhotos"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="propertyPhotos"
                      style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ fontSize: '2.2rem' }}>📸</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>
                        {isUploading ? 'Uploading photos...' : 'Click to upload property photos'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        PNG, JPG, WEBP up to 8MB each. Tagged as <strong>{selectedCategoryForNextPhoto}</strong>.
                      </span>
                    </label>
                  </div>

                  {/* Thumbnails grid with category badges & delete */}
                  {photos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                      {photos.map((p, idx) => (
                        <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '4px',
                              left: '4px',
                              background: 'rgba(15,23,42,0.8)',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {photosCategorized[idx]?.category || 'Room'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(239,68,68,0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Video Walkthrough Link */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                      🎥 Short Video Walkthrough URL (Optional)
                    </label>
                    <input
                      type="url"
                      className="in"
                      placeholder="e.g. YouTube, Google Drive, or MP4 link"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>

                  {/* Final Declarations */}
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <label className="chk-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        style={{ width: '18px', height: '18px', flexShrink: 0, margin: '3px 0 0 0', accentColor: '#1d5bd8' }}
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>
                        <strong>Accuracy &amp; On-Site Audit Agreement:</strong> I certify that all details provided are true and accurate. I agree to permit the Find2Stay local field operations specialist to conduct an in-person room audit before public verification activation.
                      </span>
                    </label>
                  </div>

                  {/* 6. Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      style={{ padding: '10px 18px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {/* Save as Draft Button */}
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={status === 'loading'}
                        style={{
                          padding: '11px 20px',
                          borderRadius: '10px',
                          background: '#f8fafc',
                          border: '1.5px solid #cbd5e1',
                          color: 'var(--navy)',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        💾 Save as Draft
                      </button>

                      {/* Preview Listing Button */}
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        style={{
                          padding: '11px 20px',
                          borderRadius: '10px',
                          background: '#eff6ff',
                          border: '1.5px solid #bfdbfe',
                          color: 'var(--blue)',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        👁️ Preview Listing
                      </button>

                      {/* Submit for Verification Button */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className="go"
                        style={{
                          padding: '11px 24px',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                        }}
                      >
                        {status === 'loading' ? 'Submitting...' : '🚀 Submit for Verification'}
                      </button>
                    </div>
                  </div>

                  {status === 'error' && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '10px', fontSize: '0.85rem' }}>
                      {message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 10. Help / Sidebar ("Why List on Find2Stay?") */}
            <div>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(11,35,80,0.03)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🛡️</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 10px' }}>
                  Why List on Find2Stay?
                </h3>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 }}>
                  <li><strong>Zero Brokerage:</strong> Connect directly with verified student &amp; working professional tenants.</li>
                  <li><strong>180-Day Audit Seal:</strong> On-site verified stays receive 3x higher booking request rates.</li>
                  <li><strong>Multi-Property Hub:</strong> Manage individual rooms, full floors, or entire societies from one desk.</li>
                  <li><strong>Verified QR Badges:</strong> Display official QR posters at your property gate for instant booking inquiries.</li>
                </ul>
              </div>

              {/* Verified Verification Roadmap Card */}
              <div
                id="how-it-works-roadmap"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '24px',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                  4-Step Verification Roadmap
                </h4>
                <div style={{ display: 'grid', gap: '14px', fontSize: '0.82rem', color: '#475569' }}>
                  <div>
                    <strong style={{ color: 'var(--navy)' }}>1. Submit Details</strong>
                    <div>Provide rent, address, photos, and ownership declaration.</div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--navy)' }}>2. Phone Authorization</strong>
                    <div>Operations calls you within 24h to verify listing ownership.</div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--navy)' }}>3. Field Verifier Visit</strong>
                    <div>Our local team visits to inspect room condition, sub-meters, and RO water TDS.</div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--navy)' }}>4. Verified QR Live Seal</strong>
                    <div>Listing goes live with the 180-day verified badge and QR download.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Listing Preview Modal */}
      <ListingPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
      />
    </>
  );
}
