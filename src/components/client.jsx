"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import "./ClientComponent.css";

/**
 * Client.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Client section.
 * Split out of the original ClientComponent.jsx. Contains the Client
 * Registry (signature section, real data from clients.pdf).
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

const ClientRegistry = () => {
  let runningIndex = 0;

  return (
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
            Every active deployment, logged by region — the full manifest
            behind the "27 sites" figure quoted above.
          </p>
          <div className="sr-registry__meta">
            <span className="sr-registry__meta-chip">
              <strong>{TOTAL_CLIENTS}</strong>Active Sites
            </span>
            <span className="sr-registry__meta-chip">
              <strong>{CLIENT_REGISTRY.length}</strong>Regions Logged
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="sr-registry__log">
            <div className="sr-registry__log-header">
              <span>ID</span>
              <span>Client</span>
              <span>Location</span>
            </div>
            {CLIENT_REGISTRY.map((region) => (
              <div className="sr-registry__region" key={region.region}>
                <div className="sr-registry__region-label">
                  <MapPin style={{ width: "0.85rem", height: "0.85rem" }} />
                  {region.region}
                </div>
                {region.clients.map((client) => {
                  runningIndex += 1;
                  return (
                    <div
                      className="sr-registry__row"
                      key={`${client.name}-${client.location}`}
                    >
                      <span className="sr-registry__row-id">
                        CLIENT-{String(runningIndex).padStart(3, "0")}
                      </span>
                      <span className="sr-registry__row-name">
                        {client.name}
                      </span>
                      <span className="sr-registry__row-loc">
                        <MapPin aria-hidden="true" />
                        {client.location}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

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