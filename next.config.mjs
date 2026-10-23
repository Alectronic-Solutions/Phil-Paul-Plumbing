// PAGES_BASE_PATH is set by the GitHub Pages workflow (e.g. /Phil-Paul-Plumbing). Leave unset for root hosting.
const basePath = process.env.PAGES_BASE_PATH || '';
// Search engines may index the site only when SITE_INDEXABLE=true (set it on the production build at launch).
// Every other build, including the GitHub Pages mockup, stays noindex. scripts/prepare-redesign.mjs reads the same flag.
const indexable = process.env.SITE_INDEXABLE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // No trailing slash in production, so URLs match the ones the original site had indexed (/service, not /service/).
  // The GitHub Pages mockup keeps folder-style URLs because Pages cannot serve service.html beside a service/ folder.
  trailingSlash: Boolean(basePath),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_PAGES_ORIGIN: process.env.PAGES_ORIGIN || '', NEXT_PUBLIC_SITE_INDEXABLE: String(indexable) },
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};
export default nextConfig;
