'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface RoomItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  period: string;
  city: string;
  distance: string;
  image: string;
  tags: string[];
}

const DEFAULT_ROOMS: RoomItem[] = [
  {
    id: 'room-1',
    slug: 'girls-pg-near-sector-62',
    title: 'Girls PG near Sector 62',
    price: 7500,
    period: '/ month',
    city: 'Noida',
    distance: '2.1 km',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
    tags: ['Food Included', 'WiFi', 'AC', 'Attached Bath'],
  },
  {
    id: 'room-2',
    slug: 'boys-pg-near-sector-15',
    title: 'Boys PG near Sector 15',
    price: 6000,
    period: '/ month',
    city: 'Noida',
    distance: '1.8 km',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600',
    tags: ['WiFi', 'AC', 'Geyser', 'Furnished'],
  },
  {
    id: 'room-3',
    slug: '1-bhk-flat-near-metro',
    title: '1 BHK Flat near Metro',
    price: 15000,
    period: '/ month',
    city: 'Delhi',
    distance: '3.2 km',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
    tags: ['Furnished', 'Metro Nearby', 'Security'],
  },
  {
    id: 'room-4',
    slug: 'shared-room-in-sector-18',
    title: 'Shared Room in Sector 18',
    price: 5500,
    period: '/ month',
    city: 'Noida',
    distance: '1.5 km',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
    tags: ['WiFi', 'AC', 'Food Optional', 'Prime Location'],
  },
];

interface FeaturedRoomsCarouselProps {
  cityName?: string;
}

export function FeaturedRoomsCarousel({ cityName = 'Noida / Delhi' }: FeaturedRoomsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('f2s_saved_listings');
      if (stored) {
        const arr = JSON.parse(stored);
        const map: Record<string, boolean> = {};
        if (Array.isArray(arr)) {
          arr.forEach((item: { slug?: string; id?: string }) => {
            const key = item.slug || item.id;
            if (key) map[key] = true;
          });
        }
        setWishlist(map);
      }
    } catch {}
  }, []);

  const toggleWishlist = (e: React.MouseEvent, room: RoomItem) => {
    e.preventDefault();
    e.stopPropagation();

    const key = room.slug || room.id;
    const nextState = !wishlist[key];
    const newMap = { ...wishlist, [key]: nextState };
    setWishlist(newMap);

    try {
      const stored = localStorage.getItem('f2s_saved_listings');
      let arr = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(arr)) arr = [];

      if (nextState) {
        if (!arr.some((x: { slug?: string }) => x.slug === room.slug)) {
          arr.push({
            slug: room.slug,
            title: room.title,
            price: `₹${room.price.toLocaleString('en-IN')}`,
            locality: `${room.city} · ${room.distance}`,
            savedAt: new Date().toISOString(),
          });
        }
      } else {
        arr = arr.filter((x: { slug?: string }) => x.slug !== room.slug);
      }
      localStorage.setItem('f2s_saved_listings', JSON.stringify(arr));
      window.dispatchEvent(new Event('f2s-wishlist-change'));
    } catch {}
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="f2s-featured-rooms-container">
      {/* Header with Title and View All */}
      <div className="f2s-section-header">
        <h2 className="f2s-section-title">
          Featured Rooms in <span className="f2s-accent-city">{cityName}</span>
        </h2>
        <Link href="/pg" className="f2s-view-all-link">
          <span>View All</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      {/* Relative wrapper for Carousel Arrow Controls */}
      <div className="f2s-carousel-rel-wrap">
        <button
          type="button"
          onClick={scrollLeft}
          className="f2s-carousel-nav-btn prev"
          aria-label="Previous rooms"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scrollable Track */}
        <div ref={scrollRef} className="f2s-rooms-track">
          {DEFAULT_ROOMS.map((room) => {
            const isSaved = !!wishlist[room.slug || room.id];
            return (
              <div key={room.id} className="f2s-room-card">
                {/* Image & Badges */}
                <div className="f2s-room-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={room.image} alt={room.title} loading="lazy" className="f2s-room-img" />

                  {/* Verified Pill Badge */}
                  <span className="f2s-room-verified-badge">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.8">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Verified</span>
                  </span>

                  {/* Wishlist Heart Toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, room)}
                    className={`f2s-room-heart-btn ${isSaved ? 'saved' : ''}`}
                    title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
                    aria-label="Wishlist"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill={isSaved ? '#EF4444' : 'none'}
                      stroke={isSaved ? '#EF4444' : '#1E293B'}
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="f2s-room-info">
                  <h3 className="f2s-room-title">
                    <Link href={`/listing/${room.slug}`}>{room.title}</Link>
                  </h3>

                  <div className="f2s-room-price-row">
                    <span className="f2s-room-price">₹{room.price.toLocaleString('en-IN')}</span>
                    <span className="f2s-room-period">{room.period}</span>
                  </div>

                  <div className="f2s-room-location">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span>{room.city}</span>
                    <span className="dot">·</span>
                    <span>{room.distance}</span>
                  </div>

                  {/* Amenities / Feature Tags */}
                  <div className="f2s-room-tags">
                    {room.tags.map((tag) => (
                      <span key={tag} className="f2s-room-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 24/7 Verified Stays Concierge Card */}
          <div className="f2s-app-card-desktop">
            <div className="f2s-app-card-content">
              <span className="f2s-concierge-badge">💬 24/7 CONCIERGE</span>
              <h3 className="f2s-app-card-title">Need Help Finding a Stay?</h3>
              <p className="f2s-app-card-desc">
                Talk directly with our local city housing experts for custom room options &amp; zero-brokerage visits.
              </p>

              <div className="f2s-app-stores-row">
                <a
                  href="https://wa.me/919999999999?text=Hi%20Find2Stay%2C%20I%20need%20help%20finding%20a%20verified%20stay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f2s-store-badge-btn whatsapp"
                  title="Connect with Find2Stay Advisor on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                  </svg>
                  <div className="f2s-store-badge-text">
                    <small>ZERO BROKERAGE</small>
                    <b>WhatsApp Us</b>
                  </div>
                </a>
              </div>
            </div>

            {/* Smartphone Graphic Mockup */}
            <div className="f2s-app-mockup-wrap">
              <div className="f2s-app-mockup-phone">
                <div className="f2s-mockup-screen">
                  <div className="f2s-mockup-notch" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/logo-icon.png"
                    alt="F2S App"
                    width={48}
                    height={48}
                    className="f2s-mockup-logo-img"
                  />
                  <div className="f2s-mockup-brand">
                    <span>Find<b>2</b>Stay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollRight}
          className="f2s-carousel-nav-btn next"
          aria-label="Next rooms"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
