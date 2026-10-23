import { Fragment, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { asset } from '../lib/asset.mjs';
import { photoWidths } from '../lib/photos.mjs';
import { business, services, otherServices, commonFaqs, faqGroups, areaFaqs, contactFaqs, contactReady, cities, hoursSummary, openHours, sitemapPages } from '../content/business.mjs';
import { drafts, licensing, warranty, coupons } from '../content/drafts.mjs';
import { Icon, Icon3D, Icon3DDefs, BrandIcon, Phone3D } from './Icon';
import { Header, Brand } from './Navigation';
import { ServiceAreaMap } from './ServiceAreaMap';
import { Reviews } from './Reviews';
// Only the city landing pages and the reviews page use these. Loading them separately keeps the city map data
// and the review wall out of the script every other page downloads. They still render into the static HTML.
const CityCoverage = dynamic(() => import('./StocktonMap').then(m => m.CityCoverage));
const ReviewsWall = dynamic(() => import('./ReviewsWall').then(m => m.ReviewsWall));
const ReviewPhotos = dynamic(() => import('./ReviewsWall').then(m => m.ReviewPhotos));
import { InstagramFeed } from './InstagramFeed';
import { WaterNumber } from './WaterNumber';
import { WaterCard } from './WaterCard';
import { CrewPolaroids } from './CrewPolaroids';
import { ConsentProvider, PrivacyChoicesButton } from './Consent';
import { DisplaySettingsProvider, DisplayLauncher, DisplaySettingsButton } from './DisplaySettings';
import { TextUsWidget } from './TextUsWidget';
export { Icon, Reviews };

// `sizes` values match the widths measured in the layout (page gutters are 20px a side on phones), so each
// screen downloads the smallest file that stays sharp. The default fits page heroes and other half-width photos.
export function Photo({ name, alt, className = '', priority = false, sizes = '(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 45vw, 576px', ...props }) {
  const srcSet = format => photoWidths.map(w => `${asset(`/images/${name}-${w}.${format}`)} ${w}w`).join(', ');
  return <>{priority && <Head><link key={`preload-${name}`} rel="preload" as="image" type="image/avif" imageSrcSet={srcSet('avif')} imageSizes={sizes} fetchPriority="high" /></Head>}<picture><source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} /><img className={className} src={asset(`/images/${name}-960.webp`)} srcSet={srcSet('webp')} sizes={sizes} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" width="1440" height="1080" {...props} /></picture></>;
}

export function Button({ href = '/book-plumbing-services', children = 'Request service', variant = 'primary', icon = 'arrow', className = '', ...props }) {
  const body = <>{children}<Icon name={icon} size={19} /></>;
  return href.startsWith('/') ? <Link href={href} className={`button button-${variant} ${className}`} {...props}>{body}</Link> : <a href={href} className={`button button-${variant} ${className}`} {...props}>{body}</a>;
}

function Footer() {
  return <footer className="site-footer"><div className="container"><span className="footer-watermark" aria-hidden="true">P&amp;P</span><div className="footer-top"><div><Brand footer /><p>Local people. Experienced hands.<br />Here for Lodi and our neighbors since 1996.</p><a className="footer-phone" href={`tel:${business.telephone}`}>{business.phone}<Icon name="diagonal" /></a><p className="footer-follow">Follow us</p><div className="footer-social"><a href="https://www.facebook.com/PhilPaulsPlumbing" target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Facebook"><BrandIcon name="facebook" /></a><a href="https://www.instagram.com/phil_and_pauls_plumbing/" target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Instagram"><BrandIcon name="instagram" /></a><a href={business.google} target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Google"><BrandIcon name="google" /></a><a href={business.yelp} target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Yelp"><BrandIcon name="yelp" /></a><a href={business.nextdoor} target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Nextdoor"><BrandIcon name="nextdoor" /></a></div></div><div><h2>What we do</h2>{services.map(s => <Link key={s.slug} href={`/service/${s.slug}`}>{s.name}</Link>)}</div><div><h2>Good to know</h2><Link href="/about">Our story</Link><Link href="/service-areas">Where we work</Link><Link href="/leave-a-review">Customer reviews</Link><Link href="/faqs">FAQs</Link><Link href="/licensing">Licensing</Link><Link href="/warranty">Warranty</Link><Link href="/coupons">Coupons</Link><Link href="/contact">Contact &amp; hours</Link><Link href="/book-plumbing-services">Request service</Link><Link href="/sitemap">Sitemap</Link></div><div><h2>Service areas</h2><Link href="/service-areas">Lodi</Link>{cities.map(c => <Link key={c.slug} href={`/plumber/${c.slug}`}>{c.name}</Link>)}</div><div className="footer-visit"><h2>Find us in Lodi</h2><p>6 Sierra Vista Pl<br />Lodi, CA 95240</p><p>{business.hours.map((h, i) => <Fragment key={h.days}>{i > 0 && <br />}{h.days}: {h.time}</Fragment>)}</p><span className="license"><Icon3D name="shield" size={26} />Fully licensed &amp; insured<br />CA {business.license}</span><a className="bbb-line" href={business.bbb} target="_blank" rel="noopener noreferrer"><span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={15} />)}</span><span>BBB rating: A+</span></a></div></div><p className="footer-warranty">*One-year labor warranty applies to most repairs and installations. Ask about coverage for your job.</p><div className="footer-bottom"><div className="footer-legal"><span>© {new Date().getFullYear()} {business.legalName} All rights reserved.</span><a className="footer-credit" href="https://alectronicsolutions.com" target="_blank" rel="noopener">Replumbed by <strong>Alectronic Solutions</strong><Icon name="diagonal" size={12} /></a></div><div className="footer-policies"><Link href={business.privacy}>Privacy</Link><Link href={business.terms}>Terms</Link><Link href={business.cookies}>Cookies</Link><Link href={business.accessibility}>Accessibility</Link><DisplaySettingsButton /><PrivacyChoicesButton /><button type="button" className="back-to-top" onClick={() => window.scrollTo({ top: 0 })}>Back to top</button></div></div></div></footer>;
}

export function Layout({ children }) {
  return <ConsentProvider><DisplaySettingsProvider><a className="skip-link" href="#main-content">Skip to content</a><Icon3DDefs /><Header /><main id="main-content">{children}</main><Footer /><DisplayLauncher /><TextUsWidget demo={DEMO_FORMS} /><div className="mobile-actions"><Link href="/book-plumbing-services">Request service<Icon name="arrow" size={18} /></Link><a href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} />Call now</a></div></DisplaySettingsProvider></ConsentProvider>;
}
export function Eyebrow({ children, light = false }) { return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</div>; }
export function Stars() { return <span className="stars" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={15} />)}</span>; }
const grades = ['F', 'D', 'C', 'B', 'A', 'A+'];
function CountUp({ to, decimals = 0, suffix = '', mode = 'count', run }) {
  const final = mode === 'grade' ? grades[grades.length - 1] : to.toFixed(decimals) + suffix;
  const [text, setText] = useState(final);
  useEffect(() => {
    const start0 = mode === 'grade' ? grades[0] : mode === 'random' ? '0' + suffix : (0).toFixed(decimals) + suffix;
    if (!run) { setText(start0); return; }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-display-motion');
    if (reduce) { setText(final); return; }
    let frame, lastStep = -1; const start = performance.now(), duration = 1600;
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      if (t >= 1) setText(final);
      else if (mode === 'grade') setText(grades[Math.min(grades.length - 1, Math.floor(t * grades.length))]);
      else if (mode === 'random') {
        const step = Math.floor((now - start) / 70);
        if (step !== lastStep) { lastStep = step; setText(String(Math.floor(Math.random() * 10)) + suffix); }
      } else setText((to * (1 - Math.pow(1 - t, 3))).toFixed(decimals) + suffix);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to, mode, suffix, decimals, final]);
  return <>{text}</>;
}
// Ticks draw in one after another each time the list scrolls into view.
function CheckList({ children }) {
  const [node, setNode] = useState(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!node || !('IntersectionObserver' in window)) { setRun(true); return; }
    const observer = new IntersectionObserver(([entry]) => setRun(entry.isIntersecting), { threshold: 0.6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return <ul className={`check-list check-list-anim${run ? ' is-running' : ''}`} ref={setNode}>{children}</ul>;
}

export function TrustBar() {
  const [node, setNode] = useState(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return <div className="trust-bar"><dl className="container trust-grid" ref={setNode}><div><dd className="trust-number"><CountUp to={100} suffix="%" run={inView} /></dd><dt>Fully licensed &amp; insured</dt></div><div><dd className="trust-google"><span className="trust-google-score"><BrandIcon name="google" size={40} /><span className="trust-number"><CountUp to={Number(business.rating.value)} decimals={1} run={inView} /></span></span><span className="trust-stars" role="img" aria-label={`${business.rating.value} out of 5 stars on Google`}>{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={16} />)}</span></dd><dt><a href={business.google} target="_blank" rel="noopener noreferrer">Highly rated on Google</a></dt></div><div><dd className="trust-number"><CountUp mode="grade" run={inView} /></dd><dt><a href={business.bbb} target="_blank" rel="noopener noreferrer">BBB rating</a></dt></div><div><dd className="trust-number"><CountUp to={1} suffix=" Year" mode="random" run={inView} /></dd><dt>Labor warranty*</dt></div></dl></div>;
}

export function Awards({ className = '' }) {
  return <div className={`awards ${className}`}><img src={asset('/images/badges/best-of-lodi-2026.webp')} alt="Winner, Best of Lodi 2026, Lodi News-Sentinel Readers’ Choice Awards" width="144" height="144" loading="lazy" decoding="async" /><a href={business.yelp} target="_blank" rel="noopener noreferrer"><img src={asset('/images/badges/yelp-customer-best.webp')} alt="People love us on Yelp" width="144" height="144" loading="lazy" decoding="async" /></a><p><strong>Best of Lodi 2026</strong>Voted by readers of the Lodi News-Sentinel</p></div>;
}

// `wide` fits every service into two rows of five on desktop; the closing tile fills the tenth slot.
export function ServiceCards({ limit, wide = false }) {
  const sizes = wide ? '(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 30px), (max-width: 1340px) calc(20vw - 30px), 240px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1340px) calc(33vw - 30px), 410px';
  return <div className={`services-grid${wide ? ' services-grid-wide' : ''}`}>{services.slice(0, limit).map(s => <Link className="service-card" key={s.slug} href={`/service/${s.slug}`}><div className="service-card-photo"><Photo name={s.image} alt={`${s.name} work by the Phil and Paul's team`} sizes={sizes} /><span className="service-card-arrow"><Icon name="diagonal" size={23} /></span></div><div className="service-card-copy"><div><Icon3D name={s.icon} size={34} /><h3>{s.name}</h3></div><p>{s.description}</p></div></Link>)}{wide && <Link className="service-card-more" href="/service"><Icon name="plus" size={26} /><div><h3>Something else?</h3><p>Fixtures, leaks, and the smaller jobs. If it is plumbing, chances are we do it.</p></div><span className="text-link">All services<Icon name="arrow" size={18} /></span></Link>}</div>;
}

export function Faqs({ items = commonFaqs, title = <>A few things<br />worth knowing.</>, eyebrow = 'YOUR QUESTIONS, ANSWERED', id, intro, help = true }) {
  return <section className="faq-section section" id={id}><div className="container faq-layout"><div className="faq-intro"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{intro && <p className="faq-group-intro">{intro}</p>}{help && <div className="faq-help"><p>Have something else on your mind?<br />Give us a call. We are happy to help.</p><a className="text-link" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} />{business.phone}</a></div>}</div><div className="faq-list">{items.map(([q, a], i) => <details key={q} className="faq-item"><summary><span className="faq-number">{String(i + 1).padStart(2, '0')}</span><span className="faq-q">{q}</span><span className="faq-toggle"><Icon name="plus" size={18} /></span></summary><div className="faq-answer"><p>{a.split(/(?<=\.) (?=Our California|Call to confirm)/).map((part, j) => <span key={j}>{j > 0 && <br />}{part}</span>)}</p></div></details>)}</div></div></section>;
}

// Posts a form to the service-request endpoint. Shared by the CTA form, the booking page, and the contact page.
// While the site is a preview, nothing is sent: a valid submit opens a notice instead. Set to false to post to the endpoint again.
const DEMO_FORMS = true;

function DemoNotice({ dialog, form }) {
  const close = () => dialog.current?.close();
  return <dialog className="consent-dialog demo-dialog" ref={dialog} aria-labelledby="demo-dialog-title" onClose={() => { form.current?.reset(); form.current = null; }}>
    <div className="consent-dialog-head">
      <h2 id="demo-dialog-title">This is an example</h2>
      <button type="button" className="consent-close" onClick={close} aria-label="Close"><Icon name="close" size={22} /></button>
    </div>
    <div className="consent-dialog-body">
      <p>This form is for demonstration only. Nothing was submitted and no information was saved or sent.</p>
      <p><strong>Thank you!</strong></p>
      <div className="consent-dialog-actions"><button type="button" className="button button-primary" onClick={close}>Got it</button></div>
    </div>
  </dialog>;
}

function useRequestSubmit() {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const dialog = useRef(null);
  const demoForm = useRef(null);
  const notice = DEMO_FORMS ? <DemoNotice dialog={dialog} form={demoForm} /> : null;
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (state === 'sending' || !form.reportValidity()) return;
    if (DEMO_FORMS) { demoForm.current = form; dialog.current?.showModal(); return; }
    setState('sending'); setMessage('');
    try {
      const response = await fetch('/api/book-service', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || `Your request could not be sent. Please call ${business.phone}.`);
      setState('success');
    } catch (error) { setState('error'); setMessage(error.message); }
  }
  return { state, message, submit, notice };
}

