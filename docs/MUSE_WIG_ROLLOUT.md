# Curated Muse wigs in Persa

Date: October 16, 2026 (Asia/Shanghai). Local implementation;
this document records the curation stage. The selected previews were subsequently
published with the [October 16 costume release](MUSE_COSTUME_RECOGNITION.md#publication--october-16-2026).

Later October 16 follow-up: the [costume recognition study](MUSE_COSTUME_RECOGNITION.md)
replaces Harry, Michael and Joker with newly curated hairless native costumes.
The six retained previews and six unchanged hairless messages described below
are the state at the end of this earlier wig rollout. Its counts and results
remain separate from that follow-up.

The user approved selecting the strongest generated image for each Persa
preview. The gallery keeps all 18 presets. Twelve receive curated native
Muse wig previews and matching hairstyle instructions. Six retain their
existing costume previews: The Rock, SpongeBob and Hello Kitty are hairless
by design; Harry Potter, Michael Jackson and Joker retain their valid
costumes because prior wig requests were refused. Those requests were not
retried through another service.

## Preview selection

The shared character remains a cream plush companion with a peach face,
black bead eyes, a tiny smile and a cream cheek/chin rim. Wigs are costume
accessories. New previews are actual native Muse candidate files copied
without alteration into `web/avatars/muse-wigs-v2/`. They are 1600-pixel WebP
images: eleven have white backgrounds, while Charlie's selected revision has
a pale lavender backdrop. Retained previews remain the original PNGs with
pale lilac backgrounds.

Taylor, Wednesday and Mark use selected outputs from the separate
[October 15 stability experiment](MUSE_WIG_STABILITY.md). Nine additional
eligible characters receive a first curation request each. Charlie's first
batch omitted suit trousers, so it is preserved as a failed costume batch
and a targeted revision explicitly requests full trousers and shoes.
Selection favors the shared plush face, recognizable hair and clothing,
complete framing and clean presentation. This is best-image curation, not
an unchanged-repeat reliability experiment.

The exact input, source option, prompt hash, image hash, visual assessment
and selection rationale are recorded in `characters/image-generation.json`.
Previous active costume records are preserved in `supersededReplacements`.
Private chats, account documents and raw activity remain outside Git.

| Preset | Selected hairstyle | Source option |
| --- | --- | --- |
| Taylor Swift | Blonde fiber bangs and shoulder waves | October 15 confirmation 3, option 1 |
| Wednesday Addams | Black felt cap and two yarn braids | October 15 confirmation 2, option 1 |
| Mark Zuckerberg | Compact brown fiber curls | October 15 confirmation 3, option 2 |
| Mona Lisa | Long brown center-parted waves with veil | Curation 1, option 2 |
| Barbie | Blonde high ponytail with one pink bow | Curation 1, option 1 |
| Charlie Chaplin | Short black waves below bowler hat | Revised curation 2, option 3 |
| Olivia Rodrigo | Long straight dark-brown wig | Curation 1, option 4 |
| Marilyn Monroe | Short platinum-blonde curled bob | Curation 1, option 1 |
| Drake | Close-cropped black yarn cap | Curation 1, option 4 |
| Lionel Messi | Short side-swept brown wig | Curation 1, option 4 |
| Kylie Jenner | Long sleek black center-parted wig | Curation 1, option 1 |
| MrBeast | Short side-swept light-brown wig | Curation 1, option 4 |

All 40 new candidates were reviewed. The nine initial requests produced
26/36 practically usable options and 4/36 with no observable strict violation.
Charlie initially had 0/4 usable full suits; its revised request produced
1/4 usable options and 0/4 strict passes. These are separate curation batches,
not the October 15 unchanged-repeat confirmations. Rejected options include
extra curls, missing trousers, added eyebrows/ear-like shapes, changed plush
material and an American football for Messi. The selected images still have
documented detail differences, chiefly hair inside rather than outside the
hood. None was edited to hide a miss.

The [public curation manifest](experiments/muse-wig-rollout-2026-10-16.json)
contains all ten new exact inputs, their outcomes and hashes, every visual
assessment, all eighteen display decisions, and the recorded validation.

## Matching instructions

`src/muse-wigs.js` owns the twelve costumes and hairstyles and builds their
visual instructions. The new avatar-only curation requests and the website's
`muse-reference-wig-v3` combo handoff share this visual recipe. The three
reused previews retain their original exact source prompts; their visual
sections match the new builder while their wrapper and personality setup
are versioned separately. The six hairless combo payloads remain unchanged.

The stage, tiles, detail dialog, complete-combo copy and JSON export all use
`buildMuseHandoff()`. Text-only avatar copying includes the matching costume
and wig, but remains clearly labeled because it omits the downloaded image
reference. Exported avatar metadata includes the hairstyle and construction.
The setup description explains that a curated Muse-generated preview is an
example and a new generation can vary.

All 18 Open in Muse links remain direct. Users still send the prepared
message and choose an avatar in Muse. No new setup step or automatic avatar
selection is introduced. The original shared base image and its public URL
and checksum are unchanged.

## Verification and limits

All ten new requests completed and returned **40 unique 1600×1600 candidates**.
Nine initial requests cover the nine additional characters; Charlie's changed
costume prompt adds one revision. Median observed chooser capture was
**68.362 seconds**, with a range of **63.301–78.566 seconds**. All ten had exact
prefill and visible fresh reference download, checksum and native reference use.
Mona's first native tool call needed automatic schema/interface recovery before
succeeding. Activity headings sometimes reused a previous character or
abbreviated candidate lists; actual chooser captures determine counts.

The twelve current wig combo links were also clicked in signed-in Muse and
all twelve prefilled their complete messages exactly. No combo message was
sent during that check. Fresh IDENTITY, SOUL and MEMORY downloads matched
their pre-test files byte for byte. The original avatar remained visibly
unchanged, the composer was left empty and extra test tabs were closed.

The complete Node suite passed **88/88 tests**. The website build, JavaScript
syntax checks and `git diff --check` passed. The evidence audit passed
**809 checks** with no errors or pending items. An independent public-manifest
audit passed 314 checks, including exact selected source bytes and private-data
exclusion.

All **62 browser checks passed** with no website findings. All eighteen previews
decoded on the stage, tiles and details (54 surfaces). All 54 default links
navigated to their expected prepared instructions; all 54 tuned links matched
the shared builder. Copying and JSON export passed for every preset, and
save/reload/reset retained every wig recipe. Denied-clipboard fallback and
failed-WebP retry recovered correctly. Desktop 1440px and mobile 390/320px
layouts had no horizontal overflow; all eighteen figures were visible and
fully framed in the reviewed grids. Muse navigation was intercepted in these
website checks; actual signed-in prefill is the separate twelve-link check
above. The absent local preview server was started before the successful run.

At the end of this curation task, the changes were implemented and verified
locally, with no commit, push or deployment. They subsequently shipped in the
October 16 release linked above. Local screenshots and the full website check log are stored under
`persa-test-results/2026-10-16-wig-rollout/` outside Git.

The build validates PNG and static WebP signatures, dimensions and relevant
container structure, and checks native preview bytes against the selected
output hash. This permits publishing the original native files
without image conversion; browser checks separately verify full decoding.
Retired images remain in source history but are not copied to the website's
build output.

A selected image does not establish a future success percentage or promise
that another user's Muse generates the same result. Candidate choices share
one desktop account and chat history. Covered hood/body geometry and blind
character recognition are untested. Current costume activation, native
mobile behavior and combined personality persistence are not part of this
avatar-only curation run.
