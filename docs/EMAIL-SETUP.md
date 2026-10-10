# Email for quote requests and reviews

## How it works now

Both forms post to our own Vercel Functions:

- `api/contact.js` → quote requests
- `api/review.js` → reviews (sent as "awaiting approval")

They email the office through **Resend**, with the API key kept on the server. They also check a hidden honeypot field, limit each visitor to 5 messages per 10 minutes, and can require a Cloudflare Turnstile check.

**Nothing breaks before you set this up.** Until `RESEND_API_KEY` exists, the functions answer "not configured" and the site falls back to the EmailJS keys already in Vercel (`REACT_APP_SERVICE_ID`, `REACT_APP_TEMPLATE_ID`, `REACT_APP_PUBLIC_KEY`, optional `REACT_APP_REVIEW_TEMPLATE_ID`), the same way it sends today.

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
6. Redeploy. Send a test quote from the site and check the inbox (and the spam folder the first time; mark it "Not spam").

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

The site, structured data and fallback recipient use `spearsresiliencesystems@gmail.com`. The brief that started this work spelled it `spearsresiliencesystem@gmail.com` (no final "s"). Confirm which inbox is real, then make `EMAIL` in `src/siteConfig.js`, `"email"` in `public/index.html`, the address in `public/privacy.html`, `DEFAULT_TO` in `api/_lib/mail.js` and `CONTACT_TO` in Vercel all match.
