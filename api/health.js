// GET /api/health: which parts of the form setup are configured, as
// true/false only (never the values). Open it in a browser after changing
// environment variables in Vercel and redeploying.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    resend: Boolean(process.env.RESEND_API_KEY),
    contactTo: Boolean(process.env.CONTACT_TO),
    contactFrom: Boolean(process.env.CONTACT_FROM),
    emailjsFallback: Boolean(
      process.env.REACT_APP_SERVICE_ID && process.env.REACT_APP_TEMPLATE_ID && process.env.REACT_APP_PUBLIC_KEY
    ),
    turnstile: Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.REACT_APP_TURNSTILE_SITE_KEY),
    confirmationEmails: process.env.SEND_CONFIRMATION === "true",
    bms: Boolean(process.env.BMS_API_URL && process.env.BMS_API_TOKEN),
  });
};
