import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { asset } from '../lib/asset.mjs';
import { photoWidths } from '../lib/photos.mjs';
import { business, services, otherServices, commonFaqs, areaFaqs, cities, hoursSummary, sitemapPages } from '../content/business.mjs';
import { drafts } from '../content/drafts.mjs';
import { Icon, Icon3D, Icon3DDefs, BrandIcon, Phone3D } from './Icon';
import { Header, Brand } from './Navigation';
import { ServiceAreaMap } from './ServiceAreaMap';
import { CityCoverage } from './StocktonMap';
import { Reviews } from './Reviews';
import { InstagramFeed } from './InstagramFeed';
import { WaterNumber } from './WaterNumber';
import { WaterCard } from './WaterCard';
import { CrewPolaroids } from './CrewPolaroids';
import { ConsentProvider, PrivacyChoicesButton } from './Consent';
import { DisplaySettingsProvider, DisplayLauncher, DisplaySettingsButton } from './DisplaySettings';
export { Icon, Reviews };

// `sizes` values match the widths measured in the layout (page gutters are 20px a side on phones), so each
// screen downloads the smallest file that stays sharp. The default fits page heroes and other half-width photos.
export function Photo({ name, alt, className = '', priority = false, sizes = '(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 45vw, 576px', ...props }) {
  const srcSet = format => photoWidths.map(w => `${asset(`/images/${name}-${w}.${format}`)} ${w}w`).join(', ');
  return <picture><source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} /><img className={className} src={asset(`/images/${name}-960.webp`)} srcSet={srcSet('webp')} sizes={sizes} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" width="1440" height="1080" {...props} /></picture>;
}

export function Button({ href = '/book-plumbing-services', children = 'Request service', variant = 'primary', icon = 'arrow', className = '', ...props }) {
  const body = <>{children}<Icon name={icon} size={19} /></>;
  return href.startsWith('/') ? <Link href={href} className={`button button-${variant} ${className}`} {...props}>{body}</Link> : <a href={href} className={`button button-${variant} ${className}`} {...props}>{body}</a>;
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><Brand footer /><p>Local people. Experienced hands.<br />Here for Lodi and our neighbors since 1996.</p><a className="footer-phone" href={`tel:${business.telephone}`}>{business.phone}<Icon name="diagonal" /></a><p className="footer-follow">Follow us</p><div className="footer-social"><a href="https://www.facebook.com/PhilPaulsPlumbing" target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Facebook"><BrandIcon name="facebook" /></a><a href="https://www.instagram.com/phil_and_pauls_plumbing/" target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Instagram"><BrandIcon name="instagram" /></a><a href={business.google} target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Google"><BrandIcon name="google" /></a><a href={business.yelp} target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Yelp"><BrandIcon name="yelp" /></a><a href={business.nextdoor} target="_blank" rel="noopener noreferrer" aria-label="Phil & Paul’s Plumbing on Nextdoor"><BrandIcon name="nextdoor" /></a></div></div><div><h2>What we do</h2>{services.map(s => <Link key={s.slug} href={`/service/${s.slug}`}>{s.name}</Link>)}</div><div><h2>Good to know</h2><Link href="/about">Our story</Link><Link href="/service-areas">Where we work</Link><Link href="/leave-a-review">Customer reviews</Link><Link href="/faqs">FAQs</Link><Link href="/licensing">Licensing</Link><Link href="/warranty">Warranty</Link><Link href="/coupons">Coupons</Link><Link href="/contact">Contact &amp; hours</Link><Link href="/book-plumbing-services">Request service</Link><Link href="/sitemap">Sitemap</Link></div><div><h2>Service areas</h2><Link href="/service-areas">Lodi</Link>{cities.map(c => <Link key={c.slug} href={`/plumber/${c.slug}`}>{c.name}</Link>)}</div><div className="footer-visit"><h2>Find us in Lodi</h2><p>6 Sierra Vista Pl<br />Lodi, CA 95240</p><p>{business.hours.map((h, i) => <Fragment key={h.days}>{i > 0 && <br />}{h.days}: {h.time}</Fragment>)}</p><span className="license"><Icon name="shield" size={17} />Fully licensed &amp; insured<br />CA {business.license}</span></div></div><p className="footer-warranty">*One-year labor warranty applies to most repairs and installations. Ask about coverage for your job.</p><div className="footer-bottom"><div className="footer-legal"><span>© {new Date().getFullYear()} {business.legalName} All rights reserved.</span><a className="footer-credit" href="https://alectronicsolutions.com" target="_blank" rel="noopener">Replumbed by <strong>Alectronic Solutions</strong><Icon name="diagonal" size={12} /></a></div><div className="footer-policies"><Link href={business.privacy}>Privacy</Link><Link href={business.terms}>Terms</Link><Link href={business.cookies}>Cookies</Link><Link href={business.accessibility}>Accessibility</Link><DisplaySettingsButton /><PrivacyChoicesButton /></div></div></div></footer>;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <button type="button" className={`back-to-top ${visible ? 'is-visible' : ''}`} onClick={() => window.scrollTo({ top: 0 })} aria-label="Back to top" tabIndex={visible ? 0 : -1}><Icon name="arrow" size={20} /></button>;
}

