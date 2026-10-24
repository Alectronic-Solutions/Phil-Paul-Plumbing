// Display settings: text size, spacing, contrast, and similar options built into the site. No third-party code.
// The settings only restyle the page (see the [data-display-*] rules in styles/polish.css). They do not change the
// markup, so screen readers and other assistive technology get the same page either way.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { business } from '../content/company.mjs';
import { displayKey, displaySettings, defaultDisplay, parseDisplay, serializeDisplay, displayAttributes, attribute } from '../lib/display.mjs';
import { Icon } from './Icon';

const DisplayContext = createContext({ open: () => {}, motionOff: false });
const [textSize, ...toggles] = displaySettings;

function store(settings) {
  try {
    const value = serializeDisplay(settings);
    if (value) localStorage.setItem(displayKey, value); else localStorage.removeItem(displayKey);
  } catch { /* Storage blocked: the settings still apply until the page is closed. */ }
}

export function DisplaySettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultDisplay);
  const dialog = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    let raw = null;
    try { raw = localStorage.getItem(displayKey); } catch { /* Storage blocked. */ }
    setSettings(parseDisplay(raw));
  }, []);

  const update = useCallback(next => {
    const root = document.documentElement;
    for (const setting of displaySettings) root.removeAttribute(attribute(setting.id));
    for (const [name, value] of Object.entries(displayAttributes(next))) root.setAttribute(name, value);
    setSettings(next); store(next);
  }, []);

  const open = useCallback(event => {
    returnFocus.current = event?.currentTarget || document.activeElement;
    dialog.current?.showModal();
  }, []);

  const changed = serializeDisplay(settings) !== null;

  return <DisplayContext.Provider value={{ open, motionOff: settings.motion === 'on' }}>
    {children}
    <dialog className="consent-dialog display-dialog" ref={dialog} aria-labelledby="display-dialog-title" onClose={() => returnFocus.current?.focus?.()}>
      <div className="consent-dialog-head">
        <h2 id="display-dialog-title">Display settings</h2>
        <button type="button" className="consent-close" onClick={() => dialog.current.close()} aria-label="Close display settings"><Icon name="close" size={22} /></button>
      </div>
      <div className="consent-dialog-body">
        <p>Changes apply right away and stay on as you browse this site in this browser.</p>
        <fieldset className="display-size">
          <legend>{textSize.label}</legend>
          <div>{textSize.values.map((value, i) => <label key={value} className={settings.text === value ? 'selected' : ''}>
            <input type="radio" name="display-text" value={value} checked={settings.text === value} onChange={() => update({ ...settings, text: value })} />
            <span style={{ fontSize: `${15 + i * 3}px` }}>{textSize.options[i]}</span>
          </label>)}</div>
        </fieldset>
        <div className="display-toggles">{toggles.map(setting => {
          const on = settings[setting.id] === setting.values[1];
          return <label className="display-toggle" key={setting.id}>
            <span><strong id={`display-${setting.id}-label`}>{setting.label}</strong><small id={`display-${setting.id}-description`}>{setting.description}</small></span>
            <input type="checkbox" role="switch" aria-labelledby={`display-${setting.id}-label`} aria-describedby={`display-${setting.id}-description`} checked={on} onChange={event => update({ ...settings, [setting.id]: setting.values[event.target.checked ? 1 : 0] })} />
          </label>;
        })}</div>
        <div className="consent-dialog-actions">
          <button type="button" className="button button-outline" onClick={() => update({ ...defaultDisplay })} disabled={!changed}>Reset all</button>
          <button type="button" className="button button-primary" onClick={() => dialog.current.close()}>Done</button>
        </div>
        <p className="display-help"><span>Still having trouble?</span> <span>Call <a href={`tel:${business.telephone}`}>{business.phone}</a></span> <span>or read our <Link href={business.accessibility}>Accessibility Statement</Link>.</span></p>
      </div>
    </dialog>
  </DisplayContext.Provider>;
}

export function useMotionOff() { return useContext(DisplayContext).motionOff; }

export function DisplayLauncher() {
  const { open } = useContext(DisplayContext);
  return <button type="button" className="display-launcher" onClick={open} aria-label="Display settings" aria-haspopup="dialog"><Icon name="accessibility" size={28} /></button>;
}

export function DisplaySettingsButton() {
  const { open } = useContext(DisplayContext);
  return <button type="button" className="display-settings-link" onClick={open} aria-haspopup="dialog">Display settings</button>;
}
