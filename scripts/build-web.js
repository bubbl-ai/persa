import { mkdir, cp, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from '../src/persona.js';
import { compile } from '../src/compile.js';
import { characters, launchSelection } from '../characters/catalog.js';
import { resolveAvatarAssets } from './avatar-assets.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ids = new Set();
const catalog = [];
const imageResults = JSON.parse(await readFile(path.join(root, 'characters/image-generation.json'), 'utf8'));
const avatars = await resolveAvatarAssets(characters, imageResults, root);
for (const character of characters) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(character.id) || ids.has(character.id)) throw new Error(`Invalid or duplicate character: ${character.id}`);
  ids.add(character.id);
  if (!character.avatar.prompt || !character.avatar.preview) throw new Error(`Missing avatar for ${character.id}`);
  const avatar = { ...character.avatar, ...avatars.get(character.id) };
  const persona = normalize(character.persona, character.id);
  const { text } = compile(persona, 'muse');
  catalog.push({ ...character, avatar, persona, personalityPrompt: text });
}
for (const id of launchSelection) if (!ids.has(id)) throw new Error(`Unknown launch character: ${id}`);
// Do not keep retired previews in the published output after an asset change.
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const web = path.join(root, 'web');
await cp(web, dist, {
  recursive: true,
  filter: source => path.relative(web, source).split(path.sep)[0] !== 'avatars'
});
// Retain historical source art without publishing retired collections.
const activeImages = new Set(catalog.flatMap(character => [character.avatar.preview, character.avatar.basePreview].filter(Boolean)));
for (const preview of activeImages) {
  const relative = preview.slice(1);
  await mkdir(path.dirname(path.join(dist, relative)), { recursive: true });
  await cp(path.join(web, relative), path.join(dist, relative));
}
await mkdir(path.join(dist, 'core'), { recursive: true });
for (const name of ['compile.js', 'traits.js', 'targets.js', 'errors.js']) await cp(path.join(root, 'src', name), path.join(dist, 'core', name));
await writeFile(path.join(dist, 'catalog.json'), JSON.stringify({ characters: catalog, launchSelection }));
console.log(`Built Persa: ${catalog.length} character combos → dist/`);
