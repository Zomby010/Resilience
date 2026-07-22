"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Flame,
  Dog,
  Users,
  Radio,
} from "lucide-react";

import "./ClientComponent.css";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpeg";
import image3 from "../images/image3.jpeg";
import image4 from "../images/image4.jpeg";
import image5 from "../images/image5.jpeg";
import image6 from "../images/image6.jpeg";
import image7 from "../images/image7.jpeg";
import image8 from "../images/image8.jpeg";
import image9 from "../images/image9.jpeg";

/**
 * About.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — About section.
 * Split out of the original ClientComponent.jsx. Contains Company
 * Overview, Mission, Vision, and Services Offered.
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
// COMPANY OVERVIEW + MISSION / VISION
// ---------------------------------------------------------------------------
const Overview = () => (
  <section id="overview" className="sr-section sr-section--light">
    <div className="sr-section__inner">
      <div className="sr-overview__grid">
        <Reveal>
          <span className="sr-eyebrow">
            <span className="sr-eyebrow__dot" aria-hidden="true" />
            Company Overview
          </span>
          <h2 className="sr-heading">
            A Registered Partner in <span className="sr-heading__accent">Resilience</span>
          </h2>
          <span className="sr-heading__underline" aria-hidden="true" />
          <p className="sr-overview__copy" style={{ marginTop: "1.5rem" }}>
            <strong>Spears Resilience Systems</strong> is a registered
            provider of end-to-end security solutions, built on modern
            technology and disciplined human resource. From day and night
            guarding to VIP protection, alarm systems, electric fencing,
            CCTV surveillance and canine units, our personnel continually
            build the professional knowledge and skills required to protect
            what matters to you.
          </p>
          <p className="sr-overview__copy" style={{ marginTop: "1rem" }}>
            Our footprint spans hospitality, education, retail, faith-based
            institutions, and corporate clients across Western Kenya —
            currently 27 active sites across 14 towns, from Kisumu to
            Nyamira, Siaya to Butere.
          </p>
          <div className="sr-overview__badges">
            <span className="sr-overview__badge">
              <CheckCircle2 style={{ width: "0.85rem", height: "0.85rem" }} />
              27 Sites Secured
            </span>
            <span className="sr-overview__badge">
              <CheckCircle2 style={{ width: "0.85rem", height: "0.85rem" }} />
              14 Towns Covered
            </span>
          </div>
        </Reveal>

        <div className="sr-mv-stack">
          <Reveal delay={0.1}>
            <div className="sr-glass sr-mv-card">
              <div className="sr-glass__glow" aria-hidden="true" />
              <div className="sr-mv-card__icon">
                <Target aria-hidden="true" />
              </div>
              <h3 className="sr-mv-card__title">Our Mission</h3>
              <p className="sr-mv-card__text">
                To be a market leader in the provision of security
                solutions, giving our clients the most reliable and
                affordable services.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="sr-glass sr-mv-card">
              <div className="sr-glass__glow" aria-hidden="true" />
              <div className="sr-mv-card__icon">
                <Compass aria-hidden="true" />
              </div>
              <h3 className="sr-mv-card__title">Our Vision</h3>
              <p className="sr-mv-card__text">
                To be a one-stop shop for security in Kenya by using the
                most reliable technology that meets international
                standards.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// SERVICES OFFERED
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    icon: ShieldCheck,
    title: "Day & Night Guarding",
    text: "Vetted, uniformed officers providing continuous static and patrol coverage tailored to your site's risk profile.",
  },
  {
    icon: Bell,
    title: "Alarm Systems",
    text: "Installation and monitoring of intrusion alarm systems with rapid-response protocols for triggered events.",
  },
  {
    icon: Flame,
    title: "Fire Extinguishers",
    text: "Supply, servicing, and compliance checks for fire suppression equipment across commercial and residential sites.",
  },
  {
    icon: Dog,
    title: "Canine (Dog) Unit",
    text: "Trained security dogs and handlers deployed for perimeter patrol, detection, and deterrence.",
  },
  {
    icon: Users,
    title: "VIP Protection",
    text: "Close-protection officers trained in executive and personal security for individuals and events.",
  },
  {
    icon: Radio,
    title: "CCTV Surveillance",
    text: "Camera installation, remote monitoring, and footage management to keep every corner of your site visible.",
  },
];

const Services = () => (
  <section id="services" className="sr-section sr-section--light">
    <div className="sr-section__inner">
      <Reveal>
        <span className="sr-eyebrow">
          <span className="sr-eyebrow__dot" aria-hidden="true" />
          Services Offered
        </span>
        <h2 className="sr-heading">
          Full-Spectrum <span className="sr-heading__accent">Protection</span>
        </h2>
        <span className="sr-heading__underline" aria-hidden="true" />
        <p className="sr-subtitle">
          Every engagement starts with a site risk assessment, so the
          services below are deployed as a coordinated system rather than
          standalone add-ons.
        </p>
      </Reveal>

      <div className="sr-card-grid sr-card-grid--5">
        {SERVICES.map((service, index) => {
          const Icon = service.icon;
          return (
            <Reveal key={service.title} delay={index * 0.08}>
              <div className="sr-glass sr-service-card">
                <div className="sr-glass__glow" aria-hidden="true" />
                <div className="sr-service-card__icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3 className="sr-service-card__title">{service.title}</h3>
                <p className="sr-service-card__text">{service.text}</p>
                <span className="sr-service-card__index">
                  SVC-{String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// GALLERY (new section, placed directly below Services)
// -----------------------------------------------------------------------
// 9 image placeholders (gallery1.jpg – gallery9.jpg) in a responsive
// grid. Each image sits in a fixed-aspect-ratio "frame" with
// overflow:hidden so it can never bleed past its rounded corners or
// shift surrounding layout while loading — see .sr-gallery-item__frame
// in ClientComponent.css. Swap the `src` values below for real asset
// paths (e.g. imported images or a CMS URL) when photography is ready.
// ---------------------------------------------------------------------------
const GALLERY_IMAGES = [image1, image2, image3, image4, image5, image6, image7, image8, image9].map(
  (src, index) => ({
    src,
    alt: `Spears Resilience Systems on-site personnel and equipment — photo ${index + 1}`,
  })
);

const Gallery = () => (
  <section id="gallery" className="sr-section sr-section--light">
    <div className="sr-section__inner">
      <Reveal>
        <span className="sr-eyebrow">
          <span className="sr-eyebrow__dot" aria-hidden="true" />
          Gallery
        </span>
        <h2 className="sr-heading">
          Our Work, <span className="sr-heading__accent">On Site</span>
        </h2>
        <span className="sr-heading__underline" aria-hidden="true" />
        <p className="sr-subtitle">
          A look at our personnel, equipment, and installations across
          active client sites.
        </p>
      </Reveal>

      <div className="sr-gallery-grid">
        {GALLERY_IMAGES.map((image, index) => (
          <Reveal key={image.src} delay={index * 0.05}>
            <div className="sr-gallery-item__frame">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="sr-gallery-item__img"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------
const About = () => (
  <>
    <Overview />
    <Services />
    <Gallery />
  </>
);

export default About;