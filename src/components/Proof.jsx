import React, { useMemo, useState } from "react";
import { Building2, Church, GraduationCap, Hotel, Hospital, Star, Store } from "lucide-react";

import { GALLERY } from "../galleryData";
import { REVIEWS } from "../reviewsData";
import { GOOGLE_REVIEWS_URL } from "../siteConfig";
import ReviewDialog from "./ReviewDialog";

const SECTORS = [
  { icon: GraduationCap, label: "Schools" },
  { icon: Hotel, label: "Hotels & lodges" },
  { icon: Hospital, label: "Hospitals" },
  { icon: Store, label: "Retail" },
  { icon: Church, label: "Churches" },
  { icon: Building2, label: "Offices & homes" },
];

const FIRST_PHOTOS = 6;

const Stars = ({ value }) => (
  <span className="stars" aria-label={`Rated ${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} aria-hidden="true" className={n <= value ? "stars__on" : "stars__off"} />
    ))}
  </span>
);

const Proof = () => {
  const [showAll, setShowAll] = useState(false);
  const reviews = useMemo(() => REVIEWS.filter((r) => r.status === "approved"), []);
  const photos = showAll ? GALLERY : GALLERY.slice(0, FIRST_PHOTOS);

  return (
    <section id="work" className="section section--alt" aria-labelledby="work-title">
      <div className="section__inner">
        <p className="section__eyebrow">Who we protect</p>
        <h2 id="work-title" className="section__title">On duty across Kenya</h2>

        <ul className="sectors" aria-label="Sectors we serve">
          {SECTORS.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <ul className="gallery">
          {photos.map((photo) => (
            <li key={photo.file}>
              <img
                src={`/images/${photo.file}-400.webp`}
                srcSet={`/images/${photo.file}-400.webp 400w, /images/${photo.file}-800.webp ${photo.w}w`}
                sizes="(min-width: 960px) 300px, 50vw"
                width="400"
                height="500"
                loading="lazy"
                decoding="async"
                alt={photo.alt}
              />
            </li>
          ))}
        </ul>
        {GALLERY.length > FIRST_PHOTOS && (
          <button
            type="button"
            className="btn btn--ghost gallery__more"
            aria-expanded={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Show fewer photos" : `Show all ${GALLERY.length} photos`}
          </button>
        )}

        <div className="reviews" id="reviews">
          {reviews.length > 0 && (
            <ul className="reviews__list">
              {reviews.map((review) => (
                <li key={review.id} className="review">
                  <Stars value={review.rating} />
                  <blockquote>“{review.comment}”</blockquote>
                  <p className="review__author">
                    <strong>{review.name}</strong> · {review.location}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="reviews__actions">
            <p>Already a client? Tell others how we did.</p>
            <ReviewDialog />
            {GOOGLE_REVIEWS_URL && (
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="link">
                Read our reviews on Google
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
