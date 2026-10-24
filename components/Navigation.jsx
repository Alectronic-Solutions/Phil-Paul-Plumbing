import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { asset } from '../lib/asset.mjs';
import { useRouter } from 'next/router';
import { business, services, cities, hoursSummary } from '../content/business.mjs';
import { Icon, Icon3D, Phone3D } from './Icon';
import { ServiceAreaMap } from './ServiceAreaMap';

export function Brand({ footer = false }) {
  if (!footer) return <Link href="/" className="brand brand-logo" aria-label="Phil &amp; Paul’s Plumbing Inc. — Lodi, California, home"><img src={asset('/images/logo-truck.webp')} alt="Phil &amp; Paul’s Plumbing" width="211" height="46" /></Link>;
  return <Link href="/" className="brand brand-logo brand-footer" aria-label="Phil &amp; Paul’s Plumbing Inc. — Lodi, California, home"><img src={asset('/images/logo-truck-white.webp')} alt="Phil &amp; Paul’s Plumbing" width="211" height="46" loading="lazy" decoding="async" /></Link>;
}

const descriptions = {
  'water-heaters': 'Repair, replacement & maintenance',
  'drain-cleaning': 'Rooter service & stubborn clogs',
  'plumbing-repair-services': 'Leaks, fixtures & everyday repairs',
  'sewer-repair': 'Diagnosis, repair & replacement',
  'commercial-plumbing': 'Businesses & rental properties',
  'water-softeners': 'Softeners & whole-home filtration',
  'hydro-jetting': 'High-pressure line cleaning',
  'video-inspection': 'A closer look inside the line',
  'gas-lines': 'Gas piping installation & repair',
};

