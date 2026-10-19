import { writeFile } from 'node:fs/promises';
import { pages } from '../content/business.mjs';
const urls = pages.map(p => `<url><loc>https://www.philpaulplumbing.com${p.route === '/' ? '/' : p.route}</loc></url>`).join('\n');
await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`Prepared sitemap for ${pages.length} pages.`);
