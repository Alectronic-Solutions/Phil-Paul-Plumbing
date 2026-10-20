// Runs after `next build`. Adds a Content-Security-Policy to out/_headers that allows only this site's own files,
// the inline scripts Next.js writes into each page (by hash, since their contents change every build), and the
// scripts of any integration enabled in content/integrations.mjs. npm run verify checks the result.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { activeIntegrations } from '../content/integrations.mjs';

const hash = code => `'sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}'`;
// Inline scripts the browser runs. JSON and JSON-LD blocks are data, so CSP does not apply to them.
const inlineScripts = html => { const $ = load(html); return $('script:not([src])').toArray().filter(el => !/json/i.test(el.attribs.type || '')).map(el => $(el).html()); };

const htmlFiles = (await readdir('out', { recursive: true, withFileTypes: true }))
  .filter(f => f.isFile() && f.name.endsWith('.html'))
  .map(f => `${f.parentPath ?? f.path}/${f.name}`);
const pageHashes = new Set();
for (const file of htmlFiles) for (const code of inlineScripts(await readFile(file, 'utf8'))) pageHashes.add(hash(code));
const scriptSources = new Set(pageHashes);

// Integrations: their external script origins, their inline snippets, and any extra sources they declare in `csp`.
const extra = {};
for (const item of activeIntegrations) {
  for (const script of item.scripts) {
    if (script.src) scriptSources.add(new URL(script.src).origin);
    if (script.inline) scriptSources.add(hash(script.inline));
  }
  for (const [directive, sources] of Object.entries(item.csp || {})) extra[directive] = [...(extra[directive] || []), ...sources];
}

const directives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", ...scriptSources],
  // React style attributes and the inlined @font-face block need inline styles.
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};
for (const [directive, sources] of Object.entries(extra)) directives[directive] = [...(directives[directive] || ["'self'"]), ...sources];
const policy = [...Object.entries(directives).map(([name, sources]) => `${name} ${[...new Set(sources)].join(' ')}`), 'upgrade-insecure-requests'].join('; ');

const headers = await readFile('out/_headers', 'utf8');
await writeFile('out/_headers', headers.replace(/^\/\*\n/, `/*\n  Content-Security-Policy: ${policy}\n`));
console.log(`Content-Security-Policy written: ${pageHashes.size} inline script hash(es) across ${htmlFiles.length} pages, ${activeIntegrations.length} integration(s).`);
