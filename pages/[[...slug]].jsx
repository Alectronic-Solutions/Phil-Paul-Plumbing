import Head from 'next/head';
import { pages, services, cities, business, openHours } from '../content/business.mjs';
import { Layout, HomePage, ServicesPage, ServicePage, AboutPage, AreasPage, CityPage, ContactPage, BookingPage, ReviewsPage, LegalPage } from '../components/Site';

const site = business.url;
const areaServed = ['Lodi', 'Stockton', 'Galt', 'Acampo', 'Woodbridge', 'Lockeford', 'Clements'].map(name => ({ '@type': 'City', name: `${name}, CA` }));
const parents = { service: { route: '/service', name: 'Services' }, city: { route: '/service-areas', name: 'Service area' } };

export default function SitePage({ page, legal }) {
  const canonical = site + page.route;
  const service = page.type === 'service' && services.find(s => s.slug === page.service);
  const city = page.type === 'city' && cities.find(c => c.slug === page.city);
  const trail = page.route === '/' ? [] : [{ route: '/', name: 'Home' }, ...(parents[page.type] ? [parents[page.type]] : []), page];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Plumber', '@id': `${site}/#business`, name: business.name, legalName: business.legalName, url: `${site}/`, telephone: business.telephone, email: business.email, foundingDate: '1996', logo: `${site}/images/favicon.png`, image: `${site}/images/og-image.jpg`, hasMap: business.google, address: { '@type': 'PostalAddress', streetAddress: '6 Sierra Vista Pl', addressLocality: 'Lodi', addressRegion: 'CA', postalCode: '95240', addressCountry: 'US' }, areaServed, openingHoursSpecification: openHours.map(h => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.dayOfWeek, opens: h.opens, closes: h.closes })), hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'license', name: `California contractor license ${business.license}` }, sameAs: [business.google, business.yelp, business.bbb, business.facebook, business.instagram] },
      { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: business.name, publisher: { '@id': `${site}/#business` }, inLanguage: 'en-US' },
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#business` }, inLanguage: 'en-US', ...(trail.length ? { breadcrumb: { '@id': `${canonical}#breadcrumb` } } : {}) },
      ...(trail.length ? [{ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: trail.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: site + item.route })) }] : []),
      ...(service ? [{ '@type': 'Service', '@id': `${canonical}#service`, name: service.title.replace(/ in Lodi, CA$/, ''), serviceType: service.name, description: service.description, provider: { '@id': `${site}/#business` }, url: canonical, areaServed }] : []),
      ...(city ? [{ '@type': 'Service', '@id': `${canonical}#service`, name: `Plumbing service in ${city.name}, CA`, serviceType: 'Plumbing', provider: { '@id': `${site}/#business` }, url: canonical, areaServed: { '@type': 'City', name: `${city.name}, CA` } }] : []),
    ],
  };
  return <>
    <Head>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" /><meta property="og:site_name" content={business.name} /><meta property="og:locale" content="en_US" /><meta property="og:title" content={page.title} /><meta property="og:description" content={page.description} /><meta property="og:url" content={canonical} /><meta property="og:image" content={`${site}/images/og-image.jpg`} /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="The Phil & Paul's Plumbing crew in front of their red service van in Lodi" /><meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </Head>
    <Layout>
      {page.type === 'home' && <HomePage />}
      {page.type === 'services' && <ServicesPage />}
      {page.type === 'service' && <ServicePage service={service} />}
      {page.type === 'about' && <AboutPage />}
      {page.type === 'areas' && <AreasPage />}
      {page.type === 'city' && <CityPage city={city} />}
      {page.type === 'contact' && <ContactPage />}
      {page.type === 'booking' && <BookingPage />}
      {page.type === 'reviews' && <ReviewsPage />}
      {page.type === 'legal' && <LegalPage doc={legal} />}
    </Layout>
  </>;
}

export function getStaticPaths() {
  return { paths: pages.map((page) => ({ params: { slug: page.route === '/' ? [] : page.route.slice(1).split('/') } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const route = '/' + (params.slug || []).join('/');
  const page = pages.find((item) => item.route === route);
  if (!page) return { notFound: true };
  // Loaded here so the policy text only ships in the legal pages' HTML, not the shared client bundle.
  if (page.type === 'legal') return { props: { page, legal: (await import('../content/legal.mjs')).legal[page.legal] } };
  return { props: { page } };
}
