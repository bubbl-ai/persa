// One shared character, with a wardrobe for each personality preset.
export const avatarDesign = Object.freeze({
  id: 'muse-costumes-v1',
  baseId: 'persa-muse-v1',
  basePreview: '/avatars/muse-costumes-v1/base.png',
  base: 'One small cream plush companion with a large round hood framing a peach-colored round face, small glossy black eyes with tiny catchlights, a tiny simple smile, rosy cheeks, a compact rounded body, and short cream plush hands and feet. The hood has no animal ears. Keep this same face, hood, cream color, plush material, and body proportions for every costume.',
  framing: 'A full-body, front-facing collectible toy, centered in a square image at about 75% of the image height, with the entire head and feet visible. Use a seamless pale lilac background, soft studio lighting, and a subtle ground shadow.'
});

export const costumes = Object.freeze({
  'wednesday': 'a black dress with a crisp white collar, black ribbon bows attached to the hood, and a tiny black book',
  'taylor-swift': 'a shimmering lavender stage dress and a silver microphone',
  'mark-zuckerberg': 'a plain gray T-shirt, navy trousers, white sneakers, and a tiny closed silver laptop',
  'mona-lisa': 'an olive Renaissance gown and a dark sheer veil around the hood, with hands gently folded',
  'barbie': 'a bright pink dress, a pink bow on the hood, pink shoes, and a heart-shaped purse',
  'harry-potter': 'a black school robe, a burgundy-and-gold scarf, round glasses, and a tiny wand',
  'charlie-chaplin': 'a black bowler hat, an oversized black suit, a white shirt, a black bow tie, and a cane',
  'michael-jackson': 'a black fedora, a red stage jacket, black trousers, and one white glove',
  'olivia-rodrigo': 'a lilac jacket, a black pleated skirt, dark boots, and a small purple guitar',
  'marilyn-monroe': 'a white halter dress, white shoes, and pearl earrings',
  'drake': 'a navy puffer jacket, dark trousers, neutral sneakers, and headphones around the neck',
  'lionel-messi': 'a sky-blue-and-white striped football jersey, black shorts, football boots, and a small football',
  'kylie-jenner': 'a black tailored blazer outfit, black boots, and a tiny rose-colored makeup case',
  'mrbeast': 'a turquoise hoodie, dark trousers, sneakers, and a small gift box with a pink ribbon',
  'the-rock': 'a charcoal athletic T-shirt, black training trousers, trainers, and a tiny foam dumbbell',
  'spongebob': 'a yellow knit vest over a white collared shirt, a red tie, brown shorts, white socks, and black shoes',
  'hello-kitty': 'a red bow beside the hood, red overalls, and a white shirt',
  'joker': 'a purple top hat and tailcoat, an orange waistcoat, a green bow tie, and green gloves'
});

export function avatarFor(id, name) {
  const costume = costumes[id];
  if (!costume) throw new Error(`Missing Muse costume: ${id}`);
  return {
    preview: `/avatars/${avatarDesign.id}/${id}.png`,
    designVersion: avatarDesign.id,
    baseId: avatarDesign.baseId,
    basePreview: avatarDesign.basePreview,
    costume,
    prompt: `Please create an avatar for my Muse: the same shared Muse-style plush companion dressed in a ${name}-inspired costume.\n\nSHARED BASE\n${avatarDesign.base}\n\nCOSTUME\nDress that companion in ${costume}. Change only its clothing, headwear, accessories, and the hand positions needed to hold the props. Keep the base character visible and recognizable. Do not add human hair, facial hair, makeup, a different skin color, animal features, a different body shape, or a real-person face.\n\nCOMPOSITION\n${avatarDesign.framing}\n\nThis is a costume interpretation for the ${name} personality preset, not a depiction of the actual person or an official character product. No text, logos, interface elements, or watermark.`
  };
}
