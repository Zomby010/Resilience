// POST /api/review: emails a client review to the office for approval.
// Approved reviews are published by adding them to src/reviewsData.js.
const { handle, clean, isEmail } = require("./_lib/mail");

module.exports = handle((body) => {
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
      ["To publish", "Add it to src/reviewsData.js with status: \"approved\""],
    ],
  };
});
