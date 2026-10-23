// Cuts the favicon set from scripts/favicon-source.png and writes the web manifest.
// The share image (public/images/og/share.jpg) is a fixed photo, so nothing is rendered for it.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { business } from '../content/business.mjs';

// The favicon is the white italic P on the wine tile, kept as artwork (scripts/favicon-source.png) rather than redrawn.
const big = await readFile('scripts/favicon-source.png');
await mkdir('public/images/icons', { recursive: true });
const png = (size) => sharp(big).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();
await writeFile('public/images/favicon.png', await png(512));
for (const size of [192, 512]) await writeFile(`public/images/icons/icon-${size}.png`, await png(size));
await writeFile('public/images/icons/apple-touch-icon.png', await png(180));
// A .ico holding 16, 32, and 48px PNGs, for browsers that request /favicon.ico directly.
const sizes = [16, 32, 48], pngs = await Promise.all(sizes.map(png));
const head = Buffer.alloc(6 + 16 * sizes.length); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, i) => { const o = 6 + 16 * i; head[o] = s; head[o + 1] = s; head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6); head.writeUInt32LE(pngs[i].length, o + 8); head.writeUInt32LE(offset, o + 12); offset += pngs[i].length; });
await writeFile('public/favicon.ico', Buffer.concat([head, ...pngs]));
await writeFile('public/site.webmanifest', JSON.stringify({
  name: business.name, short_name: 'Phil & Paul’s', description: 'Licensed plumbers serving Lodi, Stockton, Galt, and nearby since 1996.',
  start_url: './', scope: './', display: 'browser', background_color: '#f5f2ea', theme_color: '#751c28',
  // Relative paths keep the manifest working under the GitHub Pages base path.
  icons: [{ src: 'images/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: 'images/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
}, null, 2) + '\n');
console.log('favicon set');
