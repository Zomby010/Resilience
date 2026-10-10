# Spears Resilience Systems website

Public website for Spears Resilience Systems, a registered security company in Kisumu, Kenya: https://www.spearsresiliencesystems.com

Single-page React app (Create React App) deployed on Vercel, with two Vercel Functions for email.

## Run it

```bash
npm install
npm start          # http://localhost:3000
npm test           # tests
npm run build      # production build in build/
```

On `npm start` there are no `/api` functions, so the forms use the EmailJS fallback if `REACT_APP_*` keys are in a local `.env`.

## Where things are

| What | Where |
| --- | --- |
| Phone, email, address, stats, services, social links | `src/siteConfig.js` |
| Page sections | `src/components/` (Header, Hero, Services, HowWeWork, Proof, About, Contact, SiteFooter) |
| Styles | `src/styles.css` |
| Gallery photos and their descriptions | `public/images/`, `src/galleryData.js` (originals in `assets/original-photos/`) |
| Published reviews | `src/reviewsData.js` |
| Email functions | `api/contact.js`, `api/review.js`, `api/_lib/mail.js` |
| Icons, share image, search data | `public/` (`index.html` holds the meta tags and structured data) |
| Redirects and headers | `vercel.json` |

## Guides

- `docs/AUDIT.md`: what was wrong and what changed
- `docs/SEARCH-SETUP.md`: logo in Google, site name, Search Console, removing vercel.app
- `docs/EMAIL-SETUP.md`: Resend setup, DNS records, environment variables

## Environment variables (Vercel)

| Name | Purpose |
| --- | --- |
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | Email through Resend (server side) |
| `TURNSTILE_SECRET_KEY`, `REACT_APP_TURNSTILE_SITE_KEY` | Optional spam check |
| `REACT_APP_SERVICE_ID`, `REACT_APP_TEMPLATE_ID`, `REACT_APP_PUBLIC_KEY`, `REACT_APP_REVIEW_TEMPLATE_ID` | EmailJS fallback |
| `REACT_APP_GOOGLE_REVIEWS_URL` | Optional link to Google reviews |
| `REACT_APP_STAFF_LOGIN_URL` | Optional footer link to the Resilience BMS |
