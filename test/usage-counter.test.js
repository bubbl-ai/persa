import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createBlobUsageStore, createUsageHandler, usageMarkerPrefix } from '../server/usage-counter.js';
import { getUsageBrowserId, isMuseOpen, mountUsageCounter } from '../web/usage-counter.js';

const env = { BLOB_READ_WRITE_TOKEN: 'test-only-token', VERCEL_ENV: 'production' };
const origin = 'https://persa.bubblai.com';
const metric = 'unique-browser-muse-opens';
const headers = { origin, 'content-type': 'application/json', 'sec-fetch-site': 'same-origin' };

function fakeBlob() {
  const markers = new Map();
  const calls = [];
  return {
    markers, calls,
    async put(pathname, body, options) {
      calls.push({ method: 'put', pathname, options });
      assert.equal(options.access, 'private');
      assert.equal(options.addRandomSuffix, false);
      assert.equal(options.allowOverwrite, false);
      assert.equal(body, '1');
      if (markers.has(pathname)) throw new Error('Already exists');
      markers.set(pathname, { pathname });
    },
    async head(pathname) {
      calls.push({ method: 'head', pathname });
      if (!markers.has(pathname)) throw new Error('Not found');
      return markers.get(pathname);
    },
    async list(options) {
      calls.push({ method: 'list', options });
      const items = [...markers.values()].filter(item => item.pathname.startsWith(options.prefix)).sort((a, b) => a.pathname.localeCompare(b.pathname));
      const offset = Number(options.cursor || 0), end = offset + 2;
      return { blobs: items.slice(offset, end), hasMore: end < items.length, cursor: end < items.length ? String(end) : undefined };
    }
  };
}

async function request(handler, { method = 'GET', body, requestHeaders = headers } = {}) {
  const response = { headers: {}, setHeader(name, value) { this.headers[name.toLowerCase()] = value; }, end(value) { this.body = JSON.parse(value); } };
  await handler({ method, body, headers: requestHeaders }, response);
  return response;
}

test('unique browser markers survive retries, concurrent requests, pagination and a fresh handler', async () => {
  const blob = fakeBlob();
  const store = createBlobUsageStore(env, blob);
  const handler = createUsageHandler({ store });
  const browserId = randomUUID();
  const ids = [browserId, ...Array.from({ length: 6 }, () => randomUUID())];
  const responses = await Promise.all([...Array(20).fill(browserId), ...ids].map(browserId => request(handler, { method: 'POST', body: { browserId } })));
  assert.ok(responses.every(response => response.statusCode === 200 && response.body.recorded));
  assert.ok(responses.every(response => !Object.hasOwn(response.body, 'count')), 'Writes must not guess totals');
  assert.ok(blob.calls.every(call => call.method !== 'list'), 'Writes must not scan the entire store');
  await store.record(browserId.toUpperCase());
  assert.equal(blob.markers.size, 7);
  assert.ok([...blob.markers.keys()].every(path => !path.includes(browserId) && /^persa-usage\/v1\/muse-open\/[0-9a-f]{64}\.json$/.test(path)));
  blob.markers.set(`${usageMarkerPrefix}not-a-browser.json`, { pathname: `${usageMarkerPrefix}not-a-browser.json` });
  blob.markers.set('unrelated/file.json', { pathname: 'unrelated/file.json' });
  const nextHandler = createUsageHandler({ store: createBlobUsageStore(env, blob) });
  const read = await request(nextHandler);
  assert.equal(read.statusCode, 200);
  assert.deepEqual(read.body, { available: true, metric, count: 7 });
  assert.match(read.headers['cache-control'], /s-maxage=60/);
  assert.ok(blob.calls.filter(call => call.method === 'list').length > 1);
  assert.ok(responses.every(response => response.headers['cache-control'] === 'no-store'));
});

test('a failed upload is accepted only when its exact existing marker is confirmed', async () => {
  const failing = { put: async () => { throw new Error('private token must stay private'); }, head: async () => { throw new Error('Missing'); } };
  const handler = createUsageHandler({ store: createBlobUsageStore(env, failing) });
  const response = await request(handler, { method: 'POST', body: { browserId: randomUUID() } });
  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, { available: false });
});

test('missing, nonproduction and failed storage never become a fabricated zero', async () => {
  assert.equal(createBlobUsageStore({}), null);
  assert.equal(createBlobUsageStore({ ...env, VERCEL_ENV: 'preview' }), null);
  assert.equal(createBlobUsageStore({ BLOB_READ_WRITE_TOKEN: env.BLOB_READ_WRITE_TOKEN }), null);
  for (const store of [null, { count: async () => { throw new Error('Unavailable'); } }, { count: async () => -1 }]) {
    const result = await request(createUsageHandler({ store }));
    assert.equal(result.statusCode, 503);
    assert.deepEqual(result.body, { available: false });
    assert.equal(result.headers['cache-control'], 'no-store');
  }
  const zero = await request(createUsageHandler({ store: createBlobUsageStore(env, fakeBlob()) }));
  assert.deepEqual(zero.body, { available: true, metric, count: 0 });
});

