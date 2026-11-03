// Client reviews shown on the site, besides the ones published in the BMS.
// Reviews sent through the "Leave a review" form are saved in the BMS
// (Clients ▸ Website reviews), where the office publishes them; they then
// appear on the site within 10 minutes (src/lib/reviews.js). Entries here with
// status "approved" always show, e.g. reviews collected some other way.
//
// Add ONLY real reviews from real clients, with their permission.
// Example:
// { id: 1, rating: 5, name: "Jane W.", location: "Kisumu", comment: "...", status: "approved" },
export const REVIEWS = [];
