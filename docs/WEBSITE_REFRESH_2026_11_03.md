# Homepage refresh — November 3, 2026

Status: locally verified; publication pending.

The homepage now uses the supplied heading **Persa Avatars. Made for Muse AI.**
and this exact opening paragraph:

> Make your Meta Muse AI assistant look like and talk like your favorite celebrity! Choose from one of our fun presets and click open in Muse. It's that simple.

The collection eyebrow, stage collection label, three combo bullets, long
three-step section and repeated collection tagline are removed. The full grid
remains directly below the spotlight. Short Send/select guidance and optional
setup help still explain what users do after opening Muse.

## Layout and interaction

Previous/next arrows sit beside the portrait. The selected name follows the
stage immediately, above its three adjectives and primary Open in Muse action.
Viewport-relative stage sizing keeps the portrait, arrows, name and primary
action visible on common desktop and small portrait screens. Short landscape
screens place the name/actions alongside the stage to preserve usable space.
Swipe/drag, vertical page scrolling, keyboard arrows and the character picker
remain available.

All 18 characters have clean homepage links, such as
`https://persa.bubblai.com/?character=kylie-jenner`. A link opens its character in
the spotlight. Copy controls appear by the spotlight, on tiles and in detail.
Incoming campaign parameters/hash survive browsing; selection uses
`replaceState` so the Back button is not filled with every carousel step.
Back/Forward updates selection and closes stale detail views. Unknown IDs fall
back safely. Clipboard denial provides selectable link text. The full roster
and campaign example are in [Character links](CHARACTER_LINKS.md).

Links identify presets, not private browser-local tone changes. Returning users
can retain their own saved tone settings. All personality and Muse handoff
payloads are unchanged by this release.

## Preview motion

The user chose subtle pose motions using existing artwork. Each character has a
short sway, bow, bounce or pose when it enters focus. Motions run once for
2–2.4 seconds; they do not loop indefinitely. **Motion on/off** persists on the
device, and reduced-motion settings disable animation. Hidden tabs and dragging
stop active poses. Image transforms are separate from carousel positioning.

These are whole-image preview motions in Persa, with no audio, articulated hand
wave, singing assets or transfer of animation into Muse.

## Consistent backgrounds and provenance

Three active images had lilac pixels in their backgrounds: Charlie Chaplin,
SpongeBob and Hello Kitty. The other 15 were neutral near-white. The three now
use generated white-background display edits in
[`web/avatars/muse-white-background-v7/`](../web/avatars/muse-white-background-v7/).
Card/detail surfaces are white, stage lighting is neutral, and the old brightness,
multiply-blend and image-edge masks are removed.

Edits used **built-in image_gen**, separately for each original. Prompts asked
to replace only the backdrop with neutral white, preserving the plush face,
costume, props, pose and complete framing. Full exact prompts, source hashes,
output hashes, dimensions and inspections are recorded in
[`characters/image-generation.json`](../characters/image-generation.json).

Original source files and superseded records remain unchanged. Generated PNGs
are retained byte for byte; the website serves WebP compression derivatives
(quality 85, method 6), without further resizing or cropping. All three outputs
are 1254×1254; Chaplin's original native output was 1600×1600. Visual review
found the same recognizable figures/outfits/props, but generation can alter fine
fabric texture and edge fibers. Do not assert pixel-identical figures.

| Character | Display bytes | Active provenance |
| --- | ---: | --- |
| Charlie Chaplin | 55,154 | `imagegen-edit` / `background-edit` |
| SpongeBob | 86,714 | `imagegen-edit` / `background-edit` |
| Hello Kitty | 80,834 | `imagegen-edit` / `background-edit` |

The active collection contains 14 native Muse previews, one generated Rock
preview and three generated background edits. Original native provenance is
preserved in history; edited previews are not labeled native Muse outputs.
No new native Muse generations or account changes were made for this release.

## Verification and publication

All **97 Node tests**, browser-script syntax checks and the website build pass.
Baseline comparisons confirm all 18 personalities, visual recipes, text-only
prompts and complete Muse handoffs are unchanged. The other 15 avatar
definitions and image records are unchanged; the three archived replacements
are preserved apart from their appended retirement reasons.

Local browser checks cover six viewport sizes (1440×900, 1366×768, 390×844,
375×667, 320×568, 844×390), all 18 character links/poses, Back/Forward, campaign
parameters, clipboard fallback, saved tone, reduced motion, white backgrounds
and image-error recovery. Layout checks passed 20/20, character-link checks
25/25, motion checks 3/3, and all 18 bitmap background checks passed. Focused
Back/Forward/clipboard edge checks passed 5/5. White card/detail checks passed
2/2 and image recovery 3/3 after correcting the test harness to wait for lazy
image source assignment before decode. Those initial harness failures remain
in the evidence.

Visual inspection covers six screenshots taken after decode and paint. Initial
immediate screenshots sometimes showed blank images despite completed decode;
200–800ms post-decode captures showed the full portraits without production
code changes. Preserve those captures rather than treating decode as a visual
check. On the smallest tested 320×568 portrait viewport, stage bottom was 394px,
name bottom 428px and primary action bottom 503px. No horizontal overflow or
uncaught JavaScript errors were observed.

Production deployment and live verification are pending. Tests use isolated Chromium contexts with Muse navigation
intercepted; no Muse account is connected. Physical iOS/Safari and native Muse
behavior are outside this website verification.

Private/local test evidence remains outside Git in
`persa-test-results/2026-11-03-homepage/`.
