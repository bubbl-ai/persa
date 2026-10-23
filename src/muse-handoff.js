import { compile } from './compile.js';
import { buildWigAvatarPrompt } from './muse-wigs.js';
import { buildCostumeAvatarPrompt } from './muse-costume-recipes.js';

// Curated previews use the same visual recipe as their native generation.
// The Rock has an updated wardrobe; two presets retain their original costumes.
// Handoff recipes are versioned separately from gallery artwork/legacy prompts.
const BASE_URL = 'https://persa.bubblai.com/avatars/muse-costumes-v1/base.png';
const BASE_SHA256 = 'c428fd4d8608ca5bd5d72a5c3f49a20be680a739a94bb9e658e3f4be23a4ec2f';

// An explicit roster prevents arbitrary IDs (or prototype properties) from
// silently acquiring a handoff merely because they contain costume text.
const CATALOG_COSTUMES = new Set([
  'the-rock', 'spongebob', 'hello-kitty'
]);

export function buildWardrobeAvatarPrompt(costume, { textOnly = false } = {}) {
  const reference = textOnly
    ? 'Generate four native Muse avatar candidates using the shared cream plush description above. This text-only prompt does not include an image reference.'
    : 'Generate four native Muse avatar candidates using the downloaded image as the character reference.';
  const source = textOnly ? 'described base' : 'source';
  const referenceCheck = textOnly ? '' : 'If your native avatar generator cannot use the downloaded image as a generation reference, tell me before generating. ';
  return `${reference} Dress that exact cream plush toy in ${costume}.

Preserve the ${source} face outline, bead-eye size and spacing, tiny stitched smile, cream hood contour, short curly sherpa texture, compact body, short limbs and standing front view. Change only clothing, headwear, accessories and the hand positions needed to hold the named props. Fit complete clothes over the ${source} body without lengthening its legs or changing the head-to-body ratio. Both hands remain simple rounded, fingerless fleece mittens: no fingers, thumbs, fingernails or smooth human skin. If the costume includes gloves, change only the mitten covering, never the hand shape; uncovered hands stay cream.

Keep the cream hood visible and the ${source} face recognizable. Any hats, bows, veils or earrings sit outside the hood without changing its shape or adding ears. Any glasses have clear lenses that leave both bead eyes visible. Wear any extra garment hood down behind the cream head hood. Keep the small props below the face. Do not add hair, facial hair, eyelashes, a nose, makeup, animal features, a different face or a different skin color. Costume references never replace the base with a human, animal or another mascot.

Keep realistic photographed plush material in every option, never a drawing or plastic figure. Every candidate should use the same character, costume, pose and style rather than proposing different designs. Show the full body with both feet visible on a plain white background. No text or logos.

${referenceCheck}Show native Muse avatar candidates for me to choose from. Do not select or activate a candidate automatically.`;
}

/** Prepare a guided Muse web handoff. Opening the URL never sends the message. */
export function buildMuseHandoff(character, persona = character?.persona) {
  if (!character) return null;
  const costumeRecipe = buildCostumeAvatarPrompt(character.id);
  const wigRecipe = buildWigAvatarPrompt(character.id);
  const catalogRecipe = CATALOG_COSTUMES.has(character.id)
    && typeof character.avatar?.costume === 'string' && character.avatar.costume.trim();
  if (!costumeRecipe && !wigRecipe && !catalogRecipe) return null;
  const personalityPrompt = compile(persona, 'muse').text;
  const avatarPrompt = costumeRecipe || wigRecipe || buildWardrobeAvatarPrompt(character.avatar.costume);
  // The compiler omits its neutral "sparing" rule. State it here so switching
  // from a no-emoji character actually replaces that saved preference.
  const emojiSetting = persona.style?.emoji === 'never' ? 'its explicit no-emoji setting'
    : persona.style?.emoji === 'sparing' ? 'permission to use emoji sparingly (replace any previous no-emoji preference)'
      : 'the emoji preference stated below';
  const verifySavedStyle = '\nBefore generating the avatar, re-read your saved identity/vibe, current personality style and standing personality preferences in memory. Make those settings agree with the personality below, replacing conflicting previous-character settings while preserving unrelated content. Changing only the name while leaving a previous character\'s vibe is not sufficient. Check again after your final edit; correct any stale character voice or emoji preference. If you cannot save a consistent personality, explain that and stop instead of reporting the combo as complete.\n';
  const prompt = `I'd like to set up this Persa character combo for my Muse: ${character.name}. Apply the personality below as my style preferences and offer the matching native avatar candidates for me to choose from.

PERSONALITY SETUP
Replace my previous character voice, tone and emoji preferences with this personality, including ${emojiSetting}. Do not blend in a previous character's style. Preserve unrelated preferences, memories, permissions and account settings, including my account display name. Treat the character name as a fictional style preset, not a claim to be that person. Tell me which style settings you saved and clearly say if you cannot save them.${verifySavedStyle}

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
    version: costumeRecipe ? 'muse-reference-costume-v4' : wigRecipe ? 'muse-reference-wig-v3' : character.id === 'the-rock' ? 'muse-reference-wardrobe-v5' : 'muse-reference-wardrobe-v2',
    characterId: character.id,
    prompt,
    url: url.href,
    baseUrl: BASE_URL,
    baseSha256: BASE_SHA256,
    personalityPrompt,
    avatarPrompt
  };
}
