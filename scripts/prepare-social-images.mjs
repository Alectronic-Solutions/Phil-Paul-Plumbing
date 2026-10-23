// Renders the share cards (public/images/og/*.jpg) with the site's own fonts and palette, and cuts the favicon set from scripts/favicon-source.png.
// Run `npm run prepare:social` after changing copy, photos, or the rating. The output is committed, so CI needs no browser.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { business, services, cities } from '../content/business.mjs';

const root = process.cwd();
const url = (p) => pathToFileURL(path.join(root, p)).href;
const img = (name) => url(`public/images/${name}-1440.avif`);
const font = `
@font-face{font-family:'Barlow Condensed';font-weight:600;src:url(${url('public/fonts/808d8d26b491.woff2')}) format('woff2')}
@font-face{font-family:'Barlow Condensed';font-weight:700;src:url(${url('public/fonts/2a84ba04cd81.woff2')}) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:400 700;src:url(${url('public/fonts/713ca32c3c8b.woff2')}) format('woff2')}`;

const stars = Array.from({ length: 5 }, () => '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#e1c797" d="M12 2.2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.8l1.4-6.8L2.2 9.3l6.9-.8z"/></svg>').join('');

const cards = [
  { file: 'default', photo: 'team', pos: '50% 60%', left: 340, tight: true, eyebrow: 'Lodi, Stockton & Galt', lines: ['Your local plumber.'], gold: 'Since ’96.' },
  ...services.map(s => ({ file: s.slug, photo: s.image, pos: { waterHeater: '50% 40%', drain: '50% 50%', pipe: '55% 50%', sewer: '45% 40%', commercial: '50% 50%', roots: '40% 50%', camera: '50% 50%', 'gas-meter-install': '50% 30%', 'softener-install': '50% 50%' }[s.image] || '50% 50%', eyebrow: 'Plumbing services', lines: [s.title.replace(/ in Lodi, CA$/, '')], gold: 'Lodi, CA' })),
  ...cities.map(c => ({ file: c.slug, photo: c.image, pos: { 'stockton-downtown-aerial': '35% 50%', 'galt-water-tower': '18% 50%', 'acampo-vineyard-sunset': '50% 50%', 'woodbridge-welcome-sign': '40% 50%', 'lockeford-bratwurst-cow': '0% 30%' }[c.image] || '50% 50%', left: { 'woodbridge-welcome-sign': 320, 'lockeford-bratwurst-cow': 360, 'galt-water-tower': 380 }[c.image], eyebrow: 'Licensed local plumbers', lines: ['Plumber in'], gold: `${c.name}, CA` })),
];

const card = (c) => `<!doctype html><meta charset="utf-8"><style>${font}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:#54151e;font-family:'DM Sans',sans-serif;color:#fffefa}
.photo{position:absolute;inset:0 0 0 ${c.left||440}px;background:url(${img(c.photo)}) ${c.pos}/cover no-repeat}
.shade{position:absolute;inset:0;background:${c.tight?"linear-gradient(90deg,#54151e 0,#5d1721 30%,rgba(117,28,40,.9) 38%,rgba(117,28,40,.4) 46%,rgba(84,21,30,0) 58%)":"linear-gradient(90deg,#54151e 0,#5d1721 36%,rgba(117,28,40,.93) 50%,rgba(117,28,40,.55) 62%,rgba(84,21,30,.05) 80%)"},linear-gradient(0deg,rgba(40,9,14,.82),rgba(40,9,14,.35) 24%,transparent 42%)}
.top{position:absolute;left:68px;top:56px;display:flex;align-items:center;gap:16px}
.badge{width:56px;height:56px;background:#751c28;border:2px solid #b78b4d;display:grid;place-items:center;font:700 31px/1 'Barlow Condensed';letter-spacing:-.01em}
.name{font:700 25px/1.05 'Barlow Condensed';letter-spacing:.1em;text-transform:uppercase}.name small{display:block;margin-top:4px;font:600 13px/1 'DM Sans';letter-spacing:.2em;color:#e1c797}
.copy{position:absolute;left:68px;top:150px;width:600px;height:320px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font:700 15px/1 'DM Sans';letter-spacing:.2em;text-transform:uppercase;color:#e1c797;margin-bottom:22px;display:flex;gap:14px;align-items:center}.eyebrow:before{content:'';width:34px;height:3px;background:#b78b4d}
h1{font:600 92px/.96 'Barlow Condensed';letter-spacing:-.02em;text-transform:uppercase;text-wrap:balance}h1 span{display:block;color:#e1c797}
.foot{position:absolute;left:68px;right:68px;bottom:50px;display:flex;align-items:flex-end;justify-content:space-between;padding-top:22px;border-top:2px solid rgba(225,199,151,.55)}
.rate{display:flex;flex-direction:column;gap:9px}.stars{display:flex;gap:3px}.rate b{font:700 19px/1 'DM Sans'}.rate i{font:400 19px/1 'DM Sans';font-style:normal;color:#f1e6d2}
.call{text-align:right}.call small{display:block;font:600 13px/1 'DM Sans';letter-spacing:.2em;text-transform:uppercase;color:#e1c797;margin-bottom:6px}.call b{font:700 54px/.9 'Barlow Condensed';letter-spacing:.01em}
</style>
<div class="photo"></div><div class="shade"></div>
<div class="top"><div class="badge">P&amp;P</div><div class="name">Phil &amp; Paul’s Plumbing<small>Lodi, CA · Lic. ${business.license}</small></div></div>
<div class="copy"><div class="eyebrow">${c.eyebrow}</div><h1 id="h">${c.lines.join('<br>')}<span>${c.gold}</span></h1></div>
<div class="foot"><div class="rate"><div class="stars">${stars}</div><div><b>${business.rating.value} on Google</b> <i>· ${business.rating.count} reviews</i></div></div><div class="call"><small>Call us</small><b>${business.phone}</b></div></div>
<script>document.fonts.ready.then(()=>{const h=document.getElementById('h');let s=92;while((h.scrollHeight>300||[...h.querySelectorAll('*')].some(e=>e.scrollWidth>600))&&s>40){s-=2;h.style.fontSize=s+'px'}document.body.dataset.ready=1})</script>`;

const browser = await chromium.launch({ channel: 'chrome' });
const tmp = path.join(os.tmpdir(), 'pp-social.html');
async function render(html, w, h) {
  await writeFile(tmp, html);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(tmp).href);
  await page.waitForSelector('body[data-ready]');
  const png = await page.screenshot({ type: 'png' });
  await page.close();
  return png;
}

await mkdir('public/images/og', { recursive: true });
for (const c of cards) {
  const png = await render(card(c), 1200, 630);
  await sharp(png).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(`public/images/og/${c.file}.jpg`);
}
console.log(`${cards.length} share cards`);

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
await browser.close();
