// Shared visual instructions for native preview trials and the Muse combo handoff.
// Curated previews are selected examples; a new generation can vary.
export const wigStyles = Object.freeze({
  "taylor-swift": {
    "variant": "fiber",
    "costume": "one shimmering lavender stage dress with shoulder straps, a fitted bodice covering the whole torso and one continuous skirt ending above the feet, and one silver microphone held below the face in a cream fleece mitten",
    "hair": "One removable golden-blonde synthetic doll-fiber wig: a low-volume crown, straight neat bangs across only the upper forehead, and exactly two shoulder-length softly wavy side sections. Group the fibers into tidy locks. The bangs stop at least one original bead-eye diameter above the eyes. The side sections pass behind the cream cheek rim. No bows, clips or other fasteners."
  },
  "wednesday": {
    "variant": "textile",
    "costume": "one black dress with a fitted bodice covering the whole torso, a crisp white Peter Pan collar, one continuous skirt ending above the feet, and one tiny black book held below the face in a cream fleece mitten. No bows attached to the hood",
    "hair": "One removable jet-black sewn felt-and-yarn hairpiece with a center seam on a shallow fitted felt crown cap and exactly two narrow braided yarn cords, one on each side, ending near the waist. The cords pass behind the cream cheek rim. Secure each braid end with one plain slim black band: exactly two bands total. The felt/yarn construction should read as a toy wig accessory. No fringe, bows, clips, extra braids or loose tendrils."
  },
  "mark-zuckerberg": {
    "variant": "fiber",
    "costume": "a plain gray T-shirt covering the whole torso, full-length navy trousers covering both legs, white sneakers, and one tiny closed silver laptop with a completely blank unmarked lid held below the face in a cream fleece mitten",
    "hair": "One removable medium-brown synthetic doll-fiber wig: a shallow cap of tiny compact short curls covering the crown only, with a clean curved hairline entirely above the peach forehead. Keep the curls close to the original rounded hood silhouette. No bangs, sideburns, facial hair, loose locks or accessories."
  },
  "mona-lisa": {
    "variant": "fiber",
    "costume": "an olive Renaissance gown and a dark sheer veil around the hood, with hands gently folded",
    "hair": "One removable medium-brown synthetic doll-fiber wig with a tidy center part and exactly two long gently waved side sections reaching the chest. Keep the crown low and rounded. Place the existing dark sheer veil over the back of this wig; side hair stays behind the cream cheek rim. No bangs, braids, hairbands or extra locks."
  },
  "barbie": {
    "variant": "fiber",
    "costume": "one bright pink dress, pink shoes, a heart-shaped purse and exactly one pink bow tying the wig ponytail",
    "hair": "One removable golden-blonde synthetic doll-fiber wig with a smooth low crown, one neat swept-back front section and one high ponytail curving down behind the right side of the head to shoulder height. Use the single pink costume bow as the ponytail tie; no second bow. Keep all hair above the peach forehead and behind the cream cheek rim."
  },
  "charlie-chaplin": {
    "variant": "fiber",
    "costume": "one black bowler hat, a complete black two-piece suit consisting of a jacket and full-length black trousers covering both legs down to the ankles, a white shirt, a black bow tie, two black shoes covering the feet, and one slim black cane held in a cream fleece mitten below the face. Both trouser legs must be clearly visible between the jacket hem and shoes; no bare plush thighs or bare feet",
    "hair": "One removable black synthetic doll-fiber wig with two small tidy softly waved side sections visible below the bowler hat. The hat sits over the low wig crown; the short waves stay behind the cream cheek rim and end at cheek level. No forehead fringe, sideburns, moustache or other facial hair."
  },
  "olivia-rodrigo": {
    "variant": "fiber",
    "costume": "a lilac jacket, a black pleated skirt, dark boots, and a small purple guitar",
    "hair": "One removable dark-chocolate-brown synthetic doll-fiber wig with a clean center part, a shallow smooth crown and exactly two long straight side sections reaching the waist. The side sections stay behind the cream cheek rim and over the back of the shoulders. No bangs, braids, hairclips, bows or extra locks."
  },
  "marilyn-monroe": {
    "variant": "fiber",
    "costume": "a white halter dress, white shoes, and pearl earrings",
    "hair": "One removable platinum-blonde synthetic doll-fiber wig in a short curled bob: a shallow crown, one smooth side part, softly rolled waves above the forehead and two rounded curled side sections ending at chin height behind the cream cheek rim. Keep the peach forehead and both eyes clear. Pearl costume earrings clip to the outside of the cream hood below the curls without adding ears. No extra jewelry or hair accessories."
  },
  "drake": {
    "variant": "textile",
    "costume": "a navy puffer jacket, dark trousers, neutral sneakers, and headphones around the neck",
    "hair": "One removable black sewn loop-pile yarn hairpiece forming a very short close-cropped crown cap. Use densely packed tiny yarn loops, a low rounded silhouette and a clean curved front edge entirely above the peach forehead. The material reads as a plush toy accessory. No bangs, loose locks, sideburns, beard or other facial hair."
  },
  "lionel-messi": {
    "variant": "fiber",
    "costume": "a sky-blue-and-white striped football jersey, black shorts, football boots, and a small football",
    "hair": "One removable dark-brown synthetic doll-fiber wig: a shallow crown with compact short hair swept gently to one side, a small tidy side part and short tapered sides above the cream cheek rim. All hair remains above the peach forehead. No long locks, eyebrows, sideburns, beard or other facial hair."
  },
  "kylie-jenner": {
    "variant": "fiber",
    "costume": "a black tailored blazer outfit, black boots, and a tiny rose-colored makeup case",
    "hair": "One removable jet-black synthetic doll-fiber wig with a clean center part, a smooth shallow crown and exactly two sleek straight side sections reaching the chest. The sections pass behind the cream cheek rim and rest over the back of the shoulders. No bangs, braids, hairclips, bows or extra locks."
  },
  "mrbeast": {
    "variant": "fiber",
    "costume": "a turquoise hoodie, dark trousers, sneakers, and a small gift box with a pink ribbon",
    "hair": "One removable light-brown synthetic doll-fiber wig with a low rounded crown, a small side part and compact short side-swept locks. Keep the hairstyle close to the hood silhouette and entirely above the peach forehead. No falling fringe, facial hair, hair accessories or long side sections."
  }
});

