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
  bbb: 'https://www.bbb.org/us/ca/acampo/profile/plumber/phil-pauls-plumbing-inc-1156-90004008',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  cookies: '/cookie-policy',
  accessibility: '/accessibility',
  // Update with the date checked whenever the Google rating changes.
  rating: { value: '4.8', count: 119, asOf: 'October 2026' },
};

export const services = [
  {
    slug: 'water-heaters', title: 'Water Heater Repair & Installation in Lodi, CA', number: '01', icon: 'heater', name: 'Water heaters', short: 'Hot water, without the runaround.', image: 'waterHeater',
    description: 'Repair, replacement, and installation of tank, tankless, and hybrid water heaters.',
    intro: 'A cold shower is a rough start to the day. We find out what is wrong, explain the options, and help you decide whether to repair your water heater or replace it.',
    details: ['Tank water heater repair and replacement', 'Tankless water heater installation', 'Heat pump and hybrid water heaters', 'Flushing and routine maintenance', 'Permit coordination for replacements', 'Removal of the old unit'],
    sections: [
      ['Repair first, when it makes sense.', 'A failed component does not always mean you need a new water heater. We look at the age, condition, and repair cost before recommending the next step.'],
      ['The right system for your household.', 'Tank, tankless, and hybrid systems each have different installation requirements. We talk through hot water use, available space, and the work involved so you can make an informed choice.'],
      ['An installation we stand behind.', 'We handle the plumbing connections and explain how to care for the new system. Ask us about the one-year labor warranty and the manufacturer warranty for your equipment.'],
    ],
    faqs: [['Do I need a repair or a replacement?', 'That depends on the fault, age, and condition of the heater. We inspect the system and explain both options when a repair is practical.'], ['Do you install tankless water heaters?', 'Yes. We install tankless systems and review water demand, gas or electrical requirements, and venting before recommending a unit.'], ['Can you help with water heater maintenance?', 'Yes. We provide flushing and maintenance. The right schedule depends on your equipment, use, and water conditions.']],
  },
  {
    slug: 'drain-cleaning', title: 'Drain Cleaning & Rooter Service in Lodi, CA', number: '02', icon: 'drain', name: 'Drain cleaning', short: 'Get things moving again.', image: 'drain',
    description: 'Kitchen sinks, showers, toilets, and main lines. We get to the cause of the clog.',
    intro: 'A slow drain is inconvenient. A backed-up main line can stop your whole day. We clear the blockage and explain what we find, including whether a closer inspection makes sense.',
    details: ['Kitchen and bathroom drain clearing', 'Toilet and floor drain blockages', 'Main sewer line cleaning', 'Rooter service', 'Root and debris removal', 'Recurring drain problem diagnosis'],
    sections: [['Start with the cause.', 'Grease, roots, debris, and damaged pipe can cause similar symptoms. We choose the cleaning method based on the drain and the problem.'], ['Equipment for the job.', 'Our technicians use professional rooter equipment and can recommend hydro-jetting or a camera inspection when the line needs more attention.'], ['A clearer picture of what comes next.', 'If the blockage points to a damaged line, we explain the findings before recommending additional work.']],
    faqs: [['Can you clear a main sewer line?', 'Yes. We clear main sewer lines as well as individual fixture drains. Call and tell us which fixtures are backing up.'], ['What if the clog keeps coming back?', 'Recurring clogs may need a camera inspection to check for roots, buildup, or damage. We can discuss whether that is the right next step.'], ['Do you offer hydro-jetting?', 'Yes. We assess the line first and recommend hydro-jetting when it is suitable for the pipe and blockage.']],
  },
  {
    slug: 'plumbing-repair-services', title: 'Plumbing Repair in Lodi, CA', number: '03', icon: 'wrench', name: 'Plumbing repairs', short: 'Small leak. Big relief.', image: 'repair',
    description: 'Leaks, toilets, faucets, disposals, and the repairs that keep a home running.',
    intro: 'From a running toilet to a leaking supply line, we handle the everyday plumbing problems that need a capable pair of hands. We explain the repair before we get started.',
    details: ['Leak detection and pipe repair', 'Toilet repair and installation', 'Faucet and fixture replacement', 'Garbage disposal service', 'Water pressure troubleshooting', 'Water and drain pipe replacement'],
    sections: [['Find the problem before fixing it.', 'We inspect the affected plumbing and ask about the symptoms. The goal is a repair that addresses the cause.'], ['Repairs for homes of every age.', 'We work on aging supply and drain lines as well as newer fixtures and equipment. We explain the condition of the plumbing and the options available.'], ['A practical plan for larger work.', 'If a problem calls for replacement rather than a small repair, we talk through the scope and answer your questions before proceeding.']],
    faqs: [['Do you handle small repairs?', 'Yes. Leaking faucets, running toilets, and disposal problems are all part of our work.'], ['Can you replace damaged pipe?', 'Yes. We repair and replace water and drain lines, with the scope based on the condition and location of the pipe.'], ['What should I tell you when I call?', 'Tell us what is happening, when it started, and whether water is actively leaking. That helps our team understand the urgency.']],
  },
  {
    slug: 'sewer-repair', title: 'Sewer Line Repair in Lodi, CA', number: '04', icon: 'pipe', name: 'Sewer repair', short: 'Find the trouble underground.', image: 'sewer',
    description: 'Sewer line diagnosis, repair, and replacement with a clear explanation of the work.',
    intro: 'Sewer problems are hard to see and easy to worry about. We inspect the line, explain what we find, and help you understand the repair before work begins.',
    details: ['Sewer line diagnosis', 'Root intrusion assessment', 'Damaged drain pipe repair', 'Sewer line replacement', 'Video inspection', 'Residential and commercial sewer service'],
    sections: [['See what is happening.', 'When appropriate, a camera inspection helps locate damage, root intrusion, and blockages without relying on symptoms alone.'], ['Understand the scope.', 'We explain which section needs attention, how it can be accessed, and what the work involves.'], ['Keep your property in the conversation.', 'Access, existing landscaping, and the location of the line all affect a sewer repair. We discuss those details as part of the plan.']],
    faqs: [['Does every sewer issue need a replacement?', 'No. A blockage may need cleaning, while damaged pipe may need repair or replacement. An inspection helps establish the right approach.'], ['Can tree roots cause sewer backups?', 'Yes. Roots can enter a damaged or open joint and restrict flow. We can inspect the line and discuss cleaning or repair.'], ['Do you inspect sewer lines before a property purchase?', 'Yes. Ask about a camera inspection and a record of the findings.']],
  },
  {
    slug: 'commercial-plumbing', title: 'Commercial Plumbing in Lodi, CA', number: '05', icon: 'building', name: 'Commercial plumbing', short: 'Keep business moving.', image: 'commercial',
    description: 'Plumbing service for restaurants, offices, rental properties, and commercial buildings.',
    intro: 'A plumbing issue at work affects more than a fixture. We help businesses and property managers assess the problem, plan the repair, and get the plumbing back in service.',
    details: ['Commercial fixture repair', 'Water heater service and installation', 'Drain cleaning and hydro-jetting', 'Sewer line inspection and repair', 'Multi-unit property plumbing', 'Maintenance and replacement planning'],
    sections: [['Work with a team that communicates.', 'Tell us how the building is used and what is affected. We discuss access, the scope of work, and any interruption the repair may require.'], ['One property or several.', 'We work with business owners and property managers on repairs, replacements, and recurring plumbing concerns.'], ['Equipment that fits the building.', 'Commercial demand can be very different from a household. We review the fixtures and systems involved before recommending equipment.']],
    faqs: [['What kinds of properties do you serve?', 'We serve restaurants, offices, multi-unit properties, and other commercial buildings in our service area.'], ['Do you work with property managers?', 'Yes. Call us to discuss the property, the problem, and access arrangements.'], ['Can you service commercial water heaters?', 'Yes. We handle commercial water heater repair and replacement, with equipment selected for the building and its demand.']],
  },
  {
    slug: 'water-softeners', title: 'Water Softeners & Filtration in Lodi, CA', number: '06', icon: 'drop', name: 'Water treatment', short: 'A better fit for your water.', image: 'filtration',
    description: 'Water softener and filtration installation for your home and its plumbing.',
    intro: 'Scale on fixtures and mineral buildup can make hard water frustrating. We install water softening and filtration systems and explain which options fit your home.',
    details: ['Water softener installation', 'Whole-home filtration', 'Existing system replacement', 'Equipment and plumbing connections', 'System sizing', 'Maintenance guidance'],
    sections: [['Choose a system for your needs.', 'We discuss the water concerns you want to address, your household use, and the available installation space.'], ['A proper plumbing connection.', 'We plan the connections and location around the equipment and your existing plumbing.'], ['Know how to look after it.', 'We explain the regular care your chosen system needs, including salt or filter replacement where applicable.']],
    faqs: [['Are softeners and filters the same thing?', 'No. Softeners address water hardness. Filters are designed for specific water quality concerns. We can discuss the difference and which type fits your goals.'], ['Can you replace an existing system?', 'Yes. We can review the current setup and discuss replacement options.'], ['Will a system need regular maintenance?', 'Yes. The requirements depend on the equipment. We explain the care instructions for the system you choose.']],
  },
  {
    slug: 'hydro-jetting', title: 'Hydro-Jetting in Lodi, CA', number: '07', icon: 'jet', name: 'Hydro-jetting', short: 'More than a temporary opening.', image: 'roots',
    description: 'High-pressure drain and sewer cleaning for stubborn buildup and recurring blockages.',
    intro: 'Some lines need more than a basic clearing. Hydro-jetting uses high-pressure water to remove buildup inside a suitable drain or sewer line.',
    details: ['Grease and sludge removal', 'Sewer line cleaning', 'Recurring blockage assessment', 'Commercial drain maintenance', 'Line condition review', 'Camera inspection when appropriate'],
    sections: [['Check the line first.', 'Pipe condition matters. We assess whether hydro-jetting is suitable before recommending it.'], ['Clean the buildup.', 'The equipment directs water through the line to remove accumulated material. The approach depends on the pipe and the obstruction.'], ['Make a maintenance plan.', 'For recurring commercial or residential problems, we can discuss a practical maintenance schedule after assessing the line.']],
    faqs: [['Is hydro-jetting right for every drain?', 'No. The condition and type of pipe matter. We assess the line before recommending a cleaning method.'], ['How is it different from rooter service?', 'A rooter mechanically clears an obstruction. Hydro-jetting uses water to clean buildup from the line. We choose the approach based on the problem.'], ['Do you offer it for businesses?', 'Yes. We provide hydro-jetting for suitable commercial and residential lines.']],
  },
  {
    slug: 'video-inspection', title: 'Sewer Camera Inspection in Lodi, CA', number: '08', icon: 'camera', name: 'Camera inspections', short: 'See the problem clearly.', image: 'camera',
    description: 'A closer look inside your sewer line before deciding what to do next.',
    intro: 'A sewer camera helps us look for roots, blockages, and pipe damage. We explain what the inspection shows and what it means for the next step.',
    details: ['Sewer and drain line inspection', 'Recurring blockage diagnosis', 'Root intrusion assessment', 'Pipe condition review', 'Pre-purchase inspections', 'A record of inspection findings'],
    sections: [['Useful answers from inside the pipe.', 'Camera footage can help explain a recurring problem that cleaning alone has not resolved.'], ['Information before a repair.', 'An inspection helps us discuss the location and condition of the problem before recommending additional work.'], ['For homeowners and property buyers.', 'An inspection can also give you more information about a property before a purchase. Ask what is included when you schedule.']],
    faqs: [['Will a camera inspection clear a blockage?', 'An inspection is a diagnostic service. Cleaning or repair may be needed separately, depending on what is found.'], ['Can I use this before buying a house?', 'Yes. Ask about a pre-purchase sewer inspection and the findings provided afterward.'], ['When does a camera inspection make sense?', 'Recurring backups, suspected roots, and concerns about pipe condition are common reasons. We can discuss your symptoms first.']],
  },
  {
    slug: 'gas-lines', title: 'Gas Line Installation & Repair in Lodi, CA', number: '09', icon: 'flame', name: 'Gas lines', short: 'Careful work. Clear answers.', image: 'gas',
    description: 'Gas line installation and repair by licensed plumbing professionals.',
    intro: 'Gas piping calls for experienced hands. We provide gas line installation, leak detection, and repair for homes and businesses in our service area.',
    details: ['Gas line installation', 'Gas piping repair', 'Leak detection', 'Appliance connection planning', 'Iron pipe installation', 'Gastite and CSST installation'],
    sections: [['Plan the connection.', 'We review the appliance, its requirements, and the existing gas piping before discussing the work.'], ['Experienced installers.', 'Our team works with iron pipe and is certified for Gastite CSST installations.'], ['Understand the work involved.', 'We explain the scope, access requirements, and next steps before the project begins.']],
    faqs: [['Can you install a new gas line?', 'Yes. We review the requirements and existing piping before planning a new installation.'], ['What types of gas piping do you install?', 'We work with iron pipe and Gastite CSST systems. The choice depends on the installation.'], ['Do you work on commercial gas lines?', 'Yes. Call to discuss the building and the work you need.']],
  },
];

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
  }
];

