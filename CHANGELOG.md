# Changelog

## Unreleased

- More recognizable hairless costumes (2026-10-16, local and unpublished):
  add distinct clothing/headwear/prop recipes for Harry Potter, Michael Jackson
  and Joker while preserving the shared face and hairless hood. New selected
  native previews use `muse-costume-cues-v3`;
  `src/muse-costume-recipes.js` supplies `muse-reference-costume-v4` combos and
  a matching text-only fallback without an image-reference claim. Keep all
  other 15 handoff payloads unchanged: 12 wigs and three retained hairless
  PNG costumes. Export `costumeVariant` and curated-preview metadata even when
  no hairstyle exists. Preserve earlier artwork and blocked hair requests.
  The [costume follow-up](docs/MUSE_COSTUME_RECOGNITION.md) records selection,
  checks and publication; it makes no repeated-reliability or blind-recognition
  claim. The earlier wig rollout below retains its original scope.

- Initial curated Muse wigs (2026-10-16, local rollout): add 12 character-specific
  wig recipes and versioned native WebP preview slots, retaining six valid
  hairless PNG costumes. The Rock, SpongeBob and Hello Kitty remain hairless
  by design; Harry Potter, Michael Jackson and Joker keep their existing
  costumes without retrying blocked hair requests. Share costume, hairstyle
  and visual instructions through `src/muse-wigs.js` for native trials and
  `muse-reference-wig-v3` combos; retain the six hairless messages unchanged.
  Update text-only prompts, export metadata and PNG/WebP asset validation.
  Preserve previous assets, refusal records and exact historical payloads.
  The [rollout report](docs/MUSE_WIG_ROLLOUT.md) records per-character curation,
  validation and publication status; this entry does not claim a live release
  or a new reliability percentage. Keep the earlier [wig experiment](docs/MUSE_WIG_STABILITY.md)
  separate from curation and the changed combo wrapper.

- Direct Muse links for all characters (2026-10-15): add **Open in Muse** to
  the spotlight stage, every character tile and the personality detail dialog,
  opening the prepared combo immediately without a mandatory setup dialog.
  Keep optional **Setup options** for copying, downloads and help; Muse still
  requires **Send** and avatar **Select**. Extend the shared builder to all 18
  authored costumes, preserving the original three default payloads exactly
  and versioning the other 15 as `muse-reference-wardrobe-v2`. Explicitly allow
  sparing emoji for Barbie/SpongeBob when replacing an old no-emoji preference.
  Ask for four native candidates and a re-read of saved personality settings
  after the earlier pilot exposed a stale Vibe and a two-candidate chooser;
  preserve those pilot results separately from current-recipe validation.
  Preserve artwork, legacy catalog prompts, current tone and saved state.
  All 82 Node tests and the build pass; native compatibility, restoration and
  deployment are tracked in [the all-character record](docs/MUSE_ALL_CHARACTER_HANDOFF.md).

- Guided Muse setup (2026-10-14): add **Open in Muse** for Mona Lisa, Taylor
  Swift and Mark Zuckerberg, with the current compiled personality and a
  verified shared-base reference request in one prepared message. Keep
  **Send** and avatar **Select** as user actions. Share one browser-safe
  builder across link, complete-combo copy, displayed text and JSON export;
  retain the existing text-only flow for the other 15 presets and clearly
  label the separate legacy avatar-only prompt. Preserve all artwork and
  catalog prompts. All 78 Node tests and 33 isolated browser checks pass.
  The native matrix completes 9/9 requests with exact prefill and a median
  88-second generation wait; all 36 options meet practical visible-identity/
  usability criteria, and all nine saved-style checks pass after reload.
  Detail/proportion variation, native acknowledgement reactions despite
  no-emoji settings and one automatically recovered memory-history edit
  remain documented. These single-account results support only the limited
  guided trial; restoration and deployment status are tracked separately in
  [the handoff reliability report](docs/MUSE_HANDOFF_RELIABILITY.md).

- Muse link handoff validation (2026-10-14, Asia/Shanghai): verify exact
  personality/avatar text transfer through an actual clicked `?prompt=` link
  into signed-in Muse web, followed by native candidates without manual paste
  or attachment. Record the separate Send action, workspace reference-path
  recovery, existing Main chat context, encoding/responsive checks and login
  gate in [the handoff report](docs/MUSE_ONE_CLICK_VALIDATION.md). Test only;
  no personality persistence, avatar selection or production website change.
