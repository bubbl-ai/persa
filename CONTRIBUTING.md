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
[website status and architecture](README.md#website-status--october-10-2026)
for the implemented flow, asset coverage, and remaining Muse integration work.

The spotlight homepage is `/`; the full grid is `/collection.html`, with saved
combos at `/collection.html?view=saved`. The former `/spotlight.html` demo
redirects to `/`. Both active pages use `web/app.js` for the catalog, personality
drafts, favorites, dialogs, copying, and downloads. `web/spotlight.js` receives
that catalog and saved state through `mountSpotlight()` and owns only stage
presentation. Keep a single catalog request, preserve the selected character
and focus when saving, and scope stage styles away from the shared dialogs.
The approved effect moves static portraits and the spotlight; it includes no
character animation or audio.

Character presets belong in `characters/catalog.js`, with shared-base and
costume prompt definitions in `characters/avatar-design.js`. Each preset pairs
a personality and matching Muse avatar prompt. All 18 current candidates remain
available; the launch ten have not been selected. Keep the same cream plush face,
hood, material, and body proportions across costumes. Clothing, headwear, and
props identify each named preset; do not restore the older individual faces or
substitute unrelated mascots. See the [design contract](docs/MUSE_AVATAR_DESIGN.md).

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
  touch swipes, rapid navigation, and reduced motion. Initial loading should
  request only the center portrait and its two neighbors.
- Combo actions: the selected stage character must match setup, tuning, copied
  prompts, and JSON download. Check tone reset, independent drafts, saved-tone
  persistence, and clipboard failure fallback when changing those flows.
- Shared state and focus: saving must keep the selected character on stage;
  closing a dialog restores focus. Check the saved grid, including removing
  its last character, and the old demo redirect.
- Failure recovery: a failed image keeps tuning/copying available. **Retry
  image** repairs the stage and dialog; catalog retry must recover without
  duplicate dialogs or listeners.

The October 9 homepage checks passed for all 18 characters, including 54 copy
actions and 390/320px layouts with touch swipes. These checks used a temporary
Playwright harness outside the repository; they are not a committed browser
suite or CI job. See the [verification record](README.md#website-verification).
The `tests` workflow covers the CLI/library, avatar asset validation, and npm
package. Production deployment has its own workflow; neither automates browser
rendering or signed-in Muse checks. Current
costume prompts still need Muse validation; earlier tests covered the old
likeness prompts. See [AGENTS.md](AGENTS.md) for coding-agent guidance.

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
