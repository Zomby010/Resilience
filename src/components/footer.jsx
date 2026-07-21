"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, Send, MessageCircle } from "lucide-react";

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
// Contact constants — single source of truth for phone/email everywhere
// they appear (contact cards + CTA buttons), so a future number/address
// change only has to happen in one place.
//
// PLACEHOLDER: confirm the real phone number and email before publishing.
// Phone MUST be in full international E.164 format (e.g. "+254768191188")
// for `tel:` links to dial correctly from any device/country.
// ---------------------------------------------------------------------------
const CONTACT_PHONE_DISPLAY = "+254 768 191 188"; // PLACEHOLDER: confirm real phone number
const CONTACT_PHONE_TEL = "+254768191188"; // international format, no spaces, for tel: links
const CONTACT_EMAIL = "frankokoth2003@gmail.com"; // PLACEHOLDER: confirm real email address
const CONTACT_EMAIL_SUBJECT = "Website Inquiry — Spears Resilience Systems";
const CONTACT_EMAIL_BODY = "I would like to inquire about your security services.\n\nName:\nLocation:\nMessage:\n";

// Builds a mailto: link with an encoded subject + body. Encoding is required
// because raw newlines/spaces/symbols aren't valid in a URL.
const buildMailtoLink = (email, subject, body) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;

const EMAIL_LINK = buildMailtoLink(CONTACT_EMAIL, CONTACT_EMAIL_SUBJECT, CONTACT_EMAIL_BODY);
const TEL_LINK = `tel:${CONTACT_PHONE_TEL}`;

// ---------------------------------------------------------------------------
// WhatsApp Click-to-Chat link
// PLACEHOLDER: confirm the real business WhatsApp number before publishing.
// Format: country code + number, digits only (no "+", no leading 0).
// ---------------------------------------------------------------------------
const WHATSAPP_PHONE = "254768191188"; // PLACEHOLDER: confirm real WhatsApp number
const WHATSAPP_MESSAGE = "Hello, I would like to inquire about your services.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

// Optional analytics hook — no-ops by default. Wire this up to your
// analytics provider (GA4, Plausible, PostHog, etc.) if/when one exists.
// Kept as a no-dependency stub so this file never requires a backend
// or third-party SDK to run.
const trackContactClick = (channel) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "contact_click", { channel });
  }
};

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
          {/*
            Whole card is wrapped in an <a href="tel:..."> so tapping
            anywhere on it dials the number on mobile. `className` on the
            <a> mirrors the original <div>'s classes exactly, so styling
            is unchanged; on desktop, browsers without a calling app just
            show/copy the number or ignore the click — a safe fallback.
          */}
          <a
            href={TEL_LINK}
            onClick={() => trackContactClick("phone_card")}
            className="sr-glass sr-contact-card"
          >
            <div className="sr-contact-card__icon">
              <Phone aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Phone</div>
              {/* PLACEHOLDER: confirm real phone number */}
              <div className="sr-contact-card__value">{CONTACT_PHONE_DISPLAY}</div>
            </div>
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          {/*
            mailto: opens the user's default mail client with recipient,
            subject, and body pre-filled. On desktop this opens whatever
            desktop mail app (or webmail handler) is registered; on mobile
            it opens the Mail/Gmail app. If no mail client is configured,
            the browser will show its own "no app found" prompt — this is
            native browser behavior and doesn't need extra handling here.
          */}
          <a
            href={EMAIL_LINK}
            onClick={() => trackContactClick("email_card")}
            className="sr-glass sr-contact-card"
          >
            <div className="sr-contact-card__icon">
              <Mail aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Email</div>
              {/* PLACEHOLDER: confirm real email address */}
              <div className="sr-contact-card__value">{CONTACT_EMAIL}</div>
            </div>
          </a>
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
          Hello, I would like to inquire about your services.
        </p>
        <div className="sr-cta__actions">
          <a href="#contact" className="sr-btn sr-btn--primary">
            Request a Consultation
            <ArrowRight className="sr-btn__icon" aria-hidden="true" />
          </a>
          {/*
            tel: link — on mobile this opens the native dialer with the
            number pre-filled; the user just taps to confirm. On desktop
            it's handled by whatever the OS/browser has registered for
            tel: links (e.g. Skype, Teams, FaceTime) — if nothing is
            registered, the browser shows its own "no app found" message
            rather than the click doing nothing, so this degrades safely.
          */}
          <a
            href={TEL_LINK}
            onClick={() => trackContactClick("call_cta")}
            className="sr-btn sr-btn--ghost"
          >
            <Send className="sr-btn__icon" aria-hidden="true" />
            Call Us Now
          </a>
          {/*
            mailto: link with a pre-filled subject + body (see
            buildMailtoLink above). Opens the user's default mail client
            on both desktop and mobile.
          */}
          <a
            href={EMAIL_LINK}
            onClick={() => trackContactClick("email_cta")}
            className="sr-btn sr-btn--ghost"
          >
            <Mail className="sr-btn__icon" aria-hidden="true" />
            Email Us
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("whatsapp_cta")}
            className="sr-btn sr-btn--whatsapp"
          >
            <MessageCircle className="sr-btn__icon" aria-hidden="true" />
            Chat on WhatsApp
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