// The service request form, shared by the CTA band and landing-page heroes. `idPrefix` keeps label ids unique when two copies share a page.
export function ServiceRequestForm({ idPrefix = 'cta', title = 'Request service' }) {
  const { state, message, submit, notice } = useRequestSubmit();
  const id = name => `${idPrefix}-${name}`;
  if (state === 'success') return <div className="form-success" role="status" aria-live="polite"><Icon name="check" size={36} /><h3>We have your request.</h3><p>Our team will contact you during business hours.</p></div>;
  return <><form action={asset('/api/book-service')} method="post" onSubmit={submit} data-service-request>
    <h3>{title}</h3>
    <div className="form-row"><div className="form-field"><label htmlFor={id('name')}>Your name</label><input id={id('name')} name="Name" autoComplete="name" required maxLength={120} placeholder="First and last name" /></div><div className="form-field"><label htmlFor={id('phone')}>Phone number</label><input id={id('phone')} name="Phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="(209) 555-0123" /></div></div>
    <div className="form-row"><div className="form-field"><label htmlFor={id('city')}>City or ZIP</label><input id={id('city')} name="City" autoComplete="address-level2" required maxLength={120} placeholder="Where is the job?" /></div><div className="form-field"><label htmlFor={id('service')}>What needs attention?</label><select id={id('service')} name="Service-Needed" required defaultValue=""><option value="" disabled>Choose one</option>{services.slice(0, 6).map(s => <option key={s.slug}>{s.name}</option>)}<option>Other / not sure</option></select></div></div>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor={id('company-url')}>Leave this empty</label><input id={id('company-url')} name="Website" tabIndex={-1} autoComplete="off" /></div>
    <label className="consent-label"><input type="checkbox" name="Opt-In" required /><span>I agree to the <Link href={business.terms} target="_blank">Terms and Conditions</Link> and <Link href={business.privacy} target="_blank">Privacy Policy</Link>, and consent to calls, texts, or email about my request.{" "}<small className="consent-fine">Msg &amp; data rates may apply. Reply STOP to opt out.</small></span></label>
    {state === 'error' && <div className="form-error" role="alert"><strong>Your request has not been sent.</strong><p>{message}</p></div>}
    <button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send request'}<Icon name="arrow" size={19} /></button>
  </form>{notice}</>;
}

export function Cta({ title = <>Let’s get it<br />taken care of.</>, text = 'Tell us what is going on. We will help you figure out the next step.' }) {
  return <section className="cta-section"><div className="container cta-inner"><div className="cta-copy"><Eyebrow light>PHIL &amp; PAUL’S PLUMBING</Eyebrow><h2>{title}</h2><p>{text}</p><a className="cta-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={29} /><span>Prefer to talk? <strong>{business.phone}</strong></span></a><small>{hoursSummary.join(' · ')}</small></div>
    <div className="cta-card"><ServiceRequestForm /></div></div></section>;
}

export function Breadcrumbs({ current, parent }) { return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{parent && <><Link href={parent.href}>{parent.name}</Link><span>/</span></>}<span aria-current="page">{current}</span></nav>; }
// Drifts the backdrop photo slower than the page. Writes one CSS variable per frame and does nothing under reduced motion.
function HeroBackdrop({ image, alt }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-display-motion')) return;
    let frame = 0;
    const update = () => { frame = 0; el.style.setProperty('--parallax', `${Math.min(window.scrollY * .3, 60).toFixed(1)}px`); };
    const onScroll = () => { frame ||= requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <div className="page-hero-backdrop" ref={ref}><Photo name={image} alt={alt} priority sizes="(max-width: 760px) 100vw, 60vw" /></div>;
}
// Picks the 3D glyph for a hero proof line from what it says.
const proofIcons = [[/licensed|insured|manufacturer/i, 'shield'], [/since|years/i, 'star'], [/estimate|price|offer/i, 'tag'], [/homes|business/i, 'building'], [/emergenc|call/i, 'phone'], [/same-day|repairs/i, 'wrench']];
const proofIcon = text => proofIcons.find(([re]) => re.test(text))?.[1] ?? 'check';

// `backdrop` lays the photo behind the copy as a faded shadow instead of a framed image beside it. `proof` is a short row of facts under the buttons.
export function PageHero({ eyebrow, title, children, image = 'truck', alt = 'Phil and Paul’s Plumbing service truck in Lodi', breadcrumb, parent, actions = true, backdrop = false, proof, className = '' }) {
  const buttons = actions && <div className="button-group"><Button /><a className="text-link" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} />{business.phone}</a></div>;
  const proofRow = proof && <ul className="page-hero-proof">{proof.map(p => <li key={p}><Icon3D name={proofIcon(p)} size={34} />{p}</li>)}</ul>;
  return <section className={`page-hero${backdrop ? ' page-hero-shadow' : ''}${className ? ` ${className}` : ''}`}>{backdrop && <HeroBackdrop image={image} alt={alt} />}<div className="container"><Breadcrumbs current={breadcrumb || eyebrow} parent={parent} /><div className="page-hero-grid"><div className="page-hero-copy"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><div className="page-hero-description">{children}</div>{buttons}{proofRow}</div>{!backdrop && <div className="page-hero-image"><Photo name={image} alt={alt} priority /><span className="image-caption"><span className="utility-dot" />LOCAL PEOPLE. EXPERIENCED HANDS.</span></div>}</div></div></section>;
}

const processSteps = [['01', 'Tell us what’s happening.', 'Call our team or send a service request. Let us know the problem and where you are.'], ['02', 'Get a clear plan.', 'We inspect the issue, explain the options, and discuss the work before starting.'], ['03', 'Get back to your day.', 'Our plumbers complete the agreed work and answer your questions before leaving.']];

// Highlights one step at a time, advancing on a timer; hovering or focusing a step takes over and pauses the cycle.
function ProcessSteps() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (paused || still) return undefined;
    const timer = setTimeout(() => setActive((i) => (i >= processSteps.length - 1 ? -1 : i + 1)), active === -1 ? 2200 : 5000);
    return () => clearTimeout(timer);
  }, [paused, still, active]);
  return <ol className="process-grid" onMouseLeave={() => setPaused(false)} onBlur={() => setPaused(false)}>{processSteps.map(([n, t, d], i) => <li className="process-step" data-active={i === active ? 'true' : 'false'} key={n} tabIndex={0} onMouseEnter={() => { setActive(i); setPaused(true); }} onFocus={() => { setActive(i); setPaused(true); }}><WaterNumber value={i + 1} active={i === active} filled={i <= active} /><h3>{t}</h3><p>{d}</p></li>)}</ol>;
}

const whyTrust = [['Great service & communication', 'We explain the problem before we start the work. You’ll know what’s wrong, what it will cost, and what we recommend. No surprises, no upsells.'], ['Honest & knowledgeable', <>We stand behind what we do. Our one-year labor warranty<sup>*</sup> means that if something isn’t right, we come back and make it right. Our technicians are well-trained and have the expertise for the most complex issues.</>], ['Local', 'We’ve been here since 1996. We’re not a franchise or an out-of-town company. We live and work in this community, and our reputation here is everything to us.']];

