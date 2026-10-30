# Email for quote requests and reviews

## How it works now

Both forms post to our own Vercel Functions:

- `api/contact.js` → quote requests
- `api/review.js` → reviews (sent as "awaiting approval")

They email the office through **Resend**, with the API key kept on the server. They also check a hidden honeypot field, limit each visitor to 5 messages per 10 minutes, and can require a Cloudflare Turnstile check.

If sending fails, three things happen in order:

1. Until `RESEND_API_KEY` exists, the functions answer "not configured" (and log `RESEND_API_KEY missing: quote not emailed` in Vercel → Logs).
2. The browser then tries EmailJS, if `REACT_APP_SERVICE_ID`, `REACT_APP_TEMPLATE_ID` and `REACT_APP_PUBLIC_KEY` (optional `REACT_APP_REVIEW_TEMPLATE_ID`) are set in Vercel. Because these are `REACT_APP_*` values, they are baked in at build time: redeploy after changing them.
3. If that also fails, the visitor sees **"Send this on WhatsApp instead"** with everything they typed already filled in, plus a Call button. No request is lost, but it arrives on WhatsApp, not by email.

As of the 2026-10-30 audit both forms ended at step 3: Resend was never set up, and the EmailJS fallback didn't send either.

## Check your setup in one click

Open https://www.spearsresiliencesystems.com/api/health. It shows `true`/`false` for each part (never the values):

```json
{ "resend": true, "contactTo": true, "contactFrom": true, "emailjsFallback": false,
  "turnstile": false, "confirmationEmails": false, "bms": false }
```

`resend`, `contactTo` and `contactFrom` must be `true` for email to work.

## Why Resend

| | Resend (recommended) | EmailJS (current) | Brevo | Web3Forms / Formspree |
| --- | --- | --- | --- | --- |
| Free allowance | 3,000 emails/month, 100/day | 200 requests/month | about 300/day | small monthly caps |
| Keys | server only | in the browser bundle | server only | public form key |
| Sends from your domain | yes | via your Gmail | yes | no |
| Code needed | the two functions in this repo | none | similar function | none |

A local security firm gets far fewer than 100 enquiries a day, so the free plan is enough.

## Setup (about 20 minutes)

1. Create a free account at https://resend.com.
2. **Domains → Add domain** → `spearsresiliencesystems.com`. Resend shows 3 or 4 DNS records (SPF `TXT`, DKIM `TXT`/`CNAME`, and an `MX` for the `send` subdomain). Add them at the registrar where you bought the domain, then press **Verify**.
3. Also add a DMARC record so Gmail trusts the mail:
   `TXT  _dmarc  v=DMARC1; p=none; rua=mailto:<the company inbox>`
4. **API Keys → Create** (permission "Sending access", domain `spearsresiliencesystems.com`). Copy the key.
5. Vercel → project → **Settings → Environment Variables** (Production and Preview):
   | Name | Value |
   | --- | --- |
   | `RESEND_API_KEY` | the key from step 4 |
   | `CONTACT_TO` | the company inbox (**confirm the spelling, see below**) |
   | `CONTACT_FROM` | `Spears Website <website@spearsresiliencesystems.com>` |

   Use exactly these names (not `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`).
6. Redeploy (Deployments → ⋯ on the latest → Redeploy). Environment variables only apply to new deployments.

## Test it end to end

1. Open `/api/health` and check `resend`, `contactTo` and `contactFrom` are `true`.
2. On your phone, open the site, tap a service's **Get a quote**, and send a request with a real Kenyan number (e.g. `0712 345 678`) and your own email.
3. Check the company inbox (and spam the first time; mark it "Not spam"). The phone should read `+254712345678`, and Reply should go to the email you typed.
4. Send a review from **Leave a review** and check it arrives marked "awaiting approval".
5. Check Vercel → Logs shows no `RESEND_API_KEY missing` or `Resend 4xx` errors.

## Optional: confirmation email to the visitor

Set `SEND_CONFIRMATION` to `true` in Vercel to also send visitors who gave an email a short "we've got your request, we'll call you on +254…" note. Only turn it on after the domain is verified (step 2), otherwise Resend refuses it. The callback time comes from `CALLBACK_PROMISE` in `api/_lib/mail.js` and `src/siteConfig.js`; keep both the same.

Replies: each email's **Reply-To** is the visitor's email when they gave one, so pressing Reply in Gmail answers them directly. Subjects read like `New quote request: CCTV Surveillance · Kisumu · Jane W.` and `New review (5★) from Jane W., awaiting approval`.

Note: without a verified domain Resend can only deliver to the email address you signed up to Resend with, so do step 2 before going live.

## Optional: Cloudflare Turnstile (invisible spam check)

1. https://dash.cloudflare.com → Turnstile → Add site → `www.spearsresiliencesystems.com`, widget mode "Managed".
2. In Vercel add `REACT_APP_TURNSTILE_SITE_KEY` (site key) and `TURNSTILE_SECRET_KEY` (secret key), then redeploy.
Add it if spam starts arriving; the honeypot and rate limit handle most bots.

## Publishing a review

Reviews arrive by email. To publish one, add it to `src/reviewsData.js`:

```js
{ id: 1, rating: 5, name: "Jane W.", location: "Kisumu", comment: "…", status: "approved" },
```

Publish only real reviews from real clients, with their permission, using first name and initial.

## The company email address

The company inbox is `spearsresiliencesystem@gmail.com` (confirmed by the owner). It is used in `EMAIL` in `src/siteConfig.js`, `"email"` in `public/index.html`, `public/privacy.html` and `DEFAULT_TO` in `api/_lib/mail.js`. Set `CONTACT_TO` in Vercel to the same address. If you keep the EmailJS fallback, also check that the EmailJS email service and template send to this inbox.
