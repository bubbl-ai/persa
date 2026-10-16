import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function checkPath(asset, id) {
  if (typeof asset !== 'string' || !/^web\/avatars\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:png|webp)$/.test(asset)) {
    throw new Error(`Invalid image asset path: ${id}`);
  }
}

function validPngHeader(bytes) {
  return bytes.length >= 33 && bytes.subarray(0, 8).equals(pngSignature)
    && bytes.readUInt32BE(8) === 13 && bytes.toString('latin1', 12, 16) === 'IHDR'
    && bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(16) <= 0x7fffffff
    && bytes.readUInt32BE(20) > 0 && bytes.readUInt32BE(20) <= 0x7fffffff;
}

// Validate still-image container/header structure, not compressed pixel data.
// https://developers.google.com/speed/webp/docs/riff_container
function validWebpHeader(bytes) {
  if (bytes.length < 20 || bytes.toString('latin1', 0, 4) !== 'RIFF'
    || bytes.toString('latin1', 8, 12) !== 'WEBP'
    || bytes.readUInt32LE(4) !== bytes.length - 8) return false;
  let canvas = null;
  let image = null;
  for (let offset = 12; offset < bytes.length;) {
    if (offset + 8 > bytes.length) return false;
    const kind = bytes.toString('latin1', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    const end = start + size;
    const paddedEnd = end + (size & 1);
    if (paddedEnd > bytes.length || ((size & 1) && bytes[end] !== 0)) return false;
    if (offset === 12 && !['VP8X', 'VP8 ', 'VP8L'].includes(kind)) return false;
    if (kind === 'VP8X') {
      // Animation is outside the static avatar collection's scope.
      if (offset !== 12 || size !== 10 || (bytes[start] & 0xc3)
        || bytes.readUIntLE(start + 1, 3) !== 0) return false;
      canvas = [bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1];
      if (canvas[0] * canvas[1] > 0xffffffff) return false;
    } else if (kind === 'VP8 ') {
      if (image || size <= 10 || (bytes[start] & 1) || !(bytes[start] & 0x10)
        || ((bytes[start] >> 1) & 7) > 3
        || bytes.toString('hex', start + 3, start + 6) !== '9d012a') return false;
      const partitionSize = bytes.readUIntLE(start, 3) >> 5;
      if (!partitionSize || partitionSize > size - 10) return false;
      image = [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
      if (!image[0] || !image[1]) return false;
    } else if (kind === 'VP8L') {
      if (image || size <= 5 || bytes[start] !== 0x2f) return false;
      const bits = bytes.readUInt32LE(start + 1);
      if (bits >>> 29) return false; // Lossless bitstream version must be zero.
      image = [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    } else if (kind === 'ANIM' || kind === 'ANMF') {
      return false;
    }
    offset = paddedEnd;
  }
  return Boolean(image && (!canvas || (canvas[0] === image[0] && canvas[1] === image[1])));
}

// Keep provenance, but only ship artwork for the catalog's active design.
export async function resolveAvatarAssets(characters, records, root) {
  if (!Array.isArray(records)) throw new Error('Image records must be an array');
  const ids = new Set(characters.map(character => character.id));
  const byId = new Map();
  for (const record of records) {
    if (!ids.has(record.id)) throw new Error(`Unknown image record: ${record.id}`);
    if (byId.has(record.id)) throw new Error(`Duplicate image record: ${record.id}`);
    if (!['generated', 'declined'].includes(record.status)) throw new Error(`Invalid image status: ${record.id}`);
    if (record.status === 'declined' && record.asset !== null) throw new Error(`Declined image has an asset: ${record.id}`);
    if (record.replacement) {
      const image = record.replacement;
      const legacy = image.kind === 'character' && image.status === 'generated';
      const costume = image.kind === 'muse-costume' && ['pending', 'generated', 'declined'].includes(image.status);
      if ((!legacy && !costume) || image.subjectId !== record.id || (image.status !== 'generated' && image.asset !== null)) {
        throw new Error(`Invalid replacement image: ${record.id}`);
      }
    }
    byId.set(record.id, record);
  }

  const resolved = new Map();
  const checked = new Map();
  async function checkImage(asset, id) {
    checkPath(asset, id);
    if (checked.has(asset)) return checked.get(asset);
    const bytes = await readFile(path.join(root, asset));
    const png = asset.endsWith('.png');
    if (!(png ? validPngHeader(bytes) : validWebpHeader(bytes))) {
      throw new Error(`Invalid ${png ? 'PNG' : 'WebP'} image: ${id}`);
    }
    const hash = createHash('sha256').update(bytes).digest('hex');
    checked.set(asset, hash);
    return hash;
  }
  for (const character of characters) {
    const record = byId.get(character.id);
    if (!record) throw new Error(`Missing image status: ${character.id}`);
    const image = record.replacement || record;
    if (character.avatar.designVersion) {
      if (!character.avatar.baseId || !character.avatar.basePreview || !character.avatar.costume) throw new Error(`Missing costume design: ${character.id}`);
      await checkImage(`web${character.avatar.basePreview}`, `${character.id} base`);
      // A previous likeness must not silently fill a missing costume preview.
      if (image.kind !== 'muse-costume') {
        resolved.set(character.id, { preview: null, previewKind: 'unavailable' });
        continue;
      }
      if (image.baseId !== character.avatar.baseId || image.designVersion !== character.avatar.designVersion) {
        throw new Error(`Costume design mismatch: ${character.id}`);
      }
    } else if (image.kind === 'muse-costume') {
      throw new Error(`Costume design mismatch: ${character.id}`);
    }
    if (image.status !== 'generated') {
      resolved.set(character.id, { preview: null, previewKind: 'unavailable' });
      continue;
    }
    checkPath(image.asset, character.id);
    if (character.avatar.preview !== image.asset.slice(3)) throw new Error(`Image preview mismatch: ${character.id}`);
    const actualHash = await checkImage(image.asset, character.id);
    if (character.avatar.previewSource === 'native-muse'
      && image.nativeGeneration?.outputSha256 !== actualHash) {
      throw new Error(`Selected native image hash mismatch: ${character.id}`);
    }
    resolved.set(character.id, { preview: character.avatar.preview, previewKind: 'generated' });
  }
  return resolved;
}
