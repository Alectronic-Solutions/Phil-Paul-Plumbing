import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { load } from 'cheerio';
import { pages, business } from '../content/business.mjs';
import { integrations, categories } from '../content/integrations.mjs';

// Legal guardrails: the cookie policy promises that nothing optional loads without consent.
// Third-party tools may only be added through content/integrations.mjs, which the consent manager gates.
const trackers = /googletagmanager|google-analytics|googleadservices|doubleclick|facebook\.net|connect\.facebook|fbevents|clarity\.ms|hotjar|podium|termly|callrail|accessibe|acsbapp|tiktok|linkedin\.com\/(px|insight)|bing\.com\/bat|segment\.(io|com)|fullstory|mouseflow|intercom|tawk\.to|livechat/i;
const consentFiles = new Set(['components/Consent.jsx', 'lib/consent.mjs']);
const listSource = async dir => (await readdir(dir, { recursive: true, withFileTypes: true })).filter(f => f.isFile() && /\.(m?js|jsx)$/.test(f.name)).map(f => `${f.parentPath ?? f.path}/${f.name}`.replace(/\\/g, '/'));
for (const file of [...await listSource('components'), ...await listSource('pages'), ...await listSource('lib')]) {
  if (consentFiles.has(file)) continue;
  const code = await readFile(file, 'utf8');
  assert(!/document\.cookie|localStorage|sessionStorage|indexedDB|next\/script|createElement\(\s*['"]script|<iframe|\bgtag\(|\bfbq\(|dataLayer/.test(code), `${file} uses cookies, browser storage, or third-party scripts outside the consent manager. Add the tool to content/integrations.mjs instead.`);
  assert(!trackers.test(code), `${file} references a tracking or widget service. Add it through content/integrations.mjs so it is consent-gated and listed in the cookie policy.`);
}
for (const item of integrations) {
  assert(item.id && item.name && item.provider && item.purpose, `Integration is missing id, name, provider, or purpose: ${item.id}`);
  assert(categories[item.category], `Integration ${item.id} needs a category of functional, analytics, or marketing. Strictly necessary tools do not belong in the registry.`);
  assert(/^https:\/\//.test(item.privacyUrl || ''), `Integration ${item.id} needs its provider's privacy policy URL.`);
  assert(Array.isArray(item.cookies) && item.cookies.every(c => c.name && c.duration && c.purpose), `Integration ${item.id} must list every cookie with name, duration, and purpose for the cookie policy.`);
  assert(Array.isArray(item.scripts), `Integration ${item.id} needs a scripts array.`);
}
const legalLinks = [business.privacy, business.terms, business.cookies, business.accessibility];

const routes = new Set(pages.map(p => p.route));
const indexable = process.env.SITE_INDEXABLE === 'true';
const htmlFile = route => route === '/' ? 'out/index.html' : `out${route}.html`;
const seen = { titles: new Set(), descriptions: new Set() };
let assets = 0, links = 0;
for (const page of pages) {
  const html = await readFile(htmlFile(page.route), 'utf8');
  const $ = load(html);
  assert.equal($('title').text(), page.title, `Title: ${page.route}`);
  assert.equal($('h1').length, 1, `H1: ${page.route}`);
  assert.equal($('main').length, 1, `Main landmark: ${page.route}`);
  assert.equal($('html').attr('lang'), 'en-US');
  assert.equal($('meta[name="robots"]').attr('content'), indexable ? undefined : 'noindex, nofollow', `Robots meta must match SITE_INDEXABLE: ${page.route}`);
  assert.equal($('meta[name="description"]').attr('content'), page.description);
  assert.equal($('link[rel="canonical"]').attr('href'), business.url + page.route, `Canonical: ${page.route}`);
  assert.equal($('meta[property="og:url"]').attr('content'), business.url + page.route, `og:url: ${page.route}`);
  assert((await stat('out' + new URL($('meta[property="og:image"]').attr('content')).pathname)).isFile(), `Social image missing: ${page.route}`);
  assert(!seen.titles.has(page.title) && !seen.descriptions.has(page.description), `Duplicate title or description: ${page.route}`);
  seen.titles.add(page.title); seen.descriptions.add(page.description);
  assert(page.title.length <= 65 && page.description.length >= 70 && page.description.length <= 165, `Title or description length: ${page.route}`);
  const schemas = $('script[type="application/ld+json"]').toArray().map(el => JSON.parse($(el).text()));
  assert(schemas.some(s => s['@graph'].some(g => g['@type'] === 'Plumber')), `Plumber schema: ${page.route}`);
  assert.equal(schemas.some(s => s['@graph'].some(g => g['@type'] === 'BreadcrumbList')), page.route !== '/', `Breadcrumb schema: ${page.route}`);
  assert.equal($('script[src*="webflow"],script[src*="phil-pauls-plumbing-lodi"],script[src*="googletagmanager"],script[src*="podium"],link[href*="typekit"],iframe').length, 0, `Legacy dependency: ${page.route}`);
  for (const el of $('script[src],link[href],img[src],iframe,embed,object').toArray()) {
    const url = $(el).attr('src') || $(el).attr('href') || '';
    assert(!/^(https?:)?\/\//.test(url) || el.name === 'link' && /^(canonical|alternate)$/.test($(el).attr('rel')), `Third-party resource loaded without consent on ${page.route}: ${url}`);
  }
  assert(!trackers.test($('head').html() + $('body').html().replace(/<a [^>]*>/g, '')), `Tracking or widget service referenced on ${page.route}`);
  for (const route of legalLinks) assert($(`footer a[href^="${route}"]`).length, `Footer link to ${route} missing on ${page.route}`);
  assert.equal($('footer button.privacy-choices').length, 1, `"Your Privacy Choices" control missing on ${page.route}`);
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
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]), pages.map(p => business.url + p.route), 'Sitemap must list exactly the canonical URLs');
const robots = await readFile('out/robots.txt', 'utf8');
assert.equal(/^Disallow: \/$/m.test(robots), !indexable, 'robots.txt must match SITE_INDEXABLE');
if (indexable) assert(robots.includes(`Sitemap: ${business.url}/sitemap.xml`), 'robots.txt must point to the sitemap');
assert.equal((await readFile('out/_headers', 'utf8')).includes('X-Robots-Tag'), !indexable, '_headers X-Robots-Tag must match SITE_INDEXABLE');
const booking = load(await readFile(htmlFile('/book-plumbing-services'), 'utf8'));
assert.equal(booking('input[name="Email"]').attr('required'), undefined, 'Email should be optional');
assert.equal(booking('form').attr('action'), '/api/book-service');
const old = JSON.parse(await readFile('reference/capture.json', 'utf8'));
for (const page of old.pages) assert(routes.has(page.route), `Original URL lost: ${page.route}`);
const home = load(await readFile('out/index.html', 'utf8'));
assert.equal(home('.review-card img:not(.google-mark)').length, 0, 'Reviewer photos need the reviewer’s permission and should not be shown');
assert.equal(home('.reviews-duplicate a:not([tabindex="-1"])').length, 0, 'Duplicate review links should not receive keyboard focus');
assert.equal(home('.review-avatar').length, 0, 'Initial-only avatars should be removed');
assert.equal(home('button[aria-label="Next reviews"]').length, 1, 'Review navigation');
const { CONSENT } = await import(`data:text/javascript;base64,${Buffer.from(await readFile('functions/api/[[route]].js', 'utf8')).toString('base64')}`);
assert.equal(booking('.consent-label > span').text().replace(/\s*\*$/, '').replace(/\s+/g, ' ').trim(), CONSENT.text, 'Booking consent label must match the consent record in functions/api/[[route]].js');
const termsPage = load(await readFile(htmlFile('/terms-and-conditions'), 'utf8'))('.legal-body').text();
assert(!/disparag/i.test(termsPage), 'Terms must not restrict customer reviews (Consumer Review Fairness Act, Cal. Civ. Code 1670.8)');
assert(termsPage.includes('Nothing in these Terms limits your right to post honest reviews'), 'Terms must keep the review rights statement');
const builtFiles = (await readdir('out', { recursive: true, withFileTypes: true })).filter(f => f.isFile() && /\.(html|js|css|txt|xml)$/.test(f.name));
for (const file of builtFiles) {
  const text = await readFile(`${file.parentPath ?? file.path}/${file.name}`, 'utf8');
  assert(!/termly/i.test(text), `Termly reference in ${file.name}`);
  assert(!text.includes('366-2621') && !text.includes('/images/reviewers/'), `Outdated phone number or reviewer photo in ${file.name}`);
}
console.log(`PASS (search indexing ${indexable ? 'ENABLED' : 'blocked'}): ${pages.length} pages, ${assets} asset references, ${links} internal links, metadata, schemas, form labels, original route coverage, copy checks, and consent and legal guardrails.`);
