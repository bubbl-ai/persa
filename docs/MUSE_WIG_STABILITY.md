# Native Muse wig experiment

Experiment: October 15, 2026 (Asia/Shanghai). Review completed October 16, 2026.

The user requested hair or wigs to make the existing shared plush costumes
more recognizable. This experiment tests native Muse candidates using the
same public base reference and prepared-message route as the live handoff.
It does not change production prompts, previews or website behavior.

**Result:** wigs produced practically usable character designs in all 24
confirmation outputs, but only 8/24 met every observable detail instruction.
Wednesday's textile braids were the most consistent selected construction.
This supports further character-specific testing, not a promise of identical
hairstyles or a general 100% success rate.

## Design

Taylor Swift, Wednesday Addams and Mark Zuckerberg represent blonde bangs
and waves, paired black braids, and compact short brown curls. Each receives
one screening request with a soft synthetic doll-fiber wig and one with a
sewn felt/yarn hairpiece. Both constructions preserve the cream cheek/chin
rim, peach face, bead eyes, tiny smile and plush body. Hair is an accessory
over the cream hood. The experimental payload has no blanket no-hair rule.

The two variants share the same per-character costume and public reference.
Wednesday's experimental costume removes the previous hood bows and uses
exactly two plain braid bands instead; it is not an unchanged production
costume. Earlier preview-edit tests used already-costumed PNGs, whereas this
test starts from the shared base. Neither those tests nor the earlier
hairless Muse batches are a matched control for this experiment.

After all six screens, select a construction per character by combined usable
candidate count, then visible face/rim preservation, then doll fiber if tied.
A selected construction must first offer at least three usable candidates.
Submit two further identical requests per selected character. Keep these
six planned confirmation requests separate from the screening denominator;
screen-based selection can favor a lucky first chooser.

Harry Potter, Michael Jackson and Joker are excluded because earlier hair
image-generation requests were blocked. These requests are not retried
through another service. No all-18 hair compatibility claim is intended.

## Measurements

Capture every actual returned option, exact prompt/hash, prefill, latency and
visible download/checksum/reference-use activity. Four candidates are
requested, not assumed. Keep failures and weak options in the evidence.

- Hair: requested color and main silhouette/count appear; eyes and face remain
  unobstructed.
- Visible base: recognizable source face, bead eyes, tiny smile, cream
  cheek/chin rim and plush material; no major added human or animal features.
- Costume: principal clothing and named prop are present and usable.
- Combined usable: all three practical checks pass. Minor waves, curls and
  garment variation are allowed but recorded.
- Strict compliance: separately assess explicit placement, accessory count,
  hair material, fingerless hands and full framing. A useful option can still
  miss a strict instruction.

A successful chooser offers at least three combined usable candidates.
Hidden body or covered hood geometry is unassessable, not an inferred match.
Character recognition is assessed through the requested visual cues, not a
blind recognition study or a real-person face match.

## Results

All six screening requests returned four native candidates each. Every one of
the 24 options was reviewed: **21/24 (87.5%) were practically usable**, while
**7/24 (29.2%) met all observable strict instructions**. Five of six choosers
offered at least three usable options.

| Character | Fiber usable / strict | Textile usable / strict | Selected construction |
| --- | --- | --- | --- |
| Taylor Swift | 4/4 / 0/4 | 2/4 / 2/4 | Fiber: more usable options. |
| Wednesday Addams | 3/4 / 0/4 | 4/4 / 2/4 | Textile: more usable options and better external-cap/rim placement. |
| Mark Zuckerberg | 4/4 / 2/4 | 4/4 / 1/4 | Fiber: no decisive visible-face/rim advantage, so the predefined conventional-fiber tie-break applied. |

Taylor's textile misses added extra front locks. Wednesday's fiber miss
substituted smooth ponytails for the requested braids. Other strict misses
included bangs too near the eyes, hair crossing the cream rim, a hood covering
the wig rather than the reverse, forehead curls, open laptops, extra cap
details and a lilac backdrop despite a white-background instruction.

