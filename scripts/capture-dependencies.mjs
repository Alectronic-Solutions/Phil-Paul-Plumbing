import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile('reference/capture.json', 'utf8'));
async function save(url, filename) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(`public/assets/${filename}`, bytes);
  manifest.assets.push({ url, local: `/assets/${filename}`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  return bytes.toString('utf8');
}

const chunks = new Map();
for (const item of manifest.assets.filter((a) => a.local.endsWith('.js') && !a.local.includes('jquery'))) {
  const js = await readFile(`public${item.local}`, 'utf8');
  const map = js.match(/r\.u=e=>"([^"]+)"\+\(\{(.*?)\}\)\[e\]\+"\.js"/);
  if (!map) continue;
  for (const [, , hash] of map[2].matchAll(/(\d+):"([a-f0-9]+)"/g)) {
    const filename = `${map[1]}${hash}.js`;
    chunks.set(filename, new URL(filename, item.url).href);
  }
}
await Promise.all([...chunks].map(([filename, url]) => save(url, filename)));

const googleFonts = 'https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic%7CInter:700%7CDM+Sans:400,500&display=swap';
const response = await fetch(googleFonts, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36' } });
if (!response.ok) throw new Error(`Google Fonts: ${response.status}`);
let css = await response.text();
const fonts = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]))];
for (const url of fonts) {
  const filename = `${createHash('sha256').update(url).digest('hex').slice(0, 10)}-${new URL(url).pathname.split('/').pop()}`;
  await save(url, filename);
  css = css.replaceAll(url, `/assets/${filename}`);
}
await writeFile('public/assets/google-fonts.css', css);
await writeFile('reference/capture.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Saved ${chunks.size} interaction chunks and ${fonts.length} Google font files.`);
