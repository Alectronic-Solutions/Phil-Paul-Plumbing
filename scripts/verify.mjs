import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { pages, sitemapPages, business, cities } from '../content/business.mjs';
import { integrations, categories } from '../content/integrations.mjs';
import { displayKey } from '../lib/display.mjs';
import { neighborhoodSpots } from '../content/neighborhood-spots.mjs';

// Legal guardrails: the cookie policy promises that nothing optional loads without consent.
// Third-party tools may only be added through content/integrations.mjs, which the consent manager gates.
const trackers = /googletagmanager|google-analytics|googleadservices|doubleclick|facebook\.net|connect\.facebook|fbevents|clarity\.ms|hotjar|podium|termly|callrail|accessibe|acsbapp|tiktok|linkedin\.com\/(px|insight)|bing\.com\/bat|segment\.(io|com)|fullstory|mouseflow|intercom|tawk\.to|livechat/i;
// The consent manager, and the first-party Display settings (local storage only, listed in the cookie policy).
const storageFiles = new Set(['components/Consent.jsx', 'lib/consent.mjs', 'components/DisplaySettings.jsx', 'lib/display.mjs']);
const listSource = async dir => (await readdir(dir, { recursive: true, withFileTypes: true })).filter(f => f.isFile() && /\.(m?js|jsx)$/.test(f.name)).map(f => `${f.parentPath ?? f.path}/${f.name}`.replace(/\\/g, '/'));
for (const file of [...await listSource('components'), ...await listSource('pages'), ...await listSource('lib')]) {
  if (storageFiles.has(file)) continue;
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
// Every listed neighborhood needs a spot on its city's map, or it silently drops off the drawing.
for (const city of cities.filter(c => neighborhoodSpots[c.slug])) {
  const missing = (city.landing?.neighborhoods || []).filter(n => !neighborhoodSpots[city.slug][n]);
  assert(!missing.length, `Add map coordinates in content/neighborhood-spots.mjs for: ${missing.join(', ')}`);
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
  assert.equal($('meta[name="robots"]').attr('content'), indexable && !page.draft ? undefined : 'noindex, nofollow', `Robots meta must match SITE_INDEXABLE: ${page.route}`);
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
  assert.equal($('footer button.display-settings-link').length + $('button.display-launcher').length, 2, `Display settings controls missing on ${page.route}`);
  assert(!$('body').text().includes('\u2014'), `Em dash in visible copy: ${page.route}`);
  assert.equal($('.eyebrow > span').length, 0, `Decorative title dash: ${page.route}`);
  assert.equal($('.nav-trigger[aria-controls][aria-expanded="false"]').length, 3, `Navigation disclosures: ${page.route}`);
  assert.equal($('.nav-dropdown[hidden]').length, 3, `Dropdown default state: ${page.route}`);
  assert(!/\b(seamless|elevate|unparalleled|cutting-edge|revolutionize|leverage|delve)\b/i.test($('main').text()), `Filler language: ${page.route}`);
  for (const image of $('img').toArray()) {
    assert($(image).attr('alt') !== undefined, `Missing alt on ${page.route}`);
    assert($(image).attr('width') && $(image).attr('height'), `Missing image dimensions on ${page.route}`);
  }
  for (const el of $('[src],[href],[srcset]').toArray()) {
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
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]), sitemapPages.map(p => business.url + p.route), 'Sitemap must list exactly the canonical URLs');
const robots = await readFile('out/robots.txt', 'utf8');
assert.equal(/^Disallow: \/$/m.test(robots), !indexable, 'robots.txt must match SITE_INDEXABLE');
if (indexable) assert(robots.includes(`Sitemap: ${business.url}/sitemap.xml`), 'robots.txt must point to the sitemap');
const headers = await readFile('out/_headers', 'utf8');
assert.equal(headers.includes('X-Robots-Tag'), !indexable, '_headers X-Robots-Tag must match SITE_INDEXABLE');
for (const header of ['Strict-Transport-Security', 'Cross-Origin-Opener-Policy', 'X-Frame-Options', 'Permissions-Policy']) assert(headers.includes(`  ${header}: `), `_headers is missing ${header}`);
assert(/^\/_next\/static\/\*\n  Cache-Control: public, max-age=31536000, immutable$/m.test(headers), '_headers must cache build output long-term');
// The CSP must allow every inline script the build produced, or the site breaks in production only.
const csp = headers.match(/^  Content-Security-Policy: (.+)$/m)?.[1];
assert(csp, '_headers is missing the Content-Security-Policy (run the full npm run build)');
assert(/script-src 'self'[^;]*;/.test(csp) && !/script-src[^;]*'unsafe-inline'/.test(csp), 'CSP script-src must not allow unsafe-inline');
for (const file of (await readdir('out', { recursive: true, withFileTypes: true })).filter(f => f.isFile() && f.name.endsWith('.html'))) {
  const $page = load(await readFile(`${file.parentPath ?? file.path}/${file.name}`, 'utf8'));
  for (const el of $page('script:not([src])').toArray().filter(el => !/json/i.test(el.attribs.type || ''))) {
    const digest = createHash('sha256').update($page(el).html(), 'utf8').digest('base64');
    assert(csp.includes(`'sha256-${digest}'`), `Inline script in ${file.name} is not allowed by the CSP`);
  }
}
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
const cookiePage = load(await readFile(htmlFile(business.cookies), 'utf8'))('.legal-body').text();
assert(cookiePage.includes(displayKey), 'Cookie policy must list the Display settings storage entry');
const a11yPage = load(await readFile(htmlFile(business.accessibility), 'utf8'))('.legal-body').text();
assert(!/(compliant|compliance|guarantee)/i.test(a11yPage), 'Accessibility statement must not claim compliance');
const termsPage = load(await readFile(htmlFile('/terms-and-conditions'), 'utf8'))('.legal-body').text();
assert(!/disparag/i.test(termsPage), 'Terms must not restrict customer reviews (Consumer Review Fairness Act, Cal. Civ. Code 1670.8)');
assert(termsPage.includes('Nothing in these Terms limits your right to post honest reviews'), 'Terms must keep the review rights statement');
const termsDoc = load(await readFile(htmlFile('/terms-and-conditions'), 'utf8'));
const disputesNumber = termsDoc('h2#disputes').text().match(/^(\d+)\./)?.[1];
assert(disputesNumber && termsDoc('p a[href$="#disputes"]').first().text().startsWith(`Section ${disputesNumber},`), 'Terms cross-reference to the dispute resolution section must match its number');
for (const route of ['/', '/contact']) {
  const $ = load(await readFile(htmlFile(route), 'utf8'));
  assert($('.consent-label > span').length, `No consent label found on ${route}`);
  $('.consent-label > span').each((_, el) => assert.equal($(el).text().replace(/\s*\*$/, '').replace(/\s+/g, ' ').trim(), CONSENT.text, `Consent label on ${route} must match the consent record`));
}
const builtFiles = (await readdir('out', { recursive: true, withFileTypes: true })).filter(f => f.isFile() && /\.(html|js|css|txt|xml)$/.test(f.name));
for (const file of builtFiles) {
  const text = await readFile(`${file.parentPath ?? file.path}/${file.name}`, 'utf8');
  assert(!/termly/i.test(text), `Termly reference in ${file.name}`);
  assert(!text.includes('366-2621') && !text.includes('/images/reviewers/'), `Outdated phone number or reviewer photo in ${file.name}`);
}
// Content quality guardrails for service and city pages: Google's spam policies target templated, keyword-stuffed,
// near-duplicate local pages. Each page needs its own substantial guide, written once, in the site's plain voice.
const slop = /look no further|top-notch|seamless|peace of mind|rest assured|state-of-the-art|unparalleled|\belevate|tailored solutions|comprehensive|in today's|\bnavigate|\bdelve|trusted partner|we pride ourselves|one-stop|second to none|\bgo-to\b|whether you're a/i;
const guideShingles = new Map();
for (const page of pages.filter(p => p.type === 'service' || p.type === 'city')) {
  const $ = load(await readFile(htmlFile(page.route), 'utf8'));
  const place = page.type === 'city' ? page.name : 'Lodi';
  assert.equal($('.local-guide').length, 1, `Local guide section missing: ${page.route}`);
  assert($('.local-guide h2').text().includes(place), `Local guide heading should name ${place}: ${page.route}`);
  const blocks = $('.local-guide p, .local-guide dd').toArray().map(el => $(el).text().toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean));
  const words = $('.guide-body p').toArray().reduce((n, el) => n + $(el).text().split(/\s+/).filter(Boolean).length, 0);
  assert(words >= 300, `Local guide is ${words} words; write at least 300: ${page.route}`);
  const shingles = new Set(blocks.flatMap(w => w.slice(7).map((_, i) => w.slice(i, i + 8).join(' '))));
  for (const [route, other] of guideShingles) {
    const shared = [...shingles].filter(x => other.has(x));
    assert.equal(shared.length, 0, `Local guides on ${page.route} and ${route} share wording: "${shared[0]}". Rewrite one so each page stands on its own.`);
  }
  guideShingles.set(page.route, shingles);
  const main = $('main').text();
  const mentions = main.split(place).length - 1;
  assert(mentions <= (page.type === 'city' ? 14 : 8), `"${place}" appears ${mentions} times on ${page.route}; that reads as keyword stuffing.`);
  const stock = main.match(slop);
  assert(!stock, `Stock marketing phrase on ${page.route}: "${stock?.[0]}"`);
  // Landing pages lead with the search phrase and answer their FAQs in structured data.
  if (cities.find(c => c.slug === page.city)?.landing) {
    assert($('h1').text().includes(`Plumber in${place}`) || $('h1').text().includes(`Plumber in ${place}`), `Landing h1 should say "Plumber in ${place}": ${page.route}`);
    const graph = JSON.parse($('script[type="application/ld+json"]').html())['@graph'];
    assert(graph.some(n => n['@type'] === 'FAQPage'), `Landing page needs FAQPage schema: ${page.route}`);
    const ids = $('main [id]').toArray().map(el => $(el).attr('id'));
    assert.equal(new Set(ids).size, ids.length, `Duplicate element ids: ${page.route}`);
  }
}
console.log(`PASS (search indexing ${indexable ? 'ENABLED' : 'blocked'}): ${pages.length} pages, ${assets} asset references, ${links} internal links, metadata, schemas, form labels, original route coverage, copy checks, and consent and legal guardrails.`);
