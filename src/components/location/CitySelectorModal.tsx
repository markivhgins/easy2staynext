'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { SUPPORTED_CITIES, CityInfo } from '@/lib/cities';
import { searchEducationalHubs, EducationalHub } from '@/lib/educationalHubs';

/* ──────────────────────────────────────────────────────────────────────────
   Architectural Line-Art Monument Icons (SVG)
   Matches the exact reference style from user upload media_1792102744731_875d462c.png
   ────────────────────────────────────────────────────────────────────────── */

const CityMonuments: Record<string, React.ReactNode> = {
  // Bengaluru: Vidhana Soudha
  bengaluru: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Central Dome */}
      <path d="M27 18c0-3.5 2-6 5-6s5 2.5 5 6" />
      <path d="M32 9v3" />
      <circle cx="32" cy="8" r="1.2" fill="currentColor" />
      {/* Upper Pediment */}
      <path d="M22 18h20" />
      <path d="M25 18l7-6 7 6" />
      {/* Side Domes */}
      <path d="M14 22c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" />
      <path d="M44 22c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" />
      {/* Main Roof Architrave */}
      <path d="M11 22h42v4H11z" />
      {/* Columns */}
      <line x1="15" y1="26" x2="15" y2="40" />
      <line x1="20" y1="26" x2="20" y2="40" />
      <line x1="25" y1="26" x2="25" y2="40" />
      <line x1="30" y1="26" x2="30" y2="40" />
      <line x1="34" y1="26" x2="34" y2="40" />
      <line x1="39" y1="26" x2="39" y2="40" />
      <line x1="44" y1="26" x2="44" y2="40" />
      <line x1="49" y1="26" x2="49" y2="40" />
      {/* Central Grand Archway */}
      <path d="M28 40v-8c0-2.2 1.8-4 4-4s4 1.8 4 4v8" />
      {/* Stepped Base / Plinth */}
      <path d="M8 40h48v3H8z" />
      <path d="M5 43h54v4H5z" />
    </svg>
  ),

  // Hyderabad: Charminar
  hyderabad: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* 4 Minarets (Front 2 tall, rear 2 subtle) */}
      <path d="M16 43V12c0-1.5 1-2 2-2s2 .5 2 2v31" />
      <path d="M44 43V12c0-1.5 1-2 2-2s2 .5 2 2v31" />
      {/* Minaret Domes & Finials */}
      <path d="M16 12c0-2 1-3.5 2-3.5s2 1.5 2 3.5" />
      <line x1="18" y1="6" x2="18" y2="8.5" />
      <path d="M44 12c0-2 1-3.5 2-3.5s2 1.5 2 3.5" />
      <line x1="46" y1="6" x2="46" y2="8.5" />
      {/* Minaret Balconies */}
      <line x1="15" y1="20" x2="21" y2="20" />
      <line x1="15" y1="30" x2="21" y2="30" />
      <line x1="43" y1="20" x2="49" y2="20" />
      <line x1="43" y1="30" x2="49" y2="30" />
      {/* Central Structure Upper Floor & Jali Windows */}
      <path d="M20 18h24v10H20z" />
      <line x1="20" y1="22" x2="44" y2="22" />
      <circle cx="26" cy="25" r="1.2" />
      <circle cx="32" cy="25" r="1.2" />
      <circle cx="38" cy="25" r="1.2" />
      {/* Grand Central Arch */}
      <path d="M24 43v-11c0-4.4 3.6-8 8-8s8 3.6 8 8v11" />
      {/* Base */}
      <line x1="12" y1="43" x2="52" y2="43" />
      <line x1="10" y1="46" x2="54" y2="46" />
    </svg>
  ),

  // Pune: Shaniwar Wada
  pune: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Fort Battlements / Crenellations */}
      <path d="M12 20h4v2h4v-2h4v2h4v-2h8v2h4v-2h4v2h4v-2h4v2h4" />
      {/* Left Bastion */}
      <path d="M12 22v21h8V22" />
      <path d="M12 30h8" />
      {/* Right Bastion */}
      <path d="M44 22v21h8V22" />
      <path d="M44 30h8" />
      {/* Upper Fort Pavilion */}
      <path d="M23 15h18v7H23z" />
      <line x1="27" y1="15" x2="27" y2="22" />
      <line x1="32" y1="15" x2="32" y2="22" />
      <line x1="37" y1="15" x2="37" y2="22" />
      {/* Dilli Darwaza Massive Spiked Arch */}
      <path d="M26 43v-11c0-3.3 2.7-6 6-6s6 2.7 6 6v11" />
      <line x1="32" y1="26" x2="32" y2="43" />
      {/* Base */}
      <line x1="8" y1="43" x2="56" y2="43" />
      <line x1="6" y1="46" x2="58" y2="46" />
    </svg>
  ),

  // Chennai: Dravidian Temple Gopuram
  chennai: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Kalasams / Finials on crest */}
      <line x1="26" y1="7" x2="26" y2="10" />
      <line x1="32" y1="6" x2="32" y2="10" />
      <line x1="38" y1="7" x2="38" y2="10" />
      <circle cx="32" cy="5" r="1" fill="currentColor" />
      {/* Crown Tier (Barrel vault roof) */}
      <path d="M24 10h16c2 0 3 1.5 2 3H22c-1-1.5 0-3 2-3z" />
      {/* Tier 1 */}
      <path d="M21 13h22v5H21z" />
      <circle cx="28" cy="15.5" r="0.8" />
      <circle cx="36" cy="15.5" r="0.8" />
      {/* Tier 2 */}
      <path d="M19 18h26v6H19z" />
      <line x1="25" y1="18" x2="25" y2="24" />
      <line x1="39" y1="18" x2="39" y2="24" />
      {/* Tier 3 */}
      <path d="M17 24h30v7H17z" />
      <line x1="23" y1="24" x2="23" y2="31" />
      <line x1="41" y1="24" x2="41" y2="31" />
      {/* Base & Entrance Gateway */}
      <path d="M15 31h34v13H15z" />
      <path d="M27 44v-8c0-2.8 2.2-5 5-5s5 2.2 5 5v8" />
      {/* Ground plinth */}
      <line x1="11" y1="44" x2="53" y2="44" />
      <line x1="9" y1="47" x2="55" y2="47" />
    </svg>
  ),

  // Mumbai: Gateway of India
  mumbai: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* 4 Corner Turrets */}
      <path d="M14 17c0-2 1-3 2-3s2 1 2 3v26h-4z" />
      <path d="M46 17c0-2 1-3 2-3s2 1 2 3v26h-4z" />
      {/* Turret Domes */}
      <circle cx="16" cy="13" r="1.5" />
      <circle cx="48" cy="13" r="1.5" />
      {/* Upper Central Cornice & Jali Screen */}
      <path d="M18 19h28v6H18z" />
      <line x1="22" y1="19" x2="22" y2="25" />
      <line x1="27" y1="19" x2="27" y2="25" />
      <line x1="32" y1="19" x2="32" y2="25" />
      <line x1="37" y1="19" x2="37" y2="25" />
      <line x1="42" y1="19" x2="42" y2="25" />
      {/* Side Arches */}
      <path d="M18 43v-8c0-2 1-3 2-3s2 1 2 3v8" />
      <path d="M42 43v-8c0-2 1-3 2-3s2 1 2 3v8" />
      {/* Central Grand Arch */}
      <path d="M25 43v-12c0-3.9 3.1-7 7-7s7 3.1 7 7v12" />
      {/* Ocean Plinth Base */}
      <line x1="10" y1="43" x2="54" y2="43" />
      <line x1="8" y1="46" x2="56" y2="46" />
    </svg>
  ),

  // Prayagraj: Triveni Sangam & Clock Tower
  prayagraj: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Historic Clock Tower Spire */}
      <path d="M26 22L32 9l6 13" />
      <circle cx="32" cy="7" r="1.2" fill="currentColor" />
      {/* Clock Chamber */}
      <path d="M26 22h12v10H26z" />
      <circle cx="32" cy="27" r="3.2" />
      <line x1="32" y1="27" x2="32" y2="25" />
      <line x1="32" y1="27" x2="33.5" y2="27" />
      {/* Tower Base & Buttresses */}
      <path d="M24 32h16v11H24z" />
      <line x1="28" y1="35" x2="28" y2="43" />
      <line x1="36" y1="35" x2="36" y2="43" />
      {/* Side Arch Arbors */}
      <path d="M16 43v-6c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5v6" />
      <path d="M42 43v-6c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5v6" />
      {/* Sangam Water Confluence Waves */}
      <path d="M8 45c3-1.5 6-1.5 9 0s6 1.5 9 0 6-1.5 9 0 6 1.5 9 0 6-1.5 9 0" />
      <path d="M6 48c3-1.5 6-1.5 9 0s6 1.5 9 0 6-1.5 9 0 6 1.5 9 0 6-1.5 9 0" />
    </svg>
  ),

  // Noida: Modern High-Rise Expressway Towers
  noida: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Tall High-Rise Tower 1 */}
      <path d="M18 43V10l12-4v37" />
      <line x1="22" y1="14" x2="26" y2="14" />
      <line x1="22" y1="20" x2="26" y2="20" />
      <line x1="22" y1="26" x2="26" y2="26" />
      <line x1="22" y1="32" x2="26" y2="32" />
      <line x1="22" y1="38" x2="26" y2="38" />
      {/* High-Rise Tower 2 */}
      <path d="M30 43V16l14 5v22" />
      <line x1="34" y1="22" x2="40" y2="22" />
      <line x1="34" y1="28" x2="40" y2="28" />
      <line x1="34" y1="34" x2="40" y2="34" />
      <line x1="34" y1="40" x2="40" y2="40" />
      {/* Antenna Spire */}
      <line x1="24" y1="6" x2="24" y2="2" />
      <circle cx="24" cy="2" r="1" fill="currentColor" />
      {/* Ground Base / Expressway */}
      <line x1="8" y1="43" x2="56" y2="43" />
      <line x1="12" y1="46" x2="52" y2="46" strokeDasharray="3 3" />
    </svg>
  ),

  // Greater Noida: Knowledge Park Dome & Pari Chowk
  'greater-noida': (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Central Knowledge Dome */}
      <path d="M24 24c0-5 3.6-9 8-9s8 4 8 9" />
      <line x1="32" y1="11" x2="32" y2="15" />
      <circle cx="32" cy="10" r="1.2" fill="currentColor" />
      {/* Colonnade */}
      <path d="M16 24h32v4H16z" />
      <line x1="20" y1="28" x2="20" y2="43" />
      <line x1="26" y1="28" x2="26" y2="43" />
      <line x1="32" y1="28" x2="32" y2="43" />
      <line x1="38" y1="28" x2="38" y2="43" />
      <line x1="44" y1="28" x2="44" y2="43" />
      {/* Ground Base */}
      <line x1="10" y1="43" x2="54" y2="43" />
    </svg>
  ),

  // Ghaziabad: Indirapuram & RapidX Corridor
  ghaziabad: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Residential Towers */}
      <path d="M14 43V18h14v25" />
      <line x1="18" y1="22" x2="24" y2="22" />
      <line x1="18" y1="28" x2="24" y2="28" />
      <line x1="18" y1="34" x2="24" y2="34" />
      <path d="M28 43V12h16v31" />
      <line x1="32" y1="16" x2="40" y2="16" />
      <line x1="32" y1="22" x2="40" y2="22" />
      <line x1="32" y1="28" x2="40" y2="28" />
      <line x1="32" y1="34" x2="40" y2="34" />
      {/* Elevated Metro Track */}
      <line x1="6" y1="40" x2="58" y2="40" />
      <line x1="6" y1="43" x2="58" y2="43" />
      {/* Metro Pillars */}
      <line x1="12" y1="43" x2="12" y2="48" />
      <line x1="32" y1="43" x2="32" y2="48" />
      <line x1="52" y1="43" x2="52" y2="48" />
    </svg>
  ),

  // Gurugram: Cyber City Skyline
  gurugram: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Angular Tech Towers */}
      <path d="M12 43V20l12-8v31" />
      <path d="M24 43V8l14 6v29" />
      <path d="M38 43V18l14 8v17" />
      <line x1="16" y1="24" x2="20" y2="24" />
      <line x1="16" y1="30" x2="20" y2="30" />
      <line x1="28" y1="16" x2="34" y2="16" />
      <line x1="28" y1="22" x2="34" y2="22" />
      <line x1="28" y1="28" x2="34" y2="28" />
      <line x1="42" y1="26" x2="48" y2="26" />
      <line x1="42" y1="32" x2="48" y2="32" />
      <line x1="8" y1="43" x2="56" y2="43" />
    </svg>
  ),

  // Delhi: India Gate
  delhi: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Top Cenotaph / Amar Jawan Bowl */}
      <path d="M28 9h8v3h-8z" />
      <line x1="32" y1="6" x2="32" y2="9" />
      {/* Upper Attic Floor */}
      <path d="M22 12h20v5H22z" />
      <path d="M19 17h26v3H19z" />
      {/* Left Pier / Pylon */}
      <path d="M19 20h8v23h-8z" />
      <line x1="23" y1="23" x2="23" y2="40" />
      {/* Right Pier / Pylon */}
      <path d="M37 20h8v23h-8z" />
      <line x1="41" y1="23" x2="41" y2="40" />
      {/* Grand Triumphal Arch */}
      <path d="M27 43v-13c0-2.8 2.2-5 5-5s5 2.2 5 5v13" />
      {/* Base Plinth */}
      <line x1="14" y1="43" x2="50" y2="43" />
      <line x1="11" y1="46" x2="53" y2="46" />
    </svg>
  ),

  // Delhi NCR alias
  'delhi-ncr': (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Top Cenotaph / Amar Jawan Bowl */}
      <path d="M28 9h8v3h-8z" />
      <line x1="32" y1="6" x2="32" y2="9" />
      {/* Upper Attic Floor */}
      <path d="M22 12h20v5H22z" />
      <path d="M19 17h26v3H19z" />
      {/* Left Pier / Pylon */}
      <path d="M19 20h8v23h-8z" />
      <line x1="23" y1="23" x2="23" y2="40" />
      {/* Right Pier / Pylon */}
      <path d="M37 20h8v23h-8z" />
      <line x1="41" y1="23" x2="41" y2="40" />
      {/* Grand Triumphal Arch */}
      <path d="M27 43v-13c0-2.8 2.2-5 5-5s5 2.2 5 5v13" />
      {/* Base Plinth */}
      <line x1="14" y1="43" x2="50" y2="43" />
      <line x1="11" y1="46" x2="53" y2="46" />
    </svg>
  ),

  // Kota: Coaching Capital Tower & Seven Wonders Landmark
  kota: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Modern Education Spire */}
      <path d="M31 6l2-2 2 2v10h-4z" />
      {/* Stepped Education Pyramid */}
      <path d="M27 16h10v6H27z" />
      <path d="M24 22h16v6H24z" />
      <path d="M20 28h24v7H20z" />
      {/* Campus Colonnade */}
      <line x1="23" y1="35" x2="23" y2="43" />
      <line x1="29" y1="35" x2="29" y2="43" />
      <line x1="35" y1="35" x2="35" y2="43" />
      <line x1="41" y1="35" x2="41" y2="43" />
      {/* Chambal River Waves */}
      <path d="M10 44c3-1 6-1 9 0s6 1 9 0 6-1 9 0 6 1 9 0" />
      <line x1="14" y1="43" x2="50" y2="43" />
      <line x1="12" y1="46" x2="52" y2="46" />
    </svg>
  ),

  // Lucknow: Rumi Darwaza
  lucknow: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Chhatri finials */}
      <circle cx="32" cy="9" r="1.2" />
      <path d="M30 11c0-1.5 1-2 2-2s2 .5 2 2" />
      {/* Monumental Awadhi Arch Frame */}
      <path d="M14 43V24c0-7 8-12 18-12s18 5 18 12v19" />
      {/* Grand Inner Arch */}
      <path d="M20 43V26c0-5 5.4-9 12-9s12 4 12 9v17" />
      {/* Central Portal */}
      <path d="M26 43v-10c0-2.8 2.7-5 6-5s6 2.2 6 5v10" />
      {/* Side Wall Niches */}
      <path d="M16 28h2v6h-2z" />
      <path d="M46 28h2v6h-2z" />
      {/* Base */}
      <line x1="10" y1="43" x2="54" y2="43" />
      <line x1="8" y1="46" x2="56" y2="46" />
    </svg>
  ),

  // Varanasi: Ghats & Kashi Temples
  varanasi: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      {/* Temple Shikhara Spire 1 (Tall) */}
      <path d="M22 10l5 15h-10z" />
      <circle cx="27" cy="8" r="1" />
      {/* Temple Shikhara Spire 2 */}
      <path d="M36 14l4 11h-8z" />
      <circle cx="40" cy="12" r="1" />
      {/* Ghat Stepped Riverfront */}
      <path d="M12 28h40v4H12z" />
      <path d="M9 32h46v4H9z" />
      <path d="M6 36h52v4H6z" />
      {/* Floating Ganga Boat */}
      <path d="M24 43c2 2 8 2 16 0l2 2H22z" fill="none" />
      {/* River Ganga Ripples */}
      <path d="M6 46c4-1 8-1 12 0s8 1 12 0 8-1 12 0 8 1 12 0" />
    </svg>
  ),

  // Kanpur: Industrial & IIT Hub
  kanpur: (
    <svg width={56} height={44} viewBox="0 0 64 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '56px', height: '44px', display: 'block', margin: '0 auto' }}>
      <path d="M16 20h8v23h-8z" />
      <path d="M28 14h8v29h-8z" />
      <path d="M40 24h8v19h-8z" />
      <line x1="12" y1="43" x2="52" y2="43" />
      <line x1="10" y1="46" x2="54" y2="46" />
    </svg>
  ),
};

