// The only place a third-party script, pixel, widget, or cookie may be added to the site.
//
// The consent manager (components/Consent.jsx) loads an integration only after the visitor opts in to its
// category, and the cookie policy (content/legal.mjs) lists every enabled integration automatically.
// `npm run verify` fails if a script, iframe, or cookie is added any other way.
//
// Categories:
//   functional  Optional features run by another company, such as a chat or text-us widget, booking widget, or map embed.
//   analytics   Measuring visits and site use, such as Google Analytics 4 or Microsoft Clarity.
//   marketing   Advertising, conversion tracking, remarketing, and call tracking, such as Google Ads, a Meta Pixel, or CallRail.
//
// Before enabling anything: confirm the account is owned by the business, list every cookie it sets (check the
// vendor's documentation and the browser's storage panel), and update `consentVersion` in lib/consent.mjs so
// returning visitors are asked again. Session replay and chat widgets that record conversations need extra review
// under California's wiretapping law (CIPA). Have the business's attorney approve them first.
//
// Example entry (Google Analytics 4):
// {
//   id: 'ga4',
//   enabled: true,
//   name: 'Google Analytics',
//   provider: 'Google LLC',
//   category: 'analytics',
//   purpose: 'Counts visits and shows which pages are used so we can improve the site.',
//   privacyUrl: 'https://policies.google.com/privacy',
//   cookies: [
//     { name: '_ga', duration: '2 years', purpose: 'Distinguishes visitors.' },
//     { name: '_ga_<ID>', duration: '2 years', purpose: 'Keeps session state.' },
//   ],
//   scripts: [
//     { src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX' },
//     { inline: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XXXXXXX',{anonymize_ip:true});" },
//   ],
//   // Optional. The Content-Security-Policy (scripts/finalize-headers.mjs) already allows each script's origin and
//   // inline snippet. List any other servers the tool talks to, or the browser will block them.
//   csp: { 'connect-src': ['https://*.google-analytics.com'], 'img-src': ['https://*.google-analytics.com'] },
// },
//
// A plain "Text us" link (<a href="sms:+12093662319">) sets no cookies and does not belong here.

export const categories = {
  functional: { name: 'Functional', short: 'functional', description: 'Optional features provided by other companies, such as chat or messaging widgets. If you turn these off, you can still call us or use the service-request form.' },
  analytics: { name: 'Analytics', short: 'analytics', description: 'Help us understand how many people visit and which pages they use, so we can improve the site.' },
  marketing: { name: 'Advertising and marketing', short: 'advertising', description: 'Measure our advertising, show you relevant ads on other sites, or track which ad led to a call. Under California law, this may be "sharing" personal information for targeted advertising.' },
};

export const integrations = [];

export const activeIntegrations = integrations.filter(item => item.enabled);
