"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import {
  TOTAL_CLIENTS,
  TOTAL_REGIONS,
  COUNTIES_COVERED,
  COUNTIES_TOTAL,
} from "./clientData";
import "./ClientComponent.css";

// Counts 0 -> value once the number scrolls into view (instant when the
// visitor prefers reduced motion).
const CountUp = ({ value, duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }
    let frame;
    let start;
    const tick = (timestamp) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setDisplay(Math.round((1 - Math.pow(1 - progress, 3)) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration, reduceMotion]);

  return <span ref={ref}>{display}</span>;
};

const STATS = [
  { value: TOTAL_CLIENTS, label: "Active Sites" },
  { value: TOTAL_REGIONS, label: "Regions" },
  {
    value: COUNTIES_COVERED,
    suffix: ` / ${COUNTIES_TOTAL}`,
    label: "Counties",
  },
];

const Stats = () => (
  <section id="stats" className="sr-stats" aria-label="Our reach in numbers">
    <div className="sr-stats__inner">
      {STATS.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="sr-stats__item"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
        >
          <div className="sr-stats__value">
            <CountUp value={stat.value} />
            {stat.suffix && (
              <span className="sr-stats__suffix">{stat.suffix}</span>
            )}
          </div>
          <div className="sr-stats__label">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Stats;
