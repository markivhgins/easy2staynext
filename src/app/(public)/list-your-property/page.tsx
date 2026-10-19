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

  // 3-Step Wizard Navigation State
  // Step 1: Basic Information (Property type, Location, Rent, Contact number)
  // Step 2: Property Details (Photos, Amenities, Room type, Deposit, Availability)
  // Step 3: Verification & Submit (OTP, Authorisation check, Submit for review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // --- STEP 1: Basic Information ---
  // A. Property Type & Category
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PG');
  const [bhk, setBhk] = useState('1 BHK');
  const [sharing, setSharing] = useState('Single');

  // B. Location Details
  const [selectedCityId, setSelectedCityId] = useState(city.id);
  const [locality, setLocality] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [nearbyMetroOrCollege, setNearbyMetroOrCollege] = useState('');
  const [hideExactAddress, setHideExactAddress] = useState(true);
  const [gpsCoordinates, setGpsCoordinates] = useState<[number, number]>([77.391, 28.5355]);

  // C. Rent & Charges
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [maintenance, setMaintenance] = useState('0');
  const [electricityBasis, setElectricityBasis] = useState('METERED');
  const [brokerage, setBrokerage] = useState('0');

  // D. Contact Number & Owner Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('Individual Property Owner');

  // --- STEP 2: Property Details ---
  // A. Room Type & Layout
  const [furnishing, setFurnishing] = useState('Furnished');
  const [suitableFor, setSuitableFor] = useState('Boys');
  const [coupleFriendly, setCoupleFriendly] = useState(false);
  const [coupleConditions, setCoupleConditions] = useState('');
  const [bathroomType, setBathroomType] = useState('Attached');
  const [kitchenAvailable, setKitchenAvailable] = useState(true);
  const [totalRooms, setTotalRooms] = useState('1');
  const [availableRooms, setAvailableRooms] = useState('1');
  const [roomSize, setRoomSize] = useState('');

  // B. Deposit, Stay Terms & Availability
  const [minimumStay, setMinimumStay] = useState('1 Month');
  const [noticePeriod, setNoticePeriod] = useState('1 Month');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('AVAILABLE');

  // C. Amenities & Rules
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed Wi-Fi',
    'Air Conditioner (AC)',
    'Ceiling Fan',
    'Bed & Mattress',
    'Wardrobe / Almirah',
    'RO Drinking Water',
    '100% Power Backup',
  ]);
  const [visitorsPolicy, setVisitorsPolicy] = useState('Allowed (Daytime)');
  const [petsPolicy, setPetsPolicy] = useState('Not Allowed');
  const [smokingPolicy, setSmokingPolicy] = useState('Strictly Prohibited');
  const [houseRules, setHouseRules] = useState('');

  // D. Photos & Video
  const [photos, setPhotos] = useState<string[]>([]);
  const [photosCategorized, setPhotosCategorized] = useState<Array<{ url: string; category: string }>>([]);
  const [selectedCategoryForNextPhoto, setSelectedCategoryForNextPhoto] = useState('Room');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // --- STEP 3: Verification & Submit ---
  // A. OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // B. Authorisation Check & Declarations
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);

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

  const todayDateString = new Date().toISOString().split('T')[0];

  const handleCityChange = (newCityId: string) => {
    setSelectedCityId(newCityId);
    const target = SUPPORTED_CITIES.find((c) => c.id === newCityId);
    if (target) {
      setCity(target);
      if (target.id === 'noida') setGpsCoordinates([77.391, 28.5355]);
      else if (target.id === 'delhi') setGpsCoordinates([77.209, 28.6139]);
      else if (target.id === 'gurgaon') setGpsCoordinates([77.0266, 28.4595]);
      else if (target.id === 'greater-noida') setGpsCoordinates([77.503, 28.4744]);
      else if (target.id === 'ghaziabad') setGpsCoordinates([77.4538, 28.6692]);
      else if (target.id === 'faridabad') setGpsCoordinates([77.3178, 28.4089]);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const triggerDuplicateCheck = async () => {
    if (!title.trim() && !fullAddress.trim()) return;
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHECK_DUPLICATE',
          title,
          locality,
          fullAddress,
          phone,
        }),
      });
      const data = await res.json();
      if (data.isDuplicate) {
        setDuplicateWarning(data);
      } else {
        setDuplicateWarning(null);
      }
    } catch {}
  };

  // OTP handlers
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setStatus('error');
      setMessage('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setOtpLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${cleanPhone}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to dispatch OTP.');
      setOtpSent(true);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleAutofillOtp = () => {
    setOtpCode('123456');
    setOtpVerified(true);
    setStatus('idle');
    setMessage('OTP autofilled & verified for showcase demonstration.');
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length < 4) {
      setStatus('error');
      setMessage('Enter the 6-digit code received via SMS.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${cleanPhone}`, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Invalid OTP code.');
      setOtpVerified(true);
      window.dispatchEvent(new Event('f2s-auth-change'));
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newPhotos: string[] = [];
    const newCatPhotos: Array<{ url: string; category: string }> = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newPhotos.push(result);
          newCatPhotos.push({ url: result, category: selectedCategoryForNextPhoto });
          if (newPhotos.length === files.length) {
            setPhotos((prev) => [...prev, ...newPhotos]);
            setPhotosCategorized((prev) => [...prev, ...newCatPhotos]);
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosCategorized((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!title.trim()) {
      setStatus('error');
      setMessage('Please enter a Property Title / Building Name.');
      return false;
    }
    if (!rent || Number(rent) <= 0) {
      setStatus('error');
      setMessage('Please enter a valid monthly rent amount.');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!name.trim() || cleanPhone.length !== 10) {
      setStatus('error');
      setMessage('Please provide your full contact name and a valid 10-digit mobile number.');
      return false;
    }
    setStatus('idle');
    setMessage('');
    return true;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      document.getElementById('listing-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextToStep3 = () => {
    setStatus('idle');
    setMessage('');
    setCurrentStep(3);
    document.getElementById('listing-form')?.scrollIntoView({ behavior: 'smooth' });
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

  const previewData: ListingPreviewData = {
    title: title || 'Aura Stay Executive PG & Flat',
    type,
    city: SUPPORTED_CITIES.find((c) => c.id === selectedCityId)?.name || 'Noida',
    locality: locality || 'Sector 62',
    fullAddress,
    hideExactAddress,
    bhk,
    sharing,
    furnishing,
    suitableFor,
    bathroomType,
    kitchenAvailable,
    rent: rent || '8500',
    deposit: deposit || rent || '8500',
    maintenance: maintenance || '0',
    electricityBasis,
    availableFrom: availableFrom || todayDateString,
    amenities: selectedAmenities,
    photos,
    ownerName: name || 'Property Partner',
    ownerPhone: phone || '9876543210',
    userType,
    visitorsPolicy,
    houseRules,
  };

  const currentCityObj = SUPPORTED_CITIES.find((c) => c.id === selectedCityId) || SUPPORTED_CITIES[0];

  return (
    <>
      {/* Hero Header */}
      <section className="head">
        <div className="wrap">
          <div className="hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="eyebrow dk" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Partner Hub
              </span>
              <h1 style={{ marginTop: '8px', color: '#ffffff' }}>List Your Property on Find2Stay</h1>
              <p style={{ color: '#e0f2fe', fontSize: '1rem', lineHeight: 1.6, margin: '8px 0 20px' }}>
                Join 500+ verified PG owners, independent landlords, and brokers in {currentCityObj.name}. Zero brokerage commissions, 180-day physical inspection seal, and authentic tenant visits.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="#listing-form"
                  className="go"
                  style={{
                    background: '#ffffff',
                    color: 'var(--navy)',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    textDecoration: 'none',
                  }}
                >
                  🏡 Start Listing Now
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
                  ℹ️ Verification Roadmap
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
      <div className="wrap" id="listing-form" style={{ maxWidth: '1180px', width: '100%', boxSizing: 'border-box', margin: '36px auto 80px', padding: '0 16px' }}>
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
            <div style={{ padding: '14px', background: '#ffffff', borderRadius: '14px', border: '1px solid #bbf7d0', marginBottom: '20px', textAlign: 'left', fontSize: '0.88rem', color: '#166534', lineHeight: 1.6 }}>
              <strong>📋 Compliance &amp; QR Code Notice:</strong>
              <div>• Initial Status: <strong>PENDING_VERIFICATION</strong></div>
              <div>• Our local field operations specialist will call you within 24h to coordinate the physical room audit.</div>
              <div>• <strong>🔒 Verified QR Code Badges:</strong> As per Find2Stay platform policy, official printable QR Posters are generated exclusively for verified listings upon completion of the physical audit.</div>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#15803d', lineHeight: 1.6, margin: '0 0 24px' }}>
              {message || 'Your property has been linked to your Landlord Portal where you can manage availability and track verification progress.'}
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
              {/* 3-Step Wizard Navigation Tracker */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  {[
                    { s: 1 as const, title: 'Step 1: Basic Information', desc: 'Type, Location, Rent & Contact' },
                    { s: 2 as const, title: 'Step 2: Property Details', desc: 'Photos, Amenities, Rooms & Rules' },
                    { s: 3 as const, title: 'Step 3: Verification & Submit', desc: 'OTP, Authorization & Review' },
                  ].map((item) => (
                    <button
                      key={item.s}
                      type="button"
                      onClick={() => {
                        if (item.s === 1) setCurrentStep(1);
                        else if (item.s === 2 && validateStep1()) setCurrentStep(2);
                        else if (item.s === 3 && validateStep1()) setCurrentStep(3);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: `1.5px solid ${currentStep === item.s ? 'var(--blue)' : currentStep > item.s ? '#86efac' : '#e2e8f0'}`,
                        background: currentStep === item.s ? '#eff6ff' : currentStep > item.s ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: currentStep === item.s ? '0 4px 12px rgba(22, 72, 232, 0.12)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: currentStep === item.s ? 'var(--blue)' : currentStep > item.s ? '#166534' : 'var(--navy)' }}>
                        {item.title} {currentStep > item.s ? '✓' : ''}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--mut)', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--blue)',
                      width: `${(currentStep / 3) * 100}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
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

              {/* STEP 1: Basic Information (Property Type, Location, Rent, Contact Number) */}
              {currentStep === 1 && (
                <div>
                  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                      Step 1 — Basic Information
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--mut)', margin: 0 }}>
                      Provide property category, location, monthly rent, and your direct contact details.
                    </p>
                  </div>

                  {/* 1. Property Type & Title */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      🏷️ 1. Property Category &amp; Name
                    </h3>

                    <div style={{ display: 'grid', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Property / Building Name *
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="e.g. Royal Palms Executive Boys PG or Green Heights 2BHK"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          onBlur={triggerDuplicateCheck}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Property Type *
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
                              Room Sharing Type
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
                    </div>
                  </div>

                  {/* 2. Location Details */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      📍 2. Property Location
                    </h3>

                    <div style={{ display: 'grid', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Target City *
                          </label>
                          <select className="in" value={selectedCityId} onChange={(e) => handleCityChange(e.target.value)}>
                            {SUPPORTED_CITIES.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.state})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Sector / Locality *
                          </label>
                          <input
                            type="text"
                            className="in"
                            placeholder="e.g. Sector 62, Knowledge Park, Saket"
                            value={locality}
                            onChange={(e) => setLocality(e.target.value)}
                            onBlur={triggerDuplicateCheck}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Full Street Address *
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="Plot / House No, Street, Block, Society Name"
                          value={fullAddress}
                          onChange={(e) => setFullAddress(e.target.value)}
                          onBlur={triggerDuplicateCheck}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Nearby Landmark
                          </label>
                          <input
                            type="text"
                            className="in"
                            placeholder="e.g. Near Fortis Hospital / Dominos"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Nearby Metro / College / Hub
                          </label>
                          <input
                            type="text"
                            className="in"
                            placeholder="e.g. 500m from Sector 62 Metro"
                            value={nearbyMetroOrCollege}
                            onChange={(e) => setNearbyMetroOrCollege(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Public Address Privacy Toggle */}
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer', marginTop: '4px' }}>
                        <input
                          type="checkbox"
                          checked={hideExactAddress}
                          onChange={(e) => setHideExactAddress(e.target.checked)}
                        />
                        <span>🔒 Mask exact house/flat number from public search (revealed to tenant only after visit confirmation)</span>
                      </label>
                    </div>
                  </div>

                  {/* 3. Rent & Charges */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      💰 3. Rent &amp; Charges
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
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
                          placeholder="Default: 1 Month Rent"
                          value={deposit}
                          onChange={(e) => setDeposit(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Electricity &amp; Water
                        </label>
                        <select className="in" value={electricityBasis} onChange={(e) => setElectricityBasis(e.target.value)}>
                          <option value="METERED">Sub-metered as per usage</option>
                          <option value="INCLUDED">Included in Monthly Rent</option>
                          <option value="FIXED">Fixed Monthly Charge</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Brokerage (₹)
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="0 (Zero Brokerage)"
                          value={brokerage}
                          onChange={(e) => setBrokerage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Contact Number & Partner Details */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      👤 4. Contact Number &amp; Partner Details
                    </h3>

                    {/* Who are you? */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                        Who are you? (User Type)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 175px), 1fr))', gap: '10px' }}>
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

                    <div style={{ display: 'grid', gap: '14px' }}>
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

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Mobile Number *
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ padding: '11px 12px', background: '#e2e8f0', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy)' }}>
                              +91
                            </span>
                            <input
                              type="tel"
                              className="in"
                              placeholder="9876543210"
                              value={phone}
                              maxLength={10}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            className="in"
                            placeholder="partner@find2stay.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <label className="chk-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={whatsappSameAsPhone}
                          onChange={(e) => setWhatsappSameAsPhone(e.target.checked)}
                        />
                        <span>WhatsApp number is the same as mobile number</span>
                      </label>
                    </div>
                  </div>

                  {/* Navigation Buttons for Step 1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      style={{
                        padding: '11px 20px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        color: 'var(--navy)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      📄 Save Draft
                    </button>

                    <button
                      type="button"
                      onClick={handleNextToStep2}
                      className="go"
                      style={{
                        padding: '12px 28px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                      }}
                    >
                      Next: Step 2 — Property Details →
                    </button>
                  </div>

                  {status === 'error' && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '10px', fontSize: '0.85rem' }}>
                      {message}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Property Details (Photos, Amenities, Room type, Deposit, Availability) */}
              {currentStep === 2 && (
                <div>
                  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                      Step 2 — Property Details &amp; Amenities
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--mut)', margin: 0 }}>
                      Furnishing, room facilities, move-in availability, verified amenities, and room photos.
                    </p>
                  </div>

                  {/* 1. Room Type & Layout */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      🛏️ 1. Room Type &amp; Specifications
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px', marginBottom: '14px' }}>
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

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Washroom / Bathroom
                        </label>
                        <select className="in" value={bathroomType} onChange={(e) => setBathroomType(e.target.value)}>
                          <option value="Attached">Attached Private Washroom</option>
                          <option value="Common">Common / Shared Washroom</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Kitchen Access
                        </label>
                        <select className="in" value={kitchenAvailable ? 'yes' : 'no'} onChange={(e) => setKitchenAvailable(e.target.value === 'yes')}>
                          <option value="yes">Available / Self-Cooking Allowed</option>
                          <option value="no">Not Available (Tiffin Only)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Available Rooms / Beds
                        </label>
                        <input
                          type="number"
                          className="in"
                          min="1"
                          value={availableRooms}
                          onChange={(e) => setAvailableRooms(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Total Rooms in Property
                        </label>
                        <input
                          type="number"
                          className="in"
                          min="1"
                          value={totalRooms}
                          onChange={(e) => setTotalRooms(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Room Size (Sq. Ft - Optional)
                        </label>
                        <input
                          type="text"
                          className="in"
                          placeholder="e.g. 150 sq.ft"
                          value={roomSize}
                          onChange={(e) => setRoomSize(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '14px' }}>
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={coupleFriendly}
                          onChange={(e) => setCoupleFriendly(e.target.checked)}
                        />
                        <span>Couple Friendly allowed (married/unmarried with valid government IDs)</span>
                      </label>
                    </div>
                  </div>

                  {/* 2. Deposit & Move-in Terms */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      📅 2. Stay Terms &amp; Move-in Availability
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Available From Date
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
                          Minimum Stay Commitment
                        </label>
                        <select className="in" value={minimumStay} onChange={(e) => setMinimumStay(e.target.value)}>
                          <option value="1 Month">1 Month (Flexible)</option>
                          <option value="3 Months">3 Months</option>
                          <option value="6 Months">6 Months</option>
                          <option value="11 Months">11 Months (Standard Lease)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Notice Period &amp; Move-out Rules
                        </label>
                        <select className="in" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)}>
                          <option value="1 Month">1 Month Notice Period</option>
                          <option value="15 Days">15 Days Notice Period</option>
                          <option value="No Notice">No Notice (Month-to-Month)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Live Availability Status
                        </label>
                        <select className="in" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}>
                          <option value="AVAILABLE">Available for Immediate Booking</option>
                          <option value="OCCUPIED">Currently Occupied</option>
                          <option value="UNDER_REPAIR">Temporarily Unavailable</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. Amenities & Facilities (Covering Wi-Fi, AC, Fan, Bed, Wardrobe, Parking, Lift, Power backup, Rules) */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                        ✨ 3. Facilities &amp; Amenities
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--mut)' }}>
                        {selectedAmenities.length} selected
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '10px', marginBottom: '16px' }}>
                      {AMENITIES_LIST.map((amenity) => {
                        const isChecked = selectedAmenities.includes(amenity);
                        return (
                          <div
                            key={amenity}
                            onClick={() => handleAmenityToggle(amenity)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '10px',
                              border: `1.5px solid ${isChecked ? 'var(--blue)' : '#e2e8f0'}`,
                              background: isChecked ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              style={{ accentColor: 'var(--blue)', pointerEvents: 'none' }}
                            />
                            <span style={{ fontSize: '0.82rem', fontWeight: isChecked ? 700 : 500, color: isChecked ? 'var(--blue)' : 'var(--navy)' }}>
                              {amenity}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Rules & Policies */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Visitors Policy
                        </label>
                        <select className="in" value={visitorsPolicy} onChange={(e) => setVisitorsPolicy(e.target.value)}>
                          <option value="Allowed (Daytime)">Allowed (Daytime Only)</option>
                          <option value="Overnight Allowed">Overnight Allowed with Notice</option>
                          <option value="Strictly Prohibited">Visitors Not Allowed</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Pets Policy
                        </label>
                        <select className="in" value={petsPolicy} onChange={(e) => setPetsPolicy(e.target.value)}>
                          <option value="Not Allowed">Not Allowed</option>
                          <option value="Allowed">Pets Welcome</option>
                          <option value="Cats Only">Cats Only</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          Smoking Policy
                        </label>
                        <select className="in" value={smokingPolicy} onChange={(e) => setSmokingPolicy(e.target.value)}>
                          <option value="Strictly Prohibited">Strictly Prohibited</option>
                          <option value="Balcony Only">Allowed in Balcony / Outdoors</option>
                          <option value="Permitted">Permitted</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        House Rules &amp; Move-Out Guidelines (Optional)
                      </label>
                      <textarea
                        rows={2}
                        className="in"
                        placeholder="e.g. Gate closes at 11:00 PM, quiet hours after 10 PM, deposit refund within 48h of move-out inspection."
                        value={houseRules}
                        onChange={(e) => setHouseRules(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* 4. Photos & Video Upload */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                        📸 4. Property Photos &amp; Video Walkthrough
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: photos.length >= 4 ? '#16a34a' : '#d97706', fontWeight: 700 }}>
                        {photos.length} photos uploaded (Min 4 recommended)
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--mut)', margin: '0 0 16px' }}>
                      High quality photos increase tenant inquiries by 3x. Supported formats: JPG, PNG, WEBP (Up to 10MB each).
                    </p>

                    {/* Category Selector for next upload */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>Upload as:</span>
                      {['Room', 'Bathroom', 'Kitchen', 'Building / Exterior', 'Hall / Common Area'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategoryForNextPhoto(cat)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: selectedCategoryForNextPhoto === cat ? '1px solid var(--blue)' : '1px solid #cbd5e1',
                            background: selectedCategoryForNextPhoto === cat ? '#eff6ff' : '#ffffff',
                            color: selectedCategoryForNextPhoto === cat ? 'var(--blue)' : 'var(--navy)',
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '24px', textAlign: 'center', background: '#ffffff', marginBottom: '16px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '6px' }}>📁</div>
                      <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                        <span className="go" style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: '8px' }}>
                          {isUploading ? 'Uploading Photos...' : '+ Select Photos to Upload'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePhotoUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>

                    {/* Photo Previews */}
                    {photos.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 120px), 1fr))', gap: '10px', marginBottom: '16px' }}>
                        {photos.map((p, idx) => (
                          <div key={idx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', aspectRatio: '4/3' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p} alt={`Property upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                        🎥 Video Walkthrough Link (Optional)
                      </label>
                      <input
                        type="url"
                        className="in"
                        placeholder="e.g. YouTube, Google Drive, or MP4 link"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Navigation Buttons for Step 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        document.getElementById('listing-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        padding: '11px 20px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: 'var(--navy)',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      ← Back to Basic Info
                    </button>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        style={{
                          padding: '11px 20px',
                          borderRadius: '10px',
                          background: '#f8fafc',
                          border: '1.5px solid #cbd5e1',
                          color: 'var(--navy)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                        }}
                      >
                        📄 Save Draft
                      </button>

                      <button
                        type="button"
                        onClick={handleNextToStep3}
                        className="go"
                        style={{
                          padding: '12px 28px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                        }}
                      >
                        Next: Step 3 — Verification &amp; Submit →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Verification & Submit (OTP, Authorisation Check, Submission & Property ID) */}
              {currentStep === 3 && (
                <div>
                  <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px' }}>
                      Step 3 — Verification &amp; Submit
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--mut)', margin: 0 }}>
                      Complete contact OTP authorization, review platform policies, and submit for on-site inspection.
                    </p>
                  </div>

                  {/* 1. Mobile OTP Authentication */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 8px' }}>
                      📱 1. Mobile OTP Authorization
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--mut)', margin: '0 0 14px' }}>
                      Confirm your direct mobile number (+91 {phone || 'XXXXXXXXXX'}) to prevent unauthorized listings.
                    </p>

                    {otpVerified ? (
                      <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✓</span> Mobile Number (+91 {phone}) Authenticated via OTP
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading}
                            style={{
                              padding: '10px 18px',
                              borderRadius: '8px',
                              background: '#eff6ff',
                              border: '1.5px solid #bfdbfe',
                              color: 'var(--blue)',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                            }}
                          >
                            {otpLoading ? 'Sending...' : otpSent ? '↻ Resend OTP' : 'Send Verification OTP'}
                          </button>

                          <button
                            type="button"
                            onClick={handleAutofillOtp}
                            style={{
                              padding: '10px 18px',
                              borderRadius: '8px',
                              background: '#fef3c7',
                              border: '1.5px solid #fde68a',
                              color: '#92400e',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                            }}
                          >
                            ⚡ Autofill OTP (Showcase Demo)
                          </button>
                        </div>

                        {otpSent && (
                          <div style={{ display: 'flex', gap: '8px', maxWidth: '300px', marginTop: '10px' }}>
                            <input
                              type="text"
                              className="in"
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={otpLoading}
                              className="go"
                              style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.85rem' }}
                            >
                              Verify
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. Ownership & Authorization Check */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 14px' }}>
                      ⚖️ 2. Ownership Declaration &amp; Audit Agreement
                    </h3>

                    <div style={{ display: 'grid', gap: '14px' }}>
                      <label className="chk-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: '#1e293b', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={ownershipConfirmed}
                          onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                          style={{ marginTop: '3px' }}
                        />
                        <span>
                          <strong>Ownership / Authorisation Check:</strong> I declare under penalty of deactivation that I am the genuine legal owner, operator, or formally authorized representative with full power to list and lease this property on Find2Stay.
                        </span>
                      </label>

                      <label className="chk-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: '#1e293b', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          style={{ marginTop: '3px' }}
                        />
                        <span>
                          <strong>180-Day Audit Seal Agreement:</strong> I agree to allow Find2Stay field verification specialists to conduct an on-site physical room, safety, and RO water audit prior to full verified badge activation.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 3. Submission & Property Identification & QR Code Compliance Notice */}
                  <div style={{ padding: '18px 20px', background: '#eff6ff', borderRadius: '16px', border: '1.5px solid #bfdbfe', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--blue)', margin: '0 0 6px' }}>
                      📋 Submission &amp; Property Identification (Requirement 8 &amp; 9)
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#1e40af', lineHeight: 1.6, margin: 0 }}>
                      Upon clicking <strong>Submit for Verification</strong>, your listing will be registered with a unique Property ID (e.g. <code>F2S-NOI-XXXXX</code>) and marked <strong>PENDING_VERIFICATION</strong>.
                      <br />
                      <strong>Important QR Code Policy:</strong> In accordance with Find2Stay platform integrity rules, official printable Verified QR Codes and gate posters are generated exclusively for listings that have passed the physical inspection audit.
                    </p>
                  </div>

                  {/* 4. Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(2);
                        document.getElementById('listing-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        padding: '11px 20px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: 'var(--navy)',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      ← Back to Property Details
                    </button>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {/* Save Draft */}
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
                        📄 Save as Draft
                      </button>

                      {/* Preview Listing Modal */}
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

                      {/* Submit for Verification */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className="go"
                        style={{
                          padding: '12px 28px',
                          borderRadius: '12px',
                          fontSize: '0.92rem',
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
            <div className="lyp-sidebar">
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
                    <strong style={{ color: 'var(--navy)' }}>4. Verified QR Seal Activated</strong>
                    <div>Listing goes live with the 180-day audit seal and instant booking QR code.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Listing Preview Modal */}
      <ListingPreviewModal
        data={previewData}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSubmit={() => {
          setIsPreviewOpen(false);
          handleSubmit();
        }}
      />
    </>
  );
}
