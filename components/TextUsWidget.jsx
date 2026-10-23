// "Text us" widget: a floating launcher that opens a small form (name, mobile number, message). The request goes to our own
// /api/text-request endpoint, which hands it to the delivery webhook; our team then texts the visitor back.
// First-party only: no chat vendor, no stored conversations, no cookies or browser storage.
// Keep the consent label identical to TEXT_CONSENT.text in functions/api/[[route]].js (npm run verify checks this).
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { asset } from '../lib/asset.mjs';
import { business } from '../content/business.mjs';
import { Icon } from './Icon';

export function TextUsWidget({ demo = false }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const launcher = useRef(null);
  const first = useRef(null);
  const form = useRef(null);
  const id = useId();

  useEffect(() => { if (open) first.current?.focus(); }, [open]);

  function close() { setOpen(false); launcher.current?.focus(); }

  async function submit(event) {
    event.preventDefault();
    if (state === 'sending' || !form.current.reportValidity()) return;
    if (demo) { setState('demo'); return; }
    setState('sending'); setMessage('');
    try {
      const response = await fetch('/api/text-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form.current))) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || `Your message could not be sent. Please call ${business.phone}.`);
      setState('success');
    } catch (error) { setState('error'); setMessage(error.message); }
  }

  const done = state === 'success' || state === 'demo';
  return <>
    <button type="button" ref={launcher} className="text-launcher" onClick={() => (open ? close() : setOpen(true))} aria-expanded={open} aria-controls={`${id}-panel`} aria-haspopup="dialog" aria-label={open ? 'Close text chat' : 'Text us'}>
      <Icon name={open ? 'close' : 'chat'} size={28} />
    </button>
    {open && <section id={`${id}-panel`} className="text-panel" role="dialog" aria-labelledby={`${id}-title`} onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      <header className="text-panel-head">
        <Icon name="chat" size={22} />
        <h2 id={`${id}-title`}>Get a quick response via text</h2>
        <button type="button" className="text-panel-close" onClick={close} aria-label="Close text chat"><Icon name="close" size={20} /></button>
      </header>
      <div className="text-panel-body">
        {done ? <div className="text-panel-done" role="status" aria-live="polite">
          <Icon name="check" size={34} />
          <h3>{state === 'demo' ? 'This is an example.' : 'We have your message.'}</h3>
          <p>{state === 'demo' ? 'This form is for demonstration only. Nothing was sent.' : 'Our team will text you back during business hours.'}</p>
          <button type="button" className="button button-outline" onClick={close}>Close</button>
        </div> : <>
          <p className="text-bubble">Enter your information, and our team will text you shortly.</p>
          <form ref={form} action={asset('/api/text-request')} method="post" onSubmit={submit}>
            <div className="text-row">
              <div className="form-field"><label htmlFor={`${id}-name`}>Name</label><input ref={first} id={`${id}-name`} name="Name" autoComplete="name" required maxLength={120} /></div>
              <div className="form-field"><label htmlFor={`${id}-phone`}>Mobile phone</label><input id={`${id}-phone`} name="Phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} placeholder="(209) 555-0123" /></div>
            </div>
            <div className="form-field"><label htmlFor={`${id}-message`}>Message</label><textarea id={`${id}-message`} name="Message" rows={2} required maxLength={2000} /></div>
            <div className="form-honeypot" aria-hidden="true"><label htmlFor={`${id}-url`}>Leave this empty</label><input id={`${id}-url`} name="Website" tabIndex={-1} autoComplete="off" /></div>
            <div className="consent-box"><label className="consent-label"><input type="checkbox" name="Opt-In" required /><span>I agree to the <Link className="nowrap" href={business.terms} target="_blank">Terms and Conditions</Link> and <Link className="nowrap" href={business.privacy} target="_blank">Privacy Policy</Link>, and I authorize Phil and Paul&apos;s Plumbing, Inc. to text and call me at this number about my message, including by automated means.</span></label>
            <ul className="consent-points"><li>Consent is not a condition of purchase.</li><li>Msg &amp; data rates may apply.</li><li>Message frequency varies.</li><li>Reply HELP for help or STOP to unsubscribe.</li></ul></div>
            {state === 'error' && <div className="form-error" role="alert"><strong>Your message has not been sent.</strong><p>{message}</p></div>}
            <button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send'}</button>
          </form>
          <p className="text-emergency">Gas smell or flooding? Call 911 or your utility first,<br />then <a href={`tel:${business.telephone}`}>call us at <span className="nowrap">{business.phone}</span></a>.</p>
        </>}
        <p className="text-license">CA License {business.license}</p>
      </div>
    </section>}
  </>;
}
