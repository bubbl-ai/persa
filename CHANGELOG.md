# Changelog

## Unreleased

- Vercel migration preparation (2026-10-10): add static hosting configuration
  for `npm ci`, `npm run build:web`, and `dist`, plus a CLI source-upload allowlist.
  Document Bubbl team ownership, Git deployment, custom-domain setup, and the
  separate saved collection on a new origin. The user approved `persa.bubblai.com`.
  CLI sign-in succeeded; Vercel team selection, deployment, and DNS verification
  remain pending. Sites version 6
  remains the last verified live deployment.

- Documentation (2026-10-10): record the version 6 publication and spotlight
  routes, update contributor guidance to the shared costume model, repair the
  website-status link, and document stage verification and saved-combo behavior.
  Retain the limits of historical Muse tests; current costume prompts still
  need signed-in Muse validation.

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
