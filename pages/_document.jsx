import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Html, Head, Main, NextScript } from 'next/document';
import { asset } from '../lib/asset.mjs';
import { bootScript } from '../lib/display.mjs';

// The @font-face rules from scripts/prepare-design-assets.mjs are inlined, so text never waits on a stylesheet request.
// _document renders only at build time, so reading the file here does not reach the browser bundle.
const fontCss = readFileSync(path.join(process.cwd(), 'public/fonts/design.css'), 'utf8').replace(/url\(([^)/]+)\)/g, (_, file) => `url(${asset(`/fonts/${file}`)})`);
const latinFile = (family, weight) => fontCss.split('/* latin */').slice(1).map(block => block.slice(0, block.indexOf('}'))).find(block => block.includes(`'${family}'`) && block.includes(`font-weight: ${weight}`))?.match(/url\(([^)]+)\)/)[1];
// The hero heading and body text: the two faces the first screen cannot render without.
const preloads = [latinFile('Barlow Condensed', 700), latinFile('DM Sans', 400)].filter(Boolean);

export default function Document() {
  return <Html lang="en-US"><Head><script dangerouslySetInnerHTML={{ __html: bootScript }} />{preloads.map(href => <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />)}<style dangerouslySetInnerHTML={{ __html: fontCss }} /><link rel="icon" href={asset("/favicon.ico")} sizes="48x48" /><link rel="icon" href={asset("/images/icons/icon-192.png")} type="image/png" sizes="192x192" /><link rel="apple-touch-icon" href={asset("/images/icons/apple-touch-icon.png")} /><link rel="manifest" href={asset("/site.webmanifest")} />{process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'true' && <meta name="robots" content="noindex, nofollow" />}<meta name="theme-color" content="#751c28" /></Head><body><Main /><NextScript /></body></Html>;
}
