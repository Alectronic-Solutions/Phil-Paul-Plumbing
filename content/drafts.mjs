// Draft pages for review: /licensing, /warranty (own components), /coupons. Delete this file along with the draft entries in business.mjs.
// Licensing and warranty use facts already published elsewhere on the site. The coupon offers are placeholders, not real deals.

// /licensing has its own page component (LicensingPage). Insurance details beyond "insured" and the certificate on request
// are deliberately not stated: confirm coverage, carrier, and limits with the owner before adding any.
export const licensing = {
  steps: [
    ['Open the state lookup', 'Go to cslb.ca.gov and choose the license lookup. It is the California Contractors State License Board’s own database, not ours.'],
    ['Enter the license number', 'Type 900888, or search by business name. You will see the license status and classification as the state has it on file.'],
    ['Repeat for anyone else', 'The same lookup works for every contractor in California. Check the next plumber the same way before you let anyone in.'],
  ],
  green: ['Gives you a license number the moment you ask', 'License classification matches the job', 'Offers proof of insurance without a fuss', 'Explains the work and the price before starting'],
  red: ['Cannot or will not give a license number', 'Asks for a large cash deposit up front', 'Pressures you to decide on the spot', 'Classification does not cover plumbing'],
  faqs: [
    ['Are you licensed and insured?', 'Yes. Phil & Paul’s Plumbing, Inc. holds California C-36 plumbing contractor license number 900888, and we carry insurance for the work we do.'],
    ['How do I verify your license?', 'Visit the Contractors State License Board at cslb.ca.gov, use the license lookup, and enter 900888. It shows the license status and classification. The same lookup works for any California contractor.'],
    ['Can I get a certificate of insurance?', 'Yes. If you manage a property or belong to an HOA that needs one, call (209) 366-2319 and we will send it.'],
    ['Is your work warrantied?', 'Most repairs and installations carry a one-year labor warranty. Coverage can differ by job, so ask about the warranty that applies to yours when you get your estimate.'],
  ],
};

// /warranty has its own page component (WarrantyPage). Every claim restates the one-year labor warranty already published
// on the site (FAQ, About, service pages). Coverage details beyond that are deliberately not invented.
export const warranty = {
  steps: [
    ['Call or send a request', 'Call (209) 366-2319 or send a service request online. Tell us what we did and what is not right.'],
    ['Have your invoice handy', 'Your invoice or the service address helps us find your job quickly.'],
    ['We come back and correct it', 'If the workmanship fails within a year, we return and put it right.'],
  ],
  green: ['Workmanship on most repairs and installations', 'Corrections if our work fails within a year', 'Help registering equipment with its manufacturer', 'Leaks or failures caused by how we did the work', 'A return visit to put it right'],
  red: ['Damage from misuse', 'Freezing', 'Hard water scale', 'Work done by someone else', 'Normal wear'],
  faqs: [
    ['Do you stand behind your work?', 'We offer a one-year labor warranty on most repairs and installations. Ask about the coverage that applies to your job. Equipment manufacturer warranties are separate.'],
    ['What does the one-year labor warranty cover?', 'The workmanship. If something we installed or repaired fails within a year because of how we did the work, we come back and correct it.'],
    ['Do manufacturer warranties apply too?', 'Yes, separately. Water heaters, fixtures, and other equipment carry their own manufacturer warranties, provided by the manufacturer and not by us. We can help you register equipment and understand what it covers.'],
    ['What is not covered by the labor warranty?', 'Damage from misuse, freezing, hard water scale, work done by someone else, and normal wear.'],
    ['How do I request warranty service?', 'Call (209) 366-2319 or send a service request. Have your invoice or the service address handy so we can find your job.'],
  ],
};

// /coupons has its own page component (CouponsPage). The amounts, codes, and dates below are illustrative: confirm every offer
// with the owner before removing the draft flag in business.mjs, because publishing a coupon is a promise to honor it.
export const coupons = {
  // Each offer is [value, unit, name, terms, code].
  offers: [
    ['$30', 'OFF', 'Any drain cleaning', 'Kitchen, bath, or main line. One coupon per visit.', 'DRAIN30'],
    ['FREE', 'CHECKUP', 'Water heater inspection', 'With any water heater service call.', 'HEATERCHECK'],
    ['$150', 'OFF', 'Water heater replacement', 'New tank or tankless installation, permit included.', 'NEWHEATER150'],
    ['FREE', 'CAMERA', 'Sewer camera inspection', 'With any main line drain cleaning.', 'CAMERA'],
    ['$100', 'OFF', 'Water softener installation', 'Softener, whole-home filtration, or reverse osmosis.', 'SOFTEN100'],
    ['$25', 'OFF', 'Your first service call', 'New customers, homes and businesses.', 'WELCOME25'],
  ],
  expires: 'Valid through December 31, 2026',
  steps: [
    ['Clip your offer', 'Choose the coupon that fits the job. Offers apply to the service named on the coupon.'],
    ['Mention it when you call', 'Call (209) 366-2319 or send a service request, and tell us which offer you want to use.'],
    ['We apply it to your visit', 'Your technician takes it into account when they give you the price, before any work starts.'],
  ],
  terms: [
    'One coupon per household.',
    'Offers cannot be combined with other discounts.',
    'Mention your offer when you schedule, so we can note it on your visit.',
    'Coupons have no cash value and apply to the service named on the coupon.',
  ],
};

export const drafts = {
};
