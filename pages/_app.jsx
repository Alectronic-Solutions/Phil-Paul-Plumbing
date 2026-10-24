import '../styles/site.css';
import '../styles/premium.css';
import '../styles/polish.css';
import '../styles/landing.css';
import '../styles/motion.css';
import '../styles/finish.css';
import '../styles/tablet.css';
import { Motion } from '../components/Motion';
import { Parallax } from '../components/Parallax';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { business } from '../content/company.mjs';
import { CatalogContext } from '../lib/catalog.mjs';

const pageFallback = <main style={{ padding: '96px 24px', textAlign: 'center' }}><h1>Something went wrong.</h1><p>Please reload the page, or call us at <a href={`tel:${business.telephone}`}>{business.phone}</a>.</p></main>;

export default function App({ Component, pageProps }) {
  return <><ErrorBoundary><Parallax /></ErrorBoundary><ErrorBoundary fallback={pageFallback}><CatalogContext.Provider value={pageProps.catalog}><Component {...pageProps} /></CatalogContext.Provider></ErrorBoundary><ErrorBoundary><Motion /></ErrorBoundary></>;
}
