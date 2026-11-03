// Kenyan phone numbers: accepts 07XX/01XX local, 2547/2541 and +2547/+2541
// international, with spaces, dashes, dots or brackets. Returns the number as
// +254XXXXXXXXX, or "" when it isn't a Kenyan mobile number.
// Keep in step with src/lib/phone.js (the browser copy); a test checks both.

const normaliseKenyanPhone = (value) => {
  const raw = String(value == null ? "" : value).trim();
  if (!/^\+?[\d\s\-.()]+$/.test(raw)) return "";
  const digits = raw.replace(/\D/g, "");
  let local = "";
  if (/^0[17]\d{8}$/.test(digits)) local = digits.slice(1);
  else if (/^254[17]\d{8}$/.test(digits)) local = digits.slice(3);
  else if (/^[17]\d{8}$/.test(digits)) local = digits;
  return local ? `+254${local}` : "";
};

module.exports = { normaliseKenyanPhone };
