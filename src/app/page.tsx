import React from 'react';
import Link from 'next/link';
import { searchListings } from '@/lib/listings';
import { inr, hash } from '@/lib/format';
import { FloorPlan } from '@/components/listings/FloorPlan';
import { LocalityMapExplorer } from '@/components/maps/LocalityMapExplorer';
import { HeroSearchBar } from '@/components/search/HeroSearchBar';
import { HeroVideoBackdrop } from '@/components/layout/HeroVideoBackdrop';

const PH = {
  students: '1523240795612-9a054b0db644',
  food: '1546069901-ba9599a7e63c',
  water: '1548839140-29a749e1cf4d',
  movers: '1600518464441-9154a4dea21b',
};

const PHOTO_IDS = ['1555854877-bab0e564b8d5', '1522771739844-6a9f6d5f14af', '1505691938895-1758d7feb511', '1522708323590-d24dbb6b0267'];

export default async function HomePage() {
  const allListings = await searchListings();
  const topListings = [...allListings]
    .sort((a, b) => a.verifiedAgeDays - b.verifiedAgeDays)
    .slice(0, 8);

  const localitiesCount = new Set(allListings.map((x) => x.locality)).size;

  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="h2hero">
        <HeroVideoBackdrop />
        <div className="wrap h2g">
          <div className="h2txt">
            <p className="h2eye">Study | Work | Live | Grow</p>
            <h1>
              Your Journey Begins with <em>The Right Stay</em>
            </h1>
            <p className="h2lead">
              Verified rooms, hassle-free shifting, healthy food and clean water. All in one platform.
            </p>
            <ul className="h2trust">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
                  <path d="M8.5 12l2.5 2.5 5-5" />
                </svg>
                Verified properties
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h8l8 8-8 8-8-8z" />
                  <path d="M8 8h.01" />
                </svg>
                Transparent pricing
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2.5 20c.6-3.5 3-5.5 6.5-5.5s5.9 2 6.5 5.5M16 5a3.5 3.5 0 0 1 0 7M18 14.8c2 .6 3.2 2.4 3.5 5.2" />
                </svg>
                Trusted community
              </li>
            </ul>
          </div>

          <div className="h2pic">
            <div className="h2pic-vignette" />

            <div className="h2pic-badge-top">
              <span className="h2pic-pulse-dot" />
              <span>Verified Student &amp; Professional Hubs</span>
            </div>

            <div className="h2pic-badge-top-right">
              <span>🛡️ 100% On-Site Audited</span>
            </div>

            <div className="h2pic-floating-tag">
              <span>⚡ ₹0 Brokerage Guaranteed</span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ph"
              src={`https://images.unsplash.com/photo-${PH.students}?auto=format&fit=crop&q=80&w=1000`}
              alt="Students and young professionals across verified stays"
              loading="lazy"
            />

            <div className="h2pic-overlay-card">
              <div className="h2pic-compact-wrap">
                <div className="h2pic-compact-left">
                  <div className="h2pic-avatars">
                    <span className="h2pic-avatar" title="Students">🎓</span>
                    <span className="h2pic-avatar" title="Aspirants">📚</span>
                    <span className="h2pic-avatar" title="Professionals">💼</span>
                  </div>
                  <strong className="h2pic-compact-text">
                    New City · <em>New Life</em> · <span>Right Stay</span>
                  </strong>
                </div>
                <div className="h2pic-compact-right">
                  <b>4.9 ★</b> (2,400+ reviews)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search Bar with On-Page Autocomplete ─────────────────────── */}
        <HeroSearchBar />
      </section>

      {/* ── Feature Highlights ────────────────────────────────────────── */}
      <section className="h2feat">
        <div className="wrap">
          <div>
            <span className="ib b">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
              </svg>
            </span>
            <p>
              <b>Verified Rooms</b>PG | Flat | Shared Room
            </p>
          </div>
          <div>
            <span className="ib o">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 6h11v10H2zM13 9h4l3 3v4h-7M6 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01" />
              </svg>
            </span>
            <p>
              <b>Easy Shifting</b>Safe &amp; affordable
            </p>
          </div>
          <div>
            <span className="ib g">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 11h16a8 8 0 0 1-16 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4" />
              </svg>
            </span>
            <p>
              <b>Home Style Tiffin</b>Healthy, tasty, affordable
            </p>
          </div>
          <div>
            <span className="ib c">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
              </svg>
            </span>
            <p>
              <b>RO Water Supply</b>Clean | Safe | Doorstep
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ────────────────────────────────────────────── */}
      <section className="h2sec">
        <div className="wrap">
          <div className="h2h">
            <h2>
              Featured <em>Verified Stays</em>
            </h2>
            <Link href="/pg">View All →</Link>
          </div>
          <div className="h2row">
            {topListings.map((x) => {
              const photoId = PHOTO_IDS[hash(x.slug) % PHOTO_IDS.length];
              return (
                <Link key={x.slug} className="fc" href={`/listing/${x.slug}`}>
                  <div className="fi">
                    <FloorPlan bhk={x.bhk} occupancy={x.occupancy} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="ph"
                      src={`https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=70&w=600`}
                      alt={x.title}
                      loading="lazy"
                    />
                    <span className="vb">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-3.5 h-3.5 inline mr-1">
                        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
                        <path d="M8.5 12l2.5 2.5 5-5" />
                      </svg>
                      Verified
                    </span>
                  </div>
                  <div className="fb">
                    <h3>{x.title}</h3>
                    <p className="fp">
                      <b>{inr(x.price.amountPaise)}</b> <span>/ month</span>
                    </p>
                    <p className="fl">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-3.5 h-3.5 inline mr-1">
                        <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {x.locality}
                    </p>
                    <p className="ft">
                      {x.occupancy && <i>{x.occupancy}</i>}
                      {x.bhk && <i>{x.bhk}</i>}
                      {x.gender && <i>{x.gender === 'any' ? x.furnishing || 'Anyone' : x.gender}</i>}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Locality Map Explorer ────────────────────────────────────────── */}
      <section className="h2sec bg-slate-50/70 py-14 border-y border-gray-200/60">
        <div className="wrap">
          <div className="h2h mb-6">
            <div>
              <h2>
                Explore <em>Top Localities &amp; Hubs</em>
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Browse student hubs, coaching clusters and residential enclaves across top education and professional destinations. Click any locality to check verified accommodations and proximity.
              </p>
            </div>
            <Link href="/pg" className="hidden sm:inline-block">View All Stays →</Link>
          </div>
          <LocalityMapExplorer listings={allListings} />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="h2sec">
        <div className="wrap h2how">
          <h2>
            How <em>Find2Stay</em> Works?
          </h2>
          <ol>
            <li>
              <div className="h2step-badge">1</div>
              <b>Search</b>
              <small>Find verified rooms and essential relocation services near you</small>
            </li>
            <li>
              <div className="h2step-badge">2</div>
              <b>Compare</b>
              <small>View real photos, total move-in costs, amenities and verified rules</small>
            </li>
            <li>
              <div className="h2step-badge">3</div>
              <b>Book / Visit</b>
              <small>Schedule an in-person visit with operations confirmation &amp; consent</small>
            </li>
            <li>
              <div className="h2step-badge">4</div>
              <b>Move In &amp; Settle</b>
              <small>Get connected to vetted shifting, tiffin, and RO water delivery</small>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Services Overview ─────────────────────────────────────────── */}
      <section className="h2sec">
        <div className="wrap h2svc">
          <div className="sv movers">
            <div className="svp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${PH.movers}?auto=format&fit=crop&q=70&w=700`}
                alt="Packers & Movers"
                loading="lazy"
              />
            </div>
            <div className="svt">
              <h3>Shifting</h3>
              <p>Safe &amp; hassle-free home relocation across top cities.</p>
              <Link className="svb" href="/services/movers">
                Book Shifting →
              </Link>
            </div>
          </div>

          <div className="sv food">
            <div className="svp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${PH.food}?auto=format&fit=crop&q=70&w=700`}
                alt="Tiffin & Meals"
                loading="lazy"
              />
            </div>
            <div className="svt">
              <h3>Tiffin</h3>
              <p>Healthy, hygienic home-style daily meal delivery.</p>
              <Link className="svb" href="/services/food">
                Explore Tiffin →
              </Link>
            </div>
          </div>

          <div className="sv water">
            <div className="svp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${PH.water}?auto=format&fit=crop&q=70&w=700`}
                alt="RO Water Supply"
                loading="lazy"
              />
            </div>
            <div className="svt">
              <h3>RO Water</h3>
              <p>Clean, certified drinking water jars delivered regularly.</p>
              <Link className="svb" href="/services/water">
                Order Water →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Band ────────────────────────────────────────────────── */}
      <section className="h2stats">
        <div className="wrap">
          <div>
            <p>
              <b>{allListings.length}+</b>Verified stays live
            </p>
          </div>
          <div>
            <p>
              <b>{localitiesCount}+</b>Localities covered
            </p>
          </div>
          <div>
            <p>
              <b>Pan-India</b>10+ Education Hubs
            </p>
          </div>
          <div>
            <p>
              <b>All-in-One</b>Stay | Shifting | Tiffin | RO Water
            </p>
          </div>
        </div>
      </section>

      {/* ── Owner CTA ─────────────────────────────────────────────────── */}
      <section className="owner">
        <div className="wrap two">
          <div>
            <h2>Own a PG, hostel, flat or rental home?</h2>
            <p className="lead">
              List it free. We inspect it, you control availability, and tenants arrive having seen transparent costs.
            </p>
          </div>
          <div className="ocol">
            <Link className="go light" href="/list-your-property">
              List your property
            </Link>
            <Link href="/owner">Owner Dashboard →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
