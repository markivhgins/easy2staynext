import React from 'react';
import Link from 'next/link';
import { searchListings } from '@/lib/listings';
import { HeroSearchBar } from '@/components/search/HeroSearchBar';
import { FeaturedRoomsCarousel } from '@/components/home/FeaturedRoomsCarousel';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { LocalityMapExplorer } from '@/components/maps/LocalityMapExplorer';

export default async function HomePage() {
  const allListings = await searchListings();

  return (
    <div className="f2s-home-page">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section className="f2s-hero-section">
        <div className="f2s-hero-inner wrap">
          {/* Hero Left Content */}
          <div className="f2s-hero-text">
            <p className="f2s-hero-eyebrow">Study | Work | Live | Grow</p>
            <h1 className="f2s-hero-heading">
              Your Journey Begins with <span className="f2s-hero-highlight">the Right Stay</span>
            </h1>
            <p className="f2s-hero-sub">
              Verified Rooms, Hassle-free Shifting, Healthy Food and Clean Water – All in One Platform.
            </p>

            {/* 4 Trust Badges in Frosted Glass Pills */}
            <div className="f2s-hero-trust-badges">
              <div className="f2s-trust-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="trust-icon">
                  <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
                  <path d="M8.5 12l2.5 2.5 5-5" />
                </svg>
                <span>Verified Properties</span>
              </div>

              <div className="f2s-trust-pill">
                <span className="trust-rupee">₹</span>
                <span>Transparent Pricing</span>
              </div>

              <div className="f2s-trust-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="trust-icon green">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Student Safe Stay</span>
              </div>

              <div className="f2s-trust-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="trust-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Trusted Community</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals: Floating Script & Glass Cards Over Panoramic Landscape Background */}
          <div className="f2s-hero-visual">
            <div className="f2s-hero-elements-wrap">
              {/* Floating Brush/Script Callout */}
              <div className="f2s-hero-script-callout">
                <div className="f2s-script-text">
                  New City<br />New Friends<br />Right Stay
                </div>
                {/* Curved Arrow Vector pointing down/left */}
                <svg viewBox="0 0 54 54" fill="none" stroke="#F36C16" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="f2s-script-arrow">
                  <path d="M46 6 C34 18, 20 22, 14 42 M14 42 L11 29 M14 42 L27 38" />
                </svg>
              </div>

              {/* Floating Frosted Glass Card: More Than Just a Room */}
              <div className="f2s-hero-more-card">
                <div className="f2s-more-header">
                  <span>More Than Just a Room</span>
                </div>
                <div className="f2s-more-list">
                  <Link href="/pg" className="f2s-more-item">
                    <span className="f2s-more-icon blue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
                      </svg>
                    </span>
                    <div className="f2s-more-text-group">
                      <b className="f2s-more-title">Verified Stays</b>
                      <small className="f2s-more-sub">PGs, Flats &amp; Hostels</small>
                    </div>
                    <span className="f2s-more-arrow">›</span>
                  </Link>

                  <Link href="/services/shifting" className="f2s-more-item">
                    <span className="f2s-more-icon cyan">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="1" y="3" width="15" height="13" rx="1" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </span>
                    <div className="f2s-more-text-group">
                      <b className="f2s-more-title">Easy Shifting</b>
                      <small className="f2s-more-sub">Local Packers &amp; Movers</small>
                    </div>
                    <span className="f2s-more-arrow">›</span>
                  </Link>

                  <Link href="/services/tiffin" className="f2s-more-item">
                    <span className="f2s-more-icon green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 2a3 3 0 0 0-3 3v1H5a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-4V5a3 3 0 0 0-3-3z" />
                        <path d="M4 11v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8" />
                      </svg>
                    </span>
                    <div className="f2s-more-text-group">
                      <b className="f2s-more-title">Healthy Tiffin</b>
                      <small className="f2s-more-sub">Fresh Homemade Food</small>
                    </div>
                    <span className="f2s-more-arrow">›</span>
                  </Link>

                  <Link href="/services/ro-water" className="f2s-more-item">
                    <span className="f2s-more-icon lightblue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    </span>
                    <div className="f2s-more-text-group">
                      <b className="f2s-more-title">RO Water Cans</b>
                      <small className="f2s-more-sub">Clean 20L Fast Delivery</small>
                    </div>
                    <span className="f2s-more-arrow">›</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search Bar Overlapping Hero Base ─────────────────────────── */}
        <div className="f2s-hero-search-container wrap">
          <HeroSearchBar />
        </div>
      </section>

      {/* ── 2. Four Circular Service Highlights Strip ─────────────────── */}
      <section className="f2s-services-strip-section">
        <div className="wrap f2s-services-strip-grid">
          <Link href="/pg" className="f2s-strip-card">
            <span className="f2s-strip-icon-circle blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
              </svg>
            </span>
            <div className="f2s-strip-text">
              <b className="f2s-strip-title">Verified Rooms</b>
              <span className="f2s-strip-desc">PG | Flat | Shared Room</span>
            </div>
          </Link>

          <Link href="/services/shifting" className="f2s-strip-card">
            <span className="f2s-strip-icon-circle orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <div className="f2s-strip-text">
              <b className="f2s-strip-title">Easy Shifting Service</b>
              <span className="f2s-strip-desc">Hassle-free &amp; Affordable</span>
            </div>
          </Link>

          <Link href="/services/tiffin" className="f2s-strip-card">
            <span className="f2s-strip-icon-circle green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2a3 3 0 0 0-3 3v1H5a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-4V5a3 3 0 0 0-3-3z" />
                <path d="M4 11v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8" />
              </svg>
            </span>
            <div className="f2s-strip-text">
              <b className="f2s-strip-title">Home Style Tiffin</b>
              <span className="f2s-strip-desc">Healthy | Tasty | Affordable</span>
            </div>
          </Link>

          <Link href="/services/ro-water" className="f2s-strip-card">
            <span className="f2s-strip-icon-circle cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </span>
            <div className="f2s-strip-text">
              <b className="f2s-strip-title">RO Water Supply</b>
              <span className="f2s-strip-desc">Clean | Safe | At Your Doorstep</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 3. Featured Rooms with Carousel & App Download Card ───────── */}
      <section className="f2s-featured-rooms-section">
        <div className="wrap">
          <FeaturedRoomsCarousel cityName="Noida / Delhi" />
        </div>
      </section>

      {/* ── 4. How Find2Stay Works? Stepper + Healthy Tiffin Banner ────── */}
      <section className="f2s-how-works-section">
        <div className="wrap f2s-how-works-grid">
          {/* Stepper Card */}
          <div className="f2s-how-card">
            <h2 className="f2s-how-title">How Find2Stay Works?</h2>
            <div className="f2s-stepper-row">
              {/* Step 1 */}
              <div className="f2s-step-col">
                <div className="f2s-step-icon-wrap blue">
                  <span className="f2s-step-num">1</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="f2s-step-svg">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" />
                  </svg>
                </div>
                <div className="f2s-step-title">Search</div>
                <p className="f2s-step-desc">Find verified rooms and services near you</p>
              </div>

              <div className="f2s-step-arrow">→</div>

              {/* Step 2 */}
              <div className="f2s-step-col">
                <div className="f2s-step-icon-wrap orange">
                  <span className="f2s-step-num">2</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="f2s-step-svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="f2s-step-title">Compare</div>
                <p className="f2s-step-desc">View photos, video, amenities and location</p>
              </div>

              <div className="f2s-step-arrow">→</div>

              {/* Step 3 */}
              <div className="f2s-step-col">
                <div className="f2s-step-icon-wrap green">
                  <span className="f2s-step-num">3</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="f2s-step-svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="f2s-step-title">Book / Visit</div>
                <p className="f2s-step-desc">Connect with verified owner or partner</p>
              </div>

              <div className="f2s-step-arrow">→</div>

              {/* Step 4 */}
              <div className="f2s-step-col">
                <div className="f2s-step-icon-wrap cyan">
                  <span className="f2s-step-num">4</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="f2s-step-svg">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div className="f2s-step-title">Move In &amp; Settle</div>
                <p className="f2s-step-desc">Get shifting, tiffin and RO water easily</p>
              </div>
            </div>
          </div>

          {/* Healthy Tiffin Promo Banner (Matches Image 1 bottom right) */}
          <div className="f2s-tiffin-promo-banner">
            <div className="f2s-tiffin-promo-content">
              <h3 className="f2s-tiffin-promo-heading">Healthy Tiffin Near You</h3>
              <ul className="f2s-tiffin-checkmarks">
                <li>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10B981" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Home Style Food</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10B981" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Affordable Plans</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10B981" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>2 Km Delivery Radius</span>
                </li>
              </ul>
              <Link href="/services/tiffin" className="f2s-tiffin-cta-btn">
                <span>Explore Tiffin</span>
                <span>→</span>
              </Link>
            </div>
            <div className="f2s-tiffin-promo-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/tiffin-delicious-thali.jpg"
                alt="Healthy Home Style Tiffin"
                className="f2s-tiffin-promo-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Responsive Service Promo Cards (Matches Mobile Image 2) ── */}
      <section className="f2s-service-cards-section wrap">
        <div className="f2s-service-cards-grid">
          {/* Shifting Card */}
          <div className="f2s-service-card shifting">
            <div className="f2s-service-card-info">
              <div className="f2s-service-header-row">
                <span className="f2s-service-badge-icon orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <div>
                  <h4 className="f2s-service-title">Shifting</h4>
                  <p className="f2s-service-tagline">Safe | Hassle-free</p>
                </div>
              </div>
              <Link href="/services/shifting" className="f2s-service-action-btn orange">
                <span>Book Shifting</span>
                <span>→</span>
              </Link>
            </div>
            <div className="f2s-service-photo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=400"
                alt="Packers and movers shifting"
                className="f2s-service-photo"
              />
            </div>
          </div>

          {/* Tiffin Card */}
          <div className="f2s-service-card tiffin">
            <div className="f2s-service-card-info">
              <div className="f2s-service-header-row">
                <span className="f2s-service-badge-icon green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2a3 3 0 0 0-3 3v1H5a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-4V5a3 3 0 0 0-3-3z" />
                    <path d="M4 11v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8" />
                  </svg>
                </span>
                <div>
                  <h4 className="f2s-service-title">Tiffin</h4>
                  <p className="f2s-service-tagline">Healthy | Home Style</p>
                </div>
              </div>
              <Link href="/services/tiffin" className="f2s-service-action-btn green">
                <span>Explore Tiffin</span>
                <span>→</span>
              </Link>
            </div>
            <div className="f2s-service-photo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
                alt="Indian thali meal"
                className="f2s-service-photo"
              />
            </div>
          </div>

          {/* RO Water Card */}
          <div className="f2s-service-card water">
            <div className="f2s-service-card-info">
              <div className="f2s-service-header-row">
                <span className="f2s-service-badge-icon cyan">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </span>
                <div>
                  <h4 className="f2s-service-title">RO Water</h4>
                  <p className="f2s-service-tagline">Clean | Safe | Regular Supply</p>
                </div>
              </div>
              <Link href="/services/ro-water" className="f2s-service-action-btn blue">
                <span>Order Water</span>
                <span>→</span>
              </Link>
            </div>
            <div className="f2s-service-photo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400"
                alt="Pure bottled drinking water"
                className="f2s-service-photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Instant Verified Stay Concierge Strip on WhatsApp (Premium Redesign) ─────── */}
      <section className="f2s-concierge-section wrap">
        <div className="f2s-concierge-card">
          <div className="f2s-concierge-left">
            <div className="f2s-concierge-badge">
              <span className="f2s-pulse-dot" />
              <span>24/7 VERIFIED STAY CONCIERGE</span>
            </div>
            <h3 className="f2s-concierge-title">
              Need a Verified Room Fast? Chat on <span className="highlight-wa">WhatsApp</span>
            </h3>
            <p className="f2s-concierge-desc">
              Skip endless calls. Share your budget, preferred locality, and move-in date with our local operations team to get verified, zero-brokerage room options instantly.
            </p>
            <div className="f2s-concierge-features">
              <div className="f2s-concierge-feat">
                <span className="feat-icon">🛡️</span>
                <span>100% Verified Stays</span>
              </div>
              <div className="f2s-concierge-feat">
                <span className="feat-icon">⚡</span>
                <span>Direct Owner Contacts</span>
              </div>
              <div className="f2s-concierge-feat">
                <span className="feat-icon">💰</span>
                <span>Zero Brokerage Guaranteed</span>
              </div>
            </div>
          </div>

          <div className="f2s-concierge-actions">
            <a
              href="https://wa.me/919999999999?text=Hi%20Find2Stay%2C%20I%20am%20looking%20for%20a%20verified%20stay"
              target="_blank"
              rel="noopener noreferrer"
              className="f2s-btn-concierge-wa"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
              </svg>
              <div className="f2s-btn-concierge-text">
                <span className="sub">INSTANT ASSISTANCE</span>
                <span className="main">Chat on WhatsApp</span>
              </div>
            </a>

            <Link href="/pg" className="f2s-btn-concierge-browse">
              <span style={{ fontSize: '18px' }}>🔍</span>
              <div className="f2s-btn-concierge-text">
                <span className="sub">BROWSE PLATFORM</span>
                <span className="main">Explore All Stays</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Statistics Strip ────────────────────────────────────────── */}
      <section className="f2s-stats-bar-section">
        <div className="wrap f2s-stats-grid">
          <div className="f2s-stat-card">
            <span className="f2s-stat-icon">👥</span>
            <div>
              <b className="f2s-stat-num">10,000+</b>
              <span className="f2s-stat-label">Happy Users (Soon)</span>
            </div>
          </div>

          <div className="f2s-stat-card">
            <span className="f2s-stat-icon">🏠</span>
            <div>
              <b className="f2s-stat-num">500+</b>
              <span className="f2s-stat-label">Verified Properties</span>
            </div>
          </div>

          <div className="f2s-stat-card">
            <span className="f2s-stat-icon">🏢</span>
            <div>
              <b className="f2s-stat-num">Noida / Delhi</b>
              <span className="f2s-stat-label">Launch City</span>
            </div>
          </div>

          <div className="f2s-stat-card">
            <span className="f2s-stat-icon">⭐</span>
            <div>
              <b className="f2s-stat-num">All-in-One Platform</b>
              <span className="f2s-stat-label">Stay | Shifting | Tiffin | RO Water</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. What Our Users Say (Testimonials) ───────────────────────── */}
      <section className="f2s-testimonials-section wrap">
        <TestimonialsCarousel />
      </section>

      {/* ── 9. Locality Map Explorer ────────────────────────────────────── */}
      <section className="f2s-map-explorer-section wrap">
        <div className="f2s-section-header">
          <div>
            <h2 className="f2s-section-title">Explore Top Localities &amp; Hubs</h2>
            <p className="f2s-section-desc">
              Browse student hubs, coaching clusters and residential enclaves. Click any locality to check verified stays.
            </p>
          </div>
          <Link href="/pg" className="f2s-view-all-link">
            <span>View All Stays</span>
            <span>→</span>
          </Link>
        </div>
        <LocalityMapExplorer listings={allListings} />
      </section>
    </div>
  );
}
