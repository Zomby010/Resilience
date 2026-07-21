"use client";

import React from "react";
import { motion } from "framer-motion";

import "./ClientComponent.css";

/**
 * Values.jsx
 * -----------------------------------------------------------------------
 * Spears Resilience Systems — Values section.
 * Split out of the original ClientComponent.jsx. The former "Security
 * Solutions" and "Industries Served" sections have been removed and
 * replaced with a new "Corporate Social Responsibility" section.
 *
 * TYPOGRAPHY: card titles and body copy use dedicated .sr-csr-card__*
 * classes (see ClientComponent.css) rather than the shared
 * .sr-service-card__title/__text used by About.jsx's Services cards,
 * so the bolder/more-legible styling here doesn't bleed into that
 * unrelated section.
 *
 * PLACEHOLDER CONTENT: the four CSR items below are placeholders — swap
 * in the company's real CSR programme details before shipping.
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
// CORPORATE SOCIAL RESPONSIBILITY
// PLACEHOLDER: replace each item's title and paragraph with real CSR copy.
// ---------------------------------------------------------------------------
const CSR_ITEMS = [
  {
    title: "Community Engagement & Diversity",
    text: "Spears Resilience Systems Limited recognises contributions made by every individual with whom we involve ourselves, during our CSR engagements and care to the wider community. We embrace diversity in all forms and see it as fundamental in all our dealings with clients, partners, associates and the wider community.",
  },
  {
    title: "Employee Welfare & Wellbeing",
    text: "Spears Resilience Systems believes in caring for our staff, providing them with meaningful employment, equal opportunities and their families' welfare ensuring, as far as we can, their continuing health, safety and mental wellness in the workplace.",
  },
  {
    title: "Client Property & IP Protection",
    text: "We recognise and respect our clients' properties, ensuring a safe and secure environment in regards to their property, including intellectual property as being as important as our own.",
  },
  {
    title: "Business Ethics & Integrity",
    text: "We will deal with our business partners and employees in an honest and honourable manner at all times. Quality and Compliance.",
  },
];

const Values = () => (
  <section id="csr" className="sr-section sr-section--light">
    <div className="sr-section__inner">
      <Reveal>
        <span className="sr-eyebrow">
          <span className="sr-eyebrow__dot" aria-hidden="true" />
          Corporate Social Responsibility
        </span>
        <h2 className="sr-heading">
          Corporate Social <span className="sr-heading__accent">Responsibility</span>
        </h2>
        <span className="sr-heading__underline" aria-hidden="true" />
      </Reveal>

      <div className="sr-card-grid sr-card-grid--4">
        {CSR_ITEMS.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08}>
            <div className="sr-glass sr-service-card sr-csr-card">
              <div className="sr-glass__glow" aria-hidden="true" />
              <h3 className="sr-csr-card__title">{item.title}</h3>
              <p className="sr-csr-card__text">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Values;