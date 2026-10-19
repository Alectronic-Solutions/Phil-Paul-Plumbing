import { writeFile } from 'node:fs/promises';
import { pages, business } from '../content/business.mjs';
const indexable = process.env.SITE_INDEXABLE === 'true';
const urls = pages.map(p => `<url><loc>${business.url}${p.route}</loc></url>`).join('\n');
await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile('public/robots.txt', indexable
  ? `User-agent: *\nDisallow: /api/\n\nSitemap: ${business.url}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');
await writeFile('public/_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${indexable ? '' : '  X-Robots-Tag: noindex, nofollow\n'}`);
console.log(`Prepared sitemap for ${pages.length} pages. Search indexing ${indexable ? 'ENABLED' : 'blocked (preview)'}.`);
