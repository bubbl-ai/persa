# Muse guided handoff reliability

Date: October 14, 2026 (Asia/Shanghai).

**The three-preset guided trial passed its native generation, visible-identity
and saved-style gates: 9/9 requests completed and all 36 candidates met the
practical visual criteria. Baseline personality restoration is verified, and
the shortcut is live at [persa.bubblai.com](https://persa.bubblai.com).**
These are results from one account, not a guaranteed future
success rate or proof of stable full figures.

## Implemented scope

The setup dialog for **Mona Lisa, Taylor Swift and Mark Zuckerberg** offers
**Open in Muse**. It opens `https://muse.ai/?prompt=…` with a prepared message;
the user still presses **Send**, reviews the generated options and clicks
**Select** to activate one. Opening the link alone does not send a message or
change the account. All 18 presets remain in the gallery. The other 15 retain
their existing text-only copy/paste setup and have no new native validation.

[`src/muse-handoff.js`](../src/muse-handoff.js) is the browser-safe source for
the prepared link, complete-combo clipboard fallback, displayed instructions
and JSON export. It calls the existing Muse compiler with the current preset
and tone settings. The build copies this module into `dist/core`; the CLI,
MCP interfaces, catalog avatar prompts and costume artwork are unchanged.

The message explicitly asks Muse to replace the prior character voice, tone
and emoji preferences, preserve unrelated settings, memories, permissions and
the account display name, and report what style settings it saved. This is a
request to Muse, not a Persa account-mutation API or a guarantee that every
preference will persist. Verification of saved settings is separate from
successful delivery of the text.

For the avatar, Muse is asked to download a fresh copy of the production
[shared base image](https://persa.bubblai.com/avatars/muse-costumes-v1/base.png)
directly into its workspace, verify its SHA-256 and pass that actual file to
the native avatar generator. The message explicitly prohibits `/tmp` or other
paths outside the workspace and stops the avatar step if reference retrieval,
verification or native image input is unavailable. It asks for candidates and
prohibits automatic selection or activation.

**Copy complete combo** carries the same reference-based message if the link
is unsupported or login leaves the composer empty. Clipboard failure exposes
the complete text for manual copying. The separate **Text-only avatar prompt**
retains the legacy prompt and is clearly labeled as omitting the reference.
Downloads retain that legacy `museAvatar.prompt`, marked `promptKind: "text-only"`,
and add the exact `comboPrompt` plus `museHandoff` data for supported presets.
The JSON is a backup; there is still no JSON import or automatic restore control.

## Frozen inputs

Handoff version: `muse-reference-handoff-v1`.
Module SHA-256:
`4de66c590fb8a7563d595e83a9b767dea9984b8399802ac1759d9d4a63017fec`.
Base PNG SHA-256:
`c428fd4d8608ca5bd5d72a5c3f49a20be680a739a94bb9e658e3f4be23a4ec2f`.

| Preset | Preferred October 12 recipe | Default message characters | Encoded URL characters | Default message SHA-256 |
| --- | --- | ---: | ---: | --- |
| Mona Lisa | `reference-revised-mona-lisa` | 4,904 | 5,260 | `76ead19bfe3164fd696ba7126f1b96393a0ac9ef27ea1dab6352a6fb8c2554bf` |
| Taylor Swift | `reference-revised-taylor-swift` | 5,042 | 5,422 | `d638bed9556d3a94929e740c677f90a931d53e65a5ab2536794e214ffc84bad4` |
| Mark Zuckerberg | `reference-mark-zuckerberg` | 4,680 | 5,028 | `bfc53b4286bd5f5fa25415386c776da7406c0f634125a192f205bb90cfafa5c8` |

The original recipes remain verbatim in the
[October 12 experiment record](experiments/muse-prompt-engineering-2026-10-12.json).
The new builder preserves their garment and character constraints, changes
the reference wording from attached to downloaded image, and replaces the
old prohibition on personality changes with the new explicit personality
setup request. Mark uses the original recipe because the revised October 12
version introduced a hood regression. Default hashes identify the exact native
test payloads; changing tone settings changes the compiled text and its hash.

## Native protocol and release gate

The completed matrix used **nine actual clicked links**, three repetitions per
preset in round-robin order, in one signed-in desktop account's existing Main
chat. Each request used the frozen production payload and a separate Send
action. It applied the personality as well as requesting avatar candidates;
this differs from the earlier transfer-only probe. Every returned option was
captured and reviewed, without selecting a preferred subset.

The release gate was recorded before completing the matrix:

- All 9 clicked links must prefill the exact intended message.
- All 9 requests must reach a native chooser within 240 seconds, without
  manual pasting, attachment or reference-path correction.
- Visible activity must support the workspace download, expected reference
  hash and native image-reference use. Activity summaries do not independently
  prove the generator's internal conditioning.
- Each chooser must offer at least three usable costume candidates, and at
  least 90% of all outputs must meet the visible face/hood/plush-material
  criterion. Review complete output images, not only chooser thumbnails.
- Exposed saved identity/style files must reflect the intended preset across
  transitions and retain it after reload. This is not an audit of every memory
  or a guarantee of exact behavior in future conversations.

A usable candidate has the shared plush character and the principal requested
costume cues, without a severe artifact or unrelated replacement. Visible
identity review allows small proportion or texture differences while requiring
the cream plush hood, simple glossy eyes, cheeks and small smile. It does not
mean pixel equality, exact hands or fully preserved anatomy. Clothing can
conceal critical geometry; mark that geometry unassessable. This practical
handoff rubric is distinct from the detailed October 12 dimension scores.

No **Select** action was taken. The original avatar was retained throughout
the nine requests. The exposed identity/style baseline was captured before
mutation. Restoration is recorded separately below; unchanged avatar selection
alone does not prove that other account state remained unchanged.

## Native results

All **9/9 links prefilled the exact message**, and all **9/9 submitted requests
returned native choosers**, each with four candidates, without manual pasting,
image attachment or reference-path correction. Visible activity for all nine
showed a fresh workspace download, the expected hash and native image-reference
use. These activity records support the workflow; they do not independently
prove the generator's internal conditioning.

From Send to the captured chooser, the median was **88.279 seconds**, with a
range of **75.724–93.356 seconds**. Every request was below the predeclared
240-second limit. Integrity checks found 36 distinct output hashes; all 36
captured images were 1600 × 1600 pixels. The frozen module and all submitted
payload hashes matched the implementation.

| Preset | Requests completed | Candidates reviewed | Close visible identity | Usable costume candidates |
| --- | ---: | ---: | ---: | ---: |
| Mona Lisa | 3/3 | 12 | 12/12 | 12/12 |
| Taylor Swift | 3/3 | 12 | 12/12 | 12/12 |
| Mark Zuckerberg | 3/3 | 12 | 12/12 | 12/12 |
| Total | 9/9 | 36 | 36/36 | 36/36 |

Every chooser offered four usable candidates, exceeding the minimum of three.
No human hair was visible. The observed **36/36** visual result describes the
practical criteria above; it does not mean exact compliance with every prompt
detail or an expected 100% future success rate.

- Mona Lisa: all had the olive gown and dark veil. Bodice seams, collars,
  sleeves and fabrics varied; all had larger thumb-lobed mitten hands than
  the source stubs, and one had smoother hand material.
- Taylor Swift: all had the lavender strapped dress and silver microphone,
  without visible fingers. Microphone side, size, accents and an occasional
  cord varied, as did dress decoration, neckline and skirt layers.
- Mark Zuckerberg: all had the gray T-shirt, navy trousers, white sneakers
  and unmarked silver laptop. Only **10/12** honored the closed-laptop request;
  two laptops were open. Shirt fit, props, shoe details and mittens varied.
  The clothed silhouette had longer, more separated legs than the base.

All figures were fully in frame, but clothing concealed exact body geometry
in all 36. A full figure in frame does not establish matching anatomy.
**Stable full figures and identical gallery previews remain unverified.**

The exposed saved identity and style files reflected the intended preset after
all nine requests and reloads. There were **eight actual preset transitions**;
the first Mona Lisa request already matched the baseline preset. These checks
support saved-style replacement within this account, not perfect behavioral
adherence or every unexposed memory setting.

All nine saved profiles contained an explicit no-emoji preference, yet Muse also
produced native thumbs-up acknowledgement reactions. A native reaction is
distinct from an emoji in an ordinary reply, but the observed experience was
not entirely emoji-free. Mark's third request also encountered one
`old_text_missing` failure while updating a memory-history entry. Subsequent
visible memory contained the full nine-run history and correct final Mark
preferences, confirming automatic recovery without manual rescue. Generation
and active-style checks passed; the run was not completely error-free.

## Baseline restoration

**Restoration passed after reload.** Downloaded `IDENTITY.md` and `SOUL.md`
matched their captured pre-test baselines byte for byte. Visible `MEMORY.md`
again records Mona Lisa as the standing style, with Taylor and Mark explicitly
superseded as temporary tests. The comparison immediately before and after
restoration showed changes confined to the test fact, active style and test
supersession note; other captured facts, boundaries and commitments remained.
There was no pre-test full-memory baseline, so this does not establish equality
of all memory or hidden account state. Generated candidates and test history
remain available; no candidate was selected.
The original human/doll-style Mona Lisa avatar was visibly confirmed in a
freshly loaded Main chat. The unsent test draft and prompt query were cleared.

## Completed local implementation checks

The Node suite passed **78/78 tests**, including six new handoff tests for
eligibility, exact compiled tone, Unicode/reserved-character transport,
reference checksum/guards, personality versus selection behavior, and
preservation of the chosen historical recipe constraints. The production build,
app and spotlight syntax checks, and whitespace check passed.

An isolated Chromium browser check passed **33/33 checks**. It covered all 18
presets' supported/fallback setup, displayed/copied/downloaded prompt parity,
the three prepared links, edited and saved tone after reload, denied-clipboard
fallback, modal keyboard behavior, preserved stage/tile focus, and readable
1440/390/320px layouts without horizontal overflow or JavaScript errors. All
Muse navigation in that UI check was intercepted locally; it adds no native
Muse submissions or mobile-device evidence. Native Chrome may move Tab focus
into browser chrome; the check verified that background page controls could
not receive focus while the dialog was open.

## Evidence boundaries and release status

The October 12 engineering experiment contains **84 options from 21 requests**
and tested image attachments. The earlier October 14 link experiment contains
**8 options from 2 Mona Lisa requests** and explicitly excluded personality
application. The new matrix contains **36 options from 9 production
payload requests** delivered by URL. Keep all three datasets separate; an older
94% visible-match calculation must not be assigned to the new delivery route.

This is an observed, undocumented web handoff, not an official Muse API
contract. Account/Main-chat context is shared across repeats. This passing
sample supports a limited guided trial, not a guaranteed future success
rate, automatic activation, stable complete figures or all-roster coverage.
Actual mobile browsers/native apps, fresh accounts and successful transfer
through completed login remain unverified. The gallery preview is an intended
costume, not an identical avatar promised to the user.

Local evidence is under `persa-test-results/2026-10-14-muse-handoff-release/`,
outside the repository. Keep native outputs, private account screenshots,
saved identity/style content, chat URLs and raw conversations outside Git.
The prompt-engineering JSON remains public recipe provenance, not
private account evidence.

**Release decision: proceed with the limited three-preset guided trial.**
Baseline restoration and the completed generation, reference,
visual and saved-style gates passed. Keep the other 15 presets on the existing
manual setup and preserve the complete-combo fallback.

The implementation shipped in source commit
[`e237c33`](https://github.com/bubbl-ai/persa/commit/e237c33a8b12545966994e7de7099453e7b32ec0).
The [test workflow](https://github.com/bubbl-ai/persa/actions/runs/38588048898)
passed on Node 20, 22 and 24, including the clean package-install check.
The [Vercel deployment](https://github.com/bubbl-ai/persa/actions/runs/38588048608)
also succeeded through the existing main-branch workflow.

Production passed **26/26 smoke checks** on October 14. Deployed `app.js` and
the handoff module matched the validated local files. All 18 characters and
19 image assets loaded, including the shared base with its expected checksum.
The three exact prepared links and 15 manual flows passed, as did desktop,
390px and 320px layouts. There were no JavaScript errors or failed requests.
Muse launches were intercepted during this public-site check; it added no
native generations or account changes. Private evidence is in `live-smoke.json`
under the local evidence directory above. This documentation follow-up records
the verified implementation rollout without changing its runtime files.
