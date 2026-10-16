// Three user-approved hairless costume studies, separate from wig experiments.
// Recognition comes from clothing and props while the shared face stays unchanged.
export const costumeStyles = Object.freeze({
  "harry-potter": {
    "variant": "school",
    "costume": "One black open school robe with deep burgundy lining and its garment hood down behind the body; a charcoal-gray V-neck sweater over a white collared shirt; one burgundy-and-gold striped tie; one long knitted burgundy scarf with wide golden-yellow horizontal bands; full-length black trousers and two black school shoes. Wear exactly one pair of large thin black circular glasses with clear lenses and both original bead eyes fully visible. Hold one slim brown wand diagonally down in one cream fleece mitten, and exactly one tiny golden ball with two small gold wings in the other mitten below the chest. The wings belong only to the held ball, never to the head or body. No other props, crests, letters or markings."
  },
  "michael-jackson": {
    "variant": "white-suit",
    "costume": "One white felt fedora with a crisp broad black band, tilted slightly while staying above the eyes; one complete white pinstriped suit with a fitted jacket and full-length white trousers; a vivid blue collared shirt and a narrow white tie; one plain black fabric armband around the upper jacket sleeve; white ankle socks and two black-and-white loafers. One cream fingerless fleece mitten lightly touches the hat brim while the other rests at the hip. Keep the original compact plush body and both feet on the ground. No sequined glove, microphone, logos, extra jewelry or extra props."
  },
  "joker": {
    "variant": "card",
    "costume": "One long rich-purple tailored coat with broad lapels and two visible tails; matching purple trousers covering both legs; a fitted deep-green waistcoat with three small buttons over a pale-lavender collared shirt; one small dark-purple necktie; and two black shoes. Exactly one cream fingerless fleece mitten holds one oversized ivory playing card below the chest. The card shows a single simple purple-and-green three-pointed jester-hat emblem, with no words, letters, numbers, faces or extra symbols. The other mitten rests at the side. Keep the cream head hood uncovered: no top hat or other headwear. No bow tie, extra cards, cane or additional props."
  }
});

function visualPrompt(style, textOnly=false){return `${textOnly?'Create a Muse avatar from this text-only description.':'Generate four native Muse avatar candidates using the downloaded image as the character reference.'}

SHARED HAIRLESS PLUSH CHARACTER
${textOnly?'Use one cream sherpa plush companion with a wide peach face, small black bead eyes, a tiny stitched smile, rosy cheeks, a broad round cream hood, compact body and short limbs.':'Use the downloaded cream sherpa plush toy as the same character. Preserve its wide peach face outline, small black bead-eye size and spacing, tiny stitched smile, rosy cheeks, broad round cream hood, compact body and short limbs.'} Preserve the full continuous cream hood rim around the face and chin. Keep the entire head hairless. Do not add hair, a wig, a human scalp, facial hair, eyebrows, eyelashes, a nose, scars, makeup, face paint, animal ears or a different face or skin color.

CHARACTER COSTUME
${style.costume}

FIT AND PRESENTATION
Recognition comes only from the specified clothing, headwear and props. Fit complete clothes over the same short plush body without lengthening the legs or changing its proportions. Both hands remain simple rounded fingerless fleece mittens: no fingers, thumbs, fingernails or smooth skin. Only an explicitly specified mitten cover may change the hand covering; uncovered hands remain cream. Headwear stays outside the existing hood, and its brim must leave both eyes and the mouth visible. Keep all props below the face. Do not add accessories beyond the specified inventory.

Photographed soft plush collectible with tactile cloth, a full body, complete headwear and both feet visible. Center the figure on a plain white background with soft studio lighting and a gentle ground shadow. All candidates use this same costume, materials and simple pose; do not propose alternate designs or art styles. No text, logos, interface elements or watermark. Show native selectable candidates; do not select or activate one.`;}

export function buildCostumeAvatarPrompt(id, { textOnly = false } = {}) {
  if (!Object.hasOwn(costumeStyles, id)) return null;
  return visualPrompt(costumeStyles[id], textOnly);
}
