import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { resolveAvatarAssets } from '../scripts/avatar-assets.js';
import { characters } from '../characters/catalog.js';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6XcAAAAASUVORK5CYII=', 'base64');
// Complete 2x3 color-image fixtures, encoded once with libwebp via Pillow.
const webps = {
  vp8: Buffer.from('UklGRjQAAABXRUJQVlA4ICgAAACQAQCdASoCAAMAAUAmJZACdLoAA5gA/ueL/9wZn1djh+6Ni62icAAA', 'base64'),
  vp8l: Buffer.from('UklGRh4AAABXRUJQVlA4TBEAAAAvAYAAAAdQvEIVtP+BiOh/AAA=', 'base64'),
  extendedVp8: Buffer.from('UklGRlIAAABXRUJQVlA4WAoAAAAEAAAAAQAAAgAAVlA4ICgAAACQAQCdASoCAAMAAUAmJZACdLoAA5gA/ueL/9wZn1djh+6Ni62icAAAWE1QIAQAAAB0ZXN0', 'base64'),
  extendedVp8l: Buffer.from('UklGRjwAAABXRUJQVlA4WAoAAAAEAAAAAQAAAgAAVlA4TBEAAAAvAYAAAAdQvEIVtP+BiOh/AABYTVAgBAAAAHRlc3Q=', 'base64')
};
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

test('accepts native WebP still images without converting their bytes', async t => {
  const root = await fixture(t);
  const preset = { ...character, avatar: { preview: '/avatars/sample.webp' } };
  const record = { ...generated, asset: 'web/avatars/sample.webp' };
  for (const [encoding, bytes] of Object.entries(webps)) {
    await writeFile(path.join(root, record.asset), bytes);
    const result = await resolveAvatarAssets([preset], [record], root);
    assert.deepEqual(result.get('sample'), { preview: '/avatars/sample.webp', previewKind: 'generated' }, encoding);
    assert.deepEqual(await readFile(path.join(root, record.asset)), bytes, encoding);
  }
});

test('a curated native preview must match its selected output bytes', async t => {
  const root = await fixture(t);
  const preset = { ...character, avatar: { preview: '/avatars/sample.webp', previewSource: 'native-muse' } };
  const record = { ...generated, asset: 'web/avatars/sample.webp', nativeGeneration: {
    outputSha256: createHash('sha256').update(webps.vp8).digest('hex')
  } };
  await writeFile(path.join(root, record.asset), webps.vp8);
  assert.equal((await resolveAvatarAssets([preset], [record], root)).get('sample').previewKind, 'generated');
  await assert.rejects(resolveAvatarAssets([preset], [{ ...record, nativeGeneration: undefined }], root), /Selected native image hash mismatch/);
  // Another valid image must not silently replace the reviewed option.
  await writeFile(path.join(root, record.asset), webps.vp8l);
  await assert.rejects(resolveAvatarAssets([preset], [record], root), /Selected native image hash mismatch/);
});

test('rejects missing WebP files and content disguised by another supported extension', async t => {
  const root = await fixture(t);
  const preset = { ...character, avatar: { preview: '/avatars/sample.webp' } };
  const record = { ...generated, asset: 'web/avatars/sample.webp' };
  await assert.rejects(resolveAvatarAssets([preset], [record], root), /ENOENT/);
  await writeFile(path.join(root, record.asset), png);
  await assert.rejects(resolveAvatarAssets([preset], [record], root), /Invalid WebP image/);
  await writeFile(path.join(root, generated.asset), webps.vp8);
  await assert.rejects(resolveAvatarAssets([character], [generated], root), /Invalid PNG image/);
  for (const asset of ['web/avatars/../sample.webp', 'web/avatars/sample.jpg', 'web/avatars/sample.webp.png/other.webp']) {
    await assert.rejects(resolveAvatarAssets([preset], [{ ...record, asset }], root), /Invalid image asset path/);
  }
});

