"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, Send } from "lucide-react";

import "./ClientComponent.css";

/**
 * Footer.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Footer section.
 * Split out of the original ClientComponent.jsx. Contains "Talk to Our
 * Team" (contact information) and "Ready To Secure Your Site?" (final
 * call-to-action).
 *
 * PLACEHOLDER CONTENT: phone, email, and address are illustrative —
 * confirm real contact details before publishing.
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
// CONTACT INFORMATION ("Talk to Our Team")
// ---------------------------------------------------------------------------
const Contact = () => (
  <section id="contact" className="sr-section sr-section--light">
    <div className="sr-section__inner">
      <Reveal>
        <span className="sr-eyebrow">
          <span className="sr-eyebrow__dot" aria-hidden="true" />
          Contact Information
        </span>
        <h2 className="sr-heading">
          Talk To <span className="sr-heading__accent">Our Team</span>
        </h2>
        <span className="sr-heading__underline" aria-hidden="true" />
      </Reveal>

      <div className="sr-contact__grid">
        <Reveal delay={0.05}>
          <div className="sr-glass sr-contact-card">
            <div className="sr-contact-card__icon">
              <Phone aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Phone</div>
              {/* PLACEHOLDER: confirm real phone number */}
              <div className="sr-contact-card__value">+254 700 000 000</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="sr-glass sr-contact-card">
            <div className="sr-contact-card__icon">
              <Mail aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Email</div>
              {/* PLACEHOLDER: confirm real email address */}
              <div className="sr-contact-card__value">info@spearsresilience.co.ke</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="sr-glass sr-contact-card">
            <div className="sr-contact-card__icon">
              <MapPin aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Headquarters</div>
              {/* PLACEHOLDER: confirm real head office address */}
              <div className="sr-contact-card__value">Kisumu, Kenya</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// FINAL CALL-TO-ACTION ("Ready To Secure Your Site?")
// ---------------------------------------------------------------------------
const FinalCta = () => (
  <section className="sr-section sr-cta">
    <div aria-hidden="true" className="sr-cta__glow sr-float" />
    <div className="sr-section__inner">
      <Reveal>
        <h2 className="sr-cta__heading">Ready To Secure Your Site?</h2>
        <p className="sr-cta__text">
          Tell us about your property and we'll put together a coverage plan
          — guards, technology, and response protocols — built around your
          actual risk.
        </p>
        <div className="sr-cta__actions">
          <a href="#contact" className="sr-btn sr-btn--primary">
            Request a Consultation
            <ArrowRight className="sr-btn__icon" aria-hidden="true" />
          </a>
          <a href="tel:+254700000000" className="sr-btn sr-btn--ghost">
            <Send className="sr-btn__icon" aria-hidden="true" />
            Call Us Now
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
const Footer = () => (
  <>
    <Contact />
    <FinalCta />
  </>
);

export default Footer;