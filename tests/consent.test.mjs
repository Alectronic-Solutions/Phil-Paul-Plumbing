import test from 'node:test';
import assert from 'node:assert/strict';
import { consentVersion, consentCookie, serializeConsent, parseConsent, needsChoice, permissions, acceptAll, rejectAll, allowedIntegrations, revokedIntegrations, categoriesInUse, offeredCategories, askWithoutTrackers, optionalCategories, cookieMatcher, consentCookieString } from '../lib/consent.mjs';
import { integrations } from '../content/integrations.mjs';

const analytics = { id: 'a', enabled: true, category: 'analytics', cookies: [{ name: '_ga' }, { name: '_ga_<ID>' }] };
const ads = { id: 'm', enabled: true, category: 'marketing', cookies: [{ name: '_fbp' }] };
const disabled = { id: 'd', enabled: false, category: 'functional', cookies: [] };
const cookieFor = choice => `other=1; ${consentCookie}=${encodeURIComponent(serializeConsent(choice))}`;

test('the only optional integration is the consent-gated Instagram embed, and the banner asks once when askWithoutTrackers is on', () => {
  assert.deepEqual(integrations.filter(item => item.enabled).map(item => item.id), ['instagram-embeds']);
  assert.deepEqual(categoriesInUse(integrations), ['functional']);
  assert.equal(needsChoice(null, integrations), askWithoutTrackers);
  assert.equal(needsChoice(parseConsent(cookieFor(rejectAll())), integrations), false);
  assert.deepEqual(offeredCategories(integrations, true), optionalCategories);
  assert.deepEqual(offeredCategories(integrations, false), ['functional']);
});
test('showing the banner without trackers grants nothing until the visitor opts in', () => {
  assert.deepEqual(permissions(null), rejectAll());
  assert.deepEqual(allowedIntegrations([analytics, ads], permissions(null)), []);
});
test('consent round-trips through the cookie', () => {
  const stored = parseConsent(cookieFor({ functional: true, analytics: false, marketing: true }));
  assert.equal(stored.version, consentVersion);
  assert.deepEqual([stored.functional, stored.analytics, stored.marketing], [true, false, true]);
  assert(stored.timestamp > 0);
});
test('missing or malformed cookies count as no choice', () => {
  for (const header of ['', 'other=1', `${consentCookie}=garbage`, `${consentCookie}=v:1|t:x|f:1|a:1|m:1`, `${consentCookie}=v:1|t:1|f:2|a:1|m:1`, `${consentCookie}=%E0%A4%A`]) assert.equal(parseConsent(header), null);
});
test('the banner shows only when something optional is in use and there is no current choice', () => {
  assert.equal(needsChoice(null, [disabled], false), false);
  assert.equal(needsChoice(null, [analytics]), true);
  assert.equal(needsChoice(parseConsent(cookieFor(rejectAll())), [analytics]), false);
  assert.equal(needsChoice({ ...parseConsent(cookieFor(acceptAll())), version: 'older' }, [analytics]), true);
});
test('nothing optional is allowed without a current opt-in', () => {
  assert.deepEqual(permissions(null), rejectAll());
  assert.deepEqual(permissions({ ...acceptAll(), version: 'older' }), rejectAll());
  assert.deepEqual(allowedIntegrations([analytics, ads], permissions(null)), []);
  assert.deepEqual(allowedIntegrations([analytics, ads, disabled], permissions(parseConsent(cookieFor(acceptAll())))), [analytics, ads]);
});
test('Global Privacy Control always keeps advertising off', () => {
  assert.equal(acceptAll({ gpc: true }).marketing, false);
  assert.equal(acceptAll({ gpc: true }).analytics, true);
  assert.equal(permissions(parseConsent(cookieFor(acceptAll())), { gpc: true }).marketing, false);
});
test('withdrawing consent identifies the integrations whose cookies must be removed', () => {
  assert.deepEqual(revokedIntegrations([analytics, ads], acceptAll(), { ...acceptAll(), marketing: false }), [ads]);
  assert(cookieMatcher('_ga_<ID>').test('_ga_ABC123'));
  assert(!cookieMatcher('_ga').test('_gat'));
});
test('the consent cookie is first-party, site-wide, and limited to 12 months', () => {
  const cookie = consentCookieString(serializeConsent(rejectAll()));
  assert.match(cookie, /^pp_consent=/);
  assert.match(cookie, /Max-Age=31536000; Path=\/; SameSite=Lax; Secure$/);
  assert(!/Domain=/.test(cookie));
});
