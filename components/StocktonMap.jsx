import { Fragment, useEffect, useRef, useState } from 'react';
import { business } from '../content/business.mjs';
import { Icon } from './Icon';
import { ServiceAreaMap } from './ServiceAreaMap';
import { neighborhoodSpots } from '../content/neighborhood-spots.mjs';
import { stocktonBounds, stocktonPaths, stocktonShields } from '../content/stockton-geo.mjs';
import { galtBounds, galtPaths, galtShields } from '../content/galt-geo.mjs';
import { acampoBounds, acampoPaths, acampoShields } from '../content/acampo-geo.mjs';
import { woodbridgeBounds, woodbridgePaths, woodbridgeShields } from '../content/woodbridge-geo.mjs';
import { lockefordBounds, lockefordPaths, lockefordShields } from '../content/lockeford-geo.mjs';

// Drawing data per city. `layers` are [path key, class] in paint order; `shields` are [key, label]; `lodi` is the badge text and the direction of the Lodi shop (arrow rotation).
const maps = {
  'stockton-plumbers': { b: stocktonBounds, paths: stocktonPaths, shields: stocktonShields, lodi: ['LODI SHOP · 20 MIN', 0],
    layers: [['city', 'map-city'], ['streets', 'map-street'], ['sanJoaquin', 'map-river'], ['calaveras', 'map-river map-river-small'], ['channel', 'map-river map-channel'], ['sr4', 'map-road map-road-4'], ['i5', 'map-road map-road-12'], ['sr99', 'map-road map-road-99']],
    labels: [['i5', '5'], ['sr99', '99'], ['sr4', '4']] },
  'galt-plumbing-services': { b: galtBounds, paths: galtPaths, shields: galtShields, lodi: ['LODI SHOP · SOUTH ON HWY 99', 180],
    layers: [['city', 'map-city'], ['streets', 'map-street'], ['rail', 'map-rail'], ['dryCreek', 'map-river map-river-small'], ['sr104', 'map-road map-road-4'], ['sr99', 'map-road map-road-99']],
    labels: [['sr99', '99'], ['sr104', '104']] },
  'acampo-plumbing-services': { b: acampoBounds, paths: acampoPaths, shields: acampoShields, lodi: ['LODI SHOP · SOUTH ON HWY 99', 180],
    layers: [['city', 'map-city'], ['streets', 'map-street'], ['rail', 'map-rail'], ['mokelumne', 'map-river'], ['sr12', 'map-road map-road-4'], ['sr99', 'map-road map-road-99']],
    labels: [['sr99', '99'], ['sr12', '12']] },
  'woodbridge-plumbing-services': { b: woodbridgeBounds, paths: woodbridgePaths, shields: woodbridgeShields, lodi: ['LODI SHOP · SOUTHEAST', 90],
    layers: [['city', 'map-city'], ['streets', 'map-street'], ['rail', 'map-rail'], ['lake', 'map-river map-river-small'], ['mokelumne', 'map-river'], ['sr12', 'map-road map-road-4'], ['sr99', 'map-road map-road-99']],
    labels: [['sr99', '99'], ['sr12', '12']] },
  'lockeford-plumbing-services': { b: lockefordBounds, paths: lockefordPaths, shields: lockefordShields, lodi: ['LODI SHOP · WEST ON HWY 12', 165],
    layers: [['city', 'map-city'], ['streets', 'map-street'], ['mokelumne', 'map-river'], ['sr12', 'map-road map-road-4'], ['sr88', 'map-road map-road-4']],
    labels: [['sr12', '12'], ['sr88', '88']] },
};

// Latitude and longitude to percent of the map, using the same bounds as the generated OpenStreetMap lines.
const spotStyle = (b, [lat, lon]) => ({ left: `${(lon - b.west) / (b.east - b.west) * 100}%`, top: `${(b.north - lat) / (b.north - b.south) * 100}%` });
const Shield = ({ at: [x, y], label }) => {
  const w = label.length > 1 ? 30 : 22;
  return <g className="map-shield"><rect x={x - w / 2} y={y - 10} width={w} height="20" rx="6" /><text x={x} y={y + 4.5}>{label}</text></g>;
};

