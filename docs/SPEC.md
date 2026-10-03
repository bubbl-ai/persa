# The persona file

One YAML document containing a mapping. Only `name` is required. Omitted optional fields add no instructions; every compiled persona includes its identity and the automatic voice anchor described below.

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

Spec version. Currently `1`, also used when the field is omitted. A version Persa doesn't recognise produces a warning, not an error; the normalized persona and saved file use version `1`.

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

An unknown trait name warns and is ignored. Values must be finite numbers from 0–100; numeric strings such as `"25"` are also accepted. Fractions are rounded to the nearest integer with a warning before selecting a band. Values outside the range, booleans, blank strings, and non-numeric values are errors — including a key written with no value at all (`warmth:` parses as null, and silently treating that as 0 would pin the trait to its coldest band).

### `style` — map

- **`emoji`** — `never` | `sparing` | `freely`. Defaults to `sparing`, which, like a mid-range slider, compiles to nothing.
- **`address_user_as`** — what the agent should call you. Becomes `Call me <x>.`
- **`greeting`** — how it opens a conversation, in your words. Becomes `How you open a conversation: <x>.`
- **`notes`** — a list of free-form wording rules that don't fit a slider. Lowest-priority prose section; first to go under a tight character budget, after examples.

### `rules` — map with `always` and `never` lists

Free-form behavioural rules about conduct rather than voice — "Lead with the decision", "Give me a number, not 'soon'". Write them as you'd say them.

One YAML gotcha: a colon followed by a space can turn a line into a mapping, so `- Deadlines: give me a date` needs quoting. Persa rejects the unquoted form with a message saying so, rather than compiling it to `[object Object]`.

The prose lists (`always`, `never`, `boundaries`, and `style.notes`) also accept a single string. Text is trimmed, and empty or null entries are omitted. Bare numbers and booleans are rejected; quote them if they are meant as literal text.

Under a character budget `never` survives longer than `always`, on the theory that a prohibition you bothered to write is usually load-bearing. They are printed always-then-never regardless, because that reads more naturally; document order and drop order are independent.

### `boundaries` — list

Constraints that outrank the other persona preferences, rendered under a heading that says so. Persa never drops these to make room for anything else: every removable section is exhausted first. If the budget is too small to hold the identity section, boundaries, and any message lead-in together, the text is truncated without splitting a UTF-16 surrogate pair and `stats.truncated` is set, so `persa check` prints `CUT` and `persa render` warns. That is the only way a boundary is ever lost from the compiled output.

These add to an agent's own rules. Nothing here removes them.

### `examples` — list of `{user, reply}`

A line of dialogue in the right voice. Each entry must have non-empty `user` and `reply` text. One good example beats two more sliders. They are also the first thing dropped when space is tight, so treat them as a bonus rather than the core of your persona.

---

## How it compiles

Sections in output order. A lower priority number survives longer when space is tight:

| priority | section | dropped |
| --- | --- | --- |
| 0 | identity (name, tagline, `address_user_as`, anchor line) | never |
| 1 | boundaries | never |
| 2 | voice (traits, emoji, greeting) | fifth |
| 4 | always | third |
| 3 | never | fourth |
| 5 | wording notes | second |
| 6 | examples | first |

When a target has a character limit, Persa removes one line at a time from the end of the highest-numbered section that still has any, until the text fits. Earlier entries in a section therefore survive longer. Sections at priority 0 and 1 are excluded from line removal. If the text is still over budget after everything else is gone, it is truncated and `stats.truncated` is set — `persa check` prints `CUT` and `persa render` warns on stderr.

Budgets count JavaScript string length (UTF-16 code units), including headings, spacing, and any message lead-in. For example, most emoji count as two code units. Hard truncation avoids splitting surrogate pairs but can still cut a sentence or a multi-code-point emoji sequence.

The anchor line — *"Hold this voice in every reply, including one-line ones, unless I explicitly ask you to drop it."* — is added automatically. Personality instructions tend to decay over a long conversation, and models drop them first on short replies, which is exactly where a voice is most noticeable.

