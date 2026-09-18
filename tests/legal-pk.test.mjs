import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const libraryHtml = readFileSync('dist/legal-pk/index.html', 'utf8');
const gateScripts = [...libraryHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter((script) => script.includes('https://free.freeipapi.com/api/v1/json'));
assert.equal(gateScripts.length, 1, 'Expected one built country-gate script; run npm run build first.');
const [code] = gateScripts;
const flush = () => new Promise((resolve) => setImmediate(resolve));

function createGate(fetchResponse, hash = '') {
  const elements = {
    '[data-country-gate]': { hidden: false },
    '[data-legal-content]': { hidden: true, contains: () => false },
    '[data-country-status]': { textContent: '' },
  };
  const events = {};
  let timeout;
  const requests = [];
  vm.runInNewContext(code, {
    AbortController,
    document: { querySelector: (selector) => elements[selector], getElementById: () => null },
    window: {
      location: { hash },
      setTimeout: (callback, duration) => { assert.equal(duration, 8000); timeout = callback; return 1; },
      clearTimeout: () => {},
      addEventListener: (name, callback) => { events[name] = callback; },
    },
    fetch: async (url, options) => {
      requests.push({ url, options });
      return fetchResponse(options);
    },
  });
  return {
    content: elements['[data-legal-content]'],
    gate: elements['[data-country-gate]'],
    status: elements['[data-country-status]'],
    events, requests, expire: () => timeout(), calls: () => requests.length,
  };
}
const response = (body, ok = true) => async () => ({ ok, json: async () => body });

test('documents start hidden; only PK reveals them', async () => {
  const state = createGate(response({ countryCode: 'PK' }));
  assert.equal(state.content.hidden, true);
  await flush();
  assert.equal(state.content.hidden, false);
  assert.equal(state.gate.hidden, true);
});

for (const [name, body] of [
  ['non-PK', { countryCode: 'US' }], ['missing country', {}],
  ['null body', null], ['invalid type', { countryCode: 123 }],
  ['invalid code', { countryCode: 'Pakistan' }],
]) {
  test(`${name} keeps documents hidden`, async () => {
    const state = createGate(response(body));
    await flush();
    assert.equal(state.content.hidden, true);
    assert.equal(state.gate.hidden, false);
    assert.doesNotMatch(state.status.textContent, /Checking/);
  });
}

test('HTTP and network errors fail closed', async () => {
  for (const fetchResponse of [response({}, false), async () => { throw new Error('Network'); }]) {
    const state = createGate(fetchResponse);
    await flush();
    assert.equal(state.content.hidden, true);
    assert.match(state.status.textContent, /could not confirm/);
  }
});

test('timeout fails closed', async () => {
  const state = createGate(({ signal }) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => reject(new Error('Aborted')));
  }));
  state.expire();
  await flush();
  assert.equal(state.content.hidden, true);
  assert.match(state.status.textContent, /could not confirm/);
});

test('back/forward restoration rechecks; pagehide removes access', async () => {
  const state = createGate(response({ countryCode: 'PK' }));
  await flush();
  state.events.pagehide();
  assert.equal(state.content.hidden, true);
  state.events.pageshow({ persisted: true });
  assert.equal(state.content.hidden, true);
  await flush();
  assert.equal(state.calls(), 2);
  assert.equal(state.content.hidden, false);
});

test('malformed URL fragments do not break a valid check', async () => {
  const state = createGate(response({ countryCode: 'PK' }), '#%invalid');
  await flush();
  assert.equal(state.content.hidden, false);
});

test('built legal pages are hidden by default, noindex, and absent from sitemap', () => {
  for (const route of ['legal-pk', 'legal-pk/example-services-agreement']) {
    const html = readFileSync(`dist/${route}/index.html`, 'utf8');
    assert.match(html, /data-legal-content hidden/);
    assert.match(html, /name="robots" content="noindex,follow"/);
    assert.match(html, /JavaScript is required/);
  }
  assert.doesNotMatch(readFileSync('dist/sitemap-0.xml', 'utf8'), /legal-pk/);
});


test('lookup omits credentials, storage caching, and referrer', async () => {
  const state = createGate(response({ countryCode: 'PK' }));
  await flush();
  assert.equal(state.requests.length, 1);
  const { url, options } = state.requests[0];
  assert.equal(url, 'https://free.freeipapi.com/api/v1/json');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.referrerPolicy, 'no-referrer');
});

test('invalid JSON fails closed', async () => {
  const state = createGate(async () => ({
    ok: true,
    json: async () => { throw new SyntaxError('Invalid JSON'); },
  }));
  await flush();
  assert.equal(state.content.hidden, true);
  assert.match(state.status.textContent, /could not confirm/);
});

test('a late response cannot reveal documents after pagehide', async () => {
  let finishRequest;
  const state = createGate(() => new Promise((resolve) => { finishRequest = resolve; }));
  state.events.pagehide();
  finishRequest({ ok: true, json: async () => ({ countryCode: 'PK' }) });
  await flush();
  assert.equal(state.content.hidden, true);
  assert.equal(state.gate.hidden, false);
});

test('reader contents stay collapsed and removed layout hooks do not return', () => {
  const html = readFileSync('dist/legal-pk/example-services-agreement/index.html', 'utf8');
  const details = html.match(/<details\b[^>]*>/)?.[0];
  assert.ok(details, 'Contents disclosure must exist');
  assert.doesNotMatch(details, /\bopen(?:[\s=>])/);
  assert.match(html, /max-w-3xl/);
  for (const page of [libraryHtml, html]) {
    assert.doesNotMatch(page, /class="[^"]*\b(?:legal-reader|legal-display|legal-eyebrow|legal-section-heading|legal-footnote)\b/);
  }
});
