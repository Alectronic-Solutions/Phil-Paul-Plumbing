// Runs after `next build` and scripts/inline-css.mjs. Holds back Next's script bundles until the page has loaded and painted
// its largest element, so the first screen never competes with ~180 KiB of JavaScript for a phone's bandwidth and CPU.
// The page is complete static HTML before hydration; only the interactive parts (menu, consent banner, forms) wait.
// The loader is identical on every page, so scripts/finalize-headers.mjs allows it with a single CSP hash.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';

// Reads the bundle list from data-src on the placeholder, then appends the real scripts in order (async=false keeps it).
// Starts once the window has loaded and a largest-contentful-paint entry has arrived; browsers without that entry type
// start on load. The 3 s fallback covers background tabs, which never report a paint.
const loader = `(function(){var srcs=JSON.parse(document.currentScript.dataset.src),loaded=0,painted=0,started=0;function go(){if(started||!loaded||!painted)return;started=1;srcs.forEach(function(s){var e=document.createElement('script');e.src=s;e.async=false;document.body.appendChild(e)})}var types=window.PerformanceObserver&&PerformanceObserver.supportedEntryTypes||[];if(types.indexOf('largest-contentful-paint')>-1)new PerformanceObserver(function(){painted=1;go()}).observe({type:'largest-contentful-paint',buffered:true});else painted=1;addEventListener('load',function(){loaded=1;go();setTimeout(function(){painted=1;go()},3000)})})()`;

const htmlFiles = (await readdir('out', { recursive: true, withFileTypes: true }))
  .filter(f => f.isFile() && f.name.endsWith('.html'))
  .map(f => `${f.parentPath ?? f.path}/${f.name}`);
let pages = 0;
for (const file of htmlFiles) {
  const $ = load(await readFile(file, 'utf8'));
  const scripts = $('script[src][defer]').toArray();
  if (!scripts.length) continue;
  const srcs = scripts.map(el => $(el).attr('src'));
  $(scripts).remove();
  $('body').append($('<script>').attr('data-src', JSON.stringify(srcs)).text(loader));
  await writeFile(file, $.html());
  pages++;
}
console.log(`Deferred hydration on ${pages} pages.`);
