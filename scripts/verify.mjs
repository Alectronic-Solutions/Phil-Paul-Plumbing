import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { load } from 'cheerio';
import { pages } from '../content/business.mjs';

const routes = new Set(pages.map(p => p.route));
let assets = 0, links = 0;
for (const page of pages) {
  const file = page.route === '/' ? 'out/index.html' : `out${page.route}/index.html`;
  const html = await readFile(file, 'utf8');
  const $ = load(html);
  assert.equal($('title').text(), page.title, `Title: ${page.route}`);
  assert.equal($('h1').length, 1, `H1: ${page.route}`);
  assert.equal($('main').length, 1, `Main landmark: ${page.route}`);
  assert.equal($('html').attr('lang'), 'en');
  assert.equal($('meta[name="description"]').attr('content'), page.description);
  assert.equal($('link[rel="canonical"]').attr('href'), `https://www.philpaulplumbing.com${page.route === '/' ? '/' : page.route}`);
  const schemas = $('script[type="application/ld+json"]').toArray().map(el => JSON.parse($(el).text()));
  assert(schemas.some(s => s['@graph'].some(g => g['@type'] === 'Plumber')), `Plumber schema: ${page.route}`);
  assert.equal($('script[src*="webflow"],script[src*="phil-pauls-plumbing-lodi"],script[src*="googletagmanager"],script[src*="podium"],link[href*="typekit"],iframe').length, 0, `Legacy dependency: ${page.route}`);
  assert(!$('body').text().includes('\u2014'), `Em dash in visible copy: ${page.route}`);
  assert.equal($('.eyebrow > span').length, 0, `Decorative title dash: ${page.route}`);
  assert.equal($('.nav-trigger[aria-controls][aria-expanded="false"]').length, 3, `Navigation disclosures: ${page.route}`);
  assert.equal($('.nav-dropdown[hidden]').length, 3, `Dropdown default state: ${page.route}`);
  assert(!/\b(seamless|elevate|unparalleled|cutting-edge|revolutionize|leverage|delve)\b/i.test($('main').text()), `Filler language: ${page.route}`);
  for (const image of $('img').toArray()) {
    assert($(image).attr('alt') !== undefined, `Missing alt on ${page.route}`);
    assert($(image).attr('width') && $(image).attr('height'), `Missing image dimensions on ${page.route}`);
  }
  for (const el of $('[src],[href],img[srcset]').toArray()) {
    const urls = [$(el).attr('src'), $(el).attr('href'), ...($(el).attr('srcset') || '').split(',').map(p => p.trim().split(' ')[0])].filter(Boolean);
    for (const url of urls) {
      if (/^\/(images|assets|fonts|_next)\//.test(url)) {
        assert((await stat('out' + url.split('?')[0])).isFile(), `Missing asset: ${url}`); assets++;
      }
      if (el.name === 'a' && url.startsWith('/') && !url.startsWith('//')) {
        const route = url.split(/[?#]/)[0].replace(/\/$/, '') || '/';
        assert(routes.has(route), `Broken link: ${page.route} -> ${url}`); links++;
      }
      if (el.name === 'a' && /^Call|^\(209\)/i.test($(el).text().trim())) assert(url.startsWith('tel:'), `Invalid phone link: ${page.route}`);
    }
  }
  for (const control of $('form input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]),form textarea').toArray()) {
    const id = $(control).attr('id');
    assert(id && $(`label[for="${id}"]`).length, `Unlabeled form field: ${page.route}`);
  }
}
const sitemap = await readFile('out/sitemap.xml', 'utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length, pages.length);
const booking = load(await readFile('out/book-plumbing-services/index.html', 'utf8'));
assert.equal(booking('input[name="Email"]').attr('required'), undefined, 'Email should be optional');
assert.equal(booking('form').attr('action'), '/api/book-service');
const old = JSON.parse(await readFile('reference/capture.json', 'utf8'));
for (const page of old.pages) assert(routes.has(page.route), `Original URL lost: ${page.route}`);
const home = load(await readFile('out/index.html', 'utf8'));
assert.equal(home('.reviews-group:not([aria-hidden]) .review-profile img').length, 5, 'Real reviewer photos');
assert.equal(home('.reviews-duplicate a:not([tabindex="-1"])').length, 0, 'Duplicate review links should not receive keyboard focus');
assert.equal(home('.review-avatar').length, 0, 'Initial-only avatars should be removed');
assert.equal(home('button[aria-label="Next reviews"]').length, 1, 'Review navigation');
console.log(`PASS: ${pages.length} pages, ${assets} asset references, ${links} internal links, metadata, schemas, form labels, original route coverage, and copy checks.`);
