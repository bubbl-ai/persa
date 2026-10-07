# Persa

[![tests](https://github.com/bubbl-ai/persa/actions/workflows/ci.yml/badge.svg)](https://github.com/bubbl-ai/persa/actions/workflows/ci.yml)

**A personality layer for personal agents.** Write down how you want an agent to talk to you — once — and install it into Muse, Grok, Instinct, Claude, ChatGPT, or anything else with a text box.

**Try the Muse character website:** [persa-muse-characters.archerx03.chatgpt.site](https://persa-muse-characters.archerx03.chatgpt.site). As of October 5, 2026, the site is public: anyone with the link can view it. Each character pairs a personality with a matching avatar prompt; applying the combo in Muse currently requires copy and paste.

Personal agents in 2026 are good at doing things and bad at sounding like anything. Most ship one house voice; the ones that let you change it make you write a system prompt from scratch, per agent, and rewrite it when you change your mind. Persa makes the personality a small file you own, and handles the rest.

```
$ node src/cli.js init
$ node src/cli.js edit            # sliders in a browser, live preview
$ node src/cli.js install grok    # the steps for that agent, and the text
$ node src/cli.js serve           # or let MCP-capable agents just read it
```

These commands run from a source checkout; see [Install](#install). The repository version is `0.1.0`, with further changes listed under [Unreleased](CHANGELOG.md). As of October 2, 2026, there is no published `persa` package on npm or tagged GitHub release.

## Current product focus

**Direction updated October 6, 2026: Meta Muse remains Persa's primary focus. Every preset dresses one shared Muse-style plush character in a different costume and pairs it with a personality layer.** Grok Bot personality compatibility is secondary.

### Default Muse character combos

- Each preset is one complete character combo: **personality layer + Muse avatar**. The personality defines the character's voice, tone, response style, and behavioral preferences; the avatar gives that same character its visual identity.
- The supplied people and characters below define the candidate pool for the first batch of default Muse combos. Each selected character gets both a personality and a matching avatar prompt.
- The visual direction is one cream plush Muse-style base with the same face, hood, and body proportions throughout the collection. Clothing, headwear, and props express each named character. See the [avatar design contract](docs/MUSE_AVATAR_DESIGN.md).
- The desired Muse experience includes one-click import of the avatar prompt. The supported import mechanism still needs verification; copying a prompt must not be presented as a completed import.
- Users browse and choose the combo as a single preset. Personality instructions and avatar prompts may require different technical steps to apply, but both belong to the selected Muse character.

The implemented flow is: browse default Muse characters → preview the matching avatar and personality → tune the voice → copy the combo → open Muse and paste → choose an avatar option and select it. Earlier desktop tests verified avatar activation and persistence for 13 of the previous likeness-based combos. Those results do not validate the new costume prompts. Saved personality replacement has a known stale-setting issue; see the [historical batch validation](docs/MUSE_BATCH_VALIDATION.md). Users can save combos and their tone settings in the current browser. Grok Bot reuses the personality component as a secondary copy option.

### First default Muse batch: candidate roster

**Keep all 18 supplied candidates; choose 10 default Muse combos for launch later.** The launch selection has not been made. Every selected preset includes both components.

| Group | Candidates |
| --- | --- |
| Public figures (11) | Mark Zuckerberg; Taylor Swift; Charlie Chaplin; Michael Jackson; Olivia Rodrigo; Marilyn Monroe; Drake; Lionel Messi; Kylie Jenner; MrBeast; Dwayne “The Rock” Johnson |
| Fictional and art characters (7) | Mona Lisa; Barbie; Wednesday Addams; Harry Potter; SpongeBob; Hello Kitty; The Joker |

### Integration questions to validate

Primary-source review and desktop Muse test on October 5, 2026:

- **Muse avatars:** Meta describes reference-media-driven avatars, but cautions that its research examples do not all represent avatars available in the Muse app. The desktop Mona Lisa test verified prompt-based avatar generation and selection. A public avatar-prompt import API, prefilled deep link, and the mobile workflow remain unverified. See [Bringing Your Muse to Life](https://research.meta.ai/blog/bringing-your-muse-to-life) and the [live test record](docs/MUSE_VALIDATION.md).
- **Muse combo behavior:** The [initial Mona Lisa test](docs/MUSE_VALIDATION.md) and [batch validation](docs/MUSE_BATCH_VALIDATION.md) verified avatar activation and persistence for 13 previous likeness-based combos. The costume prompts have not been tested in Muse. Sequential preset replacement updates saved name/style summaries, but can retain old preferences when the new prompt omits them. Fresh side chats share account memory, so their replies are not isolated personality experiments. Five avatars, removal, automatic application, and synchronization remain unverified.
- **Secondary Grok Bot compatibility:** Official guidance puts durable preferences in the Bot's Description and supports sharing an existing Bot through a template link. Recipients review it and add their own copy in Grok Bot. This is a possible personality distribution path; generating those templates directly from Persa has not been verified. The existing `grok` compiler target describes a different Custom Agent flow, so its 4,000-character budget is not a verified Grok Bot limit. See [Create and manage Bots](https://docs.x.ai/grok-bot/bots) and [Templates for Grok Bot](https://x.ai/bot/guides/templates-for-grok-bot).

### Website status — October 7, 2026

The website implementation lives in [`web/`](web/), with paired character definitions in [`characters/catalog.js`](characters/catalog.js). The costume redesign below is live at the public URL above. The October 7 retry successfully uploaded and deployed Sites version 4, including all 18 costume previews and their paired personality prompts.

| Area | Current behavior |
| --- | --- |
| Spotlight demo | A separate [stage demo](https://persa-muse-characters.archerx03.chatgpt.site/spotlight.html) lets users browse all 18 costumes with a sliding center portrait and a spotlight fade. Supports next/previous, mobile swipe, keyboard navigation, direct character selection, and reduced motion. It reuses static artwork; there is no character animation or audio. |
| Character gallery | All 18 candidates remain available on desktop and mobile. A single plush Muse base wears a distinct character-inspired costume for each preset. The launch ten have not been selected. |
| Combo preview | Matching avatar, character description, traits, and three authored example replies. Examples illustrate the original preset; they are not live model responses and do not change with the sliders. |
| Tone controls | Warmth, humor, directness, and response length update the compiled personality instructions immediately. Reset restores that character's defaults. |
| My collection | Saves favorites and voice settings in this browser's `localStorage`. There is no account or cross-device sync; clearing browser storage removes them. |
| Muse setup | Copies one message containing the personality and matching avatar prompt. Separate copy buttons are also available. The user opens Muse, pastes the instructions, then chooses a generated avatar option and clicks **Select**. Earlier tests covered 13 old likeness prompts; the new costume prompts require separate Muse validation. Independent generations may differ from the previews. |
| Download | Exports the selected persona, compiled personality, costume description, shared-base/design IDs, and avatar prompt as JSON. There is no JSON import or restore control yet. |
| Grok Bot | Secondary option to copy personality text for a Bot's Description. It uses the `plain` compiler target, independently of the CLI's older `grok` Custom Agent target. |

The October 6 collection uses one shared reference image and separate costume edits. The gallery, copied combo, avatar-only prompt, and downloaded JSON all describe this same design. The personality definitions, character IDs, favorites, and saved tone settings are preserved.

The image manifest retains earlier likeness attempts, refusals, and rejected unrelated substitutes as history. Current costume art uses versioned paths and matching preset/base metadata. A missing costume stays explicitly unavailable; the build never silently falls back to an old human or franchise-shaped avatar. Gallery artwork illustrates an intended appearance, not an avatar already installed in Muse.

If an image request fails in the browser, the gallery and character dialog show a readable error state. Reopening the character retries the image, and the dialog also provides **Retry image**. Personality tuning and copying remain available while the image is unavailable.

The remaining product work is to choose the launch ten, validate the new costume prompts inside Muse, correct stale preferences during preset replacement, and test mobile Muse. Direct import, independent-generation repeatability, and removal remain unverified. Exact image reuse did not work in the tested route. Persa does not connect to a Muse API or synchronize later changes. The earlier batch implementation hold concerned the previous designs; this costume redesign was explicitly approved afterward. See the [new design and validation scope](docs/MUSE_AVATAR_DESIGN.md).

### Run the website

```bash
npm ci
npm run build:web
npm run preview:web
# Open http://127.0.0.1:4173
```

Run these commands from the repository root with Node 20 or newer. The preview server binds to `127.0.0.1:4173` and serves the last build; rebuild after source changes. Opening `web/index.html` directly does not supply the generated catalog or shared compiler files.

### How the website fits the repository

| Location | Responsibility |
| --- | --- |
| [`characters/catalog.js`](characters/catalog.js) | Character identity, persona definitions, matching Muse avatar prompt, preview path, and authored sample replies. `launchSelection` is empty; it records a future selection and does not filter the current gallery. |
| [`characters/avatar-design.js`](characters/avatar-design.js) | Versioned shared Muse base, 18 costume descriptions, and paired Muse avatar prompts. |
| [`characters/image-generation.json`](characters/image-generation.json) | Exact art prompts, output paths, and historical outcomes. Active costume replacements use `kind: "muse-costume"` with matching `subjectId`, `baseId`, and `designVersion`; earlier attempts are preserved. |
| [`characters/avatar-design-generation.json`](characters/avatar-design-generation.json) | Shared reference image provenance and exact generation prompt. |
| [`web/avatars/`](web/avatars/) | Current costume PNG previews and historical source art. The build ships only currently referenced images and their shared base. |
| [`web/app.js`](web/app.js), [`web/styles.css`](web/styles.css), [`web/index.html`](web/index.html) | Static browser app, responsive layout, dialogs, local saving, clipboard actions, and downloads. |
| [`web/spotlight.html`](web/spotlight.html), [`web/spotlight.css`](web/spotlight.css), [`web/spotlight.js`](web/spotlight.js) | Standalone spotlight concept demo, using the shared catalog and costume art. The full gallery stays at `/`. Only the center image and its neighbors load initially. |
| [`scripts/build-web.js`](scripts/build-web.js), [`scripts/avatar-assets.js`](scripts/avatar-assets.js) | Validate character and image IDs, replacement subjects, shared-base/design IDs, statuses, persona data, asset/preview path agreement, PNG headers and dimensions, and launch IDs; compile the Muse prompts; rebuild `dist/` with the app, catalog, and shared compiler. Missing or invalid declared images fail the build; retired assets are removed from the output. |
| [`src/compile.js`](src/compile.js), [`src/traits.js`](src/traits.js), [`src/targets.js`](src/targets.js), [`src/errors.js`](src/errors.js) | Shared personality compiler used by both the website and CLI. Extracting `PersonaError` avoids pulling Node filesystem code into the browser; `src/persona.js` still re-exports it for existing callers. |
| [`scripts/preview-web.js`](scripts/preview-web.js) | Local static preview server. |
| [`.openai/hosting.json`](.openai/hosting.json) | Existing Sites project identity and `dist/` hosting configuration. Site access is managed separately in Sites. |

The website has no application backend, model calls, or API-key requirement. The existing CLI editor and MCP server remain separate tools. Generated `dist/` output is ignored by Git; the npm package still distributes the CLI/library rather than the website source. Changing GitHub `main` alone does not publish the website; Sites publication is a separate step.

### Website verification

The October 7 spotlight demo passed browser checks for all 18 images, next/previous wraparound, quick repeated navigation, direct selection, keyboard controls, actual touch swipes at 390px and 320px, vertical scrolling without changing characters, reduced motion, image failures, catalog retry, and the existing gallery. The demo initially loads three images. Build, JavaScript syntax, and whitespace checks passed. No new Muse integration test was performed.

The October 6 costume update passed all 72 tests, the website build, JavaScript syntax checks, and `git diff --check`. Browser checks rendered all 18 new previews and verified 54 clipboard actions, JSON export, saved tone settings, reset, unavailable images, retry recovery, and 1440/390/320px layouts. All 18 images were visually reviewed against the shared base and wardrobe. See the [costume verification record](docs/MUSE_AVATAR_DESIGN.md#verification--october-6-2026). The new prompts have not yet been tested inside Muse.

The October 5 build passed `npm run build:web`, `node --check web/app.js`, all 61 existing tests via `npm test`, and `git diff --check`. Browser checks passed for all 18 cards, all 12 available images, unavailable previews, live prompt tuning, save/reload/reset, both combined and avatar-only clipboard actions, JSON download, the empty saved collection, and Escape-to-close behavior. Layouts were checked at 1440, 390, and 320 pixels without horizontal overflow or browser page errors.

Those browser checks were run with a temporary Playwright harness outside the repository. They are a recorded validation of this build, not a committed browser test suite or CI job. They do not establish end-to-end Muse integration.

The avatar repair adds seven committed regression tests in [`test/avatar-assets.test.js`](test/avatar-assets.test.js) for named avatar prompts, shipped asset references, replacement provenance, declined requests, malformed manifests, unsafe or mismatched paths, invalid/missing PNGs, and rejection of unrelated substitutes. That repair brought the suite to 68 tests. The costume design adds four regression tests for the shared base, versioned provenance, and preventing fallback to retired likenesses, bringing the suite to 72 passing tests. Browser validation also covers narrow mobile layouts, simulated image-request failure, copying while an image is unavailable, and recovery in both the dialog and gallery through **Retry image**. Image loading tests alone do not verify the design; artwork also needs visual review for a consistent base and the requested costume.

Separate [initial](docs/MUSE_VALIDATION.md) and [batch](docs/MUSE_BATCH_VALIDATION.md) signed-in Muse tests on October 5 (UTC) verified avatar selection and persistence for 13 previous likeness-based combos in desktop Chrome. All 18 default combo and personality-only clipboard outputs matched the repository. The batch report records saved-style checks, stale-setting failures, visual caveats, and the five avatars that were not retried. These are historical manual integration results from one account. They do not validate the new costume prompts or guarantee perfect personality adherence.

---

## The idea in one screen

A persona is a short YAML file:

```yaml
persa: 1
name: Sable
tagline: a dry chief of staff who tells me the thing I don't want to hear

voice:            # 0–100. Anything near 50 is neutral and costs nothing.
  warmth: 25
  verbosity: 15
  directness: 90
  challenge: 80

style:
  emoji: never
  greeting: no greeting — open with the answer

rules:
  always:
    - Lead with the decision, then the reasoning.
  never:
    - Never use corporate filler — "leverage", "circle back", "reach out".

boundaries:
  - Ask me before sending anything to another person.
```

Persa compiles it into the prompt each agent actually wants:

```
You are Sable — a dry chief of staff who tells me the thing I don't want to hear.
Hold this voice in every reply, including one-line ones, unless I explicitly ask you to drop it.

## Boundaries — these override everything else
- Ask me before sending anything to another person.

## Voice
- Keep a cool, professional distance. Acknowledge how something lands, briefly, then move on.
- Be brief. Lead with the answer; add detail only if I ask for it.
- Be blunt. Skip the cushioning entirely, even when the answer isn't one I want.
- Push back when I'm wrong. Say so plainly and explain why.
- Never use emoji.
- How you open a conversation: no greeting — open with the answer.

## Always
- Lead with the decision, then the reasoning.

## Never
- Never use corporate filler — "leverage", "circle back", "reach out".
```

Two things make this more than a text file you could have written yourself.

**Sliders near the middle compile to nothing.** A persona that only cares about bluntness produces a prompt about bluntness. Most hand-written system prompts spend half their length telling the model to be averagely normal about traits nobody thought about, which dilutes the parts that matter.

**Every line has a priority, so character budgets degrade gracefully.** Persa budgets 4,000 characters for Grok and 1,200 for an Instinct message; see the [verification notes](docs/INSTALL.md) for which limits are confirmed. When the text has to shrink, Persa drops examples first, then wording notes, then the "always" list, then "never", then voice instructions. `check` lists the removed sections and counts; `render` warns on stderr, and the library returns the removed lines in `stats.removed`. Your identity line and your `boundaries` are the last things standing: they are only ever lost if the budget is too small to hold them at all, and then `check` prints `CUT` and `render` warns on stderr.

```
$ persa check
Sable — /Users/you/persona.yaml
  "a dry chief of staff who tells me the thing I don't want to hear"

  ok   Grok — Custom Agent            1208 / 4000 chars
  ok   Meta Muse                             1334 chars
  trim Instinct — text message        1151 / 1200 chars
       dropped 1 from examples, 1 from wording
  ok   Claude — Project instructions         1208 chars
  ok   ChatGPT — Custom instructions  1208 / 1500 chars
  ok   Plain text — any agent                1196 chars
```

---

## Install

Node 20 or newer. The CLI/library has no build step and two dependencies. The website uses the separate build command above.

Install from the repository until an npm release is available:

```bash
git clone https://github.com/bubbl-ai/persa
cd persa
npm ci
npm test
node src/cli.js init --preset chief-of-staff
node src/cli.js edit
```

The remaining examples use the `persa` command. To put this checkout on your PATH:

```bash
npm link
```

Or replace `persa` with `node src/cli.js` while working in the checkout.

`persa edit` serves a page at `http://127.0.0.1:4747` and prints the URL for you to open — a slider per trait, and a live preview per agent. The editor makes no outbound requests: the page talks to the local process, and the process reads and writes one file. Saving preserves comments and unknown keys in most of the document, but rebuilds example entries; comments and extra keys inside those entries are lost. See [save behavior](docs/SPEC.md) and [Security](SECURITY.md).

![the editor](https://raw.githubusercontent.com/bubbl-ai/persa/main/docs/editor.png)

---

## Getting it into an agent

There are two ways in, and which one you get depends on the agent.

### 1. MCP — the agent reads it itself

If the agent speaks MCP, it can fetch the persona from Persa. Run:

```bash
persa serve                       # stdio, for local clients
persa serve --http --port 8787    # a URL, for hosted agents
```

The server puts the personality in three places, because different clients pick up different things:

| surface | what it is |
| --- | --- |
| `instructions` on initialize | clients that honour it apply the personality with no tool call at all |
| the `get_personality` tool | asks the agent to fetch the persona at the start of a conversation; the client decides whether to call it |
| `persona://current`, `persona://source`, and a `personality` prompt | for clients that surface resources and prompts to the user |

The tool, resource reads and prompt requests re-read the persona file. Editing it — or hitting Save in the editor — reaches those surfaces on their next call, with no server restart. A new chat message does not itself trigger a fetch; ask the agent to call `get_personality` again after a change.

The exception is `instructions`, which MCP sends during the initialize handshake. A client that only reads `instructions` keeps the personality it initialized with until it reinitializes. This applies to both stdio and HTTP: HTTP creates a fresh server for each request, but ordinary requests do not resend initialization instructions.

For **Claude Desktop**, add to your local MCP config:

```json
{ "mcpServers": { "persa": { "command": "persa", "args": ["serve", "/absolute/path/to/persona.yaml"] } } }
```

For **Claude Code**, use the setup command in [docs/INSTALL.md](docs/INSTALL.md). Clients may truncate initialization instructions; Claude Code documents a default 2,048-character cap that Persa's `check` does not cover. Calling `get_personality` retrieves the full compiled text.

For **Meta Muse**, try asking it to create a Custom Connector for a publicly reachable Persa `/mcp` URL and verify that `get_personality` returns your persona. Automatic MCP compatibility and skill creation have not been verified; see [docs/INSTALL.md](docs/INSTALL.md) for current sources and hosting requirements.

### 2. Paste — for everything else

Grok, Instinct and most consumer agents have a settings field or a chat box, not a connector list.

```bash
persa render --target grok        # → your agent's instruction field, if available
persa render --target instinct    # → text it to Instinct as one message
persa render --target chatgpt     # → Settings → Personalization
persa render --target plain       # → any box at all
```

Or use the **Copy** button in `persa edit`, which shows you the exact text, the character count against that agent's limit, and where it goes.

`--target instinct` is framed as a message from you ("Here's how I want you to talk and behave with me from now on…") rather than a system prompt, because that is how a messaging-native agent receives it.

Full per-agent notes, including what each product currently supports: **[docs/INSTALL.md](docs/INSTALL.md)**.

---

## The trait vocabulary

Seven scales. Each has five bands; the middle band is empty on purpose.

| trait | 0 | 100 |
| --- | --- | --- |
| `warmth` | clinical | warm |
| `formality` | casual | formal |
| `humor` | serious | playful |
| `verbosity` | terse | expansive |
| `directness` | diplomatic | blunt |
| `energy` | calm | enthusiastic |
| `challenge` | agreeable | challenging |

Every sentence a trait can produce lives in [`src/traits.js`](src/traits.js), in plain English. If a phrasing doesn't land for you, edit it there; that is the intended way to extend Persa.

Four presets to start from: `chief-of-staff`, `warm-friend`, `coach`, `butler`. See them with `persa presets`.

---

## Commands

| | |
| --- | --- |
| `persa init [file] [--preset <name>] [--out <file>] [--global] [--force]` | create a persona file; `--force` overwrites an existing file |
| `persa edit [file] [--port 4747]` | start the editor and print its URL |
| `persa render [file] [--target <id>] [--out <file>]` | print the personality for one agent; defaults to `plain` |
| `persa install <target> [file]` | the steps for one agent, then the text |
| `persa check [file]` | validate, and show the fit for every agent |
| `persa serve [file] [--http [--port 8787] [--host 127.0.0.1]]` | run the MCP server; port and host require HTTP |
| `persa presets` | list the starting points |
| `persa where [file]` | print the resolved persona path |
| `persa help` / `persa --version` | show usage / the version |

A persona file is found automatically: `./persona.yaml`, `./persona.yml`, `./.persa.yaml`, then `~/.persa/persona.yaml`. `persa init --global` writes the last one, which is usually what you want for a personality that follows you across projects.

`init --global` cannot be combined with a file path or `--out`. The short flags are `-t` for `--target`, `-o` for `--out`, and `-p` for `--port`. CLI ports must be 1–65535. `check` returns a nonzero exit status for invalid input, but trimming and `CUT` are reports, not exit failures.

Persa is also a library:

```js
import { loadPersona, compile } from 'persa';
const { persona } = await loadPersona();
const { text, stats } = compile(persona, 'grok');
```

---

## What Persa deliberately isn't

- **Not a memory system.** It carries voice and rules, not facts about you. The agents already have somewhere to put those.
- **Not a jailbreak.** `boundaries` are constraints you add on top of an agent's own rules; nothing here removes them.
- **Not a runtime.** Persa never sits between you and the agent, never sees your conversations, and never needs an API key. It compiles text and serves it.

## Caveats worth knowing

- **Character budgets and install steps need product checks.** The values in [`src/targets.js`](src/targets.js) are Persa's configured budgets; Instinct's 1,200 is a writing target, not a product limit. [docs/INSTALL.md](docs/INSTALL.md) records primary sources and unresolved limits. Some built-in `install` steps still differ from the current product docs.
- **Paste targets are snapshots.** Change your persona and you have to re-paste. MCP tools, resources and prompts read the current file when called; initialization instructions require reinitialization.
- **How well a personality sticks is the model's business, not Persa's.** The anchor line ("hold this voice in every reply") helps; nothing makes it certain.

## Tests

```bash
npm test
```

68 tests covering avatar asset integrity and replacement records, the compiler's budget invariants, the persona format's failure modes, the save round trip (comments, unknown keys, concurrent writes), the editor's HTTP API, MCP surfaces through the SDK's in-memory client transport, and the CLI itself, spawned the way a person runs it. CI runs Node 20, 22 and 24 and checks a clean install of the packed package. The suite does not exercise browser flows or MCP over its stdio or HTTP transport end to end.

## Contributing

Corrections to a target's character limit or install steps are the most useful
thing anyone can send: those details move, and this repository cannot check
them for you. [CONTRIBUTING.md](CONTRIBUTING.md) has the rest, including the
two rules that keep personas short. [AGENTS.md](AGENTS.md) records repository
guidance for coding agents, including product scope, asset provenance, checks,
and the separate GitHub/Sites publishing paths.

## License

MIT.