function WhyTrustSection() {
  return <section className="why-trust-section section"><div className="container why-trust-grid"><div className="why-trust-copy"><Eyebrow>WHY CHOOSE US</Eyebrow><h2>Why Lodi trusts<br />Phil &amp; Paul’s.</h2><ul className="why-trust-list">{whyTrust.map(([t, d]) => <li key={t}><div><h3>{t}</h3><p>{d}</p></div></li>)}</ul><a className="button button-outline" href={`tel:${business.telephone}`}><Phone3D size={22} />Call {business.phone}</a></div><div className="why-trust-photo"><picture><source type="image/avif" srcSet={asset('/images/why-trust-900.avif')} /><img src={asset('/images/why-trust-900.webp')} alt="A Phil and Paul's plumber standing beside the red service van" width="900" height="900" loading="lazy" decoding="async" /></picture></div></div></section>;
}

// Dark brand-story block. On the About page the button asks for service instead of linking to itself.
function AboutFeature({ onAbout = false }) {
  return <section className="about-feature"><div className="container about-feature-grid"><div className="about-feature-photo about-feature-photo-portrait"><picture><source type="image/avif" srcSet={asset('/images/wave-500.avif')} /><img src={asset('/images/wave-500.webp')} alt="A Phil and Paul's plumber smiling and waving from the window of a red service truck" width="500" height="888" loading="lazy" decoding="async" /></picture><div className="photo-label"><span>LOCAL ROOTS.</span><span>EXPERIENCED HANDS.</span></div></div><div className="about-feature-copy"><Eyebrow light>ABOUT PHIL &amp; PAUL’S</Eyebrow><h2>Honest plumbing.<br />From people<br /><span>who know Lodi.</span></h2><p className="about-lead">We started Phil &amp; Paul’s because we believed this community deserved a plumber it could trust: someone who explains the problem clearly, recommends only what you need, and stands behind the work.</p><p>That is still how we work. We are local, licensed, and insured, serving Lodi and nearby communities since 1996. When you call, you reach experienced plumbers who know the area, not a call center.</p><CheckList><li><Icon name="check" />Talk to a local team</li><li><Icon name="check" />Understand your options before work begins</li><li><Icon name="check" />Work backed by a one-year labor warranty<sup>*</sup></li></CheckList><div className="button-group">{onAbout ? <Button variant="outline-light">Request service</Button> : <Button href="/about" variant="outline-light">Get to know us</Button>}<a className="text-link text-link-light" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} />{business.phone}</a></div></div></div></section>;
}

export function HomePage() {
  return <><section className="home-hero home-hero-shadow"><div className="container hero-grid"><div className="hero-copy"><Eyebrow>LODI, STOCKTON &amp; GALT</Eyebrow><h1>Your local<br />plumber.<br /><span>Since ’96.</span></h1><p>When something goes wrong with your plumbing, you don’t want to guess who to call.<br className="br-mobile" /><br className="br-mobile" /> Phil &amp; Paul’s has been serving Lodi and the surrounding communities since 1996, with honest diagnoses and work done right the first time.</p><p>We’re fully licensed, insured, and rated A+ by the BBB. Whether it’s a water heater going out, a stubborn drain, or a pipe you’ve been meaning to fix, give us a call and we’ll get it handled.</p><div className="button-group"><Button icon="diagonal">Let’s fix it</Button><a className="hero-phone" href={`tel:${business.telephone}`}><Phone3D size={26} /><span><small>GIVE US A CALL</small>{business.phone}</span></a></div><ul className="hero-note"><li><Icon3D name="shield" size={28} /><span>Licensed &amp; insured<small>CA {business.license}</small></span></li><li><Icon3D name="check" size={28} /><span>Homes &amp; businesses<small>Residential and commercial</small></span></li></ul></div><div className="hero-visual"><HeroBackdrop image="crew-van" alt="The Phil and Paul's Plumbing crew in front of their red service van" /><div className="hero-badges"><img className="hero-badge hero-badge-lodi" src={asset('/images/badges/best-of-lodi-2026.webp')} alt="Winner, Best of Lodi 2026, Lodi News-Sentinel Readers’ Choice Awards" width="144" height="144" decoding="async" /><a className="hero-badge hero-badge-yelp" href={business.yelp} target="_blank" rel="noopener noreferrer"><img src={asset('/images/badges/yelp-customer-best.webp')} alt="People love us on Yelp" width="144" height="144" decoding="async" /></a></div></div></div></section><TrustBar />
    <section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>OUR SERVICES</Eyebrow><h2>What needs{' '}<br />fixing?</h2></div><div className="section-heading-side"><p>From the kitchen sink to the sewer line.<br />A capable crew for the work you need.</p><Link className="text-link" href="/service">Explore all services<Icon name="arrow" size={18} /></Link></div></div><ServiceCards wide /></div></section>
    <AboutFeature />
    <section className="process-section section"><div className="container"><div className="section-heading"><div><Eyebrow>HERE’S HOW IT WORKS</Eyebrow><h2>One less thing<br />to worry about.</h2></div><p className="section-heading-side">You should know who is coming,<br />what is wrong, and what happens next.</p></div><ProcessSteps /></div></section><WhyTrustSection /><Reviews /><InstagramFeed /><AreaSection /><Faqs /><Cta /></>;
}

export function AreaSection({ full = false }) {
  return <section className={`area-section section ${full ? 'area-section-full' : ''}`}><div className="container area-layout"><div><Eyebrow>LODI ROOTS. NEARBY ROUTES.</Eyebrow><h2>Around the corner.<br />Across the valley.</h2><p>Based in Lodi. On the road to homes and businesses in Stockton, Galt, and the communities in between.</p><div className="city-links"><span className="city-home">Lodi<Icon name="pin" size={15} /></span>{cities.map(c => <Link key={c.slug} href={`/plumber/${c.slug}`}>{c.name}<Icon name="diagonal" /></Link>)}</div><p className="area-small">Also serving Clements and nearby communities.<br />Call to confirm your address.</p>{!full && <Link className="text-link" href="/service-areas">Find your service area<Icon name="arrow" size={18} /></Link>}</div><ServiceAreaMap /></div></section>;
}

function OtherServicesList() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setActive(a => (a + 1) % otherServices.length), 2800);
    return () => clearInterval(t);
  }, [paused]);
  return <ul className="service-checks" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>{otherServices.map((d, i) => <li key={d} className={i === active ? 'is-active' : undefined} onMouseEnter={() => setActive(i)}><Icon3D name={otherServiceIcons[i] || 'wrench'} size={44} /><span>{d}</span></li>)}</ul>;
}
const otherServiceIcons = ['recirc', 'sump', 'bath', 'valve', 'faucet', 'sprinkler'];
export function ServicesPage() { return <><PageHero eyebrow="PLUMBING SERVICES" title={<>Plumbing services<br /><span>in Lodi.</span></>} image="repair" alt="A Phil and Paul's plumber repairing pipes at an open wall" backdrop proof={['Homes and businesses', 'Licensed since 1996', 'One-year labor warranty']}><p>Water heater repair, drain cleaning, sewer lines, gas lines, and the everyday repairs that keep a property running. Tell us what you need. We will take it from there.</p></PageHero><TrustBar /><section className="section services-index"><div className="container"><div className="section-heading"><div><Eyebrow>HOMES &amp; BUSINESSES</Eyebrow><h2>From a small fix<br />to a bigger job.</h2></div><p className="section-heading-side">Licensed plumbing service in Lodi,<br />Stockton, Galt, and nearby communities.</p></div><ServiceCards /></div></section><AreaSection /><section className="section service-overview other-services"><div className="container detail-layout"><div><Eyebrow>AND THE SMALLER JOBS</Eyebrow><h2>We handle<br />those too.</h2><p>Not every job needs its own page. If you do not see yours listed, call and ask. Chances are we do it.</p></div><OtherServicesList /></div></section><Faqs items={commonFaqs.slice(1, 4)} /><Cta /></>; }

