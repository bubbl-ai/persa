const storageKey = 'persa.usage.browser-id.v1';
const recordedKey = 'persa.usage.recorded-id.v1';
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getUsageBrowserId(storage, crypto) {
  try {
    const existing = storage.getItem(storageKey);
    if (idPattern.test(existing)) return existing;
    const id = crypto.randomUUID();
    storage.setItem(storageKey, id);
    // If persistence is blocked, skip tracking instead of counting each visit.
    return storage.getItem(storageKey) === id ? id : null;
  } catch { return null; }
}

export function isMuseOpen(event, location) {
  if (!event.isTrusted || event.defaultPrevented || !['click', 'auxclick'].includes(event.type)) return false;
  if ((event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return false;
  const link = event.target?.closest?.('a[data-muse-handoff]');
  if (!link || link.getAttribute('aria-disabled') === 'true') return false;
  try {
    const url = new URL(link.href, location.href);
    return url.origin === 'https://muse.ai' && url.pathname === '/' && !!url.searchParams.get('prompt');
  } catch { return false; }
}

export function mountUsageCounter({ document, window, fetcher = window.fetch.bind(window) }) {
  let activeRequest = null;
  let confirmed = false;
  function render(data) {
    const available = data?.available === true && data.metric === 'unique-browser-muse-opens' && Number.isSafeInteger(data.count) && data.count >= 0;
    for (const node of document.querySelectorAll('[data-usage-counter]')) {
      node.hidden = !available;
      if (available) node.querySelector('[data-usage-total]').textContent = `${data.count.toLocaleString()} ${data.count === 1 ? 'browser has' : 'browsers have'} opened Muse`;
    }
  }
  async function readTotal() {
    try {
      const response = await fetcher('/api/usage', { credentials: 'same-origin' });
      render(response.ok ? await response.json() : null);
    } catch { render(null); }
  }
  async function record() {
    // Automated QA, unavailable storage, and other origins never add production usage.
    if (window.navigator.webdriver || window.location.origin !== 'https://persa.bubblai.com' || confirmed) return;
    try {
      const browserId = getUsageBrowserId(window.localStorage, window.crypto);
      if (!browserId) return;
      if (window.localStorage.getItem(recordedKey) === browserId) { confirmed = true; return; }
      const response = await fetcher('/api/usage', {
        method: 'POST', credentials: 'same-origin', keepalive: true,
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ browserId })
      });
      const data = response.ok ? await response.json() : null;
      confirmed = data?.available === true && data.metric === 'unique-browser-muse-opens' && data.recorded === true;
      if (confirmed) {
        window.localStorage.setItem(recordedKey, browserId);
        await readTotal();
      }
    } catch { render(null); }
  }
  function onOpen(event) {
    if (!isMuseOpen(event, window.location) || activeRequest) return;
    // The link keeps its native navigation, including keyboard/modifier clicks.
    activeRequest = record().finally(() => { activeRequest = null; });
  }
  document.addEventListener('click', onOpen);
  document.addEventListener('auxclick', onOpen);
  readTotal();
  return () => {
    document.removeEventListener('click', onOpen);
    document.removeEventListener('auxclick', onOpen);
  };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') mountUsageCounter({ document, window });
