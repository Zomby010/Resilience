# Plan: store website leads and reviews in the Resilience BMS

Status: **not built yet.** This PR could not reach the `Zomby010/Resilience_bms` repository, so reviews keep the current flow (emailed to the office, published by adding them to `src/reviewsData.js`). This is the design for a follow-up PR in both repos.

## Why the BMS and not a new backend

The BMS (Django, hosted on Vercel with a Neon Postgres database) already has users, logins, an admin and a database. Storing leads and reviews there means:

- no new server, database or hosting bill;
- reviews are approved by a signed-in staff member, never automatically;
- quote requests live next to the rest of operations, not only in an inbox.

The website keeps its Vercel Functions as the only public API. The browser never talks to the BMS directly.

```
visitor ──► /api/contact ──► Resend email to the office
                       └──► BMS  POST /api/website/leads/      (token)
visitor ──► /api/review  ──► Resend email to the office
                       └──► BMS  POST /api/website/reviews/    (token)
site    ──► /api/reviews ──► BMS  GET  /api/website/reviews/approved/  (cached 10 min)
                       └──► falls back to src/reviewsData.js
```

## BMS side (`Resilience_bms`)

Follow the repo's existing app layout, auth and test conventions; read its README first.

1. New app `website` with two models:
   - `WebsiteLead`: name, phone (`+254…`), email, service, location, message, created_at, `status` (new / contacted / won / lost), contacted_by, contacted_at.
   - `WebsiteReview`: rating (1–5), name, location, email (never published), comment, created_at, `approved` (default **False**), approved_by, approved_at.
2. Admin (or a page in the BMS UI for managers): list leads, mark contacted; list pending reviews, approve or reject.
3. Endpoints:
   - `POST /api/website/leads/` and `POST /api/website/reviews/`: require `Authorization: Bearer <WEBSITE_API_TOKEN>`, CSRF-exempt, validate input again.
   - `GET /api/website/reviews/approved/`: public, read-only, returns only approved reviews as `{ id, rating, name, location, comment, date }`, with the name shortened to first name + initial. No emails or phone numbers.
4. Settings: `WEBSITE_API_TOKEN` env var on the BMS Vercel project. Tests for auth, validation and that unapproved reviews never appear.

## Website side (this repo)

1. `api/_lib/bms.js`: `postToBms(path, data)` that does nothing unless `BMS_API_URL` and `BMS_API_TOKEN` are set, times out after ~4 s, and only logs failures.
2. `api/contact.js` / `api/review.js`: after the email is sent, call `postToBms`. A BMS failure must not fail the visitor's request.
3. `api/reviews.js` (`GET /api/reviews`): fetch approved reviews from the BMS with `Cache-Control: s-maxage=600, stale-while-revalidate`; fall back to the reviews in `src/reviewsData.js` (move them to a JSON file both the site and the function can read).
4. `Proof.jsx`: load reviews from `/api/reviews`, keeping the bundled ones as the first render. Never show placeholder reviews.
5. `/api/health` already reports `bms: true|false`.

## What the owner provides

- The BMS address (for example `https://app.spearsresiliencesystems.com`) as `BMS_API_URL` in the website's Vercel project.
- A long random token, set as `WEBSITE_API_TOKEN` on the BMS and `BMS_API_TOKEN` on the website.
