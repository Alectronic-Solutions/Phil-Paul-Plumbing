import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { asset } from '../lib/asset.mjs';
import { useRouter } from 'next/router';
import { business, services, cities } from '../content/business.mjs';
import { Icon } from './Icon';

export function Brand({ footer = false }) {
  return <Link href="/" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Phil and Paul's Plumbing home"><span>PHIL &amp; PAUL’S<span className="brand-period">.</span></span><small>PLUMBING INC. <span aria-hidden="true">/</span> LODI, CALIFORNIA</small></Link>;
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

export function Header() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const header = useRef(null);
  const triggers = useRef({});
  const mobileTrigger = useRef(null);
  const router = useRouter();

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

  function trigger(id, label) {
    return <button ref={el => { triggers.current[id] = el; }} className={`nav-trigger ${panel === id ? 'active' : ''}`} aria-expanded={panel === id} aria-controls={`nav-${id}`} onClick={() => setPanel(panel === id ? null : id)} onKeyDown={event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); setPanel(id); requestAnimationFrame(() => document.querySelector(`#nav-${id} a`)?.focus()); }
    }}>{label}<Icon name="chevron" size={15} /></button>;
  }

  return <>
    <div className="utility"><div className="container utility-inner"><span><span className="utility-dot" />Serving our neighbors since 1996</span><span className="utility-right">Mon–Fri 7am–7pm <span>/</span> Sat 8am–4pm</span></div></div>
    {(panel || open) && <div className="nav-backdrop" aria-hidden="true" />}
    <header className={`site-header premium-header ${open ? 'mobile-nav-open' : ''}`} ref={header}>
      <div className="container header-inner">
        <Brand />
        <button ref={mobileTrigger} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => { setOpen(!open); setPanel(null); }}><span>{open ? 'Close' : 'Menu'}</span><Icon name={open ? 'close' : 'menu'} size={22} /></button>
        <nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <div className="nav-item">
            {trigger('services', 'Services')}
            <div id="nav-services" className="nav-dropdown services-dropdown" hidden={panel !== 'services'}>
              <div className="dropdown-main">
                <div className="dropdown-heading"><span>WHAT CAN WE HELP WITH?</span><Link href="/service">All services<Icon name="arrow" size={16} /></Link></div>
                <div className="dropdown-services">{services.map(service => <Link href={`/service/${service.slug}`} key={service.slug}><span className="dropdown-icon"><Icon name={service.icon} size={23} /></span><span><strong>{service.name}</strong><small>{descriptions[service.slug]}</small></span><Icon className="dropdown-link-arrow" name="diagonal" size={15} /></Link>)}</div>
              </div>
              <aside className="dropdown-feature"><img src={asset("/images/truck-960.webp")} alt="Phil and Paul's red plumbing service truck" width="640" height="360" loading="lazy" /><span>LOCAL HELP. ONE CALL AWAY.</span><h2>Not sure where<br />to start?</h2><a href={`tel:${business.telephone}`}><Icon name="phone" size={17} />{business.phone}</a><small>Tell us what is happening.<br />We will help with the next step.</small></aside>
            </div>
          </div>
          <div className="nav-item">
            {trigger('areas', 'Service areas')}
            <div id="nav-areas" className="nav-dropdown areas-dropdown" hidden={panel !== 'areas'}>
              <div className="dropdown-main"><div className="dropdown-heading"><span>BASED IN LODI. WORKING NEARBY.</span><Link href="/service-areas">Our coverage<Icon name="arrow" size={16} /></Link></div><div className="dropdown-cities"><Link href="/"><Icon name="pin" size={21} /><span><strong>Lodi</strong><small>Our home base since 1996</small></span><Icon name="diagonal" size={16} /></Link>{cities.map(city => <Link key={city.slug} href={`/plumber/${city.slug}`}><Icon name="pin" size={21} /><span><strong>{city.name}</strong><small>Homes &amp; businesses</small></span><Icon name="diagonal" size={16} /></Link>)}</div><p className="dropdown-area-note">Also serving Clements and nearby communities. Call to confirm coverage at your address.</p></div>
              <aside className="dropdown-area-feature"><Icon name="pin" size={32} /><span>OUR HOME BASE</span><h2>Lodi,<br />California.</h2><p>6 Sierra Vista Pl<br />Lodi, CA 95240</p><Link href="/contact">Contact &amp; office hours<Icon name="arrow" size={17} /></Link></aside>
            </div>
          </div>
          <div className="nav-item company-nav-item">
            {trigger('company', 'Our company')}
            <div id="nav-company" className="nav-dropdown company-dropdown" hidden={panel !== 'company'}><div className="dropdown-heading"><span>MEET YOUR LOCAL TEAM</span></div><Link href="/about"><span><strong>Our story</strong><small>Working in the community since 1996</small></span><Icon name="diagonal" size={17} /></Link><Link href="/leave-a-review"><span><strong>Customer reviews</strong><small>Hear from people who have called us</small></span><Icon name="diagonal" size={17} /></Link><Link href="/contact"><span><strong>Contact &amp; hours</strong><small>A real person and a clear next step</small></span><Icon name="diagonal" size={17} /></Link></div>
          </div>
          <a className="header-phone" href={`tel:${business.telephone}`}><Icon name="phone" size={19} />{business.phone}</a>
          <Link href="/book-plumbing-services" className="button button-primary header-request">Request service<Icon name="diagonal" size={19} /></Link>
        </nav>
      </div>
    </header>
  </>;
}
