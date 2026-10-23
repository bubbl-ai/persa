import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { characters } from '../characters/catalog.js';
import { compile } from '../src/compile.js';
import { buildMuseHandoff, buildWardrobeAvatarPrompt } from '../src/muse-handoff.js';
import { buildWigAvatarPrompt, wigStyles } from '../src/muse-wigs.js';
import { buildCostumeAvatarPrompt, costumeStyles } from '../src/muse-costume-recipes.js';

const character = id => characters.find(item => item.id === id);

test('reference handoff covers every catalog character and rejects unknown IDs', () => {
  assert.equal(characters.length, 18);
  assert.equal(characters.filter(item => buildMuseHandoff(item)).length, characters.length);
  const copiedCostume = character('barbie').avatar;
  for (const input of [null, undefined, {}, { id: 'unknown' }, { id: '__proto__' }, { id: 'constructor' }, { ...character('barbie'), id: 'unknown', avatar: copiedCostume }]) {
    assert.equal(buildMuseHandoff(input), null);
  }
});

test('the roster uses 12 wig recipes, three costume recipes and three hairless wardrobe recipes', () => {
  const recipes = new Set();
  let wigs = 0, costumes = 0, retained = 0;
  for (const preset of characters) {
    const result = buildMuseHandoff(preset);
    assert.equal(result.characterId, preset.id);
    assert.ok(result.prompt.includes(preset.name));
    assert.equal(new URL(result.url).searchParams.get('prompt'), result.prompt, preset.id);
    assert.equal(result.personalityPrompt, compile(preset.persona, 'muse').text, preset.id);
    assert.ok(result.prompt.includes(result.personalityPrompt));
    if (Object.hasOwn(wigStyles, preset.id)) {
      wigs++;
      assert.equal(result.version, 'muse-reference-wig-v3');
      assert.equal(result.avatarPrompt, buildWigAvatarPrompt(preset.id));
      assert.ok(result.avatarPrompt.includes(wigStyles[preset.id].costume), preset.id);
      assert.ok(result.avatarPrompt.includes(wigStyles[preset.id].hair), preset.id);
      assert.doesNotMatch(result.avatarPrompt, /no hair|Do not add hair|Do not add human hair/i);
    } else if (Object.hasOwn(costumeStyles, preset.id)) {
      costumes++;
      assert.equal(result.version, 'muse-reference-costume-v4');
      assert.equal(result.avatarPrompt, buildCostumeAvatarPrompt(preset.id));
      assert.ok(result.avatarPrompt.includes(costumeStyles[preset.id].costume), preset.id);
      assert.match(result.avatarPrompt, /Keep the entire head hairless/);
      assert.match(result.avatarPrompt, /Do not add hair, a wig, a human scalp, facial hair/);
      assert.match(result.avatarPrompt, /Recognition comes only from the specified clothing, headwear and props/);
    } else {
      retained++;
      assert.equal(result.version, preset.id === 'the-rock' ? 'muse-reference-wardrobe-v5' : 'muse-reference-wardrobe-v2');
      assert.match(result.avatarPrompt, /Dress that exact cream plush toy/);
      assert.match(result.avatarPrompt, /Preserve the source face outline/);
      assert.match(result.avatarPrompt, /Do not add hair/);
      assert.ok(result.avatarPrompt.includes(preset.avatar.costume), preset.id);
      assert.match(result.avatarPrompt, /never replace the base with a human, animal or another mascot/);
      assert.match(result.avatarPrompt, /gloves, change only the mitten covering/);
      assert.match(result.avatarPrompt, /glasses have clear lenses/);
    }
    assert.match(result.prompt, /re-read your saved identity\/vibe/);
    assert.match(result.prompt, /Changing only the name while leaving a previous character's vibe is not sufficient/);
    assert.match(result.prompt, /Check again after your final edit/);
    recipes.add(result.avatarPrompt);
  }
  assert.equal(recipes.size, characters.length);
  assert.equal(wigs, 12);
  assert.equal(costumes, 3);
  assert.equal(retained, 3);
});

test('a catalog recipe with missing costume data cannot create an incomplete handoff', () => {
  for (const costume of [undefined, null, '', '  ', 12]) {
    assert.equal(buildMuseHandoff({ ...character('the-rock'), avatar: { costume } }), null);
  }
  assert.equal(buildMuseHandoff({ ...character('the-rock'), avatar: undefined }), null);
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

test('the 17 handoffs unrelated to the Rock wardrobe update retain their exact payloads', () => {
  const baseline = {
    "wednesday": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "d3f65258f45c3598111016d52be91d953081717e7e792bd90ee3042c8154456a"
    },
    "taylor-swift": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "d66811236dde08adb855c1c2842a680f71e62e4e62b79e53efe072cc03e34aa0"
    },
    "mark-zuckerberg": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "0259893548c1f95ea849669997429b4feb600d97a1f1a50a3333e298d4a17de9"
    },
    "mona-lisa": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "34635b3fb5ed86c649b6fc2fa6093fd24b0dec3c9e899209c50a838b0f8f78cc"
    },
    "barbie": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "bce7f49e61a6e802858711c6862273f4b13da3ecc3d6c3dda5e5130f226acfb4"
    },
    "charlie-chaplin": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "751b0896650e2d3d5f951b4e8ef9e47b1fc1c70c6a5010cd6a9ce7d7260b9840"
    },
    "olivia-rodrigo": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "6b0221489b39cb38f1339c226fe4f5ad2ceb53db728383083c4496dd9e336d54"
    },
    "marilyn-monroe": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "f02bd10a9de08a9dd2f22c88ef9fd3caf0d99af81cb7c2b6657c60e2a537718b"
    },
    "drake": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "7c54a79861b68014b30c0f1743b964028fef3efc8a943dd27654a84bca007b1f"
    },
    "lionel-messi": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "01dd692fcadb722cd8aacd93c108cf297925dd8412e1f4cc605ca15d0b7ce1c3"
    },
    "kylie-jenner": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "623ddb39bebd931c993cb6c197d4a89010380a610adaf38e77bdcd608f24cf38"
    },
    "mrbeast": {
      "version": "muse-reference-wig-v3",
      "promptSha256": "13eaa190f63c39bea09ab405ad22f44f7feb1f8a7c1c68462263272a5e47ba0e"
    },
    "harry-potter": {
      "version": "muse-reference-costume-v4",
      "promptSha256": "95fd6e1262db5d8fcf19cd3b33c3ba6d6d3557bccaf7bb558a7f1c0fc9ac7170"
    },
    "michael-jackson": {
      "version": "muse-reference-costume-v4",
      "promptSha256": "c6ff581beda7b0335eb410bd2bc67638d27932edd236a83aca540da8625b126d"
    },
    "joker": {
      "version": "muse-reference-costume-v4",
      "promptSha256": "5058377fb794d9855cf68a25197f4bc3ebc3be2aaf37bcbbf91dba21ca7df386"
    },
    "spongebob": {
      "version": "muse-reference-wardrobe-v2",
      "promptSha256": "95e217efcf82b62be1d7a9dd3633e1c9ce0ab027608c839cb4d914a483fd37e6"
    },
    "hello-kitty": {
      "version": "muse-reference-wardrobe-v2",
      "promptSha256": "d4f0b75358d21885a4dbd07599dcdcfc8cacffeeb8bbba6912ecb5ddaf401ae2"
    }
  };
  assert.equal(Object.keys(baseline).length, 17);
  for (const [id, recorded] of Object.entries(baseline)) {
    const result = buildMuseHandoff(character(id));
    assert.equal(result.version, recorded.version, id);
    assert.equal(createHash('sha256').update(result.prompt).digest('hex'), recorded.promptSha256, id);
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

test('initial wig recipes preserve the costume and hairstyle chosen in the native experiment', async () => {
  const experiment = JSON.parse(await readFile(new URL('../docs/experiments/muse-wig-stability-2026-10-15.json', import.meta.url), 'utf8'));
  const chosen = {
    'taylor-swift': 'fiber',
    'wednesday': 'textile',
    'mark-zuckerberg': 'fiber'
  };
  for (const [id, variant] of Object.entries(chosen)) {
    const recorded = experiment.recipes.find(recipe => recipe.characterId === id && recipe.variant === variant);
    assert.ok(recorded, id);
    assert.equal(wigStyles[id].costume, recorded.costume, id);
    assert.equal(wigStyles[id].hair, recorded.hair, id);
    assert.equal(wigStyles[id].variant, variant, id);
  }
});

test('wig catalog metadata and text-only fallback match their native visual recipe', () => {
  for (const preset of characters) {
    const wig = Object.hasOwn(wigStyles, preset.id) ? wigStyles[preset.id] : null;
    if (!wig) {
      if (Object.hasOwn(costumeStyles, preset.id) || preset.id === 'the-rock') continue;
      assert.equal(preset.avatar.designVersion, 'muse-costumes-v1');
      assert.match(preset.avatar.prompt, /Do not add human hair/);
      assert.equal(preset.avatar.hairstyle, undefined);
      continue;
    }
    assert.equal(preset.avatar.designVersion, 'muse-wigs-v2');
    assert.equal(preset.avatar.preview, `/avatars/muse-wigs-v2/${preset.id}.webp`);
    assert.equal(preset.avatar.basePreview, '/avatars/muse-costumes-v1/base.png');
    assert.equal(preset.avatar.hairstyle, wig.hair);
    assert.equal(preset.avatar.hairstyleVariant, wig.variant);
    assert.equal(preset.avatar.previewSource, 'native-muse');
    assert.equal(preset.avatar.previewSelection, 'curated');
    assert.ok(preset.avatar.prompt.includes(wig.costume), preset.id);
    assert.ok(preset.avatar.prompt.includes(wig.hair), preset.id);
    assert.doesNotMatch(preset.avatar.prompt, /Do not add human hair|using the downloaded image|using the attached image/i);
    assert.match(preset.avatar.prompt, /plain white/);
  }
});

test('the Rock design preview and text-only fallback share the new wardrobe without claiming native validation', () => {
  const preset = character('the-rock');
  const { avatar } = preset;
  const handoff = buildMuseHandoff(preset);
  assert.equal(avatar.designVersion, 'muse-rock-v4');
  assert.equal(avatar.preview, '/avatars/muse-rock-v4/the-rock.png');
  assert.equal(avatar.previewSource, 'imagegen');
  assert.equal(avatar.previewSelection, 'design-preview');
  assert.equal(avatar.hairstyle, undefined);
  assert.equal(handoff.version, 'muse-reference-wardrobe-v5');
  assert.equal(handoff.avatarPrompt, buildWardrobeAvatarPrompt(avatar.costume));
  assert.ok(avatar.prompt.endsWith(buildWardrobeAvatarPrompt(avatar.costume, { textOnly: true })));
  for (const prompt of [avatar.prompt, handoff.avatarPrompt]) {
    assert.match(prompt, /black knit turtleneck/);
    assert.match(prompt, /collar entirely below the cream chin rim/);
    assert.match(prompt, /one short gold chain on the chest/);
    assert.match(prompt, /light blue denim trousers/);
    assert.match(prompt, /dark brown leather-look zippered waist bag centered on the front/);
    assert.match(prompt, /cream mitten hands remain visible and relaxed beside the bag/);
    assert.match(prompt, /no dumbbell, gym T-shirt or muscles/);
    assert.match(prompt, /plain white background/);
    assert.doesNotMatch(prompt, /charcoal athletic T-shirt|tiny foam dumbbell|pale lilac/);
  }
  assert.match(avatar.prompt, /text-only prompt does not include an image reference/);
  assert.doesNotMatch(avatar.prompt, /downloaded|attached|source face/);
});

test('curated hairless costumes export a matching text-only recipe without a reference claim', () => {
  for (const id of Object.keys(costumeStyles)) {
    const { avatar } = character(id);
    assert.equal(avatar.designVersion, 'muse-costume-cues-v3');
    assert.equal(avatar.preview, `/avatars/muse-costume-cues-v3/${id}.webp`);
    assert.equal(avatar.baseId, 'persa-muse-v1');
    assert.equal(avatar.basePreview, '/avatars/muse-costumes-v1/base.png');
    assert.equal(avatar.costume, costumeStyles[id].costume);
    assert.equal(avatar.costumeVariant, costumeStyles[id].variant);
    assert.equal(avatar.previewSource, 'native-muse');
    assert.equal(avatar.previewSelection, 'curated');
    assert.equal(avatar.hairstyle, undefined);
    assert.ok(avatar.prompt.includes(character(id).name), id);
    assert.ok(avatar.prompt.endsWith(buildCostumeAvatarPrompt(id, { textOnly: true })), id);
    assert.doesNotMatch(avatar.prompt, /downloaded|attached|image as the character reference/i);
    assert.match(avatar.prompt, /Keep the entire head hairless/);
    assert.match(avatar.prompt, /Do not add hair, a wig/);
    const visualSections = prompt => prompt.split('\n\nCHARACTER COSTUME\n')[1];
    assert.equal(visualSections(avatar.prompt), visualSections(buildMuseHandoff(character(id)).avatarPrompt));
  }
});
