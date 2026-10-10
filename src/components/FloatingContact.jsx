import React, { useEffect, useState } from "react";

import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "../siteConfig";
import { track } from "../lib/analytics";
import WhatsAppIcon from "./WhatsAppIcon";

// Floating WhatsApp button on phones. Hidden while the contact section is
// on screen so it never covers the form.
const FloatingContact = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className={"fab" + (hidden ? " fab--hidden" : "")}
      aria-label="Chat with us on WhatsApp"
      tabIndex={hidden ? -1 : 0}
      onClick={() => track("whatsapp_tap", { from: "floating" })}
    >
      <WhatsAppIcon />
    </a>
  );
};

export default FloatingContact;