export function StocktonMap({ slug, neighborhoods, spots, activeName = null, onHover = () => {}, onSelect = () => {} }) {
  const { b, paths, shields, layers, labels, lodi } = maps[slug];
  return <div className="area-visual area-visual--city">
    <span className="map-to-lodi" aria-hidden="true"><span style={{ display: 'flex', rotate: `${lodi[1]}deg` }}><Icon name="arrow" size={14} /></span>{lodi[0]}</span>
    <div className="map-stage" style={{ aspectRatio: `${b.width} / ${b.height}` }} aria-hidden="true">
      <svg className="map-routes" viewBox={`0 0 ${b.width} ${b.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {layers.map(([key, cls]) => <path key={key} className={cls} d={paths[key]} />)}
        {labels.map(([key, label]) => <Shield key={key} at={shields[key]} label={label} />)}
      </svg>
      {neighborhoods.filter(n => spots[n]).map(n => {
        const s = spots[n];
        return <span key={n} className={`map-station map-hood pos-${s.pos} ${s.hub ? 'is-hub' : ''} ${s.crowded ? 'is-crowded' : ''} ${s.tuck ? 'is-tucked' : ''} ${activeName === n ? 'is-active' : ''}`} style={spotStyle(b, s.at)} onClick={() => onSelect(n)} onMouseEnter={() => onHover(n)} onMouseLeave={() => onHover(null)}><i /><span data-label={n} style={s.nudge && { '--nudge': `${s.nudge[0]}cqw ${s.nudge[1]}cqw` }} /></span>;
      })}
      <small className="map-credit">Map data © OpenStreetMap contributors</small>
    </div>
    <a className="map-note" href={`tel:${business.telephone}`}><Icon name="phone" size={17} /><span>Not sure? Call <b>{business.phone}</b> and we will confirm your address.</span><Icon name="arrow" size={16} /></a>
  </div>;
}

// Neighborhood + ZIP chips and the map, returned as two siblings so they sit in the landing page's two-column grid.
// Hovering a chip highlights its spot on the map and the other way round. Cities without spots keep the regional map.
export function CityCoverage({ slug, neighborhoods, zips, children }) {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);
  const spots = neighborhoodSpots[slug];
  const [auto, setAuto] = useState(null);
  const [visible, setVisible] = useState(true);
  const active = hover || selected || auto;
  // A clicked neighborhood stays highlighted until another is clicked or the section scrolls out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (!e.isIntersecting) setSelected(null); });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // While nothing is hovered or clicked, step through the neighborhoods one at a time.
  const idle = !hover && !selected && visible;
  useEffect(() => {
    if (!spots || !idle) { setAuto(null); return; }
    const names = neighborhoods.filter(n => spots[n]);
    if (!names.length) return;
    let i = 0;
    setAuto(names[0]);
    const id = setInterval(() => { i = (i + 1) % names.length; setAuto(names[i]); }, 2600);
    return () => clearInterval(id);
  }, [spots, idle, neighborhoods]);
  const pick = (n) => setSelected(n);
  return <>
    <div ref={ref}>
      {children}
      <h3 className="landing-sub">Neighborhoods</h3>
      <ul className="chip-list">{neighborhoods.map((n, i) => <Fragment key={n}>{neighborhoods.length === 9 && i > 0 && i % 3 === 0 && <li className="chip-break" role="presentation" />}<li className={active === n ? 'is-active' : ''} style={spots ? { cursor: 'pointer' } : undefined} tabIndex={spots ? 0 : undefined} onClick={spots ? () => pick(n) : undefined} onKeyDown={spots ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n); } } : undefined} onMouseEnter={spots ? () => setHover(n) : undefined} onMouseLeave={spots ? () => setHover(null) : undefined}>{n}</li></Fragment>)}</ul>
      <h3 className="landing-sub">ZIP codes</h3>
      <ul className="chip-list chip-list-zip">{zips.map(z => <li key={z}>{z}</li>)}</ul>
    </div>
    {spots ? <StocktonMap slug={slug} neighborhoods={neighborhoods} spots={spots} activeName={active} onHover={setHover} onSelect={pick} /> : <ServiceAreaMap activeSlug={slug} />}
  </>;
}
