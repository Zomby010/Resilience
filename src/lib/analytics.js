// Records a conversion (form sent, Call tap, WhatsApp tap). Uses Vercel Web
// Analytics custom events when the script in public/index.html is active,
// and Google Analytics' gtag if it is ever added. Silent otherwise.
export const track = (name, data = {}) => {
  try {
    if (typeof window.va === "function") window.va("event", { name, data });
    if (typeof window.gtag === "function") window.gtag("event", name, data);
  } catch (e) {
    // Analytics must never break the page.
  }
};
