import React, { useRef, useState } from "react";
import { Star, X } from "lucide-react";

import { sendEnquiry } from "../lib/sendEnquiry";
import { track } from "../lib/analytics";

const EMPTY = { name: "", location: "", comment: "", email: "", website: "" };

// "Leave a review" button that opens a small form in a dialog. Reviews are
// emailed to the office as pending and only published once approved.
const ReviewDialog = () => {
  const dialogRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorText, setErrorText] = useState("");

  const open = () => {
    const dialog = dialogRef.current;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
  };
  const close = () => {
    const dialog = dialogRef.current;
    if (dialog.close) dialog.close();
    else dialog.removeAttribute("open");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!rating) next.rating = "Choose a star rating.";
    if (data.name.trim().length < 2) next.name = "Enter your name.";
    if (data.comment.trim().length < 10) next.comment = "Write at least a sentence.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      next.email = "Enter a valid email or leave it empty.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    if (data.website) {
      setStatus("sent"); // honeypot: pretend success to bots
      return;
    }

    setStatus("sending");
    const payload = {
      rating,
      name: data.name.trim(),
      location: data.location.trim(),
      email: data.email.trim(),
      comment: data.comment.trim(),
      website: data.website,
      summary: [
        "[NEW REVIEW - PENDING APPROVAL]",
        `Rating: ${rating} / 5`,
        `Name: ${data.name.trim()}`,
        `Location: ${data.location.trim() || "-"}`,
        "",
        data.comment.trim(),
      ].join("\n"),
    };
    try {
      await sendEnquiry("review", payload);
      track("review_sent", { rating });
      setStatus("sent");
      setData(EMPTY);
      setRating(0);
    } catch (err) {
      setErrorText(err.message);
      setStatus("error");
    }
  };

  return (
    <>
      <button type="button" className="btn btn--ghost" onClick={open}>
        <Star aria-hidden="true" />
        Leave a review
      </button>
      <dialog ref={dialogRef} className="dialog" aria-labelledby="review-title">
        <div className="dialog__head">
          <h3 id="review-title">Share your experience</h3>
          <button type="button" className="dialog__close" onClick={close} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </div>

        {status === "sent" ? (
          <p className="form__ok" role="status">
            Thank you. Your review was sent and will appear once approved.
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate>
            <fieldset className="rating">
              <legend>Your rating</legend>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className={"rating__star" + (n <= rating ? " rating__star--on" : "")}>
                  <input
                    type="radio"
                    name="rating"
                    value={n}
                    checked={rating === n}
                    onChange={() => setRating(n)}
                    className="visually-hidden"
                  />
                  <Star aria-hidden="true" />
                  <span className="visually-hidden">{n} star{n > 1 ? "s" : ""}</span>
                </label>
              ))}
              {errors.rating && <p className="form__error">{errors.rating}</p>}
            </fieldset>

            <label className="field">
              <span>Name</span>
              <input name="name" value={data.name} onChange={onChange} autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name && <span className="form__error">{errors.name}</span>}
            </label>
            <label className="field">
              <span>Town or county <em>(optional)</em></span>
              <input name="location" value={data.location} onChange={onChange} />
            </label>
            <label className="field">
              <span>Your review</span>
              <textarea name="comment" rows="4" value={data.comment} onChange={onChange} aria-invalid={!!errors.comment} />
              {errors.comment && <span className="form__error">{errors.comment}</span>}
            </label>
            <label className="field">
              <span>Email <em>(optional, never shown)</em></span>
              <input name="email" type="email" value={data.email} onChange={onChange} autoComplete="email" aria-invalid={!!errors.email} />
              {errors.email && <span className="form__error">{errors.email}</span>}
            </label>
            <label className="hp" aria-hidden="true">
              Leave this empty
              <input name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={onChange} />
            </label>

            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send review"}
            </button>
            {status === "error" && (
              <p className="form__error" role="alert">{errorText}</p>
            )}
          </form>
        )}
      </dialog>
    </>
  );
};

export default ReviewDialog;
