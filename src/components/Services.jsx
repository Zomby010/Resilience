import React from "react";
import {
  ArrowRight,
  Bell,
  Cctv,
  Dog,
  Flame,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";

import { SERVICES } from "../siteConfig";

const ICONS = {
  guarding: ShieldCheck,
  alarms: Bell,
  cctv: Cctv,
  canine: Dog,
  vip: UserCheck,
  fencing: Zap,
  fire: Flame,
};

// Compact service cards. "Get a quote" jumps to the contact form with the
// service already chosen.
const Services = ({ onChooseService }) => (
  <section id="services" className="section" aria-labelledby="services-title">
    <div className="section__inner">
      <p className="section__eyebrow">What we do</p>
      <h2 id="services-title" className="section__title">
        One company for your whole site's security
      </h2>
      <p className="section__lead">
        Every job starts with a free site risk assessment, so guards,
        alarms, cameras and dogs work together as one plan.
      </p>

      <ul className="services">
        {SERVICES.map((service) => {
          const Icon = ICONS[service.id] || ShieldCheck;
          return (
            <li key={service.id} className="service">
              <span className="service__icon">
                <Icon aria-hidden="true" />
              </span>
              <h3 className="service__title">{service.title}</h3>
              <p className="service__text">{service.text}</p>
              <a
                href="#contact"
                className="service__cta"
                onClick={() => onChooseService(service.title)}
              >
                Get a quote
                <span className="visually-hidden"> for {service.title}</span>
                <ArrowRight aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default Services;
