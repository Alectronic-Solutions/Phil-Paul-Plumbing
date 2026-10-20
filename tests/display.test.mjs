import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { displayKey, defaultDisplay, parseDisplay, serializeDisplay, displayAttributes, bootScript } from '../lib/display.mjs';

test('settings round-trip and only changed values are stored', () => {
  const settings = { ...defaultDisplay, text: '2', contrast: 'on' };
  assert.equal(serializeDisplay(settings), '{"text":"2","contrast":"on"}');
  assert.deepEqual(parseDisplay(serializeDisplay(settings)), settings);
});
test('defaults store nothing and set no attributes', () => {
  assert.equal(serializeDisplay(defaultDisplay), null);
  assert.deepEqual(displayAttributes(defaultDisplay), {});
  assert.deepEqual(parseDisplay(null), defaultDisplay);
});
test('unknown or tampered values fall back to the defaults', () => {
  assert.deepEqual(parseDisplay('not json'), defaultDisplay);
  assert.deepEqual(parseDisplay('{"text":"9","evil":"on","links":"<script>"}'), defaultDisplay);
  assert.deepEqual(displayAttributes({ ...defaultDisplay, links: 'on' }), { 'data-display-links': 'on' });
});
test('the boot script applies saved settings and survives blocked storage', () => {
  const run = getItem => {
    const attributes = {};
    vm.runInNewContext(bootScript, { localStorage: { getItem }, document: { documentElement: { setAttribute: (k, v) => { attributes[k] = v; } } } });
    return attributes;
  };
  assert.deepEqual(run(key => key === displayKey ? '{"text":"1","motion":"on","text2":"x","font":"0"}' : null), { 'data-display-text': '1', 'data-display-motion': 'on' });
  assert.deepEqual(run(() => { throw new Error('blocked'); }), {});
});
