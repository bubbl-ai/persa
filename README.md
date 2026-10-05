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

**Decision clarified October 5, 2026: Meta Muse remains Persa's primary focus. The mobile-friendly website offers default Muse character presets, each combining a personality layer with a matching Muse avatar prompt.** Grok Bot personality compatibility is secondary.

### Default Muse character combos

- Each preset is one complete character combo: **personality layer + Muse avatar**. The personality defines the character's voice, tone, response style, and behavioral preferences; the avatar gives that same character its visual identity.
- The supplied people and characters below define the candidate pool for the first batch of default Muse combos. Each selected character gets both a personality and a matching avatar prompt.
- The visual direction is a recognizable, cute, Muse-inspired version of each person or character. The avatar and personality should feel like the same character.
- The desired Muse experience includes one-click import of the avatar prompt. The supported import mechanism still needs verification; copying a prompt must not be presented as a completed import.
- Users browse and choose the combo as a single preset. Personality instructions and avatar prompts may require different technical steps to apply, but both belong to the selected Muse character.

The implemented flow is: browse default Muse characters → preview the matching avatar and personality → tune the voice → copy the combo → open Muse and paste. Users can save combos and their tone settings in the current browser. Grok Bot reuses the personality component as a secondary copy option.

### First default Muse batch: candidate roster

**Keep all 18 supplied candidates; choose 10 default Muse combos for launch later.** The launch selection has not been made. Every selected preset includes both components.

| Group | Candidates |
| --- | --- |
| Public figures (11) | Mark Zuckerberg; Taylor Swift; Charlie Chaplin; Michael Jackson; Olivia Rodrigo; Marilyn Monroe; Drake; Lionel Messi; Kylie Jenner; MrBeast; Dwayne “The Rock” Johnson |
| Fictional and art characters (7) | Mona Lisa; Barbie; Wednesday Addams; Harry Potter; SpongeBob; Hello Kitty; The Joker |

### Integration questions to validate

Primary-source review on October 5, 2026:

