# Clearer costumes for the three remaining presets

October 16, 2026 (Asia/Shanghai). Published at [persa.bubblai.com](https://persa.bubblai.com).

The user requested a different approach to making the remaining characters
recognizable. Harry Potter, Michael Jackson and Joker now use stronger clothing,
headwear and prop combinations while keeping the shared cream plush character
hairless. These are new wardrobe designs, separate from the earlier refused wig
requests. The names remain explicit; hair, wigs, scalp, scars, makeup and changes
to the face are excluded. The earlier refusal and replacement history is preserved.

## Selected previews

| Preset | Selected design | Native source |
| --- | --- | --- |
| Harry Potter | Full school uniform, round glasses, burgundy/gold scarf, wand and small golden winged ball | School request, option 3 |
| Michael Jackson | White pinstripe suit, blue shirt, white fedora with black band, black armband and two-tone loafers | White-suit request, option 2 |
| The Joker | Purple coat and trousers, green waistcoat and a single jester-emblem playing card; uncovered cream hood | Card request, option 2 |

The choices favor clearer costume cues, a consistent plush face, complete outfits
and clean framing. Harry adds the uniform and winged-ball cue to the original
glasses/scarf/wand. Michael's coherent white stage outfit avoids the duplicated
sequined gloves seen in several black-outfit candidates. Joker's green waistcoat
and card replace the old top hat and bow tie, which read more like a magician.
This is an assessment with the character labels known, not a blind recognition test.

Selected previews still have documented differences: Harry's scarf obscures the
continuous cream chin rim and uses narrower gold bands; Michael's raised mitten
has small lobes, so exact compliance with the no-thumbs instruction is uncertain.
Joker meets the visible costume requirements in the review, but still has the
shared smiling plush face rather than a character-specific facial likeness.

All three selected images are unmodified native Muse 1600×1600 WebPs with white
backgrounds. Exact source prompts, candidate numbers, image hashes, visual findings
and rejected alternatives are recorded in the
[public experiment manifest](experiments/muse-costume-recognition-2026-10-16.json).
The active entries in `characters/image-generation.json` retain the previous
replacements in `supersededReplacements`.

## Native experiment

Four avatar-only user requests tested Harry's school outfit, two Michael outfits
and Joker's card outfit. They returned **16 unique images**, all visually reviewed.
Muse made **five successful native generation calls**: Harry's first call returned
three images, then Muse automatically generated a fourth under the same request.
The fourth appeared as a standalone image after the three-option chooser and was
captured separately. It was not a second user request or an unchanged-repeat trial.

Each request prefilled exactly and showed a fresh base download, checksum check
and native reference use. No new refusal was observed. Activity headings sometimes
reused Harry's name for Michael; the actual generation details, exact submitted
prompts and captured outputs identify the request. Read-only baseline/activity
loading and one pre-submission navigation timed out and recovered; no duplicate
generation was submitted for those browser failures.

The three requests with known complete-output capture times took **91.059–131.542
seconds**, median **91.157 seconds**. Harry's first three-image chooser was captured
after **154.354 seconds**; the complete four-image latency is unknown and excluded
from that median. Candidate detail variation remains visible, including mitten
shape, accessory counts and garment details. Selecting a good display image does
not establish a future generation success percentage or exact reproduction.

## Website and handoff

`src/muse-costume-recipes.js` owns the selected three wardrobe descriptions and
visual constraints. The avatar-only studies and `muse-reference-costume-v4` combo
builder share the exact visual recipe. Its text-only variant removes reference
claims while keeping the costume instructions aligned. The current Michael recipe
is the selected white suit; the black sequined alternative remains experiment
evidence only.

The new images live under `web/avatars/muse-costume-cues-v3/`. Preview provenance
and `costumeVariant` are included in JSON exports independently of hairstyle data.
Stage, tiles, details, copying and downloads all use the same current recipe.

The collection now contains **12 native wig previews, 3 new native hairless costume
previews and 3 retained hairless PNG previews**. The Rock, SpongeBob and Hello Kitty
keep their original artwork and instructions. All other **15 complete handoff
payloads are byte-for-byte unchanged** from the start of this task. The shared base
image, its public URL and checksum are unchanged. The earlier
[wig rollout](MUSE_WIG_ROLLOUT.md) remains a separate historical experiment.

All 18 presets retain direct Open in Muse links. Users still send the prepared
message and choose an avatar in Muse; this task adds no automatic activation.

## Verification and scope

The three current complete combo links prefilled exactly in signed-in desktop
Muse, including the selected white-suit recipe. None of those combo messages was
sent. Fresh full IDENTITY, SOUL and MEMORY downloads matched their respective
pre-test files byte for byte. The original selected avatar remained unchanged and
the composer was left empty. Private account files, chat state and raw activity
remain outside Git. These checks do not audit hidden account state.

The complete Node suite passes **89/89 tests**. The website build, JavaScript
syntax checks and `git diff --check` pass. Initial tests caught missing character
names and shared-base wording in the three text-only fallbacks; those wrappers
were corrected without changing native recipes or complete combo payloads.

All **58 browser checks passed**: 54 comprehensive checks and four focused checks
after the text-only wrapper fix. All 18 previews decode on stage, tiles and detail
dialogs. The 54 default links and 54 tuned links match the shared builder; 61
prepared-message navigations were intercepted locally. Copy/export metadata,
save/reload/reset for the three changed presets, failed-image retry and layouts at
1440, 390 and 320 pixels pass. The reviewed stage and collection keep figures and
accessories in frame. These website checks are separate from actual Muse prefill.

The evidence audit passed **298 checks**, with no errors or pending items. It
verifies all 16 output hashes, selected original bytes, exact current recipes,
all 15 unaffected handoffs and image-history records, and the account/prefill
evidence. The public export excludes private paths, account contents and candidate
identifiers. The local preview server was restarted before browser verification;
the curation task ended before publication. The subsequent release is recorded below.

This is one account and four different costume recipes, with correlated options
within each request. It does not test repeated stability, native mobile behavior,
cross-account behavior, current avatar activation or combined-personality
persistence. Future Muse generations can differ from the curated previews.

## Publication — October 16, 2026

The user approved publishing the completed collection. Source commit
[`b92fb6c`](https://github.com/bubbl-ai/persa/commit/b92fb6c77cd74c98a8f3229acd3b5362bcc8c887)
was pushed to main. The [Vercel deployment](https://github.com/bubbl-ai/persa/actions/runs/38923293457) and
[Node 20/22/24 plus package-install checks](https://github.com/bubbl-ai/persa/actions/runs/38923293331) both succeeded.

Production [persa.bubblai.com](https://persa.bubblai.com) serves the expected
18-preset catalog: 12 native wig previews, three native hairless costume
previews and three retained PNGs. Live verification matched all 19 active
image files (including the base), catalog and browser runtime bytes to the
validated build. All 54 stage/tile/detail image surfaces and prepared links
passed; the three changed presets' copy/export flows and desktop/mobile
layouts also passed. No Muse message was sent during publication checks.

The previous Sites deployment was left unchanged. This release publishes
curated examples and matching instructions; it does not add a new native
Muse stability or avatar-activation result.
