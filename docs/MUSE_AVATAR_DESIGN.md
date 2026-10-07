# Shared Muse costume collection

Direction approved October 6, 2026 (Asia/Taipei).

Each preset pairs a personality with the same recognizable Muse-style plush
companion wearing a different costume. The collectible-series analogy describes
a shared character and changing wardrobe. It replaces the earlier approach of
giving each person or franchise character a different face and body.

## Shared design

The base is a cream plush toy with a round hood, peach face, small glossy black
eyes, a tiny smile, rosy cheeks, a compact body, and stubby hands and feet. Its
face, proportions, material, and cream color stay consistent. Clothing,
headwear, accessories, and the hand positions needed for props may change.
The images use the same front-facing studio composition and pale lilac backdrop.

The base is Persa's Muse-inspired illustration, not a native avatar exported
from Muse. Its source reference was Muse's observed default avatar. The same
generated master image is supplied to every costume edit.

The catalog owns these public identifiers:

- Design version: `muse-costumes-v1`.
- Base: `persa-muse-v1`.
- Assets: `web/avatars/muse-costumes-v1/`.
- Prompt definitions and wardrobe: `characters/avatar-design.js`.

## Wardrobe

| Preset | Costume cues |
| --- | --- |
| Mark Zuckerberg | Gray T-shirt, navy trousers, silver laptop |
| Taylor Swift | Lavender stage dress, silver microphone |
| Charlie Chaplin | Bowler hat, black suit, bow tie, cane |
| Michael Jackson | Fedora, red stage jacket, one white glove |
| Olivia Rodrigo | Lilac jacket, pleated skirt, purple guitar |
| Marilyn Monroe | White halter dress, pearl earrings |
| Drake | Navy puffer jacket, headphones |
| Lionel Messi | Blue-and-white football kit, football |
| Kylie Jenner | Black blazer outfit, rose makeup case |
| MrBeast | Turquoise hoodie, gift box |
| The Rock | Charcoal training outfit, small foam dumbbell |
| Mona Lisa | Olive Renaissance gown, veil, folded hands |
| Barbie | Pink dress, bow and shoes, heart purse |
| Wednesday Addams | Black dress, white collar, ribbon bows, book |
| Harry Potter | School robe, burgundy/gold scarf, glasses, wand |
| SpongeBob | Yellow vest, white shirt, red tie, brown shorts |
| Hello Kitty | Red bow and overalls |
| The Joker | Purple top hat and tailcoat, orange waistcoat, green bow tie |

There are 18 candidates; the user has not chosen the launch ten. Personality
definitions and authored sample replies are unchanged. Existing saved favorites
and tone settings continue to use the same character IDs and storage key.

## Provenance and failure handling

The built-in image-generation tool creates the master and costume edits. Exact
art prompts and outcomes are recorded in `characters/image-generation.json`
and `characters/avatar-design-generation.json`. These art-generation prompts
are distinct from the instructions copied into Muse.

Original image attempts, refusal outcomes, and retired replacements are retained.
New artwork has a versioned path; an old provenance record never points at a
newly overwritten image. Current replacement records must match their preset,
base, and design version. A missing or declined costume becomes explicitly
unavailable, with personality and prompt copying still accessible. It must not
fall back to a previous human likeness or a different mascot. The build copies
only currently referenced costume images and the shared base into the published
output; historical source artwork can remain in the repository without shipping.

## Muse integration limits

The website copies text describing the common base and costume. It does not
transfer the reference image into Muse or directly install the displayed avatar.
Independent Muse generations may change the face, proportions, or outfit even
when supplied the same description. Never promise identical previews or a fixed
avatar across generations.

The [initial](MUSE_VALIDATION.md) and [batch](MUSE_BATCH_VALIDATION.md) Muse tests
used earlier likeness-based prompts. The new costume prompts have not been
tested in a signed-in Muse session. The earlier stale emoji preference finding
for Barbie and SpongeBob also remains unresolved; this avatar redesign does not
change the personality compiler. Mobile Muse and a direct import route remain
unverified.

## Verification — October 6, 2026

All 18 costume previews and the shared base were generated with the built-in
image tool and visually reviewed. The MrBeast hoodie required one targeted edit
to remove an unrequested logo; both the original output and edit prompt are
recorded. The deployment build contains only these 19 active images.

- `npm test`: 72 tests passed. The 11 avatar tests passed again after final
  artwork integration. Build, JavaScript syntax, and whitespace checks passed.
- Chrome browser checks: all 18 cards and images rendered; combined, avatar-only,
  and personality-only clipboard text matched the catalog/compiler for every
  preset (54 copy checks).
- JSON download retained the persona plus the base/design IDs, costume, and
  avatar prompt. Existing saved IDs and tone settings survived reload; reset
  restored the preset defaults.
- Desktop (1440px) and mobile (390px and 320px) layouts were reviewed. A 320px
  header overflow with a saved-count badge was fixed; gallery and dialog had
  no horizontal overflow in the final checks.
- A simulated image-request failure kept copying usable, and Retry image
  restored the preview. An explicitly unavailable costume also kept its own
  prompt accessible. No browser page errors were observed.
- All 18 personality definitions and authored sample replies matched the
  pre-redesign snapshot.

Browser checks used a temporary Playwright harness outside the repository.
They cover Persa's website, not the new prompts inside Muse.

## Publication status

Published successfully on October 7, 2026 (Asia/Taipei). The retry saved Sites
version 4 and the native deployment result confirmed `succeeded` at the existing
[public website](https://persa-muse-characters.archerx03.chatgpt.site).

The deployed source commit is `f2549d691fcff1d1048423ab40bc2b27a2fb1397`.
The uploaded archive contains all 18 costume previews plus the shared base,
with no retired likeness images. The public audience is unchanged.

The October 6 attempts had failed during upload, including two confirmed
blob-upload timeouts. That upload blocker is now resolved. The tested website
code and artwork were reused; this retry did not add live Muse validation.
