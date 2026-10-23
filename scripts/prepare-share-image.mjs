// Builds public/images/og/share.jpg: the crew photo (scripts/share-source.jpg) cropped to 1200x630, with the phone number and the two award badges added.
// Run `npm run prepare:share`. The output is committed, so CI needs no browser.
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { business } from '../content/business.mjs';

const url = (p) => pathToFileURL(path.join(process.cwd(), p)).href;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'Barlow Condensed';font-weight:700;src:url(${url('public/fonts/2a84ba04cd81.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:url(${url('scripts/share-source.jpg')}) 50% 14%/cover no-repeat}
.phone{position:absolute;left:50%;top:26px;transform:translateX(-50%);padding:10px 34px 8px;background:#751c28;border:3px solid #e1c797;border-radius:10px;color:#fffefa;font:700 64px/1 'Barlow Condensed';letter-spacing:.03em;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.35)}
.badge{position:absolute;bottom:34px;width:170px;height:170px;filter:drop-shadow(0 5px 10px rgba(0,0,0,.4))}
</style>
<div class="phone">${business.phone}</div>
<img class="badge" style="left:790px" src="${url('scripts/share-badges/best-of-lodi.svg')}">
<img class="badge" style="left:1000px" src="${url('scripts/share-badges/yelp.svg')}">
<script>document.fonts.ready.then(()=>Promise.all([...document.images].map(i=>i.decode()))).then(()=>document.body.dataset.ready=1)</script>`;

const browser = await chromium.launch({ channel: 'chrome' });
const tmp = path.join(os.tmpdir(), 'pp-share.html');
await writeFile(tmp, html);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href);
await page.waitForSelector('body[data-ready]');
const png = await page.screenshot({ type: 'png' });
await browser.close();
await sharp(png).jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile('public/images/og/share.jpg');
console.log('share image');