export function Layout({ children }) {
  return <ConsentProvider><DisplaySettingsProvider><a className="skip-link" href="#main-content">Skip to content</a><Icon3DDefs /><Header /><main id="main-content">{children}</main><Footer /><BackToTop /><DisplayLauncher /><div className="mobile-actions"><a href={`tel:${business.telephone}`}><Icon name="phone" size={18} />Call now</a><Link href="/book-plumbing-services">Request service<Icon name="arrow" size={18} /></Link></div></DisplaySettingsProvider></ConsentProvider>;
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
export function TrustBar() {
  const [node, setNode] = useState(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return <div className="trust-bar"><dl className="container trust-grid" ref={setNode}><div><dd className="trust-number"><CountUp to={100} suffix="%" run={inView} /></dd><dt>Fully licensed &amp; insured</dt></div><div><dd className="trust-google"><span className="trust-google-score"><BrandIcon name="google" size={30} /><span className="trust-number"><CountUp to={Number(business.rating.value)} decimals={1} run={inView} /></span></span><span className="trust-stars" role="img" aria-label={`${business.rating.value} out of 5 stars on Google`}>{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={16} />)}</span></dd><dt><a href={business.google} target="_blank" rel="noopener noreferrer">Highly rated on Google</a></dt></div><div><dd className="trust-number"><CountUp mode="grade" run={inView} /></dd><dt><a href={business.bbb} target="_blank" rel="noopener noreferrer">BBB rating</a></dt></div><div><dd className="trust-number"><CountUp to={1} suffix=" Year" mode="random" run={inView} /></dd><dt>Labor warranty*</dt></div></dl></div>;
}

export function Awards({ className = '' }) {
  return <div className={`awards ${className}`}><img src={asset('/images/badges/best-of-lodi-2026.webp')} alt="Winner, Best of Lodi 2026, Lodi News-Sentinel Readers’ Choice Awards" width="144" height="144" loading="lazy" decoding="async" /><a href={business.yelp} target="_blank" rel="noopener noreferrer"><img src={asset('/images/badges/yelp-customer-best.webp')} alt="People love us on Yelp" width="144" height="144" loading="lazy" decoding="async" /></a><p><strong>Best of Lodi 2026</strong>Voted by readers of the Lodi News-Sentinel</p></div>;
}

// `wide` fits every service into two rows of five on desktop; the closing tile fills the tenth slot.
export function ServiceCards({ limit, wide = false }) {
  const sizes = wide ? '(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 30px), (max-width: 1340px) calc(20vw - 30px), 240px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1340px) calc(33vw - 30px), 410px';
  return <div className={`services-grid${wide ? ' services-grid-wide' : ''}`}>{services.slice(0, limit).map(s => <Link className="service-card" key={s.slug} href={`/service/${s.slug}`}><div className="service-card-photo"><Photo name={s.image} alt={`${s.name} work by the Phil and Paul's team`} sizes={sizes} /><span className="service-card-arrow"><Icon name="diagonal" size={23} /></span></div><div className="service-card-copy"><div><Icon3D name={s.icon} size={34} /><h3>{s.name}</h3></div><p>{s.description}</p></div></Link>)}{wide && <Link className="service-card-more" href="/service"><Icon name="plus" size={26} /><div><h3>Something else?</h3><p>Fixtures, leaks, and the smaller jobs. If it is plumbing, chances are we do it.</p></div><span className="text-link">All services<Icon name="arrow" size={18} /></span></Link>}</div>;
}

export function Faqs({ items = commonFaqs, title = <>A few things<br />worth knowing.</>, eyebrow = 'YOUR QUESTIONS, ANSWERED' }) {
  return <section className="faq-section section"><div className="container faq-layout"><div className="faq-intro"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2><div className="faq-help"><p>Have something else on your mind?<br />Give us a call. We are happy to help.</p><a className="text-link" href={`tel:${business.telephone}`}><Icon name="phone" size={18} />{business.phone}</a></div></div><div className="faq-list">{items.map(([q, a], i) => <details key={q} className="faq-item"><summary><span className="faq-number">{String(i + 1).padStart(2, '0')}</span><span className="faq-q">{q}</span><span className="faq-toggle"><Icon name="plus" size={18} /></span></summary><div className="faq-answer"><p>{a.split(/(?<=\.) (?=Our California|Call to confirm)/).map((part, j) => <span key={j}>{j > 0 && <br />}{part}</span>)}</p></div></details>)}</div></div></section>;
}

// The service request form, shared by the CTA band and landing-page heroes. `idPrefix` keeps label ids unique when two copies share a page.
export function ServiceRequestForm({ idPrefix = 'cta', title = 'Request service' }) {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (state === 'sending' || !form.reportValidity()) return;
    setState('sending'); setMessage('');
    try {
      const response = await fetch('/api/book-service', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || `Your request could not be sent. Please call ${business.phone}.`);
      setState('success');
    } catch (error) { setState('error'); setMessage(error.message); }
  }
  const id = name => `${idPrefix}-${name}`;
  if (state === 'success') return <div className="form-success" role="status" aria-live="polite"><Icon name="check" size={36} /><h3>We have your request.</h3><p>Our team will contact you during business hours.</p></div>;
  return <form action={asset('/api/book-service')} method="post" onSubmit={submit} data-service-request>
    <h3>{title}</h3>
    <div className="form-row"><div className="form-field"><label htmlFor={id('name')}>Your name</label><input id={id('name')} name="Name" autoComplete="name" required maxLength={120} placeholder="First and last name" /></div><div className="form-field"><label htmlFor={id('phone')}>Phone number</label><input id={id('phone')} name="Phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="(209) 555-0123" /></div></div>
    <div className="form-row"><div className="form-field"><label htmlFor={id('city')}>City or ZIP</label><input id={id('city')} name="City" autoComplete="address-level2" required maxLength={120} placeholder="Where is the job?" /></div><div className="form-field"><label htmlFor={id('service')}>What needs attention?</label><select id={id('service')} name="Service-Needed" required defaultValue=""><option value="" disabled>Choose one</option>{services.slice(0, 6).map(s => <option key={s.slug}>{s.name}</option>)}<option>Other / not sure</option></select></div></div>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor={id('company-url')}>Leave this empty</label><input id={id('company-url')} name="Website" tabIndex={-1} autoComplete="off" /></div>
    <label className="consent-label"><input type="checkbox" name="Opt-In" required /><span>I agree to the <Link href={business.terms} target="_blank">Terms</Link> and <Link href={business.privacy} target="_blank">Privacy Policy</Link>, and to be contacted by phone, text, or email about this request. Msg &amp; data rates may apply. Reply STOP to opt out.</span></label>
    {state === 'error' && <div className="form-error" role="alert"><strong>Your request has not been sent.</strong><p>{message}</p></div>}
    <button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send request'}<Icon name="arrow" size={19} /></button>
  </form>;
}