Selection was saved before any confirmation request. The selected messages
were cloned byte-for-byte and submitted in two further round-robin rounds.
All six confirmation requests returned four candidates each:

| Character and selected construction | Practically usable | Strict compliance | Choosers with at least three usable options |
| --- | --- | --- | --- |
| Taylor Swift — fiber | 8/8 (100% observed) | 0/8 (0%) | 2/2 |
| Wednesday Addams — textile | 8/8 (100% observed) | 6/8 (75%) | 2/2 |
| Mark Zuckerberg — fiber | 8/8 (100% observed) | 2/8 (25%) | 2/2 |
| Total confirmation only | **24/24 (100% observed)** | **8/24 (33.3%)** | **6/6** |

All eight Taylor confirmation options put bangs closer to the eyes than
requested. Other recurring strict misses included wigs under the hood,
unrequested forehead fringes, side locks crossing the cream rim, and open
laptops. Two backgrounds were lavender, one cap was raised, and one prop
overlapped the lower chin. These categories overlap; 16 confirmation options
had at least one strict miss. The requested main hair cues, visible plush
identity and principal costume remained practically usable in all 24.

Across the complete 48-image dataset, visible base identity and principal
costume passed every visual check. Three screening options missed the main
hair requirement. This is a visual rubric, not proof of exact geometry,
identical pixels or independent recognition of the named character.

The [experiment manifest](experiments/muse-wig-stability-2026-10-15.json)
preserves all six exact recipes and their hashes, selection rules, all 12
request outcomes, output hashes and separate screening/confirmation totals.

### Performance and capture

All 12 requests produced four candidates within the 240-second observation
window. Routine capture latency was a median **95.885 seconds**, with a range
of **86.024–103.680 seconds** across 11 requests. The remaining timing is an
upper bound, described below. All 48 captured output files were unique.

One screening chooser was missed by the original capture script because Muse
virtualized older chooser controls, leaving their count unchanged. Its four
existing images were recovered without resubmitting the request. A saved page
observation proves completion by **205.746 seconds**, but exact completion
time is unknown. The original timeout evidence is preserved. Subsequent
capture compares loaded chooser-image signatures rather than control count.
Exclude this upper-bound timing from latency medians.

One Mark confirmation request needed Muse to recover automatically from a
deferred native tool call before returning candidates. This was not a safety
refusal and is distinct from the capture-script issue. Activity titles and
completion summaries sometimes reused an earlier character name or gave the
wrong candidate count; actual generation entries and captured images take
precedence. These are observed reporting defects, not evidence of an
error-free workflow.

The activity audit observed a fresh reference download, the expected checksum
and native reference use in all 12 requests. It recorded three stale character
summary labels, one candidate-count summary mismatch and no visible safety
refusals. The completed evidence audit passed 551 integrity checks. The local
gallery passed 15 browser checks at 1440, 390 and 320 pixels; all 48 candidate
images and four comparison references decoded without overflow or pending
assessments. These gallery checks do not test native Muse on mobile.

## Account state and evidence

Requests are avatar-only previews and explicitly prohibit selecting a
candidate or changing identity, personality, memory or standing preferences.
Fresh exposed identity/style/memory documents were captured before testing.
Fresh post-test IDENTITY, SOUL and MEMORY downloads matched their baselines
byte for byte, including their complete exposed contents. No restoration was
needed. The original selected avatar remained visually unchanged, no candidate
was selected, and the composer was left empty. This audits exposed documents
and visible state, not hidden account state.

Evidence is kept locally under
`persa-test-results/2026-10-15-muse-wig-stability/`, including inputs, actual
records, every candidate, assessments and a local comparison gallery. Private
account documents, chat URLs and raw activity remain outside the repository.

This is a small sample from one signed-in desktop account and its existing
Main chat. Candidate options within a chooser are correlated. It does not
establish a future success probability, all-roster coverage, mobile behavior,
activation, animation or combined personality installation. Visible reference
activity is not independent proof of the generator's internal conditioning.
