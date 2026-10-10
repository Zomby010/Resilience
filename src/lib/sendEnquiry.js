import emailjs from "@emailjs/browser";

// Sends a quote request or a review to the company inbox.
//
// 1. First choice: our own Vercel function (/api/contact or /api/review),
//    which emails the office through Resend with the keys kept server-side.
// 2. Fallback: EmailJS from the browser, using the REACT_APP_* keys already
//    set in Vercel. Used while Resend is not set up yet (the function
//    answers 503), on `npm start` (no /api there) or if the function is
//    unreachable.
//
// Resolves on success; rejects with an Error whose message is safe to show.

const FALLBACK_STATUSES = new Set([404, 405, 501, 503]);

const sendWithEmailJS = (kind, payload) => {
  const serviceId = process.env.REACT_APP_SERVICE_ID;
  const templateId =
    kind === "review"
      ? process.env.REACT_APP_REVIEW_TEMPLATE_ID || process.env.REACT_APP_TEMPLATE_ID
      : process.env.REACT_APP_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) {
    return Promise.reject(new Error("Sending is not set up yet."));
  }
  // Variable names match the existing EmailJS templates: {{user_name}},
  // {{user_email}}, {{message}}.
  return emailjs.send(
    serviceId,
    templateId,
    {
      user_name: payload.name,
      user_email: payload.email || "no-email-provided@example.com",
      message: payload.summary,
      ...(kind === "review"
        ? { rating: payload.rating, location: payload.location, review_status: "pending" }
        : { phone: payload.phone, service: payload.service, location: payload.location }),
    },
    { publicKey }
  );
};

export const sendEnquiry = async (kind, payload) => {
  let response;
  try {
    response = await fetch(`/api/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    response = null;
  }

  if (response && response.ok) return;

  if (response && !FALLBACK_STATUSES.has(response.status)) {
    let message = "Something went wrong. Please call or WhatsApp us instead.";
    try {
      const body = await response.json();
      if (body && body.error) message = body.error;
    } catch (e) {
      // Keep the generic message.
    }
    throw new Error(message);
  }

  await sendWithEmailJS(kind, payload);
};