export function Cta({ title = <>Let’s get it<br />taken care of.</>, text = 'Tell us what is going on. We will help you figure out the next step.' }) {
  return <section className="cta-section"><div className="container cta-inner"><div className="cta-copy"><Eyebrow light>PHIL &amp; PAUL’S PLUMBING</Eyebrow><h2>{title}</h2><p>{text}</p><a className="cta-call" href={`tel:${business.telephone}`}><Icon name="phone" size={20} /><span>Prefer to talk? <strong>{business.phone}</strong></span></a><small>{hoursSummary.join(' · ')}</small></div>
    <div className="cta-card"><ServiceRequestForm /></div><span className="cta-watermark" aria-hidden="true">P&amp;P</span></div></section>;
}

export function Breadcrumbs({ current, parent }) { return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{parent && <><Link href={parent.href}>{parent.name}</Link><span>/</span></>}<span aria-current="page">{current}</span></nav>; }
export function PageHero({ eyebrow, title, children, image = 'truck', alt = 'Phil and Paul’s Plumbing service truck in Lodi', breadcrumb, parent, actions = true }) {
  return <section className="page-hero"><div className="container"><Breadcrumbs current={breadcrumb || eyebrow} parent={parent} /><div className="page-hero-grid"><div className="page-hero-copy"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><div className="page-hero-description">{children}</div>{actions && <div className="button-group"><Button /><a className="text-link" href={`tel:${business.telephone}`}><Icon name="phone" size={18} />{business.phone}</a></div>}</div><div className="page-hero-image"><Photo name={image} alt={alt} priority /><span className="image-caption"><span className="utility-dot" />LOCAL PEOPLE. EXPERIENCED HANDS.</span></div></div></div></section>;
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

export function HomePage() {
  return <><section className="home-hero"><div className="container hero-grid"><div className="hero-copy"><Eyebrow>LODI, STOCKTON &amp; GALT</Eyebrow><h1>Your local<br />plumber.<br /><span>Since 1996.</span></h1><p>When something goes wrong with your plumbing, you don’t want to guess who to call. Phil &amp; Paul’s has been serving Lodi and the surrounding communities since 1996, with honest diagnoses and work done right the first time.</p><p>We’re fully licensed, insured, and rated A+ by the BBB. Whether it’s a water heater going out, a stubborn drain, or a pipe you’ve been meaning to fix, give us a call and we’ll get it handled.</p><div className="button-group"><Button icon="diagonal">Let’s fix it</Button><a className="hero-phone" href={`tel:${business.telephone}`}><Phone3D size={26} /><span><small>GIVE US A CALL</small>{business.phone}</span></a></div><div className="hero-note"><Icon name="check" size={16} />Homes &amp; businesses <span>·</span> California {business.license}</div></div><div className="hero-visual"><div className="hero-photo"><Photo name="team" alt="The Phil and Paul's Plumbing crew in front of their red service van" priority sizes="(max-width: 760px) calc(100vw - 50px), (max-width: 1390px) 48vw, 668px" /><div className="hero-photo-caption"><span>YOUR NEIGHBORS. YOUR PLUMBERS.</span><span>LODI, CA <Icon name="pin" size={15} /></span></div></div><div className="hero-badges"><img className="hero-badge hero-badge-lodi" src={asset('/images/badges/best-of-lodi-2026.webp')} alt="Winner, Best of Lodi 2026, Lodi News-Sentinel Readers’ Choice Awards" width="144" height="144" decoding="async" /><a className="hero-badge hero-badge-yelp" href={business.yelp} target="_blank" rel="noopener noreferrer"><img src={asset('/images/badges/yelp-customer-best.webp')} alt="People love us on Yelp" width="144" height="144" decoding="async" /></a></div></div></div></section><TrustBar />
    <section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>OUR SERVICES</Eyebrow><h2>What needs<br />fixing?</h2></div><div className="section-heading-side"><p>From the kitchen sink to the sewer line.<br />A capable crew for the work you need.</p><Link className="text-link" href="/service">Explore all services<Icon name="arrow" size={18} /></Link></div></div><ServiceCards wide /></div></section>
    <section className="about-feature"><div className="container about-feature-grid"><div className="about-feature-photo about-feature-photo-portrait"><picture><source type="image/avif" srcSet={asset('/images/wave-500.avif')} /><img src={asset('/images/wave-500.webp')} alt="A Phil and Paul's plumber smiling and waving from the window of a red service truck" width="500" height="888" loading="lazy" decoding="async" /></picture><div className="photo-label"><span>LOCAL ROOTS.</span><span>EXPERIENCED HANDS.</span></div></div><div className="about-feature-copy"><Eyebrow light>ABOUT PHIL &amp; PAUL’S</Eyebrow><h2>Honest plumbing.<br />From people<br /><span>who know Lodi.</span></h2><p className="about-lead">We started Phil &amp; Paul’s because we believed this community deserved a plumber it could trust: someone who explains the problem clearly, recommends only what you need, and stands behind the work.</p><p>That is still how we work. We are local, licensed, and insured, serving Lodi and nearby communities since 1996. When you call, you reach experienced plumbers who know the area, not a call center.</p><ul className="check-list"><li><Icon name="check" />Talk to a local team</li><li><Icon name="check" />Understand your options before work begins</li><li><Icon name="check" />Work backed by a one-year labor warranty<sup>*</sup></li></ul><div className="button-group"><Button href="/about" variant="outline-light">Get to know us</Button><a className="text-link text-link-light" href={`tel:${business.telephone}`}><Icon name="phone" size={18} />{business.phone}</a></div></div></div></section>
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
export function ServicesPage() { return <><PageHero eyebrow="PLUMBING SERVICES" title={<>The right hands<br />for the job.</>} image="repair" alt="A Phil and Paul's technician carrying out a plumbing repair"><p>Water heaters, drains, sewer lines, and the everyday repairs that keep a property running. Tell us what you need. We will take it from there.</p></PageHero><TrustBar /><section className="section"><div className="container"><div className="section-heading"><div><Eyebrow>HOMES &amp; BUSINESSES</Eyebrow><h2>From a small fix<br />to a bigger job.</h2></div><p className="section-heading-side">Licensed plumbing service in Lodi,<br />Stockton, Galt, and nearby communities.</p></div><ServiceCards /></div></section><section className="section service-overview other-services"><div className="container detail-layout"><div><Eyebrow>AND THE SMALLER JOBS</Eyebrow><h2>We handle<br />those too.</h2><p>Not every job needs its own page. If you do not see yours listed, call and ask. Chances are we do it.</p></div><OtherServicesList /></div></section><Faqs items={commonFaqs.slice(1, 4)} /><Cta /></>; }

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
    <header className="guide-aside"><Eyebrow>{g.eyebrow}</Eyebrow><h2>{g.heading}</h2>{g.facts && <dl className="guide-facts">{g.facts.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>}<a className="button button-primary guide-call" href={`tel:${business.telephone}`}><Icon name="phone" size={19} />Call {business.phone}</a></header>
    <div className="guide-main"><div className="guide-body">{g.body.map((p, i) => <Fragment key={p.slice(0, 40)}>{g.titles?.[i] ? <section className="guide-chapter"><h3><span>{String(i).padStart(2, '0')}</span>{g.titles[i]}</h3><p>{p}</p></section> : <p className={i === 0 ? 'guide-lead' : undefined}>{p}</p>}{g.callout && i === (g.calloutAfter ?? 2) && <aside className="guide-callout"><span aria-hidden="true">“</span>{g.callout}</aside>}</Fragment>)}</div>{signs}{links}</div>
  </div></section>;
}

export function ServicePage({ service: s }) { return <><PageHero eyebrow={s.name.toUpperCase()} breadcrumb={s.name} parent={{ href: '/service', name: 'Services' }} title={<>{s.name}<br /><span>in Lodi.</span></>} image={s.image} alt={`${s.name} work by Phil and Paul's Plumbing`}><p>{s.intro}</p></PageHero><TrustBar /><section className="section service-overview"><div className="container detail-layout"><div><Eyebrow>WHAT WE CAN HELP WITH</Eyebrow><h2>{s.short.split(/(?<=,) /).map((part, i) => <span key={i} className="h2-line">{part}</span>)}</h2><p>{s.description}</p></div><ul className="service-checks">{s.details.map((d, i) => <li key={d}>{s.detailIcons?.[i] ? <Icon3D name={s.detailIcons[i]} size={44} /> : <Icon name="check" size={19} />}<span>{d}</span></li>)}</ul></div>{s.slug === 'gas-lines' && <div className="container"><aside className="safety-notice" aria-labelledby="gas-safety-title"><Icon3D name="flame" size={30} /><div><h3 id="gas-safety-title">Smell gas? Get out first.</h3><p>Leave the building right away. Do not use light switches, phones, or anything that could make a spark. From a safe distance, call 911 or PG&amp;E at <a href="tel:+18007435000">1-800-743-5000</a>. Then call us for repairs.</p></div></aside></div>}</section><section className="section service-approach"><div className="container"><Eyebrow>THE WAY WE WORK</Eyebrow><div className="approach-grid">{s.sections.map(([t, d], i) => <WaterCard key={t} number={`0${i + 1}`} title={t} text={d} delay={i * 450} />)}</div></div></section><LocalGuide guide={s.guide} /><Faqs items={s.faqs} title={<>About your<br />{s.slug === 'commercial-plumbing' ? 'property.' : 'service.'}</>} /><section className="related-section section"><div className="container"><div className="section-heading"><div><Eyebrow>WHILE WE’RE HERE</Eyebrow><h2>Other ways we help.</h2></div><Link className="text-link" href="/service">All services <Icon name="arrow" size={18} /></Link></div><div className="related-links">{services.filter(x => x.slug !== s.slug).slice(0, 4).map(x => <Link key={x.slug} href={`/service/${x.slug}`}><Icon3D name={x.icon} size={30} /><span>{x.name}</span><Icon name="diagonal" size={18} /></Link>)}</div></div></section><Cta /></>; }

export function AboutPage() { return <><PageHero eyebrow="OUR STORY" title={<>Local roots.<br />A lot of hard work.</>} image="team" alt="The Phil and Paul's Plumbing team in Lodi"><p>Phil &amp; Paul’s Plumbing has served Lodi and the surrounding communities since 1996. We are a local team with a straightforward way of doing business.</p></PageHero><TrustBar /><section className="section"><div className="container story-layout"><div><Eyebrow>THE WAY WE SEE IT</Eyebrow><h2>A good plumber<br />should make<br />things simpler.</h2></div><div className="story-copy"><p className="large-copy">You call because something is wrong. Our job is to understand it, explain it, and do the work properly.</p><p>That means listening before recommending a repair. It means telling you when replacement makes more sense and when it does not. And it means answering your questions along the way.</p><p>From the office to the job site, the people you deal with are part of a local team. We work on homes and businesses across Lodi, Stockton, Galt, and nearby communities.</p><p>We are licensed, insured, and back most repairs and installations with a one-year labor warranty. If you have a concern about our work, call us.</p><Awards /></div></div></section><section className="team-gallery section"><div className="container"><div className="section-heading"><div><Eyebrow>PEOPLE BEHIND THE WORK</Eyebrow><h2>You’ll recognize<br />the red trucks.</h2></div><p className="section-heading-side">Our crew, our equipment, and<br />work from around the community.</p></div><div className="gallery-grid"><figure><Photo name="jeff" alt="Jeff in a Phil and Paul's Plumbing service truck" sizes="(max-width: 760px) calc(50vw - 28px), (max-width: 1390px) 26vw, 362px" /><figcaption>A familiar face on the road.</figcaption></figure><figure><Photo name="crew" alt="A Phil and Paul's technician beside a service van" sizes="(max-width: 760px) calc(50vw - 28px), (max-width: 1390px) 26vw, 362px" /><figcaption>Ready for the work ahead.</figcaption></figure><figure><Photo name="field" alt="Phil and Paul's Plumbing working on an underground line" sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1390px) 36.5vw, 507px" /><figcaption>From the curb to the connection.</figcaption></figure></div></div></section><Reviews /><Cta /></>; }

export function AreasPage() {
  useHeroParallax();
  const communities = [{ name: 'Lodi', href: '/', image: 'team', alt: 'The Phil and Paul’s Plumbing crew in front of their red service van in Lodi', caption: 'Our home base. Shop and dispatch are here.', wide: true }, ...cities.map(c => ({ name: c.name, href: `/plumber/${c.slug}`, image: c.image, alt: `A view of ${c.name}, California, in the Phil and Paul’s Plumbing service area`, caption: c.landing?.drive ?? 'Residential and commercial service' }))];
  return <>
    <div className="city-landing"><section className="landing-hero" data-city="service-areas">
      <Photo name="fleet" alt="" className="landing-hero-bg" priority sizes="100vw" />
      <div className="container">
        <Breadcrumbs current="Service area" />
        <div className="landing-hero-grid"><div className="landing-hero-copy">
          <Eyebrow light>WHERE WE WORK</Eyebrow>
          <h1>Plumber in<br />Lodi, Stockton<br />&amp; Galt, CA.<span>Based in Lodi. Here for our neighbors.</span></h1>
          <ul className="landing-pills"><li><Icon name="pin" size={17} />7 communities served</li><li><Icon name="shield" size={17} />Licensed &amp; insured · CA {business.license}</li></ul>
          <p className="landing-lead">We provide residential and commercial plumbing service in Lodi, Stockton, Galt, Acampo, Woodbridge, Lockeford, and nearby communities. Not sure we cover your address?<br />Call and we will tell you.</p>
          <div className="landing-actions"><a className="button button-primary landing-call" href={`tel:${business.telephone}`}><Phone3D size={24} /><span><small>CALL NOW</small>{business.phone}</span></a><Button variant="outline-light" icon="diagonal">Request service</Button><small className="landing-hours">{hoursSummary.join(' · ')}</small></div>
        </div></div>
      </div>
    </section></div>
    <TrustBar />
    <AreaSection full />
    <section className="section areas-overview"><div className="container detail-layout"><div><Eyebrow>ONE TEAM, EVERY COMMUNITY</Eyebrow><h2>The same crew<br />at every address.</h2><CrewPolaroids Photo={Photo} /></div><div className="crew-aside"><p className="large-copy">Phil &amp; Paul’s works out of Lodi, and the same licensed plumbers cover every community on this page.</p>
      <ul className="crew-facts"><li><Icon3D name="pin" size={34} /><strong>1996</strong><span>Serving Lodi and neighbors</span></li><li><Icon3D name="shield" size={34} /><strong>{business.license.split(' ')[0]}</strong><span>Licensed &amp; insured</span></li><li><Icon3D name="check" size={34} /><strong>1 year</strong><span>Labor warranty on most repairs</span></li></ul>
      <h3 className="crew-aside-label">Where the crew can help</h3>
      <div className="crew-services">{['water-heaters', 'drain-cleaning', 'sewer-repair', 'commercial-plumbing'].map(slug => { const sv = services.find(x => x.slug === slug); return <Link key={slug} href={`/service/${slug}`} className="crew-service"><span className="crew-service-icon"><Icon3D name={sv.icon} size={46} /></span><span><strong>{sv.name}</strong><small>{sv.short}</small></span><Icon name="arrow" size={18} /></Link>; })}</div>
      <div className="crew-aside-cta"><Button href={`tel:${business.telephone}`} icon="phone">Call {business.phone}</Button><Link href="/service" className="crew-aside-link">Not sure which fits? Browse all plumbing services</Link></div>
      <p className="crew-aside-note">Each community below has its own page with the neighborhoods and ZIP codes we cover.</p></div></div></section>
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
              <li><Icon name="clock" size={17} />{l.sameDay}</li>
              <li><Icon name="pin" size={17} />{l.drive}</li>
            </ul>
            <p className="landing-lead">{l.lead}</p>
            <div className="landing-actions"><a className="button button-primary landing-call" href={`tel:${business.telephone}`}><Phone3D size={24} /><span><small>CALL NOW</small>{business.phone}</span></a><Button variant="outline-light" icon="diagonal">Request service</Button><small className="landing-hours">{hoursSummary.join(' · ')}</small></div>
          </div>
        </div>
      </div>
    </section>
    <TrustBar />
    <section className="section landing-problems"><div className="container"><div className="section-heading"><div><Eyebrow>WHAT WE FIX HERE</Eyebrow><h2>The calls we get<br />from {c.name}.</h2></div><p className="section-heading-side">{(l.problemsNote || ['Older homes, busy rentals, and restaurant', 'kitchens. Each one fails its own way.']).flatMap((t, i) => i ? [<br key={i} />, t] : [t])}</p></div>
      <div className="problem-grid">{l.problems.map(([photo, t, d, href], i) => <Link key={t} href={href} className="problem-card"><Photo name={photo} alt="" className="problem-photo" sizes={i === 0 ? '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 72px), 480px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 390px'} /><div className="problem-body"><h3>{t}</h3><p>{d}</p><span className="problem-link">{services.find(s => href.endsWith(s.slug))?.name}<Icon name="arrow" size={17} /></span></div></Link>)}</div></div></section>
    {featured && <section className="landing-quote"><div className="container landing-quote-inner"><figure><span className="landing-quote-mark" aria-hidden="true">“</span><blockquote>{featured.text.split(/(?<=[.!?]) (?=What more)/).flatMap((part, i) => i ? [<br key={i} />, part] : [part])}</blockquote><figcaption><a href={featured.profile} target="_blank" rel="noopener noreferrer">{featured.name}<Icon name="diagonal" size={15} /></a><span>Google review from a {c.name} customer</span></figcaption></figure><a className="landing-quote-score" href={business.google} target="_blank" rel="noopener noreferrer"><strong>{business.rating.value}</strong><span className="landing-pill-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" size={16} />)}</span><span>{business.rating.count} Google reviews</span></a></div></section>}
    <section className="section landing-coverage"><div className="container landing-coverage-grid"><CityCoverage slug={c.slug} neighborhoods={l.neighborhoods} zips={l.zips}><Eyebrow>WHERE WE GO</Eyebrow><h2>Every corner<br />of {c.name}.</h2><p>{l.drive}.<br />Don’t see your neighborhood? Call, we probably cover it.</p></CityCoverage></div></section>
    {l.photos.length > 0 && <section className="section landing-work"><div className="container"><div className="section-heading"><div><Eyebrow>RECENT WORK</Eyebrow><h2>Jobs around<br />the city.</h2></div></div><div className="landing-work-grid">{l.photos.map(([name, caption]) => <figure key={name}><Photo name={name} alt={caption} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1340px) 33vw, 420px" /><figcaption>{caption}</figcaption></figure>)}</div></div></section>}
    <section className="process-section section"><div className="container"><div className="section-heading"><div><Eyebrow>HERE’S HOW IT WORKS</Eyebrow><h2>One call.<br />A clear plan.</h2></div><p className="section-heading-side">You know who is coming, what is wrong,<br />and what it costs before work starts.</p></div><ProcessSteps /></div></section>
    <LocalGuide guide={c.guide} />
    <Reviews />
    <section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>HOW WE CAN HELP</Eyebrow><h2>Everything else<br />we handle.</h2></div><Link className="text-link" href="/service">All services<Icon name="arrow" size={18} /></Link></div><ServiceCards limit={6} /></div></section>
    <Faqs items={l.faqs} title={<>Before<br />you call.</>} />
    <Cta title={<>Plumbing trouble<br />in {c.name}?</>} text="Tell us what is going on and where. We will confirm a time and what to expect." />
  </div>;
}

export function CityPage({ city: c }) { if (c.landing) return <CityLanding city={c} />; return <><PageHero eyebrow={`${c.name.toUpperCase()}, CALIFORNIA`} breadcrumb={c.name} parent={{ href: '/service-areas', name: 'Service area' }} title={<>Your plumber<br />in {c.name}.</>} image={c.image} alt={c.image === 'truck' ? 'Phil and Paul’s Plumbing service truck' : c.image === 'waterHeater' ? 'A Phil and Paul’s technician beside an installed water heater' : c.image === 'repair' ? 'A Phil and Paul’s technician carrying out a plumbing repair' : 'Phil and Paul’s crew working on an underground plumbing line'}><p>{c.intro}</p></PageHero><TrustBar /><section className="section"><div className="container detail-layout"><div><Eyebrow>WORKING IN YOUR COMMUNITY</Eyebrow><h2>{c.focus}</h2></div><div><p className="large-copy">{c.detail}</p><p>Call our office with your address and a description of the issue. We will confirm availability and help you arrange the next step.</p><Button href={`tel:${business.telephone}`} icon="phone">Call {business.phone}</Button></div></div></section><LocalGuide guide={c.guide} /><section className="section services-section"><div className="container"><div className="section-heading"><div><Eyebrow>HOW WE CAN HELP</Eyebrow><h2>Plumbing service<br />in {c.name}.</h2></div></div><ServiceCards limit={6} /></div></section><Faqs items={[commonFaqs[1], commonFaqs[2], commonFaqs[3]]} /><Cta /></>; }

export function ContactPage() { return <><PageHero eyebrow="LET’S TALK PLUMBING" title={<>A real person.<br />A clear next step.</>} image="jeff" alt="Jeff in a Phil and Paul's service truck" actions={false}><p>Have a repair to schedule or a question about a bigger job? Call our local team. For an urgent plumbing problem, calling is the best place to start.</p><Button href={`tel:${business.telephone}`} icon="phone">{business.phone}</Button></PageHero><section className="section contact-section"><div className="container contact-grid"><div className="contact-info"><Eyebrow>GET IN TOUCH</Eyebrow><h2>We’re right<br />here in Lodi.</h2><div className="contact-block"><Icon name="phone" /><div><h3>Give us a call</h3><a href={`tel:${business.telephone}`}>{business.phone}</a><p>Tell us what is happening and where you are.</p></div></div><div className="contact-block"><Icon name="clock" /><div><h3>Office hours</h3><dl className="hours">{business.hours.map(h => <div key={h.days}><dt>{h.days}</dt><dd>{h.time}</dd></div>)}</dl></div></div><div className="contact-block"><Icon name="pin" /><div><h3>Our home base</h3><p>6 Sierra Vista Pl<br />Lodi, CA 95240</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=6+Sierra+Vista+Pl+Lodi+CA+95240" target="_blank" rel="noopener noreferrer">Open in Google Maps<Icon name="diagonal" size={16} /></a><small>Call before visiting to confirm someone is available.</small></div></div></div><div className="contact-request"><span className="request-label">PREFER TO SEND A NOTE?</span><h3>Start a service request.</h3><p>Send the details online. Our team will contact you during business hours to discuss the job and arrange an appointment.</p><Button>Request service online</Button><div className="contact-request-image"><Photo name="truck" alt="Phil and Paul's red plumbing truck" sizes="(max-width: 760px) calc(100vw - 98px), (max-width: 1390px) 37vw, 513px" /></div></div></div></section><Faqs items={[commonFaqs[0], commonFaqs[3]]} /></>; }

const referralSources = ['Google', 'Yelp', 'Facebook or Instagram', 'Nextdoor', 'Friend or neighbor', 'Existing customer', 'Saw a truck', 'Other'];

export function BookingPage() {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const toggleService = name => setSelectedServices(list => list.includes(name) ? list.filter(n => n !== name) : [...list, name]);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (state === 'sending' || !form.reportValidity()) return;
    setState('sending'); setMessage('');
    try {
      const response = await fetch('/api/book-service', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'Your request could not be sent. Please call (209) 366-2319.');
      setState('success');
    } catch (error) { setState('error'); setMessage(error.message); }
  }
  return <section className="booking-section"><div className="container"><Breadcrumbs current="Request service" /><div className="booking-layout"><div className="booking-intro"><Eyebrow>LET’S GET STARTED</Eyebrow><h1>What can we<br />help you with?</h1><p>A few details are enough to get the conversation started. Our team will contact you during business hours to discuss the job and arrange a time.</p><div className="urgent-call"><Phone3D size={38} /><div><strong>Need help sooner?</strong><a href={`tel:${business.telephone}`}>Call {business.phone}</a><span>Call to confirm availability.</span></div></div><Photo name="team" alt="The local Phil and Paul's Plumbing crew" sizes="(max-width: 1340px) 40vw, 533px" /><div className="booking-trust"><Icon name="shield" size={19} />Licensed &amp; insured <span>·</span> Serving since 1996</div></div><div className="booking-form-panel"><div className="form-heading"><span>YOUR SERVICE REQUEST</span><small>Fields marked * are required</small></div>{state === 'success' ? <div className="form-success" role="status" aria-live="polite"><Icon name="check" size={40} /><h2>We have your request.</h2><p>Our team will contact you during business hours. Your appointment is confirmed once you speak with us.</p><a className="text-link" href={`tel:${business.telephone}`}>Need to add something? {business.phone}</a></div> : <form action={asset("/api/book-service")} method="post" onSubmit={submit} data-service-request>
      <div className="form-field"><label htmlFor="request-name">Your name *</label><input id="request-name" name="Name" autoComplete="name" required maxLength={120} placeholder="First and last name" /></div><div className="form-row"><div className="form-field"><label htmlFor="request-phone">Phone number *</label><input id="request-phone" name="Phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="(209) 555-0123" /></div><div className="form-field"><label htmlFor="request-city">City or ZIP code *</label><input id="request-city" name="City" autoComplete="address-level2" required maxLength={120} placeholder="Where is the job?" /></div></div><div className="form-field"><label htmlFor="request-address">Street address <span>(optional)</span></label><input id="request-address" name="Address" autoComplete="street-address" maxLength={200} placeholder="Helps us plan the visit" /></div>
      <fieldset className="service-picker"><legend>What needs attention? * <span>(select all that apply)</span></legend><input type="hidden" name="Service-Needed" value={selectedServices.join(', ')} /><div>{[...services.slice(0, 6).map(s => ({ key: s.slug, name: s.name, icon: <Icon3D name={s.icon} size={26} /> })), { key: 'other', name: 'Other / not sure', label: 'Something else / not sure', icon: <Icon name="plus" size={21} /> }].map(o => <label className={selectedServices.includes(o.name) ? 'selected' : ''} key={o.key}><input type="checkbox" value={o.name} required={selectedServices.length === 0} checked={selectedServices.includes(o.name)} onChange={() => toggleService(o.name)} />{o.icon}<span>{o.label || o.name}</span><span className="radio-mark" /></label>)}</div></fieldset>
      <div className="form-field"><label htmlFor="request-email">Email <span>(optional)</span></label><input id="request-email" type="email" name="Email" autoComplete="email" maxLength={256} placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="request-details">Anything else we should know? <span>(optional)</span></label><textarea id="request-details" name="Details" rows={3} maxLength={2000} placeholder="A short description of the problem helps." /></div><div className="form-field"><label htmlFor="request-source">How did you hear about us? <span>(optional)</span></label><select id="request-source" name="Heard-About" defaultValue=""><option value="">Choose one</option>{referralSources.map(s => <option key={s}>{s}</option>)}</select></div><div className="form-honeypot" aria-hidden="true"><label htmlFor="company-url">Leave this empty</label><input id="company-url" name="Website" tabIndex={-1} autoComplete="off" /></div><label className="consent-label"><input type="checkbox" name="Opt-In" required /><span>I agree to the <Link href={business.terms} target="_blank">Terms and Conditions</Link> and <Link href={business.privacy} target="_blank">Privacy Policy</Link>, and I agree to be contacted by phone, text, or email about this service request. Msg &amp; data rates may apply. Reply STOP to opt out. *</span></label>{state === 'error' && <div className="form-error" role="alert"><strong>Your request has not been sent.</strong><p>{message}</p></div>}<button className="button button-primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending your request…' : 'Send service request'}<Icon name="arrow" size={19} /></button><p className="form-note"><Icon name="shield" size={14} />This is a request, not a confirmed appointment.</p>
    </form>}</div></div></div></section>;
}

export function ReviewsPage() { return <><section className="reviews-intro section"><div className="container"><Breadcrumbs current="Customer reviews" /><Eyebrow>THE WORD AROUND TOWN</Eyebrow><h1>Our work.<br /><span>Their words.</span></h1><p>Choosing a plumber is easier when you can hear from people who have called before. Read customer experiences on Google and Yelp.</p><Awards /><div className="button-group"><Button href={business.google} icon="diagonal" target="_blank" rel="noopener noreferrer">Read Google reviews</Button><Button href={business.yelp} variant="outline" icon="diagonal" target="_blank" rel="noopener noreferrer">Read Yelp reviews</Button></div></div></section><Reviews full /><section className="section share-review"><div className="container detail-layout"><div><Eyebrow>BEEN A CUSTOMER?</Eyebrow><h2>Tell us how<br />we did.</h2></div><div><p className="large-copy">Your feedback helps our team and gives the next customer a better idea of what to expect.</p><p>Share an honest review on the platform you use. Have a question about a recent job? Call us so we can talk it through.</p><div className="button-group"><Button href={business.google} icon="diagonal" target="_blank" rel="noopener noreferrer">Share on Google</Button><Button href={business.yelp} variant="outline" icon="diagonal" target="_blank" rel="noopener noreferrer">Share on Yelp</Button></div></div></div></section><Cta /></>; }
export function FaqsPage() { return <><PageHero eyebrow="FAQS" title={<>Straight answers.<br />No runaround.</>} image="jeff" alt="Jeff in a Phil and Paul's service truck"><p>The questions we hear most often. If yours is not here, call us and a real person will help.</p></PageHero><Faqs /></>; }

const sitemapGroups = [
  ['Main pages', p => ['home', 'services', 'about', 'areas', 'contact', 'booking', 'reviews', 'faqs'].includes(p.type)],
  ['Services', p => p.type === 'service'],
  ['Service areas', p => p.type === 'city'],
  ['Policies', p => p.type === 'legal'],
];
export function SitemapPage() {
  return <><section className="legal-intro"><div className="container"><Breadcrumbs current="Sitemap" /><Eyebrow>PHIL &amp; PAUL’S PLUMBING</Eyebrow><h1>Sitemap</h1><p>Every page on our website, in one place.</p></div></section><section className="legal-section"><div className="container"><div className="sitemap-groups">{sitemapGroups.map(([title, test]) => <div key={title}><h2>{title}</h2><ul>{sitemapPages.filter(p => p.type !== 'sitemap' && test(p)).map(p => <li key={p.route}><Link href={p.route}>{p.name}</Link></li>)}</ul></div>)}</div></div></section></>;
}

// Preview-only pages; see content/drafts.mjs. Delete this component with the draft entries when no longer needed.
export function DraftPage({ page }) {
  const d = drafts[page.route];
  return <><div className="draft-banner" role="note"><strong>Draft:</strong> preview only. This page is hidden from search engines and is not listed in the sitemap.</div><PageHero eyebrow={d.eyebrow} breadcrumb={page.name} title={<>{d.title[0]}<br /><span>{d.title[1]}</span></>} image="team" alt="The Phil and Paul's team"><p>{d.intro}</p></PageHero><section className="section"><div className="container draft-layout"><div>{d.offers && <div className="coupon-grid">{d.offers.map(([value, name, terms, code]) => <div key={name} className="coupon"><span className="coupon-sample">SAMPLE</span><strong>{value}</strong><h3>{name}</h3><p>{terms}</p><code>{code}</code></div>)}</div>}{d.sections.map(([h, paras]) => <div key={h} className="draft-section"><h2>{h}</h2>{paras.map(t => <p key={t}>{t}</p>)}</div>)}</div><dl className="draft-facts">{d.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div></section></>;
}

export function LegalPage({ doc }) {
  const name = doc.title.charAt(0) + doc.title.slice(1).toLowerCase().replace(/\band\b/, '&');
  return <><section className="legal-intro"><div className="container"><Breadcrumbs current={name} /><Eyebrow>PHIL &amp; PAUL’S PLUMBING</Eyebrow><h1>{name}</h1><p>Last updated {doc.updated}</p></div></section><section className="legal-section"><div className="container"><article className="legal-body" dangerouslySetInnerHTML={{ __html: doc.html.replace(/href="\//g, `href="${asset('/')}`) }} /></div></section></>;
}
