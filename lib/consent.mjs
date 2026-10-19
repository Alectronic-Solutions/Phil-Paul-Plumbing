// Consent rules shared by the consent manager, the cookie policy, and the tests. No browser APIs here.
//
// Raise `consentVersion` whenever an integration is added, removed, or changes what it collects.
// Visitors who chose under an older version are asked again.
export const consentVersion = '2026-10-19';
export const consentCookie = 'pp_consent';
export const consentMaxAge = 60 * 60 * 24 * 365;
export const optionalCategories = ['functional', 'analytics', 'marketing'];

const none = { functional: false, analytics: false, marketing: false };

// Categories that at least one enabled integration needs. Only these are offered to the visitor.
export function categoriesInUse(integrations) {
  return optionalCategories.filter(category => integrations.some(item => item.enabled && item.category === category));
}

export function serializeConsent(choice, now = Date.now()) {
  return [`v:${consentVersion}`, `t:${Math.floor(now / 1000)}`, ...optionalCategories.map(c => `${c[0]}:${choice[c] ? 1 : 0}`)].join('|');
}

// Reads the consent cookie from a Cookie header or document.cookie. Returns null when there is no valid choice.
export function parseConsent(cookieHeader = '') {
  const raw = cookieHeader.split(/;\s*/).find(part => part.startsWith(`${consentCookie}=`));
  if (!raw) return null;
  let value;
  try { value = decodeURIComponent(raw.slice(consentCookie.length + 1)); } catch { return null; }
  const fields = Object.fromEntries(value.split('|').map(pair => [pair.slice(0, pair.indexOf(':')), pair.slice(pair.indexOf(':') + 1)]));
  if (!fields.v || !/^\d+$/.test(fields.t || '')) return null;
  const choice = { version: fields.v, timestamp: Number(fields.t) * 1000 };
  for (const category of optionalCategories) {
    const flag = fields[category[0]];
    if (flag !== '0' && flag !== '1') return null;
    choice[category] = flag === '1';
  }
  return choice;
}

// Global Privacy Control is a legally recognized opt-out of sale and sharing in California, so it always wins over advertising consent.
export function applySignals(choice, { gpc = false } = {}) {
  const result = { ...none, ...choice };
  if (gpc) result.marketing = false;
  return result;
}

// Ask when something optional is in use and the visitor has not chosen under the current version.
export function needsChoice(stored, integrations) {
  if (!categoriesInUse(integrations).length) return false;
  return !stored || stored.version !== consentVersion;
}

// Effective permissions. Nothing optional runs without a current, explicit opt-in.
export function permissions(stored, signals = {}) {
  if (!stored || stored.version !== consentVersion) return applySignals(none, signals);
  return applySignals(stored, signals);
}

export function acceptAll(signals = {}) { return applySignals({ functional: true, analytics: true, marketing: true }, signals); }
export function rejectAll() { return { ...none }; }

export function allowedIntegrations(integrations, granted) {
  return integrations.filter(item => item.enabled && granted[item.category] === true);
}

// Integrations that were running and are no longer allowed. Their cookies are removed and the page reloads.
export function revokedIntegrations(integrations, before, after) {
  return integrations.filter(item => item.enabled && before[item.category] && !after[item.category]);
}

// Cookie names may use <ID> or * as a wildcard, for example "_ga_<ID>".
export function cookieMatcher(name) {
  const escaped = name.split(/<[^>]+>|\*/).map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+');
  return new RegExp(`^${escaped}$`);
}

export function consentCookieString(value, { secure = true } = {}) {
  return `${consentCookie}=${encodeURIComponent(value)}; Max-Age=${consentMaxAge}; Path=/; SameSite=Lax${secure ? '; Secure' : ''}`;
}
