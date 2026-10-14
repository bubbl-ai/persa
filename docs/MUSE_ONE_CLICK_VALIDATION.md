# Muse link handoff validation

Date: October 14, 2026 (Asia/Shanghai). **Historical transfer-only experiment.**

The later [guided-handoff reliability report](MUSE_HANDOFF_RELIABILITY.md)
tracks the three-preset implementation, production-payload repeats and release
status. The observations below remain the earlier two Mona Lisa requests;
they did not apply personality settings and are not evidence of a completed
combo installation or the later route's reliability.

A link using `https://muse.ai/?prompt=…` opened signed-in Muse with the complete
Persa test message already in its composer. Two submitted requests each
produced four native avatar candidates without manual pasting or an image
attachment. The first required automatic reference-path recovery; a revised
request downloading the reference directly into Muse's workspace succeeded
without that visible error. This supports opening and sending a prepared
message to reach the native chooser. Both tests explicitly stopped before
activation and do not establish one-click application of both a saved
personality and an active avatar.

The test used Mona Lisa in one existing desktop Chrome account. The prefilled
URL opened that account's existing **Main chat**, not a new isolated side chat;
account and conversation context can affect generation and interpretation.
It follows the [October 12 prompt-engineering experiment](MUSE_PROMPT_ENGINEERING.md),
but tests transfer and generation rather than figure stability. No new
stability percentage follows from this handoff experiment.

## Link behavior

The successful check clicked an actual link in a separate local HTML test
page. Browser automation did not fill the Muse composer or paste the message.
The URL carried a 4,296-character test message in its `prompt` query parameter;
the complete encoded URL was 4,614 characters. The composer contained the exact
message, confirmed by its length and SHA-256:
`31987e23fb2e2e0292a8c8b445507bfb2106832772fab5c79ce6eb3d6dc67a78`.

| Check | Observed result |
| --- | --- |
| `?prompt=` with a short marker | Composer prefilled; message was not sent. |
| `?text=` and `?message=` with the same marker | Composer remained empty. These negative checks do not rule out other routes. |
| Actual clicked link containing the full combo test | All 4,296 characters arrived exactly; **Send** remained a separate action. |
| Full payload at 390 px and 320 px | Exact message retained at both responsive viewport widths; no attachment added or message sent. |
| Reserved characters, Unicode and newlines | All 68 test characters survived encoding and decoding exactly. |
| Reload with the prefill URL | Composer retained the exact test message. |
| Signed-out isolated browser context | Login appeared with no composer; the URL retained the prompt query. Login completion was not tested. |

The narrower viewport checks used desktop Chromium. They do not validate an
iPhone, Android browser, native Muse app, operating-system app linking or
successful transfer through authentication. The signed-out check establishes
the login gate only. No official documentation establishing this query
parameter as a supported integration contract was found during the review.
Treat it as observed session behavior that can change, and retain the existing
copy/paste path when implementing a trial.

## Payload and reference image

The test message included the Mona Lisa personality compiled by
[`src/compile.js`](../src/compile.js) for target `muse`, the preferred revised
Mona Lisa avatar recipe from October 12, and this public reference:

