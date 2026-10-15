# Native Muse prompt-engineering experiment

Date: October 12, 2026 (Asia/Taipei). **Historical attached-image experiment.**

Current all-character availability and direct-link behavior are tracked in
[the October 15 handoff record](MUSE_ALL_CHARACTER_HANDOFF.md). The historical
three-character experiments below do not measure the other 15 costumes.

The later [guided-handoff implementation and reliability report](MUSE_HANDOFF_RELIABILITY.md)
uses the preferred three recipes as the basis for a separate URL-delivered
workflow. It preserves the costume constraints but changes reference delivery
and explicitly requests personality application. The 84 outputs below include
text-only screens and attachment-based experiments; they do not measure the later
handoff's reliability. Catalog text-only avatar prompts remain unchanged.

Uploading the shared base with a concise preservation prompt produced visibly
closer faces, hoods and photographed fleece than the two text-only screening
strategies. Repeated requests still changed hands, clothing and proportions.
This is evidence of useful visual improvement, not deterministic preservation
of one fixed character. All 21 requests and 84 returned options were captured
and reviewed, with screening, original confirmation and targeted repair kept
separate.

This follows the [unchanged-prompt native validation](MUSE_NATIVE_AVATAR_VALIDATION.md).
Its earlier nine requests/36 options and separate one-request/four-option probe
remain separate evidence. No active catalog prompts, artwork or website behavior
were changed for this experiment.

## Reproducible inputs

The [exact recipes and request plan](experiments/muse-prompt-engineering-2026-10-12.json)
record every prompt verbatim, its UTF-8 SHA-256, the request-to-recipe mapping,
experimental prompt versions and reference provenance. Prompt versions are
independent of the existing `muse-costumes-v1` artwork version.

The reference strategies require uploading the unchanged repository
[`base.png`](../web/avatars/muse-costumes-v1/base.png) **with every request**, in
addition to the exact prompt. Its SHA-256 is
`c428fd4d8608ca5bd5d72a5c3f49a20be680a739a94bb9e658e3f4be23a4ec2f`.
Pasting the experimental text alone is not the tested reference workflow.
An attachment and the service's acknowledgment do not independently verify
the generator's internal image-conditioning mechanism.

The prompts describe the source's wide peach face, bead-eye layout, cream hood,
curly sherpa material, compact body and short limbs, with costume-specific
clothing and props. They ask all candidates to retain one design and style,
explicitly prohibit added facial features and logos, and request a white
background. White is accepted here; this does not retroactively satisfy the
earlier prompts' lilac-background requirement.

## Experiment structure

Each request uses a fresh side chat in one existing signed-in desktop account.
All returned options are retained and reviewed. No personality text is part of
the input, and the protocol prohibits selecting or activating candidates or
requesting changes to the account name, personality or saved preferences.
Fresh chats do not mean clean independent accounts, and account-level context
or display-name influence is not isolated by this experiment.

| Phase | Requests | Design and status |
| --- | --- | --- |
| Screening | 3 | One Mona Lisa request each for compact text, detailed geometry text, and uploaded base plus concise preservation text; 12 options captured and reviewed. |
| Original confirmation | 9 | Three identical reference-attached requests each for Mona Lisa, Taylor Swift and Mark Zuckerberg; 36 options captured and reviewed. |
| Targeted repair | 9 | Three revised reference-attached requests per costume; 36 options captured and reviewed, scored separately. |

The completed experiment contains 21 requests and 84 captured options. All
84 image hashes are distinct, and the local integrity audit passed 260 checks.
Four options returned per request in this run; that is not a service guarantee.

Reference was chosen before confirmation based on closer visible source
features in the screen. This is a comparison of bundled strategies, not a
causal test of one wording change or proof that reference conditioning caused
the improvement. The revised round retains the original confirmation inputs
and results, then adds explicit fingerless fleece mittens, complete dress
bodices, and clothing fitted to existing short limbs. It uses the same rubric
with a separate denominator.

## Review criteria

Five dimensions receive 0 for redesign, 1 for noticeable same-family drift,
or 2 for a close reference match: face geometry, facial features/expression,
hood contour/opening, material/color, and body/head proportions with short
standing limbs. A close-match pass requires at least 9/10, no zero, and no
unassessable critical dimension. These are authored qualitative criteria,
not a validated identity metric or a claim of pixel equality.

Hidden critical geometry receives `null`, not an inferred pass. An 8/8 visible
face/hood/material assessment cannot be converted to 10/10 when a gown hides
the body and leg junction. Mark's visible trouser-leg silhouette permits a
proportion assessment, but does not reveal exact anatomy under the clothes.
Wardrobe, hand anatomy, props, logos and composition are reviewed separately.
Within-request and cross-request variation matter; one attractive option does
not establish repeatability.

## Screening and original confirmation findings

Both text-only screens produced coherent plush variants with smaller, rounder
face openings, thicker rounded hood frames and coarser fleece than the source.
The reference screen retained closer visible source features in all four
options, with complete costumes. Their bodies were obscured by gowns, so none
received a complete identity pass. One reference-screen option retained a
lilac background despite the white request; it was not counted as identity drift.

