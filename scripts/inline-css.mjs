// Runs after `next build`. Inlines the site's stylesheets into every exported page, so the first paint does not wait on
// three render-blocking CSS requests. All CSS is global (imported in pages/_app.jsx), so each page carries the same block.
// <style data-n-href> is the tag Next's pages router itself uses for inlined CSS, so client-side navigation leaves it alone.
// The CSS references only data: URIs, so moving it out of /_next/static/chunks/ breaks no relative url().
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';

const basePath = process.env.PAGES_BASE_PATH || '';
const htmlFiles = (await readdir('out', { recursive: true, withFileTypes: true }))
  .filter(f => f.isFile() && f.name.endsWith('.html'))
  .map(f => `${f.parentPath ?? f.path}/${f.name}`);
const cache = new Map();
const css = href => {
  if (!cache.has(href)) cache.set(href, readFile(`out${href.slice(basePath.length)}`, 'utf8'));
  return cache.get(href);
};

for (const file of htmlFiles) {
  const $ = load(await readFile(file, 'utf8'));
  const links = $('link[rel="stylesheet"][href*="/_next/static/"]').toArray();
  if (!links.length) continue;
  for (const link of links) {
    const href = $(link).attr('href');
    $(link).replaceWith(`<style data-n-href="${href}">${await css(href)}</style>`);
  }
  // The style preloads are now redundant. noscript[data-n-css] stays: Next uses it as the anchor for any CSS it adds later.
  $('link[rel="preload"][as="style"]').remove();
  await writeFile(file, $.html());
}
console.log(`Inlined ${cache.size} stylesheets into ${htmlFiles.length} pages.`);
