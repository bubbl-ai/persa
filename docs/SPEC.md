# The persona file

One YAML document. Only `name` is required; everything you leave out produces nothing in the compiled prompt.

```yaml
persa: 1
name: Sable
tagline: a dry chief of staff who tells me the thing I don't want to hear

voice:
  warmth: 25
  formality: 35
  humor: 55
  verbosity: 15
  directness: 90
  energy: 25
  challenge: 80

style:
  emoji: never
  address_user_as: Tony
  greeting: no greeting — open with the answer
  notes:
    - Short sentences. Cut adverbs.
    - Never open with "Great question".

rules:
  always:
    - Lead with the decision, then the reasoning.
  never:
    - Never use corporate filler — "leverage", "circle back".

boundaries:
  - Ask me before sending anything to another person.

examples:
  - user: did you book it?
    reply: Booked. Tuesday 7:30. Free to cancel until Monday noon.
```

---

## Fields

### `persa` — integer

Spec version. Currently `1`. A version Persa doesn't recognise produces a warning, not an error.

### `name` — string, **required**

What the agent calls itself. Becomes `You are <name>.`

### `tagline` — string

One line of character, in your words. Becomes `You are <name> — <tagline>.` This is the single highest-leverage field in the file: a good tagline does more than three sliders.

### `voice` — map of trait → 0–100

Seven traits. Omit a trait entirely, or leave it near 50, and it contributes nothing.

| trait | 0 | 100 |
| --- | --- | --- |
| `warmth` | clinical | warm |
| `formality` | casual | formal |
| `humor` | serious | playful |
| `verbosity` | terse | expansive |
| `directness` | diplomatic | blunt |
| `energy` | calm | enthusiastic |
| `challenge` | agreeable | challenging |

Each scale has five bands: **0–14**, **15–34**, **35–64**, **65–84**, **85–100**. The middle band is empty by design, so only your deliberate choices reach the prompt. The exact sentence each band produces is in [`src/traits.js`](../src/traits.js).

An unknown trait name warns and is ignored. A value outside 0–100, or a non-number, is an error.

### `style` — map

- **`emoji`** — `never` | `sparing` | `freely`. Defaults to `sparing`, which, like a mid-range slider, compiles to nothing.
- **`address_user_as`** — what the agent should call you. Becomes `Call me <x>.`
- **`greeting`** — how it opens a conversation, in your words. Becomes `How you open a conversation: <x>.`
- **`notes`** — a list of free-form wording rules that don't fit a slider. Lowest-priority prose section; first to go under a tight character budget, after examples.

### `rules` — map with `always` and `never` lists

Free-form behavioural rules. These are about conduct, not voice — "Lead with the decision", "Give me a number, not 'soon'". Write them as you'd say them.

`never` survives longer than `always` under a character budget, on the theory that a prohibition you bothered to write is usually load-bearing.

### `boundaries` — list

Constraints that outrank everything else, rendered under a heading that says so. Persa never drops these to fit a character limit — if the text is still over budget with only identity and boundaries left, it truncates and tells you loudly rather than silently discarding a boundary.

These add to an agent's own rules. Nothing here removes them.

### `examples` — list of `{user, reply}`

A line of dialogue in the right voice. One good example beats two more sliders. They are also the first thing dropped when space is tight, so treat them as a bonus rather than the core of your persona.

---

## How it compiles

Sections, in the order they appear and the order they survive:

| priority | section | dropped |
| --- | --- | --- |
| 0 | identity (name, tagline, `address_user_as`, anchor line) | never |
| 1 | boundaries | never |
| 2 | voice (traits, emoji, greeting) | fifth |
| 3 | always | fourth |
| 4 | never | third |
| 5 | wording notes | second |
| 6 | examples | first |

When a target has a character limit, Persa removes one line at a time from the highest-numbered section that still has any, re-rendering after each removal, until the text fits. Sections at priority 0 and 1 are never touched. If the text is still over budget after everything else is gone, it is truncated and `stats.truncated` is set — `persa check` prints `CUT` and `persa render` warns on stderr.

The anchor line — *"Hold this voice in every reply, including one-line ones, unless I explicitly ask you to drop it."* — is added automatically. Personality instructions tend to decay over a long conversation, and models drop them first on short replies, which is exactly where a voice is most noticeable.

Targets with `framing: 'message'` get a lead-in so the text reads as a request from you rather than a system prompt. Targets with `markdown: false` get `Voice:` instead of `## Voice`.

---

## Using it from code

```js
import { loadPersona, parsePersona, compile, compileAll } from 'persa';

const { persona, file } = await loadPersona();        // or loadPersona('./persona.yaml')
const { text, stats } = compile(persona, 'grok');
// stats: { length, limit, fits, removed: [{section, line}], truncated }

for (const r of compileAll(persona)) console.log(r.id, r.stats.length);
```

`compile` also accepts an inline target, which is how you compile against a limit Persa doesn't know about:

```js
compile(persona, { limit: 800, markdown: false, framing: 'message' });
```

`normalize(doc)` validates a plain object and fills in defaults; `toYaml(persona)` writes it back in canonical field order. Both throw `PersonaError` with a message meant to be shown to a person.
