# Shared usage counter

Persa's homepage reports how many anonymous browser IDs have clicked a prepared
**Open in Muse** link since tracking began. It does not report people, historical
visitors, completed native Muse setup, or selected avatars. Different browsers
and clearing site storage can count the same person again. Blocked storage,
failed requests, copied prompts, and downloaded HTML cards are not counted.
The explanatory text beside the total makes these limits accessible.

## Collection and display

- `web/usage-counter.js` listens for trusted left/keyboard and middle clicks on
  valid prepared Muse links, including the spotlight, grid and dialogs on both
  main entry pages. It leaves native link navigation untouched and sends a small
  `keepalive` request. Pure page loads and repeated opens do not add usage.
- `persa.usage.browser-id.v1` stores a random UUID in this browser. It is created
  on the first qualifying open, not on a page view. A second local key records
  the successfully acknowledged ID so later opens avoid redundant writes.
- `/api/usage` accepts only a UUID from the canonical same-origin JSON request.
  It stores only the UUID's SHA-256 hash in a private Blob pathname, with the
  constant body `1`. It does not save IP addresses, prompts, character choices,
  account information or names. Server/platform access logs are separate.
- This is an anonymous browser metric, not an abuse-resistant identity count.
  The API rejects ordinary cross-origin browser submissions, but cannot prove
  that every newly supplied UUID belongs to a different person or device.
- `GET /api/usage` returns the confirmed total. Successful responses are cached
  at the CDN for 60 seconds; POST responses and errors are never cached. A
  successful write does not optimistically increment the visible total. Empty
  storage legitimately returns zero; missing or failing storage returns 503
  and hides the counter rather than inventing a total.

## Durable storage and deployment

The endpoint is a Vercel Node function in `api/usage.js`, backed by
`server/usage-counter.js` and the pinned `@vercel/blob` SDK. The project's existing
static build and character routes remain in place. Source uploads include `api/`
and `server/`; the existing prebuilt Vercel deployment bundles the function.

The [storage workflow](../.github/workflows/usage-storage.yml) connects a dedicated private Blob store to the production Persa project. The [initial provisioning run](https://github.com/bubbl-ai/persa/actions/runs/45847794443) succeeded on November 26, 2026. Its `BLOB_READ_WRITE_TOKEN` stays in Vercel environment variables;
never copy it into browser source, the repository, logs or this document. The
adapter is disabled unless `VERCEL_ENV=production` and that token is present.
There is no in-memory fallback, seeded baseline, or database auto-provisioning in
the request handler. Provisioning and live verification must be recorded
separately; source code alone does not establish a working deployed counter.

Each browser has one immutable marker at
`persa-usage/v1/muse-open/<sha256>.json`. Fixed paths, no random suffix, and disabled
overwriting make concurrent requests and retries idempotent. If an upload fails,
the adapter accepts it only after `head` confirms that exact marker already
exists. It lists all pages of that prefix for reads and counts only valid marker
paths; unrelated objects and diagnostic probes do not enter the total. No marker
expires, so the total survives redeployment and cold starts. Do not delete the
store or its markers during deploys. Listing cost grows with recorded browser
IDs; CDN caching reduces reads, and writes never list the collection. At larger
scale, move the same metric to a purpose-built durable counter with a migration
that preserves deduplication.

The SDK's CLI configuration dependency pins an older Zod release. A scoped npm
override uses patched Zod 4.6.7 for that dependency without updating the existing
CLI/library dependencies.

## Verification

`node --test test/usage-counter.test.js` covers concurrency, retries, restoration
through a fresh handler, multipage listing, marker filtering, missing storage,
failed uploads, incomplete reads, input/origin validation, cached reads versus
uncached writes, stable browser IDs, storage denial, confirmed-only rendering,
non-blocking sends, repeat opens, and synthetic/automated visit exclusion.

The local preview always serves an unavailable counter, even if production
credentials are accidentally present. Browser QA should intercept `/api/usage`
with an isolated response, for example
`{"available":true,"metric":"unique-browser-muse-opens","count":123}`,
and check both visible and hidden states at desktop and mobile widths. Automated
browsers (`navigator.webdriver`), synthetic clicks (`isTrusted=false`), and
noncanonical origins do not send production usage. Block marketing requests
during local browser checks as usual. Do not add a fake browser to the production
metric just to prove POST works; storage permission checks use a separate probe
prefix, then remove the probe. Confirm production GET separately after deploying.

The implementation follows the official [Vercel Blob SDK reference](https://vercel.com/docs/vercel-blob/using-blob-sdk),
[private storage contract](https://vercel.com/docs/vercel-blob/private-storage),
and [Node function deployment](https://vercel.com/docs/functions/runtimes/node-js).

## November 26 production verification

The first release served the new character pages, but the usage endpoint returned
404. The Vercel CLI skipped the API directory while discovering functions. The
corrected source allowlist includes both each directory and its contents. The
deployment now checks for the bundled usage function before publishing.

The [corrected deployment](https://github.com/bubbl-ai/persa/actions/runs/45848360110)
and [CI checks](https://github.com/bubbl-ai/persa/actions/runs/45848360235)
passed. In production the counter returned HTTP 200 with a measured total of
zero, displayed that value at 320px, and rejected an invalid browser ID without
writing. Concurrent writes, retries, and duplicate suppression were exercised
against an isolated test store. Production verification added no usage markers.
