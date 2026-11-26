import { createHash } from 'node:crypto';
import { put, list, head } from '@vercel/blob';

const browserIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const metric = 'unique-browser-muse-opens';
export const usageMarkerPrefix = 'persa-usage/v1/muse-open/';
const markerPattern = /^persa-usage\/v1\/muse-open\/[0-9a-f]{64}\.json$/;

// Each browser ID owns one immutable private marker. Retries and simultaneous
// requests use the same pathname; no read/modify/write total can lose updates.
export function createBlobUsageStore(env = process.env, blob = { put, list, head }) {
  if (!env.BLOB_READ_WRITE_TOKEN || env.VERCEL_ENV !== 'production') return null;
  const token = env.BLOB_READ_WRITE_TOKEN;
  return {
    async count() {
      const paths = new Set();
      const cursors = new Set();
      let cursor;
      do {
        const page = await blob.list({ token, prefix: usageMarkerPrefix, limit: 1000, ...(cursor ? { cursor } : {}), abortSignal: AbortSignal.timeout(8000) });
        if (!Array.isArray(page.blobs) || typeof page.hasMore !== 'boolean') throw new Error('Invalid usage listing');
        for (const item of page.blobs) if (markerPattern.test(item.pathname)) paths.add(item.pathname);
        if (!page.hasMore) return paths.size;
        if (!page.cursor || cursors.has(page.cursor)) throw new Error('Incomplete usage listing');
        cursor = page.cursor;
        cursors.add(cursor);
      } while (cursor);
    },
    async record(browserId) {
      const hash = createHash('sha256').update(browserId.toLowerCase()).digest('hex');
      const pathname = `${usageMarkerPrefix}${hash}.json`;
      try {
        await blob.put(pathname, '1', { token, access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json', abortSignal: AbortSignal.timeout(8000) });
      } catch (error) {
        // The SDK has no dedicated already-exists error. Confirm the exact
        // marker, including after a concurrent write or a lost upload response.
        const existing = await blob.head(pathname, { token, abortSignal: AbortSignal.timeout(4000) });
        if (existing.pathname !== pathname) throw error;
      }
    }
  };
}

export function createUsageHandler({ store, allowedOrigin = 'https://persa.bubblai.com' } = {}) {
  return async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const respond = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
    if (!['GET', 'POST'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST');
      return respond(405, { available: false });
    }
    let browserId;
    if (req.method === 'POST') {
      if (req.headers.origin !== allowedOrigin || (req.headers['sec-fetch-site'] && req.headers['sec-fetch-site'] !== 'same-origin')) return respond(403, { available: false });
      if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') return respond(415, { available: false });
      if (Number(req.headers['content-length']) > 128) return respond(400, { available: false });
      let body = req.body;
      if (typeof body === 'string') {
        if (Buffer.byteLength(body) > 128) return respond(400, { available: false });
        try { body = JSON.parse(body); } catch { return respond(400, { available: false }); }
      }
      if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length !== 1 || typeof body.browserId !== 'string' || !browserIdPattern.test(body.browserId)) return respond(400, { available: false });
      browserId = body.browserId;
    }
    const storage = store === undefined ? createBlobUsageStore() : store;
    if (!storage) return respond(503, { available: false });
    try {
      if (req.method === 'POST') {
        await storage.record(browserId);
        // Writes never list every marker or invent an optimistic new total.
        return respond(200, { available: true, metric, recorded: true });
      }
      const count = await storage.count();
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid usage total');
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
      return respond(200, { available: true, metric, count });
    } catch {
      // Do not expose store errors, identifiers, credentials, or a guessed total.
      return respond(503, { available: false });
    }
  };
}
