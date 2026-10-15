import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { characters } from '../characters/catalog.js';
import { compile } from '../src/compile.js';
import { buildMuseHandoff } from '../src/muse-handoff.js';

const character = id => characters.find(item => item.id === id);

test('reference handoff covers every catalog character and rejects unknown IDs', () => {
  assert.equal(characters.length, 18);
  assert.equal(characters.filter(item => buildMuseHandoff(item)).length, characters.length);
  const copiedCostume = character('barbie').avatar;
  for (const input of [null, undefined, {}, { id: 'unknown' }, { id: '__proto__' }, { id: 'constructor' }, { ...character('barbie'), id: 'unknown', avatar: copiedCostume }]) {
    assert.equal(buildMuseHandoff(input), null);
  }
});

test('expanded handoffs use each authored costume with the shared base, never another mascot', () => {
  const original = new Set(['mark-zuckerberg', 'mona-lisa', 'taylor-swift']);
  const recipes = new Set();
  for (const preset of characters) {
    const result = buildMuseHandoff(preset);
    assert.equal(result.characterId, preset.id);
    assert.ok(result.prompt.includes(preset.name));
    assert.equal(new URL(result.url).searchParams.get('prompt'), result.prompt, preset.id);
    assert.equal(result.personalityPrompt, compile(preset.persona, 'muse').text, preset.id);
    assert.ok(result.prompt.includes(result.personalityPrompt));
    assert.match(result.avatarPrompt, /Dress that exact cream plush toy/);
    assert.match(result.avatarPrompt, /Preserve the source face outline/);
    assert.match(result.avatarPrompt, /no hair|Do not add hair/);
    if (!original.has(preset.id)) {
      assert.equal(result.version, 'muse-reference-wardrobe-v2');
      assert.ok(result.avatarPrompt.includes(preset.avatar.costume), preset.id);
      assert.match(result.avatarPrompt, /never replace the base with a human, animal or another mascot/);
      assert.match(result.avatarPrompt, /gloves, change only the mitten covering/);
      assert.match(result.avatarPrompt, /glasses have clear lenses/);
      assert.match(result.prompt, /re-read your saved identity\/vibe/);
      assert.match(result.prompt, /Changing only the name while leaving a previous character's vibe is not sufficient/);
      assert.match(result.prompt, /Check again after your final edit/);
    }
    recipes.add(result.avatarPrompt);
  }
  assert.equal(recipes.size, characters.length);
});

test('a catalog recipe with missing costume data cannot create an incomplete handoff', () => {
  for (const costume of [undefined, null, '', '  ', 12]) {
    assert.equal(buildMuseHandoff({ ...character('barbie'), avatar: { costume } }), null);
  }
  assert.equal(buildMuseHandoff({ ...character('barbie'), avatar: undefined }), null);
});

test('the handoff contains current compiled tone settings without mutating the preset', () => {
  for (const preset of characters) {
    const before = structuredClone(preset);
    const tuned = { ...preset.persona, voice: { ...preset.persona.voice, warmth: 0, humor: 100, directness: 0, verbosity: 100 } };
    const result = buildMuseHandoff(preset, tuned);
    assert.equal(result.personalityPrompt, compile(tuned, 'muse').text, preset.id);
    assert.ok(result.prompt.includes(result.personalityPrompt));
    assert.notEqual(result.personalityPrompt, buildMuseHandoff(preset).personalityPrompt, preset.id);
    assert.deepEqual(preset, before);
  }
});

test('Barbie and SpongeBob replace old no-emoji settings with their sparing preference', () => {
  for (const id of ['barbie', 'spongebob']) {
    const preset = character(id);
    const result = buildMuseHandoff(preset);
    assert.match(result.prompt, /permission to use emoji sparingly \(replace any previous no-emoji preference\)/);
    assert.doesNotMatch(result.prompt, /including its explicit no-emoji setting/);
    const tuned = { ...preset.persona, style: { ...preset.persona.style, emoji: 'never' } };
    const tunedResult = buildMuseHandoff(preset, tuned);
    assert.match(tunedResult.prompt, /including its explicit no-emoji setting/);
    assert.doesNotMatch(tunedResult.prompt, /permission to use emoji sparingly/);
  }
  const tuned = { ...character('mona-lisa').persona, style: { emoji: 'sparing' } };
  assert.match(buildMuseHandoff(character('mona-lisa'), tuned).prompt, /permission to use emoji sparingly/);
});

test('the three previously validated default payloads remain byte-for-byte unchanged', () => {
  const recordedHashes = {
    'mona-lisa': '76ead19bfe3164fd696ba7126f1b96393a0ac9ef27ea1dab6352a6fb8c2554bf',
    'taylor-swift': 'd638bed9556d3a94929e740c677f90a931d53e65a5ab2536794e214ffc84bad4',
    'mark-zuckerberg': 'bfc53b4286bd5f5fa25415386c776da7406c0f634125a192f205bb90cfafa5c8'
  };
  for (const [id, hash] of Object.entries(recordedHashes)) {
    const result = buildMuseHandoff(character(id));
    assert.equal(result.version, 'muse-reference-handoff-v1');
    assert.equal(createHash('sha256').update(result.prompt).digest('hex'), hash, id);
  }
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
  const image = await readFile(new URL('../web/avatars/muse-costumes-v1/base.png', import.meta.url));
  for (const preset of characters) {
    const result = buildMuseHandoff(preset);
    assert.equal(result.baseUrl, 'https://persa.bubblai.com/avatars/muse-costumes-v1/base.png');
    assert.equal(result.baseSha256, createHash('sha256').update(image).digest('hex'));
    assert.ok(result.prompt.includes(result.baseUrl));
    assert.ok(result.prompt.includes(result.baseSha256));
    assert.match(result.prompt, /Download a fresh copy[\s\S]*directly into your workspace/);
    assert.match(result.prompt, /Do not use \/tmp or any path outside your workspace/);
    assert.match(result.prompt, /pass that actual workspace image file as the reference/);
    assert.match(result.prompt, /stop the avatar step[\s\S]*instead of generating without the reference/);
  }
});

test('handoff applies personality explicitly, preserves unrelated settings and leaves avatar selection to the user', () => {
  for (const preset of characters) {
    const result = buildMuseHandoff(preset);
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
