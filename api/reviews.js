// GET /api/reviews: the reviews the office published in the BMS, for the
// website's Reviews section. Cached by Vercel for 10 minutes. Answers an empty
// list when the BMS isn't set up or can't be reached, so the page still shows
// the reviews bundled in src/reviewsData.js.
const { bmsConfigured, getFromBms } = require("./_lib/bms");

const clean = (r) => ({
  id: String(r.id),
  rating: Math.min(5, Math.max(1, Number(r.rating) || 0)),
  name: String(r.name || ""),
  location: String(r.location || ""),
  comment: String(r.comment || ""),
  status: "approved",
});

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }
  let reviews = [];
  if (bmsConfigured()) {
    try {
      const data = await getFromBms("/api/website/reviews/published/");
      reviews = (data.reviews || []).filter((r) => r && r.comment).map(clean);
      res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
    } catch (err) {
      console.error("Loading reviews from the BMS failed:", err);
      res.setHeader("Cache-Control", "public, s-maxage=60");
    }
  }
  return res.status(200).json({ reviews });
};
