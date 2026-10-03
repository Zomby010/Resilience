/**
 * reviews.js — review data store
 * -----------------------------------------------------------------------
 * Only entries with status: "approved" are shown on the site. A review
 * submitted through the form is emailed to the Director(s) marked
 * PENDING; to publish it, add it here with status: "approved".
 * The entries below are PLACEHOLDERS — replace them with real client
 * reviews once approved.
 * -----------------------------------------------------------------------
 */
export const REVIEWS = [
  {
    id: 1,
    rating: 5,
    name: "James M.",
    location: "Nakuru County",
    comment:
      "Spears Resilience Systems transformed our site's security completely. Professional, fast, and reliable.",
    status: "approved",
  },
  {
    id: 2,
    rating: 4,
    name: "Amina W.",
    location: "Mombasa",
    comment:
      "Great service and a well-trained team. The guards were very knowledgeable. Would recommend.",
    status: "approved",
  },
  {
    id: 3,
    rating: 5,
    name: "Peter O.",
    location: "Kisumu",
    comment:
      "We've had zero incidents since they took over. Worth every shilling.",
    status: "approved",
  },
  {
    id: 4,
    rating: 4,
    name: "Grace N.",
    location: "Nairobi",
    comment:
      "Quick response time and honest pricing. Very happy with the outcome.",
    status: "approved",
  },
];
