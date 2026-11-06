import test from 'node:test';
import assert from 'node:assert/strict';
import { characters } from '../characters/catalog.js';
import { buildMuseHandoff } from '../src/muse-handoff.js';
import { buildCharacterPackage } from '../web/character-package.js';
import { characterShareUrl } from '../web/character-links.js';

const unescapeHtml = value => value.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"
}[entity]));
const extractPrompt = html => unescapeHtml(html.match(/<textarea\b[^>]*>([\s\S]*?)<\/textarea>/)[1]);
const extractMuseUrl = html => unescapeHtml(html.match(/id="open-muse" href="([^"]+)"/)[1]);

test('all 18 HTML packages preserve the current handoff prompt and working canonical character link', () => {
  for (const character of characters) {
    const tuned = { ...character.persona, voice: { ...character.persona.voice, warmth: 0, humor: 100, directness: 0, verbosity: 100 } };
    const handoff = buildMuseHandoff(character, tuned);
    const html = buildCharacterPackage({ character, handoff });
    assert.equal(extractPrompt(html), handoff.prompt, character.id);
    assert.equal(extractMuseUrl(html), handoff.url, character.id);
    assert.equal(new URL(extractMuseUrl(html)).searchParams.get('prompt'), extractPrompt(html), character.id);
    assert.ok(html.includes(characterShareUrl(character.id)), character.id);
    assert.match(html, /does not install a character or import a file into Muse/);
    assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|<img[^>]+src="https?:/);
    assert.match(html, /prompt\.setSelectionRange\(0, prompt\.value\.length\)/);
  }
});

test('HTML package escapes names, tags and prompt content without losing the original text', () => {
  const payload = '</textarea><img src=x onerror="alert(1)"><script>alert(2)</script>&amp;';
  const character = { ...characters[0], name: payload, tags: ['<b>hello</b>', "'quoted'", '&'] };
  const handoff = buildMuseHandoff(character);
  const html = buildCharacterPackage({ character, handoff });
  assert.equal(extractPrompt(html), handoff.prompt);
  assert.equal(new URL(extractMuseUrl(html)).searchParams.get('prompt'), handoff.prompt);
  assert.equal(html.match(/<script>/g).length, 1);
  assert.equal(html.match(/<\/textarea>/g).length, 1);
  assert.doesNotMatch(html, /<img src=x|<b>hello<\/b>/);
  assert.match(html, /&lt;script&gt;alert\(2\)&lt;\/script&gt;/);
});

test('HTML package rejects cross-character, missing, mismatched and unsafe Muse links', () => {
  const character = characters[0], handoff = buildMuseHandoff(character);
  const invalid = [
    null,
    { ...handoff, characterId: characters[1].id },
    { ...handoff, prompt: '' },
    { ...handoff, url: 'javascript:alert(1)' },
    { ...handoff, url: handoff.url.replace('https://muse.ai/', 'https://muse.ai.evil.test/') },
    { ...handoff, url: handoff.url.replace('https://muse.ai/', 'https://user@muse.ai/') },
    { ...handoff, url: handoff.url.replace('https://muse.ai/', 'http://muse.ai/') },
    { ...handoff, url: handoff.url.replace('https://muse.ai/', 'https://muse.ai/wrong') },
    { ...handoff, url: handoff.url + '#extra' },
    { ...handoff, url: handoff.url + '&prompt=other' },
    { ...handoff, prompt: handoff.prompt + ' mismatch' }
  ];
  for (const candidate of invalid) assert.throws(() => buildCharacterPackage({ character, handoff: candidate }), TypeError);
});

test('HTML package embeds only raster data previews and works without artwork', () => {
  const character = characters[0], handoff = buildMuseHandoff(character);
  assert.doesNotMatch(buildCharacterPackage({ character, handoff }), /<img/);
  for (const mime of ['png', 'jpeg', 'webp']) {
    const previewDataUrl = `data:image/${mime};base64,AA==`;
    assert.ok(buildCharacterPackage({ character, handoff, previewDataUrl }).includes(`src="${previewDataUrl}"`));
  }
  for (const previewDataUrl of [
    'https://example.com/image.png', 'javascript:alert(1)', 'data:text/html;base64,AA==',
    'data:image/svg+xml;base64,AA==', 'data:image/png;base64,AA==" onload="alert(1)', {}
  ]) assert.throws(() => buildCharacterPackage({ character, handoff, previewDataUrl }), /embedded PNG, WebP or JPEG/);
});