Targets with `framing: 'message'` get a lead-in so the text reads as a request from you rather than a system prompt. Targets with `markdown: false` get `Voice:` instead of `## Voice`.

---

## Using it from code

```js
import { loadPersona, parsePersona, normalize, compile, compileAll, savePersona } from 'persa';

const { persona, file, source } = await loadPersona(); // or loadPersona('./persona.yaml')
const { text, target, stats } = compile(persona, 'grok');
// stats: { length, limit, fits, removed: [{section, line}], truncated }

for (const r of compileAll(persona)) console.log(r.id, r.stats.length);
```

`loadPersona(path?)` returns the resolved file path, original YAML source, and normalized persona. Without a path, it looks in the current directory for `persona.yaml`, `persona.yml`, then `.persa.yaml`, followed by `~/.persa/persona.yaml`. `parsePersona(yaml, label?)` parses a string and returns `{ source, persona }`; the optional label appears in error messages.

`normalize(doc, label?)` validates a persona object and fills in defaults. Validation errors throw `PersonaError` with a message meant to be shown to a person. Non-fatal diagnostics are returned in `persona.warnings`; library callers must inspect them, while `persa check` prints them. Normalize raw objects before passing them to `compile`, which does not validate the persona again.

`compile(persona, target = 'plain')` returns `{ text, target, stats }`. Built-in target IDs are `grok`, `muse`, `instinct`, `claude`, `chatgpt`, and `plain`; their settings are exported as `TARGETS`. An unknown target ID throws `PersonaError`. `compileAll(persona, ids?)` returns one result per target, with an additional `id` field; omit `ids` to compile every built-in target.

`compile` also accepts an inline target, which is how you compile against a limit Persa doesn't know about:

```js
compile(persona, { limit: 800, markdown: false, framing: 'message' });
```

For an inline target, markdown headings are enabled and framing is `system` unless overridden. An omitted or null `limit`, or numeric `Infinity`, means no limit. Finite numeric strings are accepted; use a whole-number budget. Zero or negative budgets produce empty, truncated output. Invalid limits throw `PersonaError`.

`stats.length` is the final text length, and `stats.limit` is the normalized limit or `null`. `stats.removed` records each dropped line and its section ID in removal order. `stats.fits` can be true after line removal, but is always false after hard truncation; inspect both `removed` and `truncated` to see whether content was lost.

To write a persona back, prefer `await savePersona(file, persona)`, which returns the file path. It merges into an existing YAML document and replaces the file atomically. Comments on retained scalar fields and unchanged prose-list entries, and unmodeled keys outside rebuilt example entries, are preserved. Example mappings are rebuilt, so their field comments and extra keys do not survive a save. The merge may also normalize YAML formatting; it is not a byte-for-byte round trip.

`toYaml(persona)` is the exported from-scratch serializer. Saving uses it when there is no existing document to preserve, or when the existing content cannot be parsed as a YAML mapping. The internal `mergeIntoYaml` helper is not exported from the package entry point.

### Embedding the MCP server

`await createServer(path?)` builds an unconnected MCP server using the same file lookup as `loadPersona`. It also accepts `{ load }` for personas stored elsewhere. The loader may be async and must return `{ persona, source, file? }`: a normalized persona, its YAML source string, and an optional source path or label.

```js
import { createServer, normalize, toYaml } from 'persa';

let current = normalize({ name: 'Sable', voice: { directness: 90 } });
const { server, persona, file, error } = await createServer({
  load: async () => ({
    persona: current,
    source: toYaml(current),
    file: 'in-memory persona'
  })
});
// Connect `server` to an MCP transport with server.connect(transport).
```

The result is `{ server, persona, file, error }`; `persona` and `error` describe the initial load. If that load fails, `persona` is null and `error` contains the failure, but the server is still returned. Each `get_personality` call, resource read, and `personality` prompt request invokes the loader again, allowing recovery and later edits without rebuilding the server. Initialization instructions reflect only the initial load; clients must fetch the persona again to receive later edits.
