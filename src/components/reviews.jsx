"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Star } from "lucide-react";

import { REVIEWS } from "./reviewsData";
import "./ClientComponent.css";

const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Read-only stars (decorative; the accessible text is supplied by the caller).
const Stars = ({ value, size = "1.1rem" }) => (
  <span className="sr-stars" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        style={{ width: size, height: size }}
        className={n <= Math.round(value) ? "sr-star sr-star--on" : "sr-star"}
      />
    ))}
  </span>
);

// Clickable 1–5 star input, built as a radio group so it works with the
// keyboard (arrow keys) and screen readers.
const StarInput = ({ value, onChange, describedBy, invalid }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div
      className="sr-star-input"
      role="radiogroup"
      aria-label="Your rating"
      aria-describedby={describedBy}
      aria-invalid={invalid ? "true" : undefined}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <label
          key={n}
          className="sr-star-input__label"
          onMouseEnter={() => setHover(n)}
        >
          <input
            type="radio"
            name="rating"
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="sr-visually-hidden"
          />
          <Star
            aria-hidden="true"
            className={n <= shown ? "sr-star sr-star--on" : "sr-star"}
          />
          <span className="sr-visually-hidden">
            {n} star{n > 1 ? "s" : ""}
          </span>
        </label>
      ))}
    </div>
  );
};

const EMPTY = { name: "", location: "", comment: "", email: "" };

const FIELDS = [
  ["name", "Name", "text", "name", "Your name"],
  ["location", "County / Location", "text", "address-level1", "e.g. Kisumu"],
  ["email", "Email (optional)", "email", "email", "you@example.com"],
];

const ReviewForm = () => {
  const formRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!rating) next.rating = "Please choose a star rating.";
    if (data.name.trim().length < 2) next.name = "Please enter your name.";
    if (data.location.trim().length < 2)
      next.location = "Please enter your county or town.";
    if (data.comment.trim().length < 10)
      next.comment = "Please write at least 10 characters.";
    if (
      data.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    )
      next.email = "Please enter a valid email address.";
    setErrors(next);

    const first = ["rating", "name", "location", "comment", "email"].find(
      (k) => next[k]
    );
    if (first) {
      const el =
        first === "rating"
          ? formRef.current?.querySelector('input[name="rating"]')
          : document.getElementById(`review-${first}`);
      el?.focus();
    }
    return !first;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    // Honeypot — real visitors never fill this in.
    if (formRef.current?.elements?.website?.value) {
      setStatus("success");
      return;
    }

    setSending(true);
    // The review is emailed to the Director(s) marked PENDING. It is NOT
    // shown on the site until it is added to reviews.js as "approved".
    // Uses a dedicated EmailJS template if REACT_APP_REVIEW_TEMPLATE_ID is
    // set, otherwise the contact-form template (same variable names).
    const message = [
      "[NEW REVIEW - PENDING APPROVAL]",
      `Rating: ${rating} / 5`,
      `Name: ${data.name.trim()}`,
      `Location: ${data.location.trim()}`,
      "",
      data.comment.trim(),
    ].join("\n");

    emailjs
      .send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_REVIEW_TEMPLATE_ID ||
          process.env.REACT_APP_TEMPLATE_ID,
        {
          user_name: data.name.trim(),
          user_email: data.email.trim() || "no-email-provided@example.com",
          message,
          rating,
          location: data.location.trim(),
          review_status: "pending",
        },
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("success");
          setRating(0);
          setData(EMPTY);
          setSending(false);
        },
        (error) => {
          console.error("EmailJS review error:", error?.text || error);
          setStatus("error");
          setSending(false);
        }
      );
  };

  return (
    <form
      ref={formRef}
      className="sr-glass sr-review-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className="sr-review-form__title">Share your experience</h3>
      <p className="sr-review-form__note">
        Reviews are checked by our directors before they appear on the site.
      </p>

      <div className="sr-review-form__field">
        <span className="sr-review-form__label">Your rating</span>
        <StarInput
          value={rating}
          onChange={(n) => {
            setRating(n);
            setErrors((prev) => ({ ...prev, rating: null }));
          }}
          describedBy={errors.rating ? "review-rating-error" : undefined}
          invalid={!!errors.rating}
        />
        {errors.rating && (
          <span
            id="review-rating-error"
            className="sr-review-form__error"
            role="alert"
          >
            {errors.rating}
          </span>
        )}
      </div>

      {FIELDS.map(([key, label, type, auto, placeholder]) => (
        <div className="sr-review-form__field" key={key}>
          <label htmlFor={`review-${key}`} className="sr-review-form__label">
            {label}
          </label>
          <input
            id={`review-${key}`}
            name={key}
            type={type}
            value={data[key]}
            onChange={handleChange}
            autoComplete={auto}
            placeholder={placeholder}
            disabled={sending}
            aria-invalid={errors[key] ? "true" : undefined}
            aria-describedby={errors[key] ? `review-${key}-error` : undefined}
          />
          {errors[key] && (
            <span
              id={`review-${key}-error`}
              className="sr-review-form__error"
              role="alert"
            >
              {errors[key]}
            </span>
          )}
        </div>
      ))}

      <div className="sr-review-form__field">
        <label htmlFor="review-comment" className="sr-review-form__label">
          Your review
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows="4"
          value={data.comment}
          onChange={handleChange}
          placeholder="Tell us about your experience"
          disabled={sending}
          aria-invalid={errors.comment ? "true" : undefined}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
        />
        {errors.comment && (
          <span
            id="review-comment-error"
            className="sr-review-form__error"
            role="alert"
          >
            {errors.comment}
          </span>
        )}
      </div>

      <div className="form-hp" aria-hidden="true">
        <label htmlFor="review-website">Leave this field empty</label>
        <input
          type="text"
          id="review-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className="sr-btn sr-btn--primary"
        disabled={sending}
      >
        {sending ? "Sending..." : "Submit Review"}
      </button>

      {status === "success" && (
        <p
          className="sr-review-form__status sr-review-form__status--ok"
          role="status"
        >
          Thank you! Your review was sent and will appear once it has been
          approved.
        </p>
      )}
      {status === "error" && (
        <p
          className="sr-review-form__status sr-review-form__status--err"
          role="alert"
        >
          Something went wrong while sending your review. Please try again in
          a moment.
        </p>
      )}
    </form>
  );
};

