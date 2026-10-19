# Phil & Paul's Plumbing — Next.js migration

Local migration of the eleven pages published at https://www.philpaulplumbing.com, captured October 18, 2026. The goal is to preserve the existing design while moving hosting and form handling into your control.

## Run

Requires Node.js 20.9 or newer.

```powershell
npm ci
npm run dev
```

For the production export and its local preview:

```powershell
npm run build
npm run verify
npm run test:forms
npm run preview
```

Open http://127.0.0.1:3000. `npm run preview` serves `out/`. Both the static preview and Next development server leave real form delivery disconnected; the static preview returns a deliberate 503 message for API calls. The actual handlers are Cloudflare Pages Functions under `functions/`.

## What was migrated

- All eleven sitemap pages, preserving their routes, visible copy, original markup, inline styles, responsive layouts, page identities, title/description, canonical URLs, and JSON-LD.
- Original images, icons, shared CSS, jQuery, interaction bundles and their fifteen code chunks are served locally from `public/assets/`.
- Open Sans, Inter and DM Sans are served locally. Marydale still uses the existing Adobe Fonts stylesheet.
- Webflow menus, dropdowns and other visual interactions use the original local runtime. This is a faithful markup migration inside Next.js, not a rewrite of every section into independent React components. Raw internal anchors intentionally use full document navigation so the correct per-page interaction bundle initializes.
- Booking and subscription forms now POST to your own `/api/book-service` and `/api/subscribe` routes. No form submits to Webflow. Failures are shown accurately; success requires a successful delivery response.
- Broken commercial-service, legal-footer, and booking-phone link destinations were repaired without changing their appearance.

## Where to edit

| Path | Purpose |
| --- | --- |
| `content/pages/*.html` | Editable page body markup |
| `content/site.json` | Per-page metadata, structured data and asset declarations |
| `pages/[[...slug]].jsx` | Next.js static page rendering |
| `pages/_document.jsx` | Original styles, fonts and local interaction scripts |
| `public/migration-runtime.js` | Form submission behavior |
| `functions/api/[[route]].js` | Cloudflare delivery handlers |
| `reference/original/` | Untouched source snapshots for comparison |
| `reference/capture.json` | Original asset URLs, local paths, source byte sizes and hashes |

Edit `content/` directly for ongoing changes. `npm run capture` re-downloads the original public site and regenerates this content, overwriting those edits. `npm run prepare:content` regenerates from the saved snapshots only. Neither operation is required for normal builds. CSS source hashes in the capture manifest describe downloaded originals, before local dependency URL rewriting.

## Verification

`npm run verify` checks all eleven exported routes, metadata, JSON-LD, page identities, local asset references, internal links and form endpoints. `npm run test:forms` tests validation, origin handling, missing configuration, failed delivery and successful delivery using mocks. It never sends a real request to a delivery service.

Browser checks compared 492 headings, paragraphs and images across all eleven pages against the live original at the desktop viewport. Text and offset positions/dimensions matched for all checked elements. The homepage screenshot comparison found zero differences in the compared desktop and mobile content regions. The bottom 100 pixels and rightmost 16 pixels were excluded to omit original widgets and the scrollbar. These are bounded checks, not a guarantee of whole-site identity in every browser or every interaction state.

Saved screenshots and comparison data are in the ignored `artifacts/` folder. `npm run check:visual` recomputes the comparison from those saved captures; it does not recapture the browser. The form failure state and desktop navigation were also checked in the local browser.

## Cloudflare Pages deployment

This project uses [Next.js static export](https://nextjs.org/docs/pages/guides/static-exports), supported by [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/). No Next.js server adapter is required.

Use build command `npm run build`, output directory `out`, and repository root as the project root. Keep `functions/` at the repository root so Cloudflare builds the form handlers. `_routes.json` limits Functions to `/api/*`. A static drag-and-drop upload of `out/` alone does not install the Functions.

Set these runtime secrets in the Cloudflare Pages dashboard:

- `DELIVERY_WEBHOOK_URL`: HTTPS endpoint for booking requests.
- `SUBSCRIBE_WEBHOOK_URL`: HTTPS endpoint for subscription requests.
- `DELIVERY_WEBHOOK_SECRET`: optional bearer token sent to either destination.

The handlers send `{ type, submittedAt, fields }` as JSON. Destinations must confirm acceptance with a 2xx HTTP response. Connect these to the chosen CRM or email workflow; no delivery destination was available during this migration.

The preview is deliberately excluded from indexing (robots meta tag, `robots.txt` and the `X-Robots-Tag` header). At launch, set the build environment variable `SITE_INDEXABLE=true` on the production Cloudflare Pages project only. The build then drops all three blocks and adds the sitemap to `robots.txt`; `npm run verify` checks that they agree. Leave it unset everywhere else, including GitHub Pages. URLs have no trailing slash, to match the original site's indexed URLs. Canonical and structured-data URLs currently point to the existing production domain. No deployment, DNS changes or account transfers have been performed.

## Remaining account connections

| Connection | Current state / handoff needed |
| --- | --- |
| Webflow | Core rendering, assets and forms no longer require Webflow hosting. Its downloaded interaction runtime remains locally. |
| Booking / newsletter | UI and Cloudflare handler ready; real delivery destination still needed. |
| Adobe Fonts | Existing `ytx3glg` kit retained as a hosted stylesheet; arrange a client-owned kit/license before changing domains or retiring the agency account. Adobe font binaries were not copied locally. |
| Mapbox | Contact-page map still embeds the original JKMG Mapbox style and public token; move to a client-owned map account or replace the embed. |
| Termly / Podium / accessiBe | Existing client integrations are off by default. Set build-time `ENABLE_CLIENT_WIDGETS=true` only after confirming these accounts and domain settings. This restores their original external scripts and UI. Consent preferences depend on Termly being enabled. |
| Google Tag Manager / Meta Pixel | Original IDs are archived in the snapshots. Tracking is omitted from the migration until client-owned access and consent behavior are confirmed. |
| Footer agency credit | Original JKMG mark/link is retained to preserve appearance; change it when the handoff terms are settled. |

An exact production handoff includes these account connections as well as visual fidelity. The working local migration is ready for review; real form delivery and third-party account handoff remain outstanding.
