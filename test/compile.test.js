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

test('every target compiles within its own limit, without truncating', () => {
  // `length <= limit` alone is true by construction — the hard-cut fallback
  // guarantees it even with the trimming engine removed. Asserting that
  // nothing was truncated is what actually exercises the priority loop.
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
  let sawTrimming = false;
  for (const id of TARGET_IDS) {
    const { stats } = compile(persona, id);
    if (stats.limit) assert.ok(stats.length <= stats.limit, `${id}: ${stats.length} > ${stats.limit}`);
    assert.equal(stats.truncated, false, `${id} was hard-truncated instead of trimmed`);
    assert.equal(stats.fits, true, `${id} reported as not fitting`);
    if (stats.removed.length) sawTrimming = true;
  }
  assert.ok(sawTrimming, 'this persona should overflow at least one target, or the test proves nothing');
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

// --- regressions found by end-to-end verification ---

test('a prohibition outlives a preference under a tight budget', () => {
  const persona = normalize({
    ...base,
    rules: { always: ['ALWAYS-rule.'], never: ['NEVER-rule.'] },
    style: { notes: ['A note.'] },
    examples: [{ user: 'u', reply: 'r' }]
  });
  const full = compile(persona, 'plain').text.length;
  const order = [];
  for (let limit = full; limit > 40; limit -= 4) {
    for (const r of compile(persona, { limit, markdown: true, framing: 'system' }).stats.removed) {
      if (!order.includes(r.section)) order.push(r.section);
    }
  }
  assert.deepEqual(order.slice(0, 4), ['examples', 'wording', 'always', 'never']);
});

test('always is still printed before never', () => {
  const persona = normalize({ ...base, rules: { always: ['A-rule.'], never: ['N-rule.'] } });
  const text = compile(persona, 'plain').text;
  assert.ok(text.indexOf('A-rule.') < text.indexOf('N-rule.'));
});

test('a zero or negative limit is a budget, not an absence of one', () => {
  const persona = normalize({ ...base, tagline: 'dry' });
  for (const limit of [0, -5]) {
    const { stats } = compile(persona, { limit, markdown: true, framing: 'system' });
    assert.equal(stats.fits, false, `limit ${limit} should not report a fit`);
    assert.ok(stats.length <= Math.max(0, limit));
  }
});

test('fits is never true when the budget was blown or content was lost', () => {
  const persona = normalize({ ...base, tagline: 'a dry chief of staff' });
  for (const limit of [0, 1, 20, 200, 5000]) {
    const { text, stats } = compile(persona, { limit, markdown: true, framing: 'system' });
    if (stats.fits) {
      assert.ok(text.length <= limit, `claimed to fit ${limit} at ${text.length} characters`);
      assert.equal(stats.truncated, false, `claimed to fit ${limit} after truncating`);
    }
  }
});

test('truncation never splits an emoji', () => {
  const persona = normalize({ ...base, boundaries: ['Never share my address ' + '🏠'.repeat(80)] });
  for (let limit = 40; limit < 200; limit++) {
    const { text } = compile(persona, { limit, markdown: false, framing: 'system' });
    assert.ok(!text.includes('�'), `limit ${limit} produced a replacement character`);
    assert.ok(text.length <= limit);
  }
});

test('a non-numeric limit is an error, not a silent absence of one', () => {
  const persona = normalize({ ...base, tagline: 'a dry chief of staff' });
  for (const limit of ['abc', {}, [], NaN]) {
    assert.throws(() => compile(persona, { limit, markdown: true, framing: 'system' }), /limit should be a number/);
  }
  // A numeric string is a reasonable thing to get from JSON, and is enforced.
  const { stats } = compile(persona, { limit: '80', markdown: true, framing: 'system' });
  assert.ok(stats.length <= 80);
  assert.equal(stats.limit, 80);
});

test('trimming a very large persona stays fast', () => {
  const persona = normalize({
    ...base,
    examples: Array.from({ length: 20000 }, (_, i) => ({ user: `q${i}`, reply: `r${i}` }))
  });
  const started = process.hrtime.bigint();
  const { stats } = compile(persona, 'instinct');
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  assert.ok(stats.removed.length > 19000);
  // The old per-line re-render made this minutes, not milliseconds.
  assert.ok(ms < 3000, `took ${Math.round(ms)}ms`);
});

test('the running length used while trimming matches a real render', () => {
  // The loop subtracts a computed cost per dropped line instead of
  // re-rendering; if that arithmetic drifts, output silently misses its budget.
  const persona = normalize({
    ...base,
    tagline: 'a dry chief of staff',
    voice: { directness: 95, warmth: 10 },
    boundaries: ['Ask first.'],
    rules: {
      always: Array.from({ length: 30 }, (_, i) => `Always rule ${i} with some length to it.`),
      never: Array.from({ length: 30 }, (_, i) => `Never rule ${i} with some length to it.`)
    },
    style: { notes: Array.from({ length: 10 }, (_, i) => `Note ${i}.`) },
    examples: Array.from({ length: 10 }, (_, i) => ({ user: `u${i}`, reply: `r${i}` }))
  });
  for (const markdown of [true, false]) {
    for (let limit = 120; limit < 2600; limit += 7) {
      const { text, stats } = compile(persona, { limit, markdown, framing: 'system' });
      assert.equal(stats.length, text.length);
      assert.ok(text.length <= limit, `limit ${limit} markdown=${markdown} produced ${text.length}`);
      if (!stats.truncated) assert.equal(stats.fits, true);
    }
  }
});
