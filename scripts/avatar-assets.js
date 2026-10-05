import { readFile } from 'node:fs/promises';
import path from 'node:path';

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// Generation history is not availability: an original request may be declined
// while a separately documented concept supplies the current preview.
export async function resolveAvatarAssets(characters, records, root) {
  if (!Array.isArray(records)) throw new Error('Image records must be an array');
  const ids = new Set(characters.map(character => character.id));
  const byId = new Map();
  for (const record of records) {
    if (!ids.has(record.id)) throw new Error(`Unknown image record: ${record.id}`);
    if (byId.has(record.id)) throw new Error(`Duplicate image record: ${record.id}`);
    if (!['generated', 'declined'].includes(record.status)) throw new Error(`Invalid image status: ${record.id}`);
    if (record.status === 'declined' && record.asset !== null) throw new Error(`Declined image has an asset: ${record.id}`);
    if (record.replacement && (record.replacement.status !== 'generated' || record.replacement.kind !== 'original-concept')) {
      throw new Error(`Invalid replacement image: ${record.id}`);
    }
    byId.set(record.id, record);
  }

  const resolved = new Map();
  for (const character of characters) {
    const record = byId.get(character.id);
    if (!record) throw new Error(`Missing image status: ${character.id}`);
    const image = record.replacement || record;
    if (image.status !== 'generated') {
      resolved.set(character.id, { preview: null, previewKind: 'unavailable' });
      continue;
    }
    if (typeof image.asset !== 'string' || !/^web\/avatars\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.png$/.test(image.asset)) {
      throw new Error(`Invalid image asset path: ${character.id}`);
    }
    if (character.avatar.preview !== image.asset.slice(3)) throw new Error(`Image preview mismatch: ${character.id}`);
    if (record.replacement && !character.avatar.conceptName) throw new Error(`Missing concept label: ${character.id}`);
    const bytes = await readFile(path.join(root, image.asset));
    if (bytes.length < 24 || !bytes.subarray(0, 8).equals(pngSignature) || bytes.toString('ascii', 12, 16) !== 'IHDR' || !bytes.readUInt32BE(16) || !bytes.readUInt32BE(20)) {
      throw new Error(`Invalid PNG image: ${character.id}`);
    }
    resolved.set(character.id, { preview: character.avatar.preview, previewKind: record.replacement ? 'concept' : 'generated' });
  }
  return resolved;
}
