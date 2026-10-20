import { useEffect, useRef, useState } from 'react';

const COLUMNS = 48;
const TENSION = 0.025;
const DAMPING = 0.03;
const SPREAD = 0.25;
const FILL_RATE = 1 / (4.6 * 60);
const FILL_DRAIN = 1 / (1.6 * 60);

// A digit floating in a circle of water. The surface is a row of springs that pass ripples to their neighbours,
// the whole body sloshes like a tilting tank, and the digit rides the surface as the level rises or drains.
export function WaterNumber({ value, active, filled }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const sim = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const style = getComputedStyle(el);
    const ink = '#17506f';
    const digit = getComputedStyle(wrap.current.querySelector('b'));
    const state = { h: new Float32Array(COLUMNS), v: new Float32Array(COLUMNS), level: 0, levelV: 0, target: 0, slosh: 0, sloshV: 0, bubbles: [], time: 0, raf: 0, size: 0, active: false, reduced };
    sim.current = state;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.size = el.clientWidth;
      el.width = Math.round(state.size * dpr);
      el.height = Math.round(state.size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function surfacePath(S, top, phase, ripple) {
      ctx.beginPath();
      ctx.moveTo(0, S + 2);
      for (let i = 0; i < COLUMNS; i++) {
        const x = (i / (COLUMNS - 1)) * S;
        const y = top + state.h[i] + state.slosh * (x - S / 2) + Math.sin(x * 0.18 + phase) * ripple;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(S, S + 2);
      ctx.closePath();
    }

    function draw() {
      const S = state.size;
      if (!S) return;
      ctx.clearRect(0, 0, S, S);
      const top = S * 1.06 - state.level * S * 1.0;
      const ripple = state.reduced ? 0 : 0.9 * Math.min(1, state.level);
      // back layer
      surfacePath(S, top - 1.5, state.time * 1.7 + 2, ripple);
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#7fd0ee';
      ctx.fill();
      ctx.globalAlpha = 1;
      // front layer
      surfacePath(S, top, state.time * 2.3, ripple);
      const g = ctx.createLinearGradient(0, Math.max(0, top), 0, S);
      g.addColorStop(0, '#5cc0e6');
      g.addColorStop(0.45, '#2a93c9');
      g.addColorStop(1, '#14608f');
      ctx.fillStyle = g;
      ctx.fill();
      // bright rim along the surface where light catches it
      if (state.level > 0.02) {
        ctx.beginPath();
        for (let i = 0; i < COLUMNS; i++) {
          const x = (i / (COLUMNS - 1)) * S;
          const y = top + state.h[i] + state.slosh * (x - S / 2) + Math.sin(x * 0.18 + state.time * 2.3) * ripple;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255,255,255,.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // bubbles
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      for (const b of state.bubbles) { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke(); }
      // digit: dark above the water, light where the water covers it, riding the surface
      const mid = Math.floor(COLUMNS / 2);
      const rise = Math.max(0, Math.min(1.15, state.level));
      const cy = S / 2 + (1 - Math.min(1, rise)) * S * 0.05 + state.h[mid] * 0.5 + (state.reduced ? 0 : Math.sin(state.time * 2.1) * 0.8 * rise);
      const draw1 = (color) => {
        ctx.save();
        ctx.translate(S / 2, cy + 1);
        ctx.rotate(state.slosh * 0.9);
        ctx.font = `${digit.fontWeight} ${digit.fontSize} ${digit.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(String(value), 0, 0);
        ctx.restore();
      };
      draw1(ink);
      ctx.save();
      surfacePath(S, top, state.time * 2.3, ripple);
      ctx.clip();
      draw1('#fffdf8');
      ctx.restore();
    }

    function step() {
      state.time += 0.016;
      // level climbs at a steady, slow rate (about 4.6s from empty to full) and drains faster
      const want = Math.max(-FILL_DRAIN, Math.min(FILL_RATE, state.target - state.level));
      state.levelV += (want - state.levelV) * 0.08;
      state.level = Math.max(0, Math.min(1, state.level + state.levelV));
      state.sloshV += -state.slosh * 0.06 - state.sloshV * 0.035 + state.levelV * 0.01 * Math.sin(state.time * 3);
      state.slosh += state.sloshV;
      for (let i = 0; i < COLUMNS; i++) {
        state.v[i] += -TENSION * state.h[i] - DAMPING * state.v[i];
        state.h[i] += state.v[i];
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < COLUMNS; i++) {
          if (i > 0) { const d = SPREAD * (state.h[i] - state.h[i - 1]); state.v[i - 1] += d; state.h[i - 1] += d; }
          if (i < COLUMNS - 1) { const d = SPREAD * (state.h[i] - state.h[i + 1]); state.v[i + 1] += d; state.h[i + 1] += d; }
        }
      }
      const S = state.size;
      if (state.target > 0 && state.level > 0.3 && state.bubbles.length < 7 && Math.random() < 0.05) {
        state.bubbles.push({ x: S * (0.25 + Math.random() * 0.5), y: S - 2, r: 1 + Math.random() * 1.8, vy: 0.35 + Math.random() * 0.55, wob: Math.random() * 6 });
      }
      const top = S * 1.06 - state.level * S;
      state.bubbles = state.bubbles.filter((b) => {
        b.y -= b.vy;
        b.x += Math.sin(state.time * 4 + b.wob) * 0.25;
        if (b.y - b.r <= top) { const i = Math.max(0, Math.min(COLUMNS - 1, Math.round((b.x / S) * (COLUMNS - 1)))); state.v[i] += 0.6; return false; }
        return true;
      });
    }

    function energy() {
      let e = Math.abs(state.levelV) * 50 + Math.abs(state.target - state.level) * 50 + Math.abs(state.sloshV) * 50 + Math.abs(state.slosh) * 50;
      for (let i = 0; i < COLUMNS; i++) e += Math.abs(state.h[i]) + Math.abs(state.v[i]);
      return e;
    }

    function loop() {
      step();
      draw();
      if (state.target > 0 || state.bubbles.length || energy() > 0.05) state.raf = requestAnimationFrame(loop);
      else { state.raf = 0; state.level = state.target; state.h.fill(0); state.v.fill(0); state.slosh = 0; draw(); }
    }
    state.start = () => { if (!state.raf) state.raf = requestAnimationFrame(loop); };
    state.redraw = draw;

    resize();
    setReady(true);
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    document.fonts?.ready.then(draw);
    return () => { cancelAnimationFrame(state.raf); observer.disconnect(); };
  }, [value]);

  useEffect(() => {
    const state = sim.current;
    if (!state) return;
    state.active = active;
    state.target = filled ? 1 : 0;
    if (state.reduced) { state.level = state.target; state.redraw(); return; }
    if (filled && active) {
      // a splash as the water rushes in
      state.sloshV += 0.004;
    } else if (!filled) {
      state.sloshV -= 0.006;
    }
    state.start();
  }, [active, filled, ready]);

  return <span className={`process-number${ready ? ' has-canvas' : ''}`} ref={wrap} aria-hidden="true"><b>{value}</b><canvas ref={canvas} /></span>;
}
