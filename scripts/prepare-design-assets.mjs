import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { photoWidths } from '../lib/photos.mjs';

const photos = JSON.parse(await readFile('reference/photo-inventory.json', 'utf8'));
const choices = { team: 2, technician: 14, crew: 24, truck: 19, fleet: 32, drain: 16, roots: 13, sewer: 22, camera: 8, waterHeater: 56, heaterInstall: 52, commercial: 36, commercialHeaters: 38, repair: 30, filtration: 60, jeff: 50, gas: 15, field: 27, pipe: 7 };
// Every photo ships as AVIF (served first) with a WebP fallback, at the widths listed in lib/photos.mjs.
// Sources top out near 1080px, so the largest variant is never upscaled.
await mkdir('public/images', { recursive: true });
for (const [name, index] of Object.entries(choices)) {
  let input = 'public' + photos[index].local;
  try { await access(input); } catch { input = 'reference/published-assets/' + path.basename(photos[index].local); }
  for (const width of photoWidths) {
    const resized = () => sharp(input).resize({ width, withoutEnlargement: true });
    await resized().avif({ quality: 50, effort: 5 }).toFile(`public/images/${name}-${width}.avif`);
    await resized().webp({ quality: 72, effort: 6, smartSubsample: true }).toFile(`public/images/${name}-${width}.webp`);
  }
}
if (process.argv.includes('--photos-only')) process.exit(0);

// A full desktop Chrome user agent makes Google serve WOFF2, split into unicode-range subsets, so browsers download only the latin files.
// pages/_document.jsx inlines the resulting CSS and preloads the latin files for the heading and body faces.
const fontUrl = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap';
const response = await fetch(fontUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' } });
if (!response.ok) throw new Error('Could not download design fonts');
let css = await response.text();
await mkdir('public/fonts', { recursive: true });
const urls = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]))];
for (const url of urls) {
  const font = await fetch(url);
  if (!font.ok) throw new Error('Could not download font file');
  const bytes = Buffer.from(await font.arrayBuffer());
  const extension = bytes.subarray(0, 4).toString() === 'wOF2' ? 'woff2' : 'ttf';
  const filename = createHash('sha256').update(url).digest('hex').slice(0, 12) + `.${extension}`;
  await writeFile(`public/fonts/${filename}`, bytes);
  css = css.replaceAll(url, filename);
}
await writeFile('public/fonts/design.css', css);
console.log(`Prepared ${Object.keys(choices).length} authentic photos, responsive variants, and ${urls.length} local fonts.`);
