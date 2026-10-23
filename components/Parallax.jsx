import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { asset } from '../lib/asset.mjs';

// The pipes tile is 1200x1582 and mirrored 2x2, so it repeats without a seam when the layer wraps by one tile height.
const TILE = { width: 1200, height: 1582 };
const image = `image-set(url(${asset('/images/pipes-bg.avif')}) type("image/avif"), url(${asset('/images/pipes-bg.webp')}) type("image/webp"))`;

// Elements that drift against the scroll for depth: [selector, speed, max shift in px]. Phones get a gentler, shorter drift.
// The home hero's visual is excluded: a translate would make it the containing block for the absolutely positioned backdrop and badges, squeezing the photo into its column.
const drifters = [
  ['.why-trust-photo, .problem-photo, .overview-photo, .hero-visual:not(.home-hero-shadow .hero-visual), .community-photo, .guide-related-photo, .crew-polaroids, .map-stage, .team-gallery img', 0.1, 46],
  ['.section-heading, .about-feature h2, .why-trust-section h2', -0.05, 22],
  ['.footer-watermark', 0.14, 60]
];

// Fixed texture layer that scrolls slower than the page, plus a light drift on photos and headings. Everything is transform
// or translate only. Under reduced motion or Display settings "stop motion" the texture stays put and nothing drifts.
export function Parallax() {
  const layer = useRef(null);
  const { asPath } = useRouter();
  useEffect(() => {
    const el = layer.current;
    const root = document.documentElement;
    const phone = window.matchMedia('(max-width: 760px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-display-motion');
    const tileHeight = () => (phone.matches ? 700 : TILE.width) * TILE.height / TILE.width;
    const setTile = () => el.style.setProperty('--tile-h', `${tileHeight().toFixed(1)}px`);
    setTile();
    if (still) { el.style.transform = 'translate3d(0,0,0)'; return undefined; }

    const items = [];
    const seen = new Set();
    for (const [selector, speed, max] of drifters) {
      document.querySelectorAll(selector).forEach(node => {
        if (seen.has(node) || ['fixed', 'sticky'].includes(getComputedStyle(node).position)) return;
        seen.add(node);
        items.push({ node, speed, max, applied: 0, visible: false });
      });
    }
    const observer = new IntersectionObserver(entries => entries.forEach(e => { items.find(i => i.node === e.target).visible = e.isIntersecting; }), { rootMargin: '25% 0px' });
    items.forEach(i => observer.observe(i.node));

    let frame = 0;
    const update = () => {
      frame = 0;
      const tile = tileHeight();
      const rate = phone.matches ? 0.16 : 0.34;
      const shift = (((-window.scrollY * rate) % tile) + tile) % tile;
      el.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`;
      const mid = window.innerHeight / 2;
      const scale = phone.matches ? 0.5 : 1;
      for (const item of items) {
        if (!item.visible) continue;
        const rect = item.node.getBoundingClientRect();
        const centre = rect.top - item.applied + rect.height / 2;
        const max = item.max * scale;
        const offset = Math.max(-max, Math.min(max, (centre - mid) * item.speed * scale));
        item.applied = offset;
        item.node.style.translate = `0 ${offset.toFixed(1)}px`;
      }
    };
    const onScroll = () => { frame ||= requestAnimationFrame(update); };
    const onResize = () => { setTile(); onScroll(); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      observer.disconnect();
      items.forEach(i => i.node.style.removeProperty('translate'));
    };
  }, [asPath]);
  return <div className="parallax-bg" ref={layer} style={{ backgroundImage: image }} aria-hidden="true" />;
}
