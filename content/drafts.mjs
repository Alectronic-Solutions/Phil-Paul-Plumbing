// Draft pages for review: /licensing, /warranty, /coupons. Delete this file along with the draft entries in business.mjs.
// Licensing and warranty use facts already published elsewhere on the site. The coupon offers are placeholders, not real deals.
export const drafts = {
  '/licensing': {
    eyebrow: 'LICENSED & INSURED',
    title: ['Properly licensed.', 'Fully insured.'],
    intro: 'Hiring a plumber means letting someone into your home. Here is how to check that we are who we say we are.',
    sections: [
      ['Our license', ['Phil & Paul’s Plumbing, Inc. holds a California C-36 plumbing contractor license, number 900888, issued by the Contractors State License Board (CSLB).', 'You can look up any California contractor, including us, on the CSLB website at cslb.ca.gov. Checking takes a minute and shows the license status and classification.']],
      ['Insurance', ['We carry insurance for the work we do. If you need a certificate of insurance for a property manager, landlord, or HOA, call the office and we will send one.']],
      ['Before you hire anyone', ['Ask for a license number, then verify it. Check that the classification matches the work. Plumbing work in California requires a C-36 or a general contractor license.', 'Be careful with anyone who asks for a large cash deposit or cannot give you a license number.']],
    ],
    facts: [['License', 'CA C-36 #900888'], ['Issued by', 'California CSLB'], ['In business', 'Since 1996']],
  },
  '/warranty': {
    eyebrow: 'OUR WARRANTY',
    title: ['We stand behind', 'our work.'],
    intro: 'If something we installed or repaired is not right, call us. We would rather fix it than have you wonder.',
    sections: [
      ['One-year labor warranty', ['Most repairs and installations come with a one-year labor warranty. If the workmanship fails within a year, we come back and correct it.', 'Coverage can differ by job, so ask about the warranty that applies to yours when you get your estimate.']],
      ['Manufacturer warranties', ['Water heaters, fixtures, and other equipment have their own manufacturer warranties. Those are provided by the manufacturer, not by us. We can help you register equipment and understand what it covers.']],
      ['What is not covered', ['Damage from misuse, freezing, hard water scale, work done by someone else, or normal wear is not covered by the labor warranty.']],
      ['How to request warranty service', ['Call (209) 366-2319 or send a service request. Have your invoice or the service address handy so we can find your job.']],
    ],
    facts: [['Labor warranty', '1 year on most work'], ['Equipment', 'Manufacturer warranty'], ['Questions', '(209) 366-2319']],
  },
  '/coupons': {
    eyebrow: 'COUPONS & OFFERS',
    title: ['Plumbing offers', 'for our neighbors.'],
    intro: 'Sample page. The offers below are placeholders so you can judge the layout. None of them are real.',
    sample: true,
    offers: [
      ['$00 off', 'Any service call', 'Sample offer. Mention this coupon when you call.', 'SAMPLE10'],
      ['$00 off', 'Drain cleaning', 'Sample offer. One coupon per visit.', 'SAMPLE20'],
      ['Free', 'Water heater inspection', 'Sample offer. Valid with a water heater service.', 'SAMPLE30'],
    ],
    sections: [
      ['Coupon terms', ['Sample terms: one coupon per household, cannot be combined with other offers, and must be mentioned when scheduling. Replace with real terms before publishing.']],
    ],
    facts: [['Redeem', 'Mention when you call'], ['Call', '(209) 366-2319']],
  },
};