export const commonFaqs = [
  ['Where do you work?', 'We are based in Lodi and serve Stockton, Galt, and surrounding communities, including Acampo, Woodbridge, Lockeford, and Clements. Call if you are unsure whether your address is in our service area.'],
  ['How quickly can someone come out?', 'We prioritize urgent calls. Call (209) 366-2319, tell us what is happening, and our team will confirm availability. Online requests are reviewed during business hours.'],
  ['Are you licensed and insured?', 'Yes. Phil & Paul\'s Plumbing is licensed and insured. Our California C-36 plumbing contractor license number is 900888.'],
  ['Do you stand behind your work?', 'We offer a one-year labor warranty on most repairs and installations. Ask about the coverage that applies to your job. Equipment manufacturer warranties are separate.'],
  ['What are your hours?', 'Monday through Friday, 7 a.m. to 7 p.m. Saturday, 8 a.m. to 4 p.m. Closed Sunday. Call to confirm appointment availability.'],
];

export const cities = [
  { slug: 'stockton-plumbers', name: 'Stockton', intro: 'From an older home with recurring drain problems to a commercial building that needs a water heater, our Lodi-based team runs plumbing calls throughout Stockton.', focus: 'Repairs for an established city.', detail: 'Stockton properties include older plumbing systems, busy commercial spaces, and newer homes. We inspect the actual problem, explain the condition of the equipment or pipe, and discuss a practical repair.', image: 'field' },
  { slug: 'galt-plumbing-services', name: 'Galt', intro: 'Phil & Paul\'s Plumbing serves homeowners and businesses in Galt with repairs, water heater work, drain cleaning, and sewer service.', focus: 'A nearby team for the work at hand.', detail: 'We bring the same approach to a dripping faucet and a larger sewer repair: understand the problem, explain the options, and agree on the work before getting started.', image: 'truck' },
  { slug: 'acampo-plumbing-services', name: 'Acampo', intro: 'Our Lodi-based crew serves homes and businesses in Acampo with water heater service, drain cleaning, and general plumbing repairs. Call with your address and we will help arrange the next step.', focus: 'Plan the visit around your property.', detail: 'A clear description and a service address help us plan the visit. Tell us about the affected fixtures, whether water is actively leaking, and any access details. We will confirm coverage and discuss the work before scheduling.', image: 'truck' },
  { slug: 'woodbridge-plumbing-services', name: 'Woodbridge', intro: 'Need a plumber in Woodbridge? Phil & Paul\'s Plumbing handles kitchen and bathroom repairs, water heaters, drain problems, and sewer work from our home base in Lodi.', focus: 'Keep the everyday plumbing working.', detail: 'A running toilet, a leaking faucet, and a water heater problem each need a different approach. We inspect the actual issue, explain the repair options, and discuss the scope with you before starting.', image: 'repair' },
  { slug: 'lockeford-plumbing-services', name: 'Lockeford', intro: 'Phil & Paul\'s Plumbing serves Lockeford homeowners and businesses with repairs, water heater installations, drain cleaning, and sewer service. Call our local office to confirm availability.', focus: 'A clear plan for your next plumbing job.', detail: 'Whether you need a repair now or are planning a fixture or water heater replacement, start with a call. We can discuss the problem, the property, and the information our team needs to plan the work.', image: 'waterHeater' },
];

