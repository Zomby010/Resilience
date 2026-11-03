import { useEffect, useState } from "react";

import { REVIEWS } from "../reviewsData";

// Approved reviews: the ones bundled in src/reviewsData.js, then the ones the
// office published in the BMS (loaded once per page from /api/reviews).

const BUNDLED = REVIEWS.filter((r) => r.status === "approved");

let request = null;
const loadPublished = () => {
  if (!request) {
    request = (typeof fetch === "function" ? fetch("/api/reviews") : Promise.reject(new Error("no fetch")))
      .then((res) => (res && res.ok ? res.json() : { reviews: [] }))
      .then((data) => (Array.isArray(data && data.reviews) ? data.reviews : []))
      .catch(() => []);
  }
  return request;
};

// For tests: forget the loaded reviews.
export const resetReviewsCache = () => {
  request = null;
};

export const useReviews = () => {
  const [reviews, setReviews] = useState(BUNDLED);
  useEffect(() => {
    let live = true;
    loadPublished().then((published) => {
      if (!live || !published.length) return;
      const known = new Set(BUNDLED.map((r) => String(r.id)));
      setReviews([...BUNDLED, ...published.filter((r) => !known.has(String(r.id)))]);
    });
    return () => {
      live = false;
    };
  }, []);
  return reviews;
};
