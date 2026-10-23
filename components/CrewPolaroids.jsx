import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { useMotionOff } from './DisplaySettings';

const crew = [
  ['team', 'The local Phil and Paul’s Plumbing crew', 'The whole crew'],
  ['truck', 'A Phil and Paul’s technician waving from the red service truck', 'On our way'],
  ['crew', 'A technician beside a Phil and Paul’s service van', 'Ready for the call'],
  ['jeff', 'Jeff in a Phil and Paul’s service truck', 'Jeff, on the road'],
  ['technician', 'A smiling Phil and Paul’s technician beside a red service van', 'Local plumbers, since 1996']
];
// Resting tilt per photo, so the pile looks hand-placed but renders the same on the server and in the browser.
const tilts = [-3, 4, -5, 3, -2];
const INTERVAL = 4500;

// A pile of polaroid-style crew photos. The top photo moves to the back every few seconds. `Photo` is passed in because
// Site.jsx imports this file, and importing it back would be circular.
export function CrewPolaroids({ Photo }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const root = useRef(null);
  const motionOff = useMotionOff();
  const n = crew.length;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const still = reduced || motionOff;
  const running = !still && !paused && !hover && visible;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => { if (!document.hidden) setActive(a => (a + 1) % n); }, INTERVAL);
    return () => clearInterval(id);
  }, [running, n, active]);

  const move = step => setActive(a => (a + step + n) % n);

  return <div className="crew-polaroids" ref={root} role="group" aria-roledescription="carousel" aria-label="Photos of the Phil and Paul’s crew"
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
    <div className="crew-polaroid-stack" aria-live={running ? 'off' : 'polite'}>
      {crew.map(([name, alt, caption], i) => {
        const pos = (i - active + n) % n;
        return <figure key={name} className="crew-polaroid" data-pos={pos > 2 ? 'hidden' : pos} style={{ '--tilt': `${tilts[i]}deg` }} aria-hidden={pos !== 0}>
          <Photo name={name} alt={alt} sizes="(max-width: 760px) 70vw, 340px" />
          <figcaption>{caption}</figcaption>
        </figure>;
      })}
    </div>
    <div className="review-controls crew-polaroid-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous crew photo"><Icon className="reverse-arrow" name="arrow" size={21} /></button>
      <button type="button" onClick={() => setPaused(!paused)} aria-label={still ? 'Automatic photo change is off for reduced motion' : paused ? 'Play automatic photo change' : 'Pause automatic photo change'} aria-pressed={paused} disabled={still}><Icon name={paused || still ? 'play' : 'pause'} size={18} /></button>
      <button type="button" onClick={() => move(1)} aria-label="Next crew photo"><Icon name="arrow" size={21} /></button>
      <span className="crew-polaroid-count" aria-hidden="true">{active + 1} / {n}</span>
    </div>
  </div>;
}