The original reference confirmation kept visibly close faces and plush style
across the three costumes, while exposing the following limits:

| Costume | Options reviewed | Combined costume/hand pass / review / fail | Identity and remaining differences |
| --- | --- | --- | --- |
| Mona Lisa | 12 | 7 / 2 / 3 | All remain under identity review because gowns hide critical body geometry. Three have clearly segmented hand pads; two more need hand review. Smooth hand material and collar/hood details vary, and one failed option also has a skirt without a gown bodice. |
| Taylor Swift | 12 | 6 / 1 / 5 | All have close visible face/hood/material and rounded fleece hands, but obscured bodies remain unassessable. Five skirt-only options fail the dress requirement; one low-panel garment needs review. Microphone position and dress construction vary. |
| Mark Zuckerberg | 12 | 11 / 0 / 1 | All meet the authored close-match threshold at 9/10, with body proportions scored 1 for visibly longer trouser legs and shoes. One option leaves most of the torso as exposed fleece and opens the requested closed laptop. |

Mark's threshold passes allow one dimension of noticeable drift; they are not
exact-source preservation. The matrix does not establish that every returned
option preserves the intended character and complete costume.

The combined compliance counts do not mean every hand problem is a failed
garment. Mona Lisa's segmented hands can fail the mitten requirement even when
the gown is complete. Unassessable body geometry is a limit of the evidence,
not an observed body change.

## Targeted-repair results

The revised prompts explicitly require rounded fingerless fleece hands, full
garments and clothing fitted to the source's short limbs. All three costumes
received three unchanged revised requests, yielding 12 reviewed options each.

| Costume | Requests | Reviewed options | Garment/prop compliance | Hand compliance | Identity assessment |
| --- | --- | --- | --- | --- | --- |
| Mona Lisa | 3 | 12 | 12 complete gowns; no skirt-only miss. | New explicit no-thumb check: 1 pass, 8 review, 3 fail; no clearly segmented fingers. | Close visible faces/material; all bodies remain unassessable under gowns. |
| Taylor Swift | 3 | 12 | 12 complete strapped dresses and silver microphones; one small black microphone-area artifact needs review. | 12 rounded fleece mitten passes. | Close visible face/hood/material; all bodies remain unassessable under dresses. |
| Mark Zuckerberg | 3 | 12 | 10 pass, 2 coverage reviews for exposed belly/ankle bands. | 11 pass, 1 review for a thumb-like mitten contour. | 11 close-match passes at 9/10; 1 hood redesign fails at 7/10. Longer lower-body silhouettes remain. |

Mona Lisa's complete gowns increased from 11/12 to 12/12, and clearly segmented
fingers decreased from 3/12 to 0/12. The stricter no-thumb instruction is a new
criterion; its 1/8/3 pass/review/fail counts are not directly comparable to the
older mitten-only assessment. A complete gown does not resolve uncertain or added
thumb anatomy. Taylor's five skirt-only failures and one ambiguous garment were
replaced by complete dresses in this sample; seams, sparkle, microphone side
and angle still varied.

Stronger instructions also introduced a regression: Mark repair request 1,
option 3 opens the cream hood into long vest-like fleece panels. Its face is
close, but the hood is redesigned. Two other options need clothing-coverage
review, and the longer-leg silhouette persists. The revision is not a blanket
improvement.

The preferred recipes for further trials are `reference-revised-mona-lisa`
and `reference-revised-taylor-swift` for clearer garment construction, and
`reference-mark-zuckerberg` to avoid the revised Mark hood regression. These
IDs resolve to exact text in the recipe JSON. They are experimental choices,
not new catalog defaults or guarantees. No tested recipe establishes
deterministic preservation, and none has been validated by selecting or
activating an avatar.

## Scope and account limits

Only the three previously eligible costumes above are included. No refused
subject was renamed, stripped of its name or reformulated for another attempt.
A native failure or refusal pauses the planned sequence for inspection; it is
not an instruction to bypass the refusal.

This is a small qualitative sample in one desktop account. It does not certify
the other 15 presets, mobile or multiple-account behavior, long-term stability,
personality setup, activation or persistence. No **Select** action was taken.
After a full reload and completion of account loading, the prior long-haired
Mona Lisa doll avatar and Mona Lisa name remained visible; the browser was
returned to Main chat. Hidden saved personality and memory were not audited.
This visible profile check does not establish that all account state was unchanged.

The local QA folder `persa-test-results/2026-10-12-muse-prompt-engineering/`
contains request records, all outputs, reviews and a local comparison gallery.
The local gallery passed 1440/390/320 px checks: all 84 images decode, all 21
shown prompts match the request records, and filters, image zoom, phase totals
and partial-score displays work without browser errors. These checks cover the
evidence gallery, not the production website or mobile Muse.

Private chat URLs, raw conversations, account data and screenshots remain
outside the repository. No publication or deployment is part of this experiment.
