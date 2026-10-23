import { wigStyles } from '../src/muse-wigs.js';
import { costumeStyles, buildCostumeAvatarPrompt } from '../src/muse-costume-recipes.js';
import { buildWardrobeAvatarPrompt } from '../src/muse-handoff.js';

// One shared character, with a wardrobe for each personality preset.
export const avatarDesign = Object.freeze({
  id: 'muse-costumes-v1',
  baseId: 'persa-muse-v1',
  basePreview: '/avatars/muse-costumes-v1/base.png',
  base: 'One small cream plush companion with a large round hood framing a peach-colored round face, small glossy black eyes with tiny catchlights, a tiny simple smile, rosy cheeks, a compact rounded body, and short cream plush hands and feet. The hood has no animal ears. Keep this same face, hood, cream color, plush material, and body proportions for every costume.',
  framing: 'A full-body, front-facing collectible toy, centered in a square image at about 75% of the image height, with the entire head and feet visible. Use a seamless pale lilac background, soft studio lighting, and a subtle ground shadow.'
});

// Curated costumes live beside their native recipe; retained costumes stay here.
export const costumes = Object.freeze({
  'the-rock': 'a soft black knit turtleneck with its collar entirely below the cream chin rim, one short gold chain on the chest, light blue denim trousers fitted to the existing stubby legs, a compact dark brown leather-look zippered waist bag centered on the front with its belt at the waist, and small black shoes; both cream mitten hands remain visible and relaxed beside the bag; no dumbbell, gym T-shirt or muscles',
  'spongebob': 'a yellow knit vest over a white collared shirt, a red tie, brown shorts, white socks, and black shoes',
  'hello-kitty': 'a red bow beside the hood, red overalls, and a white shirt',
  ...Object.fromEntries(Object.entries(costumeStyles).map(([id, style]) => [id, style.costume])),
  ...Object.fromEntries(Object.entries(wigStyles).map(([id, style]) => [id, style.costume]))
});

export function avatarFor(id, name) {
  const costumeStyle = Object.hasOwn(costumeStyles, id) ? costumeStyles[id] : null;
  const wig = Object.hasOwn(wigStyles, id) ? wigStyles[id] : null;
  const costume = costumeStyle?.costume || wig?.costume || costumes[id];
  if (!costume) throw new Error(`Missing Muse costume: ${id}`);
  if (id === 'the-rock') {
    return {
      preview: '/avatars/muse-rock-v4/the-rock.png',
      designVersion: 'muse-rock-v4',
      baseId: avatarDesign.baseId,
      basePreview: avatarDesign.basePreview,
      costume,
      previewSource: 'imagegen',
      previewSelection: 'design-preview',
      prompt: `Please create a ${name}-inspired costume for my Muse. This is a text-only description of the avatar.\n\nSHARED BASE\n${avatarDesign.base}\n\n${buildWardrobeAvatarPrompt(costume, { textOnly: true })}`
    };
  }
  if (costumeStyle) {
    return {
      preview: `/avatars/muse-costume-cues-v3/${id}.webp`,
      designVersion: 'muse-costume-cues-v3',
      baseId: avatarDesign.baseId,
      basePreview: avatarDesign.basePreview,
      costume,
      costumeVariant: costumeStyle.variant,
      previewSource: 'native-muse',
      previewSelection: 'curated',
      prompt: `Please create a ${name}-inspired costume for my Muse. Keep this same face, hood, cream color, plush material, and body proportions for every costume.\n\n${buildCostumeAvatarPrompt(id, { textOnly: true })}`
    };
  }
  if (wig) {
    return {
      preview: `/avatars/muse-wigs-v2/${id}.webp`,
      designVersion: 'muse-wigs-v2',
      baseId: avatarDesign.baseId,
      basePreview: avatarDesign.basePreview,
      costume,
      hairstyle: wig.hair,
      hairstyleVariant: wig.variant,
      previewSource: 'native-muse',
      previewSelection: 'curated',
      prompt: `Please create an avatar for my Muse: the same shared Muse-style plush companion wearing a ${name}-inspired costume and removable wig. This is a text-only description of the avatar.\n\nSHARED BASE\n${avatarDesign.base}\n\nCOSTUME\nDress that companion in ${costume}.\n\nREMOVABLE WIG\n${wig.hair}\n\nWIG PLACEMENT\nFit the wig outside the existing cream hood as a separate costume accessory. Keep a broad continuous cream U-shaped rim visible along both cheeks and below the chin. Side hair passes behind this rim, outside the face opening. Only explicitly requested bangs may overlap the upper peach forehead; leave the eyes, cheeks and mouth clear. Reduce wig volume rather than changing the face, head size, body or clothes. Do not add a human face or scalp, nose, eyebrows, eyelashes, makeup, facial hair, animal ears, fingers or a different skin color. Keep both hands rounded fingerless cream fleece mittens.\n\nCOMPOSITION\nPhotographed plush collectible toy, full body with the complete wig and both feet in frame, centered on plain white, soft studio light. Keep the same costume, hairstyle, pose and material in every option. No text, logos or watermark.\n\nThis is a costume interpretation for the ${name} personality preset, not a depiction of the actual person or an official character product. Keep my current avatar until I select a candidate.`
    };
  }
  return {
    preview: `/avatars/${avatarDesign.id}/${id}.png`,
    designVersion: avatarDesign.id,
    baseId: avatarDesign.baseId,
    basePreview: avatarDesign.basePreview,
    costume,
    prompt: `Please create an avatar for my Muse: the same shared Muse-style plush companion dressed in a ${name}-inspired costume.\n\nSHARED BASE\n${avatarDesign.base}\n\nCOSTUME\nDress that companion in ${costume}. Change only its clothing, headwear, accessories, and the hand positions needed to hold the props. Keep the base character visible and recognizable. Do not add human hair, facial hair, makeup, a different skin color, animal features, a different body shape, or a real-person face.\n\nCOMPOSITION\n${avatarDesign.framing}\n\nThis is a costume interpretation for the ${name} personality preset, not a depiction of the actual person or an official character product. No text, logos, interface elements, or watermark.`
  };
}