test('malformed and cross-origin writes are rejected without touching storage', async () => {
  let writes = 0;
  const handler = createUsageHandler({ store: { record() { writes++; } } });
  for (const body of [null, {}, [], 'bad json', { browserId: 'not-a-uuid' }, { browserId: [randomUUID()] }, { browserId: randomUUID(), count: 9999 }, { browserId: 'x'.repeat(500) }]) {
    assert.equal((await request(handler, { method: 'POST', body })).statusCode, 400);
  }
  const body = { browserId: randomUUID() };
  for (const requestHeaders of [{ ...headers, origin: 'https://other.example' }, { ...headers, origin: undefined }, { ...headers, 'sec-fetch-site': 'cross-site' }]) {
    assert.equal((await request(handler, { method: 'POST', body, requestHeaders })).statusCode, 403);
  }
  assert.equal((await request(handler, { method: 'POST', body, requestHeaders: { ...headers, 'content-type': 'text/plain' } })).statusCode, 415);
  assert.equal((await request(handler, { method: 'DELETE' })).statusCode, 405);
  assert.equal(writes, 0);
});

test('incomplete Blob pagination is an error rather than a partial count', async () => {
  const store = createBlobUsageStore(env, { list: async () => ({ blobs: [], hasMore: true, cursor: 'same' }) });
  await assert.rejects(store.count(), /Incomplete usage listing/);
});

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
function openEvent(overrides = {}) {
  const link = { href: 'https://muse.ai/?prompt=prepared', getAttribute: () => null };
  return { type: 'click', button: 0, isTrusted: true, defaultPrevented: false, target: { closest: () => link }, ...overrides };
}

test('only real prepared Muse navigation counts, including keyboard and middle clicks', () => {
  const location = { href: origin };
  assert.equal(isMuseOpen(openEvent(), location), true);
  assert.equal(isMuseOpen(openEvent({ type: 'auxclick', button: 1 }), location), true);
  for (const overrides of [{ isTrusted: false }, { defaultPrevented: true }, { button: 2 }, { type: 'auxclick', button: 0 }, { target: { closest: () => null } }]) assert.equal(isMuseOpen(openEvent(overrides), location), false);
  for (const href of ['https://muse.ai/', 'https://muse.ai.evil.example/?prompt=x', 'javascript:alert(1)']) {
    assert.equal(isMuseOpen(openEvent({ target: { closest: () => ({ href, getAttribute: () => null }) } }), location), false);
  }
});

test('browser ID persists; blocked storage skips tracking instead of creating session users', () => {
  const localStorage = storage();
  const crypto = { randomUUID };
  const first = getUsageBrowserId(localStorage, crypto);
  assert.equal(getUsageBrowserId(localStorage, crypto), first);
  assert.equal(getUsageBrowserId({ getItem() { throw new Error('Blocked'); } }, crypto), null);
  assert.equal(getUsageBrowserId({ getItem() { return null; }, setItem() {} }, crypto), null);
});

function clientFixture({ webdriver = false, localStorage = storage(), fail = false } = {}) {
  const listeners = new Map();
  const total = { textContent: '' };
  const node = { hidden: true, querySelector: () => total };
  const calls = [];
  const document = { querySelectorAll: () => [node], addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const window = { location: { origin, href: origin }, navigator: { webdriver }, localStorage, crypto: { randomUUID } };
  const fetcher = async (url, options = {}) => {
    calls.push({ url, options });
    return { ok: !fail, json: async () => options.method === 'POST' ? { available: true, metric, recorded: true } : { available: true, metric, count: 2 } };
  };
  const cleanup = mountUsageCounter({ document, window, fetcher });
  return { listeners, node, total, calls, cleanup, window };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('client displays only confirmed totals and records a browser once without blocking navigation', async () => {
  const fixture = clientFixture();
  await settle();
  assert.equal(fixture.node.hidden, false);
  assert.equal(fixture.total.textContent, '2 browsers have opened Muse');
  fixture.listeners.get('click')(openEvent());
  await settle();
  fixture.listeners.get('click')(openEvent());
  await settle();
  const writes = fixture.calls.filter(call => call.options.method === 'POST');
  assert.equal(writes.length, 1);
  assert.equal(writes[0].options.keepalive, true);
  assert.equal(fixture.total.textContent, '2 browsers have opened Muse', 'No optimistic increment');
  fixture.cleanup();
  assert.equal(fixture.listeners.size, 0);
  const returning = clientFixture({ localStorage: fixture.window.localStorage });
  returning.listeners.get('click')(openEvent());
  await settle();
  assert.equal(returning.calls.filter(call => call.options.method === 'POST').length, 0);
});

test('automated QA, synthetic clicks and unavailable counters cannot add or display fake usage', async () => {
  for (const fixture of [clientFixture({ webdriver: true }), clientFixture()]) {
    fixture.listeners.get('click')(openEvent({ isTrusted: fixture.window.navigator.webdriver }));
    await settle();
    assert.equal(fixture.calls.filter(call => call.options.method === 'POST').length, 0);
  }
  const unavailable = clientFixture({ fail: true });
  await settle();
  assert.equal(unavailable.node.hidden, true);
  assert.equal(unavailable.total.textContent, '');
});
