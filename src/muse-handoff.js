import { compile } from './compile.js';

// These three recipes preserve the October 12 trial's chosen costume constraints.
// The handoff is versioned separately from the gallery artwork and legacy prompts.
const VERSION = 'muse-reference-handoff-v1';
const BASE_URL = 'https://persa.bubblai.com/avatars/muse-costumes-v1/base.png';
const BASE_SHA256 = 'c428fd4d8608ca5bd5d72a5c3f49a20be680a739a94bb9e658e3f4be23a4ec2f';

const COSTUMES = Object.freeze({
  'mona-lisa': 'one olive Renaissance dress with long sleeves, a fitted bodice covering the whole torso and a single continuous skirt ending just above the feet; a dark sheer veil resting outside the cream hood; and both fleece mitten hands gently together in front',
  'taylor-swift': 'one shimmering lavender stage dress with shoulder straps, a fitted bodice covering the whole torso and a single continuous skirt; and a silver microphone held in one fleece mitten hand',
  'mark-zuckerberg': 'a plain gray T-shirt, full-length navy trousers covering both legs, white sneakers, and a tiny closed silver laptop with a completely blank unmarked lid held in one mitten hand'
});

function avatarRecipe(id) {
  const fit = id === 'mark-zuckerberg' ? '' : 'Fit the clothes over the source body without lengthening its legs or changing the head-to-body ratio. Both hands remain simple rounded, fingerless cream fleece mittens: no fingers, thumbs, fingernails or smooth human skin. ';
  return `Generate native Muse avatar candidates using the downloaded image as the character reference. Dress that exact cream plush toy in ${COSTUMES[id]}.

Preserve the source face outline, bead-eye size and spacing, tiny stitched smile, cream hood contour, short curly sherpa texture, compact body, short limbs and standing front view. The outfit is the only design change. ${fit}Keep the face completely unobscured; no hair, eyelashes, nose or additional features. Keep realistic photographed plush material in every option, never a drawing or plastic figure. Every candidate should use the same character, costume, pose and style rather than proposing different designs. Show the full body with both feet visible on a plain white background. No text or logos.

If your native avatar generator cannot use the downloaded image as a generation reference, tell me before generating. Show native Muse avatar candidates for me to choose from. Do not select or activate a candidate automatically.`;
}

/** Prepare a guided Muse web handoff. Opening the URL never sends the message. */
export function buildMuseHandoff(character, persona = character?.persona) {
  if (!character || !Object.hasOwn(COSTUMES, character.id)) return null;
  const personalityPrompt = compile(persona, 'muse').text;
  const avatarPrompt = avatarRecipe(character.id);
  const prompt = `I'd like to set up this Persa character combo for my Muse: ${character.name}. Apply the personality below as my style preferences and offer the matching native avatar candidates for me to choose from.

PERSONALITY SETUP
Replace my previous character voice, tone and emoji preferences with this personality, including its explicit no-emoji setting. Do not blend in a previous character's style. Preserve unrelated preferences, memories, permissions and account settings, including my account display name. Treat the character name as a fictional style preset, not a claim to be that person. Tell me which style settings you saved and clearly say if you cannot save them.

${personalityPrompt}

AVATAR REFERENCE
Download a fresh copy of this public PNG directly into your workspace, for example ~/workspace/persa/base.png. Create the workspace subdirectory if needed. Do not use /tmp or any path outside your workspace.
Image URL: ${BASE_URL}
Expected SHA-256: ${BASE_SHA256}
Verify the downloaded file's SHA-256, then pass that actual workspace image file as the reference to your native avatar generator. Do not substitute a description, a prior avatar, a web image result or a text-only generation. If the download, hash verification or native image-reference input is unavailable, stop the avatar step and explain the problem instead of generating without the reference.

MATCHING MUSE COSTUME
${avatarPrompt}

Show the native chooser and let me select the avatar. Sending this message is permission to save the personality and generate candidates, not to automatically select or activate an avatar. Keep the current avatar until I select a candidate.`;
  const url = new URL('https://muse.ai/');
  url.searchParams.set('prompt', prompt);
  return {
    version: VERSION,
    characterId: character.id,
    prompt,
    url: url.href,
    baseUrl: BASE_URL,
    baseSha256: BASE_SHA256,
    personalityPrompt,
    avatarPrompt
  };
}
