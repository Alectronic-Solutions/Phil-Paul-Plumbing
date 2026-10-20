// Display settings shared by the settings panel, the boot script in pages/_document.jsx, the cookie policy, and the tests.
// No browser APIs at module scope.
//
// Each setting becomes a `data-display-<id>` attribute on <html>, and styles/polish.css does the rest.
// The first value of each setting is the default, which sets no attribute.
// Choices are kept in this browser's local storage, only after the visitor changes one, and listed in the cookie policy.
export const displayKey = 'pp_display';

export const displaySettings = [
  { id: 'text', label: 'Text size', values: ['0', '1', '2'], options: ['Default', 'Larger', 'Largest'] },
  { id: 'spacing', label: 'Text spacing', description: 'More room between lines, words, and letters.', values: ['0', 'on'] },
  { id: 'font', label: 'Simpler font', description: 'Plain headings without condensed or all-caps letters.', values: ['0', 'on'] },
  { id: 'contrast', label: 'High contrast', description: 'Darker text and stronger borders.', values: ['0', 'on'] },
  { id: 'links', label: 'Underline links', description: 'Make every link and button easy to spot.', values: ['0', 'on'] },
  { id: 'motion', label: 'Stop motion', description: 'Turn off animations and the moving reviews.', values: ['0', 'on'] },
  { id: 'cursor', label: 'Bigger pointer', description: 'A larger mouse pointer.', values: ['0', 'on'] },
];

const allowed = Object.fromEntries(displaySettings.map(s => [s.id, s.values]));
export const defaultDisplay = Object.fromEntries(displaySettings.map(s => [s.id, s.values[0]]));
export const attribute = id => `data-display-${id}`;

// Unknown keys and values are dropped, so a tampered or outdated entry can only fall back to the defaults.
export function parseDisplay(raw) {
  let value;
  try { value = JSON.parse(raw || '{}'); } catch { return { ...defaultDisplay }; }
  const result = { ...defaultDisplay };
  if (value && typeof value === 'object') for (const [id, v] of Object.entries(value)) if (allowed[id]?.includes(v)) result[id] = v;
  return result;
}

// Only settings that differ from the default are stored. Returns null when everything is default.
export function serializeDisplay(settings) {
  const changed = Object.fromEntries(Object.entries(settings).filter(([id, v]) => allowed[id]?.includes(v) && v !== defaultDisplay[id]));
  return Object.keys(changed).length ? JSON.stringify(changed) : null;
}

// Attributes for <html>. Defaults are left off.
export function displayAttributes(settings) {
  return Object.fromEntries(Object.entries(parseDisplay(JSON.stringify(settings))).filter(([id, v]) => v !== defaultDisplay[id]).map(([id, v]) => [attribute(id), v]));
}

// Runs in <head> before the page paints, so saved settings never flash. Its hash is added to the CSP by scripts/finalize-headers.mjs.
export const bootScript = `(function(){try{var a=${JSON.stringify(allowed)},s=JSON.parse(localStorage.getItem(${JSON.stringify(displayKey)})||'{}'),d=document.documentElement;for(var k in s)if(a[k]&&a[k].indexOf(s[k])>0)d.setAttribute('data-display-'+k,s[k])}catch(e){}})()`;
