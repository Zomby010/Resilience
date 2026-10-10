import React from "react";

import { ADDRESS, COMPANY, EMAIL, PHONE, SOCIAL_LINKS, STAFF_LOGIN_URL } from "../siteConfig";

const SiteFooter = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__brand">
        <img src="/images/logo-header.webp" alt="" width="66" height="56" loading="lazy" />
        <p>
          <strong>{COMPANY.name}</strong>
          <br />
          Protecting what matters.
        </p>
      </div>
      <address className="footer__contact">
        {ADDRESS.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <a href={PHONE.href}>{PHONE.display}</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </address>
      <nav className="footer__links" aria-label="Footer">
        <a href="#services">Services</a>
        <a href="#how-we-work">How we work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="/privacy">Privacy</a>
        {SOCIAL_LINKS.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        ))}
        {STAFF_LOGIN_URL && (
          <a href={STAFF_LOGIN_URL} rel="nofollow">
            Staff login
          </a>
        )}
      </nav>
    </div>
    <p className="footer__legal">
      © {new Date().getFullYear()} {COMPANY.legalName}. Registered security
      solutions provider, Kisumu, Kenya.
    </p>
  </footer>
);

export default SiteFooter;
