import { useEffect, useRef, useState } from 'react';
import { business, reviews } from '../content/business.mjs';
import { Icon } from './Icon';

function Stars() {
  return <span className="stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={17} />)}</span>;
}

function ReviewCard({ review, duplicate = false }) {
  return <figure className="review-card">
    <div className="review-card-top"><Stars /><img className="google-mark" src="/images/google-g.svg" alt={duplicate ? '' : 'Google'} width="27" height="27" /></div>
    <blockquote>“{review.text}”</blockquote>
    <figcaption><a className="review-profile" href={review.profile} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={`${review.name}'s Google profile`}><img src={review.photo} alt={duplicate ? '' : `${review.name}'s public Google profile photo`} width="48" height="48" loading="lazy" /></a><div><a href={review.profile} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined}>{review.name}</a><span>{review.service}</span></div><a className="review-original" href={review.profile} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={`View ${review.name}'s review on Google`}><Icon name="diagonal" size={17} /></a></figcaption>
  </figure>;
}

export function Reviews({ full = false }) {
  const viewport = useRef(null);
  const group = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reduced) return;
    const element = viewport.current;
    if (!element || !group.current) return;
    let frame, previous, visible = false, position = element.scrollLeft;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0.1 });
    observer.observe(element);
    const advance = now => {
      const delta = previous ? Math.min(now - previous, 64) : 0;
      previous = now;
      if (visible && !document.hidden) {
        const span = group.current.offsetWidth + 24;
        position += delta * 0.032;
        if (position >= span) position -= span;
        element.scrollLeft = position;
      }
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [paused, hovered, focused, reduced]);

  function move(direction) {
    const element = viewport.current;
    setPaused(true);
    const width = group.current?.querySelector('.review-card')?.offsetWidth || 350;
    const span = (group.current?.offsetWidth || 0) + 24;
    if (direction < 0 && element.scrollLeft < 5) element.scrollLeft = span;
    if (direction > 0 && element.scrollLeft >= span) element.scrollLeft -= span;
    element.scrollBy({ left: direction * (width + 24), behavior: reduced ? 'auto' : 'smooth' });
  }

  return <section className={`reviews-section section scrolling-reviews ${full ? 'reviews-full' : ''}`} aria-label="Customer reviews"><div className="container"><div className="section-heading"><div><div className="eyebrow">FROM OUR NEIGHBORS</div><h2>Good work gets<br />people talking.</h2></div><div className="review-score"><strong>4.8<span>/5</span></strong><div><Stars /><span>119 Google reviews</span></div><a href={business.google} target="_blank" rel="noopener noreferrer" aria-label="Read all Google reviews"><img className="google-mark" src="/images/google-g.svg" alt="Google" width="27" height="27" /></a></div></div></div>
    <div className="reviews-window" ref={viewport} role="region" aria-roledescription="carousel" tabIndex="0" aria-label="Swipe or scroll horizontally to read customer reviews" onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)} onPointerDown={() => setPaused(true)} onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } }}>
      <div className="reviews-track"><div className="reviews-group" ref={group}>{reviews.map(r => <ReviewCard key={r.name} review={r} />)}</div><div className="reviews-group reviews-duplicate" aria-hidden="true">{reviews.map(r => <ReviewCard key={r.name} review={r} duplicate />)}</div></div>
    </div>
    <div className="container reviews-bottom"><div className="review-source-note"><span>Real customers. Reviews from Google.</span><a href={business.google} target="_blank" rel="noopener noreferrer">Read all reviews<Icon name="diagonal" size={15} /></a></div><div className="review-controls"><button onClick={() => move(-1)} aria-label="Previous reviews"><Icon className="reverse-arrow" name="arrow" size={21} /></button><button onClick={() => setPaused(!paused)} aria-label={reduced ? 'Automatic scrolling is off for reduced motion' : paused ? 'Play automatic review scrolling' : 'Pause automatic review scrolling'} aria-pressed={paused} disabled={reduced}><Icon name={paused || reduced ? 'play' : 'pause'} size={18} /></button><button onClick={() => move(1)} aria-label="Next reviews"><Icon name="arrow" size={21} /></button></div></div>
  </section>;
}