- **Muse avatars:** Meta describes reference-media-driven avatars, but cautions that its research examples do not all represent avatars available in the Muse app. A public avatar-prompt import API or prefilled deep link has not been verified. Validate the actual mobile avatar workflow and direct import before choosing the final interaction; a clearly labeled copy-and-paste fallback can be evaluated if needed. See [Bringing Your Muse to Life](https://research.meta.ai/blog/bringing-your-muse-to-life).
- **Muse combo behavior:** Verify that the chosen personality and matching avatar can both be applied, then test personality persistence across later conversations, replacement, and removal. Automatic application and synchronization remain unverified for Persa.
- **Secondary Grok Bot compatibility:** Official guidance puts durable preferences in the Bot's Description and supports sharing an existing Bot through a template link. Recipients review it and add their own copy in Grok Bot. This is a possible personality distribution path; generating those templates directly from Persa has not been verified. The existing `grok` compiler target describes a different Custom Agent flow, so its 4,000-character budget is not a verified Grok Bot limit. See [Create and manage Bots](https://docs.x.ai/grok-bot/bots) and [Templates for Grok Bot](https://x.ai/bot/guides/templates-for-grok-bot).

### Website status — October 5, 2026

The first website implementation lives in [`web/`](web/), with paired character definitions in [`characters/catalog.js`](characters/catalog.js). It is published through Sites at the public URL above.

| Area | Current behavior |
| --- | --- |
| Character gallery | All 18 candidates are browsable on desktop and mobile. Characters with images appear first. The launch ten have not been selected. |
| Combo preview | Matching avatar, character description, traits, and three authored example replies. Examples illustrate the original preset; they are not live model responses and do not change with the sliders. |
| Tone controls | Warmth, humor, directness, and response length update the compiled personality instructions immediately. Reset restores that character's defaults. |
| My collection | Saves favorites and voice settings in this browser's `localStorage`. There is no account or cross-device sync; clearing browser storage removes them. |
| Muse setup | Copies one message containing the personality and matching avatar prompt. Separate copy buttons are also available. The user opens Muse and pastes the instructions. |
| Download | Exports the selected persona, compiled personality, and avatar prompt as JSON. There is no JSON import or restore control yet. |
| Grok Bot | Secondary option to copy personality text for a Bot's Description. It uses the `plain` compiler target, independently of the CLI's older `grok` Custom Agent target. |

Twelve generated avatar previews are available. **Taylor Swift, Michael Jackson, Lionel Messi, Harry Potter, SpongeBob, and The Joker** show an unavailable-preview state because the image service declined those requests. All six still have a personality and avatar prompt. The illustrations show an intended appearance, not an avatar already installed in Muse.

The remaining product work is to choose the launch ten, resolve the six missing previews, and verify the actual Muse setup on desktop and mobile. Direct avatar import, personality persistence between conversations, replacement, and removal have not been tested in a signed-in Muse account. Persa does not currently connect to a Muse API or synchronize later changes.

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
| [`characters/image-generation.json`](characters/image-generation.json) | Exact prompts used to generate gallery art, output paths, and success or refusal records. These generation prompts are separate from the Muse setup prompts in the catalog. |
| [`web/avatars/`](web/avatars/) | Twelve generated PNG previews, committed with the source. |
| [`web/app.js`](web/app.js), [`web/styles.css`](web/styles.css), [`web/index.html`](web/index.html) | Static browser app, responsive layout, dialogs, local saving, clipboard actions, and downloads. |
| [`scripts/build-web.js`](scripts/build-web.js) | Validates character IDs, persona data, image records, generated asset paths, and launch IDs; compiles the Muse prompts; writes `dist/catalog.json` and copies the app and shared compiler to `dist/`. |
| [`src/compile.js`](src/compile.js), [`src/traits.js`](src/traits.js), [`src/targets.js`](src/targets.js), [`src/errors.js`](src/errors.js) | Shared personality compiler used by both the website and CLI. Extracting `PersonaError` avoids pulling Node filesystem code into the browser; `src/persona.js` still re-exports it for existing callers. |
| [`scripts/preview-web.js`](scripts/preview-web.js) | Local static preview server. |
| [`.openai/hosting.json`](.openai/hosting.json) | Existing Sites project identity and `dist/` hosting configuration. Site access is managed separately in Sites. |

The website has no application backend, model calls, or API-key requirement. The existing CLI editor and MCP server remain separate tools. Generated `dist/` output is ignored by Git; the npm package still distributes the CLI/library rather than the website source. Changing GitHub `main` alone does not publish the website; Sites publication is a separate step.

### Website verification

The October 5 build passed `npm run build:web`, `node --check web/app.js`, all 61 existing tests via `npm test`, and `git diff --check`. Browser checks passed for all 18 cards, all 12 available images, unavailable previews, live prompt tuning, save/reload/reset, both combined and avatar-only clipboard actions, JSON download, the empty saved collection, and Escape-to-close behavior. Layouts were checked at 1440, 390, and 320 pixels without horizontal overflow or browser page errors.

Those browser checks were run with a temporary Playwright harness outside the repository. They are a recorded validation of this build, not a committed browser test suite or CI job. They do not establish end-to-end Muse integration.

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

61 tests covering the compiler's budget invariants, the persona format's failure modes, the save round trip (comments, unknown keys, concurrent writes), the editor's HTTP API, MCP surfaces through the SDK's in-memory client transport, and the CLI itself, spawned the way a person runs it. CI runs Node 20, 22 and 24 and checks a clean install of the packed package. The suite does not exercise MCP over its stdio or HTTP transport end to end.

## Contributing

Corrections to a target's character limit or install steps are the most useful
thing anyone can send: those details move, and this repository cannot check
them for you. [CONTRIBUTING.md](CONTRIBUTING.md) has the rest, including the
two rules that keep personas short.

## License

MIT.
