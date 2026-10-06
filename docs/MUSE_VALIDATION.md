# Muse combo validation

> Historical validation: these results cover the earlier likeness-based avatar
> prompts. The October 6 shared-Muse costume redesign changes the avatar inputs;
> its new prompts have not been tested in Muse. See [the current design](MUSE_AVATAR_DESIGN.md).


Date: October 5, 2026. Environment: one signed-in Muse account in desktop Chrome.
Preset: Mona Lisa with unmodified default tone settings.

This is the initial single-preset record. The later
[candidate batch validation](MUSE_BATCH_VALIDATION.md) extends its coverage
and records the current implementation decision and account state.

## Input and procedure

The public Persa website copied a 2,802-character combined personality and avatar
message. It exactly matched the repository's compiled combo. That message was
submitted unchanged; no revised instruction was needed for the results below.

Input SHA-256: `a6910fb90722b37b85a231dc24d40237cb3cf8cdffab16a767b817dc61d28e5d`.

1. Copy the default Mona Lisa combo from Persa and paste it into Muse's chat.
2. Wait for Muse's avatar candidates. This test returned four options.
3. Choose option 1, then click **Select**. Muse submitted “Option 1” in the chat
   and changed the active avatar.
4. Fully reload Muse, then inspect the active avatar and saved identity/personality.
5. Open a fresh side chat and ask a neutral question without repeating the persona.
   The question requested a short plan for a hypothetical two-hour afternoon with
   three errands.

Muse's native avatar control was also inspected: the pencil beside the profile
avatar → **Change avatar** prefills “Change your avatar to…” in the chat composer.
The combined-prompt test did not need this entry point.

## Observed results

| Check | Result |
| --- | --- |
| Persa clipboard output | Passed: complete unchanged combo matched the repository output. |
| Avatar creation | Passed: Muse generated four candidates from the combined prompt. |
| Active avatar application | Passed: choosing option 1 and clicking **Select** changed the active profile avatar, not only a chat image. |
| Avatar after full reload | Passed: the selected Mona Lisa avatar remained active. |
| Saved identity and personality | Passed after reload: `IDENTITY.md` contained Mona Lisa's name, character, and vibe; `SOUL.md` contained a summary of the requested style. |
| Fresh-conversation behavior | Passed as one compatible sample: without repeating the persona, a fresh side chat returned a composed, practical timed plan with no emoji and an unhurried close. |
| Exact match to Persa's preview | No: all four candidates visibly differed from the existing gallery artwork. |

Muse saved summarized preferences rather than a verbatim copy of every instruction.
Saved settings establish persistence in this session; the one compatible response
does not prove perfect adherence or isolate how much the saved persona affected it.
Neither check guarantees that every response follows every rule. The four candidates
retained recognizable prompt features but differed in face, proportions, clothing,
and hand placement. Persa's
existing preview was generated outside Muse and is an illustration of the intended
appearance, not an exact output promise.

## Limits and account state

This initial test covers one default preset in one desktop account. The other
presets are addressed in the later batch record. Modified tone settings, mobile
Muse setup, independent-generation repeatability, direct import, prefilled deep
links, and synchronization were not tested here. Four
options from one request do not establish repeatability across independent requests.
This initial test did not validate replacement or removal as general user workflows.

The test changed this account's active avatar and saved identity/personality.
It ended with Mona Lisa active; the later batch test changed that configuration
again. See its account-state record for the final state. Reset and removal were
not tested here.

No account name, private conversation URL, credentials, or account screenshots are
included here. No website code or artwork was changed as part of this validation.
