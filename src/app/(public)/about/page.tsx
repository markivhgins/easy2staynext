import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Find2Stay | Building Trust in Relocation',
  description:
    'Every journey begins with the right stay. Find2Stay makes accommodation search, shifting, meals, and water simple, safe, and transparent.',
};

const PILLARS = [
  { num: '01', title: 'Stay', desc: 'Verified PGs, hostels, rooms, flats & co-living.' },
  { num: '02', title: 'Settle', desc: 'Food, shifting, RO water, and essential local support.' },
  { num: '03', title: 'Trust', desc: 'Verified partners, transparent pricing & reliable human support.' },
  { num: '04', title: 'Scale', desc: 'A city-by-city platform built for India’s massive relocation market.' },
];

const STRUGGLES = [
  'Spent weeks wandering unfamiliar streets to find safe & decent stays',
  'Dealt with fraudulent broker listings and phantom properties',
  'No transparency in pricing, surprise utility and maintenance bills',
  'Struggled with unresponsive landlords and unfair deposit withholdings',
  'Hard to find verified and hygienic tiffin or clean drinking water',
  'Lost valuable study and work hours to relocation stress',
];

export default function AboutPage() {
  return (
    <>
      <section className="head ab">
        <div className="wrap hd">
          <div>
            <p className="eyebrow dk">About Find2Stay</p>
            <h1>Building a trusted relocation experience for a moving India.</h1>
            <p>
              Every move begins with a search. Every journey begins with the right stay. Find2Stay makes that first step
              simple, safe, and trustworthy.
            </p>
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="wrap two">
          <div>
            <h2>What is Find2Stay?</h2>
            <p className="lead dk">
              A relocation platform connecting people with verified accommodation, trusted service partners, and
              relocation essentials — all through one seamless experience.
            </p>
            <p className="mt-4 text-gray-700">
              Starting in Noida &amp; Delhi NCR, we are proving that accommodation discovery can be authentic, prices can be
              honest, and everyday relocation services can be dependable.
            </p>
          </div>
          <div className="pill">
            {PILLARS.map((p) => (
              <div key={p.num}>
                <i>{p.num}</i>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="belief">
        <div className="wrap">
          <b>Our Belief</b> From finding a place to live to truly feeling at home in a new city.
        </div>
      </section>

      <section className="pad tint" id="founder">
        <div className="wrap">
          <div className="sech">
            <h2>Founder story: from personal struggle, to a nationwide mission</h2>
          </div>
          <div className="fgrid">
            <figure className="fcard">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/founder.jpg"
                alt="Vipin Singh, Founder and CEO of Find2Stay"
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              <figcaption>
                <b>Vipin Singh</b>
                <span>Founder &amp; CEO, Find2Stay</span>
                <span>IITian (Graduate)</span>
                <span>Civil Services Aspirant</span>
              </figcaption>
            </figure>
            <div>
              <p className="lead dk">
                My own journeys as a student and aspirant across different Indian cities showed me the deep, unnecessary
                struggles faced by lakhs of students and working professionals every single year.
              </p>
              <h3 className="been mt-6 mb-3">We have lived through these challenges:</h3>
              <ul className="been">
                {STRUGGLES.map((text, idx) => (
                  <li key={idx}>
                    <span aria-hidden="true">0{idx + 1}</span>
                    {text}
                  </li>
                ))}
              </ul>
              <blockquote className="mt-6">
                These challenges aren&apos;t just mine — they are faced by millions of young Indians relocating for study
                and work. That&apos;s why we built Find2Stay: one unified, verified platform that makes finding, booking, and
                settling completely hassle-free.
                <cite>One Platform. Everything You Need. A Better Way to Stay.</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="mvv">
        <div className="wrap trio">
          <div>
            <small>Our Mission</small>
            <p>
              To make every student and professional&apos;s relocation journey easy, safe, and stress-free with total
              transparency and verified trust.
            </p>
          </div>
          <div>
            <small>Our Vision</small>
            <p>
              To become India&apos;s most reliable relocation ecosystem, empowering millions of relocators city by city.
            </p>
          </div>
          <div>
            <small>Our Values</small>
            <ul className="space-y-1">
              <li>
                <b>Trust:</b> We inspect in person, and publish what was verified.
              </li>
              <li>
                <b>Care:</b> Relocation is someone&apos;s big life transition.
              </li>
              <li>
                <b>Inclusion:</b> Stays tailored for students, professionals, and families.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pad" style={{ padding: '60px 0' }}>
        <div className="wrap">
          <div className="facts" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div>
              <span>Focus Geography</span>
              <b>Tier 1, Tier 2 &amp; Tier 3</b>
              <small>Student &amp; job education hubs</small>
            </div>
            <div>
              <span>Who We Serve</span>
              <b>Students &amp; Professionals</b>
              <small>Aspirants, job-seekers, families</small>
            </div>
            <div>
              <span>Starting Point</span>
              <b>Noida, UP (Delhi NCR)</b>
              <small>Active verified launch city</small>
            </div>
          </div>
          <div style={{ marginTop: '32px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="go" href="/pg" style={{ padding: '13px 28px', borderRadius: '999px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
              Find a stay &rarr;
            </Link>
            <Link className="go light bd" href="/contact" style={{ padding: '13px 28px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', background: '#fff' }}>
              Contact our team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
