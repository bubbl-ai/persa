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

test('every shipped character keeps its named avatar prompt and resolves to a preview or explicit unavailable state', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const records = JSON.parse(await readFile(path.join(root, 'characters/image-generation.json'), 'utf8'));
  const avatars = await resolveAvatarAssets(characters, records, root);
  assert.equal(avatars.size, characters.length);
  for (const character of characters) {
    const avatar = avatars.get(character.id);
    assert.equal(Boolean(avatar.preview), avatar.previewKind !== 'unavailable', character.id);
    assert.ok(character.avatar.prompt.includes(character.name), `${character.id} must retain its named avatar prompt`);
  }
});

test('a declined original can use a matching character rendering without rewriting its history', async t => {
  const root = await fixture(t);
  const record = { ...declined, replacement: { status: 'generated', kind: 'character', subjectId: 'sample', asset: generated.asset } };
  const result = await resolveAvatarAssets([character], [record], root);
  assert.deepEqual(result.get('sample'), { preview: '/avatars/sample.png', previewKind: 'generated' });
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

test('rejects generic substitutes, failed generations, and replacements for another character', async t => {
  const root = await fixture(t);
  const replacement = { status: 'generated', kind: 'character', subjectId: 'sample', asset: generated.asset };
  await assert.rejects(resolveAvatarAssets([character], [{ ...declined, replacement: { ...replacement, kind: 'original-concept' } }], root), /Invalid replacement image/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...declined, replacement: { ...replacement, subjectId: 'someone-else' } }], root), /Invalid replacement image/);
  await assert.rejects(resolveAvatarAssets([character], [{ ...declined, replacement: { ...replacement, status: 'declined' } }], root), /Invalid replacement image/);
});

const costumed = {
  ...character,
  avatar: { ...character.avatar, designVersion: 'muse-costumes-v1', baseId: 'persa-muse-v1', basePreview: '/avatars/base.png', costume: 'a stage jacket' }
};
const costumeImage = { status: 'generated', kind: 'muse-costume', subjectId: 'sample', designVersion: 'muse-costumes-v1', baseId: 'persa-muse-v1', asset: generated.asset };
async function costumeFixture(t) {
  const root = await fixture(t);
  await writeFile(path.join(root, 'web/avatars/base.png'), png);
  return root;
}

test('the costume collection uses one shared base and keeps all 18 named wardrobes', () => {
  assert.equal(characters.length, 18);
  assert.equal(new Set(characters.map(c => c.avatar.baseId)).size, 1);
  assert.equal(new Set(characters.map(c => c.avatar.costume)).size, 18);
  for (const c of characters) {
    assert.ok(c.avatar.prompt.includes(c.avatar.costume), c.id);
    assert.ok(c.avatar.prompt.includes('Keep this same face, hood, cream color, plush material, and body proportions'), c.id);
    assert.ok(c.avatar.preview.startsWith(`/avatars/${c.avatar.designVersion}/`), c.id);
  }
});

test('a costume can replace older art while keeping its original outcome intact', async t => {
  const root = await costumeFixture(t);
  const record = { ...declined, replacement: costumeImage };
  const before = structuredClone(record);
  const result = await resolveAvatarAssets([costumed], [record], root);
  assert.deepEqual(result.get('sample'), { preview: '/avatars/sample.png', previewKind: 'generated' });
  assert.deepEqual(record, before);
});

test('unavailable costumes never fall back to a previous likeness', async t => {
  const root = await costumeFixture(t);
  for (const replacement of [undefined, { status: 'generated', kind: 'character', subjectId: 'sample', asset: generated.asset }, ...['pending', 'declined'].map(status => ({ ...costumeImage, status, asset: null }))]) {
    const result = await resolveAvatarAssets([costumed], [{ ...generated, replacement }], root);
    assert.deepEqual(result.get('sample'), { preview: null, previewKind: 'unavailable' });
  }
});

test('costume provenance must match the preset and its active base version', async t => {
  const root = await costumeFixture(t);
  for (const patch of [{ baseId: 'other-base' }, { designVersion: 'retired-version' }]) {
    await assert.rejects(resolveAvatarAssets([costumed], [{ ...generated, replacement: { ...costumeImage, ...patch } }], root), /Costume design mismatch/);
  }
  for (const patch of [{ subjectId: 'someone-else' }, { status: 'declined' }, { status: 'unknown', asset: null }]) {
    await assert.rejects(resolveAvatarAssets([costumed], [{ ...generated, replacement: { ...costumeImage, ...patch } }], root), /Invalid replacement image/);
  }
  await rm(path.join(root, 'web/avatars/base.png'));
  await assert.rejects(resolveAvatarAssets([costumed], [{ ...generated, replacement: costumeImage }], root), /ENOENT/);
});
