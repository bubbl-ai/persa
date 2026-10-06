# Muse candidate batch validation

> Historical validation: these results cover the earlier likeness-based avatar
> prompts. The October 6 shared-Muse costume redesign changes the avatar inputs;
> its new prompts have not been tested in Muse. See [the current design](MUSE_AVATAR_DESIGN.md).


Date: October 5, 2026 (UTC). Environment: one signed-in Muse account in
desktop Chrome. This extends the [Mona Lisa test](MUSE_VALIDATION.md).

**Outcome:** all 13 eligible avatar workflows produced an avatar that remained
active after reload. All 18 personalities received saved-configuration checks
(including the initial Mona Lisa case); Barbie and SpongeBob retained a
conflicting emoji rule. Five avatar workflows remain untested. The condition
to implement the complete batch was not met.

## Method

The public Persa site's default **Copy combo** and **Personality only**
outputs were checked against the repository's actual combo function and
shared compiler for all 18 candidates. All 36 clipboard comparisons matched.
No tone sliders were changed.

For each eligible full combo, submit that exact default message in a new Muse
side chat, wait for native avatar options, select option 1, and click
**Select**. Wait for activation to finish, fully reload Muse, then inspect
the active avatar and saved `IDENTITY.md` and `SOUL.md` through Muse's UI.
Open a fresh side chat and collect one reply without repasting the persona.
Selected images were reviewed against the named preset's visual cues and
against the active avatar after reload.

The earlier image-generation attempts for Michael Jackson, Lionel Messi,
Harry Potter, SpongeBob, and The Joker have unresolved safety refusals in
the image manifest. Their avatar requests were not retried through Muse.
Their personality-only tests use the exact compiled personality preceded
by an instruction to keep the current avatar and not generate, edit, or
suggest images. Such a test cannot establish full-combo compatibility.

These are sequential tests in one account. They exercise replacement of a
previous preset, rather than independent clean accounts. Muse can remember
other side chats: Olivia Rodrigo and Marilyn Monroe explicitly recalled
earlier repetitions of the follow-up question. Starting with Drake, the
follow-up explicitly described a hypothetical creative-project scenario
and said it was not information about the user. Behavioral samples are
qualitative checks, not isolated measurements of personality effects.

## Findings

“Passed” below means the tested avatar selection/persistence or saved core
style worked in this account. It does not promise exact likeness, exact display
names, or perfect adherence to every personality instruction. The five
personality-only checks kept Hello Kitty's existing avatar unchanged.

| Preset | Avatar activation and reload | Saved personality and notable observations |
| --- | --- | --- |
| Mona Lisa | Passed in the initial test | Saved style passed; separate initial record. |
| Wednesday Addams | Passed | Core style replaced Mona Lisa cleanly. |
| Taylor Swift | Passed | Core style passed; two loaded options captured at selection. |
| Mark Zuckerberg | Passed | Core style passed; face looks generic despite matching hair/clothing cues. |
| Barbie | Passed | Partial: core style changed, but old no-emoji rule remained instead of the configured sparing policy. |
| Harry Potter | Not tested | Personality-only core style passed; existing avatar unchanged. |
| Charlie Chaplin | Passed | Core style passed; name shortened to Charlie and sample somewhat longer than requested. |
| Michael Jackson | Not tested | Personality-only core style passed; existing avatar unchanged. |
| Olivia Rodrigo | Passed | Core style passed; name shortened to Olivia, generic facial likeness, prior-test recall in fresh chat. |
| Marilyn Monroe | Passed | Core style passed; name shortened to Marilyn and prior-test recall in fresh chat. |
| Drake | Passed | Core style passed; hypothetical sample was concise and practical. |
| Lionel Messi | Not tested | Personality-only core style passed; existing avatar unchanged. |
| Kylie Jenner | Passed | Core style passed; sample somewhat longer than the brief preference. |
| MrBeast | Passed | Core style passed; personal likeness remains uncertain. |
| The Rock | Passed | Core style passed; requested appearance cues present. |
| SpongeBob | Not tested | Partial personality-only result: core style changed, but old no-emoji rule remained. Existing avatar unchanged. |
| Hello Kitty | Passed | Gentle core style replaced The Rock's style; recognizable design lacks whiskers, which the prompt also omitted. |
| The Joker | Not tested | Personality-only core style passed; existing avatar unchanged. |

- Muse generated native avatar candidates from the eligible combined
  prompts without rewriting them. The test captured two options for Taylor
  Swift and four for the other completed full-combo cases; this is not a
  guarantee of a fixed option count.
- Muse saves summaries of the requested personality. A saved name/style
  and one compatible reply establish limited persistence evidence, not
  complete adherence to every instruction.
- Barbie and SpongeBob exposed incomplete preset replacement: `IDENTITY.md` retained
  `Emoji: None.` although their catalog setting is `sparing`. The shared
  compiler currently omits the instruction for `sparing`, leaving the old
  prohibition unaddressed. The lack of emoji in a single response is not
  the failure; the conflicting saved rule is.
- Charlie Chaplin, Olivia Rodrigo, and Marilyn Monroe were saved under
  shortened display names (Charlie, Olivia, Marilyn), with the intended
  figure still identified in the character description.
- Some samples were longer than the requested brief style. Recognizable
  hair/clothing cues do not establish an exact real-person likeness;
  Mark Zuckerberg and Olivia Rodrigo in particular look generic.
- A generated Muse image is an example output. The existing Persa gallery
  image and a future independent Muse generation need not match it.
- A cleanup request in the original main chat reported that Mona Lisa had
  been restored, but a full reload still showed Hello Kitty's avatar and
  The Joker's identity. Confirmation text alone is not evidence of success.
- A follow-up attached the original Muse-generated Mona Lisa image and
  requested exact reuse without regeneration. The avatar stayed unchanged;
  Muse reported that its available avatar tools activate newly generated
  candidates rather than an arbitrary existing image file. This attempt did
  not establish a working exact-image import route or rule out every other
  possible integration. Returning the account's avatar to Mona Lisa required
  the normal generation/selection route, producing a new variant.

## Implementation decision

The user's condition was to implement the remaining presets if they all
work. That condition has not been met: a saved-setting mismatch was found,
and five avatars remain untested. No website code, gallery artwork, compiler
behavior, public deployment, or GitHub push is included in this validation.

Before a complete batch can be called ready, address explicit preset
replacement (including the omitted sparing-emoji rule), retest transitions,
resolve the five unavailable avatars through suitable permitted artwork,
and review character likenesses. Keep the existing unavailable states and
generation history; do not substitute unrelated figures.

## Final account state

After testing, Mona Lisa's name and personality were restored. A new Mona Lisa
avatar variant was generated and selected because exact reuse of the earlier
image did not work through the tested path. A final full reload confirmed the
new Mona Lisa avatar, Mona Lisa identity, and saved Mona Lisa style with the
no-emoji rule. The account was not left using a temporary test character.

Muse was told that the repeated procrastination and creative-project questions
were scripted tests rather than user habits. It acknowledged correcting the
test-derived memory inference; this memory cleanup was not independently audited.
Unrelated user records and conversation history were not intentionally changed.

## Limits

This run does not test mobile Muse, edited tone settings, one-click import,
an import API or deep link, independent-generation repeatability, multiple
accounts, automatic synchronization, or reset/removal. The exact-image reuse
attempt above was unsuccessful; no general image-import mechanism was verified.
It does not verify every response against every personality rule.

Raw conversation records, private URLs, account screenshots, and generated
test images stay in local QA artifacts. None are included in this repository.
The local comparison page is evidence for review, not a published feature.