[Shared plush base PNG](https://persa.bubblai.com/avatars/muse-costumes-v1/base.png)

The public image returned HTTP 200 with content type `image/png`, size
1,660,983 bytes and SHA-256
`c428fd4d8608ca5bd5d72a5c3f49a20be680a739a94bb9e658e3f4be23a4ec2f`.
It matches the repository base and the reference uploaded in the October 12
experiment. The test instructed Muse to download that image, verify the hash
and use it as the native generator's reference. It explicitly asked Muse to
stop if passing the actual image was unavailable.

The personality was labeled **transfer check only; do not apply**. Muse was
asked to identify its name and voice characteristics, without adopting or
persisting it. The avatar recipe requested candidates without selection or
activation. This allowed inspection of the transfer and generation steps
without treating a personality string arriving in chat as saved preferences.

## Native avatar result

For the first request, after the separate **Send** action, the native chooser returned four images,
each 1600 × 1600 pixels. All four were captured, and the chooser's **Select**
control was visible. No option was selected.

Expanded user-facing activity details showed the downloaded reference matching
the expected hash. The first `avatar.create` attempt failed with
`avatar_reference_path_rejected`: the image was under `/tmp`, outside Muse's
workspace. Muse copied the same image into its workspace, verified the matching
hash again and retried successfully. The successful activity details named the
workspace image reference and native candidate outputs.

This provides visible activity evidence of reference handoff beyond the final
chat acknowledgment. These details are user-facing activity summaries, not raw
backend request traces or an independent guarantee of internal image
conditioning. The success activity summary described three candidates while
the actual native chooser displayed four; this report counts the four captured
1600 × 1600 outputs rather than inferring a count from that summary.

The observed result is that this URL-delivered message reached native avatar
generation without a manual image attachment. It does not show exact
reproduction of the gallery preview, stable outcomes across repeated URL-based
requests, saved personality replacement, avatar activation or persistence.
The earlier attachment-based stability observations must not be assigned to
this new delivery route.

### Workspace-path revision

After the original attempt exposed the path constraint, a second test message
explicitly directed Muse to download the image into its workspace from the
start. Its text is 4,444 characters, its encoded URL is 4,766 characters and its
SHA-256 is
`b13ceb287070a133e119cd9d32168f8f812af76cdcbf5624cc3b0eda7d0db422`.
This repeat was submitted after the temporary connector had been removed and
the local fixture and public tunnel stopped. It uses the production image URL.
The actual clicked link prefilled all 4,444 characters exactly before the
separate **Send** action. Visible activity showed a fresh download directly to
`~/workspace/persa-test/base.png`, the expected reference hash and successful
`avatar.create` generation with that workspace image reference. The visible
timeline contained one generation event, with no rejected-path event or
recovery in this revised request.

The chooser returned four new 1600 × 1600 options. Across the original and
revised user requests, all eight captured output hashes are distinct. No
candidate was selected, and neither request applied a persistent personality.
This is one successful workspace-first follow-up in the same account and
Main chat, not a reliability estimate across repeated identical requests or
independent accounts. Existing account and conversation context were retained.

## Separate custom connector probe

A separate side chat tested a temporary read-only fixture serving the public
personality, the exact avatar recipe, an OpenAPI description and the shared
base image. Its allowlisted GET
routes logged timestamps and paths only. The probe retrieved the combo JSON
and image; requests reached the fixture, and Muse reported creating
`custom.persa-combo-test`.

Muse also reported that direct requests received HTTP 403 from the temporary
tunnel and that browser retrieval worked as a fallback. These observations
support access to the public test data, not a reliable production connector
contract or a verified account-mutation API. Connector creation was reported
by Muse; durable operation across sessions was not established.

The successful prefilled message contains the personality and recipe inline
and refers directly to the public production image. It does not require this
temporary connector, tunnel or fixture. No connector was submitted to a public
directory.

## Cleanup and account-state checks

Before the workspace-path repeat, Muse reported moving the temporary test
connector to recoverable trash. The public tunnel and local fixture were
stopped, and a connection check confirmed that local port 8793 was unreachable.
After a Main chat reload, the original human/doll-style Mona Lisa avatar
remained visibly active. No **Select** action was taken.

Hidden identity, saved preferences and memory were not audited. Cleanup
activity reported an update to `MEMORY.md`, so the visible unchanged avatar
must not be described as proof that every account setting remained unchanged.
After the workspace-path repeat, a second full reload again showed the
original Mona Lisa name and human/doll-style avatar. The test tab was closed
and the account was left in Main chat. The downloaded public reference remains
in Muse's workspace; no running test service remains.

## Product implication and pending checks

A possible trial button can open a prepared Muse message and remove the copy,
paste and manual-image-attachment steps demonstrated here. **Send** remained a
separate user action. The test stopped at the chooser because the prompt
explicitly prohibited selection and activation; it does not prove that manual
selection is the only possible activation route. Automatic combo application
remains untested. A personality-apply variant is additional work because this
test intentionally prohibited saving the personality.

Pending at the time of this report:

- Completing login after signed-out entry and confirming that it preserves
  the full message.
- Actual mobile browser and native-app behavior.
- More repetitions of the revised URL-based workflow, other accounts and
  other costumes.
- Explicit personality application and replacement, plus current-costume
  activation and persistence after a user selects an option.

Production UI, catalog prompts and artwork remain unchanged. This experiment
does not add a runtime integration, commit, push or deployment. The evidence
is outside the repository under
`persa-test-results/2026-10-14-muse-one-click/`: the prefill checks, exact test
input, public-base checksum, native output records and temporary fixture logs.
Private chat URLs, account screenshots and raw conversations remain outside
the repository.

Evidence integrity checks passed for both encoded prompts and all eight
distinct output hashes. The local comparison gallery loaded all eight images
without horizontal overflow at 1440, 390 and 320 pixels. These are artifact
checks, not additional native Muse generation or mobile tests.

Official sources reviewed for the separate connector investigation were
[Muse connector guidelines](https://platform.muse.ai/docs) and
[How Muse works with Connectors](https://www.meta.com/help/artificial-intelligence/1687253048996149/).
They describe Muse connecting to a service; they do not document the tested
`?prompt=` handoff or a Persa-to-Muse avatar application API.
