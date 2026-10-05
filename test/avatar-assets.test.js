import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAvatarAssets } from '../scripts/avatar-assets.js';
import { characters } from '../characters/catalog.js';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6XcAAAAASUVORK5CYII=', 'base64');
const character = { id: 'sample', avatar: { preview: '/avatars/sample.png' } };
const generated = { id: 'sample', status: 'generated', asset: 'web/avatars/sample.png' };
const declined = { id: 'sample', status: 'declined', asset: null, failure: 'Original request declined' };

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'persa-avatar-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'web/avatars'), { recursive: true });
  await writeFile(path.join(root, generated.asset), png);
  return root;
}

test('every shipped character resolves to an existing preview or explicit unavailable state', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const records = JSON.parse(await readFile(path.join(root, 'characters/image-generation.json'), 'utf8'));
  const avatars = await resolveAvatarAssets(characters, records, root);
  assert.equal(avatars.size, characters.length);
  for (const [id, avatar] of avatars) {
    assert.equal(Boolean(avatar.preview), avatar.previewKind !== 'unavailable', id);
  }
});

test('a declined original can use a documented concept without rewriting its history', async t => {
  const root = await fixture(t);
  const record = { ...declined, replacement: { status: 'generated', kind: 'original-concept', asset: generated.asset } };
  const concept = { ...character, avatar: { ...character.avatar, conceptName: 'Original companion' } };
  const result = await resolveAvatarAssets([concept], [record], root);
  assert.deepEqual(result.get('sample'), { preview: '/avatars/sample.png', previewKind: 'concept' });
  assert.equal(record.status, 'declined');
  assert.equal(record.asset, null);
  assert.equal(record.failure, declined.failure);
});

test('a declined original without replacement remains explicitly unavailable', async t => {
  const result = await resolveAvatarAssets([character], [declined], await fixture(t));
  assert.deepEqual(result.get('sample'), { preview: null, previewKind: 'unavailable' });
});

test('rejects incomplete or ambiguous image manifests', async t => {
  const root = await fixture(t);
  await assert.rejects(resolveAvatarAssets([character], [], root), /Missing image status/);
  await assert.rejects(resolveAvatarAssets([character], [generated, generated], root), /Duplicate image record/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...generated, id: 'unknown' }], root), /Unknown image record/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...generated, status: 'typo' }], root), /Invalid image status/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...declined, asset: generated.asset }], root), /Declined image has an asset/);
});

test('rejects unsafe and mismatched image references', async t => {
  const root = await fixture(t);
  await assert.rejects(resolveAvatarAssets([character], [{ ...generated, asset: 'web/avatars/../../secret.png' }], root), /Invalid image asset path/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...generated, asset: 'web/avatars/wrong.png' }], root), /Image preview mismatch/);
});

test('rejects generated previews with missing or invalid PNG files', async t => {
  const root = await fixture(t);
  await rm(path.join(root, generated.asset));
  await assert.rejects(resolveAvatarAssets([character], [generated], root), /ENOENT/);
  await writeFile(path.join(root, generated.asset), '<html>not an image</html>');
  await assert.rejects(resolveAvatarAssets([character], [generated], root), /Invalid PNG image/);
});

test('rejects replacements that are not generated concepts or lack a visible label', async t => {
  const root = await fixture(t);
  const replacement = { status: 'generated', kind: 'original-concept', asset: generated.asset };
  await assert.rejects(resolveAvatarAssets([character], [{ ...declined, replacement }], root), /Missing concept label/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...declined, replacement: { ...replacement, status: 'declined' } }], root), /Invalid replacement image/);
});
