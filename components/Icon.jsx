export function Icon({ name = 'arrow', size = 24, className = '' }) {
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
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}

