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

// --- second round of verification ---

test('a section key written with no value can still be saved into', () => {
  for (const [key, patch] of [
    ['voice', { name: 'A', voice: { warmth: 70 } }],
    ['style', { name: 'A', style: { greeting: 'hi' } }],
    ['rules', { name: 'A', rules: { always: ['R.'] } }]
  ]) {
    const out = mergeIntoYaml(`persa: 1\nname: A\n${key}:\n`, patch);
    assert.match(out, new RegExp(`${key}:`), `${key} was lost`);
    assert.doesNotMatch(out, /\[object Object\]/);
  }
});

test('comments inside a list survive a save', () => {
  const src = [
    'persa: 1',
    'name: Avery',
    'rules:',
    '  always:',
    '    # why this rule exists',
    '    - Do the thing. # inline',
    '    - Another.',
    ''
  ].join('\n');
  const { persona } = parsePersona(src);

  const untouched = mergeIntoYaml(src, persona);
  assert.match(untouched, /# why this rule exists/);
  assert.match(untouched, /# inline/);

  persona.rules.always = ['Do the thing.', 'A replacement.'];
  const edited = mergeIntoYaml(src, persona);
  assert.match(edited, /# inline/, 'a surviving item should keep its comment');
  assert.match(edited, /A replacement\./);
  assert.doesNotMatch(edited, /Another\./);
});

test('a trait the user wrote as 50 is kept, but a new 50 is never introduced', () => {
  const written = mergeIntoYaml('persa: 1\nname: A\nvoice:\n  warmth: 50 # on purpose\n', {
    name: 'A',
    voice: { warmth: 50, directness: 90 }
  });
  assert.match(written, /warmth: 50/);
  assert.match(written, /# on purpose/);
  assert.doesNotMatch(written, /directness: 50/);

  const fresh = mergeIntoYaml('persa: 1\nname: A\n', { name: 'A', voice: { warmth: 50 } });
  assert.doesNotMatch(fresh, /warmth/);
});

test('a scalar field given a mapping is refused, not stringified', () => {
  for (const yaml of [
    'name: A\ntagline:\n  a precise assistant: handles things\n',
    'name: A\nstyle:\n  greeting:\n    Morning: hi\n',
    'name: A\nexamples:\n  - user: hi\n    reply:\n      Sure: two meetings\n'
  ]) {
    assert.throws(() => parsePersona(yaml), PersonaError);
  }
});

test('nothing can put [object Object] into a compiled prompt', async () => {
  const { compile } = await import('../src/compile.js');
  const hostile = {
    name: 'A',
    tagline: { 'a precise assistant': 'handles things' },
    style: { greeting: { Morning: 'hi' }, address_user_as: { a: 'b' }, notes: [{ Rule: 'short' }] },
    rules: { always: [{ Deadlines: 'a date' }], never: [{ Filler: 'no' }] },
    boundaries: [{ Money: 'ask' }],
    examples: [{ user: { a: 'b' }, reply: 'ok' }]
  };
  for (const key of Object.keys(hostile)) {
    if (key === 'name') continue;
    assert.throws(() => normalize({ name: 'A', [key]: hostile[key] }), PersonaError, `${key} slipped through`);
  }
  assert.doesNotMatch(compile(normalize({ name: 'A' }), 'plain').text, /\[object Object\]/);
});

test('a non-list examples block is refused instead of being quietly dropped', () => {
  for (const yaml of ['name: X\nexamples:\n  a: b\n', 'name: X\nexamples: hello\n', 'name: X\nexamples: 3\n']) {
    assert.throws(() => parsePersona(yaml), /`examples` should be a list/);
  }
});

test('a fractional trait is rounded once, with a warning, so file and UI agree', () => {
  const { persona } = parsePersona('name: A\nvoice:\n  warmth: 25.5\n');
  assert.equal(persona.voice.warmth, 26);
  assert.match(persona.warnings.join(' '), /rounded to 26/);
});

test('overlapping saves do not interleave', async () => {
  const file = await tempFile('persa: 1\nname: A\n');
  const writes = Array.from({ length: 12 }, (_, i) =>
    savePersona(file, normalize({ name: `Name${i}`, rules: { always: [`Rule ${i}.`] } }))
  );
  await Promise.all(writes);
  const after = await readFile(file, 'utf8');
  // Whichever write landed last, the file must be one coherent persona.
  const { persona } = parsePersona(after);
  assert.match(persona.name, /^Name\d+$/);
  assert.equal(persona.rules.always.length, 1);
  assert.equal(persona.rules.always[0], `Rule ${persona.name.replace('Name', '')}.`);
});
