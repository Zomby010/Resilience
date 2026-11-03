// Single source of truth for the company's contact details, numbers and
// links. Change a value here and every section, form and link follows.

export const COMPANY = {
  name: "Spears Resilience Systems",
  legalName: "Spears Resilience Systems Limited",
  foundedYear: 2022,
};

export const PHONE = {
  display: "+254 702 915 154",
  href: "tel:+254702915154",
  whatsapp: "254702915154", // digits only, for wa.me links
};

// Company inbox (confirmed by the owner). Keep the JSON-LD in
// public/index.html, public/privacy.html, DEFAULT_TO in api/_lib/mail.js and
// CONTACT_TO in Vercel the same.
export const EMAIL = "spearsresiliencesystem@gmail.com";

export const ADDRESS = {
  lines: [
    "Technology Road, next to Kisumu Polytechnic",
    "P.O. Box 6053-40103, Kondele, Kisumu",
  ],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Kisumu Polytechnic, Technology Road, Kisumu, Kenya"),
};

export const STATS = {
  sites: 296,
  counties: 40,
  // TODO(owner): the month these numbers were last counted, e.g. "October 2026".
  // Shown as "as of …" under the numbers; hidden while empty.
  asOf: "",
};

// TODO(owner): how soon the office calls back after a quote request, e.g.
// "2 working hours". Shown on the thank-you message. Keep the same as
// CALLBACK_PROMISE in api/_lib/mail.js. Empty means "shortly".
export const CALLBACK_PROMISE = "";

// Trust strip under the hero. Each part is hidden while empty, so never fill
// these with examples: only real details, and logos only with the client's
// permission.
export const TRUST = {
  // TODO(owner): PSRA (Private Security Regulatory Authority) registration number.
  psraNumber: "",
  // TODO(owner): client logos, e.g. { name: "Client name", src: "/images/clients/name.webp" }.
  clientLogos: [],
};

export const whatsappLink = (message) =>
  `https://wa.me/${PHONE.whatsapp}?text=${encodeURIComponent(message)}`;

export const GENERAL_WHATSAPP_MESSAGE =
  "Hello Spears Resilience Systems, I would like to talk about security for my site.";

// Only networks with a real profile URL are shown. Add the URL to show one.
export const SOCIAL_LINKS = [
  { label: "Facebook", href: "" },
  { label: "Instagram", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "X (Twitter)", href: "" },
  { label: "YouTube", href: "" },
].filter((link) => link.href);

// Optional: the Google Business Profile reviews link ("Read our reviews on
// Google"). Leave empty to hide it.
export const GOOGLE_REVIEWS_URL = process.env.REACT_APP_GOOGLE_REVIEWS_URL || "";

// Optional: staff sign-in link to the Resilience BMS, set in Vercel.
export const STAFF_LOGIN_URL = process.env.REACT_APP_STAFF_LOGIN_URL || "";

export const SERVICES = [
  {
    id: "guarding",
    title: "Day & Night Guarding",
    text: "Vetted, uniformed officers on static and patrol duty, GPS-checked on your site every shift.",
  },
  {
    id: "alarms",
    title: "Alarm Systems",
    text: "Intrusion alarms installed and monitored, with a rapid response when one goes off.",
  },
  {
    id: "cctv",
    title: "CCTV Surveillance",
    text: "Cameras installed and maintained so every corner of your site is on record.",
  },
  {
    id: "canine",
    title: "Canine (Dog) Unit",
    text: "Trained dogs and handlers for perimeter patrol, detection and deterrence.",
  },
  {
    id: "vip",
    title: "VIP Protection",
    text: "Close-protection officers for executives, families and events.",
  },
  {
    id: "fencing",
    title: "Electric Fencing",
    text: "Electric fences installed and serviced to stop intruders at the boundary.",
  },
  {
    id: "fire",
    title: "Fire Extinguishers",
    text: "Supply, refilling and servicing of extinguishers for homes and businesses.",
  },
];
