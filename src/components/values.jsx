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
    title: "CSR Item 1",
    text: "Placeholder paragraph — replace with real content describing this initiative.",
  },
  {
    title: "CSR Item 2",
    text: "Placeholder paragraph — replace with real content describing this initiative.",
  },
  {
    title: "CSR Item 3",
    text: "Placeholder paragraph — replace with real content describing this initiative.",
  },
  {
    title: "CSR Item 4",
    text: "Placeholder paragraph — replace with real content describing this initiative.",
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
            <div className="sr-glass sr-service-card">
              <div className="sr-glass__glow" aria-hidden="true" />
              <h3 className="sr-service-card__title">{item.title}</h3>
              <p className="sr-service-card__text">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Values;