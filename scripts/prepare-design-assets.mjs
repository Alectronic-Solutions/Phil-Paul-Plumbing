import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const photos = JSON.parse(await readFile('reference/photo-inventory.json', 'utf8'));
const choices = { team: 2, technician: 14, crew: 24, truck: 19, fleet: 32, drain: 16, roots: 13, sewer: 22, camera: 8, waterHeater: 56, heaterInstall: 52, commercial: 36, commercialHeaters: 38, repair: 30, filtration: 60, jeff: 50, gas: 15, field: 27, pipe: 7 };
await mkdir('public/images', { recursive: true });
for (const [name, index] of Object.entries(choices)) {
  let input = 'public' + photos[index].local;
  try { await access(input); } catch { input = 'reference/published-assets/' + path.basename(photos[index].local); }
  await copyFile(input, `public/images/${name}.avif`);
  if (['team', 'truck', 'waterHeater', 'repair', 'filtration', 'drain', 'sewer', 'camera', 'gas', 'commercial'].includes(name)) {
    for (const width of [480, 960, 1440]) await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`public/images/${name}-${width}.webp`);
  }
}

const fontUrl = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap';
const response = await fetch(fontUrl, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36' } });
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
  css = css.replaceAll(url, `/fonts/${filename}`);
}
await writeFile('public/fonts/design.css', css);
console.log(`Prepared ${Object.keys(choices).length} authentic photos, responsive variants, and ${urls.length} local fonts.`);
