// POST /api/contact: emails a quote request to the office (see _lib/mail.js).
const { handle, clean, isEmail } = require("./_lib/mail");

module.exports = handle((body) => {
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 200);
  const service = clean(body.service, 100) || "Not sure yet";
  const location = clean(body.location, 120);
  const message = clean(body.message, 3000);

  if (name.length < 2) return { error: "Enter your name." };
  if (phone.replace(/\D/g, "").length < 9) return { error: "Enter a phone number we can call." };
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
  };
});
