import { useEffect, useState } from 'react';
import { business } from '../content/business.mjs';
import { googleReviews } from '../content/google-reviews.mjs';
import { Icon } from './Icon';
import { Photo } from './Site';
import { asset } from '../lib/asset.mjs';

const PAGE = 12;

function Stars({ count = 5 }) {
  return <span className="stars" role="img" aria-label={`${count} out of 5 stars`}>{[0, 1, 2, 3, 4].map(i => <span key={i} className={i < count ? undefined : 'star-off'}><Icon name="star" size={16} /></span>)}</span>;
}

const LONG = 250;

function WallCard({ review }) {
  const [open, setOpen] = useState(false);
  const stars = review.stars || 5;
  const long = review.text.length > LONG;
  const chips = review.service ? review.service.split(', ') : [];
  const reply = review.reply?.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\uFE0F]/gu, '').trim();
  return <article className="wall-card">
    <header>
      <span className="wall-avatar" aria-hidden="true">{review.name.trim()[0].toUpperCase()}</span>
      <div><strong>{review.name}</strong><span>{review.date}</span></div>
      <img className="google-mark" src={asset('/images/google-g.svg')} alt="Google" width="22" height="22" />
    </header>
    <Stars count={stars} />
    <blockquote className={long && !open ? 'is-clamped' : undefined}>{review.text}</blockquote>
    {long && <button type="button" className="wall-more" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Show less' : 'Read more'}</button>}
    <div className="wall-meta">
      {chips.length > 0 && <p className="wall-services">{chips.slice(0, 3).join(' · ')}{chips.length > 3 && ` · +${chips.length - 3} more`}</p>}
      {reply && <details className="wall-reply"><summary>Reply from Phil &amp; Paul’s</summary><p>{reply}</p></details>}
    </div>
  </article>;
}

export function ReviewsWall() {
  const [shown, setShown] = useState(PAGE);
  const visible = googleReviews.slice(0, shown);
  const remaining = googleReviews.length - shown;
  return <section className="section reviews-wall" id="customer-reviews" aria-labelledby="wall-heading">
    <div className="container">
      <div className="wall-head">
        <div>
          <div className="eyebrow">ON GOOGLE</div>
          <h2 id="wall-heading">Every review,<br />as written.</h2>
        </div>
        <div className="wall-summary">
          <strong>{business.rating.value}<span>/5</span></strong>
          <div>
            <span className="wall-stars"><Stars /><img className="google-mark" src={asset('/images/google-g.svg')} alt="Google" width="20" height="20" /></span>
            <span>{business.rating.count} Google reviews as of {business.rating.asOf}</span>
          </div>
        </div>
      </div>
      <div className="wall-grid">{visible.map((r, i) => <WallCard key={`${r.name}-${i}`} review={r} />)}</div>
      <div className="wall-foot">
        <p>Showing {visible.length} of {business.rating.count} reviews. {googleReviews.length < business.rating.count && <><br className="wall-br" />The rest are on our Google profile.</>}</p>
        <div className="button-group">
          {remaining > 0 && <button type="button" className="button button-outline" onClick={() => setShown(shown + PAGE)}>Show {Math.min(PAGE, remaining)} more</button>}
          <a className="button button-primary" href={business.google} target="_blank" rel="noopener noreferrer">Read all on Google<Icon name="diagonal" size={16} /></a>
        </div>
      </div>
    </div>
  </section>;
}

