// POST /api/contact: emails a quote request to the office (see _lib/mail.js).
const { handle, clean, isEmail } = require("./_lib/mail");
const { normaliseKenyanPhone } = require("./_lib/phone");

module.exports = handle((body) => {
  const name = clean(body.name, 100);
  const phone = normaliseKenyanPhone(clean(body.phone, 30));
  const email = clean(body.email, 200);
  const service = clean(body.service, 100) || "Not sure yet";
  const location = clean(body.location, 120);
  const message = clean(body.message, 3000);

  if (name.length < 2) return { error: "Enter your name." };
  if (!phone) return { error: "Enter a Kenyan mobile number, e.g. 0712 345 678." };
  if (email && !isEmail(email)) return { error: "Enter a valid email or leave it empty." };

  return {
    subject: `New quote request: ${service} · ${location || "location not given"} · ${name}`,
    replyTo: email || undefined,
    rows: [
      ["Service", service],
      ["Name", name],
      ["Phone", phone],
      ["Email", email],
      ["Site location", location],
      ["Message", message],
    ],
    confirmation: email ? { to: email, phone } : undefined,
  };
}, "quote");
