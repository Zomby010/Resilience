// Talks to the Resilience BMS (the company's Django operations system), which
// stores website reviews until the office publishes them.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   BMS_API_URL    The BMS address, e.g. "https://app.spearsresiliencesystems.com".
//   BMS_API_TOKEN  The same long random value as WEBSITE_API_TOKEN on the BMS.
// Without both, nothing is sent to the BMS and the website shows only the
// reviews in src/reviewsData.js.

const TIMEOUT_MS = 5000;

const bmsConfigured = () => Boolean(process.env.BMS_API_URL && process.env.BMS_API_TOKEN);

const bmsFetch = async (path, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(process.env.BMS_API_URL.replace(/\/+$/, "") + path, {
      ...options,
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`BMS ${res.status}: ${detail.slice(0, 300)}`);
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
};

const postToBms = (path, data) =>
  bmsFetch(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BMS_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

const getFromBms = (path) => bmsFetch(path);

module.exports = { bmsConfigured, postToBms, getFromBms };