// Guides with `facts` or `titles` get the two-column editorial layout; the rest keep the single reading column.
export function LocalGuide({ guide: g }) {
  if (!g) return null;
  const signs = g.signs && <div className="guide-signs-wrap"><h3>{g.signsTitle ?? 'Signs it is time to call'}</h3><dl className="guide-signs">{g.signs.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl></div>;
  const links = g.links && (g.links.some(l => l[2])
    ? <nav className="guide-related" aria-label="Related services"><span className="guide-related-label">Related services</span><ul>{g.links.map(([label, href, note]) => {
      const slug = href.split('/').pop();
      const image = (services.find(s => s.slug === slug) || cities.find(c => c.slug === slug))?.image;
      return <li key={href}><Link href={href}>{image && <Photo name={image} alt="" className="guide-related-photo" sizes="(max-width: 760px) calc(100vw - 40px), 280px" />}<strong>{label}</strong>{note && <span>{note}</span>}<Icon name="arrow" size={18} /></Link></li>;
    })}</ul></nav>
    : <p className="guide-links"><span>Related:</span> {g.links.map(([label, href], i) => <Fragment key={href}>{i > 0 && ' · '}<Link href={href}>{label}</Link></Fragment>)}</p>);
  if (!g.facts && !g.titles) return <section className="section local-guide"><div className="container"><Eyebrow>{g.eyebrow}</Eyebrow><h2>{g.heading}</h2><div className="guide-body">{g.body.map(p => <p key={p.slice(0, 40)}>{p}</p>)}</div>{signs}{links}</div></section>;
  return <section className="section local-guide local-guide-editorial"><div className="container local-guide-grid">
    <header className="guide-aside"><Eyebrow>{g.eyebrow}</Eyebrow><h2>{g.heading}</h2>{g.facts && <dl className="guide-facts">{g.facts.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>}<a className="button button-primary guide-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={28} />Call {business.phone}</a></header>
    <div className="guide-main"><div className="guide-body">{g.body.map((p, i) => <Fragment key={p.slice(0, 40)}>{g.titles?.[i] ? <section className="guide-chapter"><h3><span>{String(i).padStart(2, '0')}</span>{g.titles[i]}</h3><p>{p}</p></section> : <p className={i === 0 ? 'guide-lead' : undefined}>{p}</p>}{g.callout && i === (g.calloutAfter ?? 2) && <aside className="guide-callout"><span aria-hidden="true">“</span>{g.callout}</aside>}</Fragment>)}</div>{signs}{links}</div>
  </div></section>;
}

// Overview list. Services with `detailNotes` get click-to-expand rows (one open at a time); the rest stay plain.
function ServiceChecks({ items, icons, notes }) {
  const [open, setOpen] = useState(0);
  if (!notes) return <ul className="service-checks">{items.map((d, i) => <li key={d}>{icons?.[i] ? <Icon3D name={icons[i]} size={44} /> : <Icon name="check" size={19} />}<span>{d}</span></li>)}</ul>;
  return <ul className="service-checks service-checks-expand">{items.map((d, i) => {
    const on = open === i;
    return <li key={d} className={on ? 'is-open' : undefined}><button type="button" id={`svc-check-${i}`} aria-expanded={on} aria-controls={`svc-note-${i}`} onClick={() => setOpen(on ? -1 : i)}>{icons?.[i] ? <Icon3D name={icons[i]} size={44} /> : <Icon name="check" size={19} />}<span>{d}</span><i className="check-toggle" aria-hidden="true"><Icon name="plus" size={16} /></i></button><div className="check-note" id={`svc-note-${i}`} role="region" aria-labelledby={`svc-check-${i}`}><p>{notes[i]}</p></div></li>;
  })}</ul>;
}

export function ServicePage({ service: s }) { const h = s.hero; return <><PageHero eyebrow={s.name.toUpperCase()} breadcrumb={s.name} parent={{ href: '/service', name: 'Services' }} title={<>{h ? h.lines.map(line => <Fragment key={line}>{line}<br /></Fragment>) : <>{s.name}<br /></>}<span>in Lodi.</span></>} image={s.image} alt={h?.alt ?? `${s.name} work by Phil and Paul's Plumbing`} backdrop={!!h} proof={h?.proof}><p>{s.intro}</p></PageHero><TrustBar /><section className="section service-overview"><div className="container detail-layout"><div className="overview-lead"><Eyebrow light>WHAT WE CAN HELP WITH</Eyebrow><h2>{s.short.split(/(?<=,) /).map((part, i) => <span key={i} className="h2-line">{part}</span>)}</h2><p>{s.description.split(/(?<=\.) /).map(line => <span key={line} className="overview-line">{line}</span>)}</p>{s.overviewImage && <Photo name={s.overviewImage} alt={s.overviewAlt ?? ''} className="overview-photo" sizes="(max-width: 760px) calc(100vw - 80px), 420px" />}<div className="overview-actions"><Button variant="cream" /><a className="text-link" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} />{business.phone}</a></div></div><ServiceChecks items={s.details} icons={s.detailIcons} notes={s.detailNotes} /></div>{s.slug === 'gas-lines' && <div className="container"><aside className="safety-notice" aria-labelledby="gas-safety-title"><Icon3D name="flame" size={30} /><div><h3 id="gas-safety-title">Smell gas? Get out first.</h3><p>Leave the building right away. Do not use light switches, phones, or anything that could make a spark.<br className="br-mobile" /> From a safe distance, call 911<br />or PG&amp;E at <a href="tel:+18007435000">1-800-743-5000</a>. Then call us for repairs.</p></div></aside></div>}</section><section className="section service-approach"><div className="container"><Eyebrow>THE WAY WE WORK</Eyebrow><div className="approach-grid">{s.sections.map(([t, d], i) => <WaterCard key={t} number={`0${i + 1}`} title={t} text={d} delay={i * 450} />)}</div></div></section><LocalGuide guide={s.guide} /><Faqs items={s.faqs} title={<>About your<br />{s.slug === 'commercial-plumbing' ? 'property.' : 'service.'}</>} /><section className="related-section section"><div className="container"><div className="section-heading"><div><Eyebrow>WHILE WE’RE HERE</Eyebrow><h2>Other ways we help.</h2></div><Link className="text-link" href="/service">All services <Icon name="arrow" size={18} /></Link></div><div className="related-links">{services.filter(x => x.slug !== s.slug).slice(0, 4).map(x => <Link key={x.slug} href={`/service/${x.slug}`}><Icon3D name={x.icon} size={30} /><span>{x.name}</span><Icon name="diagonal" size={18} /></Link>)}</div></div></section><Cta /></>; }

export function AboutPage() { return <><PageHero eyebrow="OUR STORY" title={<>Local roots.<br />A lot of<br className="br-desktop" /> hard work.</>} image="crew-wrenches" alt="Two Phil and Paul's plumbers smiling with pipe wrenches on their shoulders at a Lodi job" backdrop proof={['Serving Lodi since 1996', 'Licensed and insured', 'One-year labor warranty']}><p>Phil &amp; Paul’s Plumbing has served Lodi and the<br className="br-desktop" /> surrounding communities since 1996.<br className="br-desktop" /> We are a local team with a straightforward<br className="br-desktop" /> way of doing business.</p></PageHero><TrustBar /><section className="section"><div className="container story-layout"><div><Eyebrow>THE WAY WE SEE IT</Eyebrow><h2 className="stagger">{['A good plumber', 'should make', 'things simpler.'].map(line => <span key={line}>{line}{' '}</span>)}</h2></div><div className="story-copy"><p className="large-copy">You call because something is wrong. Our job is to understand it, explain it, and do the work properly.</p><p>That means listening before recommending a repair. It means telling you when replacement makes more sense and when it does not. And it means answering your questions along the way.</p><p>From the office to the job site, the people you deal with are part of a local team. We work on homes and businesses across Lodi, Stockton, Galt, and nearby communities.</p><p>We are licensed, insured, and back most repairs and installations with a one-year labor warranty. If you have a concern about our work, call us.</p><Awards /></div></div></section><AboutFeature onAbout /><WhyTrustSection /><CrewOverview about /><AreaSection /><section className="team-gallery section"><div className="container"><div className="section-heading"><div><Eyebrow>PEOPLE BEHIND THE WORK</Eyebrow><h2>You’ll recognize<br />the red trucks.</h2></div><p className="section-heading-side">Our crew, our equipment, and<br />work from around the community.</p></div><div className="gallery-grid"><figure><Photo name="jeff" alt="Jeff in a Phil and Paul's Plumbing service truck" sizes="(max-width: 760px) calc(50vw - 28px), (max-width: 1390px) 26vw, 362px" /><figcaption>A familiar face on the road.</figcaption></figure><figure><Photo name="crew" alt="A Phil and Paul's technician beside a service van" sizes="(max-width: 760px) calc(50vw - 28px), (max-width: 1390px) 26vw, 362px" /><figcaption>Ready for the work ahead.</figcaption></figure><figure><Photo name="fleet" alt="A Phil and Paul's red service truck hauling a trailer loaded with water heaters" sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1390px) 36.5vw, 507px" /><figcaption>Loaded up and on the way to your job.</figcaption></figure></div></div></section><Reviews /><Cta /></>; }

// The crew polaroids, credentials, and top services. `about` words it for the About page instead of the Service area page.
function CrewOverview({ about = false }) {
  return <section className="section areas-overview"><div className="container detail-layout"><div><Eyebrow>ONE TEAM, EVERY COMMUNITY</Eyebrow><h2>The same crew<br />at every address.</h2><CrewPolaroids Photo={Photo} /></div><div className="crew-aside"><p className="large-copy">Phil &amp; Paul’s works out of Lodi, and the same licensed plumbers cover {about ? 'every community we serve.' : 'every community on this page.'}</p>
    <ul className="crew-facts"><li><Icon3D name="pin" size={34} /><strong>1996</strong><span>Serving Lodi and neighbors</span></li><li><Icon3D name="shield" size={34} /><strong>{business.license.split(' ')[0]}</strong><span>Licensed &amp; insured</span></li><li><Icon3D name="check" size={34} /><strong>1 year</strong><span>Labor warranty on most repairs</span></li></ul>
    <h3 className="crew-aside-label">Where the crew can help</h3>
    <div className="crew-services">{['water-heaters', 'drain-cleaning', 'sewer-repair', 'commercial-plumbing'].map(slug => { const sv = services.find(x => x.slug === slug); return <Link key={slug} href={`/service/${slug}`} className="crew-service"><span className="crew-service-icon"><Icon3D name={sv.icon} size={46} /></span><span><strong>{sv.name}</strong><small>{sv.short}</small></span><Icon name="arrow" size={18} /></Link>; })}</div>
    <div className="crew-aside-cta"><Button href={`tel:${business.telephone}`} icon="phone">Call {business.phone}</Button><Link href="/service" className="crew-aside-link">Not sure which fits? Browse all plumbing services</Link></div>
    <p className={`crew-aside-note${about ? ' crew-aside-note-wrap' : ''}`}>{about ? <>Every community we serve has its own page with the neighborhoods and ZIP codes we cover. <Link href="/service-areas">See the full service area.</Link></> : 'Each community below has its own page with the neighborhoods and ZIP codes we cover.'}</p></div></div></section>;
}

export function AreasPage() {
  const communities = [{ name: 'Lodi', href: '/', image: 'team', alt: 'The Phil and Paul’s Plumbing crew in front of their red service van in Lodi', caption: 'Our home base. Shop and dispatch are here.', wide: true }, ...cities.map(c => ({ name: c.name, href: `/plumber/${c.slug}`, image: c.image, alt: `A view of ${c.name}, California, in the Phil and Paul’s Plumbing service area`, caption: c.landing?.drive ?? 'Residential and commercial service' }))];
  return <>
    <PageHero className="areas-hero" eyebrow="WHERE WE WORK" breadcrumb="Service area" title={<>Plumber in<br />Lodi, Stockton<br />&amp; Galt, CA.<br /><span>Based in Lodi. Here for our neighbors.</span></>} image="curb-excavation-van" alt="Two Phil and Paul's plumbers digging out a water line at a curb in Lodi, with the red service van parked behind them" backdrop proof={['7 communities served', 'Licensed and insured', 'Homes and businesses']}><p>We provide residential and commercial plumbing service in Lodi, Stockton, Galt, Acampo, Woodbridge, Lockeford, and nearby communities. Not sure we cover your address? Call and we will tell you.</p></PageHero>
    <TrustBar />
    <AreaSection full />
    <CrewOverview />
    <section className="section"><div className="container"><div className="section-heading"><div><Eyebrow>NEARBY COMMUNITIES</Eyebrow><h2>Close to home.</h2></div><p className="section-heading-side">One local team.<br />The same care at every stop.</p></div>
      <div className="community-grid">{communities.map(c => <CommunityCard key={c.name} {...c} name={`Plumber in ${c.name}`} />)}<CommunityCard name="Clements" caption="Call to confirm coverage at your address" /></div></div></section>
    <Faqs items={areaFaqs} title={<>Before<br />you call.</>} /><Cta title={<>Plumbing trouble<br />near Lodi?</>} text="Tell us what is going on and where. We will confirm a time and what to expect." /></>;
}

// Drifts `.landing-hero-bg` at a fifth of the scroll speed via --parallax. Skipped for reduced motion and the Display settings motion toggle.
function useHeroParallax() {
  useEffect(() => {
    const hero = document.querySelector('.city-landing .landing-hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-display-motion')) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      hero.style.setProperty('--parallax', `${Math.round(-rect.top * 0.2)}px`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

function CommunityCard({ name, href, image, alt, caption, wide }) {
  const body = <><Icon name="pin" size={20} /><h3>{name}{href && <Icon name="diagonal" size={18} />}</h3><span>{caption}</span></>;
  if (!href) return <div className="community-card community-card-plain">{body}</div>;
  return <Link href={href} className={`community-card${wide ? ' community-card-wide' : ''}`}><Photo name={image} alt={alt} className="community-photo" sizes={wide ? '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), 560px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 270px'} /><div className="community-card-copy">{body}</div></Link>;
}

// Full landing layout for cities with a `landing` block in content/business.mjs. The h1 and title lead with the search phrase.
function CityLanding({ city: c }) {
  const l = c.landing;
  useHeroParallax();
  const featured = l.reviews[0];
  return <div className="city-landing">
    <section className="landing-hero" data-city={c.slug}>
      <Photo name={c.image} alt="" className="landing-hero-bg" priority sizes="100vw" />
      <div className="container">
        <Breadcrumbs current={c.name} parent={{ href: '/service-areas', name: 'Service area' }} />
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <Eyebrow light>LICENSED &amp; INSURED · CA {business.license}</Eyebrow>
            <h1>Plumber in<br />{c.name}, CA.<br /><span>Honest work since ’96.</span></h1>
            <ul className="landing-pills">
              <li><a href={business.google} target="_blank" rel="noopener noreferrer"><BrandIcon name="google" size={18} /><strong>{business.rating.value}</strong><span className="landing-pill-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={13} />)}</span>{business.rating.count} reviews</a></li>
              <li><Icon3D name="clock" size={26} />{l.sameDay}</li>
              <li><Icon3D name="pin" size={26} />{l.drive.split(/ (?=on Highway)/).map((part, i) => i ? <Fragment key={i}><br className="br-mobile" /> {part}</Fragment> : part)}</li>
            </ul>
            <p className="landing-lead">{l.lead}</p>
            <div className="landing-actions"><a className="button button-primary landing-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} /><span><small>CALL NOW</small>{business.phone}</span></a><Button variant="outline-light" icon="diagonal">Request service</Button><small className="landing-hours">{hoursSummary.join(' · ')}</small></div>
          </div>
        </div>
      </div>
    </section>
    <TrustBar />
    <section className="section landing-problems"><div className="container"><div className="section-heading"><div><Eyebrow>WHAT WE FIX HERE</Eyebrow><h2>The calls we get<br />from {c.name}.</h2></div><p className="section-heading-side">{(l.problemsNote || ['Older homes, busy rentals, and restaurant', 'kitchens. Each one fails its own way.']).flatMap((t, i) => i ? [<br key={i} />, t] : [t])}</p></div>
      <div className="problem-grid">{l.problems.map(([photo, t, d, href], i) => <Link key={t} href={href} className="problem-card"><Photo name={photo} alt="" className="problem-photo" sizes={i === 0 ? '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), 480px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 390px'} /><div className="problem-body"><h3>{t}</h3><p>{d}</p><span className="problem-link">{services.find(s => href.endsWith(s.slug))?.name}<Icon name="arrow" size={17} /></span></div></Link>)}</div></div></section>
    {featured && <section className="landing-quote"><div className="container landing-quote-inner"><figure><span className="landing-quote-mark" aria-hidden="true">“</span><blockquote>{featured.text.split(/(?<=[.!?]) (?=What more)/).flatMap((part, i) => i ? [<br key={i} />, part] : [part])}</blockquote><figcaption><a href={featured.profile} target="_blank" rel="noopener noreferrer">{featured.name}<Icon name="diagonal" size={15} /></a><span>Google review from a {c.name} customer</span></figcaption></figure><a className="landing-quote-score" href={business.google} target="_blank" rel="noopener noreferrer"><strong>{business.rating.value}</strong><span className="landing-pill-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={16} />)}</span><span>{business.rating.count} Google reviews</span></a></div></section>}
    <section className="section landing-coverage"><div className="container landing-coverage-grid"><CityCoverage slug={c.slug} neighborhoods={l.neighborhoods} zips={l.zips}><Eyebrow>WHERE WE GO</Eyebrow><h2>Every corner<br />of {c.name}.</h2><p>{l.drive}.<br />Don’t see your neighborhood?<br className="br-mobile" /> Call, we probably cover it.</p></CityCoverage></div></section>
    {l.photos.length > 0 && <section className="section landing-work"><div className="container"><div className="section-heading"><div><Eyebrow>RECENT WORK</Eyebrow><h2>Jobs around<br />the city.</h2></div></div><div className="landing-work-grid">{l.photos.map(([name, caption]) => <figure key={name}><Photo name={name} alt={caption} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1340px) 33vw, 420px" /><figcaption>{caption}</figcaption></figure>)}</div></div></section>}
    <section className="process-section section"><div className="container"><div className="section-heading"><div><Eyebrow>HERE’S HOW IT WORKS</Eyebrow><h2>One call.<br />A clear plan.</h2></div><p className="section-heading-side">You know who is coming, what is wrong,<br />and what it costs before work starts.</p></div><ProcessSteps /></div></section>
    <LocalGuide guide={c.guide} />
    <Reviews />
    <section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>HOW WE CAN HELP</Eyebrow><h2>Everything else{' '}<br />we handle.</h2></div><Link className="text-link" href="/service">All services<Icon name="arrow" size={18} /></Link></div><ServiceCards limit={6} /></div></section>
    <Faqs items={l.faqs} title={<>Before<br />you call.</>} />
    <Cta title={<>Plumbing trouble<br />in {c.name}?</>} text="Tell us what is going on and where. We will confirm a time and what to expect." />
  </div>;
}

export function CityPage({ city: c }) { if (c.landing) return <CityLanding city={c} />; return <><PageHero eyebrow={`${c.name.toUpperCase()}, CALIFORNIA`} breadcrumb={c.name} parent={{ href: '/service-areas', name: 'Service area' }} title={<>Your plumber<br />in {c.name}.</>} image={c.image} alt={c.image === 'truck' ? 'Phil and Paul’s Plumbing service truck' : c.image === 'waterHeater' ? 'A Phil and Paul’s technician beside an installed water heater' : c.image === 'repair' ? 'A Phil and Paul’s technician carrying out a plumbing repair' : 'Phil and Paul’s crew working on an underground plumbing line'}><p>{c.intro}</p></PageHero><TrustBar /><section className="section"><div className="container detail-layout"><div><Eyebrow>WORKING IN YOUR COMMUNITY</Eyebrow><h2>{c.focus}</h2></div><div><p className="large-copy">{c.detail}</p><p>Call our office with your address and a description of the issue. We will confirm availability and help you arrange the next step.</p><Button href={`tel:${business.telephone}`} icon="phone">Call {business.phone}</Button></div></div></section><LocalGuide guide={c.guide} /><section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>HOW WE CAN HELP</Eyebrow><h2>Plumbing service<br />in {c.name}.</h2></div></div><ServiceCards limit={6} /></div></section><Faqs items={[commonFaqs[1], commonFaqs[2], commonFaqs[3]]} /><Cta /></>; }

// The office's open/closed state in Lodi time. Null until mounted, so the static page and the first client render match.
function useOfficeStatus() {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      const get = type => parts.find(p => p.type === type).value;
      const day = get('weekday'), now = Number(get('hour')) * 60 + Number(get('minute'));
      const today = business.hours.find(h => h.dayOfWeek ? h.dayOfWeek.includes(day) : h.days === day);
      const minutes = t => { const [h, m] = t.split(':'); return Number(h) * 60 + Number(m); };
      setStatus({ today, open: !!today?.opens && now >= minutes(today.opens) && now < minutes(today.closes) });
    };
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  return status;
}

const contactTopics = [...services.slice(0, 6).map(s => s.name), 'A quote or bigger project', 'Property manager or landlord', 'Something else'];

// Same endpoint and consent record as the booking form (functions/api/[[route]].js), with the message first and email up front.
function ContactForm() {
  const { state, message, submit, notice } = useRequestSubmit();
  if (state === 'success') return <div className="form-success" role="status" aria-live="polite"><Icon name="check" size={40} /><h3>Thank you. We have your message.</h3><p>Our team will contact you during business hours. Your appointment is confirmed once you speak with us.</p><a className="text-link" href={`tel:${business.telephone}`}>Need us sooner? {business.phone}</a></div>;
  return <><form action={asset('/api/book-service')} method="post" onSubmit={submit} data-service-request>
    <div className="form-row"><div className="form-field"><label htmlFor="contact-name">Your name *</label><input id="contact-name" name="Name" autoComplete="name" required maxLength={120} placeholder="First and last name" /></div><div className="form-field"><label htmlFor="contact-phone">Phone number *</label><input id="contact-phone" name="Phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="(209) 555-0123" /></div></div>
    <div className="form-row"><div className="form-field"><label htmlFor="contact-email">Email <span>(optional)</span></label><input id="contact-email" name="Email" type="email" autoComplete="email" maxLength={256} placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="contact-city">City or ZIP code *</label><input id="contact-city" name="City" autoComplete="address-level2" required maxLength={120} placeholder="Where are you?" /></div></div>
    <div className="form-field"><label htmlFor="contact-topic">What is this about? *</label><select id="contact-topic" name="Service-Needed" required defaultValue=""><option value="" disabled>Choose one</option>{contactTopics.map(t => <option key={t}>{t}</option>)}</select></div>
    <div className="form-field"><label htmlFor="contact-details">Your message *</label><textarea id="contact-details" name="Details" rows={5} required maxLength={2000} placeholder="What is happening, and where? The more we know, the better we can prepare." /></div>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="contact-company-url">Leave this empty</label><input id="contact-company-url" name="Website" tabIndex={-1} autoComplete="off" /></div>
    <label className="consent-label"><input type="checkbox" name="Opt-In" required /><span>I agree to the <Link href={business.terms} target="_blank">Terms and Conditions</Link> and <Link href={business.privacy} target="_blank">Privacy Policy</Link>, and consent to calls, texts, or email about my request. Msg &amp; data rates may apply. Reply STOP to opt out. *</span></label>
    {state === 'error' && <div className="form-error" role="alert"><strong>Your message has not been sent.</strong><p>{message}</p></div>}
    <button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}<Icon name="arrow" size={19} /></button>
    <p className="form-note"><Icon name="shield" size={14} />This is a request, not a confirmed appointment. For anything urgent, call.</p>
  </form>{notice}</>;
}

// Dark, photo-backed hero in the city landing style, with the truck and its phone number as the backdrop. The h1 leads with the search phrase.
export function ContactPage() {
  useHeroParallax();
  const status = useOfficeStatus();
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=6+Sierra+Vista+Pl+Lodi+CA+95240';
  return <div className="city-landing contact-page">
    <section className="landing-hero" data-city="contact">
      <Photo name="team" alt="" className="landing-hero-bg" priority sizes="100vw" />
      <div className="container">
        <Breadcrumbs current="Contact" />
        <div className="landing-hero-grid"><div className="landing-hero-copy">
          <Eyebrow light>LET’S TALK PLUMBING</Eyebrow>
          <h1>Contact Phil &amp;<br />Paul’s Plumbing<br />in Lodi, CA.<span>A real person. A clear next step.</span></h1>
          <ul className="landing-pills">
            <li><a href={business.google} target="_blank" rel="noopener noreferrer"><BrandIcon name="google" size={18} /><strong>{business.rating.value}</strong><span className="landing-pill-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={13} />)}</span>{business.rating.count} reviews</a></li>
            <li><Icon3D name="pin" size={26} />6 Sierra Vista Pl, Lodi</li>
            <li><Icon3D name="shield" size={26} />Licensed &amp; insured · CA {business.license}</li>
          </ul>
          <p className="landing-lead">Call our local office, send a message, or stop by. We handle plumbing repairs, water heaters, drains, sewer lines, and bigger projects for homes and businesses in Lodi, Stockton, Galt, and nearby communities.</p>
          <div className="landing-actions"><a className="button button-primary landing-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} /><span><small>CALL NOW</small>{business.phone}</span></a><Button href="#contact-form" variant="outline-light" icon="arrow">Send a message</Button><small className="landing-hours">{hoursSummary.join(' · ')}</small></div>
        </div></div>
      </div>
    </section>
    <TrustBar />
    <section className="section contact-desk"><div className="container contact-desk-grid">
      <div className="contact-form-card" id="contact-form"><Eyebrow>SEND US A MESSAGE</Eyebrow><h2>Tell us what<br />is going on.</h2><p>Share a few details and our team will get back to you during business hours to talk it through and set up a visit.</p><ContactForm /></div>
      <div className="contact-ways">
        <h2 className="visually-hidden">Other ways to reach us</h2>
        <a className="contact-way contact-way-call" href={`tel:${business.telephone}`}><span className="contact-way-icon"><Phone3D size={34} /></span><span><small>CALL THE OFFICE</small><strong>{business.phone}</strong><em>Fastest for urgent problems. Tell us what is happening and where you are.</em></span></a>
        <a className="contact-way" href={`mailto:${business.email}`}><span className="contact-way-icon"><Icon3D name="check" size={34} /></span><span><small>EMAIL</small><strong>{business.email}</strong><em>For quotes, paperwork, and non-urgent questions.</em></span></a>
        <div className="contact-way contact-way-visit"><span className="contact-way-icon"><Icon3D name="pin" size={34} /></span><span><small>OUR HOME BASE</small><strong>6 Sierra Vista Pl<br />Lodi, CA 95240</strong><em>Call before visiting to confirm someone is available.</em><a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps<Icon name="diagonal" size={16} /></a></span></div>
        <div className="contact-hours"><div className="contact-hours-head"><h3>Office hours</h3>{status && <span className={`office-status${status.open ? ' is-open' : ''}`} role="status"><i aria-hidden="true" />{status.open ? 'Open now' : 'Closed right now'}</span>}</div><dl>{business.hours.map(h => <div key={h.days} className={status && status.today === h ? 'is-today' : undefined}><dt>{h.days}</dt><dd>{h.time}</dd></div>)}</dl></div>
      </div>
    </div></section>
    <section className="section contact-ready"><div className="container"><div className="section-heading"><div><Eyebrow>BEFORE YOU REACH OUT</Eyebrow><h2>A few things<br />that help.</h2></div><p className="section-heading-side">None of this is required.<br />It just gets you to a plan faster.</p></div><ol className="ready-grid">{contactReady.map(([icon, t, d]) => <li key={t}><Icon3D name={icon} size={56} /><h3>{t}</h3><p>{d}</p></li>)}</ol></div></section>
    <InstagramFeed />
    <AreaSection full />
    <Faqs items={contactFaqs} eyebrow="CONTACT & HOURS" title={<>Contact and<br />hours, answered.</>} />
  </div>;
}

const referralSources = ['Google', 'Yelp', 'Facebook or Instagram', 'Nextdoor', 'Friend or neighbor', 'Existing customer', 'Saw a truck', 'Other'];

export function BookingPage() {
  const { state, message, submit, notice } = useRequestSubmit();
  const [selectedServices, setSelectedServices] = useState([]);
  const toggleService = name => setSelectedServices(list => list.includes(name) ? list.filter(n => n !== name) : [...list, name]);
  return <section className="booking-section"><div className="container"><Breadcrumbs current="Request service" /><div className="booking-layout"><div className="booking-intro"><Eyebrow>LET’S GET STARTED</Eyebrow><h1>What can we<br />help you with?</h1><p>A few details are enough to get the conversation started. Our team will contact you during business hours to discuss the job and arrange a time.</p><div className="urgent-call"><Phone3D size={38} /><div><strong>Need help sooner?</strong><a href={`tel:${business.telephone}`}>Call {business.phone}</a><span>Call to confirm availability.</span></div></div><Photo name="softener-install" alt="Two Phil and Paul's plumbers installing a water softener at a Lodi home" sizes="(max-width: 1340px) 40vw, 533px" /><div className="booking-trust"><Icon name="shield" size={19} />Licensed &amp; insured <span>·</span> Serving since 1996</div></div><div className="booking-form-panel"><div className="form-heading"><span>YOUR SERVICE REQUEST</span><small>Fields marked * are required</small></div>{state === 'success' ? <div className="form-success" role="status" aria-live="polite"><Icon name="check" size={40} /><h2>We have your request.</h2><p>Our team will contact you during business hours. Your appointment is confirmed once you speak with us.</p><a className="text-link" href={`tel:${business.telephone}`}>Need to add something? {business.phone}</a></div> : <form action={asset("/api/book-service")} method="post" onSubmit={submit} data-service-request>
      <div className="form-field"><label htmlFor="request-name">Your name *</label><input id="request-name" name="Name" autoComplete="name" required maxLength={120} placeholder="First and last name" /></div><div className="form-row"><div className="form-field"><label htmlFor="request-phone">Phone number *</label><input id="request-phone" name="Phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="(209) 555-0123" /></div><div className="form-field"><label htmlFor="request-city">City or ZIP code *</label><input id="request-city" name="City" autoComplete="address-level2" required maxLength={120} placeholder="Where is the job?" /></div></div><div className="form-field"><label htmlFor="request-address">Street address <span>(optional)</span></label><input id="request-address" name="Address" autoComplete="street-address" maxLength={200} placeholder="Helps us plan the visit" /></div>
      <fieldset className="service-picker"><legend>What needs attention? * <span>(select all that apply)</span></legend><input type="hidden" name="Service-Needed" value={selectedServices.join(', ')} /><div>{[...services.slice(0, 6).map(s => ({ key: s.slug, name: s.name, icon: <Icon3D name={s.icon} size={26} /> })), { key: 'other', name: 'Other / not sure', label: 'Something else / not sure', icon: <Icon name="plus" size={21} /> }].map(o => <label className={selectedServices.includes(o.name) ? 'selected' : ''} key={o.key}><input type="checkbox" value={o.name} required={selectedServices.length === 0} checked={selectedServices.includes(o.name)} onChange={() => toggleService(o.name)} />{o.icon}<span>{o.label || o.name}</span><span className="radio-mark" /></label>)}</div></fieldset>
      <div className="form-field"><label htmlFor="request-email">Email <span>(optional)</span></label><input id="request-email" type="email" name="Email" autoComplete="email" maxLength={256} placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="request-details">Anything else we should know? <span>(optional)</span></label><textarea id="request-details" name="Details" rows={3} maxLength={2000} placeholder="A short description of the problem helps." /></div><div className="form-field"><label htmlFor="request-source">How did you hear about us? <span>(optional)</span></label><select id="request-source" name="Heard-About" defaultValue=""><option value="">Choose one</option>{referralSources.map(s => <option key={s}>{s}</option>)}</select></div><div className="form-honeypot" aria-hidden="true"><label htmlFor="company-url">Leave this empty</label><input id="company-url" name="Website" tabIndex={-1} autoComplete="off" /></div><label className="consent-label"><input type="checkbox" name="Opt-In" required /><span>I agree to the <Link href={business.terms} target="_blank">Terms and Conditions</Link> and <Link href={business.privacy} target="_blank">Privacy Policy</Link>, and consent to calls, texts, or email about my request. Msg &amp; data rates may apply. Reply STOP to opt out. *</span></label>{state === 'error' && <div className="form-error" role="alert"><strong>Your request has not been sent.</strong><p>{message}</p></div>}<button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending your request…' : 'Send service request'}<Icon name="arrow" size={19} /></button><p className="form-note"><Icon name="shield" size={14} />This is a request, not a confirmed appointment.</p>
    </form>}{notice}</div></div></div></section>;
}

function ReviewLink({ href, brand, title, stars, children }) {
  return <a className={`review-link review-link-${brand}`} href={href} target="_blank" rel="noopener noreferrer">
    <span className="review-link-head"><BrandIcon name={brand} size={46} /><span><strong>{title}</strong><span className="review-link-note">{stars && <span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={14} />)}</span>}{children}</span></span></span>
    <span className="review-link-cta">Write a review<Icon name="diagonal" size={17} /></span>
  </a>;
}

export function ReviewsPage() { return <><PageHero eyebrow="THE WORD AROUND TOWN" breadcrumb="Customer reviews" title={<>Our work.<br /><span>Their words.</span></>} image="acampo-vineyard-sunset" alt="" backdrop actions={false}><p>Choosing a plumber is easier when you can hear from people who have called before. Read what neighbors say, or add your own.</p><Awards /><div className="review-links"><ReviewLink href={business.google} brand="google" title="Google" stars>{business.rating.value} from {business.rating.count} reviews</ReviewLink><ReviewLink href={business.yelp} brand="yelp" title="Yelp">Tell your neighbors on Yelp</ReviewLink></div><a className="text-link review-jump" href="#customer-reviews">Read the reviews below<Icon name="arrow" size={16} /></a></PageHero><ReviewsWall /><ReviewPhotos /><section className="section share-review"><div className="container"><div className="share-grid"><div className="share-copy"><Eyebrow light>BEEN A CUSTOMER?</Eyebrow><h2>Tell us how<br />we did.</h2><p className="share-lede">Your words help our crew get better and tell the next neighbor what to expect. It takes about a minute.</p><div className="share-rating"><strong>{business.rating.value}</strong><div><span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={18} />)}</span><span>{business.rating.count} Google reviews</span></div></div></div><div className="share-actions"><div className="review-links"><ReviewLink href={business.google} brand="google" title="Google" stars>{business.rating.value} from {business.rating.count} reviews</ReviewLink><ReviewLink href={business.yelp} brand="yelp" title="Yelp">Tell your neighbors on Yelp</ReviewLink></div><p className="share-call">Want to talk about a recent job first? <a href={`tel:${business.telephone}`}>Call {business.phone}</a> and we will make it right.</p></div><ol className="share-steps"><li><span>01</span><strong>Pick a site</strong>Google or Yelp, whichever you use.</li><li><span>02</span><strong>Choose your stars</strong>Rate the visit honestly.</li><li><span>03</span><strong>Tell us about the job</strong>A few lines, good or bad.</li></ol></div></div></section><Cta /></>; }
// Searchable FAQ "database": a sticky side column of search and topics beside the filtered question list.
function FaqDatabase() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const [openAll, setOpenAll] = useState(null);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = faqGroups.flatMap(g => g.items.map(([q, a]) => ({ q, a, group: g })))
    .filter(r => (topic === 'all' || r.group.id === topic) && terms.every(t => `${r.q} ${r.a} ${r.group.title}`.toLowerCase().includes(t)));
  const total = faqGroups.reduce((n, g) => n + g.items.length, 0);
  const reset = () => { setQuery(''); setTopic('all'); };
  return <section className="faq-db">
    <div className="container faq-db-inner">
      <div className="faq-db-panel">
        <aside className="faq-db-side" aria-label="Search and topics">
          <label className="faq-db-search"><Icon name="search" size={20} /><span className="visually-hidden">Search the FAQs</span>
            <input type="search" value={query} onChange={e => { setQuery(e.target.value); setOpenAll(null); }} placeholder="Search questions" /></label>
          <p className="faq-db-label">Topics</p>
          <div className="faq-db-chips" role="group" aria-label="Filter by topic">
            <button type="button" className="faq-db-chip" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>All questions <span>{total}</span></button>
            {faqGroups.map(g => <button type="button" key={g.id} className="faq-db-chip" aria-pressed={topic === g.id} onClick={() => setTopic(g.id)}>{g.title} <span>{g.items.length}</span></button>)}
          </div>
          <div className="faq-help"><p>Have something else on your mind?<br />Give us a call. We are happy to help.</p><a className="text-link" href={`tel:${business.telephone}`}><Icon3D name="phone" size={27} />{business.phone}</a></div>
        </aside>
        <div className="faq-db-main">
        <div className="faq-db-bar"><p aria-live="polite">{rows.length === total ? `Showing all ${total} questions` : `${rows.length} of ${total} questions`}</p>
          <div><button type="button" onClick={() => setOpenAll(true)}>Expand all</button><button type="button" onClick={() => setOpenAll(false)}>Collapse all</button></div></div>
        <div className="faq-list">
          {faqGroups.filter(g => rows.some(r => r.group === g)).map(g => <Fragment key={g.id}><h3 className="faq-db-group">{g.title}</h3>{rows.filter(r => r.group === g).map(r => <details key={r.q} className="faq-item" open={openAll === null ? undefined : openAll}><summary><span className="faq-q">{r.q}</span><span className="faq-toggle"><Icon name="plus" size={18} /></span></summary><div className="faq-answer"><p>{r.a}</p></div></details>)}</Fragment>)}
          {rows.length === 0 && <div className="faq-db-empty"><h3>No matches.</h3><p>Try fewer words, or call us at <a href={`tel:${business.telephone}`}>{business.phone}</a> and a real person will help.</p><button type="button" className="faq-db-chip" onClick={reset}>Clear search</button></div>}
        </div>
        </div>
      </div>
    </div>
  </section>;
}