export default function CitySelectorModal() {
  const {
    city,
    setCity,
    showModal,
    setShowModal,
    isLocating,
    detectGpsLocation,
    locationMessage,
    clearLocationMessage,
  } = useLocation();

  const [search, setSearch] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, setShowModal]);

  // Reset search when modal opens
  useEffect(() => {
    if (showModal) {
      setSearch('');
    }
  }, [showModal]);

  if (!showModal) return null;

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -240, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 240, behavior: 'smooth' });
  };

  // Filtered colleges, cities & localities based on user query
  const query = search.trim().toLowerCase();
  const matchingHubs = query.length > 0 ? searchEducationalHubs(query, 6) : [];

  const matchingCities = SUPPORTED_CITIES.filter((c) =>
    c.name.toLowerCase().includes(query) ||
    c.state.toLowerCase().includes(query) ||
    c.tag.toLowerCase().includes(query)
  );

  const matchingLocalities: Array<{
    cityName: string;
    cityObj: CityInfo;
    localityName: string;
    sub: string;
    category: string;
  }> = [];

  if (query.length > 0) {
    SUPPORTED_CITIES.forEach((c) => {
      c.localities.forEach((loc) => {
        if (
          loc.name.toLowerCase().includes(query) ||
          loc.sub.toLowerCase().includes(query)
        ) {
          matchingLocalities.push({
            cityName: c.name,
            cityObj: c,
            localityName: loc.name,
            sub: loc.sub,
            category: loc.category,
          });
        }
      });
    });
  }

  const handleSelectCity = (selectedCity: CityInfo) => {
    setCity(selectedCity);
    setShowModal(false);
  };

  const handleSelectHub = (hub: EducationalHub) => {
    const foundCity = SUPPORTED_CITIES.find((c) => c.id === hub.cityId) || SUPPORTED_CITIES[0];
    setCity(foundCity);
    setShowModal(false);
    router.push(`/pg?q=${encodeURIComponent(hub.queryValue)}`);
  };

  const handleSelectLocality = (loc: { cityObj: CityInfo; localityName: string }) => {
    setCity(loc.cityObj);
    setShowModal(false);
    router.push(`/pg?q=${encodeURIComponent(loc.localityName)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchingHubs.length > 0) {
      handleSelectHub(matchingHubs[0]);
    } else if (matchingLocalities.length > 0) {
      handleSelectLocality(matchingLocalities[0]);
    } else if (matchingCities.length > 0) {
      handleSelectCity(matchingCities[0]);
    } else if (query.length > 0) {
      setShowModal(false);
      router.push(`/pg?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div
      className="f2s-modal-overlay"
      onClick={() => setShowModal(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 23, 44, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="f2s-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(11, 35, 80, 0.35)',
          overflow: 'hidden',
          border: '1px solid rgba(226, 232, 240, 0.9)',
        }}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={() => setShowModal(false)}
          aria-label="Close location selector"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '1.05rem',
            fontWeight: 700,
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          ✕
        </button>

        <div style={{ padding: 'clamp(20px, 4vw, 32px)', overflowY: 'auto', flex: 1 }}>
          {/* ── Search Box (Matching Reference Layout) ────────────────── */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              padding: '14px 18px',
              background: '#ffffff',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              marginBottom: '26px',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#0b2350',
                  letterSpacing: '-0.01em',
                  marginBottom: '2px',
                }}
              >
                Find in and around...
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your college, exam center, locality or city"
                autoFocus
                style={{
                  width: '100%',
                  border: 0,
                  outline: 'none',
                  fontSize: '14.5px',
                  color: '#1e293b',
                  background: 'transparent',
                  padding: 0,
                  fontWeight: 500,
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* GPS Crosshair Button */}
              <button
                type="button"
                onClick={() => detectGpsLocation()}
                disabled={isLocating}
                title="Use Current GPS Location"
                aria-label="Use Current GPS Location"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isLocating ? '#e0f2fe' : '#ecfdf5',
                  border: `1.5px solid ${isLocating ? '#93c5fd' : '#a7f3d0'}`,
                  color: isLocating ? '#0284c7' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isLocating ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {isLocating ? (
                  <span style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>⏳</span>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <circle cx="12" cy="12" r="7" />
                    <line x1="12" y1="2" x2="12" y2="5" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="5" y2="12" />
                    <line x1="19" y1="12" x2="22" y2="12" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                )}
              </button>

              {/* Find2Stay Royal Blue Search Button */}
              <button
                type="submit"
                style={{
                  background: '#1D5BD8',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: '12px',
                  padding: '11px 22px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 14px rgba(29, 91, 216, 0.25)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1548b5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1D5BD8';
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* GPS Feedback / Message Banner */}
          {locationMessage && (
            <div
              style={{
                marginBottom: '20px',
                padding: '10px 16px',
                borderRadius: '12px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <span>{locationMessage}</span>
              <button
                onClick={clearLocationMessage}
                style={{
                  background: 'none',
                  border: 0,
                  color: '#2563eb',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* ── Popular Cities Carousel (Exact Reference Match) ─────── */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '16px',
                letterSpacing: '-0.01em',
              }}
            >
              Popular Cities
            </h4>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {/* Left Arrow */}
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Scroll cities left"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  color: '#1e293b',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                  marginRight: '8px',
                  zIndex: 2,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                ←
              </button>

              {/* Scrollable Container */}
              <div
                ref={carouselRef}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  padding: '10px 4px 16px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  flex: 1,
                }}
              >
                {SUPPORTED_CITIES.map((c) => {
                  const isSelected = city.id === c.id;
                  const monumentSvg = CityMonuments[c.id] || CityMonuments.bengaluru;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCity(c)}
                      style={{
                        minWidth: '104px',
                        maxWidth: '118px',
                        height: '104px',
                        flex: '0 0 auto',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        border: isSelected
                          ? '2px solid #1D5BD8'
                          : '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '10px 6px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected
                          ? '0 6px 18px rgba(29, 91, 216, 0.18)'
                          : '0 2px 6px rgba(0,0,0,0.03)',
                        color: isSelected ? '#1D5BD8' : '#0f172a',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#93c5fd';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                        }
                      }}
                    >
                      {/* Monument Icon */}
                      <div
                        style={{
                          width: '56px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#1D5BD8' : '#0f172a',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {monumentSvg}
                      </div>

                      {/* City Name in Uppercase */}
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            display: 'block',
                            color: isSelected ? '#1D5BD8' : '#1e293b',
                            lineHeight: 1.2,
                          }}
                        >
                          {c.name}
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '4px',
                              fontSize: '9.5px',
                              fontWeight: 700,
                              background: '#1D5BD8',
                              color: '#ffffff',
                              padding: '1px 6px',
                              borderRadius: '999px',
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Scroll cities right"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  color: '#1e293b',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                  marginLeft: '8px',
                  zIndex: 2,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* ── Search Suggestions / Filtered Results ───────────────── */}
          {query.length > 0 && (
            <div
              style={{
                marginTop: '22px',
                paddingTop: '18px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#64748b',
                  marginBottom: '10px',
                }}
              >
                Matching Colleges, Localities &amp; Cities ({matchingHubs.length + matchingLocalities.length + matchingCities.length})
              </div>

              {matchingHubs.length === 0 && matchingCities.length === 0 && matchingLocalities.length === 0 ? (
                <div
                  style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '16px',
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>📍 Area Not Covered Yet</div>
                  <div style={{ fontSize: '14px', color: '#9f1239', fontWeight: 700, marginBottom: '6px' }}>
                    Find2Stay is currently not available in &quot;{search}&quot;.
                  </div>
                  <div style={{ fontSize: '13px', color: '#be123c', maxWidth: '440px', margin: '0 auto 16px', lineHeight: 1.45 }}>
                    Our verified stays and relocation services are currently active in <strong>Noida</strong>, <strong>Greater Noida</strong>, <strong>Delhi NCR</strong>, <strong>Gurugram</strong>, and <strong>Ghaziabad</strong>.
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectCity(SUPPORTED_CITIES[0])}
                      style={{ padding: '8px 16px', background: '#0b2350', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                    >
                      Explore Noida (Active)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectCity(SUPPORTED_CITIES[1])}
                      style={{ padding: '8px 16px', background: '#0b2350', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                    >
                      Explore Delhi NCR (Active)
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: '8px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {/* Matching Colleges & Educational Hubs */}
                  {matchingHubs.map((hub) => (
                    <div
                      key={`hub-${hub.id}`}
                      onClick={() => handleSelectHub(hub)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dcfce7';
                        e.currentTarget.style.borderColor = '#86efac';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f0fdf4';
                        e.currentTarget.style.borderColor = '#bbf7d0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '19px' }}>🎓</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: '#14532d' }}>
                            {hub.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                            {hub.sub}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#15803d',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}
                      >
                        {hub.badge}
                      </span>
                    </div>
                  ))}

                  {/* Matching Localities */}
                  {matchingLocalities.map((loc, idx) => (
                    <div
                      key={`loc-${idx}`}
                      onClick={() => handleSelectLocality(loc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.borderColor = '#bfdbfe';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '17px' }}>
                          {loc.category === 'landmark' ? '🏛️' : '🏘️'}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                            {loc.localityName}{' '}
                            <span style={{ fontWeight: 500, color: '#64748b', fontSize: '12.5px' }}>
                              ({loc.cityName})
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{loc.sub}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          flexShrink: 0,
                        }}
                      >
                        Locality
                      </span>
                    </div>
                  ))}

                  {/* Matching Cities */}
                  {matchingCities.map((c) => (
                    <div
                      key={`city-${c.id}`}
                      onClick={() => handleSelectCity(c)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.borderColor = '#93c5fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📍</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                            {c.name}, {c.state}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{c.tag}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#e0e7ff',
                          color: '#3730a3',
                          padding: '3px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        City
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
