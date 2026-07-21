"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";

import "./ClientComponent.css";

/**
 * Client.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Client section.
 * Split out of the original ClientComponent.jsx. Contains the Client
 * Registry (signature section, real data from clients.pdf).
 *
 * REDESIGNED: the old numbered, single-column log table (CLIENT-001,
 * CLIENT-002... stacked one per row) has been replaced with a
 * two-tier glassmorphic dashboard grid — an outer responsive grid of
 * region cards, each containing an inner grid of unnumbered client
 * cards with their own hover animations. See .sr-registry-grid /
 * .sr-region-card* / .sr-client-chip* in ClientComponent.css.
 *
 * The decorative divider that originally sat directly after this section
 * (before the now-removed Statistics section) is kept here as a trailing
 * separator, since it isn't part of any other named section.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Shared: scroll-reveal wrapper
// ---------------------------------------------------------------------------
const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// ---------------------------------------------------------------------------
// Shared: count-up number, animates 0 -> value once it scrolls into view
// ---------------------------------------------------------------------------
const CountUp = ({ value, duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame;
    let start;

    const tick = (timestamp) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      // ease-out cubic — quick start, gentle settle
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} aria-hidden="true">
      {display}
    </span>
  );
};

// ---------------------------------------------------------------------------
// CLIENT REGISTRY — signature section, real data from clients.pdf
// ---------------------------------------------------------------------------
const CLIENT_REGISTRY = [
  {
    region: "Kisumu & Surrounds",
    clients: [
      { name: "Silent Gulf Hotel", location: "Kisumu" },
      { name: "Lesavana Hotel", location: "Kisumu" },
      { name: "KESS Suppliers", location: "Kisumu" },
      { name: "Polly View Hostel", location: "Kisumu" },
      { name: "Kazuri Gardens Restaurant", location: "Kisumu" },
      { name: "China Wu Yi Decoration", location: "Kisumu" },
      { name: "Tripple Flats", location: "Kisumu" },
      { name: "La Breeze Hotel", location: "Kisumu" },
      { name: "SawaSawa Bar & Restaurant", location: "Kisumu" },
    ],
  },
  {
    region: "Sondu / Ahero / Chabera",
    clients: [
      { name: "Maraboi Estate", location: "Sondu" },
      { name: "Asila Miller's", location: "Ahero" },
      { name: "Pearl Water Ltd", location: "Ahero" },
      { name: "Pambo Bar and Restaurant", location: "Chabera" },
      { name: "Sumbird Supermarket", location: "Chabera" },
    ],
  },
  {
    region: "Mumias / Lwanda",
    clients: [
      { name: "Wang Technical Vocational College", location: "Mumias" },
      { name: "Ebukanga Technical Vocational College", location: "Lwanda" },
    ],
  },
  {
    region: "Nyamira / Ogembo",
    clients: [
      { name: "Stecol Corporation", location: "Nyamira" },
      { name: "Stecol Corporation", location: "Ogembo" },
    ],
  },
  {
    region: "Siaya / Usenge / Ugunja / Bondo",
    clients: [
      { name: "Alicia Bakery & Confectionous", location: "Usenge" },
      { name: "Wasafi Hotel", location: "Siaya" },
      { name: "Azuri Hotel", location: "Ugunja" },
      { name: "Pride Hotel", location: "Bondo" },
    ],
  },
  {
    region: "Butere",
    clients: [
      { name: "A.C.K Church", location: "Butere" },
      { name: "Butere Girls", location: "Butere" },
      { name: "Mabole Boys", location: "Butere" },
      { name: "St. Luke Cathedral", location: "Butere" },
    ],
  },
  {
    region: "Oyugis",
    clients: [{ name: "Ober Boys", location: "Oyugis" }],
  },
];

const TOTAL_CLIENTS = CLIENT_REGISTRY.reduce(
  (sum, region) => sum + region.clients.length,
  0
);

const ClientRegistry = () => (
  <section id="registry" className="sr-section sr-section--dark sr-registry">
    <div className="sr-section__inner">
      <Reveal>
        <span className="sr-eyebrow">
          <span className="sr-eyebrow__dot" aria-hidden="true" />
          Client Registry
        </span>
        <h2 className="sr-heading sr-heading--light">
          Sites Under <span className="sr-heading__accent">Our Watch</span>
        </h2>
        <span className="sr-heading__underline" aria-hidden="true" />
        <p className="sr-subtitle sr-subtitle--light">
          Every active deployment, grouped by region — the full manifest
          behind the "27 sites" figure quoted above.
        </p>
        <div className="sr-registry__meta">
          <span
            className="sr-registry__meta-chip sr-registry__meta-chip--stat"
            role="text"
            aria-label={`${TOTAL_CLIENTS} Active Sites`}
          >
            <span className="sr-registry__meta-chip__pulse" aria-hidden="true" />
            <strong className="sr-registry__meta-chip__value">
              <CountUp value={TOTAL_CLIENTS} />
            </strong>
            <span className="sr-registry__meta-chip__label">Active Sites</span>
          </span>
          <span
            className="sr-registry__meta-chip sr-registry__meta-chip--stat"
            role="text"
            aria-label={`${CLIENT_REGISTRY.length} Regions Logged`}
          >
            <span className="sr-registry__meta-chip__pulse" aria-hidden="true" />
            <strong className="sr-registry__meta-chip__value">
              <CountUp value={CLIENT_REGISTRY.length} />
            </strong>
            <span className="sr-registry__meta-chip__label">Regions Logged</span>
          </span>
        </div>
      </Reveal>

      {/* Outer/parent grid: one glassmorphic card per region */}
      <div className="sr-registry-grid">
        {CLIENT_REGISTRY.map((region, index) => (
          <Reveal key={region.region} delay={index * 0.06}>
            <div className="sr-glass sr-region-card">
              <div className="sr-glass__glow" aria-hidden="true" />
              <div className="sr-region-card__header">
                <div className="sr-region-card__icon">
                  <Building2 aria-hidden="true" />
                </div>
                <h3 className="sr-region-card__title">{region.region}</h3>
                <span className="sr-region-card__count">
                  {region.clients.length}
                </span>
              </div>

              {/* Inner/child grid: unnumbered client cards */}
              <div className="sr-region-card__clients">
                {region.clients.map((client) => (
                  <div
                    className="sr-client-chip"
                    key={`${client.name}-${client.location}`}
                  >
                    <span className="sr-client-chip__name">
                      {client.name}
                    </span>
                    <span className="sr-client-chip__loc">
                      <MapPin aria-hidden="true" />
                      {client.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// CLIENT
// ---------------------------------------------------------------------------
const Client = () => (
  <>
    <ClientRegistry />
    <div className="sr-divider" aria-hidden="true" />
  </>
);

export default Client;