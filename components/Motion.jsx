import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Sections whose first screenful has its own CSS entrance (see styles/motion.css).
const sections = 'main section:not(.home-hero):not(.page-hero):not(.landing-hero) > .container, .site-footer > .container';
// A child that is only a wrapper around repeated items is skipped so the items reveal one by one.
const wrapper = /(?:^|\s)[\w-]*(?:-grid|-list|-links|-row|-cards|-layout)(?:\s|$)/;

function targetsIn(root) {
  const found = new Set();
  const add = el => { if (el.nodeType === 1 && !el.hasAttribute('data-reveal') && !el.matches('script, style, [hidden], [aria-hidden="true"]:empty')) found.add(el); };
  root.querySelectorAll(sections).forEach(container => {
    // The container itself can be the grid (columns of a two-column section).
    const items = wrapper.test(container.className) && container.children.length > 1 ? [...container.children] : [];
    if (!items.length) for (const child of container.children) {
      if (wrapper.test(child.className) && child.children.length > 1 && child.children.length <= 14) items.push(...child.children);
      else items.push(child);
    }
    items.forEach(add);
  });
  return [...found];
}

// Fades, lifts and un-blurs each block the first time it scrolls into view. Blocks already on screen are left alone,
// the attribute is removed once the block has settled so its own hover transitions are untouched, and nothing is
// hidden at all when the visitor prefers reduced motion or has turned motion off in Display settings.
export function Motion() {
  const { asPath } = useRouter();
  useEffect(() => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-display-motion')) return undefined;
    const timers = new Set();
    const tagged = [];
    const observer = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left).forEach((entry, i) => {
        const el = entry.target;
        observer.unobserve(el);
        const delay = Math.min(i * 90, 360);
        el.style.setProperty('--reveal-delay', `${delay}ms`);
        el.setAttribute('data-reveal', 'in');
        const timer = setTimeout(() => { timers.delete(timer); el.removeAttribute('data-reveal'); el.style.removeProperty('--reveal-delay'); }, delay + 1100);
        timers.add(timer);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    const frame = requestAnimationFrame(() => {
      const fold = window.innerHeight;
      targetsIn(document).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 || rect.top < fold * 0.92) return;
        const position = getComputedStyle(el).position;
        if (position === 'fixed' || position === 'sticky') return;
        el.setAttribute('data-reveal', '');
        tagged.push(el);
        observer.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      timers.forEach(clearTimeout);
      tagged.forEach(el => { el.removeAttribute('data-reveal'); el.style.removeProperty('--reveal-delay'); });
    };
  }, [asPath]);
  return null;
}
