import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const origin = 'https://www.philpaulplumbing.com';
const archive = path.resolve('reference/original');
await mkdir(archive, { recursive: true });
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap: HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
await writeFile('reference/sitemap.xml', sitemap);
await writeFile('public/sitemap.xml', sitemap);
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const manifest = { origin, capturedAt: new Date().toISOString(), pages: [], assets: [], failures: [] };
const downloads = new Map();

async function download(url) {
  if (downloads.has(url)) return downloads.get(url);
  const pending = (async () => {
    const parsed = new URL(url);
    const base = path.basename(parsed.pathname).replace(/[^a-zA-Z0-9._-]/g, '_') || 'asset';
    const hash = createHash('sha256').update(url).digest('hex').slice(0, 10);
    const local = `/assets/${hash}-${base}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = Buffer.from(await response.arrayBuffer());
      await mkdir('public/assets', { recursive: true });
      await writeFile(`public${local}`, data);
      manifest.assets.push({ url, local, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
      return local;
    } catch (error) {
      manifest.failures.push({ url, error: error.message });
      return url;
    }
  })();
  downloads.set(url, pending);
  return pending;
}

for (const route of routes) {
  const response = await fetch(origin + route);
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const html = await response.text();
  const name = route === '/' ? 'index' : route.slice(1).replaceAll('/', '__');
  await writeFile(path.join(archive, `${name}.html`), html);
  manifest.pages.push({ route, source: `reference/original/${name}.html` });
  const urls = [...new Set(html.match(/https:\/\/(?:cdn\.prod\.website-files\.com|assets\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net)[^\s"'<>),]+/g))];
  await Promise.all(urls.map(download));
  console.log(`Captured ${route} (${urls.length} asset references)`);
}

// CSS fonts and backgrounds are dependencies too. Preserve original bytes for reference.
for (const item of [...manifest.assets].filter((a) => /\.css$/.test(a.local))) {
  let css = await readFile(`public${item.local}`, 'utf8');
  await writeFile(path.join(archive, path.basename(item.local)), css);
  const urls = [...new Set([...css.matchAll(/url\(["']?(https?:\/\/[^\s"')]+)["']?\)/g)].map((m) => m[1]))];
  for (const url of urls) css = css.replaceAll(url, await download(url));
  await writeFile(`public${item.local}`, css);
}
await writeFile('reference/capture.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`${manifest.pages.length} pages; ${manifest.assets.length} local assets; ${manifest.failures.length} failures`);
if (manifest.failures.length) console.log(JSON.stringify(manifest.failures, null, 2));