- Native Muse prompt engineering (2026-10-12, Asia/Taipei): capture and review
  84 outputs from 21 requests, keeping 3 screens, 9 original reference repeats
  and 9 revised repeats separate. Uploaded-base prompts improve visible
  face/hood/material similarity; revised wording improves dress coverage but
  does not eliminate hand, hood or proportion variation. Preserve exact
  experimental recipes and source hashes in [the experiment report](docs/MUSE_PROMPT_ENGINEERING.md).
  No avatar selected; leave active prompts, artwork, runtime and deployment unchanged.
- Native Muse avatar validation (2026-10-12, Asia/Taipei): submit unchanged
  hairless Taylor Swift, Mona Lisa and Mark Zuckerberg avatar-only prompts
  three times each in fresh side chats in one desktop account. Capture and
  review all 36 options from 9 requests. All requests return recognizable
  plush-family/costume candidates, but face/body identity varies and all
  backgrounds are white or neutral rather than lilac. Separately test one
  attached-base request: 4 options, including one flat illustration, with no
  reference-repeatability conclusion. No Select or personality submission;
  no new activation/persistence claim. Record the limited 3/18 coverage in
  [the native report](docs/MUSE_NATIVE_AVATAR_VALIDATION.md); leave runtime,
  source prompts, artwork and deployment unchanged.

- Homepage layout (2026-10-10): give the spotlight a white, borderless stage
  and replace its generic caption with the featured personality's three
  adjectives. Place all 18 character tiles below the spotlight and make
  **All characters** scroll to them; retain the standalone full/saved collection
  routes. Reuse the shared dialogs and controls, synchronize stage/grid saves,
  and preserve stage selection and control focus. Retry image also repairs the
  matching homepage tile. Avatar assets and prompts were unchanged at this
  release, and its prompts excluded human hair. All 72 tests, the build, syntax/whitespace
  checks, and desktop/mobile browser checks passed; deployment uses the
  existing main-branch Vercel workflow.

- Vercel migration verified (2026-10-10): `https://persa.bubblai.com` is public
  over HTTPS. The first successful GitHub auto-deploy run shipped `1e6fc0f`;
  pushes to `main` now build and deploy prebuilt output using a repository secret.
  Verify all 18 previews, source/asset agreement, prompt copying, favorites,
  the full collection, old demo redirect, and desktop/mobile browsing. Update
  canonical links and contributor/agent guidance for the configured project.

- Vercel migration preparation (2026-10-10): add static hosting configuration
  for `npm ci`, `npm run build:web`, and `dist`, plus a CLI source-upload allowlist.
  Document Bubbl team ownership, Git deployment, custom-domain setup, and the
  separate saved collection on a new origin. The user approved `persa.bubblai.com`.
  CLI sign-in succeeded. Team/project setup and domain verification were completed
  subsequently; preserve the previous Sites version 6 publication as history.

- Documentation (2026-10-10): record the version 6 publication and spotlight
  routes, update contributor guidance to the shared costume model, repair the
  website-status link, and document stage verification and saved-combo behavior.
  Retain the limits of historical Muse tests; at that date the current costume
  prompts still needed signed-in Muse validation.

- Adopt the approved spotlight as Persa’s homepage (2026-10-09). Connect the
  selected stage character to Muse setup, personality tuning, favorites, and
  existing copy/download controls through one shared app state. Preserve the
  grid at `/collection.html`, add a saved-collection link, and redirect the old
  demo URL. Keep selected-character focus after saving, scope stage styling
  away from dialogs, and repair both stage/detail images with Retry image.
  Verify 72 tests, all 18 combos, saved tone settings, exports, failure states,
  keyboard controls, and mobile swipes/layouts.
  Published successfully as Sites version 6 from source
  `f5de98c1c43fdfdfeff9e14b69106ece6c2a7517` at the existing public URL.

- Spotlight stage demo (2026-10-07): add `/spotlight.html` with a sliding
  center portrait, dimmed neighbors, and a spotlight that fades in on arrival.
  Reuse all 18 static costumes with no articulated animation or audio. Support
  buttons, keyboard, mobile swipe, direct selection, reduced motion, image
  fallbacks, and catalog retry. Load only three images initially and keep the
  full character gallery at its existing route.

- Publish the shared Muse costume collection successfully on October 7, 2026,
  as Sites version 4 at the existing public URL. Resolve the earlier archive
  upload blocker; preserve all 18 combos and the existing public audience.