// [file, alt, object-position, site photo?]. Site photos have responsive AVIF/WebP sets; the rest are Google profile photos.
const photos = [
  ['team', 'The Phil & Paul’s crew standing in front of a service van', '50% 40%', true],
  ['google-crew-clipboard', 'A Phil & Paul’s plumber smiling on a walkway with a clipboard', '50% 18%'],
  ['drain', 'A plumber working in an excavated hole on a drain line', '50% 40%', true],
  ['crew-wrenches', 'Two Phil & Paul’s plumbers holding pipe wrenches on a job site', '50% 35%', true],
  ['google-red-van-driveway', 'A Phil & Paul’s plumber standing beside the red service van in a driveway', '50% 50%'],
  ['repair', 'A plumber with a smile working under a sink with his tools laid out', '50% 40%', true],
  ['excavation-repair', 'A plumber repairing a water line in an excavated trench', '50% 40%', true],
  ['google-lodi-news-award', 'Holding the Lodi News “Voted Best” plumbing service certificate', '50% 78%'],
  ['waterHeater', 'A plumber giving a thumbs up beside a new water heater', '50% 40%', true],
  ['softener-install', 'Two plumbers setting a new water softener tank beside a home', '50% 40%', true],
  ['google-sewer-trailer', 'Phil & Paul’s service truck and trenchless sewer division trailer', '50% 50%'],
  ['gas', 'A plumber working on a gas meter connection', '50% 40%', true],
  ['gas-meter-install', 'Two plumbers installing gas lines at a row of gas meters', '50% 50%', true],
  ['lawn-trench', 'A plumber standing in a backyard beside a trenched lawn and old pipe', '50% 35%', true],
  ['google-sump-pumps', 'A plumber with two new sump pump risers on a commercial job', '50% 42%'],
  ['softener-copper', 'A new water softener and whole-house filter plumbed in copper', '50% 40%', true],
  ['technician', 'A Phil & Paul’s technician standing in front of the red service van', '50% 35%', true],
  ['google-red-van-side', 'The red Phil & Paul’s Plumbing service van parked at dusk', '50% 50%'],
  ['google-shower-valve', 'A plumber installing a shower valve in a tiled shower', '50% 30%'],
  ['jeff', 'A Phil & Paul’s plumber waving from the cab of the service truck by a vineyard', '50% 35%', true],
  ['filtration', 'A whole-home water filtration system plumbed in copper in a garage', '50% 45%', true],
  ['camera', 'A sewer camera monitor beside an open cleanout, showing the inside of a drain line', '50% 40%', true],
  ['roots', 'Tree roots pulled out of a sewer line after an inspection', '50% 40%', true],
  ['fleet', 'Phil & Paul’s service truck parked beside a trailer of water heaters', '50% 50%', true],
];

const src = (file, site, w) => asset(`/images/${file}${site ? `-${w}` : ''}.webp`);

export function ReviewPhotos() {
  const [active, setActive] = useState(null);
  const close = () => setActive(null);
  const step = d => setActive(i => (i + d + photos.length) % photos.length);
  useEffect(() => {
    if (active === null) return;
    const onKey = e => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [active]);
  const current = active === null ? null : photos[active];
  return <section className="section review-photos" aria-labelledby="photos-heading">
    <div className="container">
      <div className="eyebrow">FROM THE FIELD</div>
      <h2 id="photos-heading">Out on the job.</h2>
      <p className="photo-lede">Real jobs, real crew, around Lodi and the Central Valley. Tap any photo to see it larger.</p>
      <div className="photo-wall">{photos.map(([file, alt, position, site], i) => <button type="button" className="photo-tile" key={file} onClick={() => setActive(i)} aria-label={`View larger: ${alt}`}>{site
        ? <Photo name={file} alt="" style={{ objectPosition: position }} sizes="(max-width: 560px) calc(50vw - 20px), (max-width: 1000px) 33vw, 300px" />
        : <img src={asset(`/images/${file}.webp`)} width="400" height="300" alt="" style={{ objectPosition: position }} loading="lazy" decoding="async" />}</button>)}</div>
    </div>
    {current && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label="Close photo viewer"><Icon name="close" size={22} /></button>
      <button type="button" className="lightbox-nav is-prev" onClick={e => { e.stopPropagation(); step(-1); }} aria-label="Previous photo"><Icon name="arrow" size={22} /></button>
      <figure onClick={e => e.stopPropagation()}>
        <img src={src(current[0], current[3], 1440)} alt={current[1]} />
        <figcaption>{current[1]} <span>{active + 1} / {photos.length}</span></figcaption>
      </figure>
      <button type="button" className="lightbox-nav is-next" onClick={e => { e.stopPropagation(); step(1); }} aria-label="Next photo"><Icon name="arrow" size={22} /></button>
    </div>}
  </section>;
}
