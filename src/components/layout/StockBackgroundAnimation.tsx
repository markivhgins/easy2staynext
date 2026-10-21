'use client';

import React, { useEffect, useRef, useState } from 'react';

export function StockBackgroundAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Still show video even if autoPlay is pending
            setIsPlaying(true);
          });
      }
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        contain: 'paint layout',
      }}
    >
      {/* ── Base Ambient Foundation (Smooth Transition from Hero Slate into Crisp Icy-Blue) ──── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, #0E1D36 0%, #172D4F 200px, #E8F2FD 460px, #F1F6FE 800px, #EAF2FC 100%)',
        }}
      />

      {/* ── Background Ambient Stock Video Loop (Crisp, Smooth, Truly Visible) ──── */}
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
          opacity: 0.44,
          transition: 'opacity 0.8s ease',
          filter: 'contrast(1.08) saturate(1.15) brightness(0.96)',
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        <source src="/videos/hero-bg.webm" type="video/webm" />
      </video>

      {/* ── Appealing Soft Blue Atmospheric Overlay for Elegant Contrast ──── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(14, 29, 54, 0.25) 0%, rgba(219, 234, 254, 0.35) 240px, rgba(239, 246, 255, 0.50) 600px, rgba(244, 248, 254, 0.58) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Blueprint Dot Matrix Grid ──────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(29, 91, 216, 0.18) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.85,
        }}
      />

      {/* ── Glowing Luminous Scanner Beam ──────────────────────── */}
      <div className="bg-scanline" />

      {/* ── Prominent Floating Aurora Mesh Gradient Spheres ──────────── */}
      {/* Orb 1: Royal Blue Drift (Top Right) */}
      <div
        className="anim-orb anim-orb-1"
        style={{
          position: 'absolute',
          top: '6%',
          right: '4%',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(29, 91, 216, 0.32) 0%, rgba(59, 130, 246, 0.16) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'f2s-float-orb-1 18s ease-in-out infinite',
        }}
      />

      {/* Orb 2: Vibrant Amber Glow (Center Left) */}
      <div
        className="anim-orb anim-orb-2"
        style={{
          position: 'absolute',
          top: '38%',
          left: '-5%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 122, 26, 0.24) 0%, rgba(245, 158, 11, 0.10) 50%, transparent 70%)',
          filter: 'blur(65px)',
          animation: 'f2s-float-orb-2 22s ease-in-out infinite',
        }}
      />

      {/* Orb 3: Emerald Hub Pulse (Bottom Right) */}
      <div
        className="anim-orb anim-orb-3"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '16%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.24) 0%, rgba(5, 150, 105, 0.08) 50%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'f2s-float-orb-3 25s ease-in-out infinite',
        }}
      />

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes f2s-float-orb-1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-40px, 50px, 0) scale(1.1);
          }
        }
        @keyframes f2s-float-orb-2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(60px, -45px, 0) scale(1.12);
          }
        }
        @keyframes f2s-float-orb-3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-35px, -40px, 0) scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
