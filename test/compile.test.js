import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePersona, normalize, toYaml, PersonaError } from '../src/persona.js';
import { compile, buildSections } from '../src/compile.js';
import { phraseFor, bandOf } from '../src/traits.js';
import { TARGET_IDS } from '../src/targets.js';

const base = { name: 'Sable' };

test('name is required', () => {
  assert.throws(() => normalize({}), PersonaError);
  assert.throws(() => parsePersona('tagline: no name'), PersonaError);
});

test('a trait near the middle compiles to nothing', () => {
  assert.equal(phraseFor('warmth', 50), null);
  assert.equal(bandOf(50), 2);
  const sections = buildSections(normalize({ ...base, voice: { warmth: 50, humor: 50 } }));
  assert.equal(sections.find(s => s.id === 'voice'), undefined);
});

test('a trait at an extreme compiles to its sentence', () => {
  const { text } = compile(normalize({ ...base, voice: { directness: 95 } }), 'plain');
  assert.match(text, /Be blunt/);
});

test('out-of-range trait values are rejected', () => {
  assert.throws(() => normalize({ ...base, voice: { warmth: 140 } }), PersonaError);
  assert.throws(() => normalize({ ...base, voice: { warmth: 'hot' } }), PersonaError);
});

test('unknown traits warn instead of failing', () => {
  const p = normalize({ ...base, voice: { sparkle: 90 } });
  assert.equal(Object.keys(p.voice).length, 0);
  assert.match(p.warnings.join(' '), /sparkle/);
});

test('identity and boundaries always survive a tight budget', () => {
  const persona = normalize({
    ...base,
    tagline: 'short',
    boundaries: ['Never spend money without asking.'],
    rules: { always: Array.from({ length: 40 }, (_, i) => `Rule number ${i} which is quite a long sentence indeed.`) }
  });
  const { text, stats } = compile(persona, { limit: 400, markdown: true, framing: 'system' });
  assert.ok(stats.removed.length > 0, 'should have dropped lines');
  assert.ok(text.length <= 400);
  assert.match(text, /You are Sable/);
  assert.match(text, /Never spend money without asking/);
});

test('lines drop from the least important section first', () => {
  const persona = normalize({
    ...base,
    voice: { directness: 95 },
    rules: { always: ['Alpha rule.'], never: ['Omega rule.'] },
    style: { notes: ['A wording note.'] },
    examples: [{ user: 'hi', reply: 'hello' }]
  });
  const full = compile(persona, 'plain').text.length;
  const { stats } = compile(persona, { limit: full - 20, markdown: true, framing: 'system' });
  assert.equal(stats.removed[0].section, 'examples');
});

test('truncation is reported rather than hidden', () => {
  const persona = normalize({ ...base, tagline: 'x'.repeat(500) });
  const { text, stats } = compile(persona, { limit: 100, markdown: true, framing: 'system' });
  assert.equal(stats.truncated, true);
  assert.equal(stats.fits, false);
  assert.ok(text.length <= 100);
});

test('message framing adds a lead-in, system framing does not', () => {
  const persona = normalize(base);
  assert.match(compile(persona, 'instinct').text, /^Here's how I want you to talk/);
  assert.match(compile(persona, 'grok').text, /^You are Sable/);
});

test('plain targets carry no markdown headings', () => {
  const persona = normalize({ ...base, rules: { always: ['Be quick.'] } });
  assert.doesNotMatch(compile(persona, 'instinct').text, /## /);
  assert.match(compile(persona, 'grok').text, /## Always/);
});

test('every target compiles within its own limit', () => {
  const persona = normalize({
    ...base,
    tagline: 'a dry chief of staff',
    voice: { warmth: 10, directness: 95, verbosity: 5, challenge: 90 },
    rules: {
      always: Array.from({ length: 12 }, (_, i) => `Always do the ${i}th important thing carefully.`),
      never: Array.from({ length: 12 }, (_, i) => `Never do the ${i}th forbidden thing, ever.`)
    },
    boundaries: ['Ask before sending anything.'],
    examples: [{ user: 'did you book it?', reply: 'Booked. Tuesday 7:30.' }]
  });
  for (const id of TARGET_IDS) {
    const { stats } = compile(persona, id);
    if (stats.limit) assert.ok(stats.length <= stats.limit, `${id}: ${stats.length} > ${stats.limit}`);
  }
});

test('a persona survives a round trip through YAML', () => {
  const persona = normalize({
    ...base,
    tagline: 'dry',
    voice: { warmth: 20 },
    style: { emoji: 'never', address_user_as: 'Tony', notes: ['Short sentences.'] },
    rules: { always: ['Lead with the decision.'], never: ['No filler.'] },
    boundaries: ['Ask first.'],
    examples: [{ user: 'hi', reply: 'yes' }]
  });
  const again = parsePersona(toYaml(persona)).persona;
  assert.deepEqual({ ...again, warnings: [] }, { ...persona, warnings: [] });
});

test('unknown targets fail loudly', () => {
  assert.throws(() => compile(normalize(base), 'telepathy'), /Unknown target/);
});