const companyLinks = [
  { href: '/about', icon: 'building', name: 'Our story', note: 'Working in the community since 1996' },
  { href: '/faqs', icon: 'help', name: 'FAQs', note: 'Quick answers to common questions' },
  { href: '/leave-a-review', icon: 'star', name: 'Customer reviews', note: 'Hear from people who have called us' },
  { href: '/licensing', icon: 'shield', name: 'Licensing', note: 'Licensed & insured in California' },
  { href: '/warranty', icon: 'check', name: 'Warranty', note: 'What our labor warranty covers' },
  { href: '/coupons', icon: 'tag', name: 'Coupons', note: 'Current savings and offers' },
  { href: '/contact', icon: 'phone', name: 'Contact & hours', note: 'A real person and a clear next step' },
  { href: '/book-plumbing-services', icon: 'wrench', name: 'Request service', note: 'Book an appointment online' },
  { href: '/sitemap', icon: 'pin', name: 'Sitemap', note: 'Every page on our website' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [hoverArea, setHoverArea] = useState(null);
  const [street, ...rest] = business.address.split(', ');
  const header = useRef(null);
  const triggers = useRef({});
  const mobileTrigger = useRef(null);
  const navEl = useRef(null);
  const [more, setMore] = useState(false);
  const router = useRouter();
  const currentPath = router.asPath.split(/[?#]/)[0].replace(/(.)\/$/, '$1');

  useEffect(() => { setOpen(false); setPanel(null); }, [router.asPath]);
  useEffect(() => {
    function closeOutside(event) {
      if (!header.current?.contains(event.target)) { setPanel(null); setOpen(false); }
    }
    function escape(event) {
      if (event.key !== 'Escape') return;
      if (panel) { triggers.current[panel]?.focus(); setPanel(null); }
      else if (open) { setOpen(false); mobileTrigger.current?.focus(); }
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', escape); };
  }, [panel, open]);
  useEffect(() => {
    const viewport = window.matchMedia('(max-width: 900px)');
    const closeOnResize = () => { setOpen(false); setPanel(null); };
    viewport.addEventListener('change', closeOnResize);
    return () => viewport.removeEventListener('change', closeOnResize);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => { if (panel !== 'areas') setHoverArea(null); }, [panel]);

  // The mobile menu scrolls inside itself, so show a "more below" cue until the reader reaches the bottom.
  useEffect(() => {
    const el = navEl.current;
    if (!open || !el) { setMore(false); return undefined; }
    const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const watch = new ResizeObserver(check);
    watch.observe(el);
    [...el.children].forEach(c => watch.observe(c));
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); watch.disconnect(); };
  }, [open, panel]);

  // Highlights the matching station on the menu map while a town card is hovered or focused.
  const areaHover = slug => ({ onMouseEnter: () => setHoverArea(slug), onFocus: () => setHoverArea(slug), onBlur: () => setHoverArea(null) });

  // Arrow keys, Home and End move between the links of an open panel.
  function panelKeys(event) {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const links = [...event.currentTarget.querySelectorAll('a')];
    const current = links.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : (current + step + links.length) % links.length;
    links[next].focus();
  }

  function trigger(id, label) {
    return <button ref={el => { triggers.current[id] = el; }} className={`nav-trigger ${panel === id ? 'active' : ''}`} aria-expanded={panel === id} aria-controls={`nav-${id}`} onClick={() => setPanel(panel === id ? null : id)} onKeyDown={event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); setPanel(id); requestAnimationFrame(() => document.querySelector(`#nav-${id} a`)?.focus()); }
    }}>{label}<Icon name="chevron" size={15} /></button>;
  }

  return <>
    <div className="utility"><div className="container utility-inner"><span><span className="utility-dot" />Serving our neighbors since 1996</span><span className="utility-right">{hoursSummary.map((h, i) => <Fragment key={h}>{i > 0 && <> <span>/</span> </>}{h}</Fragment>)}</span></div></div>
    {(panel || open) && <div className="nav-backdrop" aria-hidden="true" />}
    <header className={`site-header premium-header ${open ? 'mobile-nav-open' : ''}`} ref={header}>
      <div className="container header-inner">
        <Brand />
        <button ref={mobileTrigger} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => { setOpen(!open); setPanel(null); }}><span>{open ? 'Close' : 'Menu'}</span><Icon name={open ? 'close' : 'menu'} size={22} /></button>
        <nav id="main-navigation" ref={navEl} className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <div className="nav-item">
            {trigger('services', 'Services')}
            <div id="nav-services" className="nav-dropdown services-dropdown" hidden={panel !== 'services'} onKeyDown={panelKeys}>
              <div className="dropdown-main">
                <div className="dropdown-heading"><span>WHAT CAN WE HELP WITH?</span><Link href="/service">All services<Icon name="arrow" size={16} /></Link></div>
                <div className="dropdown-services">{services.map(service => <Link href={`/service/${service.slug}`} key={service.slug}><span className="dropdown-icon"><Icon3D name={service.icon} size={28} /></span><span><strong>{service.name}</strong><small>{descriptions[service.slug]}</small></span><Icon className="dropdown-link-arrow" name="diagonal" size={15} /></Link>)}</div>
              </div>
              <aside className="dropdown-feature"><img src={asset("/images/truck-960.webp")} alt="Phil and Paul's red plumbing service truck" width="640" height="360" loading="lazy" /><span>LOCAL HELP. ONE CALL AWAY.</span><h2>Not sure where<br />to start?</h2><a className="dropdown-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={26} />{business.phone}</a><small>Tell us what is happening.<br />We will help with the next step.</small></aside>
            </div>
          </div>
          <div className="nav-item">
            {trigger('areas', 'Service areas')}
            <div id="nav-areas" className="nav-dropdown areas-dropdown" hidden={panel !== 'areas'} onKeyDown={panelKeys}>
              <div className="dropdown-main">
                <div className="dropdown-heading"><span>BASED IN LODI. WORKING NEARBY.</span><Link href="/service-areas">Our coverage<Icon name="arrow" size={16} /></Link></div>
                <div className="dropdown-cities" onMouseLeave={() => setHoverArea(null)}>
                  <Link href="/" className={currentPath === '/' ? 'area-card-home' : undefined} aria-current={currentPath === '/' ? 'page' : undefined} {...areaHover('lodi')}><span className="dropdown-photo"><img src={asset("/images/truck-480.webp")} alt="" width="48" height="48" loading="lazy" /></span><span><strong>Lodi</strong><small>Our home base since 1996</small></span><Icon name="diagonal" size={16} /></Link>
                  {cities.map(city => <Link key={city.slug} href={`/plumber/${city.slug}`} className={currentPath === `/plumber/${city.slug}` ? 'area-card-home' : undefined} aria-current={currentPath === `/plumber/${city.slug}` ? 'page' : undefined} {...areaHover(city.slug)}><span className="dropdown-photo"><img src={asset(`/images/${city.image}-480.webp`)} alt="" width="48" height="48" loading="lazy" /></span><span><strong>{city.name}</strong><small>Homes &amp; businesses</small></span><Icon name="diagonal" size={16} /></Link>)}
                </div>
                <p className="dropdown-area-note"><span>Also serving Clements and nearby communities.</span><span><a href={`tel:${business.telephone}`}>Call {business.phone}</a> to confirm coverage<span className="note-extra"> at your address</span>.</span></p>
              </div>
              <aside className="dropdown-area-feature">
                <ServiceAreaMap variant="compact" activeSlug={hoverArea} />
                <div className="area-address"><span className="area-address-pin"><Icon name="pin" size={18} /></span><span className="area-address-text"><small>OUR HOME BASE</small><strong>{street}</strong><span>{rest.join(', ')}</span></span><Link href="/contact">Contact &amp; hours<Icon name="arrow" size={15} /></Link></div>
              </aside>
            </div>
          </div>
          <div className="nav-item company-nav-item">
            {trigger('company', 'Our company')}
            <div id="nav-company" className="nav-dropdown company-dropdown" hidden={panel !== 'company'} onKeyDown={panelKeys}>
              <div className="dropdown-main">
                <div className="dropdown-heading"><span>MEET YOUR LOCAL TEAM</span><Link href="/about">Our story<Icon name="arrow" size={16} /></Link></div>
                <div className="dropdown-company">{companyLinks.map(item => <Link key={item.href} href={item.href}><span className="dropdown-pin"><Icon3D name={item.icon} size={30} /></span><span><strong>{item.name}</strong><small>{item.note}</small></span><Icon name="diagonal" size={16} /></Link>)}</div>
              </div>
              <aside className="dropdown-feature"><img src={asset("/images/team-960.webp")} alt="The Phil and Paul's Plumbing team" width="640" height="360" loading="lazy" /><span>LOCAL HELP. ONE CALL AWAY.</span><h2>Questions?<br />Just call.</h2><a className="dropdown-call" href={`tel:${business.telephone}`}><Icon3D name="phone" size={26} />{business.phone}</a><small>A real person will help you<br />with the next step.</small></aside>
            </div>
          </div>
          <a className="header-phone" href={`tel:${business.telephone}`}><Phone3D key={currentPath} size={22} />{business.phone}</a>
          <Link href="/book-plumbing-services" className="button button-primary header-request">Request service<Icon name="diagonal" size={19} /></Link>
        <div className="nav-scroll-cue" data-visible={more ? 'true' : 'false'} aria-hidden="true"><button type="button" tabIndex={-1} onClick={() => navEl.current?.scrollBy({ top: navEl.current.clientHeight * 0.7, behavior: 'smooth' })}>Scroll for more<Icon name="chevron" size={16} /></button></div>
        </nav>
      </div>
    </header>
  </>;
}