test('rejects malformed WebP containers, frame headers and conflicting dimensions', async t => {
  const root = await fixture(t);
  const preset = { ...character, avatar: { preview: '/avatars/sample.webp' } };
  const record = { ...generated, asset: 'web/avatars/sample.webp' };
  const changed = (source, mutate) => { const bytes = Buffer.from(source); mutate(bytes); return bytes; };
  const truncated = source => changed(source.subarray(0, source.length - 2), bytes => bytes.writeUInt32LE(bytes.length - 8, 4));
  const headerOnly = changed(webps.extendedVp8.subarray(0, 30), bytes => bytes.writeUInt32LE(bytes.length - 8, 4));
  const duplicateFrame = Buffer.concat([webps.vp8, webps.vp8.subarray(12)]);
  duplicateFrame.writeUInt32LE(duplicateFrame.length - 8, 4);
  const invalid = [
    ['non-image bytes', Buffer.from('<html>not a WebP</html>')],
    ['short header', webps.vp8.subarray(0, 19)],
    ['wrong RIFF signature', changed(webps.vp8, bytes => { bytes[0] = 0; })],
    ['high-bit RIFF lookalike', changed(webps.vp8, bytes => { bytes[0] |= 0x80; })],
    ['wrong WEBP signature', changed(webps.vp8, bytes => { bytes[8] = 0; })],
    ['incorrect RIFF length', changed(webps.vp8, bytes => bytes.writeUInt32LE(0, 4))],
    ['truncated image chunk', truncated(webps.vp8)],
    ['oversized chunk', changed(webps.vp8, bytes => bytes.writeUInt32LE(0xffffffff, 16))],
    ['missing image after canvas', headerOnly],
    ['duplicate frame', duplicateFrame],
    ['nonzero odd-chunk padding', changed(webps.vp8l, bytes => { bytes[bytes.length - 1] = 1; })],
    ['VP8 frame signature', changed(webps.vp8, bytes => { bytes[23] = 0; })],
    ['VP8 non-key frame', changed(webps.vp8, bytes => { bytes[20] |= 1; })],
    ['VP8 zero width', changed(webps.vp8, bytes => bytes.writeUInt16LE(0, 26))],
    ['VP8 zero height', changed(webps.vp8, bytes => bytes.writeUInt16LE(0, 28))],
    ['VP8 missing partition', changed(webps.vp8, bytes => bytes.writeUIntLE(0x10, 20, 3))],
    ['VP8 partition exceeds chunk', changed(webps.vp8, bytes => bytes.writeUIntLE(0xfffff0, 20, 3))],
    ['VP8L signature', changed(webps.vp8l, bytes => { bytes[20] = 0; })],
    ['VP8L unsupported version', changed(webps.vp8l, bytes => { bytes[24] |= 0xe0; })],
    ['VP8X short canvas header', changed(webps.extendedVp8, bytes => bytes.writeUInt32LE(8, 16))],
    ['VP8X reserved bits', changed(webps.extendedVp8, bytes => { bytes[21] = 1; })],
    ['VP8X conflicting width', changed(webps.extendedVp8, bytes => bytes.writeUIntLE(3, 24, 3))],
    ['VP8X conflicting height', changed(webps.extendedVp8l, bytes => bytes.writeUIntLE(4, 27, 3))],
    ['VP8X overflowing canvas area', changed(webps.extendedVp8, bytes => bytes.fill(0xff, 24, 30))],
    ['animation outside still-image scope', changed(webps.extendedVp8, bytes => { bytes[20] |= 2; })]
  ];
  for (const [label, bytes] of invalid) {
    await writeFile(path.join(root, record.asset), bytes);
    await assert.rejects(resolveAvatarAssets([preset], [record], root), /Invalid WebP image/, label);
  }
});

test('rejects truncated PNG headers and invalid IHDR dimensions', async t => {
  const root = await fixture(t);
  const invalid = [png.subarray(0, 24), png.subarray(0, 32)];
  for (const [offset, value] of [[8, 12], [16, 0], [20, 0], [16, 0x80000000]]) {
    const bytes = Buffer.from(png);
    bytes.writeUInt32BE(value, offset);
    invalid.push(bytes);
  }
  for (const bytes of invalid) {
    await writeFile(path.join(root, generated.asset), bytes);
    await assert.rejects(resolveAvatarAssets([character], [generated], root), /Invalid PNG image/);
  }
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
