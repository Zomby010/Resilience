import React from "react";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";

import { COMPANY, GENERAL_WHATSAPP_MESSAGE, STATS, TRUST, whatsappLink } from "../siteConfig";
import { REVIEWS } from "../reviewsData";
import { track } from "../lib/analytics";
import WhatsAppIcon from "./WhatsAppIcon";

const TESTIMONIALS = REVIEWS.filter((r) => r.status === "approved").slice(0, 3);

// Evidence under the trust numbers: licence number, client logos and short
// testimonials. Each part shows only once the owner has added real details.
const TrustEvidence = () => {
  if (!TRUST.clientLogos.length && !TESTIMONIALS.length) return null;
  return (
    <div className="evidence">
      {TRUST.clientLogos.length > 0 && (
        <ul className="evidence__logos" aria-label="Some of our clients">
          {TRUST.clientLogos.map((logo) => (
            <li key={logo.name}>
              <img src={logo.src} alt={logo.name} height="40" loading="lazy" />
            </li>
          ))}
        </ul>
      )}
      {TESTIMONIALS.length > 0 && (
        <ul className="evidence__quotes" aria-label="What clients say">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <blockquote>“{t.comment}”</blockquote>
              <p>
                <strong>{t.name}</strong>
                {t.location && ` · ${t.location}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Hero = () => (
  <section className="hero" aria-labelledby="hero-title">
    <div className="hero__inner">
      <div className="hero__copy">
        {/* Brand crest as a faint background watermark (decorative only). */}
        <div
          className="hero__watermark"
          aria-hidden="true"
          style={{ backgroundImage: "url(/images/logo-watermark.webp)" }}
        />
        <p className="hero__eyebrow">
          <ShieldCheck aria-hidden="true" />
          {TRUST.psraNumber
            ? `PSRA registered, no. ${TRUST.psraNumber} · Kisumu, Kenya`
            : "Registered security provider · Kisumu, Kenya"}
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__slogan">Protecting what matters</span>
          <span className="hero__promise">
            Trained guards, <span className="nowrap">GPS-verified</span> on your
            site, day and night.
          </span>
        </h1>
        <p className="hero__lead">
          Guarding, alarms, CCTV, canine and VIP protection for homes,
          schools, hotels and businesses across Kenya, with every guard's
          location checked by our operations team in real time.
        </p>
        <div className="hero__actions">
          <a href="#contact" className="btn btn--primary btn--lg">
            Get a free site assessment
            <ArrowRight aria-hidden="true" />
          </a>
          <a
            href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp btn--lg"
            onClick={() => track("whatsapp_tap", { from: "hero" })}
          >
            <WhatsAppIcon />
            WhatsApp us
          </a>
        </div>
      </div>

      <div className="hero__media">
        <img
          src="/images/hero-team-640.webp"
          srcSet="/images/hero-team-640.webp 640w, /images/hero-team-1080.webp 1080w"
          sizes="(min-width: 960px) 460px, 100vw"
          width="640"
          height="640"
          alt="Spears Resilience Systems guards lined up for inspection at a client site"
          fetchpriority="high"
          className="hero__img"
        />
        <p className="hero__badge">
          <MapPin aria-hidden="true" />
          Guard location sent every 30 seconds
        </p>
      </div>
    </div>

    <ul className="trust" aria-label="Why clients trust us">
      <li>
        <strong>{STATS.sites}</strong> active sites
      </li>
      <li>
        <strong>{STATS.counties}</strong> of 47 counties
      </li>
      <li>
        Since <strong>{COMPANY.foundedYear}</strong>
      </li>
      <li>
        <strong>Day &amp; night</strong> guarding
      </li>
    </ul>
    {STATS.asOf && <p className="trust__asof">Site and county figures as of {STATS.asOf}.</p>}
    <TrustEvidence />
  </section>
);

export default Hero;
