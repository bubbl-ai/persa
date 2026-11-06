import test from 'node:test';
import assert from 'node:assert/strict';
import { characters } from '../characters/catalog.js';
import { characterShareUrl, characterIdFromUrl, withCharacterInUrl } from '../web/character-links.js';

test('all catalog characters have stable homepage links that resolve to their preset', () => {
  const links = characters.map(character => {
    const link = characterShareUrl(character.id);
    assert.equal(link, `https://persa.bubblai.com/character/${character.id.replaceAll('-', '')}`);
    assert.equal(characterIdFromUrl(link, characters), character.id);
    return link;
  });
  assert.equal(new Set(links).size, characters.length);
});

test('all legacy query links and hyphenated path aliases still resolve', () => {
  for (const { id } of characters) {
    for (const alias of [id, id.replaceAll('-', '')]) {
      assert.equal(characterIdFromUrl(`https://persa.bubblai.com/?character=${alias}`, characters), id);
      assert.equal(characterIdFromUrl(`https://persa.bubblai.com/character/${alias}`, characters), id);
      assert.equal(characterIdFromUrl(`https://persa.bubblai.com/character/${alias}/?utm_source=instagram`, characters), id);
    }
  }
});

test('homepage browsing uses a clean path and retains campaigns, hash and origin', () => {
  for (const path of ['/', '/index.html', '/character/lionelmessi', '/character/lionel-messi/']) {
    const next = new URL(withCharacterInUrl(`http://127.0.0.1:4173${path}?utm_source=instagram&utm_campaign=launch%20one&character=drake&character=barbie#home-collection`, 'kylie-jenner'));
    assert.equal(next.origin, 'http://127.0.0.1:4173');
    assert.equal(next.pathname, '/character/kyliejenner');
    assert.equal(next.hash, '#home-collection');
    assert.deepEqual([...next.searchParams], [['utm_source', 'instagram'], ['utm_campaign', 'launch one']]);
    assert.equal(characterIdFromUrl(next.href, characters), 'kylie-jenner');
  }
});

test('browsing replaces only the character and preserves campaign, collection and anchor state', () => {
  const href = 'https://persa.bubblai.com/collection.html?utm_source=instagram&utm_campaign=launch%20one&view=saved&character=drake&character=barbie#home-collection';
  const next = new URL(withCharacterInUrl(href, 'kylie-jenner'));
  assert.equal(next.origin, 'https://persa.bubblai.com');
  assert.equal(next.pathname, '/collection.html');
  assert.equal(next.hash, '#home-collection');
  assert.deepEqual([...next.searchParams], [['utm_source', 'instagram'], ['utm_campaign', 'launch one'], ['view', 'saved'], ['character', 'kylie-jenner']]);
  assert.equal(characterIdFromUrl(next.href, characters), 'kylie-jenner');
});

test('the path wins over a conflicting query and unknown paths do not fall back to the query', () => {
  assert.equal(characterIdFromUrl('https://persa.bubblai.com/character/lionelmessi?character=drake', characters), 'lionel-messi');
  for (const path of ['/character/missing', '/character/lionelmessi/extra', '/character/lionel%2Fmessi', '/character/%E0%A4%A']) {
    assert.equal(characterIdFromUrl(`https://persa.bubblai.com${path}?character=drake`, characters), null);
  }
});

test('missing, unknown or malformed incoming characters fall back without unsafe lookup', () => {
  for (const href of ['not a url', 'https://persa.bubblai.com/', 'https://persa.bubblai.com/?character=missing', 'https://persa.bubblai.com/?character=__proto__', 'https://persa.bubblai.com/?character=%3Cscript%3E', 'https://persa.bubblai.com/character/__proto__']) {
    assert.equal(characterIdFromUrl(href, characters), null);
  }
  for (const id of ['', '../drake', '<script>', undefined]) {
    assert.throws(() => characterShareUrl(id), /Invalid character ID/);
    assert.throws(() => withCharacterInUrl('https://persa.bubblai.com/', id), /Invalid character ID/);
  }
});
