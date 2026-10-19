import Head from 'next/head';
import { pages, services, cities, business } from '../content/business.mjs';
import { Layout, HomePage, ServicesPage, ServicePage, AboutPage, AreasPage, CityPage, ContactPage, BookingPage, ReviewsPage } from '../components/Site';

export default function SitePage({ page }) {
  const canonical = `https://www.philpaulplumbing.com${page.route === '/' ? '/' : page.route}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Plumber', '@id': 'https://www.philpaulplumbing.com/#business', name: "Phil & Paul's Plumbing, Inc.", url: 'https://www.philpaulplumbing.com/', telephone: business.telephone, foundingDate: '1996', image: 'https://www.philpaulplumbing.com/images/team-1440.webp', address: { '@type': 'PostalAddress', streetAddress: '6 Sierra Vista Pl', addressLocality: 'Lodi', addressRegion: 'CA', postalCode: '95240', addressCountry: 'US' }, areaServed: ['Lodi', 'Stockton', 'Galt', 'Acampo', 'Woodbridge', 'Lockeford', 'Clements'].map(name => ({ '@type': 'City', name })), openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '19:00' }, { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '16:00' }], sameAs: [business.google, business.yelp, business.bbb, 'https://www.facebook.com/PhilPaulsPlumbing'] },
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, about: { '@id': 'https://www.philpaulplumbing.com/#business' } },
      ...(page.type === 'service' ? [{ '@type': 'Service', name: services.find(s => s.slug === page.service).name, provider: { '@id': 'https://www.philpaulplumbing.com/#business' }, url: canonical, areaServed: ['Lodi', 'Stockton', 'Galt'] }] : []),
    ],
  };
  return <>
    <Head>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" /><meta property="og:title" content={page.title} /><meta property="og:description" content={page.description} /><meta property="og:url" content={canonical} /><meta property="og:image" content="https://www.philpaulplumbing.com/images/team-1440.webp" /><meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </Head>
    <Layout>
      {page.type === 'home' && <HomePage />}
      {page.type === 'services' && <ServicesPage />}
      {page.type === 'service' && <ServicePage service={services.find(s => s.slug === page.service)} />}
      {page.type === 'about' && <AboutPage />}
      {page.type === 'areas' && <AreasPage />}
      {page.type === 'city' && <CityPage city={cities.find(c => c.slug === page.city)} />}
      {page.type === 'contact' && <ContactPage />}
      {page.type === 'booking' && <BookingPage />}
      {page.type === 'reviews' && <ReviewsPage />}
    </Layout>
  </>;
}

export function getStaticPaths() {
  return { paths: pages.map((page) => ({ params: { slug: page.route === '/' ? [] : page.route.slice(1).split('/') } })), fallback: false };
}

export function getStaticProps({ params }) {
  const route = '/' + (params.slug || []).join('/');
  const page = pages.find((item) => item.route === route);
  if (!page) return { notFound: true };
  return { props: { page } };
}