export function FaqsPage() {
  return <><PageHero eyebrow="FAQS" title={<>Straight answers.<br />No runaround.</>} image="jeff" alt="Jeff in a Phil and Paul's service truck" backdrop><p>The questions we hear most often. If yours is not here, call us and a real person will help.</p></PageHero><FaqDatabase /><Cta title={<>Still have<br />a question?</>} text="Tell us what is going on. A real person will get back to you with the next step." /></>;
}

const sitemapGroups = [
  ['Main pages', p => ['home', 'services', 'about', 'areas', 'contact', 'booking', 'reviews', 'faqs'].includes(p.type)],
  ['Services', p => p.type === 'service'],
  ['Service areas', p => p.type === 'city'],
  ['Policies', p => p.type === 'legal'],
];
export function SitemapPage() {
  return <><section className="legal-intro"><div className="container"><Breadcrumbs current="Sitemap" /><Eyebrow>PHIL &amp; PAUL’S PLUMBING</Eyebrow><h1>Sitemap</h1><p>Every page on our website, in one place.</p></div></section><section className="legal-section"><div className="container"><div className="sitemap-groups">{sitemapGroups.map(([title, test]) => <div key={title}><h2>{title}</h2><ul>{sitemapPages.filter(p => p.type !== 'sitemap' && test(p)).map(p => <li key={p.route}><Link href={p.route}>{p.name}</Link></li>)}</ul></div>)}</div></div></section></>;
}

