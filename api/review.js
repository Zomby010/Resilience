// POST /api/review: a client review from the "Leave a review" form. It is saved
// in the BMS (Clients ▸ Website reviews), where the office publishes it or keeps
// it off the site, and emailed to the office when Resend is set up.
const { handle, clean, isEmail } = require("./_lib/mail");
const { bmsConfigured, postToBms } = require("./_lib/bms");

const store = {
  enabled: bmsConfigured,
  save: (mail) => postToBms("/api/website/reviews/", mail.review),
};

module.exports = handle(
  (body) => {
    const rating = Number(body.rating);
    const name = clean(body.name, 100);
    const location = clean(body.location, 120);
    const email = clean(body.email, 200);
    const comment = clean(body.comment, 3000);

    if (!(rating >= 1 && rating <= 5)) return { error: "Choose a star rating." };
    if (name.length < 2) return { error: "Enter your name." };
    if (comment.length < 10) return { error: "Write at least a sentence." };
    if (email && !isEmail(email)) return { error: "Enter a valid email or leave it empty." };

    return {
      subject: `New review (${rating}★) from ${name}, awaiting approval`,
      replyTo: email || undefined,
      rows: [
        ["Rating", `${rating} / 5`],
        ["Name", name],
        ["Location", location],
        ["Email (not published)", email],
        ["Review", comment],
        [
          "To publish",
          bmsConfigured()
            ? "Open the BMS: Clients ▸ Website reviews, then Publish"
            : "Add it to src/reviewsData.js with status: \"approved\"",
        ],
      ],
      review: { rating, name, location, email, comment },
    };
  },
  "review",
  store
);
