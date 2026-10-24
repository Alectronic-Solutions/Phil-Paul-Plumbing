import { useEffect, useRef, useState } from 'react';
import { business, reviewRows } from '../content/business.mjs';
import { Icon } from './Icon';
import { useMotionOff } from './DisplaySettings';
import { asset } from '../lib/asset.mjs';

function Stars({ label = '5 out of 5 stars' }) {
  return <span className="stars" {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={17} />)}</span>;
}

function ReviewCard({ review, duplicate = false }) {
  return <figure className="review-card">
    <div className="review-card-top"><Stars /><img className="google-mark" src={asset("/images/google-g.svg")} alt={duplicate ? '' : 'Google'} width="27" height="27" loading="lazy" /></div>
    <blockquote>“{review.text}”</blockquote>
    <figcaption><div><a href={review.profile} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined}>{review.name}</a><span>{review.service}</span></div><a className="review-original" href={review.profile} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={`View ${review.name}'s review on Google`}><Icon name="diagonal" size={17} /></a></figcaption>
  </figure>;
}

function ReviewRow({ items, direction = 1, paused, reduced, motionOff, onInteract, api, secondary = false, stagger = 0 }) {
  const viewport = useRef(null);
  const group = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const element = viewport.current;
    if (element && group.current && element.scrollLeft < 5) {
      const card = group.current.querySelector('.review-card')?.offsetWidth || 300;
      element.scrollLeft = group.current.offsetWidth + 16 - 1 - stagger * (card + 16);
    }
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reduced || motionOff) return;
    const element = viewport.current;
    if (!element || !group.current) return;
    let frame, previous, visible = false, started = false, position = element.scrollLeft;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0.1 });
    observer.observe(element);
    const advance = now => {
      const delta = previous ? Math.min(now - previous, 64) : 0;
      previous = now;
      if (visible && !document.hidden) {
        const span = group.current.offsetWidth + 16;
        if (!started) { started = true; if (direction < 0 && position < 5) position = span - 1; }
        position += delta * 0.032 * direction;
        if (position >= span) position -= span;
        if (position < 0) position += span;
        element.scrollLeft = position;
      }
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [paused, hovered, focused, reduced, motionOff, direction]);

  function startDrag(e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const element = viewport.current;
    const startX = e.clientX, startLeft = element.scrollLeft;
    let moved = false;
    const onMove = ev => {
      const dx = ev.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; element.classList.add('is-dragging'); }
      if (!moved) return;
      const span = (group.current?.offsetWidth || 0) + 16;
      let left = startLeft - dx;
      if (span > 24) left = ((left % span) + span) % span;
      element.scrollLeft = left;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      element.classList.remove('is-dragging');
      if (moved) window.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  function move(dir) {
    const element = viewport.current;
    if (!element) return;
    const width = group.current?.querySelector('.review-card')?.offsetWidth || 350;
    const span = (group.current?.offsetWidth || 0) + 16;
    if (dir < 0 && element.scrollLeft < 5) element.scrollLeft = span;
    if (dir > 0 && element.scrollLeft >= span) element.scrollLeft -= span;
    element.scrollBy({ left: dir * (width + 16), behavior: reduced || motionOff ? 'auto' : 'smooth' });
  }
  if (api) api.current = move;

  const hide = secondary ? { 'aria-hidden': 'true' } : { role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Swipe or scroll horizontally to read customer reviews' };
  return <div className={`reviews-window ${direction < 0 ? 'reviews-reverse' : ''}`} ref={viewport} tabIndex={secondary ? -1 : 0} {...hide} onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)} onPointerDown={e => { onInteract(); startDrag(e); }} onDragStart={e => e.preventDefault()} onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); onInteract(); move(e.key === 'ArrowRight' ? 1 : -1); } }}>
    <div className="reviews-track"><div className="reviews-group" ref={group}>{items.map(r => <ReviewCard key={r.name} review={r} duplicate={secondary} />)}</div><div className="reviews-group reviews-duplicate" aria-hidden="true">{items.map(r => <ReviewCard key={r.name} review={r} duplicate />)}</div></div>
  </div>;
}

export function Reviews({ full = false }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const motionOff = useMotionOff();
  const firstMove = useRef(null);
  const secondMove = useRef(null);
  const [first, second] = reviewRows;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  function step(direction) { setPaused(true); firstMove.current?.(direction); secondMove.current?.(-direction); }

  return <section className={`reviews-section section scrolling-reviews ${full ? 'reviews-full' : ''}`} aria-label="Customer reviews"><div className="container"><div className="section-heading"><div><div className="eyebrow">FROM OUR NEIGHBORS</div><h2>Good work gets<br />people talking.</h2></div><div className="review-score"><strong>{business.rating.value}<span>/5</span></strong><div><div className="review-stars-row"><Stars label="" /><a href={business.google} target="_blank" rel="noopener noreferrer" aria-label="Read all Google reviews"><img className="google-mark" src={asset("/images/google-g.svg")} alt="Google" width="22" height="22" loading="lazy" /></a></div><span>{business.rating.count} Google reviews as of {business.rating.asOf}</span></div></div></div></div>
    <ReviewRow items={first} direction={1} paused={paused} reduced={reduced} motionOff={motionOff} onInteract={() => setPaused(true)} api={firstMove} />
    <ReviewRow items={second} direction={-1} paused={paused} reduced={reduced} motionOff={motionOff} onInteract={() => setPaused(true)} api={secondMove} secondary stagger={0.5} />
    <div className="container reviews-bottom"><div className="review-source-note"><span>Real customers. Reviews from Google.</span><a href={business.google} target="_blank" rel="noopener noreferrer">Read all reviews<Icon name="diagonal" size={15} /></a></div><div className="review-controls"><button onClick={() => step(-1)} aria-label="Previous reviews"><Icon className="reverse-arrow" name="arrow" size={21} /></button><button onClick={() => setPaused(!paused)} aria-label={reduced ? 'Automatic scrolling is off for reduced motion' : paused ? 'Play automatic review scrolling' : 'Pause automatic review scrolling'} aria-pressed={paused} disabled={reduced}><Icon name={paused || reduced ? 'play' : 'pause'} size={18} /></button><button onClick={() => step(1)} aria-label="Next reviews"><Icon name="arrow" size={21} /></button></div></div>
  </section>;
}