const draftBanner = <div className="draft-banner" role="note"><strong>Draft:</strong> preview only. This page is hidden from search engines and is not listed in the sitemap.</div>;

// The lookup steps fill one after another with the same water numbers as the home page; hovering or focusing a step takes over.
function LicenseSteps({ steps = licensing.steps }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const last = steps.length - 1;
  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (paused || still) return undefined;
    const timer = setTimeout(() => setActive(i => (i >= last ? -1 : i + 1)), active === -1 ? 2200 : 4200);
    return () => clearTimeout(timer);
  }, [paused, still, active, last]);
  return <ol onMouseLeave={() => setPaused(false)} onBlur={() => setPaused(false)}>{steps.map(([t, d], i) => <li key={t} data-active={i === active ? 'true' : 'false'} tabIndex={0} onMouseEnter={() => { setActive(i); setPaused(true); }} onFocus={() => { setActive(i); setPaused(true); }}><WaterNumber value={i + 1} active={i === active} filled={i <= active} /><div><h3>{t}</h3><p>{d.split(/(?<=\.) /).map(line => <span key={line}>{line}</span>)}</p></div></li>)}</ol>;
}

// Rows tick off (or cross out) one after another each time the cards scroll into view, and reset once they leave. Shown at once under reduced motion.
function LicenseFlags({ green = licensing.green, red = licensing.red, greenTitle = 'Good signs', redTitle = 'Walk away if' }) {
  const [node, setNode] = useState(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!node) return undefined;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeen(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.intersectionRatio >= 0.3) setSeen(true); else if (!entry.isIntersecting) setSeen(false); }, { threshold: [0, 0.3] });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  const card = (kind, title, items, offset) => <div className={`lic-flag lic-${kind}`}><h3>{title}</h3><ul>{items.map((t, i) => <li key={t} style={{ '--d': `${offset + i * 1.1}s` }}><span className="lic-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{kind === 'green' ? <path d="m5 12.5 4.5 4.5L19 7" pathLength="1" /> : <><path d="M6.5 6.5l11 11" pathLength="1" /><path d="M17.5 6.5l-11 11" pathLength="1" /></>}</svg></span><span className="lic-text">{t}</span></li>)}</ul></div>;
  return <div className={`lic-flag-grid${seen ? ' is-in' : ''}`} ref={setNode}>{card('green', greenTitle, green, 0)}{card('red', redTitle, red, 0.5)}</div>;
}

// A one-off layout: license card, three-step lookup, green and red flags, paperwork band. See content/drafts.mjs.
export function LicensingPage() {
  const [no, ...rest] = business.license.split(' ').reverse();
  return <><PageHero eyebrow="LICENSED & INSURED" breadcrumb="Licensing" title={<>Properly licensed.<br /><span>Fully insured.</span></>} image="technician" alt="A Phil and Paul's plumber standing beside the red service van, with the company name and phone number on the side" backdrop proof={['Insured', 'Serving Lodi since 1996', 'Verifiable with the state']}><p>Hiring a plumber means letting someone into your home. Here is how to check that we are who we say we are, in about a minute.</p></PageHero>
    <section className="section lic-section"><div className="container lic-grid">
      <article className="lic-card lic-clipboard" aria-label="Our contractor license at a glance"><div className="lic-card-head"><Icon3D name="shield" size={54} /><div><small>CALIFORNIA CONTRACTOR LICENSE</small><strong>{no}</strong></div></div><dl><div><dt>Business</dt><dd>{business.legalName.replace(/\.$/, '')}</dd></div><div><dt>Classification</dt><dd>{rest.reverse().join(' ')} · Plumbing</dd></div><div><dt>Issued by</dt><dd>Contractors State License Board</dd></div><div><dt>Serving Lodi since</dt><dd>1996</dd></div></dl><p>Your copy of the record lives with the state.<br />Ours is just the number.</p></article>
      <div className="lic-steps"><Eyebrow>VERIFY IN ABOUT A MINUTE</Eyebrow><h2>Look us up.<br />Then look up<br />everyone else.</h2><LicenseSteps /><Button href="https://www.cslb.ca.gov/" icon="diagonal" target="_blank" rel="noopener noreferrer">Open the CSLB lookup</Button></div>
    </div></section>
    <section className="section lic-flags"><div className="container"><div className="section-heading"><div><Eyebrow>BEFORE YOU HIRE ANYONE</Eyebrow><h2>What to look for.<br />What to walk from.</h2></div><p className="section-heading-side">Good advice for any contractor, including us.</p></div><LicenseFlags /></div></section>
    <section className="lic-paper"><div className="container lic-paper-inner"><div><Eyebrow light>PROPERTY MANAGERS, LANDLORDS &amp; HOAS</Eyebrow><h2>Need paperwork?</h2><p>We are insured, and we can send a certificate of insurance before the job. Call the office and tell us who it should be addressed to.</p></div><a className="lic-paper-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={31} /><span><small>Ask for a certificate</small>{business.phone}</span></a></div></section>
    <Faqs items={licensing.faqs} eyebrow="LICENSING & INSURANCE" title={<>Quick answers<br />before you call.</>} /><Cta /></>;
}

// A one-off layout in the licensing page's style: warranty card, request steps, covered and not covered, manufacturer band. See content/drafts.mjs.
export function WarrantyPage() {
  return <><PageHero eyebrow="OUR WARRANTY" breadcrumb="Warranty" title={<>We stand behind<br /><span>our work.</span></>} image="fleet" alt="A Phil and Paul's service truck towing a trailer of water heaters in Lodi" backdrop proof={['One-year labor warranty', 'Most repairs and installations', 'Manufacturer coverage is separate']}><p>If something we installed or repaired is not right, call us. We would rather fix it than have you wonder.</p></PageHero>
    <section className="section lic-section"><div className="container lic-grid">
      <article className="lic-card lic-clipboard" aria-label="Our warranty at a glance"><div className="lic-card-head"><Icon3D name="shield" size={54} /><div><small>LABOR WARRANTY</small><strong>1 year</strong></div></div><dl><div><dt>Covers</dt><dd>Workmanship on most repairs and installations</dd></div><div><dt>Equipment</dt><dd>The manufacturer’s own warranty</dd></div><div><dt>Coverage details</dt><dd>Ask when you get your estimate</dd></div><div><dt>Questions</dt><dd>{business.phone}</dd></div></dl><p>Coverage can differ by job.<br />We will tell you what applies to yours.</p></article>
      <div className="lic-steps"><Eyebrow>HOW TO REQUEST SERVICE</Eyebrow><h2>Something not right?<br />Here is what<br />to do.</h2><LicenseSteps steps={warranty.steps} /><Button href={`tel:${business.telephone}`} icon="phone">Call {business.phone}</Button></div>
    </div></section>
    <section className="section lic-flags"><div className="container"><div className="section-heading"><div><Eyebrow>THE FINE PRINT, PLAINLY</Eyebrow><h2>What is covered.<br />What is not.</h2></div><p className="section-heading-side">Short, so you can actually read it.</p></div><LicenseFlags green={warranty.green} red={warranty.red} greenTitle="Covered by our labor warranty" redTitle="Not covered" /></div></section>
    <section className="lic-paper"><div className="container lic-paper-inner"><div><Eyebrow light>EQUIPMENT HAS ITS OWN WARRANTY</Eyebrow><h2>Water heaters and fixtures.</h2><p>Water heaters, fixtures, and other equipment carry a manufacturer warranty. That one comes from the manufacturer, not from us, and we can help you register the equipment and understand what it covers.</p></div><a className="lic-paper-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={31} /><span><small>Ask about your warranty</small>{business.phone}</span></a></div></section>
    <Faqs items={warranty.faqs} title={<>Warranty,<br />answered.</>} /><Cta title={<>Need us to<br />take another look?</>} text="Tell us what we worked on and what is not right. We will help you figure out the next step." /></>;
}

// Cut-out coupons with scissors on the dotted line. See content/drafts.mjs: the page stays a draft until the owner confirms every offer.
function Scissors({ size = 22 }) {
  return <svg className="coupon-scissors" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><g className="blade blade-a"><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M14.8 14.8 20 20" /></g><g className="blade blade-b"><circle cx="6" cy="18" r="3" /><path d="M20 4 8.12 15.88" /></g></svg>;
}
// Click-to-copy coupon code. Uses the Clipboard API, with a textarea fallback for older browsers and non-secure contexts.
function CouponCode({ code }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return undefined; const t = setTimeout(() => setCopied(false), 2200); return () => clearTimeout(t); }, [copied]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); }
    catch {
      const box = document.createElement('textarea');
      box.value = code; box.setAttribute('readonly', ''); box.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(box); box.select();
      try { document.execCommand('copy'); } catch { /* nothing more to try */ }
      document.body.removeChild(box);
    }
    setCopied(true);
  };
  return <button type="button" className={`coupon-code${copied ? ' is-copied' : ''}`} onClick={copy} aria-label={`Copy coupon code ${code}`}><small>CODE</small><code>{code}</code><span className="coupon-copy" aria-hidden="true">{copied ? <Icon name="check" size={14} /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>}<em>{copied ? 'Copied' : 'Copy'}</em></span><span className="visually-hidden" role="status" aria-live="polite">{copied ? `Coupon code ${code} copied` : ''}</span></button>;
}
// One cut-out coupon. The card's size is measured so the scissors can follow its real outline (offset-path only takes path() in current browsers),
// and a cream stroke over the dashed border is revealed in step with them.
function CouponCard({ offer: [value, unit, name, terms, code] }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setBox({ w: Math.round(el.offsetWidth), h: Math.round(el.offsetHeight) });
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);
  const r = 16;
  const route = box && `M${r} 0H${box.w - r}A${r} ${r} 0 0 1 ${box.w} ${r}V${box.h - r}A${r} ${r} 0 0 1 ${box.w - r} ${box.h}H${r}A${r} ${r} 0 0 1 0 ${box.h - r}V${r}A${r} ${r} 0 0 1 ${r} 0`;
  return <article ref={ref} className={`coupon-card${box ? ' is-tracing' : ''}`} style={route ? { '--route': `path('${route}')` } : undefined}>
    {box && <svg className="coupon-trace" width={box.w} height={box.h} aria-hidden="true" focusable="false"><rect x="1" y="1" width={box.w - 2} height={box.h - 2} rx={r - 1} pathLength="1" /></svg>}
    <Scissors />
    <div className="coupon-value"><small>SAVE</small><strong>{value}</strong><span>{unit}</span></div>
    <div className="coupon-info"><h3>{name}</h3><p>{terms}</p><div className="coupon-foot"><CouponCode code={code} /><span className="coupon-exp">{coupons.expires}</span></div></div>
  </article>;
}
export function CouponsPage() {
  return <><PageHero eyebrow="COUPONS & OFFERS" breadcrumb="Coupons" title={<>Plumbing offers<br /><span>for our neighbors.</span></>} image="crew" alt="A Phil and Paul's plumber with arms crossed beside a red service truck in Lodi" backdrop proof={['Mention the offer when you call', 'Homes and businesses', 'Serving Lodi since 1996']}><p>Save on the plumbing work you need. Mention your offer when you call or book, and we will apply it to your visit.</p></PageHero>
    <section className="section coupon-section"><div className="container"><div className="section-heading"><div><Eyebrow>CLIP &amp; SAVE</Eyebrow><h2>Cut along<br />the dotted line.</h2></div><p className="section-heading-side">Mention the code when you call<br />or send a service request.</p></div>
      <div className="coupon-board"><div className="coupon-grid-new">{coupons.offers.map(offer => <CouponCard key={offer[4]} offer={offer} />)}</div></div></div></section>
    <section className="service-approach section"><div className="container"><Eyebrow>HOW TO REDEEM</Eyebrow><div className="approach-grid">{coupons.steps.map(([t, d], i) => <WaterCard key={t} number={`0${i + 1}`} title={t} text={d} delay={i * 450} />)}</div></div></section>
    <section className="section coupon-terms"><div className="container"><div className="terms-panel"><div className="terms-intro"><span className="terms-seal"><Icon3D name="shield" size={50} /></span><Eyebrow light>THE FINE PRINT</Eyebrow><h2>Coupon terms,<br />plainly.</h2><p>Short and simple, so there are no surprises when we give you the price.</p></div><ol className="terms-list">{coupons.terms.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><p>{t}</p></li>)}</ol><div className="terms-actions"><Button href={`tel:${business.telephone}`} icon="phone" variant="cream">Call {business.phone}</Button><Link className="text-link text-link-light" href="/service">Browse all plumbing services<Icon name="arrow" size={18} /></Link></div></div></div></section>
    <Cta title={<>Ready to book<br />your visit?</>} text="Tell us what is going on and which offer you would like to use. We will help you figure out the next step." /></>;
}

