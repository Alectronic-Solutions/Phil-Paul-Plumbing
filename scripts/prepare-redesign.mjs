import { writeFile } from 'node:fs/promises';
import { pages, business } from '../content/business.mjs';
const indexable = process.env.SITE_INDEXABLE === 'true';
const urls = pages.map(p => `<url><loc>${business.url}${p.route}</loc></url>`).join('\n');
await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile('public/robots.txt', indexable
  ? `User-agent: *\nDisallow: /api/\n\nSitemap: ${business.url}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');
// Cloudflare Pages applies every block whose path matches. scripts/finalize-headers.mjs adds the Content-Security-Policy
// after the build, once the inline scripts it has to allow are known.
await writeFile('public/_headers', [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  // No includeSubDomains: other subdomains of the business's domain may not serve HTTPS.
  '  Strict-Transport-Security: max-age=31536000',
  '  Cross-Origin-Opener-Policy: same-origin',
  '  X-Frame-Options: DENY',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()',
  ...(indexable ? [] : ['  X-Robots-Tag: noindex, nofollow']),
  // Build output and fonts have content-based names, so a changed file always gets a new URL.
  '/_next/static/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/fonts/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  // Photos keep their names when regenerated, so they are cached for a week and refreshed in the background.
  '/images/*',
  '  Cache-Control: public, max-age=604800, stale-while-revalidate=86400',
  '',
].join('\n'));
console.log(`Prepared sitemap for ${pages.length} pages. Search indexing ${indexable ? 'ENABLED' : 'blocked (preview)'}.`);
