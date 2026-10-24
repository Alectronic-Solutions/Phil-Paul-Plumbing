// Company details and the small shared content every page uses: contact details, hours, reviews, and the short FAQ lists.
// This file ships to the browser, so keep long page copy in content/business.mjs, which only build-time code loads.
export const business = {
  name: "Phil & Paul's Plumbing",
  legalName: "Phil & Paul's Plumbing, Inc.",
  // Production origin for canonical URLs, the sitemap, and structured data. Paths never end in a slash.
  url: 'https://www.philpaulplumbing.com',
  email: 'info@philpaulplumbing.com',
  phone: '(209) 366-2319',
  telephone: '+12093662319',
  address: '6 Sierra Vista Pl, Lodi, CA 95240',
  license: 'C-36 #900888',
  google: 'https://g.page/phil-paul-s-plumbing-inc-lodi?share',
  yelp: 'https://www.yelp.com/biz/phil-and-pauls-plumbing-lodi-4',
  facebook: 'https://www.facebook.com/PhilPaulsPlumbing',
  instagram: 'https://www.instagram.com/phil_and_pauls_plumbing/',
  nextdoor: 'https://nextdoor.com/page/phil-pauls-plumbing-acampo-ca/',
  bbb: 'https://www.bbb.org/us/ca/acampo/profile/plumber/phil-pauls-plumbing-inc-1156-90004008',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  cookies: '/cookie-policy',
  accessibility: '/accessibility',
  // Update with the date checked whenever the Google rating changes.
  rating: { value: '4.8', count: 119, asOf: 'October 2026' },
  priceRange: '$$',
  geo: { latitude: 38.12199914888224, longitude: -121.27358612511436 },
  // The single source for office hours: header, footer, contact page, CTA, FAQ, and JSON-LD all read from here.
  hours: [
    { days: 'Monday–Friday', short: 'Mon–Fri', time: '7am–7pm', opens: '07:00', closes: '19:00', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { days: 'Saturday', short: 'Sat', time: '8am–4pm', opens: '08:00', closes: '16:00', dayOfWeek: ['Saturday'] },
    { days: 'Sunday', short: 'Sun', time: 'Closed' },
  ],
};

export const openHours = business.hours.filter(h => h.opens);
export const hoursSummary = openHours.map(h => `${h.short} ${h.time}`);

// Smaller jobs listed on the live site's services page that do not have their own page.
export const otherServices = ['Hot water recirculation pumps', 'Sump pumps', 'Bathroom remodel plumbing', 'Tub and shower valves', 'Sinks and faucets', 'Sprinkler and irrigation lines'];

export const reviews = [
  {
    "name": "Austin B.",
    "text": "No attempted upsell or pressure for anything other than what I needed",
    "service": "Drain cleaning",
    "profile": "https://www.google.com/maps/contrib/112152773033746268240/reviews?hl=en"
  },
  {
    "name": "Claudia T.",
    "text": "I would recommend this company to everyone. Mike deserves a raise and a promotion.",
    "service": "Drain & sewer service",
    "profile": "https://www.google.com/maps/contrib/114032964195880371423/reviews?hl=en"
  },
  {
    "name": "Karen M.",
    "text": "Aaron came out to service my kitchen drain. He was very polite and professional!",
    "service": "Kitchen drain service",
    "profile": "https://www.google.com/maps/contrib/112144790618698516369/reviews?hl=en"
  },
  {
    "name": "Kelly S.",
    "text": "He gets us back in service in a timely manner and for a fair price. Thanks to Paul & Phil’s for always coming through!",
    "service": "Plumbing service",
    "profile": "https://www.google.com/maps/contrib/116584263391353546627/reviews?hl=en"
  },
  {
    "name": "Monty M.",
    "text": "Excellent service! Great explanations, prompt, and cost efficient.",
    "service": "Commercial customer",
    "profile": "https://www.google.com/maps/contrib/112314188013151123869/reviews?hl=en"
  },
  {
    "name": "Sharon G.",
    "text": "The cost was very fair and the service was excellent! We will be using Phil & Paul’s service from now on!!",
    "service": "Sewer repair",
    "profile": business.google
  },
  {
    "name": "Elizabeth H.",
    "text": "Same day service. Got here super fast for a clogged urinal at my work. Had it cleared in no time.",
    "service": "Commercial plumbing",
    "profile": business.google
  },
  {
    "name": "Joe W.",
    "text": "Fantastic service! Quick response! This was literally “same day service”!",
    "service": "Plumbing leak repair",
    "profile": business.google
  },
  {
    "name": "Justin H.",
    "text": "Great local plumbing company! Honest prices and quality work.",
    "service": "Plumbing service",
    "profile": business.google
  },
  {
    "name": "Jacob W.",
    "text": "I have tried other plumbers and never got the quality service we always receive from Phil & Pauls.",
    "service": "Home & commercial",
    "profile": business.google
  }
];

// The scrolling carousel shows two rows; each row gets its own five reviews so nothing repeats between them.
export const reviewRows = [reviews.slice(0, 5), reviews.slice(5, 10)];

export const commonFaqs = [
  ['Where do you work?', 'We are based in Lodi and serve Stockton, Galt, and surrounding communities, including Acampo, Woodbridge, Lockeford, and Clements. Call if you are unsure whether your address is in our service area.'],
  ['How quickly can someone come out?', 'We prioritize urgent calls. Call (209) 366-2319, tell us what is happening, and our team will confirm availability. Online requests are reviewed during business hours.'],
  ['Are you licensed and insured?', 'Yes. Phil & Paul\'s Plumbing is licensed and insured. Our California C-36 plumbing contractor license number is 900888.'],
  ['Do you stand behind your work?', 'We offer a one-year labor warranty on most repairs and installations. Ask about the coverage that applies to your job. Equipment manufacturer warranties are separate.'],
  ['What are your hours?', `${business.hours.map(h => h.opens ? `${h.days}, ${h.time}.` : `Closed ${h.days}.`).join(' ')} Call to confirm appointment availability.`],
];

// /contact. Answers only restate facts already published elsewhere on the site. [icon, title, text] for the "things that help" list.
export const contactReady = [
  ['pin', 'The address', 'Where the work is, and the city or ZIP code. It tells us right away whether we cover it.'],
  ['drop', 'What is happening', 'Where the water, smell, or noise shows up, and when it started.'],
  ['wrench', 'What you have tried', 'A shut-off valve closed or a plunger used. It saves us a step.'],
  ['shield', 'Who to talk to', 'For rentals, the tenant contact and access details. For paperwork, who it should be addressed to.'],
];
export const contactFaqs = [
  ['What is the fastest way to reach Phil & Paul’s?', `Call ${business.phone}. A local office team answers during business hours. Messages sent through this page are reviewed during business hours too, so call first when something is urgent.`],
  ['What should I do about a plumbing emergency after hours?', `Close the main water shut-off valve if water is running, then call us when the office opens. If you smell gas, leave the building, call 911 or PG&E at 1-800-743-5000 from a safe distance, and call us afterward for repairs.`],
  ['What happens after I send a message?', 'Our team contacts you during business hours to talk through the problem, explain the options, and arrange a visit. A message is a request, not a confirmed appointment. Your appointment is confirmed once you speak with us.'],
  ['Can I stop by the office?', 'Our home base is 6 Sierra Vista Pl in Lodi, CA 95240. Please call before visiting to confirm someone is available.'],
  ['Do you work outside Lodi?', 'Yes. We serve Stockton, Galt, Acampo, Woodbridge, Lockeford, and Clements. Call or send your address and we will confirm that we cover it.'],
  ['Can you send a certificate of insurance?', 'Yes. We are insured and can send a certificate before the job. Tell the office who it should be addressed to.'],
  ['Are you licensed?', `Yes. Our California C-36 plumbing contractor license number is ${business.license.split('#')[1]}.`],
];

// FAQs for /service-areas. Answers only restate facts already published elsewhere on the site.
export const areaFaqs = [
  ['Which communities do you serve?', 'We are based in Lodi and serve Stockton, Galt, Acampo, Woodbridge, Lockeford, and Clements, plus the areas in between. Each community has its own page with neighborhoods and ZIP codes we cover.'],
  ['How do I know if you cover my address?', 'Call (209) 366-2319 and give us the street address. Our team will confirm whether we can come out and when. You can also send a service request online and we will follow up during business hours.'],
  ['Do you work on homes and businesses in every community?', 'Yes. We handle residential and commercial plumbing across our service area, from water heaters and drains to sewer lines and gas lines.'],
  ['Is there a charge to come to Stockton or Galt?', 'Call us with the address and a description of the problem. We will explain the cost and what to expect before we schedule the visit.'],
  ['How quickly can you get to my community?', 'We prioritize urgent calls. Call (209) 366-2319, tell us what is happening and where you are, and we will confirm when someone can be there.'],
];
