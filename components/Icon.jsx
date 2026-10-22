const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    phone: <path d="m7 3 3 5-2.5 2c1.2 3.1 3.4 5.3 6.5 6.5L16 14l5 3-.7 3.1c-.2.9-1 1.5-1.9 1.4C9.9 20.7 3.3 14.1 2.5 5.6c-.1-.9.5-1.7 1.4-1.9L7 3Z" />,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    shield: <><path d="m12 2 8 3v6c0 5-8 10-8 10S4 16 4 11V5l8-3Z" /><path d="m8 11 3 3 5-5" /></>,
    star: <path d="m12 2 3 6 7 1-5 5 1.2 7-6.2-3.4L5.8 21 7 14 2 9l7-1 3-6Z" />,
    heater: <><rect x="6" y="5" width="12" height="16" rx="3" /><path d="M9 5V2m6 3V2M9 18h6m-6-9h6" /><circle cx="12" cy="13" r="1" /></>,
    drain: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m5.5 5.5 3 3m7 7 3 3m-13 0 3-3m7-7 3-3" /></>,
    wrench: <path d="m14 5 3 3 4-4a6 6 0 0 1-7 8L6 20a2.1 2.1 0 0 1-3-3l8-8a6 6 0 0 1 8-7l-5 3Z" />,
    pipe: <path d="M3 4h7v8h11v8H6V9H3V4Zm0-2v9m18-1v12m-9-10v8" />,
    building: <path d="M4 22V3h13v7h4v12H4Zm6 0v-5h5v5M8 7h1m4 0h1M8 12h1m4 0h1" />,
    drop: <><path d="M12 2S4 10 4 15a8 8 0 0 0 16 0c0-5-8-13-8-13Z" /><path d="M8 15a4 4 0 0 0 4 4" /></>,
    jet: <path d="m3 13 7-7 4 4-7 7-4-4Zm8-8 3-3 8 8-3 3M16 16l3 3m-8-2v4m7-9h4" />,
    camera: <><rect x="3" y="6" width="14" height="12" rx="2" /><path d="m17 10 5-3v10l-5-3" /><circle cx="10" cy="12" r="3" /></>,
    flame: <path d="M13 2c2 6-4 6-1 10 2-1 3-3 3-5 5 5 6 8 4 12-2 4-10 4-13 0-3-4 0-9 3-12-1 4 0 5 1 6 3-3 1-7 3-11Z" />,
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    pause: <path d="M9 5v14M15 5v14" />,
    play: <path d="m8 4 12 8-12 8V4Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    tag: <><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" /><circle cx="8" cy="8" r="1.4" /></>,
    help: <><circle cx="12" cy="12" r="10" /><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4M12 17.6v.1" /></>,
    accessibility: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="7" r="1.4" fill="currentColor" stroke="none" /><path d="M7 9.6c3.3.9 6.7.9 10 0M12 10.3V14m0 0-2.6 4.2M12 14l2.6 4.2" /></>,
};

