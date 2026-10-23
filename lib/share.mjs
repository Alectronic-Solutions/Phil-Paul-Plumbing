import { business } from '../content/business.mjs';

// Canonical, Open Graph, and Twitter URLs. Production uses business.url. The GitHub Pages mockup (NEXT_PUBLIC_PAGES_ORIGIN set)
// points at itself instead, so a shared preview link shows its own cards rather than the old site's, which has none of these images.
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const origin = process.env.NEXT_PUBLIC_PAGES_ORIGIN ? process.env.NEXT_PUBLIC_PAGES_ORIGIN + base : business.url;

export const pageUrl = (route) => origin + (base ? (route === '/' ? '/' : `${route}/`) : route);

// Every page shares the same crew photo (public/images/og/share.jpg), used as supplied with no overlay text.
export const shareImage = () => ({ url: `${origin}/images/og/share.jpg`, width: 1448, height: 1086 });

export const shareAlt = (page) => page.type === 'service' || page.type === 'city'
  ? `${page.title.split(' | ')[0]}: Phil & Paul's Plumbing, rated ${business.rating.value} on Google, (209) 366-2319`
  : `Phil & Paul's Plumbing: your local plumber in Lodi, CA since 1996. Rated ${business.rating.value} on Google. Call ${business.phone}`;
