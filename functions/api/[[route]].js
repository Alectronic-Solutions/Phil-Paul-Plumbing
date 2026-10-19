// Proof of consent sent with every service request. Keep `text` identical to the checkbox label on the booking page
// (npm run verify checks this) and change `version` whenever the wording changes.
export const CONSENT = {
  version: '2026-10-19',
  text: 'I agree to the Terms and Conditions and Privacy Policy, and I agree to be contacted by phone, text, or email about this service request. Msg & data rates may apply. Reply STOP to opt out.',
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function onRequestPost({ request, env, params }) {
  const route = Array.isArray(params.route) ? params.route.join('/') : params.route;
  if (!['book-service', 'subscribe'].includes(route)) return json({ ok: false }, 404);
  const origin = request.headers.get('Origin');
  if (origin !== new URL(request.url).origin) return json({ ok: false, error: 'Invalid request origin.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ ok: false }, 415);
  if (Number(request.headers.get('Content-Length') || 0) > 16384) return json({ ok: false }, 413);
  const body = await request.text();
  if (body.length > 16384) return json({ ok: false }, 413);
  let input;
  try { input = JSON.parse(body); } catch { return json({ ok: false }, 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ ok: false }, 400);
  const required = route === 'book-service' ? ['Name', 'Phone', 'City', 'Service-Needed', 'Opt-In'] : ['email'];
  const allowed = new Set([...required, ...(route === 'book-service' ? ['Email', 'Details'] : [])]);
  if (input.Website) return json({ ok: false, error: 'Unable to process this request. Please call (209) 366-2319.' }, 400);
  const fields = Object.fromEntries(Object.entries(input).filter(([key]) => allowed.has(key)).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : '']));
  if (required.some((key) => !fields[key])) return json({ ok: false, error: 'Please complete all required fields.' }, 400);
  if (Object.entries(fields).some(([key, value]) => value.length > (key === 'Details' ? 2000 : 256))) return json({ ok: false, error: 'Please shorten your message and try again.' }, 400);
  const email = fields.Email || fields.email;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  if (route === 'book-service' && !/^\d{7,15}$/.test(fields.Phone.replace(/\D/g, ''))) return json({ ok: false, error: 'Please enter a valid phone number.' }, 400);
  if (route === 'book-service' && fields['Opt-In'] !== 'on') return json({ ok: false, error: 'Please confirm the contact consent checkbox.' }, 400);
  const destination = route === 'book-service' ? env.DELIVERY_WEBHOOK_URL : env.SUBSCRIBE_WEBHOOK_URL;
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
      body: JSON.stringify({ type: route, submittedAt: new Date().toISOString(), fields, ...(route === 'book-service' ? { consent: { ...CONSENT, page: request.headers.get('Referer') || null, ip: request.headers.get('CF-Connecting-IP') || null } } : {}) }),
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