export function Icon({ name = 'arrow', size = 24, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}

// Premium 3D service glyphs (no background tile). Each is a hand-built solid object: gradient bodies, bevels, gloss and a contact shadow.
const solid = {
  recirc: <>
    <circle cx="16" cy="16" r="12.5" fill="url(#g-steelH)" />
    <circle cx="16" cy="16" r="9" fill="url(#g-wine)" />
    <path d="M10.5 15.5a5.6 5.6 0 0 1 9.6-2.6M21.5 16.5a5.6 5.6 0 0 1-9.6 2.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <path d="M21 9.6v4h-4M11 22.4v-4h4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10c1.6-3 4.2-4.8 7.4-5.4" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </>,
  sump: <>
    <rect x="13.5" y="2.5" width="5" height="6" rx="1.6" fill="url(#g-copper)" />
    <rect x="8" y="7.5" width="16" height="13" rx="5" fill="url(#g-wine)" />
    <rect x="10.5" y="20" width="11" height="4" rx="1.6" fill="url(#g-steel)" />
    <path d="M10.5 11c.6-1.6 1.6-2.4 3-2.8" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M3 28.5c2-1.8 3.4 1.2 5.4 0s3.4-1.8 5.4 0 3.4 1.2 5.4 0 3.4-1.8 5.4 0 3.4 1.2 5.4 0" stroke="url(#g-blue)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <circle cx="16" cy="14" r="2.4" fill="url(#g-steel)" />
  </>,
  bath: <>
    <path d="M5 4.5h2.4c1.6 0 2.6 1 2.6 2.6" fill="none" stroke="url(#g-steel)" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M2.5 14h27v2c0 5.6-3.4 9.5-8.5 9.5H11C5.9 25.5 2.5 21.6 2.5 16Z" fill="url(#g-steelH)" />
    <path d="M2.5 14h27" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <path d="M5.5 17c.4 3 2 5 4.5 5.5" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <rect x="6" y="25.2" width="3.6" height="3.2" rx="1.2" fill="url(#g-wine)" /><rect x="22.4" y="25.2" width="3.6" height="3.2" rx="1.2" fill="url(#g-wine)" />
    <path d="M9 9.5c-1 1.4-1.2 2.6 0 2.6s1-1.2 0-2.6Z" fill="url(#g-blue)" />
  </>,
  valve: <>
    <rect x="2" y="17" width="28" height="7.5" rx="2.8" fill="url(#g-copper)" />
    <rect x="11" y="11.5" width="10" height="16.5" rx="3.2" fill="url(#g-steelH)" />
    <rect x="14.4" y="6" width="3.2" height="6" rx="1" fill="url(#g-steel)" />
    <rect x="7" y="2.5" width="18" height="5" rx="2.5" fill="url(#g-wine)" />
    <path d="M9 4.200h9" stroke="#fff" strokeOpacity=".75" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M3.5 19h6" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" strokeLinecap="round" />
  </>,
  faucet: <>
    <rect x="12" y="2.5" width="8" height="5.5" rx="2.2" fill="url(#g-wine)" />
    <rect x="13.6" y="7" width="4.8" height="6" fill="url(#g-steelH)" />
    <path d="M16 11.500h9.5q3 0 3 3.200v3.8" fill="none" stroke="url(#g-steel)" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10.600h9.6" stroke="#fff" strokeOpacity=".8" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M28.5 22.500c-1.6 2.2-1.8 4-0 4s1.6-1.8 0-4Z" fill="url(#g-blue)" />
    <rect x="3" y="12.5" width="9.5" height="4.6" rx="2.3" fill="url(#g-copper)" />
  </>,
  sprinkler: <>
    <rect x="13.6" y="14" width="4.8" height="13" rx="1.6" fill="url(#g-steelH)" />
    <rect x="11.5" y="9" width="9" height="6.5" rx="2.6" fill="url(#g-wine)" />
    <path d="M12.8 10.500h5" stroke="#fff" strokeOpacity=".7" strokeWidth="1.1" strokeLinecap="round" />
    <g stroke="url(#g-blue)" strokeWidth="2.2" strokeLinecap="round" fill="none"><path d="M16 6V2.800M10 7.2 7.5 4.800M22 7.200l2.5-2.400M7 11.2 3.5 10.200M25 11.200l3.5-1" /></g>
    <path d="M7 28.500c2.5-1.6 4.5 1 9 0s6.5-1.8 9 0" stroke="#2f7a3c" strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </>,
  heater: <>
    <rect x="12" y="2.5" width="2.6" height="5" rx="1" fill="url(#g-copper)" /><rect x="17.4" y="2.5" width="2.6" height="5" rx="1" fill="url(#g-copper)" />
    <rect x="7" y="6" width="18" height="22" rx="6" fill="url(#g-steelH)" />
    <path d="M7 11h18M7 24h18" stroke="#8a93a0" strokeWidth=".8" opacity=".6" />
    <circle cx="16" cy="17.5" r="3.6" fill="url(#g-wine)" stroke="#3f0a15" strokeWidth=".5" /><path d="M16 15.2v2.6" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
    <rect x="9" y="26.5" width="14" height="3" rx="1.5" fill="url(#g-wine)" />
    <path d="M9.5 10c.5-2 1.6-3 3.2-3.4" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </>,
  drain: <>
    <circle cx="16" cy="16" r="13" fill="url(#g-wine)" />
    <circle cx="16" cy="16" r="9.2" fill="none" stroke="#fff" strokeWidth="4.2" strokeDasharray="7.2 7.2" strokeDashoffset="3.6" opacity=".95" />
    <circle cx="16" cy="16" r="5.4" fill="url(#g-steel)" /><circle cx="16" cy="16" r="3.4" fill="#2a0610" />
    <path d="M6.5 9c1.6-3 4.4-4.8 7.8-5" stroke="#fff" strokeOpacity=".7" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </>,
  wrench: <g transform="rotate(-45 16 16)">
    <g mask="url(#m-wr)"><circle cx="8.5" cy="16" r="6.6" fill="url(#g-steel)" /></g>
    <rect x="12" y="13.6" width="17" height="4.8" rx="2.4" fill="url(#g-steel)" />
    <circle cx="26.5" cy="16" r="1" fill="url(#g-wine)" />
    <path d="M11 14.2h16" stroke="#fff" strokeOpacity=".9" strokeWidth="1" strokeLinecap="round" />
  </g>,
  pipe: <>
    <path d="M8 6v13q0 6 6 6h11" fill="none" stroke="#5a2f10" strokeWidth="8" transform="translate(.6 1)" opacity=".4" />
    <path d="M8 6v13q0 6 6 6h11" fill="none" stroke="url(#g-copper)" strokeWidth="7" />
    <path d="M6.2 6v13q0 4.8 4.8 4.8h10" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="3.5" y="3" width="9" height="4" rx="1.4" fill="url(#g-steel)" /><rect x="23" y="20.5" width="4" height="9" rx="1.4" fill="url(#g-steel)" />
  </>,
  building: <>
    <path d="M6 9 18 4v24H6Z" fill="url(#g-wine)" /><path d="M18 4l8 4v20h-8Z" fill="#3f0a15" />
    <g fill="#fff" fillOpacity=".9"><rect x="8.5" y="10" width="2.6" height="2.4" rx=".5" /><rect x="13" y="8.4" width="2.6" height="2.4" rx=".5" /><rect x="8.5" y="15" width="2.6" height="2.4" rx=".5" /><rect x="13" y="13.4" width="2.6" height="2.4" rx=".5" /><rect x="8.5" y="20" width="2.6" height="2.4" rx=".5" /><rect x="13" y="18.4" width="2.6" height="2.4" rx=".5" /></g>
    <g fill="#fff" fillOpacity=".4"><rect x="20.2" y="11" width="2" height="2" rx=".4" /><rect x="20.2" y="16" width="2" height="2" rx=".4" /><rect x="20.2" y="21" width="2" height="2" rx=".4" /></g>
    <path d="M6 9 18 4" stroke="#fff" strokeOpacity=".7" strokeWidth="1" strokeLinecap="round" />
  </>,
  drop: <>
    <path d="M16 2.5S6 13 6 19.5a10 10 0 0 0 20 0C26 13 16 2.5 16 2.5Z" fill="url(#g-blue)" />
    <path d="M10.3 19.5a5.7 5.7 0 0 0 4.2 5.4" stroke="#fff" strokeOpacity=".85" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <ellipse cx="13" cy="13.2" rx="1.6" ry="3.4" transform="rotate(28 13 13.2)" fill="#fff" fillOpacity=".55" />
  </>,
  jet: <>
    <g transform="rotate(-35 16 16)">
      <rect x="2" y="13.4" width="9" height="5.2" rx="2.4" fill="url(#g-copper)" />
      <rect x="10" y="11.4" width="9" height="9.2" rx="2.4" fill="url(#g-wine)" />
      <path d="M19 13.2h5l2 2.8-2 2.8h-5Z" fill="url(#g-steel)" />
      <path d="M11.6 12.6h6.4" stroke="#fff" strokeOpacity=".7" strokeWidth="1" strokeLinecap="round" />
    </g>
    <g stroke="url(#g-blue)" strokeWidth="2" strokeLinecap="round" fill="none"><path d="M23 14.5 29 12.5M24 18h6M23 21.5l6 2" /></g>
  </>,
  camera: <>
    <rect x="3" y="9" width="21" height="16" rx="4.5" fill="url(#g-wine)" />
    <path d="M24 14.5 30 11v10l-6-3.5Z" fill="url(#g-steel)" />
    <circle cx="13.5" cy="17" r="6" fill="url(#g-steel)" /><circle cx="13.5" cy="17" r="4.2" fill="#12060a" /><circle cx="13.5" cy="17" r="2.2" fill="#1b4f7a" />
    <circle cx="12.4" cy="15.9" r="1" fill="#fff" fillOpacity=".9" />
    <circle cx="20.5" cy="12.6" r="1.1" fill="#ff5a5a" />
    <path d="M6 12.2c1-1 2-1.4 3.4-1.4" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </>,
  pin: <>
    <ellipse cx="16" cy="28.4" rx="5" ry="1.6" fill="#2e0710" opacity=".35" />
    <path d="M16 2C9.9 2 5.5 6.5 5.5 12.2 5.5 19.5 16 28.5 16 28.5s10.5-9 10.5-16.3C26.5 6.5 22.1 2 16 2Z" fill="url(#g-wine)" />
    <circle cx="16" cy="12" r="4.6" fill="url(#g-steel)" /><circle cx="16" cy="12" r="2.4" fill="#3f0a15" />
    <path d="M9.4 8.6C10.6 5.9 13 4.3 15.6 4.1" stroke="#fff" strokeOpacity=".75" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </>,
  star: <>
    <ellipse cx="16" cy="29" rx="7" ry="1.4" fill="#2e0710" opacity=".3" />
    <path d="m16 2.5 3.8 7.8 8.6 1.2-6.2 6 1.5 8.5L16 21.9l-7.7 4.1 1.5-8.5-6.2-6 8.6-1.2L16 2.5Z" fill="url(#g-copper)" stroke="#7a4018" strokeWidth=".6" strokeLinejoin="round" />
    <path d="m16 2.5 3.8 7.8-3.8 1.4-3.8-1.4L16 2.5Z" fill="#fff" fillOpacity=".4" />
    <path d="M9.5 11.6 6 12.8" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" />
  </>,
  help: <>
    <ellipse cx="16" cy="29.2" rx="8" ry="1.4" fill="#2e0710" opacity=".3" />
    <circle cx="16" cy="15.5" r="13" fill="url(#g-wine)" />
    <path d="M11.8 13a4.3 4.3 0 0 1 8.4 1.2c0 2.8-4.2 3.2-4.2 6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="16" cy="24" r="1.6" fill="#fff" />
    <path d="M6.6 9c1.6-3 4.4-4.8 7.8-5" stroke="#fff" strokeOpacity=".65" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </>,
  shield: <>
    <ellipse cx="16" cy="29.4" rx="6" ry="1.3" fill="#2e0710" opacity=".3" />
    <path d="M16 2 4.5 6v9c0 7 5.2 11.6 11.5 14 6.3-2.4 11.5-7 11.5-14V6L16 2Z" fill="url(#g-steelH)" stroke="#6c7684" strokeWidth=".6" strokeLinejoin="round" />
    <path d="M16 5.2 7.5 8.2V15c0 5.2 3.7 8.8 8.5 10.8 4.8-2 8.5-5.6 8.5-10.8V8.2L16 5.2Z" fill="url(#g-wine)" />
    <path d="m11.3 15.4 3.4 3.4 6-6.4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.6 9.6 16 6.8" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" strokeLinecap="round" />
  </>,
  check: <>
    <ellipse cx="16" cy="29.2" rx="8" ry="1.4" fill="#2e0710" opacity=".3" />
    <path d="M11 22 8.5 30l4-2 2.5 2.4 1.4-8Z" fill="#4d0f1b" /><path d="M21 22l2.5 8-4-2-2.5 2.4-1.4-8Z" fill="url(#g-wine)" />
    <g fill="url(#g-copper)" stroke="#7a4018" strokeWidth=".4">{Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <circle key={i} cx={(16 + 10.2 * Math.cos(a)).toFixed(2)} cy={(14 + 10.2 * Math.sin(a)).toFixed(2)} r="4.1" />; })}<circle cx="16" cy="14" r="10.6" stroke="none" /></g>
    <circle cx="16" cy="14" r="8.2" fill="url(#g-wine)" stroke="#fff" strokeOpacity=".5" strokeWidth=".8" />
    <path d="m11.6 14.2 3.2 3.2 5.8-6.2" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.6 9.6c1.2-2 3-3.2 5.2-3.6" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" strokeLinecap="round" fill="none" />
  </>,
  tag: <>
    <ellipse cx="16" cy="29.4" rx="6" ry="1.3" fill="#2e0710" opacity=".3" />
    <path d="M3.5 15.5V5.5a2 2 0 0 1 2-2h10l12 12-12 12-12-12Z" fill="url(#g-copper)" stroke="#7a4018" strokeWidth=".6" strokeLinejoin="round" />
    <circle cx="10" cy="10" r="2.6" fill="url(#g-wine)" /><circle cx="9.4" cy="9.4" r=".9" fill="#fff" fillOpacity=".8" />
    <path d="M6 5.4h9.4l9 9" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </>,
  phone: <>
    <ellipse cx="16" cy="29.4" rx="7" ry="1.3" fill="#2e0710" opacity=".3" />
    <g transform="translate(2 2) scale(1.1)"><path d="m7 3 3 5-2.5 2c1.2 3.1 3.4 5.3 6.5 6.5L16 14l5 3-.7 3.1c-.2.9-1 1.5-1.9 1.4C9.9 20.7 3.3 14.1 2.5 5.6c-.1-.9.5-1.7 1.4-1.9L7 3Z" fill="url(#g-wine)" stroke="#3c0a15" strokeWidth=".6" strokeLinejoin="round" /><path d="M4.2 4.6 7 3.8l2 3.4" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth=".8" strokeLinecap="round" /></g>
  </>,
  flame: <>
    <path d="M17 2c2.4 6.6-5.8 8-2.6 14 1.8-.8 3-2.6 3-4.8C23.8 16.4 26 20 24 24.6 22 29 9 29 6.6 23.6 4 18 9 12 11.6 9c-1.4 4.6-.4 6.6 1 7.8C15.6 14 13.4 8 17 2Z" fill="url(#g-fire)" />
    <path d="M16 15c1.6 3.6 5 4.8 4.2 9-.6 3-6 3.6-7.6.6-1.6-3 1.6-5.2 3.4-9.6Z" fill="url(#g-flame-in)" />
  </>,
};

// Gradients and the wrench mask are defined once per page. Per-glyph copies produced duplicate ids, and a glyph inside a display:none
// ancestor (the closed nav dropdown) is the first match, which left every later glyph with unresolved fills.
export function Icon3DDefs() {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <defs>
      <linearGradient id="g-wine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e0566e" /><stop offset=".5" stopColor="#8a2233" /><stop offset="1" stopColor="#4d0f1b" /></linearGradient>
      <linearGradient id="g-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset=".45" stopColor="#cfd4dc" /><stop offset="1" stopColor="#7a8491" /></linearGradient>
      <linearGradient id="g-steelH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8b95a2" /><stop offset=".3" stopColor="#ffffff" /><stop offset=".65" stopColor="#c6ccd5" /><stop offset="1" stopColor="#6c7684" /></linearGradient>
      <linearGradient id="g-copper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd9a3" /><stop offset=".5" stopColor="#d28a4a" /><stop offset="1" stopColor="#7a4018" /></linearGradient>
      <linearGradient id="g-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9fe0ff" /><stop offset=".5" stopColor="#2a86d6" /><stop offset="1" stopColor="#0c3f7c" /></linearGradient>
      <linearGradient id="g-fire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9a3d" /><stop offset=".55" stopColor="#e63b22" /><stop offset="1" stopColor="#8a1020" /></linearGradient>
      <linearGradient id="g-flame-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0a0" /><stop offset="1" stopColor="#ffa23a" /></linearGradient>
    <mask id="m-wr"><rect width="32" height="32" fill="#fff" /><rect x="2" y="12.6" width="8" height="6.8" fill="#000" /></mask>
    </defs>
  </svg>;
}

export function Icon3D({ name = 'arrow', size = 28 }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" className="icon-3d" aria-hidden="true">
    {solid[name] || <g fill="none" stroke="#8a2233" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="scale(1.333)">{paths[name] || paths.arrow}</g>}
  </svg>;
}

// Solid, lit handset used beside phone numbers. No background disc: the depth comes from gradients and a soft shadow.
export function Phone3D({ size = 24 }) {
  const d = 'm7 3 3 5-2.5 2c1.2 3.1 3.4 5.3 6.5 6.5L16 14l5 3-.7 3.1c-.2.9-1 1.5-1.9 1.4C9.9 20.7 3.3 14.1 2.5 5.6c-.1-.9.5-1.7 1.4-1.9L7 3Z';
  return <svg width={size} height={size} viewBox="0 0 24 24" className="phone-3d" aria-hidden="true">
    <defs>
      <linearGradient id="pp3d-body" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#c0394f" /><stop offset=".5" stopColor="#8a2233" /><stop offset="1" stopColor="#4d0f1b" /></linearGradient>
      <linearGradient id="pp3d-shine" x1="5" y1="3" x2="13" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
    </defs>
    <path d={d} fill="url(#pp3d-body)" stroke="#3c0a15" strokeWidth=".6" strokeLinejoin="round" />
    <path d={d} fill="url(#pp3d-shine)" />
    <path d="M4.2 4.6 7 3.8l2 3.4" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth=".7" strokeLinecap="round" />
  </svg>;
}

export function BrandIcon({ name, size = 36 }) {
  if (name === 'google') return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#fff" /><g transform="translate(12 12) scale(.62) translate(-12 -12)"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" /></g></svg>;
  if (name === 'yelp') return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6.5" fill="#FF1A1A" /><g fill="#fff">{[[-10, 7, 1.9], [75, 3.8, 1.6], [145, 3.8, 1.6], [215, 3.8, 1.6], [285, 3.8, 1.6]].map(([a, len, w]) => <ellipse key={a} cx="12" cy={13.5 - 1.2 - len / 2} rx={w} ry={len / 2} transform={`rotate(${a} 12 13.5)`} />)}</g></svg>;
  if (name === 'nextdoor') return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6.5" fill="#00B246" /><path fill="#fff" d="M12 4.5 4.6 10.2c-.3.2-.4.6-.2.9.2.3.6.4.9.2l.7-.5V18c0 .6.4 1 1 1h9.9c.6 0 1-.4 1-1v-7.2l.7.5c.3.2.7.1.9-.2.2-.3.1-.7-.2-.9L12 4.5Zm0 4.2c1.3-1.3 3.4-.3 3.1 1.5-.2 1.1-1.5 2-3.1 3.1-1.6-1.100-2.900-2-3.100-3.100-.3-1.800 1.800-2.800 3.100-1.500Z" /></svg>;
  if (name === 'facebook') return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="fb-clip"><circle cx="12" cy="12" r="12" /></clipPath></defs><circle cx="12" cy="12" r="12" fill="#0866FF" /><path clipPath="url(#fb-clip)" fill="#fff" d="M15.12 24v-8.4h2.8l.43-3.3h-3.23v-2.1c0-.95.27-1.6 1.63-1.6h1.73V5.65a23 23 0 0 0-2.53-.13c-2.5 0-4.22 1.53-4.22 4.35v2.43H8.9v3.3h2.83V24Z" /></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="ig-grad" cx="30%" cy="107%" r="150%"><stop offset="0" stopColor="#fdf497" /><stop offset=".05" stopColor="#fdf497" /><stop offset=".45" stopColor="#fd5949" /><stop offset=".6" stopColor="#d6249f" /><stop offset=".9" stopColor="#285aeb" /></radialGradient></defs><rect width="24" height="24" rx="6.5" fill="url(#ig-grad)" /><rect x="5" y="5" width="14" height="14" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="16.1" cy="7.9" r="1.05" fill="#fff" /></svg>;
}
