import React, { useEffect, useRef, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import {
  ADDRESS,
  CALLBACK_PROMISE,
  EMAIL,
  GENERAL_WHATSAPP_MESSAGE,
  PHONE,
  SERVICES,
  whatsappLink,
} from "../siteConfig";
import { sendEnquiry } from "../lib/sendEnquiry";
import { normaliseKenyanPhone, PHONE_ERROR } from "../lib/phone";
import { track } from "../lib/analytics";
import WhatsAppIcon from "./WhatsAppIcon";

const EMPTY = { name: "", phone: "", email: "", service: "", location: "", message: "", website: "" };
const TURNSTILE_SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || "";

// Loads Cloudflare Turnstile (invisible spam check) only when a site key is
// configured. The widget adds a hidden "cf-turnstile-response" field.
const useTurnstile = () => {
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || document.getElementById("cf-turnstile")) return;
    const script = document.createElement("script");
    script.id = "cf-turnstile";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);
};

const FIELD_ORDER = ["phone", "name", "service", "location", "email", "message"];

// Checks one field; returns its error message or undefined.
const fieldError = (name, value) => {
  const v = (value || "").trim();
  if (name === "name" && v.length < 2) return "Enter your name.";
  if (name === "phone" && !normaliseKenyanPhone(v)) return v ? PHONE_ERROR : "Enter a phone number we can call.";
  if (name === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email or leave it empty.";
  return undefined;
};

// The visitor's request as a WhatsApp message, for when sending fails.
const whatsappFallbackMessage = (data) =>
  [
    "Hello Spears Resilience Systems, I'd like a free site assessment.",
    `Service: ${data.service || "Not sure yet"}`,
    `Name: ${data.name.trim()}`,
    `Phone: ${data.phone.trim()}`,
    data.location.trim() && `Site location: ${data.location.trim()}`,
    data.email.trim() && `Email: ${data.email.trim()}`,
    data.message.trim() && `Message: ${data.message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

// Moves focus to the first empty field whenever a "#contact" link (a "Get a
// quote" button) is followed, so the visitor can start typing straight away.
const useFocusOnQuoteLinks = (formRef) => {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest && e.target.closest('a[href="#contact"]');
      if (!link) return;
      // After React has applied any pre-selected service.
      setTimeout(() => {
        const form = formRef.current;
        if (!form) return;
        const field =
          FIELD_ORDER.map((name) => form.elements[name]).find((el) => el && !el.value) ||
          form.elements.phone;
        field?.focus({ preventScroll: true });
      }, 0);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [formRef]);
};

// The single contact section: a short quote form next to Call, WhatsApp,
// email and the office address.
const Contact = ({ chosenService }) => {
  const formRef = useRef(null);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorText, setErrorText] = useState("");
  const [sentPhone, setSentPhone] = useState("");
  const [announcement, setAnnouncement] = useState("");
  useTurnstile();
  useFocusOnQuoteLinks(formRef);

  useEffect(() => {
    if (chosenService) {
      setData((d) => ({ ...d, service: chosenService }));
      setStatus("idle");
    }
  }, [chosenService]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  // Inline check when the visitor leaves a field they have typed in.
  const onBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) return;
    const error = fieldError(name, value);
    setErrors((x) => ({ ...x, [name]: error }));
    if (error) setAnnouncement(error);
  };

  const validate = () => {
    const next = {};
    FIELD_ORDER.forEach((name) => {
      const error = fieldError(name, data[name]);
      if (error) next[name] = error;
    });
    setErrors(next);
    const first = FIELD_ORDER.find((name) => next[name]);
    if (first) formRef.current?.elements[first]?.focus();
    return !first;
  };

  const errorProps = (name) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onBlur,
  });
  const fieldErrorFor = (name) =>
    errors[name] && (
      <span id={`${name}-error`} className="form__error">
        {errors[name]}
      </span>
    );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (data.website) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    const token = formRef.current?.elements["cf-turnstile-response"]?.value || "";
    const service = data.service || "Not sure yet";
    const payload = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      service,
      location: data.location.trim(),
      message: data.message.trim(),
      website: data.website,
      turnstileToken: token,
      summary: [
        "[NEW QUOTE REQUEST]",
        `Service: ${service}`,
        `Name: ${data.name.trim()}`,
        `Phone: ${data.phone.trim()}`,
        `Email: ${data.email.trim() || "-"}`,
        `Site location: ${data.location.trim() || "-"}`,
        "",
        data.message.trim() || "(no message)",
      ].join("\n"),
    };
    try {
      await sendEnquiry("contact", payload);
      track("quote_sent", { service });
      setSentPhone(data.phone.trim());
      setStatus("sent");
      setData(EMPTY);
    } catch (err) {
      setErrorText(err.message);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section section--alt" aria-labelledby="contact-title">
      <div className="section__inner contact">
        <div className="contact__intro">
          <p className="section__eyebrow">Get a free quote</p>
          <h2 id="contact-title" className="section__title">Tell us about your site</h2>
          <p className="section__lead">
            We'll call you back to arrange a free site assessment. Prefer to
            talk now? Call or WhatsApp us.
          </p>

          <ul className="direct">
            <li>
              <a href={PHONE.href} className="direct__item" onClick={() => track("call_tap", { from: "contact" })}>
                <Phone aria-hidden="true" />
                <span>
                  <strong>Call</strong> {PHONE.display}
                </span>
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="direct__item"
                onClick={() => track("whatsapp_tap", { from: "contact" })}
              >
                <WhatsAppIcon />
                <span>
                  <strong>WhatsApp</strong> {PHONE.display}
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="direct__item" onClick={() => track("email_tap", { from: "contact" })}>
                <Mail aria-hidden="true" />
                <span>
                  <strong>Email</strong> {EMAIL}
                </span>
              </a>
            </li>
            <li>
              <a href={ADDRESS.mapUrl} target="_blank" rel="noopener noreferrer" className="direct__item">
                <MapPin aria-hidden="true" />
                <span>
                  <strong>Office</strong> {ADDRESS.lines[0]}, Kisumu
                  <small>Open in Google Maps</small>
                </span>
              </a>
            </li>
            <li className="direct__item direct__item--plain">
              <Clock aria-hidden="true" />
              <span>
                <strong>Day and night cover.</strong> Ask us about guarding hours for your site.
              </span>
            </li>
          </ul>
        </div>

        <div className="contact__form-wrap">
          {status === "sent" ? (
            <div className="form__ok" role="status">
              <h3>Thank you, we've got your request.</h3>
              <p>
                We'll call you on <strong>{sentPhone}</strong>{" "}
                {CALLBACK_PROMISE ? `within ${CALLBACK_PROMISE}` : "shortly"} to
                arrange your free site assessment. For anything urgent, call{" "}
                <a href={PHONE.href}>{PHONE.display}</a>.
              </p>
              <button type="button" className="btn btn--ghost" onClick={() => setStatus("idle")}>
                Send another request
              </button>
            </div>
          ) : (
            <form ref={formRef} id="quote-form" className="form" onSubmit={onSubmit} noValidate>
              <label className="field">
                <span>Phone number</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="0712 345 678 or +254 712 345 678"
                  value={data.phone}
                  onChange={onChange}
                  autoComplete="tel"
                  {...errorProps("phone")}
                />
                {fieldErrorFor("phone")}
              </label>
              <label className="field">
                <span>Your name</span>
                <input name="name" value={data.name} onChange={onChange} autoComplete="name" {...errorProps("name")} />
                {fieldErrorFor("name")}
              </label>
              <label className="field">
                <span>Service you need</span>
                <select name="service" value={data.service} onChange={onChange}>
                  <option value="">Not sure yet</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Site location <em>(town or county)</em></span>
                <input name="location" value={data.location} onChange={onChange} autoComplete="address-level2" />
              </label>
              <label className="field">
                <span>Email <em>(optional)</em></span>
                <input name="email" type="email" value={data.email} onChange={onChange} autoComplete="email" {...errorProps("email")} />
                {fieldErrorFor("email")}
              </label>
              <label className="field">
                <span>Anything else? <em>(optional)</em></span>
                <textarea name="message" rows="3" value={data.message} onChange={onChange} />
              </label>
              <label className="hp" aria-hidden="true">
                Leave this empty
                <input name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={onChange} />
              </label>
              {TURNSTILE_SITE_KEY && (
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-size="flexible" />
              )}
              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Request my free assessment"}
              </button>
              {status === "error" && (
                <div className="form__fallback" role="alert">
                  <p className="form__error">
                    {errorText} Your details are ready to send on WhatsApp instead.
                  </p>
                  <div className="form__fallback-actions">
                    <a
                      href={whatsappLink(whatsappFallbackMessage(data))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--whatsapp"
                      onClick={() => track("quote_whatsapp_fallback", { service: data.service || "Not sure yet" })}
                    >
                      <WhatsAppIcon />
                      Send this on WhatsApp instead
                    </a>
                    <a href={PHONE.href} className="btn btn--ghost" onClick={() => track("call_tap", { from: "quote_error" })}>
                      <Phone aria-hidden="true" />
                      Call {PHONE.display}
                    </a>
                  </div>
                </div>
              )}
              <p className="visually-hidden" aria-live="polite">{announcement}</p>
              <p className="form__note">
                We use your details only to reply. <a href="/privacy">Privacy notice</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
