import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { characters } from '../characters/catalog.js';
import { compile } from '../src/compile.js';
import { buildMuseHandoff } from '../src/muse-handoff.js';

const character = id => characters.find(item => item.id === id);

test('reference handoff is limited to the three validated recipe candidates', () => {
  assert.deepEqual(characters.filter(item => buildMuseHandoff(item)).map(item => item.id).sort(), [
    'mark-zuckerberg', 'mona-lisa', 'taylor-swift'
  ]);
  for (const input of [null, undefined, {}, { id: 'unknown' }, { id: '__proto__' }, { id: 'constructor' }]) {
    assert.equal(buildMuseHandoff(input), null);
  }
});

test('the handoff contains current compiled tone settings without mutating the preset', () => {
  const preset = character('taylor-swift');
  const before = structuredClone(preset);
  const tuned = { ...preset.persona, voice: { ...preset.persona.voice, warmth: 0, humor: 100, directness: 0, verbosity: 100 } };
  const result = buildMuseHandoff(preset, tuned);
  assert.equal(result.personalityPrompt, compile(tuned, 'muse').text);
  assert.ok(result.prompt.includes(result.personalityPrompt));
  assert.notEqual(result.personalityPrompt, buildMuseHandoff(preset).personalityPrompt);
  assert.deepEqual(preset, before);
});

test('Muse URL preserves the entire message including reserved characters and Unicode', () => {
  const preset = character('mona-lisa');
  const note = 'Unicode 雪 🧸; URL characters & + # ? = %;\na second line';
  const persona = { ...preset.persona, style: { ...preset.persona.style, notes: [note] } };
  const result = buildMuseHandoff(preset, persona);
  const url = new URL(result.url);
  assert.equal(url.origin, 'https://muse.ai');
  assert.equal(url.pathname, '/');
  assert.equal(url.hash, '');
  assert.deepEqual([...url.searchParams.keys()], ['prompt']);
  assert.equal(url.searchParams.get('prompt'), result.prompt);
  assert.ok(result.prompt.includes(note));
});

test('reference URL and checksum identify the shipped base and require the actual workspace image', async () => {
  const result = buildMuseHandoff(character('mark-zuckerberg'));
  const image = await readFile(new URL('../web/avatars/muse-costumes-v1/base.png', import.meta.url));
  assert.equal(result.baseUrl, 'https://persa.bubblai.com/avatars/muse-costumes-v1/base.png');
  assert.equal(result.baseSha256, createHash('sha256').update(image).digest('hex'));
  assert.ok(result.prompt.includes(result.baseUrl));
  assert.ok(result.prompt.includes(result.baseSha256));
  assert.match(result.prompt, /Download a fresh copy[\s\S]*directly into your workspace/);
  assert.match(result.prompt, /Do not use \/tmp or any path outside your workspace/);
  assert.match(result.prompt, /pass that actual workspace image file as the reference/);
  assert.match(result.prompt, /stop the avatar step[\s\S]*instead of generating without the reference/);
});

test('handoff applies personality explicitly, preserves unrelated settings and leaves avatar selection to the user', () => {
  for (const preset of characters) {
    const result = buildMuseHandoff(preset);
    if (!result) continue;
    assert.match(result.prompt, /Replace my previous character voice, tone and emoji preferences/);
    assert.match(result.prompt, /Preserve unrelated preferences, memories, permissions and account settings/);
    assert.match(result.prompt, /Tell me which style settings you saved/);
    assert.match(result.prompt, /Keep the current avatar until I select a candidate/);
    assert.doesNotMatch(result.prompt, /Do not select or activate one, or change my name, personality or saved preferences/);
  }
});

test('chosen handoff avatar constraints match the exact preferred recorded recipes', async () => {
  const experiment = JSON.parse(await readFile(new URL('../docs/experiments/muse-prompt-engineering-2026-10-12.json', import.meta.url), 'utf8'));
  const chosen = {
    'mona-lisa': 'reference-revised-mona-lisa',
    'taylor-swift': 'reference-revised-taylor-swift',
    'mark-zuckerberg': 'reference-mark-zuckerberg'
  };
  for (const [id, recipeId] of Object.entries(chosen)) {
    const recorded = experiment.recipes.find(recipe => recipe.id === recipeId);
    assert.ok(recorded, recipeId);
    const originalConstraints = recorded.prompt.split('\n\nIf your native avatar generator')[0]
      .replace('using the attached image', 'using the downloaded image');
    const currentConstraints = buildMuseHandoff(character(id)).avatarPrompt.split('\n\nIf your native avatar generator')[0];
    assert.equal(currentConstraints, originalConstraints, id);
  }
});