const basePages = [
  { route: '/', name: 'Home', type: 'home', title: "Plumber in Lodi, CA Since 1996 | Phil & Paul's Plumbing", description: 'Local plumbing repairs, water heaters, drain cleaning, and sewer service in Lodi, Stockton, and Galt. Call Phil & Paul\'s Plumbing at (209) 366-2319.' },
  { route: '/service', name: 'Services', type: 'services', title: "Plumbing Services in Lodi | Phil & Paul's Plumbing", description: 'Explore water heater, drain, sewer, repair, gas line, and commercial plumbing services from Phil & Paul\'s Plumbing in Lodi, California.' },
  { route: '/about', name: 'About', type: 'about', title: "Local Plumbers Since 1996 | About Phil & Paul's", description: 'Meet the local plumbing company serving Lodi, Stockton, and Galt since 1996. Licensed, insured, and backed by a one-year labor warranty on most work.' },
  { route: '/service-areas', name: 'Service area', type: 'areas', title: "Lodi, Stockton & Galt Plumbers | Our Service Area", description: 'Based in Lodi and serving Stockton, Galt, Acampo, Woodbridge, Lockeford, Clements, and surrounding communities. Call to confirm availability.' },
  { route: '/contact', name: 'Contact', type: 'contact', title: "Contact Phil & Paul's Plumbing | Lodi, CA", description: 'Call (209) 366-2319 for plumbing service in Lodi and surrounding communities. View our hours, address, and service-request options.' },
  { route: '/book-plumbing-services', name: 'Request service', type: 'booking', title: "Book Plumbing Service in Lodi, CA | Phil & Paul's", description: 'Request a plumbing appointment in Lodi, Stockton, Galt, or nearby communities. For an urgent problem, call (209) 366-2319.' },
  { route: '/privacy-policy', name: 'Privacy policy', type: 'legal', legal: 'privacy', title: "Privacy Policy | Phil & Paul's Plumbing", description: "How Phil & Paul's Plumbing collects, uses, and protects your personal information, and the privacy rights available to you." },
  { route: '/terms-and-conditions', name: 'Terms and conditions', type: 'legal', legal: 'terms', title: "Terms and Conditions | Phil & Paul's Plumbing", description: "The terms that apply when you use the Phil & Paul's Plumbing website and services." },
  { route: '/cookie-policy', name: 'Cookie policy', type: 'legal', legal: 'cookies', title: "Cookie Policy | Phil & Paul's Plumbing", description: "Which cookies the Phil & Paul's Plumbing website uses, and how to change your privacy choices." },
  { route: '/accessibility', name: 'Accessibility statement', type: 'legal', legal: 'accessibility', title: "Accessibility Statement | Phil & Paul's Plumbing", description: "Our commitment to an accessible website, and how to reach us if anything on the site is hard to use." },
  { route: '/leave-a-review', name: 'Customer reviews', type: 'reviews', title: "Customer Reviews | Phil & Paul's Plumbing", description: 'Read what customers say about Phil & Paul\'s Plumbing or share your experience on Google or Yelp.' },
];
export const pages = [
  ...basePages,
  ...services.map((service) => ({ route: `/service/${service.slug}`, type: 'service', service: service.slug, name: service.name, title: `${service.title} | Phil & Paul's${service.title.length > 34 ? '' : ' Plumbing'}`, description: `${service.description} Serving Lodi, Stockton, and Galt. Call (209) 366-2319.` })),
  ...cities.map((city) => ({ route: `/plumber/${city.slug}`, type: 'city', city: city.slug, name: city.name, title: `Plumber in ${city.name}, CA | Phil & Paul's Plumbing`, description: `Plumbing repairs, water heaters, drains, and sewer service in ${city.name}. Local plumbers serving the area since 1996. Call (209) 366-2319.` })),
];
