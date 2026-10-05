# Contributing

Persa is small on purpose. It compiles a YAML file into text an agent will
read, and it does not want to become a platform. The most useful contributions
are usually the least dramatic ones: a target whose character limit moved, a
trait phrase that reads badly, a bug in the trimmer.

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
[website status and architecture](README.md#website-status--october-5-2026)
for the implemented flow, asset coverage, and remaining Muse integration work.

Character presets belong in `characters/catalog.js`; each must include both a
personality and a matching Muse avatar prompt. Keep gallery image generation
prompts and results in `characters/image-generation.json`, with available PNGs
in `web/avatars/`. Preserve an explicit unavailable-preview state when an image
is missing. All 18 current candidates remain visible; the launch ten have not
been selected.

Avatars must remain recognizable versions of the named figure. Do not fill
missing previews with unrelated mascots or animals, even with a concept label.
Preserve original image-generation outcomes; record successful corrected art
in the original entry's `replacement` object with `kind: "character"`, matching
`subjectId`, `status: "generated"`, its exact prompt, and a committed asset path.
Move retired replacement records to `supersededReplacements`; they must not be
selected by the build. Keep avatar prompts tied to the named figure and report
unavailable artwork honestly. The build clears `dist/` before copying current
assets so retired files cannot remain in a later publication.

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
publish workflow; a passing packaging job does not publish an npm release.

For website changes, run `npm run build:web` and `node --check web/app.js`.
Exercise affected browser flows at desktop and narrow mobile widths, including
keyboard dismissal, clipboard actions, and save/reload when relevant. The
October 5 browser verification used a temporary Playwright harness; it is not
part of the committed test suite. Existing CI covers the CLI/library, avatar
asset validation, and npm package, not browser rendering, website deployment,
or signed-in Muse behavior. See [AGENTS.md](AGENTS.md) for coding-agent guidance.

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
