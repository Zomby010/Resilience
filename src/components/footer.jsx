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

import "./ClientComponent.css";

/**
 * Footer.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Footer section.
 *
 * Contains:
 *   1. "Which Service Would You Like Secured?" — six service buttons that
 *      open a short inquiry modal (Full Name + Email), then let the
 *      visitor continue the conversation on WhatsApp or Email with the
 *      message pre-filled for that service.
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
const CONTACT_EMAIL = "spearsresiliencesystems@gmail.com";
const WHATSAPP_PHONE = "254718386678"; // digits only, no "+", for wa.me links

const GENERAL_WHATSAPP_MESSAGE =
  "Hello Spears Resilience Systems, I would like to inquire about your services.";
const GENERAL_EMAIL_SUBJECT = "Website Inquiry — Spears Resilience Systems";
const GENERAL_EMAIL_BODY =
  "Hello Spears Resilience Systems,\n\nI would like to inquire about your security services.\n\nName:\nMessage:\n";

// Builds a mailto: link with an encoded subject + body.
const buildMailtoLink = (email, subject, body) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;

// Builds a wa.me click-to-chat link with an encoded message.
const buildWhatsappLink = (phone, message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

// NOTE: the "Email Us" card no longer opens this mailto: link directly —
// it now scrolls to <ContactForm /> instead (see scrollToContactForm()).
// Left in place since GENERAL_EMAIL_SUBJECT/BODY may still be useful if
// you want to wire a mailto fallback back in later.
const GENERAL_EMAIL_LINK = buildMailtoLink(
  CONTACT_EMAIL,
  GENERAL_EMAIL_SUBJECT,
  GENERAL_EMAIL_BODY
);
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
// SERVICES — PLACEHOLDER content. Six services for a physical + digital
// security company; confirm the exact service names and descriptions
// before publishing, the same way the phone/email placeholders were
// confirmed in the original file.
// ---------------------------------------------------------------------------
const services = [
  {
    serviceName: "CCTV Installation & Monitoring",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your CCTV Installation & Monitoring service and would like more information.\n\nThank you.",
    emailSubject: "Inquiry — CCTV Installation & Monitoring",
    emailBody:
      "Hello Spears Resilience Systems,\n\nMy name is {{name}}.\n\nI would like to inquire about your CCTV Installation & Monitoring service.\n\nPlease could you share more details on pricing and availability.\n\nThank you.",
  },
  {
    serviceName: "Alarm & Intrusion Detection",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Alarm & Intrusion Detection service and would like more information.\n\nThank you.",
    emailSubject: "Inquiry — Alarm & Intrusion Detection",
    emailBody:
      "Hello Spears Resilience Systems,\n\nMy name is {{name}}.\n\nI would like to inquire about your Alarm & Intrusion Detection service.\n\nPlease could you share more details on pricing and availability.\n\nThank you.",
  },
  {
    serviceName: "Access Control Systems",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Access Control Systems service and would like more information.\n\nThank you.",
    emailSubject: "Inquiry — Access Control Systems",
    emailBody:
      "Hello Spears Resilience Systems,\n\nMy name is {{name}}.\n\nI would like to inquire about your Access Control Systems service.\n\nPlease could you share more details on pricing and availability.\n\nThank you.",
  },
  {
    serviceName: "Perimeter Security & Fencing",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Perimeter Security & Fencing service and would like more information.\n\nThank you.",
    emailSubject: "Inquiry — Perimeter Security & Fencing",
    emailBody:
      "Hello Spears Resilience Systems,\n\nMy name is {{name}}.\n\nI would like to inquire about your Perimeter Security & Fencing service.\n\nPlease could you share more details on pricing and availability.\n\nThank you.",
  },
  {
    serviceName: "Manned Guarding & Patrol",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Manned Guarding & Patrol service and would like more information.\n\nThank you.",
    emailSubject: "Inquiry — Manned Guarding & Patrol",
    emailBody:
      "Hello Spears Resilience Systems,\n\nMy name is {{name}}.\n\nI would like to inquire about your Manned Guarding & Patrol service.\n\nPlease could you share more details on pricing and availability.\n\nThank you.",
  },
  {
    serviceName: "Cybersecurity Consulting",
    whatsappMessage:
      "Hello Spears Resilience Systems,\n\nI am interested in your Cybersecurity Consulting service and would like more information.\n\nThank you.",
    emailSubject: "Inquiry — Cybersecurity Consulting",
    emailBody:
      "Hello Spears Resilience Systems,\n\nMy name is {{name}}.\n\nI would like to inquire about your Cybersecurity Consulting service.\n\nPlease could you share more details on pricing and availability.\n\nThank you.",
  },
];

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
// Collects Full Name + Email, then lets the visitor continue via Email
// or WhatsApp with the message for the selected service pre-filled.
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

  const buildEmail = () => {
    const body = service.emailBody.replace(
      "{{name}}",
      fullName.trim() || "there"
    );
    const bodyWithEmail = email.trim()
      ? `${body}\n\nMy email: ${email.trim()}`
      : body;
    return buildMailtoLink(CONTACT_EMAIL, service.emailSubject, bodyWithEmail);
  };

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
      window.location.href = buildEmail();
    } else {
      window.open(buildWhatsapp(), "_blank", "noopener,noreferrer");
    }
    onClose();
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