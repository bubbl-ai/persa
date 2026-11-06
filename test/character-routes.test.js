import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { characters } from '../characters/catalog.js';
import { createPreviewServer } from '../scripts/preview-web.js';

test('Vercel clean route allowlist covers exactly the current characters and their ID aliases', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const rule = config.rewrites.find(rule => rule.source.startsWith('/character/:slug('));
  assert.ok(rule, 'Character route must survive direct navigation and reload on Vercel');
  assert.equal(rule.destination, '/index.html');
  const slugs = rule.source.slice('/character/:slug('.length, -1).split('|');
  const expected = new Set(characters.flatMap(({ id }) => [id, id.replaceAll('-', '')]));
  assert.equal(slugs.length, expected.size);
  assert.deepEqual(new Set(slugs), expected);
});

test('preview serves every direct character URL and rejects unknown routes without swallowing asset errors', async t => {
  const directory = await mkdtemp(path.join(tmpdir(), 'persa-routes-'));
  await writeFile(path.join(directory, 'index.html'), '<!doctype html><title>Persa route test</title>');
  await writeFile(path.join(directory, 'styles.css'), 'body { color: black; }');
  const server = createPreviewServer(directory);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const { id } of characters) {
    for (const slug of new Set([id, id.replaceAll('-', '')])) {
      for (const suffix of ['', '/?utm_source=instagram']) {
        const response = await fetch(`${origin}/character/${slug}${suffix}`);
        assert.equal(response.status, 200, `Direct navigation: ${slug}${suffix}`);
        assert.match(response.headers.get('content-type'), /^text\/html/);
        assert.match(await response.text(), /Persa route test/);
      }
    }
  }
  const style = await fetch(`${origin}/styles.css`);
  assert.equal(style.status, 200);
  assert.match(style.headers.get('content-type'), /^text\/css/);
  await style.text();
  for (const pathname of ['/character/missing', '/character/missing?character=drake', '/character/lionelmessi/extra', '/character/lionel%2Fmessi', '/character/%E0%A4%A', '/missing.css', '/avatars/missing.webp']) {
    const response = await fetch(`${origin}${pathname}`);
    assert.equal(response.status, 404, pathname);
    assert.equal(await response.text(), 'Not found');
  }
});
