import { load } from 'cheerio';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const capture = JSON.parse(await readFile('reference/capture.json', 'utf8'));
const replacements = new Map(capture.assets.map((a) => [a.url, a.local]));
const pages = [];
await mkdir('content/pages', { recursive: true });
for (const entry of capture.pages) {
  let source = await readFile(entry.source, 'utf8');
  // Longest first so srcset variants and query strings stay intact.
  for (const [url, local] of [...replacements].sort((a, b) => b[0].length - a[0].length)) source = source.replaceAll(url, local);
  const $ = load(source);
  const page = {
    route: entry.route,
    pageId: $('html').attr('data-wf-page'),
    siteId: $('html').attr('data-wf-site'),
    bodyClass: $('body').attr('class') || '',
    title: $('title').text(),
    description: $('meta[name="description"]').attr('content') || '',
    canonical: $('link[rel="canonical"]').attr('href'),
    meta: $('meta[property], meta[name^="twitter:"]').toArray().map((el) => ({ ...el.attribs })),
    icons: $('link[rel="icon"],link[rel="apple-touch-icon"]').toArray().map((el) => ({ ...el.attribs })),
    stylesheets: $('link[rel="stylesheet"]').toArray().map((el) => $(el).attr('href')),
    headStyles: $('head style').toArray().map((el) => $(el).html()),
    schemas: $('script[type="application/ld+json"]').toArray().map((el) => JSON.parse($(el).text(), (_, value) => typeof value === 'string' && value.startsWith('/assets/') ? new URL(value, capture.origin).href : value)),
    scripts: $('body script[src]').toArray().map((el) => $(el).attr('src')).filter((src) => src.startsWith('/assets/')),
  };
  for (const meta of page.meta) {
    if (meta.content?.startsWith('/assets/')) meta.content = new URL(meta.content, capture.origin).href;
  }
  // Production account integrations are opt-in in _document. Core assets run locally.
  $('script, noscript').remove();
  $('style').each((_, el) => {
    if ($(el).text().includes('@import url(')) $(el).remove();
  });
  // Keep all original internal navigation on this installation.
  $('a[href]').each((_, el) => {
    const link = $(el);
    const href = link.attr('href');
    if (/^https?:\/\/(www\.)?philpaulplumbing\.com(?:\/|$)/.test(href)) {
      const url = new URL(href);
      link.attr('href', url.pathname + url.search + url.hash);
    }
    if (link.attr('target') === '_blank') link.attr('rel', 'noopener noreferrer');
    // Repair malformed URLs without changing their visible text or styling.
    if (href.includes('https://&lt;a') || href.includes('https://<a')) {
      link.attr('href', link.text().trim() === 'Consent' ? '/cookie-policy' : '/privacy-policy');
    }
    if (link.attr('href')?.startsWith('/service/ ')) link.attr('href', link.attr('href').replace('/service/ ', '/service/'));
    if (href === '#' && /call\s*\(?209[)-]?\s*366[-\s]?2319/i.test(link.text())) link.attr('href', 'tel:+12093662319');
  });
  $('form').each((_, el) => {
    const form = $(el);
    const service = form.attr('id') === 'wf-form-Service-Form';
    form.attr('action', service ? '/api/book-service' : '/api/subscribe');
    form.attr('method', 'post');
    form.attr('data-migrated-form', service ? 'service' : 'subscribe');
    // Prevent Webflow's hosted form module from claiming submissions.
    form.removeAttr('data-wf-page-id').removeAttr('data-wf-element-id');
    form.closest('.w-form').children('.w-form-done,.w-form-fail').attr('role', 'status').attr('aria-live', 'polite');
  });
  const file = entry.route === '/' ? 'index' : entry.route.slice(1).replaceAll('/', '__');
  page.content = `content/pages/${file}.html`;
  await writeFile(page.content, $('body').html());
  pages.push(page);
}
await writeFile('content/site.json', JSON.stringify(pages, null, 2) + '\n');
console.log(`Prepared ${pages.length} routes. Original snapshots are retained in reference/original.`);
