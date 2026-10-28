# Shared Muse costume collection

Shared-base direction approved October 6, 2026; curated wigs and a separate
costume-only follow-up authorized October 16, 2026 (Asia/Shanghai). These
changes are published at [persa.bubblai.com](https://persa.bubblai.com). The
[costume follow-up](MUSE_COSTUME_RECOGNITION.md) records current curation and
deployment status; the earlier [wig rollout](MUSE_WIG_ROLLOUT.md) retains its
original evidence. The [October 23 feedback update](#product-feedback--october-23-2026)
is published, with final delivery checks completed October 24.
The [October 28 Kylie runway update](#kylie-runway-update--october-28-2026)
is published and verified; its native Muse recipe remains unverified.

Each preset pairs a personality with the same recognizable Muse-style plush
companion wearing a different costume. The collectible-series analogy describes
a shared character and changing wardrobe. It replaces the earlier approach of
giving each person or franchise character a different face and body.

## Shared design

The base is a cream plush toy with a round hood, peach face, small glossy black
eyes, a tiny smile, rosy cheeks, a compact body, and stubby hands and feet.
Recipes preserve that identity while changing clothing, headwear, accessories
and the hand positions needed for props. Twelve presets now specify removable
costume wigs over the hood, keeping a broad cream cheek/chin rim and clear eyes.
The three new costume-only recipes keep the complete hood hairless and use
clothing, headwear and props for recognition. Current recipes request a
full-body studio portrait on white. Selected outputs may differ; the retained
PNG artwork keeps its original pale lilac background. Generated details can vary.

The October 15 [wig experiment](MUSE_WIG_STABILITY.md) compared doll-fiber and
sewn felt/yarn constructions, then repeated selected recipes for Taylor,
Wednesday and Mark. The [curated rollout](MUSE_WIG_ROLLOUT.md) keeps those visual
recipes and adds nine more eligible presets. Selecting a useful native preview
does not establish repeated stability, exact compliance or identical future
generation. Preserve the experimental results separately from curation.

SpongeBob and Hello Kitty keep their existing hairless designs. The
October 23 update gives The Rock a new hairless turtleneck/chain/waist-bag
costume while preserving the shared face and compact plush proportions.
The October 28 Kylie update retains her black fiber wig and changes only her
wardrobe to a crystal-covered toy bodice, white skirt and feather wings; its
generated preview is separate from the earlier native wig evidence.
Harry Potter, Michael Jackson and Joker receive a separately approved
[costume-only follow-up](MUSE_COSTUME_RECOGNITION.md): no wig, hair, facial hair,
makeup, scars or facial changes. Their older blocked hair requests remain
preserved. Clothing/prop curation is not a blind recognition study or new
repeatability result.

The base is Persa's Muse-inspired illustration, not a native avatar exported
from Muse. Its source reference was Muse's observed default avatar. The same
generated master remains the reference for native costume/wig generation.

The catalog owns these public identifiers:

- Preview design versions in the current source collection: `muse-wigs-v2` for 11 native wig previews, `muse-costume-cues-v3` for three native hairless costumes, `muse-rock-v4` for the generated Rock design, `muse-kylie-runway-v5` for the generated Kylie design, and `muse-costumes-v1` for two retained PNGs.
- Base: `persa-muse-v1`.
- Native wig assets: original 1600px `.webp` outputs under `web/avatars/muse-wigs-v2/`, copied unchanged after curation.
- Native hairless costume assets: unchanged selected `.webp` outputs under `web/avatars/muse-costume-cues-v3/`.
- New Rock preview: `web/avatars/muse-rock-v4/the-rock.webp`, a compressed display derivative of the original generated `.png` beside it. The built-in image tool used the shared base; this is not native Muse output.
- New Kylie preview: `web/avatars/muse-kylie-runway-v5/kylie-jenner.webp`, a display derivative of the unchanged generated `.png` beside it. Its provenance is `imagegen` / `design-preview`, not native Muse output. The former native Kylie WebP under `muse-wigs-v2` remains unchanged as history.
- Retained PNGs (SpongeBob/Hello Kitty) and shared base: `web/avatars/muse-costumes-v1/`; superseded artwork, including the October 6 Rock costume, remains historical source material.
- Canonical wig costumes, hairstyles and visual instructions: `src/muse-wigs.js`.
- Canonical hairless recognition recipes and text-only fallback: `src/muse-costume-recipes.js`.
- Catalog preview metadata and text-only prompts: `characters/avatar-design.js`.

## Wardrobe

| Preset | Costume cues | Requested hair |
| --- | --- | --- |
| Mark Zuckerberg | Gray T-shirt, navy trousers, silver laptop | Compact brown fiber curls |
| Taylor Swift | Lavender stage dress, silver microphone | Blonde fiber bangs and shoulder waves |
| Charlie Chaplin | Bowler hat, black suit, bow tie, cane | Short black waves below the hat |
| Michael Jackson | White pinstriped suit, blue shirt, white fedora with black band, black armband and two-tone loafers | No hair or facial changes |
| Olivia Rodrigo | Lilac jacket, pleated skirt, purple guitar | Long straight dark-brown fiber wig |
| Marilyn Monroe | White halter dress, pearl earrings | Short platinum-blonde curled bob |
| Drake | Navy puffer jacket, headphones | Close-cropped black loop-pile cap |
| Lionel Messi | Blue-and-white football kit, football | Short brown side-swept fiber wig |
| Kylie Jenner | Opaque silver crystal-covered toy bodice, short crystal fringe, yellow center jewel, white satin mini skirt, large white feather wings, silver shoes | Sleek black center-parted fiber wig; October 28 outfit update |
| MrBeast | Turquoise hoodie, gift box | Short light-brown side-swept fiber wig |
| The Rock | Black turtleneck, gold chain, brown waist bag, light-blue denim, black shoes | Hairless by design; October 23 update |
| Mona Lisa | Olive Renaissance gown, veil, folded hands | Center-parted brown waves beneath the veil |
| Barbie | Pink dress and shoes, heart purse, one ponytail bow | Blonde ponytail |
| Wednesday Addams | Black dress, white collar, book; no hood bows | Two black textile braids with plain bands |
| Harry Potter | Burgundy-lined school robe, striped tie/scarf, clear round glasses, wand and small winged golden ball | No hair or facial changes |
| SpongeBob | Yellow vest, white shirt, red tie, brown shorts | Hairless by design |
| Hello Kitty | Red bow and overalls | Hairless by design |
| The Joker | Purple coat/trousers, green waistcoat, lavender shirt, playing card with a simple jester-hat emblem; no headwear | No hair or facial changes |

There are 18 candidates; the user has not chosen the launch ten. Personality
definitions and authored sample replies are unchanged. Existing saved favorites
and tone settings continue to use the same character IDs and storage key.

## Website presentation — October 10, 2026

The approved spotlight carousel is the homepage. Its white stage has no border
or enclosing box, and the selected preset's three personality adjectives appear
at the bottom of the stage. It slides static costume portraits into the center,
dims neighboring portraits, and fades a subtle spotlight as the selected
character arrives. There is no character gesture, singing, speech, or audio.
Reduced-motion preferences disable the transition. All 18 character tiles
appear directly below the spotlight, with the header's **All characters** link
scrolling to them. The standalone full grid and saved collection remain at
`/collection.html`; the former `/spotlight.html` demo redirects to the homepage.

In the October 10 presentation, each stage selection used the existing
personality and avatar prompt. **Use in Muse**, **Tune personality**, and the heart shared the same
catalog, controls, dialogs, and saved settings as the grid. Saving from either
view updates both while preserving the selected stage character and originating
control's focus. This presentation change generated no new artwork and changed
no personality definitions or Muse avatar prompts. The October 10 layout
passed all 72 tests, build and syntax checks, and desktop/mobile browser checks
for all 18 previews, adjectives, shared saves, focus, setup copying, and image
recovery. See the [website verification record](../README.md#website-verification).
This release uses the existing main-branch Vercel workflow and includes no new
signed-in Muse validation.

## Mobile spotlight — October 19, 2026

This interaction update was published on October 21 at
[persa.bubblai.com](https://persa.bubblai.com). The existing swipe
detector only changed the character after release; portraits now follow the
finger or mouse during a horizontal drag and snap on release. A short drag
returns to the same character, while a deliberate swipe or quick flick moves
one position. The collection still wraps between its first and last presets.
The swipe/drag hint sits directly below the stage, ahead of the character
details and lower navigation controls.

The stage uses horizontal gesture detection while leaving vertical page
scrolling and pinch zoom to the browser. Cancellation, loss of pointer capture,
window blur, resize and direct character selection clear the drag offset.
Only the stage presentation moves: selected metadata, Muse links, tuning and
saving still use the shared controller. Arrows, keyboard controls and the
picker remain alternatives; reduced-motion preferences remove transitions.

Verification: **29/29 browser checks passed** in Chromium: 22 touch checks
at 390px/320px and seven additional gesture/desktop checks at 1440px.
They cover movement during the drag, both directions, wraparound, snapback,
quick flicks, vertical/diagonal page scrolling, cancellation, a second touch,
loss of pointer capture, rapid swipes, mouse dragging, reduced motion,
keyboard/picker/arrows, saved selection/DOM/focus and layout overflow.
Actual touch input exposed an initial pointer-capture transfer bug; it was
fixed and the touch suite rerun successfully. The final checks reported no
browser errors. These are browser-emulated phone interactions, not physical
iPhone/Safari validation; native pinch-zoom behavior was not measured.

The website build, JavaScript syntax checks, **89/89 Node tests** and
`git diff --check` pass. Screenshots and the temporary browser harness are
stored outside Git under `persa-test-results/2026-10-19-mobile-swipe/`.
No avatar assets, character prompts, personality behavior or Muse account
settings changed. The October 19 local validation ended before publication.

### Publication — October 21, 2026

Source [`06658d9`](https://github.com/bubbl-ai/persa/commit/06658d9b8487f3f4b6c3ffbd1f347ca890fe15ac)
was pushed to main. The [Vercel deployment](https://github.com/bubbl-ai/persa/actions/runs/39527697323) and
[Node 20/22/24 plus package-install checks](https://github.com/bubbl-ai/persa/actions/runs/39527697318) both succeeded.
All 21 live checks passed. Chromium mobile emulation at 390px and 320px
verified that portraits follow touch input, swipes change the selected
character, short drags snap back, vertical
page scrolling still works, and the hint is visible next to the stage.
The served HTML, spotlight JavaScript and CSS match the verified build;
the selected character's prepared Muse link stays in sync. No Muse message
was sent during these website checks. Physical iOS/Safari remains unverified.
Evidence is saved outside Git under
`persa-test-results/2026-10-21-swipe-publication/`.

## Product feedback — October 23, 2026

Status: published at [persa.bubblai.com](https://persa.bubblai.com); final live
delivery verification completed October 24, 2026 (Asia/Shanghai).
This update addresses four reviewed product questions while retaining all 18
presets, the shared Muse base, existing personality definitions and saved IDs.

### Explain Persa and the next action

The earlier homepage led with a slogan and the spotlight. The revised hero
explains that Persa pairs a distinct personality with a matching Muse avatar
design, prepared as one curated character combo. It names what is included:
a voice, a look and one prepared combo. A visible section between the stage
and collection explains **Pick your combo → Open in Muse → Send, then select**.
The stage and collection remain the main browsing experience; no extra title
page or required onboarding dialog is introduced.

### Package the combo and verify the integration boundary

All 18 characters already had direct **Open in Muse** links. The update makes
that path clearer and presents the personality and avatar instructions as
one curated package. Copying, component prompts and downloads remain optional
under **Setup options**. The package does not claim limited availability,
an exclusive license, official affiliation or an exact avatar import.

One click prepares the combo in Muse; the user still presses **Send**, reviews
the generated options and clicks **Select**. An existing draft may prevent
prefill, so the optional complete-combo fallback remains. A signed-out Muse
check preserved the prompt parameter through the login route, but login was
not completed: completed-login transfer, native mobile use and automatic
application remain unverified. No Muse message was sent and no account
settings or avatar selection changed in this feedback check.

### Assess animation before adding it

The user asked to establish whether animation was needed before building it.
The existing carousel already moves the selected portrait, dims neighbors,
changes the spotlight and follows touch input. Extra motion does not explain
the product or make setup easier. The available art is static: whole-picture
sway or tilt would not provide an actual arm wave or microphone performance.
Believable gestures would require new animated assets and separate visual,
accessibility and loading checks. Character animation and audio are therefore
deferred; this update changes neither the stage motion nor reduced-motion
behavior.

### Make The Rock recognizable through wardrobe

The user approved replacing the generic charcoal gym outfit and dumbbell with
a black turtleneck, short gold chain, dark brown waist bag, light-blue denim
and black shoes. Recognition comes from those clothing cues. The same cream
hood, peach face, small eyes, smile, stubby hands and compact body remain;
the recipe adds no human face, hair or muscles.

The built-in image-generation tool produced one new preview from
`web/avatars/muse-costumes-v1/base.png`. The selected 1254px square PNG is
stored at `web/avatars/muse-rock-v4/the-rock.png` without modifying its bytes;
its SHA-256 is
`28b2bfdc28b3c55b46fc1d5a79af8e9ed6efcf9b4314468ed528dbd9eb85529b`.
The website serves a WebP display derivative at
`web/avatars/muse-rock-v4/the-rock.webp`: 115,762 bytes versus 1,876,418 bytes
for the original PNG (93.83% smaller), at the same 1254×1254 dimensions.
Encoding uses `cwebp` quality 85/method 6, with no cropping or resizing. The
original PNG remains unchanged; the derivative has minor texture smoothing
and retains the reviewed design. Its SHA-256 is
`b20bd9dd45a3b99538ed5cbc90653315702876493b4f843e2bf802e71bf02a2b`.
The exact generation prompt, reference, inspection and output hash are in
[`characters/image-generation.json`](../characters/image-generation.json),
under `id: "the-rock"` → `replacement`. The old gym preview and prompt remain
under `supersededReplacements`, with their existing asset path intact.

The catalog marks the new preview as `previewSource: imagegen` and
`designVersion: muse-rock-v4`. It is an intended design preview, not a native
Muse-generated result. The matching text-only recipe and complete combo use
the new wardrobe; only The Rock's handoff becomes `muse-reference-wardrobe-v5`.
The other 17 payloads retain their versions and contents. At the October 23
release, inventory was 15 curated native previews, this new generated Rock preview,
and two retained hairless PNGs. The October 16 published inventory remains
historical evidence of 15 native previews plus three retained PNGs.

The new Rock recipe has not been generated, selected or checked for
persistence inside Muse. This artwork review does not establish native
recognizability, repeated reliability or exact reproduction. Publication results are recorded below. Private
screenshots and test evidence stay outside Git under
`/Users/zachwang/bubbl/persa-test-results/2026-10-23-product-feedback/`.

### Live loading issue and display derivative

The first production smoke after source `407d5fa` passed 22/24 checks, including
eight served-file hashes, the homepage explanation, direct links and mobile
swiping. The original Rock PNG was valid but exceeded image-load timeouts at
1440px and 390px. Focused retries at a 45-second bound also timed out; direct
HTTP timing showed a slow download on the test connection. The 320px browser
check decoded all three image surfaces. This was a delivery-size issue rather
than invalid image content.

The follow-up changes only Rock's display format to WebP, preserves the source
PNG and records both assets in the manifest. All 18 complete handoff payloads
and versions remain unchanged by compression. The 30 focused asset/handoff
tests and website build passed after this change. Live verification of the
smaller image is recorded with the final publication result below. Initial
failures and timing evidence remain in the feedback evidence folder.

The WebP follow-up verified all nine Rock surfaces across three widths, but
cold desktop jumps directly to its tile still timed out on the test connection.
Selecting the same character on stage loaded it. This suggested request
contention; it was not a controlled causal benchmark. The next follow-up
limits tile requests to within 200px of the viewport with an intersection
observer, prioritizes visible tiles, and promotes the selected stage image
when its request already exists. Browsers without the observer retain native
lazy loading. Retry replacements and standalone collection rerenders register
with the same loader, while saved-state updates preserve existing tile nodes.
The 22 focused local loader checks passed: only three stage portraits were
requested initially, jumps skipped intermediate rows, all 18 portraits loaded
during normal scrolling, and retry/fallback/focus/observer cleanup worked.
Under an isolated 64KB/s + 100ms-latency browser throttle, Rock's request
started 40ms after the jump and decoded 16.1 seconds after navigation. This
is one scenario, not a guarantee across real networks. The successful live follow-up is recorded below.

### Local verification

The website build, JavaScript syntax and whitespace checks passed, along with
**91/91 Node tests** and **88/88 browser checks** at 1440px, 390px and 320px.
The browser matrix decoded all 18 portraits on the stage, tiles and detail
views at every width (162 surfaces), checked their 162 exact builder URLs,
and recovered three Rock image surfaces after an intentional load failure.
It verified the Rock's tone changes, copy/export agreement, saved tone after
reload, preview provenance, mobile drag/selection/snapback/cancellation,
vertical scrolling, keyboard/arrows, save focus and reduced motion.
There were no browser errors or overflow. The other 17 handoff payloads and
avatar metadata remained unchanged. These are Chromium checks; physical
Safari/iOS and native generation of the new Rock recipe remain unverified.
The browser harness intercepted Muse navigation and made no account changes.

### Publication and final live verification — October 24, 2026

The homepage and wardrobe update first shipped in `407d5fa`, followed by the
smaller display image in `2b2b113` and viewport loading in
[`c2534b3`](https://github.com/bubbl-ai/persa/commit/c2534b3b874c79707718b2393f55f9a3da293c33).
The [final source deployment](https://github.com/bubbl-ai/persa/actions/runs/39982893940) and
[Node 20/22/24 plus package checks](https://github.com/bubbl-ai/persa/actions/runs/39982893904) both passed.

The final loader smoke passed **11/11 checks** at 1440px, 390px and 320px:
served JavaScript matched the tested build; the initial page requested only
three stage portraits; all nine Rock tile/stage/detail surfaces decoded; and
all nine corresponding Muse URLs matched the shared builder. Cold direct
jumps started the Rock request within 19–22ms. Full image loading took
11.5–17.1 seconds on this connection, so these observations support improved
request scheduling, not instant loading or a latency guarantee across networks.

The earlier homepage, all-character URLs, mobile gesture and local 88-check
matrix remain separate evidence. Original PNG and first WebP timeout reports
are preserved alongside the successful follow-up, not overwritten. There
were no Muse account actions; new Rock generation in Muse, physical iOS/Safari
and completed-login transfer remain unverified. Evidence remains in the
original `persa-test-results/2026-10-23-product-feedback/` task folder.

## Kylie runway update — October 28, 2026

**Status: published and verified October 28; native Muse recipe unverified.**
This update changes Kylie's outfit and matching avatar instructions. It keeps
her sleek black center-parted fiber wig, the shared cream Muse face, visible
cream cheek/chin rim and compact plush proportions.

The researched [runway reference](https://www.harpersbazaar.com/celebrity/latest/a74172579/kylie-jenner-victorias-secret-fashion-show-2026-fantasy-bra-photos/)
guides a toy costume: an opaque silver crystal-covered bodice with short
crystal fringe and a yellow center jewel, a white satin mini skirt, large white
feather wings and silver shoes. It replaces the black blazer and rose makeup
case in the active recipe. The earlier native preview and experimental results
remain historical evidence for that earlier outfit.

The built-in image-generation tool produced the new design preview at
`web/avatars/muse-kylie-runway-v5/kylie-jenner.png`. The site displays the WebP
derivative at `web/avatars/muse-kylie-runway-v5/kylie-jenner.webp`, preserving
the generated PNG bytes. The manifest records original and display provenance;
the catalog uses `designVersion: muse-kylie-runway-v5`,
`previewSource: imagegen` and `previewSelection: design-preview`. The former
native `web/avatars/muse-wigs-v2/kylie-jenner.webp` is retained unchanged with
its superseded recipe and provenance. This new artwork is not a native Muse
output or evidence that Muse will reproduce the preview exactly.

The manifest records visible departures from the intended recipe: cream plush
shows between the crystal ornaments instead of a continuous opaque bodice;
some front hair sits inside the upper cream rim, and the side sections extend
below the requested chest length. Keep these observations with the generation
record; the selected preview is not proof of exact prompt compliance.

`src/muse-wigs.js` remains the shared visual recipe for Kylie's wig and outfit,
including the text-only fallback. Only Kylie's complete handoff changes to
`muse-reference-wig-v6`; links, complete-combo copying, setup instructions and
export continue to use the same handoff builder. The other 17 catalog entries,
complete handoffs and avatar assets remain unchanged. All 18 personality
definitions, character IDs and browser-local saved tone settings are retained.

The resulting source inventory is **14 curated native previews, two generated
design previews (Rock and Kylie), and two retained PNGs (SpongeBob and Hello
Kitty)**. The new Kylie recipe has not been generated, selected or checked for
persistence inside Muse. Local implementation and artwork review do not
establish native recognition, repeated stability or exact reproduction. Earlier
native trials and the October 24 production checks do not validate this new
native recipe.

Local checks passed: **93/93 Node tests**, website build, JavaScript syntax and
whitespace checks, plus **26/26 targeted browser checks** at 1440px, 390px and
320px. All nine normal tile/stage/detail surfaces and three recovered surfaces
decoded at 1254 × 1254. The checks verified 27 exact current-tone Muse URLs,
complete-combo/text-only copying, JSON exports, design-preview provenance and
mobile image failure/retry. No overflow or page errors occurred; visual review
confirmed complete wings and shoes at all widths. External fonts used local
fallbacks because of network delays. These Chromium checks made no Muse
requests and do not cover physical iOS/Safari. Evidence is kept outside Git in
`persa-test-results/2026-10-28-kylie-runway/browser-qa-local.json`.

### Publication and live verification

Source [`17b4e9f`](https://github.com/bubbl-ai/persa/commit/17b4e9f965047aaf1bf0703c1c6c84c088fa11e7)
is live at [persa.bubblai.com](https://persa.bubblai.com). Both the
[deployment](https://github.com/bubbl-ai/persa/actions/runs/40662648857) and
[test workflow](https://github.com/bubbl-ai/persa/actions/runs/40662648702) passed.
The initial SSH push connection closed; an authenticated HTTPS retry succeeded.

Live verification passed **26/26 checks after targeted network retries**.
The served catalog, changed browser modules and new WebP matched the tested
build bytes. All 12 normal/recovery image surfaces decoded; 30 exact URL
comparisons, current-tone copying/downloads, preview provenance and mobile
failure/recovery passed. Visual review confirmed complete wings and shoes at
1440px, 390px and 320px. There were no JavaScript errors or Muse requests.

Initial image waits exceeded 15 seconds on the desktop and 45 seconds during
recovery; targeted retries passed. Those failed network runs remain preserved
separately from `browser-qa-live.json` in the same local evidence folder. This
validates the deployed asset and flows, not a loading-speed guarantee. External
fonts used fallbacks. Native Muse generation and physical iOS/Safari remain
unverified.

## Direct Muse links — October 15, 2026

The user requested all 18 characters and a single action from Persa to Muse.
The stage, each collection tile and the personality detail dialog now have
real **Open in Muse** links. The primary route no longer opens a Persa setup
dialog first. **Setup options** remains optional for complete-combo copying,
downloads and help. Current drafts, reset and saved tone settings update those
links. Muse still requires the user to send the prepared message and select
an avatar; this is not automatic application or exact image import.

At the October 15 release, the original Mona/Taylor/Mark payloads remained
unchanged and the other 15 used `muse-reference-wardrobe-v2`. That release
changed neither preview artwork nor text-only prompts. See the
[all-character validation and release record](MUSE_ALL_CHARACTER_HANDOFF.md).
The v2 handoff asks for four candidates and tells Muse to verify saved personality
settings before generation. These changes follow the preserved v1 pilot's stale Vibe
and two-candidate result; they do not establish native success until checked.

The October 16 published collection uses `muse-reference-wig-v3` for 12 presets.
`src/muse-wigs.js` supplies the same visual section to native avatar-only trials
and combo construction, while their account instructions differ. The combo
asks to save and verify the personality; a preview trial explicitly prohibits
those changes. The separate costume-only follow-up uses
`muse-reference-costume-v4` and `src/muse-costume-recipes.js` for Harry, Michael
and Joker. That October 16 change left the other 15 messages byte-for-byte
unchanged: 12 wig combos and three retained `muse-reference-wardrobe-v2` combos.
The October 23 update separately changes only The Rock to
`muse-reference-wardrobe-v5`; SpongeBob and Hello Kitty keep v2. Historical
payload hashes and results stay recorded under their tested versions.
The October 28 source update changes only Kylie to `muse-reference-wig-v6`,
preserving the other 17 complete handoffs. The remaining 11 wig presets keep
v3; the shared wig recipe module still serves all 12. This implementation is
published; native Muse validation remains pending.

## Provenance and failure handling

The built-in image-generation tool produced the master and October 6 costume
PNGs, the October 23 Rock preview and the October 28 Kylie preview. The
remaining 11 active wig previews and three October 16 hairless costumes use
curated native Muse outputs, with the original WebP bytes retained. All 12
original native wig previews, including the superseded Kylie outfit, remain
preserved. `characters/image-generation.json` records active asset
provenance, recipe/output hashes and superseded replacements;
`characters/avatar-design-generation.json` retains the master's provenance.
Native preview trials and combo messages share visual instructions, but their
different wrappers are not interchangeable validation evidence.

Original image attempts, refusal outcomes, and retired replacements are retained.
New artwork has a versioned path; an old provenance record never points at a
newly overwritten image. Current replacement records must match their preset,
base, and design version. A missing or declined costume becomes explicitly
unavailable, with personality and prompt copying still accessible. It must not
fall back to a previous human likeness or a different mascot. The build copies
only currently referenced costume images and the shared base into the published
output; historical source artwork can remain in the repository without shipping.
PNG and static WebP headers/dimensions are checked at build time; browser checks
verify decoding. Per-character curation and checks belong in the
[costume follow-up](MUSE_COSTUME_RECOGNITION.md) and earlier
[wig rollout report](MUSE_WIG_ROLLOUT.md).

## Muse integration limits

The text-only avatar control describes the active base, costume and applicable
hairstyle, without an image reference. The all-character shortcut opens a prepared message asking
Muse to download and verify the public shared base inside its workspace, then
use that actual file for native avatar candidates. Users still press **Send**
and **Select** themselves; Persa does not directly install the displayed avatar.
JSON exports include the applicable hairstyle/construction or `costumeVariant`
plus curated-preview metadata independently of whether hair exists.
See [the current costume follow-up](MUSE_COSTUME_RECOGNITION.md) and
[October 15 handoff validation](MUSE_ALL_CHARACTER_HANDOFF.md).
Independent Muse generations may change the face, proportions or outfit even
with a reference. Never promise identical previews or a fixed avatar across
generations.

The [initial](MUSE_VALIDATION.md) and [batch](MUSE_BATCH_VALIDATION.md) Muse tests
used earlier likeness-based prompts. The [October 12 native generation test](MUSE_NATIVE_AVATAR_VALIDATION.md)
covers Taylor Swift, Mona Lisa and Mark Zuckerberg: 3 identical avatar-only
requests each in fresh side chats in one desktop account, yielding 36 reviewed
options. All requests produced recognizable hairless plush-family/costume
candidates, but faces, hoods, material and body proportions varied materially;
all captured backgrounds were white or neutral rather than lilac. This is
partial 3/18 generation evidence, not stable fixed-character dressing.

The separate [prompt-engineering follow-up](MUSE_PROMPT_ENGINEERING.md) captured
and reviewed 84 options from 21 requests across screening, original reference
repeats and revised repeats. Uploaded-base prompts kept visible faces and fleece
closer to the source, and revised wording improved dress coverage. Hand/hood
variation and longer Mark leg silhouettes remained; bodies hidden by gowns
could not be assessed. Those attachment-dependent recipes are versioned
separately from artwork and do not replace the catalog's text-only prompts.
The October 14 handoff adapted the preferred three recipes to URL-based reference
delivery and measures that route separately; the older 84 outputs cannot
establish its reliability.

Before that follow-up, a separate single request attached the shared base and
used stricter preservation instructions. Its four options included three plush variants and a flat
illustration, so it establishes no reference repeatability. A request including
an uploaded reference returned candidates; Muse stated it used the reference,
but actual image conditioning was not independently verified. Its statement
that custom backgrounds were coming soon was also not independently verified.

No candidate was selected in the October 12 unchanged-prompt matrix or its
single-request probe, and no personality text was submitted. After a full reload,
the prior Mona Lisa avatar and displayed name
remained visible. Saved personality and memory were not audited. Current costume
activation/persistence, the other 15 presets, mobile and multiple accounts were
not tested in that experiment. The [October 15 record](MUSE_ALL_CHARACTER_HANDOFF.md)
separately tracks the incomplete broader generation matrix. Its wrapper explicitly requests
sparing emoji for Barbie/SpongeBob to replace old no-emoji preferences, but
that wording is separate from observed persistence. Direct import, automatic
application and identical-avatar reproduction remain unverified.

## Verification — October 6, 2026

All 18 costume previews and the shared base were generated with the built-in
image tool and visually reviewed. The MrBeast hoodie required one targeted edit
to remove an unrequested logo; both the original output and edit prompt are
recorded. That release's deployment build contained only those 19 active images.

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

The 12 curated wig previews and three new hairless costume previews were
published on October 16. See the [current publication record](MUSE_COSTUME_RECOGNITION.md#publication--october-16-2026)
for the source commit, successful deployment/tests and live verification. The
[October 15 release](MUSE_ALL_CHARACTER_HANDOFF.md) and
[wig curation report](MUSE_WIG_ROLLOUT.md) retain their historical evidence.

The [public website](https://persa.bubblai.com) was first verified on Vercel
October 10, 2026 (Asia/Taipei). The first successful
[GitHub auto-deploy run](https://github.com/bubbl-ai/persa/actions/runs/38014634795)
used source `1e6fc0f2622aefe8bc38a78cefbcbb9bd69ef057`. The project is `persa`
in scope `tonyhaoyu2000-2063s-projects`; the configured team/project IDs and ongoing
workflow are recorded in the [deployment notes](../README.md#vercel-deployment).

Public HTTPS, all 18 costume previews, clipboard copying, saved collections,
the old demo redirect, and desktop/mobile browsing passed live checks. The
deployed page assets match the repository. This hosting migration changed no
artwork or Muse prompts and included no new signed-in Muse validation.

The previous [Sites deployment](https://persa-muse-characters.archerx03.chatgpt.site)
is **version 6**, published successfully on October 9, 2026 (Asia/Taipei).
The native deployment result confirmed `succeeded` for source commit
`f5de98c1c43fdfdfeff9e14b69106ece6c2a7517`. This release promotes the spotlight
to the homepage and connects Muse setup, personality tuning, and favorites.
It preserves all 18 costume previews, the shared base, and the public audience.

The homepage integration passed 72 tests and browser checks for all 18 presets,
54 prompt-copy actions, saved tone settings, JSON export, image/catalog retry,
keyboard navigation, reduced motion, and mobile layouts and swipes. See the
[website verification record](../README.md#website-verification). These checks
did not include a new signed-in Muse session.

The costume collection first shipped on October 7 as Sites version 4, from
`f2549d691fcff1d1048423ab40bc2b27a2fb1397`. That retry resolved the October 6
archive-upload failures, including two confirmed blob-upload timeouts. Version 5
then introduced the separate spotlight demo. Version 6 reuses that artwork;
retired likeness images remain excluded from the deployment archive.
