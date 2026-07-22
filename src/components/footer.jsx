"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  ArrowRight,
  MessageCircle,
  X,
  ShieldCheck,
} from "lucide-react";

import { publishServiceInquiry } from "./contactFormBridge";
import "./ClientComponent.css";

/**
 * Footer.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Footer section.
 *
 * Contains:
 *   1. "Which Service Would You Like Secured?" — six service buttons that
 *      open a short inquiry modal (Full Name + Email), then let the
 *      visitor choose WhatsApp or Email:
 *        - WhatsApp: unchanged — opens wa.me with the service message
 *          and their name pre-filled.
 *        - Email: now hands the message (plus their name/email) to the
 *          standalone <ContactForm /> via contactFormBridge.js and
 *          scrolls them to it, so the send goes out through the SAME
 *          EmailJS service/template/public key already configured
 *          there, instead of a mailto: link.
 *   2. "Talk To Our Team" — a single WhatsApp button and a single Email
 *      button (general contact, independent of the service picker), plus
 *      an "Our Office" button that opens a location popup instead of
 *      showing a static address block.
 *   3. "Ready To Secure Your Site?" — the closing CTA. It now scrolls to
 *      the contact section rather than duplicating the WhatsApp/Email/
 *      call buttons that already live there.
 *
 * There is intentionally only ONE WhatsApp button, ONE Email button, and
 * ONE location entry point in the whole component (no duplicates).
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Contact constants — single source of truth for WhatsApp/email everywhere
// they appear, so a future number/address change only has to happen here.
// ---------------------------------------------------------------------------
const WHATSAPP_PHONE = "254718386678"; // digits only, no "+", for wa.me links

const GENERAL_WHATSAPP_MESSAGE =
  "Hello Spears Resilience Systems, I would like to inquire about your services.";

// Builds a wa.me click-to-chat link with an encoded message.
const buildWhatsappLink = (phone, message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

// NOTE: the "Email Us" card no longer opens a mailto: link directly — it
// now scrolls to <ContactForm /> instead (see scrollToContactForm()), so
// there's no general-purpose mailto link/subject/body to build here.
const GENERAL_WHATSAPP_LINK = buildWhatsappLink(
  WHATSAPP_PHONE,
  GENERAL_WHATSAPP_MESSAGE
);

// ---------------------------------------------------------------------------
// OFFICE ADDRESS — shown only inside the location popup.
// ---------------------------------------------------------------------------
const OFFICE_ADDRESS_LINES = [
  "P.O. Box.6053.(40.03).Kondele, Kisumu",
  "",
  "OUR OFFICE,",
  "TECHNOLOGY ROAD NEXT TO KISUMU POLYTECHNIC,",
  "KISUMU, KENYA",
];

// ---------------------------------------------------------------------------
// SERVICES — kept in sync with the six services listed in About.jsx's
// `SERVICES` array (Overview/Services section). If a service is renamed,
// added, or removed there, mirror the change here so the footer's service
// picker and the About page never drift apart.
//
// whatsappMessage is used by the modal's "Continue on WhatsApp" path.
// The Email path no longer needs its own emailSubject/emailBody — it
// hands off to <ContactForm />, whose message is derived below by
// buildServiceInquiryMessage() so there's one place to edit that wording.
// ---------------------------------------------------------------------------
const services = [
  {
    serviceName: "Day & Night Guarding",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Day & Night Guarding service and would like more information.\n\nThank you.",
  },
  {
    serviceName: "Alarm Systems",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Alarm Systems service and would like more information.\n\nThank you.",
  },
  {
    serviceName: "Fire Extinguishers",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Fire Extinguishers service and would like more information.\n\nThank you.",
  },
  {
    serviceName: "Canine (Dog) Unit",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Canine (Dog) Unit service and would like more information.\n\nThank you.",
  },
  {
    serviceName: "VIP Protection",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your VIP Protection service and would like more information.\n\nThank you.",
  },
  {
    serviceName: "CCTV Surveillance",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your CCTV Surveillance service and would like more information.\n\nThank you.",
  },
];

// Builds the pre-filled message handed to <ContactForm /> for a given
// service, e.g. "I would like more information about CCTV Installation
// & Monitoring."
const buildServiceInquiryMessage = (service) =>
  `I would like more information about ${service.serviceName}.`;

// Optional analytics hook — no-ops by default. Wire this up to your
// analytics provider (GA4, Plausible, PostHog, etc.) if/when one exists.
const trackContactClick = (channel) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "contact_click", { channel });
  }
};

// Smoothly scrolls the page down to the standalone <ContactForm /> (its
// wrapper carries id="contact-form") and, once the scroll has settled,
// moves keyboard focus into the first field so the visitor can start
// typing right away.
const scrollToContactForm = () => {
  if (typeof document === "undefined") return;

  const formEl = document.getElementById("contact-form");
  if (!formEl) return;

  formEl.scrollIntoView({ behavior: "smooth", block: "start" });

  // Wait for the smooth-scroll to roughly finish before stealing focus,
  // so the browser doesn't jump the viewport a second time on focus.
  window.setTimeout(() => {
    document.getElementById("user_name")?.focus({ preventScroll: true });
  }, 500);
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
// Shared: focus-trapping, escape-closing modal shell
// ---------------------------------------------------------------------------
const ModalShell = ({ isOpen, onClose, titleId, children, className = "" }) => {
  const panelRef = useRef(null);

  // Close on Escape, and return focus to the panel when it opens.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    // Prevent background scroll while a modal is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="sr-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`sr-modal__panel ${className}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------------------------------------------------------------------------
// SERVICE INQUIRY MODAL
// Collects Full Name + Email, then lets the visitor choose how to
// continue:
//   - WhatsApp: opens wa.me with the service message (name inserted).
//   - Email: hands the message + name/email to <ContactForm /> via
//     contactFormBridge.js and scrolls the visitor to it, so the send
//     goes out through the existing EmailJS flow instead of a mailto:
//     link.
// ---------------------------------------------------------------------------
const ServiceInquiryModal = ({ service, isOpen, onClose }) => {
  const titleId = useId();
  const nameFieldId = useId();
  const emailFieldId = useId();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  // Reset the mini-form each time a new service is opened.
  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setEmail("");
      setTouched(false);
    }
  }, [isOpen, service]);

  if (!service) return null;

  const isValid = fullName.trim().length > 1;

  const buildWhatsapp = () => {
    const message = fullName.trim()
      ? service.whatsappMessage.replace(
          "I am interested",
          `My name is ${fullName.trim()}. I am interested`
        )
      : service.whatsappMessage;
    return buildWhatsappLink(WHATSAPP_PHONE, message);
  };

  const handleContinue = (channel) => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    trackContactClick(`service_${channel}_${service.serviceName}`);

    if (channel === "email") {
      publishServiceInquiry({
        message: buildServiceInquiryMessage(service),
        name: fullName.trim(),
        email: email.trim(),
      });
      onClose();
      scrollToContactForm();
    } else {
      window.open(buildWhatsapp(), "_blank", "noopener,noreferrer");
      onClose();
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      className="sr-modal__panel--service"
    >
      <button
        type="button"
        className="sr-modal__close"
        onClick={onClose}
        aria-label="Close"
      >
        <X aria-hidden="true" />
      </button>

      <div className="sr-modal__icon">
        <ShieldCheck aria-hidden="true" />
      </div>

      <h3 id={titleId} className="sr-modal__title">
        {service.serviceName}
      </h3>
      <p className="sr-modal__subtitle">
        Share a couple of details and we'll take it from there.
      </p>

      <div className="sr-modal__form">
        <div className="sr-modal__field">
          <label htmlFor={nameFieldId}>Full Name</label>
          <input
            id={nameFieldId}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
          />
          {touched && !isValid && (
            <span className="sr-modal__error">Please enter your name.</span>
          )}
        </div>
        <div className="sr-modal__field">
          <label htmlFor={emailFieldId}>Email Address</label>
          <input
            id={emailFieldId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com (optional)"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="sr-modal__actions">
        <button
          type="button"
          className="sr-btn sr-btn--ghost"
          onClick={() => handleContinue("email")}
        >
          <Mail className="sr-btn__icon" aria-hidden="true" />
          Continue by Email
        </button>
        <button
          type="button"
          className="sr-btn sr-btn--whatsapp"
          onClick={() => handleContinue("whatsapp")}
        >
          <MessageCircle className="sr-btn__icon" aria-hidden="true" />
          Continue on WhatsApp
        </button>
      </div>
    </ModalShell>
  );
};

// ---------------------------------------------------------------------------
// LOCATION MODAL
// ---------------------------------------------------------------------------
const LocationModal = ({ isOpen, onClose }) => {
  const titleId = useId();

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      className="sr-modal__panel--location"
    >
      <button
        type="button"
        className="sr-modal__close"
        onClick={onClose}
        aria-label="Close"
      >
        <X aria-hidden="true" />
      </button>

      <div className="sr-modal__icon">
        <MapPin aria-hidden="true" />
      </div>

      <h3 id={titleId} className="sr-modal__title">
        Our Office
      </h3>

      <address className="sr-modal__address">
        {OFFICE_ADDRESS_LINES.map((line, i) =>
          line === "" ? <br key={i} /> : <div key={i}>{line}</div>
        )}
      </address>
    </ModalShell>
  );
};

// ---------------------------------------------------------------------------
// SERVICE SELECTION SECTION
// ---------------------------------------------------------------------------
const ServiceSelection = ({ onSelectService }) => (
  <Reveal delay={0.02} className="sr-services">
    <h3 className="sr-services__heading">
      Which Service Would You Like Secured?
    </h3>
    <div className="sr-services__grid">
      {services.map((service) => (
        <button
          key={service.serviceName}
          type="button"
          className="sr-service-btn"
          onClick={() => onSelectService(service)}
        >
          {service.serviceName}
        </button>
      ))}
    </div>
  </Reveal>
);

// ---------------------------------------------------------------------------
// CONTACT INFORMATION ("Talk to Our Team")
// ---------------------------------------------------------------------------
const Contact = ({ onSelectService, onOpenLocation }) => (
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

      <ServiceSelection onSelectService={onSelectService} />

      <div className="sr-contact__grid">
        <Reveal delay={0.05}>
          {/*
            Single WhatsApp entry point for general contact. Opens
            directly in a new tab — no name/email prompt, since this is
            the "always available" channel independent of the service
            picker above.
          */}
          <a
            href={GENERAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("whatsapp_card")}
            className="sr-glass sr-contact-card"
          >
            <div className="sr-contact-card__icon">
              <MessageCircle aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">WhatsApp</div>
              <div className="sr-contact-card__value">Text us on WhatsApp</div>
            </div>
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          {/*
            Single Email entry point for general contact. Rather than
            opening a mailto: link, this now scrolls the visitor straight
            down to the <ContactForm /> and focuses its first field, so
            they can describe their needs right on the page.
          */}
          <button
            type="button"
            onClick={() => {
              trackContactClick("email_card");
              scrollToContactForm();
            }}
            className="sr-glass sr-contact-card sr-contact-card--button"
          >
            <div className="sr-contact-card__icon">
              <Mail aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Email</div>
              <div className="sr-contact-card__value">Email Us</div>
            </div>
          </button>
        </Reveal>
        <Reveal delay={0.15}>
          {/*
            Location is now a popup trigger instead of a static address
            block — the full address only appears inside the modal.
          */}
          <button
            type="button"
            onClick={() => {
              trackContactClick("location_card");
              onOpenLocation();
            }}
            className="sr-glass sr-contact-card sr-contact-card--button"
          >
            <div className="sr-contact-card__icon">
              <MapPin aria-hidden="true" />
            </div>
            <div>
              <div className="sr-contact-card__label">Headquarters</div>
              <div className="sr-contact-card__value">View Our Office</div>
            </div>
          </button>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// FINAL CALL-TO-ACTION ("Ready To Secure Your Site?")
// Points back to the single contact section instead of repeating the
// WhatsApp/Email/call buttons.
// ---------------------------------------------------------------------------
const FinalCta = () => (
  <section className="sr-section sr-cta">
    <div aria-hidden="true" className="sr-cta__glow sr-float" />
    <div className="sr-section__inner">
      <Reveal>
        <h2 className="sr-cta__heading">Ready To Secure Your Site?</h2>
        <p className="sr-cta__text">
          Pick a service above or reach out below — we'll take it from
          there.
        </p>
        <div className="sr-cta__actions">
          <a href="#contact" className="sr-btn sr-btn--primary">
            Talk To Our Team
            <ArrowRight className="sr-btn__icon" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
const Footer = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  return (
    <>
      <Contact
        onSelectService={handleSelectService}
        onOpenLocation={() => setIsLocationModalOpen(true)}
      />
      <FinalCta />

      <ServiceInquiryModal
        service={selectedService}
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};

export default Footer;