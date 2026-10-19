// Pulls the Termly-generated privacy policy and terms, strips Termly's markup, and writes clean HTML to content/legal.mjs.
// Re-run with `npm run import:legal` after the policies are updated in Termly.
import { writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';

const policies = {
  privacy: { uuid: '210823d1-ac21-40bc-9c11-b40b57aad9b3', route: '/privacy-policy' },
  terms: { uuid: '2bd1caeb-3646-4256-8bde-98174db05d66', route: '/terms-and-conditions' },
};
const viewerUrl = uuid => `https://app.termly.io/policy-viewer/policy.html?policyUUID=${uuid}`;
const BLOCK = new Set(['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th']);
const escapeText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = s => escapeText(s).replace(/"/g, '&quot;');
const isEmpty = html => !html.replace(/<br>/g, '').replace(/<[^>]+>/g, '').replace(/[\s ]/g, '');

function fixHref(href) {
  for (const { uuid, route } of Object.values(policies)) if (href === viewerUrl(uuid)) return route;
  if (href.replace(/\/$/, '') === 'https://www.philpaulplumbing.com') return '/';
  return href;
}

function tidy(html) {
  return html
    .replace(/\s+/g, ' ')
    .replace(/\s*<br>\s*/g, '<br>')
    .replace(/^(?:\s|<br>)+|(?:\s|<br>)+$/g, '')
    .replace(/<(strong|em)>\s*<\/\1>/g, '')
    .replace(/<\/(strong|em)>(\s*)<\1>/g, '$2')
    .replace(/\s+([,.;:)?!])/g, '$1')
    .replace(/\(\s+/g, '(')
    .trim();
}

function convert(raw) {
  const $ = cheerio.load(raw, null, false);
  $('style, script').remove();
  const referenced = new Set([...raw.matchAll(/href="#([^"]+)"/g)].map(m => m[1]));
  const usedIds = new Set();
  let pendingId = null;
  const hasBlock = el => $(el).find([...BLOCK].join(',')).length > 0;

  function inline(node, within = {}) {
    if (node.type === 'text') return escapeText(node.data.replace(/ /g, ' '));
    if (node.type !== 'tag') return '';
    const inner = (extra = {}) => node.children.map(child => inline(child, { ...within, ...extra })).join('');
    switch (node.name) {
      case 'br': return '<br>';
      case 'a': {
        const href = node.attribs.href ? fixHref(node.attribs.href) : null;
        const text = inner();
        if (!href || isEmpty(text)) return text;
        const external = /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeAttr(href)}"${external}>${text}</a>`;
      }
      case 'strong': case 'b': return within.strong ? inner() : `<strong>${inner({ strong: true })}</strong>`;
      case 'em': case 'i': return within.em ? inner() : `<em>${inner({ em: true })}</em>`;
      default: return BLOCK.has(node.name) ? ` ${inner()} ` : inner();
    }
  }

  function blocks(parent) {
    const out = [];
    let para = '';
    const push = (tag, inner) => {
      const id = pendingId; pendingId = null;
      out.push(`<${tag}${id ? ` id="${id}"` : ''}>${inner}</${tag}>`);
    };
    const flush = () => {
      for (const part of para.split(/(?:\s*<br>\s*){2,}/)) { const html = tidy(part); if (!isEmpty(html)) push('p', html); }
      para = '';
    };
    const items = el => $(el).children('li').toArray().map(li => {
      const inner = blocks(li);
      return inner.length === 1 && /^<p>[\s\S]*<\/p>$/.test(inner[0]) ? inner[0].slice(3, -4) : inner.join('');
    }).filter(html => !isEmpty(html));

    for (const node of parent.children) {
      if (node.type === 'text' || (node.type === 'tag' && !BLOCK.has(node.name) && !hasBlock(node))) { para += inline(node); continue; }
      if (node.type !== 'tag') continue;
      flush();
      const id = node.attribs.id;
      if (id && referenced.has(id) && !usedIds.has(id)) { usedIds.add(id); pendingId = id; }
      if (/^h[1-6]$/.test(node.name)) {
        const text = tidy(inline(node).replace(/<\/?(strong|em)>/g, ''));
        if (!isEmpty(text)) push(node.name === 'h1' ? 'h1' : node.name === 'h2' ? 'h2' : 'h3', text);
      } else if (node.name === 'ul' || node.name === 'ol') {
        const list = items(node);
        if (list.length) push(node.name, list.map(li => `<li>${li}</li>`).join(''));
      } else if (node.name === 'table') {
        const rows = $(node).find('tr').toArray().map(tr => `<tr>${$(tr).children('th, td').toArray().map(cell => {
          const inner = blocks(cell).join('');
          return `<${cell.name}>${inner.replace(/^<p>([\s\S]*)<\/p>$/, '$1')}</${cell.name}>`;
        }).join('')}</tr>`);
        out.push(`<div class="legal-table"><table>${rows.join('')}</table></div>`);
      } else if (/^heading_[12]$/.test(node.attribs['data-custom-class']) && !hasBlock(node)) {
        const text = tidy(inline(node).replace(/<\/?(strong|em)>/g, ''));
        if (!isEmpty(text)) push(node.attribs['data-custom-class'] === 'heading_1' ? 'h2' : 'h3', text);
      } else {
        out.push(...blocks(node));
      }
    }
    flush();
    return out;
  }

  const body = blocks({ children: $.root()[0].children });
  const titleIndex = body.findIndex(b => b.startsWith('<h1'));
  const title = cheerio.load(body[titleIndex]).text().trim();
  const updated = cheerio.load(body[titleIndex + 1]).text().replace(/^Last updated\s*/i, '').trim();
  return { title, updated, html: polish(body.slice(titleIndex + 2).join('\n')) };
}

// Termly splits lists and tables into one element per row; join them back up and fix copy the site's checks reject.
function polish(html) {
  let out = html
    .replace(/<\/ul>\n<ul>/g, '')
    .replace(/<\/table><\/div>\n<div class="legal-table"><table>/g, '')
    .replace(/((?:<p><a href="#[^"]+">[^<]+<\/a><\/p>\n?){3,})/g, run => `<ul class="legal-toc">${run.trim().split('\n').map(p => `<li>${p.slice(3, -4)}</li>`).join('')}</ul>\n`)
    .replace(/:((?:<\/(?:em|strong)>)+)(?=[^\s<]|<(?:em|strong)>)/g, ':$1 ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\(\)/g, '');
  for (const { uuid, route } of Object.values(policies)) out = out.replaceAll(escapeText(viewerUrl(uuid)), `https://www.philpaulplumbing.com${route}`);
  return out;
}

const output = {};
for (const [key, { uuid, route }] of Object.entries(policies)) {
  const res = await fetch(`https://app.termly.io/api/v1/consumer/policies/${uuid}/content`);
  if (!res.ok) throw new Error(`Termly ${key}: HTTP ${res.status}`);
  const { content } = await res.json();
  output[key] = { route, ...convert(content) };
  console.log(`${key}: "${output[key].title}", updated ${output[key].updated}, ${output[key].html.length} chars`);
}
await writeFile('content/legal.mjs', `// Generated by scripts/import-legal.mjs from Termly. Re-run the script instead of editing by hand.\nexport const legal = ${JSON.stringify(output, null, 2)};\n`);
