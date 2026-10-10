# Website audit (October 2026)

Audit of https://www.spearsresiliencesystems.com as built from this repo before the redesign, ranked by impact on a visitor deciding whether to contact Spears. Each item lists what was wrong, why it matters, and what this branch does about it.

## Baseline vs. after

Lighthouse 12, mobile emulation (slow 4G, mid-range phone), local production build:

| | Before | After |
| --- | :-: | :-: |
| Performance | 71 | 91 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest Contentful Paint | 4.4 s | 2.7 s |
| Total Blocking Time | 320 ms | 0 ms |
| Page weight | 641 KiB | 243 KiB |
| JavaScript (gzip) | 122 kB | 73 kB |
| Page length on a 390 px phone | 12,938 px | 7,982 px |
| Page length on desktop (1440 px) | 9,283 px | 5,636 px |

Screenshots: `docs/screenshots/` (before/after, 390 px and 1440 px).

## Findings, ranked

### 1. Too many overlapping ways to contact us (high)
**Was:** at least seven entry points for one action: a six-button "Which service" picker that opened a name/email modal, then a WhatsApp-or-Email choice that scrolled to a *separate* form; a WhatsApp card; a Phone card; an "Email Us" card that only scrolled to the form; a "View Our Office" card that opened a modal just to show an address; the "Get in touch" form; a "Ready to secure your site?" block; plus the footer. Every extra choice is a chance to drop off (Hick's law, attention ratio).
**Now:** one contact section: a short quote form (name, phone, service, site location, optional email and message) beside four direct actions (Call, WhatsApp, Email, Office with a Google Maps link). Each service's "Get a quote" pre-selects that service in the same form. Removed: service picker modal, address modal, email card, final CTA block, `contactFormBridge.js`.

### 2. Placeholder reviews shown as real (high, trust and legal)
**Was:** `reviewsData.js` said "The entries below are PLACEHOLDERS" but marked them `approved`, displayed them and averaged them into a star rating. Invented testimonials break consumer-protection rules and Google's review policies and destroy trust if noticed.
**Now:** no reviews are shown until real approved ones are added. "Leave a review" is a small button that opens a dialog; an optional "Read our reviews on Google" link appears once `REACT_APP_GOOGLE_REVIEWS_URL` is set.

### 3. No logo anywhere visible, default React favicon (high, brand and search)
**Was:** `public/favicon.ico` was Create React App's default React icon (md5 `c92b85a5…`), so browser tabs showed a React atom and Google showed a generic globe. The logo appeared only as a faint watermark behind the hero. `logo.png` was 584 × 498 (not square) and the manifest only listed the `.ico`.
**Now:** a sticky header with the real logo; a full square icon set generated from the logo (`favicon.ico` 16/32/48, `icon-48/192/512.png`, maskable 512, `apple-touch-icon.png`, `logo-square.png` 512 for structured data); `og-image.jpg` 1200 × 630 share image. See `docs/SEARCH-SETUP.md`.

### 4. "Install app" pop-up on phones (high, annoyance)
**Was:** `manifest.json` had `"display": "standalone"`, which tells Chrome, Brave and Samsung Internet the site is an installable app.
**Now:** `"display": "browser"` (not installable) and a `beforeinstallprompt` listener in `src/index.js` that calls `preventDefault()`. No service worker is registered.

### 5. Site also served at spearsresiliencesystems.vercel.app (medium, SEO and brand)
**Was:** the default Vercel address served a full duplicate of the site.
**Now:** `vercel.json` sends every request on that host to `https://www.spearsresiliencesystems.com` with a permanent (308) redirect. Owner steps in `docs/SEARCH-SETUP.md`.

### 6. Hero did not say why to choose Spears (medium)
**Was:** company name as the headline, "Protecting What Matters", a scanline, radial glow, watermark and an infinite services ticker; the secondary button "See Our Reach" scrolled to three numbers.
**Now:** benefit headline ("Trained guards. GPS-verified on your site, day and night."), one-line subhead, primary "Get a free site assessment", secondary "WhatsApp us", one real photo of Spears guards, and a single trust row (296 sites · 40 of 47 counties · since 2022 · day and night guarding).

### 7. Our biggest differentiator was missing (medium)
**Was:** nothing about the Resilience BMS.
**Now:** "How we keep your site protected": GPS-verified guards and supervisors (on / near / off location, live map, the manager always has every guard's and supervisor's location), location-checked attendance, digital Occurrence Book (entries can never be edited or deleted) and digital incident reports. Claims were checked against the BMS code (e.g. phones send location every 30 s, the manager's map refreshes every 15 s). No Secretary or Manager details, no back-office modules, and no promise that clients see live locations.

### 8. Repetition and filler (medium)
**Was:** "296 sites / 40 counties" shown three times (hero, stats bar, overview badges); separate Mission and Vision cards; six full-width alternating service rows (very long on phones). Electric fencing was in the structured data but missing from the page.
**Now:** numbers shown once; About is two short paragraphs with the mission in one line; services are seven compact cards (electric fencing added).

### 9. Heavy, unoptimised images (medium, speed)
**Was:** originals shipped as-is (e.g. `image13.png` 865 KB, many 200 to 280 KB JPEGs, a file name with a space, an unrelated shopping image `example.png` in the folder). Stock photos (CCTV, fire extinguishers, alarm panel) mixed with real ones. Gallery alt text was generic ("photo 3 of 8").
**Now:** only real Spears photos, converted to WebP at 400 and 800 px with `srcset`, explicit dimensions, lazy loading and a preloaded hero; 6 photos shown, the rest behind "Show all 9 photos"; each photo has a real description. Originals kept in `assets/original-photos/` (not shipped).

### 10. Contact email set up in the browser (medium, reliability and spam)
**Was:** EmailJS from the browser, about 200 requests a month on the free plan, keys in the JavaScript bundle.
**Now:** `/api/contact` and `/api/review` Vercel Functions send through Resend with keys on the server, a honeypot, per-IP rate limit and optional Cloudflare Turnstile. Until Resend is configured they answer 503 and the site falls back to the existing EmailJS setup automatically, so nothing breaks in the meantime. See `docs/EMAIL-SETUP.md`.

### 11. Social icons linked to "#" (low)
**Now:** only networks with a real URL in `src/siteConfig.js` are shown (none until the owner supplies them).

### 12. Code hygiene (low)
**Was:** a 2,000-line stylesheet with "REDESIGN" leftovers, the `Reveal` animation helper copied into four files, `"use client"` (meaningless in CRA) in every file, the commented-out CSR section, a stray empty `git` file, and the only test still checked for "learn react" (it failed).
**Now:** one ~1,000-line stylesheet, one config module (`src/siteConfig.js`) for phone, email, address, stats and services, framer-motion and react-icons removed (no scroll animations; reduced-motion respected), and 9 tests covering the main flows.

### 13. Accessibility details (low)
Visible focus rings, 44 px minimum touch targets, 16 px body text, one `h1`, labelled form fields with inline errors, a real `<dialog>` for reviews, skip link kept. Lighthouse accessibility 100.

### 14. No privacy notice (low, compliance)
**Now:** `/privacy` (Kenya Data Protection Act 2019), linked under the form and in the footer. The owner should review the retention period.

## Decided against, for now

- **Moving off Create React App.** CRA is deprecated and installs now need `--legacy-peer-deps` for new packages. A move to Vite or Astro/Next with pre-rendering would let crawlers and WhatsApp previews read the full page without JavaScript and should bring LCP under 2.5 s. It changes the Vercel build settings, so it is better as its own PR. The head tags, structured data, favicon and share image are already static HTML, which is what search results need.
- **Embedded Google Map.** A link to Google Maps costs nothing; an embedded map adds about 500 KB to every visit.

## Research notes

What the best security and local-service landing pages do (KK Security / GardaWorld East Africa, Securitas, Allied Universal, ADT, Verisure, and conversion research such as Unbounce and Linear's landing-page studies):
- One goal per page; extra links lower conversion (1:1 attention ratio).
- Benefit-led headline; about 80% of visitors read the headline, about 20% read the rest.
- Short pages; under about 350 words convert best for most industries.
- Mobile first: 44 × 44 px targets, 16 px text, under 3 s load (each extra second costs up to about 7% of conversions).
- Trust signals beside the call to action: years, sites, coverage, registration, real reviews.
- Security firms lead with "free site assessment / risk assessment" rather than "contact us", and show their technology (monitoring, reporting) as proof of accountability.

Sources:
- https://lineardesign.com/blog/landing-page-design-best-practices/
- https://kksecurity.garda.com
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/structured-data/logo
- https://web.dev/learn/pwa/installation-prompt
- https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
