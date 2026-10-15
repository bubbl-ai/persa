# Direct Muse handoff for all characters

Date: October 15, 2026 (Asia/Shanghai).

**Implemented in this checkout: direct Open in Muse links for all 18 presets.**
The Node suite, build, local browser checks and all 18 native prefills pass.
**Native validation is incomplete:** the resumed
Wednesday v2 run corrected its saved style but returned only two usable avatar
options, below the predeclared minimum of three. The other 14 v2 presets have
not been submitted. After reviewing these results, the user explicitly requested
publishing the current update to `main` on October 15. Release verification is
recorded below. The original standing Muse profile has been restored and verified
as described below.

The user requested all characters and the simplest route from Persa. This
replaces the previous three-preset rollout restriction. Availability in the
website is separate from the amount of native evidence for each preset.

## One click from the selected character

**Open in Muse** is now a real link on the spotlight stage, every character
tile and the personality detail dialog. It opens the prepared Muse message
directly, without an intermediate setup/help dialog. The link carries that
character's current compiled personality and matching avatar instructions.
Users can open the normal link with the browser's usual navigation controls.

The remaining Muse steps are explicit: **press Send, then choose an avatar
and click Select**. Opening the link does not submit the message, save the
personality or activate an avatar. This is one click to leave Persa with a
prepared combo, not one-click application of the combo inside Muse.

**Setup options** is optional, available from the stage or detail dialog. It
retains the full instructions, **Copy complete combo**, personality-only and
clearly labeled text-only avatar copying, JSON download and local saving.
If login or the browser leaves Muse's composer empty, the complete-combo copy
is the fallback. An existing unsent Muse draft can take precedence over the
prefilled message; review the draft before clearing the composer and reopening
the link, or use the copy fallback. Clipboard denial shows selectable text. The separate
text-only avatar prompt omits the image reference and is not equivalent to
the complete combo.

All 18 presets remain visible in the stage and collection. Tone edits, reset
and saved preferences update the direct links. The current draft takes
precedence over a saved setting; a preset without either uses its defaults.
Local saving does not update Muse automatically. There is still no JSON import,
cross-device collection sync or account-application API.

## Shared implementation and recipe versions

[`src/muse-handoff.js`](../src/muse-handoff.js) remains the browser-safe payload
builder and uses the existing Muse compiler. Link, complete-combo copy,
displayed instructions and JSON export share its output. `web/app.js` owns the
current tone and keeps the stage, tiles and dialog links current; the stage
receives the same handoff builder through its existing integration.

| Presets | Version | Recipe source |
| --- | --- | --- |
| Mona Lisa, Taylor Swift, Mark Zuckerberg | `muse-reference-handoff-v1` | Their three previously tested default payloads remain byte-for-byte unchanged. The [October 14 report](MUSE_HANDOFF_RELIABILITY.md) retains their exact hashes and repeat results. |
| Other 15 named catalog presets | `muse-reference-wardrobe-v2` | The existing authored `avatar.costume` text, combined with a shared character-preservation recipe and saved-style verification instructions. |

The new 15 are Wednesday Addams, Barbie, Harry Potter, Charlie Chaplin,
Michael Jackson, Olivia Rodrigo, Marilyn Monroe, Drake, Lionel Messi,
Kylie Jenner, MrBeast, The Rock, SpongeBob, Hello Kitty and The Joker.

The new recipe requests the existing cream plush source character, complete
clothing, fingerless mittens and a white studio background. Hats, glasses,
gloves and extra garment hoods get explicit placement instructions so the
costume does not replace the shared face/hood with another animal, human or
mascot. The catalog's legacy text-only avatar prompts, preview artwork and
historical generation/refusal records are unchanged.

The current v2 recipe explicitly requests **four native candidates**. Before
generation, it also asks Muse to re-read its saved identity/Vibe, personality
style and standing personality preferences, correct conflicting prior-character
settings while preserving unrelated content, and check again after its final
edit. If it cannot save a consistent personality, it must explain the problem
and stop. These changes respond to the v1 pilot below; stronger instructions
alone do not prove that saved settings will be consistent.

The personality wrapper explicitly replaces prior character voice, tone and
emoji preferences while preserving unrelated memories, settings and account
display name. **Barbie and SpongeBob explicitly permit sparing emoji and
replace a prior no-emoji preference.** This addresses an omission in the
compiler's neutral `sparing` output; it is a request to Muse, not proof of
saved preference replacement until checked natively. The other presets retain
their authored emoji setting, including `never` where specified.

