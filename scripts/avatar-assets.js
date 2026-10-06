import { readFile } from 'node:fs/promises';
import path from 'node:path';

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function checkPath(asset, id) {
  if (typeof asset !== 'string' || !/^web\/avatars\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.png$/.test(asset)) {
    throw new Error(`Invalid image asset path: ${id}`);
  }
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
  const checked = new Set();
  async function checkImage(asset, id) {
    checkPath(asset, id);
    if (checked.has(asset)) return;
    const bytes = await readFile(path.join(root, asset));
    if (bytes.length < 24 || !bytes.subarray(0, 8).equals(pngSignature) || bytes.toString('ascii', 12, 16) !== 'IHDR' || !bytes.readUInt32BE(16) || !bytes.readUInt32BE(20)) {
      throw new Error(`Invalid PNG image: ${id}`);
    }
    checked.add(asset);
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
    await checkImage(image.asset, character.id);
    resolved.set(character.id, { preview: character.avatar.preview, previewKind: 'generated' });
  }
  return resolved;
}