- Shared Muse wardrobe (2026-10-06): replace individual likeness prompts with
  one cream plush Muse-style base and 18 character-inspired costumes. Preserve
  personalities, saved character IDs, tone settings, and original generation
  history. Version costume assets and validate matching preset/base metadata;
  unavailable costumes cannot fall back to old likenesses. Update gallery copy,
  avatar instructions, and JSON exports for the costume model. Earlier live
  Muse tests apply to the previous designs, not these new prompts. Ship all 18
  costume previews and the shared base; verify 72 tests, 54 browser clipboard
  actions, exports, saved settings, mobile layouts, and image failure recovery.
  Fix narrow-screen navigation overflow with a saved-count badge.

- Muse candidate batch validation (2026-10-05 UTC): verify the public site's
  default combo and personality-only clipboard output for all 18 candidates.
  Native avatar selection and persistence passed for 13 default combos,
  including the earlier Mona Lisa test. Record saved-personality checks,
  stale preference retention, character likeness caveats, and shared memory
  across side chats in `docs/MUSE_BATCH_VALIDATION.md`. Five previously refused
  avatar requests were not retried through Muse. The condition for implementing
  the full batch was not met at that stage; website behavior and artwork were left unchanged until the later approved costume redesign.

- Muse workflow test (2026-10-05): verify the unchanged default Mona Lisa combo
  in signed-in desktop Chrome. Muse generated four avatar candidates; selecting
  one applied the active avatar, which survived reload alongside saved identity
  and personality preferences. None matched the existing gallery preview exactly.
  A fresh side chat supplied one response compatible with the requested tone.
  Document the selection steps and single-preset limits in `docs/MUSE_VALIDATION.md`.
- Restore the six named avatar prompts and remove the unrelated star, robot,
  otter, owl, crab, and fox substitutions following user feedback. Preserve their
  generation history, reject unrelated replacements during builds, and clear
  retired files from build output. Record the identity requirement in `AGENTS.md`.
- Add a new Taylor Swift character preview. Requests for Michael Jackson,
  Lionel Messi, Harry Potter, SpongeBob, and The Joker were declined again;
  those five remain explicitly unavailable with their named avatar prompts.
- Avatar repair (2026-10-05): fill the six originally declined previews with
  explicitly labeled original concept companions and matching Muse avatar
  prompts, preserving the original refusal history. All 18 entries now have
  preview art in that revision; these concepts were subsequently rejected and
  removed as described above.
- Handle image-load failures in the gallery and detail dialog, with a retry
  action. Reject malformed image records, asset/preview mismatches, missing
  files, and invalid PNG headers during builds. Add seven asset regression tests.
- Add `AGENTS.md` with Muse-first scope, repository structure, development and
  validation commands, asset provenance rules, and publishing guidance.
- Muse character website (2026-10-05): add a public, mobile-friendly gallery
  pairing personalities with matching Muse avatar prompts for all 18 launch
  candidates. The final ten remain unselected. The first publication included
  twelve generated previews and six unavailable states, addressed above.
- Add four tone controls backed by the shared compiler, authored example
  replies, device-local saved combos, reset, JSON download, combined and
  individual prompt copying, and secondary Grok Bot description copying.
  Muse setup uses copy and paste; direct import and persistence were unverified
  at initial publication. The later desktop Mona Lisa test is recorded above.
- Add static website build/preview scripts and Sites hosting configuration.
  Extract the shared `PersonaError` to keep browser compiler imports free of
  Node filesystem dependencies while preserving existing exports.
- Document the public website URL, repository structure, asset provenance,
  local setup, validation results, and pending integration work. Site access
  was changed from owner-only to public on 2026-10-05.
- `persa install <target>` prints what a person actually does to install a
  persona in one agent: the numbered steps in that product's own words,
  followed by the compiled text and how it measures against the limit.
- Targets now carry `steps` and `how` beside their limit and framing, so the
  instructions for an agent live with the agent rather than in prose.
- `createServer` accepts `{ load }` as well as a file path, so anything
  embedding Persa can serve a persona it holds itself.
- Documentation audit (2026-10-02): use the source install path while npm is
  unpublished; clarify MCP refresh behavior, YAML save limitations, compiler
  and loader APIs, test coverage, and HTTP/editor security limitations. Refresh
  agent setup notes against primary sources and distinguish configured budgets
  from verified product limits.

## 0.1.0 — initial repository version

The persona file, the compiler, six targets, the local editor, and the MCP
server. As of 2026-10-02, this version has no Git tag or GitHub release and
`persa` is not available from the public npm registry.
