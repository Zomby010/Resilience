import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { subscribeServiceInquiry } from "./contactFormBridge";
import "./ContactForm.css";

/**
 * ContactForm
 * -----------
 * A fully self-contained, responsive contact form that sends
 * submissions directly to your inbox using EmailJS — no backend required.
 *
 * HOW EMAILJS WORKS HERE:
 * 1. The form fields use "name" attributes (user_name, user_email, message)
 *    that must exactly match the variables in your EmailJS template.
 * 2. We use emailjs.sendForm(), which reads the <form> element directly
 *    (via a ref) and pulls the field values from their "name" attributes.
 * 3. On success/failure we show inline status messages to the user.
 */
export default function ContactForm() {
  // useRef gives EmailJS direct access to the actual <form> DOM node.
  // This is the recommended approach for emailjs.sendForm().
  const formRef = useRef();

  // Controlled state for each field, used for validation and resetting.
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  // Holds validation error messages per field.
  const [errors, setErrors] = useState({});

  // Tracks whether the email is currently being sent (disables the button).
  const [isSending, setIsSending] = useState(false);

  // Holds the outcome of the last submission attempt: "success" | "error" | null
  const [submitStatus, setSubmitStatus] = useState(null);

  // Listens for a pre-filled inquiry published by Footer's service
  // modal (see contactFormBridge.js) once the visitor picks "Continue
  // by Email". Drops the message — and the name/email they already
  // typed into the modal — into this form so they land here with
  // everything ready and just need to hit Send.
  useEffect(() => {
    const unsubscribe = subscribeServiceInquiry(({ message, name, email }) => {
      setFormData((prev) => ({
        ...prev,
        message: message || prev.message,
        user_name: name || prev.user_name,
        user_email: email || prev.user_email,
      }));
      setErrors((prev) => ({
        ...prev,
        message: message ? null : prev.message,
        user_name: name ? null : prev.user_name,
        user_email: email ? null : prev.user_email,
      }));
      setSubmitStatus(null);
    });

    return unsubscribe;
  }, []);

  // Generic change handler shared by all fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for a field as soon as the user starts fixing it.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Simple, dependency-free client-side validation.
  const validate = () => {
    const newErrors = {};

    // NAME: required, minimum 2 characters.
    if (!formData.user_name.trim()) {
      newErrors.user_name = "Please enter your name.";
    } else if (formData.user_name.trim().length < 2) {
      newErrors.user_name = "Name must be at least 2 characters.";
    }

    // EMAIL: required + basic email pattern check.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.user_email.trim()) {
      newErrors.user_email = "Please enter your email address.";
    } else if (!emailPattern.test(formData.user_email.trim())) {
      newErrors.user_email = "Please enter a valid email address.";
    }

    // MESSAGE: required, minimum 10 characters so submissions are meaningful.
    if (!formData.message.trim()) {
      newErrors.message = "Please enter a message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(newErrors);

    // Move focus to the first invalid field so keyboard and screen-reader
    // users land on the problem instead of hunting for it.
    const firstInvalid = ["user_name", "user_email", "message"].find(
      (key) => newErrors[key]
    );
    if (firstInvalid) document.getElementById(firstInvalid)?.focus();

    // Form is valid if there are no keys in newErrors.
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset any previous status banner before a new attempt.
    setSubmitStatus(null);

    // Stop here if client-side validation fails.
    if (!validate()) {
      return;
    }

    // Honeypot: real visitors never see or fill this field; bots usually do.
    // Pretend success so the bot gets no signal, but send nothing.
    if (formRef.current?.elements?.website?.value) {
      setSubmitStatus("success");
      return;
    }

    setIsSending(true);

    // ------------------------------------------------------------------
    // EMAILJS SEND CALL
    // emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
    // Replace the placeholders below with your own EmailJS credentials.
    // ------------------------------------------------------------------
    emailjs
      .sendForm(
        process.env.REACT_APP_SERVICE_ID, // <-- ADD YOUR EMAILJS SERVICE ID HERE
        process.env.REACT_APP_TEMPLATE_ID, // <-- ADD YOUR EMAILJS TEMPLATE ID HERE
        formRef.current,
        process.env.REACT_APP_PUBLIC_KEY // <-- ADD YOUR EMAILJS PUBLIC KEY HERE
      )
      .then(
        () => {
          // SUCCESS: notify the user and reset the form.
          setSubmitStatus("success");
          setFormData({ user_name: "", user_email: "", message: "" });
          formRef.current.reset();
          setIsSending(false);
        },
        (error) => {
          // ERROR: keep the user's input so they don't lose their message,
          // and show an error notification.
          console.error("EmailJS error:", error?.text || error);
          setSubmitStatus("error");
          setIsSending(false);
        }
      );
  };

  return (
    <div id="contact-form" className="contact-form-wrapper">
      <form
        ref={formRef}
        className="contact-form"
        onSubmit={handleSubmit}
        noValidate // we handle validation ourselves, so disable native browser popups
      >
        <h2 className="contact-form-title">Get in touch</h2>
        <p className="contact-form-subtitle">
          Fill out the form below and our team will get back to you as soon as possible.
        </p>

        {/* Sets expectations before the visitor starts typing. Also the
            landing point + first-field focus target for the footer's
            "Email Us" card (see scrollToContactForm() in Footer.jsx). */}
        <p className="contact-form-helper">
          Tell us about your security needs and our team will contact you
          with a tailored solution.
        </p>

        {/* NAME FIELD */}
        <div className="form-group">
          <label htmlFor="user_name">Name</label>
          <input
            type="text"
            id="user_name"
            name="user_name" // MUST match {{user_name}} in your EmailJS template
            value={formData.user_name}
            onChange={handleChange}
            className={errors.user_name ? "input-error" : ""}
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={errors.user_name ? "true" : undefined}
            aria-describedby={errors.user_name ? "user_name-error" : undefined}
            disabled={isSending}
          />
          {errors.user_name && (
            <span id="user_name-error" className="error-message" role="alert">
              {errors.user_name}
            </span>
          )}
        </div>

        {/* EMAIL FIELD */}
        <div className="form-group">
          <label htmlFor="user_email">Email</label>
          <input
            type="email"
            id="user_email"
            name="user_email" // MUST match {{user_email}} in your EmailJS template
            value={formData.user_email}
            onChange={handleChange}
            className={errors.user_email ? "input-error" : ""}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.user_email ? "true" : undefined}
            aria-describedby={
              errors.user_email ? "user_email-error" : "user_email-hint"
            }
            disabled={isSending}
          />
          {errors.user_email && (
            <span id="user_email-error" className="error-message" role="alert">
              {errors.user_email}
            </span>
          )}
          {!errors.user_email && (
            <span id="user_email-hint" className="field-hint">
              We'll only use this to reply to your inquiry.
            </span>
          )}
        </div>

        {/* MESSAGE FIELD */}
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message" // MUST match {{message}} in your EmailJS template
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? "input-error" : ""}
            placeholder="How can we help you?"
            rows="6"
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            disabled={isSending}
          />
          {errors.message && (
            <span id="message-error" className="error-message" role="alert">
              {errors.message}
            </span>
          )}
          {!errors.message && (
            <span id="message-hint" className="field-hint">
              A few sentences about the site, risk, or system you'd like
              secured helps us respond faster.
            </span>
          )}
        </div>

        {/* HONEYPOT — hidden from people and assistive tech (see .form-hp). */}
        <div className="form-hp" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* SUBMIT BUTTON — disabled while sending to prevent duplicate sends */}
        <button
          type="submit"
          className={`submit-button${isSending ? " submit-button--loading" : ""}`}
          disabled={isSending}
        >
          {isSending && <span className="submit-button__spinner" aria-hidden="true" />}
          {isSending ? "Sending..." : "Send Message"}
        </button>

        {/* SUCCESS / ERROR NOTIFICATIONS */}
        {submitStatus === "success" && (
          <p className="status-message status-success" role="status">
            Your message was sent successfully. Thank you for reaching out!
          </p>
        )}
        {submitStatus === "error" && (
          <p className="status-message status-error" role="alert">
            Something went wrong while sending your message. Please try again
            in a moment, or reach us on WhatsApp.
          </p>
        )}
      </form>
    </div>
  );
}