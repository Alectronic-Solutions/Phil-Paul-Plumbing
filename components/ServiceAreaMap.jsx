import Link from 'next/link';
import { business } from '../content/company.mjs';
import { Icon, Icon3D } from './Icon';

// Station coordinates share the 600 x 420 viewBox of the route drawing below, so each station is placed in percent.
export const mapStations = [
  { name: 'Galt', slug: 'galt-plumbing-services', x: 230, y: 50, pos: 'r' },
  { name: 'Acampo', slug: 'acampo-plumbing-services', x: 300, y: 170, pos: 'l' },
  { name: 'Woodbridge', slug: 'woodbridge-plumbing-services', x: 110, y: 205, pos: 'b' },
  { name: 'Lockeford', slug: 'lockeford-plumbing-services', x: 480, y: 195, pos: 'b' },
  { name: 'Stockton', slug: 'stockton-plumbers', x: 335, y: 372, pos: 'r' },
];
const stationStyle = (s) => ({ left: `${(s.x / 600) * 100}%`, top: `${(s.y / 420) * 100}%` });

// variant="full" is the linked map with the call-us footer. variant="compact" is the decorative copy used inside the
// header menu: stations are plain text (the town list beside it is the real navigation) and activeSlug highlights one.
export function ServiceAreaMap({ variant = 'full', activeSlug = null }) {
  const compact = variant === 'compact';
  return <div className={`area-visual ${compact ? 'area-visual--compact' : ''}`} aria-hidden={compact ? 'true' : undefined}>
    <span className="map-overview-label">SERVICE AREA OVERVIEW</span>
    <div className="map-stage">
      <svg className="map-routes" viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <ellipse className="map-reach" cx="300" cy="235" rx="262" ry="178" />
        <path className="map-river" d="M-10 118C70 92 140 138 230 112S380 84 470 112 590 104 610 96" />
        <path className="map-road map-road-12" d="M110 205H205L235 235H400L440 195H520L555 160" />
        <path className="map-road map-road-99" d="M230 50V100L300 170V285L335 320V372" />
        <g className="map-shield"><rect x="283" y="196" width="34" height="20" rx="6" /><text x="300" y="210.5">99</text></g>
        <g className="map-shield"><rect x="147" y="195" width="34" height="20" rx="6" /><text x="164" y="209.5">12</text></g>
      </svg>
      {mapStations.map(s => {
        const className = `map-station pos-${s.pos} ${activeSlug === s.slug ? 'is-active' : ''}`;
        return compact
          ? <span key={s.slug} className={className} style={stationStyle(s)}><i /><span>{s.name}</span></span>
          : <Link key={s.slug} href={`/plumber/${s.slug}`} className={className} style={stationStyle(s)}><i /><span>{s.name}</span></Link>;
      })}
      <span className="map-station map-clements pos-tl" style={stationStyle({ x: 555, y: 160 })}><i /><span>Clements</span></span>
      <span className={`map-lodi ${activeSlug === 'lodi' ? 'is-active' : ''}`} style={stationStyle({ x: 300, y: 235 })}><span className="map-pin"><Icon name="pin" size={22} /></span><span className="map-lodi-label"><strong>LODI</strong><small>HOME BASE</small></span></span>
    </div>
    {!compact && <a className="map-note" href={`tel:${business.telephone}`}><Icon3D name="phone" size={26} /><span>Not sure? Call <b>{business.phone}</b> <span className="map-note-rest">and we will confirm your address.</span></span><Icon name="arrow" size={16} /></a>}
  </div>;
}