// Preview-only pages; see content/drafts.mjs. Delete this component with the draft entries when no longer needed.
export function DraftPage({ page }) {
  const d = drafts[page.route];
  return <>{draftBanner}<PageHero eyebrow={d.eyebrow} breadcrumb={page.name} title={<>{d.title[0]}<br /><span>{d.title[1]}</span></>} image="team" alt="The Phil and Paul's team"><p>{d.intro}</p></PageHero><section className="section"><div className="container draft-layout"><div>{d.sections.map(([h, paras]) => <div key={h} className="draft-section"><h2>{h}</h2>{paras.map(t => <p key={t}>{t}</p>)}</div>)}</div><dl className="draft-facts">{d.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div></section></>;
}

export function LegalPage({ doc }) {
  const name = doc.title.charAt(0) + doc.title.slice(1).toLowerCase().replace(/\band\b/, '&');
  return <><section className="legal-intro"><div className="container"><Breadcrumbs current={name} /><Eyebrow>PHIL &amp; PAUL’S PLUMBING</Eyebrow><h1>{name}</h1><p>Last updated {doc.updated}</p></div></section><section className="legal-section"><div className="container"><article className="legal-body" dangerouslySetInnerHTML={{ __html: doc.html.replace(/href="\//g, `href="${asset('/')}`) }} /></div></section></>;
}
