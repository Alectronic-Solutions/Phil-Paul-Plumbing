import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../functions/api/[[route]].js', import.meta.url), 'utf8');
const { onRequestPost } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const valid = { Name: 'Test User', Phone: '2095550100', City: 'Lodi', 'Service-Needed': 'Drain cleaning', 'Opt-In': 'on' };
function context(fields, env = {}, origin = 'https://preview.example.com') {
  return { request: new Request('https://preview.example.com/api/book-service', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(fields) }), env, params: { route: ['book-service'] } };
}

test('missing delivery configuration gives a clear failure, never a success', async () => {
  const response = await onRequestPost(context(valid));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
test('rejects submissions from another origin', async () => {
  assert.equal((await onRequestPost(context(valid, {}, 'https://other.example.com'))).status, 403);
});
test('rejects incomplete or malformed submissions', async () => {
  for (const fields of [{}, null, { ...valid, Email: 'bad' }, { ...valid, 'Opt-In': '' }, { ...valid, Name: 'x'.repeat(300) }, { ...valid, Phone: 'abc' }, { ...valid, Details: 'x'.repeat(2001) }, { ...valid, Website: 'spam' }]) {
    assert.equal((await onRequestPost(context(fields))).status, 400);
  }
});
test('email and details are optional, and a valid callback request is accepted', async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('ok');
  try {
    assert.equal((await onRequestPost(context(valid, { DELIVERY_WEBHOOK_URL: 'https://delivery.example.com/form' }))).status, 200);
    assert.equal((await onRequestPost(context({ ...valid, Email: 'test@example.com', Details: 'A recurring kitchen sink clog.' }, { DELIVERY_WEBHOOK_URL: 'https://delivery.example.com/form' }))).status, 200);
  } finally { globalThis.fetch = realFetch; }
});
test('reports success only after the configured delivery service accepts the request', async () => {
  const realFetch = globalThis.fetch;
  let delivered;
  globalThis.fetch = async (url, options) => { delivered = { url: url.href, headers: options.headers, body: JSON.parse(options.body) }; return new Response('ok'); };
  try {
    const response = await onRequestPost(context({ ...valid, injected: 'discard me' }, { DELIVERY_WEBHOOK_URL: 'https://delivery.example.com/form', DELIVERY_WEBHOOK_SECRET: 'test-secret' }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.equal(delivered.url, 'https://delivery.example.com/form');
    assert.equal(delivered.headers.Authorization, 'Bearer test-secret');
    assert.deepEqual(delivered.body.fields, valid);
  } finally { globalThis.fetch = realFetch; }
});
test('a failed delivery service does not produce a success', async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('error', { status: 500 });
  try {
    const response = await onRequestPost(context(valid, { DELIVERY_WEBHOOK_URL: 'https://delivery.example.com/form' }));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  } finally { globalThis.fetch = realFetch; }
});