const Reviews = () => {
  // Only approved reviews are ever displayed.
  const approved = useMemo(
    () => REVIEWS.filter((review) => review.status === "approved"),
    []
  );
  const average = approved.length
    ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
    : 0;

  return (
    <section id="reviews" className="sr-section sr-section--light">
      <div className="sr-section__inner">
        <Reveal>
          <span className="sr-eyebrow">
            <span className="sr-eyebrow__dot" aria-hidden="true" />
            Reviews &amp; Ratings
          </span>
          <h2 className="sr-heading">
            What Our <span className="sr-heading__accent">Clients Say</span>
          </h2>
          <span className="sr-heading__underline" aria-hidden="true" />
        </Reveal>

        {approved.length > 0 && (
          <Reveal>
            <div
              className="sr-rating-summary"
              role="group"
              aria-label={`Average rating ${average.toFixed(1)} out of 5 from ${approved.length} reviews`}
            >
              <span className="sr-rating-summary__score" aria-hidden="true">
                {average.toFixed(1)}
              </span>
              <div>
                <Stars value={average} size="1.5rem" />
                <div className="sr-rating-summary__count" aria-hidden="true">
                  Based on {approved.length} client review
                  {approved.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className="sr-reviews__layout">
          <div className="sr-reviews__list">
            {approved.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.06}>
                <figure className="sr-glass sr-review-card">
                  <Stars value={review.rating} />
                  <span className="sr-visually-hidden">
                    Rated {review.rating} out of 5
                  </span>
                  <blockquote className="sr-review-card__text">
                    “{review.comment}”
                  </blockquote>
                  <figcaption className="sr-review-card__author">
                    <strong>{review.name}</strong>
                    <span>{review.location}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <ReviewForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
