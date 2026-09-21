/**
 * The compiler: a persona object in, prompt text out.
 *
 * Two ideas do most of the work here.
 *
 * 1. Traits near the middle of their scale compile to nothing. A persona that
 *    only cares about bluntness produces a prompt about bluntness, not a
 *    wall of hedged adjectives.
 * 2. Every line carries a priority, so when a target has a character cap
 *    (Grok allows 4,000; a text message to Instinct should be far shorter)
 *    the least important lines drop first and the compiler reports exactly
 *    what it dropped, instead of silently truncating mid-sentence.
 */
import { TRAIT_NAMES, EMOJI_RULES, phraseFor } from './traits.js';
import { getTarget, TARGET_IDS } from './targets.js';

const MESSAGE_PREFIX =
  "Here's how I want you to talk and behave with me from now on. Remember it and apply it to every reply, including short ones.";

const ANCHOR = 'Hold this voice in every reply, including one-line ones, unless I explicitly ask you to drop it.';

/**
 * Turn a persona into ordered sections of lines.
 * Lower `priority` survives longer when the text has to be cut down.
 * @returns {{id:string,title:string|null,priority:number,lines:string[]}[]}
 */
export function buildSections(persona) {
  const sections = [];
  const push = (id, title, priority, lines) => {
    const kept = lines.filter(Boolean);
    if (kept.length) sections.push({ id, title, priority, lines: kept });
  };

  const identity = [];
  identity.push(persona.tagline ? `You are ${persona.name} — ${trimPeriod(persona.tagline)}.` : `You are ${persona.name}.`);
  if (persona.style?.address_user_as) identity.push(`Call me ${persona.style.address_user_as}.`);
  identity.push(ANCHOR);
  push('identity', null, 0, identity);

  push('boundaries', 'Boundaries — these override everything else', 1, persona.boundaries ?? []);

  const voice = [];
  for (const trait of TRAIT_NAMES) {
    const value = persona.voice?.[trait];
    if (value == null) continue;
    const phrase = phraseFor(trait, value);
    if (phrase) voice.push(phrase);
  }
  if (persona.style?.emoji && persona.style.emoji !== 'sparing') voice.push(EMOJI_RULES[persona.style.emoji]);
  if (persona.style?.greeting) voice.push(`How you open a conversation: ${trimPeriod(persona.style.greeting)}.`);
  push('voice', 'Voice', 2, voice);

  // Document order is always-then-never because that reads naturally. Drop
  // order is the reverse: a prohibition someone bothered to write is usually
  // load-bearing, while an `always` is more often a preference — so `never`
  // carries the lower priority number and outlives it under a tight budget.
  push('always', 'Always', 4, persona.rules?.always ?? []);
  push('never', 'Never', 3, persona.rules?.never ?? []);
  push('wording', 'Wording', 5, persona.style?.notes ?? []);

  push(
    'examples',
    'This is the right voice',
    6,
    (persona.examples ?? []).map(ex => `Me: "${ex.user}" → You: "${ex.reply}"`)
  );

  return sections;
}

function trimPeriod(s) {
  return String(s).trim().replace(/[.!?]+$/, '');
}

function renderSections(sections, { markdown, framing }) {
  const blocks = sections.map(section => {
    if (section.id === 'identity') return section.lines.join('\n');
    const heading = markdown ? `## ${section.title}` : `${section.title}:`;
    return [heading, ...section.lines.map(l => `- ${l}`)].join('\n');
  });
  const body = blocks.join('\n\n');
  return framing === 'message' ? `${MESSAGE_PREFIX}\n\n${body}` : body;
}

/**
 * Compile a persona for a target.
 *
 * @param {object} persona   normalized persona
 * @param {string|object} target  a target id, or `{limit, markdown, framing}`
 * @returns {{text:string, target:object, stats:{length:number, limit:number|null, fits:boolean, removed:{section:string,line:string}[], truncated:boolean}}}
 */
export function compile(persona, target = 'plain') {
  const t = typeof target === 'string' ? getTarget(target) : target;
  const sections = buildSections(persona);
  const opts = { markdown: t.markdown !== false, framing: t.framing ?? 'system' };
  const removed = [];
  let truncated = false;

  let text = renderSections(sections, opts);

  if (t.limit != null && Number.isFinite(t.limit)) {
    // Drop the least important line still present, over and over, until it fits.
    while (text.length > t.limit) {
      // Highest priority number = least important = goes first. Ties break
      // toward the later section. This is deliberately independent of the
      // order sections appear in the document.
      const victim = sections
        .filter(s => s.priority >= 2 && s.lines.length > 0)
        .sort((a, b) => b.priority - a.priority || sections.indexOf(b) - sections.indexOf(a))[0];
      if (!victim) break;
      removed.push({ section: victim.id, line: victim.lines.pop() });
      if (victim.lines.length === 0) sections.splice(sections.indexOf(victim), 1);
      text = renderSections(sections, opts);
    }
    // Only identity and boundaries left and still over: cut, and say so.
    if (text.length > t.limit) {
      text = hardCut(text, t.limit);
      truncated = true;
    }
  }

  const limit = t.limit ?? null;
  return {
    text,
    target: t,
    stats: {
      length: text.length,
      limit,
      // `fits` is about the budget, not about whether we happened to cut —
      // a zero or negative limit can leave text over budget with nothing left
      // to drop, and reporting that as a fit would be a lie.
      fits: !truncated && (limit == null || !Number.isFinite(limit) || text.length <= limit),
      removed,
      truncated
    }
  };
}

/**
 * Truncate to `limit` characters without splitting a surrogate pair.
 * `slice` counts UTF-16 code units, so cutting between the halves of an emoji
 * leaves a lone surrogate that renders as U+FFFD in the text someone pastes.
 */
function hardCut(text, limit) {
  if (limit <= 0) return '';
  let cut = limit - 1;
  const code = text.charCodeAt(cut - 1);
  if (code >= 0xd800 && code <= 0xdbff) cut -= 1; // don't orphan a high surrogate
  return text.slice(0, Math.max(0, cut)).trimEnd() + '…';
}

/** Compile once per target — what `persa check` reports on. */
export function compileAll(persona, ids = TARGET_IDS) {
  return ids.map(id => ({ id, ...compile(persona, id) }));
}
