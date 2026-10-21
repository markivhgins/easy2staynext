'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sneha',
    role: 'Student',
    avatar: '/img/testimonial-sneha.jpg',
    quote: 'Find2Stay made my shifting and stay in Noida so easy. Verified rooms and great support!',
    stars: 5,
  },
  {
    id: 'test-2',
    name: 'Aman Verma',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    quote: 'Found a genuine flat with zero brokerage. Operations verified the house beforehand so no surprises!',
    stars: 5,
  },
  {
    id: 'test-3',
    name: 'Priya Sharma',
    role: 'DU North Campus Aspirant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    quote: 'The home-style tiffin subscription and clean RO water delivery right at the room made living away from home effortless.',
    stars: 5,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? TESTIMONIALS.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === TESTIMONIALS.length - 1 ? 0 : prevIdx + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <div className="f2s-testimonials-wrapper">
      <div className="f2s-section-header">
        <h2 className="f2s-section-title">What Our Users Say</h2>
      </div>

      <div className="f2s-testimonial-card-wrap">
        {/* Prev Arrow */}
        <button
          type="button"
          onClick={prev}
          className="f2s-testimonial-nav-btn prev"
          aria-label="Previous review"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Active Testimonial Card */}
        <div className="f2s-testimonial-card">
          <div className="f2s-testimonial-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.avatar} alt={current.name} className="f2s-testimonial-avatar" />
          </div>

          <div className="f2s-testimonial-content">
            <p className="f2s-testimonial-quote">&ldquo;{current.quote}&rdquo;</p>
            <div className="f2s-testimonial-author-row">
              <span className="f2s-testimonial-author-name">
                — {current.name}, {current.role}
              </span>
              <div className="f2s-testimonial-stars" aria-label="5 stars">
                {'★'.repeat(current.stars)}
              </div>
            </div>
          </div>
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={next}
          className="f2s-testimonial-nav-btn next"
          aria-label="Next review"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="f2s-testimonial-dots">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            className={`f2s-testimonial-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
