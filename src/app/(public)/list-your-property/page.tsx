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

const AMENITIES_CONFIG = [
  { id: 'Wi-Fi', label: 'Wi-Fi', icon: '📶' },
  { id: 'AC', label: 'AC', icon: '❄️' },
  { id: 'Bed', label: 'Bed', icon: '🛏️' },
  { id: 'Wardrobe', label: 'Wardrobe', icon: '🚪' },
  { id: 'Study Table', label: 'Study Table', icon: '📚' },
  { id: 'Washing Machine', label: 'Washing Machine', icon: '🧺' },
  { id: 'Parking', label: 'Parking', icon: '🅿️' },
  { id: 'Lift', label: 'Lift', icon: '🛗' },
  { id: 'Power Backup', label: 'Power Backup', icon: '⚡' },
  { id: 'Tiffin/Food Nearby', label: 'Tiffin/Food Nearby', icon: '🍱' },
  { id: 'RO Water', label: 'RO Water', icon: '💧' },
  { id: 'Geyser', label: 'Geyser', icon: '🚿' },
  { id: 'Visitor Allowed', label: 'Visitor Allowed', icon: '👥' },
  { id: 'Pets Allowed', label: 'Pets Allowed', icon: '🐾' },
  { id: 'Smoking Allowed', label: 'Smoking Allowed', icon: '🚬' },
  { id: 'Drinking Allowed', label: 'Drinking Allowed', icon: '🍺' },
  { id: 'Separate Entrance', label: 'Separate Entrance', icon: '🚪' },
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
  const [currentStep, setCurrentStep] = useState<number>(1);

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
  const [subType, setSubType] = useState('Select sub type');
  const [waterBasis, setWaterBasis] = useState('INCLUDED');
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
  const currentCityLocalities = currentCityObj?.localities || [];

  return (
    <div className="f2s-list-property-page">
      {/* ── 1. Navy Hero Header (Matches Screenshot 3) ────────────────── */}
      <section className="f2s-owner-hero">
        <div className="wrap f2s-owner-hero-grid">
          {/* Left Text */}
          <div className="f2s-owner-hero-left">
            <h1 className="f2s-owner-hero-title">
              List Your <span>Property</span>
            </h1>
            <p className="f2s-owner-hero-sub">
              Get genuine tenants. No brokerage hassle. List your rooms, PG or property on Find2Stay and reach thousands of verified tenants.
            </p>

            <div className="f2s-owner-hero-pills">
              <div className="f2s-owner-hero-pill">
                <span className="f2s-pill-circle-icon">👥</span>
                <span>Reach genuine students &amp; professionals</span>
              </div>
              <div className="f2s-owner-hero-pill">
                <span className="f2s-pill-circle-icon">🛡️</span>
                <span>Free initial listings No brokerage</span>
              </div>
              <div className="f2s-owner-hero-pill">
                <span className="f2s-pill-circle-icon">📈</span>
                <span>Easy management &amp; more bookings</span>
              </div>
            </div>
          </div>

          {/* Center Visual: Friendly Landlord holding house model + badges */}
          <div className="f2s-owner-hero-center">
            <div className="f2s-owner-hero-photo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/owner-hero-landlord-clean.jpg"
                alt="Landlord partner with property"
                className="f2s-owner-hero-photo"
              />

              {/* Playful sticker: List Now It's Free! */}
              <div className="f2s-badge-free">
                <span style={{ fontSize: '12px', marginRight: '3px' }}>📌</span>
                List Now<br /><strong>It&apos;s Free!</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Trusted by Property Owners Card */}
          <div className="f2s-owner-hero-right">
            <div className="f2s-trusted-owners-card">
              <div className="f2s-trusted-card-header">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V5l8-3z" />
                </svg>
                <span>Trusted by Property Owners</span>
              </div>
              <ul className="f2s-trusted-card-list">
                <li>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Verified tenants</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Safe &amp; secure process</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Manage all your listings</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Update availability anytime</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Dedicated support</span>
                </li>
              </ul>
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
          <div className="f2s-list-layout-3col">
            {/* ── Left Sidebar (Column 1) ─────────────────────────────── */}
            <aside className="f2s-list-sidebar-left">
              {/* Who Can List? Card */}
              <div className="f2s-side-card">
                <h3 className="f2s-side-card-title">Who can list?</h3>
                <div className="f2s-who-list">
                  <div
                    className="f2s-who-item"
                    style={{ cursor: 'pointer', opacity: userType === 'Individual Property Owner' ? 1 : 0.8 }}
                    onClick={() => setUserType('Individual Property Owner')}
                  >
                    <div className="f2s-who-icon">🏠</div>
                    <div className="f2s-who-text">
                      <b>Property Owner</b>
                      <small>Individual house or flat owner</small>
                    </div>
                  </div>

                  <div
                    className="f2s-who-item"
                    style={{ cursor: 'pointer', opacity: userType === 'Broker / Property Dealer' ? 1 : 0.8 }}
                    onClick={() => setUserType('Broker / Property Dealer')}
                  >
                    <div className="f2s-who-icon">👔</div>
                    <div className="f2s-who-text">
                      <b>Broker</b>
                      <small>List multiple properties</small>
                    </div>
                  </div>

                  <div
                    className="f2s-who-item"
                    style={{ cursor: 'pointer', opacity: userType === 'PG / Hostel Owner' ? 1 : 0.8 }}
                    onClick={() => setUserType('PG / Hostel Owner')}
                  >
                    <div className="f2s-who-icon">🏢</div>
                    <div className="f2s-who-text">
                      <b>PG / Hostel Owner</b>
                      <small>Boys, Girls or Co-living PGs</small>
                    </div>
                  </div>

                  <div
                    className="f2s-who-item"
                    style={{ cursor: 'pointer', opacity: userType === 'Builder / Society / Property Manager' ? 1 : 0.8 }}
                    onClick={() => setUserType('Builder / Society / Property Manager')}
                  >
                    <div className="f2s-who-icon">🏙️</div>
                    <div className="f2s-who-text">
                      <b>Builder / Society</b>
                      <small>Apartments &amp; gated societies</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* List in 3 Simple Steps Card */}
              <div className="f2s-side-card">
                <h3 className="f2s-side-card-title">List in 3 Simple Steps</h3>
                <div className="f2s-steps-mini">
                  <div className="f2s-step-mini-item">
                    <span className="f2s-step-mini-num">1</span>
                    <div className="f2s-step-mini-text">
                      <b>Fill Property Details</b>
                      <small>Add room info, location, rent etc.</small>
                    </div>
                  </div>

                  <div className="f2s-step-mini-item">
                    <span className="f2s-step-mini-num">2</span>
                    <div className="f2s-step-mini-text">
                      <b>Add Photos &amp; Video</b>
                      <small>Upload clear photos or video</small>
                    </div>
                  </div>

                  <div className="f2s-step-mini-item">
                    <span className="f2s-step-mini-num">3</span>
                    <div className="f2s-step-mini-text">
                      <b>Submit for Verification</b>
                      <small>Our team will verify and publish</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help? Card */}
              <div className="f2s-side-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎧</span>
                  <h3 className="f2s-side-card-title" style={{ margin: 0 }}>Need Help?</h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--f2s-text-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                  Our team is here to help you 24x7 with listing, updates and tenant queries.
                </p>
                <a href="tel:+919876543210" className="f2s-contact-support-btn">
                  <span>🎧</span>
                  <span>Contact Support</span>
                </a>
              </div>
            </aside>

            {/* ── Center Main Form (Column 2) ─────────────────────────── */}
            <main className="f2s-list-main-center">
              {/* 3-Stage Progress Stepper Bar */}
              <div className="f2s-form-stepper-bar">
                <div
                  className={`f2s-form-stepper-stage ${currentStep >= 1 ? 'active' : ''}`}
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="f2s-stage-badge">1</span>
                  <span>Basic Information</span>
                </div>
                <div className="f2s-form-stepper-line" />

                <div
                  className={`f2s-form-stepper-stage ${currentStep >= 2 ? 'active' : ''}`}
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                >
                  <span className="f2s-stage-badge">2</span>
                  <span>Property Details</span>
                </div>
                <div className="f2s-form-stepper-line" />

                <div
                  className={`f2s-form-stepper-stage ${currentStep >= 3 ? 'active' : ''}`}
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(3);
                  }}
                >
                  <span className="f2s-stage-badge">3</span>
                  <span>Verification &amp; Submit</span>
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

              {/* CARD 1: 1. Owner / Partner Details */}
              <div className="f2s-form-card" id="sec-owner">
                <div className="f2s-form-card-header">
                  <span className="f2s-form-card-icon blue">👤</span>
                  <div className="f2s-form-card-title-group">
                    <h3>1. Owner / Partner Details</h3>
                    <p>Tell us about yourself</p>
                  </div>
                </div>

                <div className="f2s-grid-2">
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Full Name <span className="req">*</span></label>
                      <input
                        type="text"
                        className="f2s-input-text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!title) setTitle(`${type} in ${locality || 'Noida'}`);
                        }}
                        required
                      />
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Mobile Number <span className="req">*</span></label>
                      <div className="f2s-input-with-prefix">
                        <span className="f2s-input-prefix">+91</span>
                        <input
                          type="tel"
                          placeholder="Enter mobile number"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          required
                        />
                        <button
                          type="button"
                          className="f2s-btn-get-otp"
                          onClick={handleSendOtp}
                          disabled={otpLoading}
                        >
                          {otpLoading ? 'Sending...' : otpVerified ? 'Verified ✓' : 'Get OTP'}
                        </button>
                      </div>
                      {otpSent && !otpVerified && (
                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="6-digit OTP"
                            value={otpCode}
                            maxLength={6}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="f2s-input-text"
                            style={{ maxWidth: '140px' }}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading}
                            style={{
                              background: 'var(--f2s-blue)',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={handleAutofillOtp}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            Demo OTP
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">WhatsApp Number (Optional)</label>
                      <div className="f2s-input-with-prefix">
                        <span className="f2s-input-prefix">+91</span>
                        <input
                          type="tel"
                          placeholder="Enter WhatsApp number"
                          value={whatsapp}
                          maxLength={10}
                          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">I am a <span className="req">*</span></label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                        {[
                          { id: 'Individual Property Owner', label: 'Property Owner' },
                          { id: 'Broker / Property Dealer', label: 'Broker' },
                          { id: 'PG / Hostel Owner', label: 'PG / Hostel Owner' },
                          { id: 'Builder / Society / Property Manager', label: 'Builder / Society' },
                        ].map((u) => (
                          <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="ownerTypeRadio"
                              checked={userType === u.id}
                              onChange={() => setUserType(u.id)}
                            />
                            <span>{u.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="f2s-field-group" style={{ marginTop: 'auto' }}>
                      <label className="f2s-field-label">Email (Optional)</label>
                      <input
                        type="email"
                        className="f2s-input-text"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 2. Property Details */}
              <div className="f2s-form-card" id="sec-property">
                <div className="f2s-form-card-header">
                  <span className="f2s-form-card-icon blue">🏠</span>
                  <div className="f2s-form-card-title-group">
                    <h3>2. Property Details</h3>
                    <p>Tell us about your property</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Row 1: Property Type, Sub Type, Furnishing */}
                  <div className="f2s-grid-3">
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Property Type <span className="req">*</span></label>
                      <select className="f2s-select" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="PG">PG / Paying Guest</option>
                        <option value="Room">Room</option>
                        <option value="1RK">1 RK</option>
                        <option value="1BHK">1 BHK</option>
                        <option value="2BHK">2 BHK</option>
                        <option value="Flat">Independent Flat</option>
                        <option value="Hostel">Hostel</option>
                      </select>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Sub Type <span className="req">*</span></label>
                      <select className="f2s-select" value={subType} onChange={(e) => setSubType(e.target.value)}>
                        <option value="Select sub type">Select sub type</option>
                        <option value="Independent Room">Independent Room</option>
                        <option value="Shared Room">Shared Room</option>
                        <option value="Full Apartment">Full Apartment</option>
                        <option value="Studio Apartment">Studio Apartment</option>
                      </select>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Furnishing <span className="req">*</span></label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        {['Furnished', 'Semi-furnished', 'Unfurnished'].map((f) => (
                          <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="furnishingOpt"
                              checked={furnishing === f}
                              onChange={() => setFurnishing(f)}
                            />
                            <span>{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Sharing Type, Suitable For */}
                  <div className="f2s-grid-2">
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Sharing Type <span className="req">*</span></label>
                      <div className="f2s-radio-pills">
                        {['Single', 'Double', 'Triple', 'Multiple'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`f2s-radio-pill-item ${sharing === s ? 'active' : ''}`}
                            onClick={() => setSharing(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Suitable For <span className="req">*</span></label>
                      <div className="f2s-radio-pills">
                        {['Boys', 'Girls', 'Co-living', 'Family'].map((sf) => (
                          <button
                            key={sf}
                            type="button"
                            className={`f2s-radio-pill-item ${suitableFor === sf ? 'active' : ''}`}
                            onClick={() => setSuitableFor(sf)}
                          >
                            {sf}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Couple Friendly, Bathroom, Kitchen */}
                  <div className="f2s-grid-3">
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Couple Friendly <span className="req">*</span></label>
                      <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', cursor: 'pointer' }}>
                          <input type="radio" name="coupleFriendlyRadio" checked={coupleFriendly} onChange={() => setCoupleFriendly(true)} />
                          <span>Yes</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', cursor: 'pointer' }}>
                          <input type="radio" name="coupleFriendlyRadio" checked={!coupleFriendly} onChange={() => setCoupleFriendly(false)} />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Bathroom <span className="req">*</span></label>
                      <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', cursor: 'pointer' }}>
                          <input type="radio" name="bathTypeRadio" checked={bathroomType === 'Attached'} onChange={() => setBathroomType('Attached')} />
                          <span>Attached</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', cursor: 'pointer' }}>
                          <input type="radio" name="bathTypeRadio" checked={bathroomType === 'Common'} onChange={() => setBathroomType('Common')} />
                          <span>Common</span>
                        </label>
                      </div>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Kitchen <span className="req">*</span></label>
                      <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', cursor: 'pointer' }}>
                          <input type="radio" name="kitchenRadio" checked={kitchenAvailable} onChange={() => setKitchenAvailable(true)} />
                          <span>Available</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', cursor: 'pointer' }}>
                          <input type="radio" name="kitchenRadio" checked={!kitchenAvailable} onChange={() => setKitchenAvailable(false)} />
                          <span>Not Available</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: 3. Location Details */}
              <div className="f2s-form-card" id="sec-location">
                <div className="f2s-form-card-header">
                  <span className="f2s-form-card-icon orange">📍</span>
                  <div className="f2s-form-card-title-group">
                    <h3>3. Location Details</h3>
                    <p>Help tenants find your property easily</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px', alignItems: 'start' }}>
                  {/* Left Location Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="f2s-grid-2">
                      <div className="f2s-field-group">
                        <label className="f2s-field-label">City <span className="req">*</span></label>
                        <select className="f2s-select" value={selectedCityId} onChange={(e) => handleCityChange(e.target.value)}>
                          {SUPPORTED_CITIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="f2s-field-group">
                        <label className="f2s-field-label">Sector / Locality <span className="req">*</span></label>
                        <select
                          className="f2s-select"
                          value={locality}
                          onChange={(e) => {
                            setLocality(e.target.value);
                            if (!title) setTitle(`${type} in ${e.target.value}`);
                          }}
                          onBlur={triggerDuplicateCheck}
                          required
                        >
                          <option value="">Select sector/locality</option>
                          {currentCityLocalities.map((loc) => (
                            <option key={loc.name} value={loc.name}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Full Address <span className="req">*</span></label>
                      <input
                        type="text"
                        className="f2s-input-text"
                        placeholder="Enter full address (House no., sector, landmark etc.)"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        onBlur={triggerDuplicateCheck}
                        required
                      />
                    </div>

                    <div className="f2s-grid-2">
                      <div className="f2s-field-group">
                        <label className="f2s-field-label">Nearby Landmark</label>
                        <input
                          type="text"
                          className="f2s-input-text"
                          placeholder="e.g. Near Metro Station, Office, College"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                      </div>

                      <div className="f2s-field-group">
                        <label className="f2s-field-label">Nearby Metro Station</label>
                        <select
                          className="f2s-select"
                          value={nearbyMetroOrCollege}
                          onChange={(e) => setNearbyMetroOrCollege(e.target.value)}
                        >
                          <option value="">Select metro station (optional)</option>
                          <option value="Noida Electronic City">Noida Electronic City</option>
                          <option value="Sector 62 Metro">Sector 62 Metro</option>
                          <option value="Botanical Garden">Botanical Garden</option>
                          <option value="Sector 18 Noida">Sector 18 Noida</option>
                          <option value="Sector 52 Metro">Sector 52 Metro</option>
                          <option value="Pari Chowk">Pari Chowk</option>
                        </select>
                      </div>
                    </div>

                    {/* Mask Exact Address Toggle */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11.5px', color: '#64748b', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={hideExactAddress}
                        onChange={(e) => setHideExactAddress(e.target.checked)}
                      />
                      <span>🔒 Mask exact house number on public search (shared only upon visit booking)</span>
                    </label>
                  </div>

                  {/* Right Map Preview Container */}
                  <div
                    style={{
                      height: '180px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid #cbd5e1',
                      backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontSize: '36px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>📍</div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 2, padding: '10px', textAlign: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const inputLoc = prompt('Set property location pin on map (Locality / Coordinates):', locality || 'Sector 62, Noida');
                          if (inputLoc) setLocality(inputLoc);
                        }}
                        style={{
                          background: 'var(--f2s-blue)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                        }}
                      >
                        📍 Pick Location on Map
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: 4. Rent & Availability */}
              <div className="f2s-form-card" id="sec-rent">
                <div className="f2s-form-card-header">
                  <span className="f2s-form-card-icon orange">₹</span>
                  <div className="f2s-form-card-title-group">
                    <h3>4. Rent &amp; Availability</h3>
                    <p>Set your pricing and availability details</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Row 1: Monthly Rent, Security Deposit, Maintenance */}
                  <div className="f2s-grid-3">
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Monthly Rent (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        className="f2s-input-text"
                        placeholder="Enter monthly rent"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        required
                      />
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Security Deposit (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        className="f2s-input-text"
                        placeholder="Enter security deposit"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        required
                      />
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Maintenance Charges (₹)</label>
                      <input
                        type="number"
                        className="f2s-input-text"
                        placeholder="Enter maintenance charges"
                        value={maintenance}
                        onChange={(e) => setMaintenance(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 2: Electricity Charges, Water Charges, Brokerage */}
                  <div className="f2s-grid-3">
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Electricity Charges</label>
                      <select className="f2s-select" value={electricityBasis} onChange={(e) => setElectricityBasis(e.target.value)}>
                        <option value="INCLUDED">Included</option>
                        <option value="METERED">Separate (Metered)</option>
                        <option value="FIXED">Fixed</option>
                      </select>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Water Charges</label>
                      <select className="f2s-select" value={waterBasis} onChange={(e) => setWaterBasis(e.target.value)}>
                        <option value="INCLUDED">Included</option>
                        <option value="SEPARATE">Separate</option>
                      </select>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Brokerage (if any)</label>
                      <input
                        type="text"
                        className="f2s-input-text"
                        placeholder="Enter brokerage amount"
                        value={brokerage}
                        onChange={(e) => setBrokerage(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 3: Minimum Stay, Available From, Number of Rooms */}
                  <div className="f2s-grid-3">
                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Minimum Stay Duration</label>
                      <select className="f2s-select" value={minimumStay} onChange={(e) => setMinimumStay(e.target.value)}>
                        <option value="1 Month">1 Month</option>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="11 Months">11 Months</option>
                      </select>
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Available From <span className="req">*</span></label>
                      <input
                        type="date"
                        className="f2s-input-text"
                        value={availableFrom || todayDateString}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        required
                      />
                    </div>

                    <div className="f2s-field-group">
                      <label className="f2s-field-label">Number of Rooms <span className="req">*</span></label>
                      <input
                        type="number"
                        className="f2s-input-text"
                        placeholder="Enter number of rooms"
                        value={totalRooms}
                        onChange={(e) => setTotalRooms(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 5: 5. Amenities & Rules */}
              <div className="f2s-form-card" id="sec-amenities">
                <div className="f2s-form-card-header">
                  <span className="f2s-form-card-icon green">⚙️</span>
                  <div className="f2s-form-card-title-group">
                    <h3>5. Amenities &amp; Rules</h3>
                    <p>Select facilities available at the property</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="f2s-amenities-16-grid">
                    {AMENITIES_CONFIG.map((item) => {
                      const isChecked = selectedAmenities.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                          onClick={() => handleAmenityToggle(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              handleAmenityToggle(item.id);
                            }
                          }}
                          className={`f2s-amenity-tile ${isChecked ? 'active' : ''}`}
                        >
                          <div className={`f2s-amenity-check-box ${isChecked ? 'checked' : ''}`}>
                            {isChecked ? (
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ffffff" strokeWidth="3.2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : null}
                          </div>
                          <span className="f2s-amenity-tile-icon">{item.icon}</span>
                          <span className="f2s-amenity-tile-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="f2s-field-group" style={{ marginTop: '10px' }}>
                    <label className="f2s-field-label" style={{ fontWeight: 700, fontSize: '13px', color: 'var(--f2s-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📜</span>
                      <span>House Rules (Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="f2s-input-text"
                      placeholder="e.g. No late night entry, vegetarian only, no smoking, etc."
                      value={houseRules}
                      onChange={(e) => setHouseRules(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* CARD 6: 6. Photos & Video */}
              <div className="f2s-form-card" id="sec-photos">
                <div className="f2s-form-card-header">
                  <span className="f2s-form-card-icon blue">📷</span>
                  <div className="f2s-form-card-title-group">
                    <h3>6. Photos &amp; Video</h3>
                    <p>Upload clear photos and video for better visibility</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'stretch' }}>
                  {/* Left Box: Upload Photos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label className="f2s-photo-uploader-box">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <div style={{ fontSize: '26px', color: 'var(--f2s-blue)' }}>☁️⬆️</div>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--f2s-navy)', marginTop: '4px' }}>
                        Upload Photos
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Drag &amp; drop images or click to upload
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        (At least 4–6 clear photos) • JPG, PNG (Max 5MB each)
                      </div>
                    </label>

                    {/* Pre-set / Uploaded Category Thumbnails */}
                    <div className="f2s-thumbnails-preview-row">
                      {[
                        { label: 'Room', img: photos[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=200' },
                        { label: 'Bathroom', img: photos[1] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' },
                        { label: 'Kitchen', img: photos[2] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200' },
                        { label: 'Building', img: photos[3] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200' },
                      ].map((t, idx) => (
                        <div key={idx} className="f2s-thumbnail-card">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.img} alt={t.label} className="f2s-thumbnail-img" />
                          <span className="f2s-thumbnail-label">{t.label}</span>
                        </div>
                      ))}

                      <label
                        className="f2s-thumbnail-card"
                        style={{
                          border: '1.5px dashed var(--f2s-blue)',
                          background: '#EFF6FF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          color: 'var(--f2s-blue)',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '16px' }}>+</span>
                        <span>Add More</span>
                      </label>
                    </div>
                  </div>

                  {/* Right Box: Video Upload */}
                  <div
                    style={{
                      background: '#FFF1F2',
                      border: '1px solid #FFE4E6',
                      borderRadius: '14px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '10px',
                    }}
                  >
                    <div style={{ fontSize: '28px' }}>📹</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#9F1239' }}>
                      Upload Video (Recommended)
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#BE123C', margin: 0 }}>
                      Add a short video walkthrough (30 sec – 2 min)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Paste YouTube/Drive link or upload video:', videoUrl || '');
                        if (url !== null) setVideoUrl(url);
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #F43F5E',
                        color: '#E11D48',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '4px',
                      }}
                    >
                      {videoUrl ? 'Video Linked ✓' : 'Upload Video'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Legal Confirmation and Bottom Action Buttons */}
              <div style={{ marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#475569', cursor: 'pointer', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    checked={ownershipConfirmed}
                    onChange={(e) => {
                      setOwnershipConfirmed(e.target.checked);
                      setConsent(e.target.checked);
                    }}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    I confirm that the information provided is correct and I am authorized to list this property. I agree to Find2Stay&apos;s <Link href="/terms" style={{ color: 'var(--f2s-blue)', textDecoration: 'underline' }}>Terms &amp; Conditions</Link>.
                  </span>
                </label>

                {status === 'error' && (
                  <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '10px', fontSize: '0.85rem' }}>
                    {message}
                  </div>
                )}

                <div className="f2s-form-bottom-actions">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={status === 'loading'}
                    className="f2s-btn-draft"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    👁️ Preview
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="f2s-btn-submit-main"
                  >
                    <span>{status === 'loading' ? 'Submitting...' : 'Submit for Verification'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

            </main>

            {/* ── Right Sidebar (Column 3 - Matches Screenshot 3) ─────── */}
            <aside className="f2s-list-sidebar-right">
              {/* Why List on Find2Stay? Card */}
              <div className="f2s-side-card">
                <h3 className="f2s-side-card-title">Why List on Find2Stay?</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👥</span>
                    <span>Reach thousands of verified tenants</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🛡️</span>
                    <span>No brokerage hassle</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📈</span>
                    <span>Easy listing &amp; management</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔍</span>
                    <span>Get direct enquiries</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--f2s-green)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Trusted and verified platform</span>
                  </li>
                </ul>
              </div>

              {/* Listing Tips Card */}
              <div className="f2s-side-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '18px' }}>💡</span>
                  <h3 className="f2s-side-card-title" style={{ margin: 0 }}>Listing Tips</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--f2s-green)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Upload clear and real photos</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--f2s-green)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Add correct rent and details</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--f2s-green)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Keep availability updated</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--f2s-green)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Mention all amenities</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--f2s-green)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Use video for better response</span>
                  </li>
                </ul>
              </div>

              {/* Bulk Upload Card */}
              <div className="f2s-side-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🏢</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--f2s-navy)' }}>
                    Need to list multiple rooms?
                  </div>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--f2s-text-muted)', lineHeight: 1.4, margin: '0 0 12px' }}>
                  <strong>Bulk Upload:</strong> List multiple rooms at once using our bulk upload option.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href="/api/owner/bulk-template"
                    download
                    className="f2s-btn-side-action outline"
                  >
                    <span>📥</span>
                    <span>Download Template</span>
                  </a>
                  <BulkPropertyUploader />
                </div>
              </div>

              {/* Growth Promo Card */}
              <div className="f2s-growth-poster-card">
                <div className="f2s-growth-poster-header">
                  <span className="f2s-poster-badge">EXCLUSIVE FOR OWNERS</span>
                  <div className="f2s-growth-promo-title">
                    List Today<br />Get Verified Tenants<br /><span style={{ color: 'var(--f2s-orange)' }}>Grow Your Rental Income</span>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/owner-sidebar-ad-pro.jpg"
                  alt="List your property - Grow rental income"
                  className="f2s-growth-poster-img"
                />
                <div className="f2s-poster-footer-stats">
                  <div className="f2s-poster-stat-pill">⚡ Instant Inquiries</div>
                  <div className="f2s-poster-stat-pill">🛡️ Zero Brokerage</div>
                </div>
              </div>
            </aside>
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
    </div>
  );
}
