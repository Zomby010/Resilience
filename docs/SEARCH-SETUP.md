# Logo in Google, site name, and removing vercel.app

## Already done in code (this branch)

- **Square icons from the real logo**: `public/favicon.ico` (16/32/48), `icon-48.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` (180 × 180). They are linked in the static `<head>` of `public/index.html`, so Google sees them without running JavaScript.
- **Structured data** (`public/index.html`): a `WebSite` entry named "Spears Resilience Systems" (this is what Google uses for the site name above the result) and a `SecurityService` entry with `logo` pointing to `logo-square.png` (512 × 512, on white; Google needs at least 112 × 112).
- **Share image**: `og-image.jpg` (1200 × 630) for WhatsApp, Facebook, LinkedIn and X link previews.
- **No install pop-up**: `manifest.json` uses `"display": "browser"` and `src/index.js` cancels `beforeinstallprompt`.
- **vercel.app redirect**: `vercel.json` sends every request on `spearsresiliencesystems.vercel.app` to `https://www.spearsresiliencesystems.com` with a permanent (308) redirect. The canonical tag already points to the www address.
- `robots.txt` allows everything; `sitemap.xml` lists the home page and `/privacy`.

## What you need to click

### 1. Vercel (after this PR is merged and deployed)
1. Open https://spearsresiliencesystems.vercel.app on your phone. It should jump to `www.spearsresiliencesystems.com`.
2. Vercel → your project → **Settings → Domains**: check that `spearsresiliencesystems.com` shows **Redirect to www.spearsresiliencesystems.com** (Vercel recommends www as the main address). If not, press **Edit** on it and pick the www domain under "Redirect to".
3. Optional: **Settings → Deployment Protection** → turn on Vercel Authentication for preview deployments, so test builds (`…-git-branch-….vercel.app`) are not public.
4. Optional: **Analytics** tab → Enable Web Analytics. The site already loads it on the live domain and records quote, Call and WhatsApp taps.

### 2. Google Search Console (free)
1. Go to https://search.google.com/search-console and add a **Domain** property for `spearsresiliencesystems.com`. Verify it with the TXT record Google gives you, added at your domain registrar's DNS settings.
2. **Sitemaps** → submit `https://www.spearsresiliencesystems.com/sitemap.xml`.
3. **URL Inspection** → enter `https://www.spearsresiliencesystems.com/` → **Request indexing**. This asks Google to re-read the page and pick up the new icon and site name.
4. Wait. Google updates the icon and name when it recrawls, which usually takes a few days to a few weeks. It is not guaranteed, but meeting the requirements above is what makes it eligible.
5. Removing the vercel.app result: once the redirect is live, Google moves the old address over to the main one on its own. If you want it gone sooner, add a **URL prefix** property for `https://spearsresiliencesystems.vercel.app/`, verify it with the **HTML tag** method (send the tag to your developer to add to `public/index.html`), then use **Removals → New request** for that prefix.

### 3. Google Business Profile (free, the biggest win for local searches)
1. Go to https://business.google.com and create or claim "Spears Resilience Systems" at Technology Road, next to Kisumu Polytechnic.
2. Use the same name, phone (+254 702 915 154), website and logo as the site. Add opening hours, service areas (counties), categories ("Security guard service", "Security system supplier") and real photos.
3. Ask happy clients to review you there. Then copy the "Read reviews" link into Vercel as `REACT_APP_GOOGLE_REVIEWS_URL` and the site will link to it.

### 4. Your own browser's address bar
The vercel.app line in your browser's suggestions comes from your own browsing history, not from Google. Once the redirect is live it won't be added again. To remove it now, start typing the address, highlight the vercel.app suggestion with the arrow keys and press **Shift + Delete** (Shift + Fn + Delete on a Mac); on a phone, long-press it and choose Remove.

## Checking it worked
- https://search.google.com/test/rich-results with the home page URL: should list "Local business" / "Organization" with no errors.
- https://realfavicongenerator.net/favicon_checker: should show the Spears crest everywhere.
- Paste the site link into WhatsApp: the preview should show the new share image.
