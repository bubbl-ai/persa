# Persa

[![tests](https://github.com/bubbl-ai/persa/actions/workflows/ci.yml/badge.svg)](https://github.com/bubbl-ai/persa/actions/workflows/ci.yml)

**A personality layer for personal agents.** Write down how you want an agent to talk to you — once — and install it into Muse, Grok, Instinct, Claude, ChatGPT, or anything else with a text box.

Personal agents in 2026 are good at doing things and bad at sounding like anything. Most ship one house voice; the ones that let you change it make you write a system prompt from scratch, per agent, and rewrite it when you change your mind. Persa makes the personality a small file you own, and handles the rest.

```
$ node src/cli.js init
$ node src/cli.js edit            # sliders in a browser, live preview
$ node src/cli.js install grok    # the steps for that agent, and the text
$ node src/cli.js serve           # or let MCP-capable agents just read it
```

These commands run from a source checkout; see [Install](#install). The repository version is `0.1.0`, with further changes listed under [Unreleased](CHANGELOG.md). As of October 2, 2026, there is no published `persa` package on npm or tagged GitHub release.

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

Node 20 or newer. No build step, and two dependencies.

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
