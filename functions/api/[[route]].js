// Proof of consent sent with every service request. Keep `text` identical to the checkbox label on the booking page
// (npm run verify checks this) and change `version` whenever the wording changes.
export const CONSENT = {
  version: '2026-10-22',
  text: 'I agree to the Terms and Conditions and Privacy Policy, and consent to calls, texts, or email about my request. Msg & data rates may apply. Reply STOP to opt out.',
};

// Same idea for the "text us" chat widget (components/TextUsWidget.jsx). Keep `text` identical to its checkbox label.
export const TEXT_CONSENT = {
  version: '2026-10-22',
  text: 'I agree to the Terms and Conditions and Privacy Policy, and I authorize Phil and Paul\'s Plumbing, Inc. to text and call me at this number about my message, including by automated means. Consent is not a condition of purchase. Msg & data rates may apply. Message frequency varies. Reply HELP for help or STOP to unsubscribe.',
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function onRequestPost({ request, env, params }) {
  const route = Array.isArray(params.route) ? params.route.join('/') : params.route;
  if (!['book-service', 'text-request', 'subscribe'].includes(route)) return json({ ok: false }, 404);
  const isLead = route !== 'subscribe';
  const origin = request.headers.get('Origin');
  if (origin !== new URL(request.url).origin) return json({ ok: false, error: 'Invalid request origin.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ ok: false }, 415);
  if (Number(request.headers.get('Content-Length') || 0) > 16384) return json({ ok: false }, 413);
  const body = await request.text();
  if (body.length > 16384) return json({ ok: false }, 413);
  let input;
  try { input = JSON.parse(body); } catch { return json({ ok: false }, 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ ok: false }, 400);
  const required = { 'book-service': ['Name', 'Phone', 'City', 'Service-Needed', 'Opt-In'], 'text-request': ['Name', 'Phone', 'Message', 'Opt-In'], subscribe: ['email'] }[route];
  const allowed = new Set([...required, ...(route === 'book-service' ? ['Email', 'Details', 'Address', 'Heard-About'] : [])]);
  if (input.Website) return json({ ok: false, error: 'Unable to process this request. Please call (209) 366-2319.' }, 400);
  const fields = Object.fromEntries(Object.entries(input).filter(([key]) => allowed.has(key)).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : '']));
  if (required.some((key) => !fields[key])) return json({ ok: false, error: 'Please complete all required fields.' }, 400);
  if (Object.entries(fields).some(([key, value]) => value.length > (key === 'Details' || key === 'Message' ? 2000 : 256))) return json({ ok: false, error: 'Please shorten your message and try again.' }, 400);
  const email = fields.Email || fields.email;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  if (isLead && !/^\d{7,15}$/.test(fields.Phone.replace(/\D/g, ''))) return json({ ok: false, error: 'Please enter a valid phone number.' }, 400);
  if (isLead && fields['Opt-In'] !== 'on') return json({ ok: false, error: 'Please confirm the contact consent checkbox.' }, 400);
  const destination = isLead ? env.DELIVERY_WEBHOOK_URL : env.SUBSCRIBE_WEBHOOK_URL;
  if (!destination) return json({ ok: false, error: 'Online requests are not connected yet. Please call (209) 366-2319.' }, 503);
  let url;
  try { url = new URL(destination); } catch { return json({ ok: false }, 503); }
  if (url.protocol !== 'https:') return json({ ok: false }, 503);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.DELIVERY_WEBHOOK_SECRET ? { Authorization: `Bearer ${env.DELIVERY_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify({ type: route, submittedAt: new Date().toISOString(), fields, ...(isLead ? { consent: { ...(route === 'text-request' ? TEXT_CONSENT : CONSENT), page: request.headers.get('Referer') || null, ip: request.headers.get('CF-Connecting-IP') || null } } : {}) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Delivery failed');
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'Unable to send your request. Please call (209) 366-2319.' }, 502);
  }
}

export function onRequest({ request }) {
  return json({ ok: false }, request.method === 'POST' ? 404 : 405);
}
