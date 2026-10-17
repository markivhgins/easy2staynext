'use client';

import React, { useEffect, useRef, useState } from 'react';

export function HeroVideoBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Autoplay video muted for high-compatibility background loop
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay fallback
            setIsPlaying(false);
          });
      }
    }
  }, []);

  return (
    <div
      className="hero-video-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* ── High-Definition Local 1080p Stock Video Loop (Static & Smooth) ─ */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlaying={() => setIsPlaying(true)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%) scale(1.02)',
          objectFit: 'cover',
          opacity: isPlaying ? 0.85 : 0.6,
          transition: 'opacity 0.6s ease',
          filter: 'contrast(1.08) saturate(1.15) brightness(0.95)',
        }}
      >
        {/* Crisp Local 1080p full HD file */}
        <source src="/videos/hero-bg.webm" type="video/webm" />
      </video>

      {/* ── Subtle Geometric Blueprint Dot Grid Matrix ──────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* ── Luminous Ambient Glow Orbs for Visual Polish ──────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29, 91, 216, 0.35) 0%, rgba(56, 189, 248, 0.15) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 122, 26, 0.28) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Refined Contrast Gradient for Text Legibility ─ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(7, 27, 75, 0.52) 0%, rgba(7, 27, 75, 0.38) 40%, rgba(7, 27, 75, 0.76) 100%)',
        }}
      />

      {/* ── Bottom Edge Transition into Search & Content ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: '100px',
          background: 'linear-gradient(to top, rgba(7, 27, 75, 0.95), transparent)',
        }}
      />
    </div>
  );
}
