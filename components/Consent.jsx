// Cookie consent manager. The only component allowed to read or write cookies or load third-party scripts.
// Nothing optional loads until the visitor opts in. With no enabled integrations, no banner appears and no cookie is set.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { business } from '../content/business.mjs';
import { categories, activeIntegrations } from '../content/integrations.mjs';
import { categoriesInUse, offeredCategories, applySignals, parseConsent, serializeConsent, consentCookieString, needsChoice, permissions, acceptAll, rejectAll, allowedIntegrations, revokedIntegrations, cookieMatcher } from '../lib/consent.mjs';
import { Icon } from './Icon';

const ConsentContext = createContext({ openPreferences: () => {} });
const inUse = categoriesInUse(activeIntegrations);
const offered = offeredCategories(activeIntegrations);
const list = items => new Intl.ListFormat('en', { type: 'conjunction' }).format(items);

function readSignals() {
  return { gpc: typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true };
}

function removeCookies(integrations) {
  const patterns = integrations.flatMap(item => item.cookies.map(cookie => cookieMatcher(cookie.name)));
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  for (const name of document.cookie.split(/;\s*/).map(part => part.split('=')[0]).filter(Boolean)) {
    if (!patterns.some(pattern => pattern.test(name))) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`;
  }
}

export function ConsentProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [stored, setStored] = useState(null);
  const [signals, setSignals] = useState({ gpc: false });
  const [draft, setDraft] = useState(rejectAll());
  const dialog = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    const current = parseConsent(document.cookie);
    const detected = readSignals();
    setStored(current); setSignals(detected); setDraft(permissions(current, detected)); setReady(true);
  }, []);

  const granted = permissions(stored, signals);

  const save = useCallback(choice => {
    const before = permissions(stored, signals);
    const after = applySignals(choice, signals);
    const value = serializeConsent(after);
    document.cookie = consentCookieString(value, { secure: location.protocol === 'https:' });
    const saved = parseConsent(document.cookie);
    setStored(saved); setDraft(permissions(saved, signals));
    dialog.current?.open && dialog.current.close();
    const revoked = revokedIntegrations(activeIntegrations, before, after);
    // Scripts that already ran cannot be unloaded, so remove their cookies and start a clean page.
    if (revoked.length) { removeCookies(revoked); location.reload(); }
  }, [stored, signals]);

  const openPreferences = useCallback(event => {
    returnFocus.current = event?.currentTarget || document.activeElement;
    setDraft(permissions(stored, signals));
    dialog.current?.showModal();
  }, [stored, signals]);

  const onClose = () => { returnFocus.current?.focus?.(); };
  const showBanner = ready && needsChoice(stored, activeIntegrations);
  const loaded = ready ? allowedIntegrations(activeIntegrations, granted) : [];

  return <ConsentContext.Provider value={{ openPreferences }}>
    {children}
    {loaded.flatMap(item => item.scripts.map((script, i) => script.src
      ? <Script key={`${item.id}-${i}`} id={`${item.id}-${i}`} src={script.src} strategy="afterInteractive" />
      : <Script key={`${item.id}-${i}`} id={`${item.id}-${i}`} strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: script.inline }} />))}
    {showBanner && <section className="consent-banner" aria-labelledby="consent-banner-title">
      <div className="consent-banner-copy">
        <h2 id="consent-banner-title">Your privacy choices</h2>
        <p>{inUse.length
          ? <>With your permission, we use {list(inUse.map(c => categories[c].short))} cookies from other companies. Nothing optional runs unless you allow it.</>
          : <>We use one cookie to remember this choice. Optional {list(offered.map(c => categories[c].short))} cookies stay off unless you allow them.</>} See our <Link href="/cookie-policy">Cookie Policy</Link>.{signals.gpc && ' Your browser’s Global Privacy Control signal is on, so advertising cookies stay off.'}</p>
      </div>
      <div className="consent-actions">
        <button type="button" className="button consent-choice" onClick={() => save(rejectAll())}>Reject all</button>
        <button type="button" className="button consent-choice" onClick={() => save(acceptAll(signals))}>Accept all</button>
        <button type="button" className="consent-customize" onClick={openPreferences}>Customize</button>
      </div>
    </section>}
    <dialog className="consent-dialog" ref={dialog} aria-labelledby="consent-dialog-title" onClose={onClose}>
      <div className="consent-dialog-head">
        <h2 id="consent-dialog-title">Your privacy choices</h2>
        <button type="button" className="consent-close" onClick={() => dialog.current.close()} aria-label="Close privacy choices"><Icon name="close" size={22} /></button>
      </div>
      {offered.length === 0 ? <div className="consent-dialog-body">
        <p>This website does not use analytics, advertising, or other optional cookies, and it does not load tracking tools from other companies. There is nothing to turn on or off.</p>
        <p>If that changes, we will ask for your permission first. Read our <Link href="/cookie-policy">Cookie Policy</Link> and <Link href={business.privacy}>Privacy Policy</Link>, or call {business.phone} with any questions.</p>
        <div className="consent-dialog-actions"><button type="button" className="button button-primary" onClick={() => dialog.current.close()}>Close</button></div>
      </div> : <form className="consent-dialog-body" onSubmit={event => { event.preventDefault(); save(draft); }}>
        <p>Choose which optional cookies we may use. You can change this at any time from the “Your Privacy Choices” link at the bottom of every page.</p>
        {signals.gpc && <p className="consent-signal"><Icon name="shield" size={18} />We detected a Global Privacy Control signal from your browser. Advertising cookies stay off.</p>}
        <div className="consent-category">
          <div className="consent-category-head"><h3>Strictly necessary</h3><span className="consent-always">Always on</span></div>
          <p>Remember your privacy choices. They do not track you and cannot be turned off.</p>
        </div>
        {offered.map(category => {
          const locked = category === 'marketing' && signals.gpc;
          const tools = activeIntegrations.filter(item => item.category === category);
          return <div className="consent-category" key={category}>
            <div className="consent-category-head">
              <h3 id={`consent-${category}-label`}>{categories[category].name}</h3>
              <label className="consent-switch"><input type="checkbox" role="switch" aria-labelledby={`consent-${category}-label`} aria-describedby={`consent-${category}-description`} checked={!locked && draft[category]} disabled={locked} onChange={event => setDraft({ ...draft, [category]: event.target.checked })} /></label>
            </div>
            <p id={`consent-${category}-description`}>{categories[category].description}</p>
            {tools.length
              ? <ul>{tools.map(item => <li key={item.id}><strong>{item.name}</strong> ({item.provider}): {item.purpose} <a href={item.privacyUrl} target="_blank" rel="noopener noreferrer">Privacy policy</a></li>)}</ul>
              : <p className="consent-empty">Nothing in this category is in use right now.</p>}
          </div>;
        })}
        <div className="consent-dialog-actions">
          <button type="button" className="button consent-choice" onClick={() => save(rejectAll())}>Reject all</button>
          <button type="button" className="button consent-choice" onClick={() => save(acceptAll(signals))}>Accept all</button>
          <button type="submit" className="button button-primary">Save choices</button>
        </div>
      </form>}
    </dialog>
  </ConsentContext.Provider>;
}

export function PrivacyChoicesButton() {
  const { openPreferences } = useContext(ConsentContext);
  return <button type="button" className="privacy-choices" onClick={openPreferences}>Your Privacy Choices</button>;
}
