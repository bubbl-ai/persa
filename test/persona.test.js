import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parsePersona, normalize, savePersona, mergeIntoYaml, PersonaError } from '../src/persona.js';

async function tempFile(contents) {
  const dir = await mkdtemp(path.join(tmpdir(), 'persa-'));
  const file = path.join(dir, 'persona.yaml');
  await writeFile(file, contents, 'utf8');
  return file;
}

test('a trait written with no value is an error, not zero', () => {
  // `warmth:` parses as null, and Number(null) is 0 — the far clinical extreme.
  assert.throws(() => parsePersona('name: S\nvoice:\n  warmth:\n'), /voice.warmth has no value/);
});

test('non-numeric trait values are rejected', () => {
  for (const value of ['""', 'true', 'false', '[]', '"abc"']) {
    assert.throws(() => parsePersona(`name: S\nvoice:\n  warmth: ${value}\n`), PersonaError, `accepted ${value}`);
  }
});

test('numeric strings are still accepted', () => {
  const { persona } = parsePersona('name: S\nvoice:\n  warmth: "25"\n');
  assert.equal(persona.voice.warmth, 25);
});

test('a rule containing a colon is caught, not turned into [object Object]', () => {
  assert.throws(
    () => parsePersona('name: S\nboundaries:\n  - Money: ask me first.\n'),
    /boundaries\[0\] is a mapping[\s\S]*Quote the whole line/
  );
  for (const field of ['rules:\n  always', 'rules:\n  never', 'style:\n  notes']) {
    assert.throws(() => parsePersona(`name: S\n${field}:\n  - Key: value.\n`), /is a mapping, not a sentence/);
  }
});

test('a quoted colon line round-trips as text', () => {
  const { persona } = parsePersona('name: S\nboundaries:\n  - "Money: ask me first."\n');
  assert.deepEqual(persona.boundaries, ['Money: ask me first.']);
});

test('a bare boolean or number in a rule list is caught', () => {
  assert.throws(() => parsePersona('name: S\nboundaries:\n  - true\n'), /not a sentence/);
  assert.throws(() => parsePersona('name: S\nboundaries:\n  - 42\n'), /not a sentence/);
  // YAML 1.2 keeps bare `yes` a string, so it is a legitimate (if odd) rule.
  assert.deepEqual(parsePersona('name: S\nboundaries:\n  - yes\n').persona.boundaries, ['yes']);
});

test('saving preserves comments and keys Persa does not model', async () => {
  const file = await tempFile(
    ['persa: 1', '# tuned over weeks — keep these notes', 'name: Sable', 'voice:', '  warmth: 25 # deliberately cold', '  sarcasm: 70', ''].join('\n')
  );
  const { persona } = parsePersona(await readFile(file, 'utf8'));
  persona.voice.warmth = 80;
  await savePersona(file, persona);

  const after = await readFile(file, 'utf8');
  assert.match(after, /# tuned over weeks/);
  assert.match(after, /# deliberately cold/);
  assert.match(after, /sarcasm: 70/);
  assert.match(after, /warmth: 80/);
});

test('saving removes a trait the user cleared', async () => {
  const file = await tempFile('persa: 1\nname: Sable\nvoice:\n  warmth: 25\n  humor: 70\n');
  const { persona } = parsePersona(await readFile(file, 'utf8'));
  delete persona.voice.warmth;
  await savePersona(file, persona);
  const after = await readFile(file, 'utf8');
  assert.doesNotMatch(after, /warmth/);
  assert.match(after, /humor: 70/);
});

test('saving does not introduce the default emoji setting', () => {
  const persona = normalize({ name: 'Sable' });
  assert.doesNotMatch(mergeIntoYaml('persa: 1\nname: Sable\n', persona), /emoji/);
});

test('an empty name is rejected rather than renamed', () => {
  assert.throws(() => normalize({ name: '' }), /`name` is required/);
  assert.throws(() => normalize({ name: '   ' }), /`name` is required/);
});
