"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Bell, Flame, Dog, Users, ArrowRight } from "lucide-react";

import "./ClientComponent.css";

/**
 * Home.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Home section.
 * Split out of the original ClientComponent.jsx. Contains the in-page
 * section nav and the hero (introduction, "Request a Consultation" and
 * "View Client Registry" buttons).
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Shared: scroll-reveal wrapper
// ---------------------------------------------------------------------------
const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// ---------------------------------------------------------------------------
// In-page navigation
// NOTE: links to sections removed elsewhere in this refactor (Solutions,
// Industries, Stats, Why Us, Compliance, Testimonials, Leadership,
// Milestones) have been dropped so the nav doesn't point at dead anchors.
// ---------------------------------------------------------------------------
const SECTION_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#services", label: "Services" },
  { href: "#registry", label: "Clients" },
  { href: "#contact", label: "Contact" },
];

const SectionNav = () => (
  <nav className="sr-nav" aria-label="Section navigation">
    <div className="sr-nav__scroll">
      {SECTION_LINKS.map((link) => (
        <a key={link.href} href={link.href} className="sr-nav__link">
          {link.label}
        </a>
      ))}
    </div>
  </nav>
);

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
const SERVICES_TICKER = [
  { label: "Guards", icon: ShieldCheck },
  { label: "Alarm Systems", icon: Bell },
  { label: "Fire Extinguishers", icon: Flame },
  { label: "Dog Unit", icon: Dog },
  { label: "VIP Protection", icon: Users },
];

const Hero = () => (
  <header className="sr-hero">
    <div aria-hidden="true" className="sr-hero__bg-radial" />
    <div aria-hidden="true" className="sr-hero__scanline" />
    <div className="sr-hero__inner">
      <Reveal>
        <span className="sr-hero__badge">
          <ShieldCheck className="sr-btn__icon" aria-hidden="true" />
          Registered Security Solutions Provider
        </span>
        <h1 className="sr-hero__title">
          Spears Resilience Systems
          <span className="sr-hero__title-accent">Protecting What Matters</span>
        </h1>
        <p className="sr-hero__lead">
          End-to-end security solutions built on modern technology and a
          disciplined, professionally trained workforce — trusted across 27
          client sites in 14 towns.
        </p>
        <div className="sr-hero__actions">
          <a href="#contact" className="sr-btn sr-btn--primary">
            Request a Consultation
            <ArrowRight className="sr-btn__icon" aria-hidden="true" />
          </a>
          <a href="#registry" className="sr-btn sr-btn--ghost">
            View Client Registry
          </a>
        </div>
      </Reveal>

      <div className="sr-hero__ticker-wrap" aria-hidden="true">
        <div className="sr-hero__ticker">
          {[...SERVICES_TICKER, ...SERVICES_TICKER].map((item, i) => {
            const Icon = item.icon;
            return (
              <span className="sr-hero__ticker-item" key={`${item.label}-${i}`}>
                <Icon className="sr-hero__ticker-icon" />
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  </header>
);

// ---------------------------------------------------------------------------
// HOME
// ---------------------------------------------------------------------------
const Home = () => (
  <>
    <SectionNav />
    <Hero />
  </>
);

export default Home;