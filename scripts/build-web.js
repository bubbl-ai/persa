import { mkdir, cp, writeFile, access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from '../src/persona.js';
import { compile } from '../src/compile.js';
import { characters, launchSelection } from '../characters/catalog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ids = new Set();
const catalog = [];
const imageResults = JSON.parse(await readFile(path.join(root, 'characters/image-generation.json'), 'utf8'));
for (const character of characters) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(character.id) || ids.has(character.id)) throw new Error(`Invalid or duplicate character: ${character.id}`);
  ids.add(character.id);
  if (!character.avatar.prompt || !character.avatar.preview) throw new Error(`Missing avatar for ${character.id}`);
  const imageResult = imageResults.find(row => row.id === character.id);
  if (!imageResult) throw new Error(`Missing image status for ${character.id}`);
  const preview = imageResult.status === 'generated' ? character.avatar.preview : null;
  if (preview) await access(path.join(root, 'web', preview));
  const persona = normalize(character.persona, character.id);
  const { text } = compile(persona, 'muse');
  catalog.push({ ...character, avatar: { ...character.avatar, preview }, persona, personalityPrompt: text });
}
for (const id of launchSelection) if (!ids.has(id)) throw new Error(`Unknown launch character: ${id}`);
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'web'), dist, { recursive: true });
await mkdir(path.join(dist, 'core'), { recursive: true });
for (const name of ['compile.js', 'traits.js', 'targets.js', 'errors.js']) await cp(path.join(root, 'src', name), path.join(dist, 'core', name));
await writeFile(path.join(dist, 'catalog.json'), JSON.stringify({ characters: catalog, launchSelection }));
console.log(`Built Persa: ${catalog.length} character combos → dist/`);
