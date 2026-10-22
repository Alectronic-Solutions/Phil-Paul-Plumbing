import { useEffect, useRef, useState } from 'react';

const COLUMNS = 64;
const TENSION = 0.025;
const DAMPING = 0.03;
const SPREAD = 0.25;
const FILL_RATE = 1 / (3.4 * 60);

// A card that fills with the same springy water as the home page process steps. The text is drawn twice: dark above the
// surface, and a white copy clipped to the water's outline so the words turn light exactly where the water covers them.
export function WaterCard({ number, title, text, delay = 0 }) {
  const card = useRef(null);
  const canvas = useRef(null);
  const light = useRef(null);
  const sim = useRef(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-display-motion');
    const state = { h: new Float32Array(COLUMNS), v: new Float32Array(COLUMNS), level: 0, levelV: 0, target: 0, slosh: 0, sloshV: 0, bubbles: [], time: 0, raf: 0, W: 0, H: 0, reduced };
    sim.current = state;

    const surfaceY = (i, top, phase, ripple) => {
      const x = (i / (COLUMNS - 1)) * state.W;
      return top + state.h[i] + state.slosh * (x - state.W / 2) + Math.sin(x * 0.05 + phase) * ripple;
    };
    function surfacePath(top, phase, ripple) {
      const { W, H } = state;
      ctx.beginPath();
      ctx.moveTo(0, H + 2);
      for (let i = 0; i < COLUMNS; i++) ctx.lineTo((i / (COLUMNS - 1)) * W, surfaceY(i, top, phase, ripple));
      ctx.lineTo(W, H + 2);
      ctx.closePath();
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.W = el.clientWidth; state.H = el.clientHeight;
      el.width = Math.round(state.W * dpr); el.height = Math.round(state.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      const { W, H } = state;
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const top = H * 1.05 - state.level * H * 1.12;
      const ripple = state.reduced ? 0 : 2.2 * Math.min(1, state.level * 1.5);
      surfacePath(top - 3, state.time * 1.7 + 2, ripple);
      ctx.globalAlpha = 0.5; ctx.fillStyle = '#7fd0ee'; ctx.fill(); ctx.globalAlpha = 1;
      surfacePath(top, state.time * 2.3, ripple);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#2189c2'); g.addColorStop(0.5, '#1b74aa'); g.addColorStop(1, '#14608f');
      ctx.fillStyle = g; ctx.fill();
      if (state.level > 0.02 && state.level < 0.995) {
        ctx.beginPath();
        for (let i = 0; i < COLUMNS; i++) { const y = surfaceY(i, top, state.time * 2.3, ripple); const x = (i / (COLUMNS - 1)) * W; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.55)';
      for (const b of state.bubbles) { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke(); }
      // the white text copy only shows beneath the surface
      const pts = [];
      for (let i = 0; i < COLUMNS; i++) pts.push(`${((i / (COLUMNS - 1)) * W).toFixed(1)}px ${surfaceY(i, top, state.time * 2.3, ripple).toFixed(1)}px`);
      light.current.style.clipPath = `polygon(${pts.join(',')},${W}px ${H + 4}px,0 ${H + 4}px)`;
    }

    function step() {
      const { W, H } = state;
      state.time += 0.016;
      const want = Math.max(-FILL_RATE, Math.min(FILL_RATE, state.target - state.level));
      state.levelV += (want - state.levelV) * 0.08;
      state.level = Math.max(0, Math.min(1, state.level + state.levelV));
      state.sloshV += -state.slosh * 0.06 - state.sloshV * 0.035 + state.levelV * 0.0012 * Math.sin(state.time * 3);
      state.slosh += state.sloshV;
      for (let i = 0; i < COLUMNS; i++) { state.v[i] += -TENSION * state.h[i] - DAMPING * state.v[i]; state.h[i] += state.v[i]; }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < COLUMNS; i++) {
          if (i > 0) { const d = SPREAD * (state.h[i] - state.h[i - 1]); state.v[i - 1] += d; state.h[i - 1] += d; }
          if (i < COLUMNS - 1) { const d = SPREAD * (state.h[i] - state.h[i + 1]); state.v[i + 1] += d; state.h[i + 1] += d; }
        }
      }
      if (state.target > 0 && state.level > 0.15 && state.level < 0.98 && state.bubbles.length < 9 && Math.random() < 0.08) {
        state.bubbles.push({ x: W * (0.12 + Math.random() * 0.76), y: H - 3, r: 1.2 + Math.random() * 2.2, vy: 0.5 + Math.random() * 0.8, wob: Math.random() * 6 });
      }
      const top = H * 1.05 - state.level * H * 1.12;
      state.bubbles = state.bubbles.filter((b) => {
        b.y -= b.vy; b.x += Math.sin(state.time * 4 + b.wob) * 0.3;
        if (b.y - b.r <= top) { state.v[Math.max(0, Math.min(COLUMNS - 1, Math.round((b.x / W) * (COLUMNS - 1))))] += 0.8; return false; }
        return true;
      });
    }

    function energy() {
      let e = Math.abs(state.levelV) * 50 + Math.abs(state.target - state.level) * 50 + Math.abs(state.sloshV) * 50 + Math.abs(state.slosh) * 50;
      for (let i = 0; i < COLUMNS; i++) e += Math.abs(state.h[i]) + Math.abs(state.v[i]);
      return e;
    }

    function loop() {
      step(); draw();
      if (state.bubbles.length || energy() > 0.05) state.raf = requestAnimationFrame(loop);
      else { state.raf = 0; state.level = state.target; state.h.fill(0); state.v.fill(0); state.slosh = 0; draw(); }
    }
    state.start = () => { if (!state.raf) state.raf = requestAnimationFrame(loop); };
    state.redraw = draw;

    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(el);
    document.fonts?.ready.then(draw);
    return () => { cancelAnimationFrame(state.raf); resizer.disconnect(); };
  }, []);

  // fill every time the card scrolls into view (from either direction), and empty again once it is fully out of view
  useEffect(() => {
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.35) { clearTimeout(timer); timer = setTimeout(() => setFilled(true), delay); }
      else if (entry.intersectionRatio === 0) { clearTimeout(timer); setFilled(false); }
    }, { threshold: [0, 0.35] });
    observer.observe(card.current);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [delay]);

  useEffect(() => {
    const state = sim.current;
    if (!state) return;
    if (!filled) {
      state.target = 0; state.level = 0; state.levelV = 0; state.slosh = 0; state.sloshV = 0;
      state.h.fill(0); state.v.fill(0); state.bubbles = [];
      state.redraw();
      return;
    }
    state.target = 1;
    if (state.reduced) { state.level = 1; state.redraw(); return; }
    state.sloshV += 0.0008;
    state.start();
  }, [filled]);

  // hovering gives the water a gentle slosh
  const splash = () => { const s = sim.current; if (s && !s.reduced && s.level > 0.9) { s.sloshV += 0.0006; s.v[Math.floor(Math.random() * COLUMNS)] += 1.5; s.start(); } };

  const content = <><span className="approach-number">{number}</span><h3>{title}</h3><p>{text}</p></>;
  return <article className="water-card" ref={card} onMouseEnter={splash} onFocus={splash}>
    <div className="water-card-copy">{content}</div>
    <canvas className="water-card-canvas" ref={canvas} aria-hidden="true" />
    <div className="water-card-copy water-card-light" ref={light} aria-hidden="true">{content}</div>
  </article>;
}
