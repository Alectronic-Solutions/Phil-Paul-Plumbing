# Phil & Paul's Plumbing

A 21-page website redesign built with Next.js and React. The design uses the company's burgundy, real crew and job photography, warm neutral backgrounds, and locally hosted Barlow Condensed and DM Sans fonts. Customer-facing copy contains no em dashes.

## Run locally

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For the production build:

```powershell
npm run build
npm run verify
npm run test:forms
npm run preview
```

`preview` serves the static output in `out/`. It deliberately returns an unavailable message for service requests. Real delivery runs through the included Cloudflare Pages Function after its destination is configured. No real request is sent during automated tests.

## What is included

- A redesigned homepage with the actual crew, direct phone and request links, service photography, a scrolling Google review rail, process, coverage area, and FAQs.
- Nine service pages: water heaters, drain cleaning, plumbing repairs, sewer repair, commercial plumbing, water treatment, hydro-jetting, camera inspections, and gas lines.
- About, contact, service-area, customer-review, and service-request pages, plus Stockton, Galt, Acampo, Woodbridge, and Lockeford pages.
- All eleven original routes retained, plus ten new pages and a branded 404 page.
- Premium dropdown menus for services, service areas, and company information; mobile accordion navigation and persistent phone/request actions.
- A shorter service-request form with four information fields: name, phone, city or ZIP, and service. Email and details are optional. Contact consent is required.
- Clear submission errors, a sending state, a success state after accepted delivery, and a reminder that a request does not confirm an appointment.
- Keyboard focus styles, native FAQ disclosures, a skip link, labeled form fields, reduced-motion support, and responsive photo variants.
- Unique metadata, canonical URLs, social metadata, Plumber/Service structured data, and a generated sitemap.

The live Webflow site was not edited. The redesigned site does not load Webflow, jQuery, Adobe Fonts, Mapbox, Podium, accessiBe, Meta Pixel, or Google Tag Manager. There are no invented projects, awards, response guarantees, prices, discounts, or testimonials. The business claims come from the existing site and supplied brief. Five review excerpts, their real profile images, attribution links, and the current 4.8 rating / 119 review count were verified on Google Maps on October 18, 2026. Source references are saved in reference/google-review-sources.json. No stock faces or initial-only reviewer avatars are used.

## Editing

| File | Purpose |
| --- | --- |
| `content/business.mjs` | Business details, services, FAQs, review excerpts, city content, page definitions |
| `components/Site.jsx` | Shared components and page layouts |
| `components/Navigation.jsx` | Desktop dropdowns and mobile accordion navigation |
| `components/Reviews.jsx` | Accessible auto-scrolling review rail and controls |
| `components/Icon.jsx` | Shared SVG icons |
| `styles/site.css` | Base design tokens and layouts |
| `styles/premium.css` | Readable typography, premium navigation, review rail, and mobile refinements |
| `pages/[[...slug]].jsx` | Static route generation and search metadata |
| `pages/_document.jsx` | Local font loading and favicon |
| `public/images/` | Selected business photos and responsive variants |
| `public/fonts/` | Local fonts and original font licenses |
| `functions/api/[[route]].js` | Validated server-side delivery |

`scripts/prepare-design-assets.mjs` can regenerate photo variants from the archived assets and fetch the open-source fonts. Normal builds do not require external asset downloads.

The original HTML and downloaded assets remain in `reference/original/` and `reference/published-assets/`. Earlier migration notes are preserved in `reference/MIGRATION-NOTES.md`. The unused `content/pages/` and `content/site.json` files are from that earlier migration, not the current rendering source. Historical screenshot comparisons in `artifacts/` describe the earlier exact-copy version. They do not validate the new design.

## Checks

`npm run verify` checks all twenty-one pages, original URL coverage, local assets, internal links, page metadata, structured data, basic landmarks, image descriptions, form labels, optional email behavior, and the copy restrictions. `npm run test:forms` covers validation, consent, invalid origins, spam-trap submissions, optional fields, missing configuration, accepted delivery, and failed delivery using mocked network responses.

The main copy and button color pairs were checked numerically for contrast. Browser checks covered all 21 pages at 320, 390, 768, 1024, 1440, and 1920 pixels: 126 combinations with no document overflow, clipped main headings/paragraphs, broken loaded images, or primary paragraphs smaller than 16 pixels. Mobile navigation, dropdown dismissal and focus return, service-page navigation, review controls, and automatic horizontal movement were checked in the browser. Screenshots and detailed results are in artifacts/. These checks do not establish full WCAG conformance.

## Cloudflare Pages

Use repository root as the project root, build command `npm run build`, and output directory `out`. Keep the `functions/` directory at the repository root so Pages builds the API routes. `_routes.json` limits Functions to `/api/*`. Uploading static files alone does not install the Function.

Set runtime secrets in Cloudflare Pages:

- `DELIVERY_WEBHOOK_URL`: HTTPS destination for service requests.
- `DELIVERY_WEBHOOK_SECRET`: optional bearer token for that destination.
- `SUBSCRIBE_WEBHOOK_URL`: reserved for the existing subscription endpoint; the redesigned site does not solicit newsletter signups.

The delivery payload is `{ type, submittedAt, fields }`. Booking fields are `Name`, `Phone`, `City`, `Service-Needed`, `Opt-In`, plus optional `Email` and `Details`. A 2xx destination response is required before success is returned. The handler validates input, limits accepted fields, rejects other browser origins, checks a spam trap, and uses a delivery timeout. Add account-level bot protection or rate limiting when configuring production.

## Before launch

1. Connect and test the real service-request destination with Jeff's team.
2. Confirm service coverage, hours, current review rating, warranty scope, and the final wording with Jeff. No 24-hour or same-day guarantee is promised.
3. Confirm the company's use of the photos and final branding. Review excerpts retain their original attribution.
4. Review the finished site on representative real phones and browsers. The included viewport checks have passed.
5. Add client-owned analytics and consent handling if marketing tracking will be used. Call-button clicks should not be reported as answered calls or booked jobs.
6. Remove the preview indexing blocks from `public/robots.txt` and the `X-Robots-Tag` line in `public/_headers` when replacing production. Keep the other headers. Canonical URLs currently use the existing production domain.
7. Review existing Search Console URLs and preserve any redirects needed beyond the original eleven captured routes.

No deployment, account changes, or DNS changes have been made.

## Review rail and navigation

The review rail scrolls automatically only while on screen. Hovering or focusing pauses movement. Swipe, keyboard arrows, and previous/next buttons allow manual navigation. A pause/play control is provided. Reduced-motion preferences disable automatic movement. Duplicated cards used for the seamless loop are hidden from assistive technology and their links are excluded from keyboard navigation. Profile images are the actual public Google images, displayed with gently rounded square corners.

Dropdowns support click, keyboard activation, Arrow Down to enter links, Escape to dismiss, and outside-click dismissal. On narrow screens they become accordion panels in a scrollable menu. Decorative section-title dashes have been removed.

The live Google listing currently shows a different phone number, (209) 366-2621, from the site number, (209) 366-2319. Confirm with Jeff whether the Maps number is intentional call tracking before changing it. The Maps booking URL uses /book-service, so a 301 alias to /book-plumbing-services/ is included in public/_redirects and the local preview server. No Google listing changes have been made.
