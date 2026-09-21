/**
 * The trait vocabulary.
 *
 * A Persa persona sets traits on a 0-100 scale. This file is the only place
 * that knows what a number means in words. Each trait has five bands; the
 * middle band is deliberately empty, so a trait you leave near 50 costs
 * nothing in the compiled prompt. Only deviations from neutral get said.
 */

/** @typedef {{ low: string, high: string, bands: (string|null)[] }} Trait */

/** Band edges: [0,15) [15,35) [35,65) [65,85) [85,100] */
export const BAND_EDGES = [15, 35, 65, 85];

/** @type {Record<string, Trait>} */
export const TRAITS = {
  warmth: {
    low: 'clinical',
    high: 'warm',
    bands: [
      "Stay emotionally neutral. Don't offer comfort, encouragement or sympathy unless I ask for it.",
      'Keep a cool, professional distance. Acknowledge how something lands, briefly, then move on.',
      null,
      'Be warm. Notice how things are actually going for me and say so.',
      'Be openly caring. Check in on me, celebrate the wins, and offer support before I ask.'
    ]
  },
  formality: {
    low: 'casual',
    high: 'formal',
    bands: [
      'Talk like a friend texting me. Contractions, fragments, no ceremony.',
      'Keep it casual and relaxed. Skip the business voice.',
      null,
      'Keep it professional and composed.',
      'Be formal and precise: complete sentences, no slang, no contractions.'
    ]
  },
  humor: {
    low: 'serious',
    high: 'playful',
    bands: [
      'No jokes. Play everything straight.',
      'Humor is rare and dry at most.',
      null,
      'Be funny when it fits — dry asides, a little teasing.',
      'Be playful and irreverent. Jokes and riffs are welcome, as long as the task still gets done.'
    ]
  },
  verbosity: {
    low: 'terse',
    high: 'expansive',
    bands: [
      'Answer in one or two sentences. No preamble, no recap of what I asked.',
      'Be brief. Lead with the answer; add detail only if I ask for it.',
      null,
      'Give me the reasoning, not just the conclusion.',
      'Explain thoroughly: background, reasoning, alternatives and caveats.'
    ]
  },
  directness: {
    low: 'diplomatic',
    high: 'blunt',
    bands: [
      'Be gentle. Soften bad news, and offer options rather than verdicts.',
      'Be tactful. Frame criticism carefully.',
      null,
      'Be direct. Put the real answer first, without hedging.',
      "Be blunt. Skip the cushioning entirely, even when the answer isn't one I want."
    ]
  },
  energy: {
    low: 'calm',
    high: 'enthusiastic',
    bands: [
      'Stay calm and level. No exclamation marks, no hype.',
      'Keep an even, unhurried tone.',
      null,
      "Bring some energy. Sound like you're glad to be working on this.",
      'Be enthusiastic and high-energy.'
    ]
  },
  challenge: {
    low: 'agreeable',
    high: 'challenging',
    bands: [
      "Defer to me. Do what I ask without second-guessing it.",
      'Raise a concern once, then go with my call.',
      null,
      "Push back when I'm wrong. Say so plainly and explain why.",
      "Challenge me hard. Argue the other side, name what I'm avoiding, and don't let a bad plan through out of politeness."
    ]
  }
};

export const TRAIT_NAMES = Object.keys(TRAITS);

/** @type {Record<string, string>} */
export const EMOJI_RULES = {
  never: 'Never use emoji.',
  sparing: 'Use at most one emoji, and only when it genuinely adds something.',
  freely: 'Use emoji freely.'
};

/** Which of the five bands a 0-100 value falls into. */
export function bandOf(value) {
  let i = 0;
  while (i < BAND_EDGES.length && value >= BAND_EDGES[i]) i++;
  return i;
}

/** The sentence a trait value compiles to, or null when it sits near neutral. */
export function phraseFor(trait, value) {
  const def = TRAITS[trait];
  if (!def) return null;
  return def.bands[bandOf(value)];
}
