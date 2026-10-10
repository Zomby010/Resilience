import React, { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import { PHONE } from "../siteConfig";
import { track } from "../lib/analytics";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#how-we-work", label: "How we work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

// Sticky header: logo, section links, Call and Get a quote. On phones the
// links fold into a menu so only the logo, Call and the menu button show.
const Header = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#top" className="header__brand" aria-label="Spears Resilience Systems, back to top">
          <img
            src="/images/logo-header.webp"
            alt=""
            width="131"
            height="112"
            className="header__logo"
          />
          <span className="header__name">
            Spears <span>Resilience Systems</span>
          </span>
        </a>

        <nav
          id="site-menu"
          className={"header__nav" + (open ? " header__nav--open" : "")}
          aria-label="Main"
        >
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a
            href={PHONE.href}
            className="btn btn--ghost header__call"
            aria-label={`Call ${PHONE.display}`}
            onClick={() => track("call_tap", { from: "header" })}
          >
            <Phone aria-hidden="true" />
            <span className="header__call-text">Call</span>
          </a>
          <a href="#contact" className="btn btn--primary header__quote">
            Get a quote
          </a>
          <button
            type="button"
            className="header__menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
