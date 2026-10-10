// Shared helpers for the /api/contact and /api/review Vercel Functions.
// Files in api/_lib are not exposed as endpoints (leading underscore).
//
// Environment variables (set in Vercel → Project → Settings → Environment
// Variables; never commit them):
//   RESEND_API_KEY        Resend API key. Without it the functions answer
//                         503 and the website falls back to EmailJS.
//   CONTACT_TO            Inbox that receives enquiries and reviews.
//   CONTACT_FROM          Sender on a domain verified in Resend, e.g.
//                         "Spears Website <website@spearsresiliencesystems.com>".
//   TURNSTILE_SECRET_KEY  Optional Cloudflare Turnstile secret. When set,
//                         requests without a valid token are refused.

const DEFAULT_TO = "spearsresiliencesystem@gmail.com";
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map(); // best-effort, per function instance

const clientIp = (req) =>
  String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "")
    .split(",")[0]
    .trim();

const rateLimited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
};

const clean = (value, max = 2000) =>
  String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const verifyTurnstile = async (token, ip) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  return Boolean(data.success);
};

const sendMail = async ({ subject, rows, replyTo }) => {
  const text = rows.map(([k, v]) => `${k}: ${v || "-"}`).join("\n");
  const html =
    "<table cellpadding='6' style='font-family:Arial,sans-serif;font-size:14px'>" +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style='color:#555;vertical-align:top'><b>${escapeHtml(k)}</b></td>` +
          `<td style='white-space:pre-wrap'>${escapeHtml(v || "-")}</td></tr>`
      )
      .join("") +
    "</table>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Spears Website <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || DEFAULT_TO],
      subject,
      text,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
};

// Wraps a handler with the checks both endpoints share.
const handle = (buildMail) => async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: "not_configured" });
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (body.website) return res.status(200).json({ ok: true }); // honeypot

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many messages. Please call or WhatsApp us instead." });
  }
  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return res.status(400).json({ error: "Please complete the spam check and try again." });
  }

  const mail = buildMail(body);
  if (mail.error) return res.status(400).json({ error: mail.error });

  try {
    await sendMail(mail);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "We couldn't send that just now. Please call or WhatsApp us." });
  }
};

module.exports = { handle, clean, isEmail };
