'use client';

import React, { useEffect, useRef, useState } from 'react';

export function StockBackgroundAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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
      {/* ── Background Ambient Stock Video Loop (Static & Non-Distracting) ──── */}
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
          opacity: isPlaying ? 0.16 : 0,
          transition: 'opacity 1.2s ease',
          filter: 'contrast(1.1) saturate(1.15) brightness(0.92)',
          mixBlendMode: 'luminosity',
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        <source src="/videos/hero-bg.webm" type="video/webm" />
      </video>

      {/* ── Blueprint Dot Matrix Grid ──────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(29, 91, 216, 0.14) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
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
          top: '8%',
          right: '4%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(29, 91, 216, 0.28) 0%, rgba(59, 130, 246, 0.12) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'f2s-float-orb-1 18s ease-in-out infinite',
        }}
      />

      {/* Orb 2: Vibrant Amber Glow (Center Left) */}
      <div
        className="anim-orb anim-orb-2"
        style={{
          position: 'absolute',
          top: '40%',
          left: '-5%',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 122, 26, 0.22) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%)',
          filter: 'blur(65px)',
          animation: 'f2s-float-orb-2 22s ease-in-out infinite',
        }}
      />

      {/* Orb 3: Emerald Hub Pulse (Bottom Right) */}
      <div
        className="anim-orb anim-orb-3"
        style={{
          position: 'absolute',
          bottom: '12%',
          right: '18%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.06) 50%, transparent 70%)',
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
