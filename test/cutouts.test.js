import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { characters } from '../characters/catalog.js';
import { cutoutFor } from '../web/cutouts.js';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../web');

// VP8X header: flags at byte 20 (0x10 = alpha), canvas width/height minus one at 24 and 27.
function webpCanvas(bytes) {
  assert.equal(bytes.toString('latin1', 0, 4), 'RIFF');
  assert.equal(bytes.toString('latin1', 8, 16), 'WEBPVP8X');
  return { alpha: Boolean(bytes[20] & 0x10), width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 };
}

test('every listed homepage cut-out is a transparent 1000x1000 WebP of a catalog character', async () => {
  const listed = characters.filter(character => cutoutFor(character));
  assert.ok(listed.length > 0);
  for (const character of listed) {
    assert.equal(cutoutFor(character), `/cutouts/${character.id}.webp`);
    // A cut-out is derived from the preview; a character without artwork has nothing to cut.
    assert.ok(character.avatar.preview, character.id);
    const canvas = webpCanvas(await readFile(path.join(web, 'cutouts', `${character.id}.webp`)));
    assert.deepEqual(canvas, { alpha: true, width: 1000, height: 1000 }, character.id);
  }
  const files = (await readdir(path.join(web, 'cutouts'))).filter(name => !name.startsWith('.')).sort();
  assert.deepEqual(files, listed.map(character => `${character.id}.webp`).sort());
});

test('a character without a cut-out keeps its original picture', () => {
  assert.equal(cutoutFor({ id: 'not-a-character' }), null);
  assert.equal(cutoutFor(null), null);
});