export function buildWigAvatarPrompt(id) {
  if (!Object.hasOwn(wigStyles, id)) return null;
  const style = wigStyles[id];
  return `Generate four native Muse avatar candidates using the downloaded image as the character reference.

FIXED PLUSH CHARACTER
Use the downloaded cream plush toy as the same base character in all candidates. Preserve its wide peach face outline, small black bead-eye size and spacing, tiny stitched smile, rosy cheeks, cream sherpa material, compact body, short limbs and standing front view. Both hands remain rounded fingerless cream fleece mittens. Do not add a human face or scalp, nose, eyebrows, eyelashes, makeup, facial hair, animal ears, extra cream protrusions, fingers or a different skin color. Fit the costume to the original body.

COSTUME
${style.costume}.

REMOVABLE WIG
${style.hair}

WIG PLACEMENT
The wig is a separate costume accessory fitted over the outside of the existing cream hood; it does not replace the hood or change the face. Preserve a broad continuous cream U-shaped front rim along both cheeks and below the chin. At eye level, each visible cream cheek strip is at least as thick as one original bead eye. Place side hair behind this front rim, outside the face opening. Only explicitly requested bangs may overlap the upper peach forehead; all hair leaves the eyes, cheeks and mouth clear. Keep the hood round beneath the wig. If space is tight, reduce wig volume rather than changing the face, head size, body or clothes. Do not invent additional accessories or features.

COMPOSITION
Photographed plush collectible toy, full body with complete wig and both feet in frame, centered on plain white, soft studio light. All four candidates use this same costume, wig silhouette, pose and material; do not offer alternate hairstyles or art styles. No text, logos or watermark. Show native selectable candidates and keep the currently selected avatar unchanged.`;
}
