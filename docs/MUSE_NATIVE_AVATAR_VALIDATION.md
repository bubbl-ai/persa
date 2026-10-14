# Native Muse avatar generation validation

Follow-up: [native prompt engineering](MUSE_PROMPT_ENGINEERING.md) records a
separate 21-request/84-option experiment with changed prompts and uploaded
references. It improves visible similarity but does not establish deterministic
preservation. The original nine-request/36-option matrix and one-request/four-option
probe below retain their original inputs, counts and conclusions.

Date: October 12, 2026 (Asia/Taipei). Environment: one existing signed-in
desktop Muse account. This tests the current hairless `muse-costumes-v1` avatar
prompts, separately from the [October 5 likeness tests](MUSE_BATCH_VALIDATION.md).

**Outcome:** the current text-only workflow generated recognizable hairless
plush-family/costume candidates on all nine requests, but did not establish
stable dressing of one fixed face and body. All 36 captured options used white
or neutral backgrounds instead of the requested pale lilac. A separate
one-request reference-image probe also produced materially different variants.
No candidate was selected; these results add no activation or persistence test.

## Unchanged-prompt repeat matrix

Taylor Swift, Mona Lisa and Mark Zuckerberg each received three sequential
requests, with a fresh side chat for every request in the same account. The
input was the exact current `character.avatar.prompt` from
[`characters/avatar-design.js`](../characters/avatar-design.js), with no
personality text, image attachment, repair instructions or prompt changes.
Fresh side chats do not constitute independent clean accounts.

| Preset | Requests | Options captured and reviewed | Avatar-only prompt SHA-256 |
| --- | --- | --- | --- |
| Taylor Swift | 3 | 12 | `e56dbaa7b6d2997e1818da8a96e721e32e998cb87abc5e3cf8c2608f139b1a92` |
| Mona Lisa | 3 | 12 | `4c90b3d80c70d9d4f07e8e54c5290b6f018bd46568b3c827d56a5577d54b7fb4` |
| Mark Zuckerberg | 3 | 12 | `6e7e5cdbf997940e41bb1014c78bc2c8183fa563a9c37e6653986fa66b14788d` |
| Total | 9 | 36 | Three identical submissions per preset |

Every request returned four native selectable options in this run. All options
were retained and reviewed, including weaker candidates; this is not a promise
of a fixed option count. No **Select** action was taken.

Review used the actual current constraints: cream plush hood, peach round face,
small glossy black eyes, simple smile, rosy cheeks, compact body, no human hair
or other prohibited features, the named costume/props, full-body square framing
and pale lilac backdrop. It also compared face, hood, material and proportions
within and across requests. The committed preview was a comparison reference,
not an input. The later local hair-edit recipes were not applied as criteria.

## Observed matrix results

All 36 options remained recognizable members of the intended hairless cream
plush family. All nine requests offered useful family/costume candidates.
That descriptive consistency did not preserve one fixed character identity:
face openings, eye treatment, hood construction, fur texture, limb scale and
head/body ratios varied within and across requests.

| Preset | Retained cues | Material variation or misses |
| --- | --- | --- |
| Taylor Swift | Hairless cream plush family, lavender performance clothing and silver microphone in all 12 options. | Faces, hoods, material and proportions vary. One option adds lash-like eye styling; another has an ambiguous split/bloomer-like dress. |
| Mona Lisa | Hairless plush family, dark sheer veil and hands held together in all 12 options. | Two seated variants change the body/foot arrangement; two add conspicuous eyelash styling. One outfit reads as a short coat, and two have ambiguous bubble-gown silhouettes. |
| Mark Zuckerberg | Hairless plush family, gray shirt, navy bottoms, white shoes and closed silver laptop in all 12 options. | Faces, hoods and proportions vary. One laptop has an Apple logo despite the no-logo instruction; one navy garment reads as shorts rather than trousers. Eye embellishments also vary. |

All 36 captured avatar backgrounds were white or neutral rather than pale
lilac, so none met every current prompt constraint. The images were square and
showed complete figures. This distinguishes successful native generation from
complete prompt adherence. Eyelash-like details are recorded as added face
styling; the current prompt bans makeup but does not separately name eyelashes.

## Separate reference-image probe

After the matrix, one additional request attached the repository's shared
[`base.png`](../web/avatars/muse-costumes-v1/base.png) and asked Muse to dress
that exact character in Mona Lisa's gown and veil while preserving its face,
hood, curly texture, proportions and standing pose. It used stricter
preservation instructions than the copied website prompt and explicitly asked
for candidates only, with no activation or saved-preference changes.

This **1 request returned 4 options**: the first three were plush variants and
the fourth was a flat illustration. They did not establish fixed-source
identity preservation. There was no repeated reference-image request, so this
probe cannot establish reference repeatability. Keep its counts separate from
the **9-request/36-option unchanged-prompt matrix**; together they total
10 requests and 40 captured images.

A request including an uploaded reference returned candidates; Muse stated it
used the reference, but actual image conditioning was not independently
verified. Muse also stated that custom backgrounds were coming soon. The
observed candidates still had white/neutral backgrounds; the background
implementation was not independently verified. Candidates can still be useful
as individual designs. The probe does not establish stable editing of the fixed
character or exact-image import; it does not rule out other possible routes.

## Account state and limits

No **Select** action was taken in any of the ten requests. No personality text
was submitted, and no personality change was intended. A final full reload
still visibly showed the prior long-haired Mona Lisa avatar and Mona Lisa name,
rather than a plush test candidate; the browser was returned to the main chat.
This was a visual profile check. Saved personality and memory were not audited,
so this report does not claim that hidden account state was unchanged.

The matrix covers **3 of 18 presets** in one desktop account. It does not
validate the other 15 presets, mobile Muse, multiple accounts, current costume
activation/persistence, combined personality setup, or long-term reliability.
Known unresolved blocked requests were excluded rather than retried through
Muse. The small qualitative sample is not a statistical success-rate estimate.

The current workflow should not be described as stable fixed-character
dressing. These results change no source prompts, artwork, runtime behavior,
or deployment. The [design contract](MUSE_AVATAR_DESIGN.md) remains the intended
visual direction; native generation currently has the limits recorded here.

The local QA folder `persa-test-results/2026-10-12-muse-stability/` contains the
protocol, exact inputs/hashes, request records, all candidate assets, assessments
and a review gallery. Account screenshots, private chat URLs, raw conversations
and account data remain outside this repository. The local gallery is review
evidence, not a published website feature or committed browser test suite.