Every combo requests a fresh download of the unchanged production
[shared base PNG](https://persa.bubblai.com/avatars/muse-costumes-v1/base.png)
directly into Muse's workspace, checksum verification and actual native
image-reference input. It stops the avatar step if those capabilities are
unavailable, and prohibits automatic selection. No custom connector or manual
image attachment is required by the intended handoff.

Frozen module SHA-256:
`4c40b3ecbbd121c8a828d697de0988b7cb9221aa81a7c6f717cd0cbfc1b9be37`.
Shared base SHA-256:
`c428fd4d8608ca5bd5d72a5c3f49a20be680a739a94bb9e658e3f4be23a4ec2f`.
Default encoded URLs range from 5,028 to 6,637 characters; URL and message
lengths are different. Tone edits change the payload and may change its length.

## Validation protocol and current results

The Node suite passed **82 tests** and the website build passed. Focused
handoff coverage includes all 18 named IDs, distinct authored costumes,
unknown-ID/missing-costume rejection, current compiled tone, unchanged hashes
for the original three, explicit sparing-emoji replacement, reference
checksum/guards, URL encoding, saved-style re-read instructions and
user-controlled avatar selection.

The native protocol has two separate parts:

1. Click actual prepared links for all 18 presets and verify the entire
   composer text exactly, without sending those prefill-only checks.
2. Submit one production-payload request for each of the 15 newly supported
   presets. Capture every candidate and visible activity, record latency and
   check saved identity/style after each request. Each should reach a native
   chooser within 240 seconds without manual paste, attachment or path repair,
   and offer at least three usable shared-character costume options.

The original three retain their exact October 14 payloads and prior three
repetitions each. The planned matrix allows one compatibility run per new
preset; only Wednesday has completed a v2 run so far. This is not repeated
stability evidence. Record actual returned counts rather
than inferring them from the usual four-option chooser. All runs share one
signed-in desktop account and its existing Main chat. No Select action is
planned; saved identity/style/memory baselines are captured before mutation.

All **18/18 actual tile links** opened signed-in Muse with the exact current
message, including v2 for the new 15. These prefill-only checks took
0.877–1.312 seconds per navigation and sent no message. Each test draft was
cleared before the next check. Every recorded payload, URL, prompt hash and
measured length matches the current source builder; its built copy also matches.
The earlier v1 prefill run remains separate in the evidence directory.

Independent local browser QA passed **59 checks** with no unresolved findings.
It exercised 61 intercepted prompt navigations, including all 54 combinations
of 18 presets and stage/tile/detail entry points, plus saved collection and
keyboard entry. Current/tuned/saved/reset tone, optional setup, copying,
downloads, denied-clipboard fallback, native middle-click, save focus and
accessible Save labels passed. All 18 previews decoded, and 1440/390/320px
layouts had no overflow, clipped primary controls or nested interactive
controls. Source/build hashes matched at that UI checkpoint, before the v2
payload revision; the interface is unchanged. Muse destinations were intercepted
in this UI check; it adds no native submissions or real mobile-device evidence.

### Preserved v1 native pilot

The earlier `muse-reference-wardrobe-v1` pilot submitted Wednesday, Barbie and
Harry Potter once each. It returned ten candidates, with **9/10 usable** under
the practical visible-identity and costume rubric. These are pilot observations,
not an all-roster success rate, and are not pooled with the v2 matrix.

| Pilot preset | Native candidates | Usable | Saved-style check | Result |
| --- | --- | --- | --- | --- |
| Wednesday Addams | 4 | 3 | Failed: the name changed but the saved Vibe retained Mona Lisa's voice. | One option also added unwanted ear-like fleece shapes. The chooser met the three-usable-option gate, but the combo failed its saved-style check. |
| Barbie | 4 | 4 | Passed, including the sparing-emoji preference. | Met the chooser and saved-style checks in this one run. |
| Harry Potter | 2 | 2 | Passed. | Failed the predeclared minimum of three usable options because Muse returned only two candidates. This was the actual output count, not an image-capture omission. |

The pilot produced exact prefills and visible fresh reference download/hash/use
for all three requests. No candidate was selected. Native acknowledgement
reactions persisted despite no-emoji settings where applicable. Wednesday's
saved document, rather than the task's claimed edit, determined the failed
style result. The v2 changes above address these observed failure modes; the
limited resumed result follows separately.

### Current v2 native matrix

The resumed request `wednesday-v2-1` reached a native chooser with four
candidates in **121.209 seconds**, with exact prefill and no manual paste,
attachment, path correction or candidate selection. Visible activity verified
a fresh workspace reference download and the expected checksum, and reported
using that file for native generation. This is visible reference-use evidence,
not independent verification of the generator's internal conditioning.

**Only 2/4 candidates were usable.** Options 2 and 4 added conspicuous rounded
cream ear-like protrusions behind the black bows, altering the base hood. Options
1 and 3 preserved the practical visible identity and principal costume; dress
sleeves, book size and hand placement varied. Clothing concealed parts of the
body, so exact underlying proportions remain unassessable. The run **failed the
predeclared minimum of three usable options per chooser**.

The actual saved identity and style documents passed after reload: the Vibe and
style now matched Wednesday's cool, brief, blunt voice with no emoji, and the
stale Mona Lisa Vibe was absent. That fixes the observed persistence failure in
this one request, not across the roster. Standing memory consistency was
reported in activity but was not independently downloaded for this request.
A native thumbs-up acknowledgement still appeared despite the saved no-emoji
setting.

**New-15 native validation is incomplete: one v2 request completed and failed
the avatar quality gate; the other 14 have not been submitted.** Do not combine
these four outputs with the ten v1 pilot outputs or the original trio's older
matrix. No all-roster compatibility claim or future stability percentage is
supported. The subsequent publication request changes the release decision,
not these test results or the unmet quality gate.

## Account restoration

**Baseline restoration verified after the stopped validation session.** Fresh
downloads of the exposed identity and style documents match the pre-test
baseline exactly, excluding download annotations. An independent comparison of
the memory document found the original standing Mona Lisa preferences restored
and unrelated lines preserved; only two validation-history summary lines changed.
That history's broad “validation finished” wording describes the ended test
session, not a completed or passing all-character matrix.

After a fresh page load, the original selected Mona Lisa avatar was visually
unchanged, the composer was empty and the test prompt query was absent. Extra
test tabs were closed. No candidate was selected. This verifies the exposed
documents and visible profile, not every hidden account state.

## Limits and release status

The `?prompt=` route is observed web behavior, not a documented third-party
application contract. The inspected signed-in client handler uses `prompt`
or `prompt_id` to fill and focus the draft composer, preserving an existing
draft. No send operation or auto-send flag was found in that handler. This
does not prove that every possible application route is impossible.

The reviewed [Muse platform documentation](https://platform.muse.ai/docs) and
[product introduction](https://introducing.muse.ai/), together with the
[earlier connector investigation](MUSE_ONE_CLICK_VALIDATION.md), did not
establish a supported third-party API for applying a saved personality and
avatar. No verified mechanism in this work removes Muse's Send and Select
steps. Actual mobile
browsers/native apps, fresh accounts and completed-login transfer remain
unverified; responsive desktop checks do not establish those paths.

The preview remains an intended costume, not an identical image promised to
the user. Generation can change garments, props, hands, facial details or
proportions, and clothing can conceal the geometry needed to assess full-body
stability. Saved style does not guarantee every conversational or interface
behavior. Keep compatibility, repeatability and exact-image claims separate.

Evidence remains outside the repository under
`persa-test-results/2026-10-15-all-character-handoff/`. Do not commit private
identity/style/memory files, account screenshots, chat URLs or raw conversations.
The older 84-output attachment experiment, two-request link probe and
nine-request three-preset matrix retain their original scopes and counts.

<!-- DEPLOYMENT_PENDING: record the release decision, source commit, test and
Vercel workflow results and canonical live smoke checks after completion. -->

**Release requested on October 15; deployment verification pending.** After
being told that the revised Wednesday request failed the avatar quality gate
and native validation was incomplete, the user explicitly requested pushing
the current update to `main`. Publish the all-18 direct links through the existing
GitHub Actions/Vercel workflow while retaining the known quality limitations.
This release decision does not establish all-roster native compatibility or
change any failed result. Record the source commit, both workflow outcomes and
production smoke checks here after deployment.
