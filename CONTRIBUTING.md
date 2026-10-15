# Contributing

Persa pairs a personality layer with a costume avatar for Muse. Its static
website reuses the YAML personality compiler that also powers the CLI/library
and MCP server. Keep contributions focused on the Muse experience or a concrete
compiler or integration issue, and preserve the existing interfaces.

## Running it

```bash
npm ci
npm test                  # node --test, no framework
node src/cli.js init      # a persona to play with
node src/cli.js edit      # the editor, on localhost
```

The CLI/library has no build step and depends on `yaml` and the MCP SDK.

For the Muse character website:

```bash
npm run build:web
npm run preview:web       # http://127.0.0.1:4173
```

The preview serves the last `dist/` build; rebuild after edits. The website is a
static browser app that reuses the personality compiler. See the
[website status and architecture](README.md#website-status--october-15-2026)
for the implemented flow, asset coverage, and remaining Muse integration work.

The homepage is `/`, with a white, borderless spotlight stage, the selected
personality's three adjectives, and the full 18-character grid underneath.
**All characters** scrolls to that grid. The standalone grid remains at
`/collection.html`, with saved combos at `/collection.html?view=saved`.
The former `/spotlight.html` demo redirects to `/`. Both active pages use
`web/app.js` for the catalog, grid, personality drafts, favorites, dialogs,
copying, and downloads. `web/spotlight.js` receives that catalog and saved state
through `mountSpotlight()` and owns only stage presentation. Keep one catalog
request and one stage mount. Update homepage save controls in place to preserve
tile nodes, loaded images, focus, and the selected stage character. Keep the
inline grid outside the carousel's keyboard handler and scope stage styles
away from shared dialogs and tiles. The approved effect moves static portraits
and the spotlight; it includes no character animation or audio.

Character presets belong in `characters/catalog.js`, with shared-base and
costume prompt definitions in `characters/avatar-design.js`. Each preset pairs
a personality and matching Muse avatar prompt. All 18 current candidates remain
available; the launch ten have not been selected. Keep the same cream plush face,
hood, material, and body proportions across costumes. Clothing, headwear, and
props identify each named preset; do not restore the older individual faces or
substitute unrelated mascots. See the [design contract](docs/MUSE_AVATAR_DESIGN.md).

The Muse shortcut covers all 18 catalog presets as requested October 15.
Use real **Open in Muse** links on the stage, each tile and the detail dialog,
without a mandatory help/setup dialog. Keep **Setup options** separate and
optional. `src/muse-handoff.js` is the browser-safe pure builder; it calls the
existing compiler with the current tone and returns the exact prompt, encoded
URL, recipe version and reference metadata. The build copies it into
`dist/core`. Link, complete-combo copy, displayed instructions and export must
agree. Update all direct URLs after tone edits/reset and when loading saved
preferences. See [the all-character record](docs/MUSE_ALL_CHARACTER_HANDOFF.md).

Preserve the exact original Mona/Taylor/Mark default payloads under
`muse-reference-handoff-v1`. The other 15 use their existing authored catalog
costumes and `muse-reference-wardrobe-v2`; legacy text-only prompts and artwork
remain unchanged. All-character availability supersedes the old three-preset
restriction, but does not extend the old reliability results to untested
recipes. Barbie and SpongeBob's wrapper must explicitly permit sparing emoji
and replace the prior setting because the compiler omits its neutral phrase.
The v2 recipe asks for four candidates and requires Muse to re-read saved
identity, style and standing personality preferences before generating,
correcting conflicting old settings. This addresses failures observed in the
separate v1 pilot; do not pool pilot outputs with the current recipe's results.

Keep **Send** and **Select** explicit. Copy fallback must retain the full
reference-based message. The separate legacy avatar-only prompt omits the
image and must stay labeled text-only for supported presets. Exports retain
the legacy prompt and add `comboPrompt` plus supported `museHandoff` metadata;
they do not import, restore or synchronize an account. Preserve preset IDs,
saved tone, stage/grid state and the current public base URL/checksum.

The October 10 homepage layout change includes no avatar or prompt edits.
Current art-generation and Muse prompts exclude human hair; costume-specific
hairstyles remain unresolved and must not be reported as fixed by this layout.

Keep exact art-generation prompts and outcomes in
`characters/image-generation.json`, the shared reference provenance in
`characters/avatar-design-generation.json`, and committed assets under
`web/avatars/muse-costumes-v1/`. These art prompts are separate from the prompts
copied into Muse. Record active costume art in the original entry's `replacement`
object with `kind: "muse-costume"`, matching `subjectId`,
`baseId: "persa-muse-v1"`, `designVersion: "muse-costumes-v1"`,
`status: "generated"`, its exact prompt, and asset path. Preserve original
outcomes, including refusals, and move retired replacements to
`supersededReplacements`. A missing costume must stay explicitly unavailable;
it cannot fall back to old likeness artwork. The build clears `dist/` and ships
only currently referenced costume images and the shared base.

The asset resolver rejects missing, duplicate, or unknown image records, invalid
statuses, unsafe/mismatched paths, missing files, and invalid PNG headers or
dimensions. Its checks are covered by `test/avatar-assets.test.js`. Browser
image failures must retain access to the combo and allow a retry.

## Adding or fixing a target

A target is one entry in [`src/targets.js`](src/targets.js): its character
limit, whether the agent reads it as a system prompt or a message, whether the
field keeps markdown, where a person pastes it, and the numbered steps
`persa install` prints.

Product details go stale faster than anything else here. If you are correcting
one, say in the pull request where you saw it and when. "ChatGPT's box is 1500
characters" is a claim; "ChatGPT's box is 1500 characters, checked 2026-10-02"
is a claim someone can re-check a year from now.

## Adding a trait

Traits live in [`src/traits.js`](src/traits.js) as five bands each: four produce
instructions, and the middle band (35–64) is empty. The rule
that matters: a trait at 50 must produce nothing at all. A persona should say
only what its owner actually cares about, and a compiler that pads every
prompt with seven neutral sentences makes every persona sound the same.

## Tests

`node --test`, in `test/`. New behaviour needs a test that would fail without
it. Tests that spawn the CLI are preferred for anything a user types, because
argument parsing and exit codes are where CLIs actually break.

CI runs the suite on Node 20, 22 and 24. A separate packaging job installs the
tarball from `npm pack` in a clean project and runs the binary. There is no
npm publishing workflow; a passing packaging job does not publish an npm release.

For website changes, run `npm run build:web`, `node --check web/app.js`,
`node --check web/spotlight.js`, and `git diff --check`. Exercise affected browser
flows at desktop and narrow mobile widths:

- Stage navigation: next/previous wraparound, direct selection, arrow keys,
  touch swipes, rapid navigation, and reduced motion. The stage initially
  prepares only the center portrait and its two neighbors; the homepage grid
  independently lazy-loads its previews. Check the three stage adjectives for
  each selected preset and the All characters anchor.
- Combo actions: the selected stage character must match setup, tuning, copied
  prompts, and JSON download. Check tone reset, independent drafts, saved-tone
  persistence, and clipboard failure fallback when changing those flows.
- Muse handoff: check all 18 direct links from the stage, tiles and detail.
  Decode the prepared URL and compare it with the complete displayed/copied/
  exported message, including changed and restored tone settings. Verify
  keyboard activation, optional setup, blank/existing-draft composer guidance,
  and clipboard denial. The primary action must open Muse directly without
  displaying a Persa setup dialog.
  Keep UI navigation intercepted during local browser checks; native Muse
  generation, preference mutation and cleanup require their own protocol.
- Shared state and focus: saving from either the stage or a homepage tile must
  update both controls while keeping the selected character on stage and focus
  on its originating control. Closing a dialog restores focus to the stage
  action or tile that opened it. Check the saved grid, including removing its
  last character, and the old demo redirect.
- Failure recovery: a failed image keeps tuning/copying available. **Retry
  image** repairs the stage, dialog, and matching homepage tile; catalog retry
  must recover without duplicate dialogs or listeners.

The October 10 layout checks covered all 18 inline tiles and stage captions,
shared saves without rebuilding tiles or moving focus, tile tuning and saved-tone
reload, stage/tile/dialog image recovery, catalog retry, and 1440/390/320px
layouts. The previous homepage flow checks were rerun successfully. See the
[verification record](README.md#website-verification).

The October 9 homepage checks passed for all 18 characters, including 54 copy
actions and 390/320px layouts with touch swipes. These checks used a temporary
Playwright harness outside the repository; they are not a committed browser
suite or CI job. See the [verification record](README.md#website-verification).
The `tests` workflow covers the CLI/library, avatar asset validation, and npm
package. Production deployment has its own workflow; neither automates browser
rendering or signed-in Muse checks. The October 12 [native avatar check](docs/MUSE_NATIVE_AVATAR_VALIDATION.md)
covered 3 of 18 current costume presets: 9 unchanged avatar-only requests,
36 reviewed options, recognizable plush-family results but variable face/body
identity and non-lilac backgrounds. A separate 1-request/4-option reference probe
did not establish reference repeatability. No avatar was selected or personality
text submitted. Keep generation, activation/persistence and personality evidence
separate; earlier activation tests used the old likeness prompts. Record every
candidate and keep private account evidence outside Git. See [AGENTS.md](AGENTS.md)
for coding-agent guidance.

The separate [prompt-engineering follow-up](docs/MUSE_PROMPT_ENGINEERING.md)
reviewed 84 options from 21 requests, with screening, original reference repeats
and revised repeats scored separately. Exact experimental recipes and the base
image hash are recorded in the repository; private native evidence is not. The
historical reference recipes required uploading the base and remain distinct
from catalog text-only prompts.
Keep garment compliance, hand anatomy and visible identity separate, and mark
hidden critical body geometry unassessable rather than inferring a match.

The October 15 all-character implementation passed 82 Node tests and the build.
The [current report](docs/MUSE_ALL_CHARACTER_HANDOFF.md) tracks all-18 native
prefill, one compatibility request per new preset, current browser QA,
restoration and release status. A single request is not a repeatability test.

The historical October 14 guided-handoff implementation passed 78 Node tests and 33
isolated browser checks, including all 18 setup paths, tuned/saved payloads,
clipboard denial, keyboard/focus and 1440/390/320px layouts. Its native matrix
uses the actual personality-application payload in the existing Main chat;
the [reliability report](docs/MUSE_HANDOFF_RELIABILITY.md) records the separate
results and release status. Do not reuse the October 12 84-output totals or
their visible-match rate for the URL route. Preserve the exact experimental
recipe JSON as provenance; keep outputs, account files, screenshots and raw
conversations outside Git. Document any original-avatar/style restoration and
its limits without publishing private identity or memory content.

## Website publication

Production is [persa.bubblai.com](https://persa.bubblai.com), verified on Vercel
October 10. Every push to `main` triggers [Deploy to Vercel](.github/workflows/deploy.yml).
The workflow uses the repository's `VERCEL_TOKEN` secret and configured team/project
IDs, so commit authors do not need a local Vercel login or team seat. Follow the
[deployment notes](README.md#vercel-deployment) for the exact existing project.

The workflow pulls production settings, builds with `vercel build --prod`, and
deploys with `--prebuilt --prod`. `vercel.json` selects Other framework, `npm ci`,
`npm run build:web`, and `dist` output. `.vercelignore` controls ordinary source
uploads; the Actions workflow uploads prebuilt output. Inspect both deployment
and test results after a push, since these workflows run independently.

Preserve `.openai/hosting.json` as the previous Sites deployment's identity and
history. Keep generated `dist/` output, `.vercel/` project state, deployment
archives, and credentials out of Git. Website browser checks do not establish
native Muse integration.

## Known gaps before the next release

The 2026-10-02 audit reproduced these issues; the documentation update does
not change their implementation:

- Request handling: the editor accepts save requests from unrelated Origins;
  malformed Host headers can terminate the HTTP MCP server; MCP request
  bodies have no size limit. See [SECURITY.md](SECURITY.md).
- YAML preservation: saving rebuilds example mappings, dropping their field
  comments and extra keys, even when the examples are unchanged.
- Validation: inherited object names such as `constructor` are accepted as
  target IDs and emoji settings; a fractional budget of `0.5` can produce a
  one-character result.
- Loader metadata: `createServer({ load })` returns the loader object as
  `file` when the loader omits that optional field.
- Target guidance: built-in install steps still contain older Claude and Muse
  navigation and unverified limits or automatic-application claims. Use
  [the reviewed setup notes](docs/INSTALL.md) when updating `src/targets.js`.

Add regression coverage for these fixes, including real HTTP and stdio MCP
transport tests. Keep release metadata in `package.json`, `package-lock.json`,
the CLI, the MCP server and the changelog aligned when a version is selected.

## Style

Match what is there. Comments explain why a thing is the way it is, not what
the next line does. If a comment would only restate the code, leave it out.

## What will probably be declined

- A runtime. Persa never sits between you and your agent.
- Memory or facts about the user. That belongs to the agents.
- Adding a hosted backend without a product need. The Muse character website in `web/` is currently a static app built with `npm run build:web`; favorites stay on the user's device.
- Anything that makes a persona longer by default.
