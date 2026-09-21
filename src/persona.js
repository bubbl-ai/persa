/**
 * Loading, validating and normalizing a persona file.
 *
 * A persona is a small YAML document. Everything except `name` is optional,
 * and anything you leave out simply produces nothing in the compiled prompt.
 */
import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { TRAIT_NAMES, EMOJI_RULES } from './traits.js';

export const SPEC_VERSION = 1;

/** Places we look for a persona when the user doesn't name one. */
export const DEFAULT_FILENAMES = ['persona.yaml', 'persona.yml', '.persa.yaml'];

export class PersonaError extends Error {}

/** Find a persona file: an explicit path, then cwd, then ~/.persa/persona.yaml. */
export function resolvePersonaPath(explicit) {
  if (explicit) return path.resolve(explicit);
  for (const name of DEFAULT_FILENAMES) {
    const p = path.resolve(process.cwd(), name);
    if (existsSync(p)) return p;
  }
  const home = path.join(homeDir(), '.persa', 'persona.yaml');
  if (existsSync(home)) return home;
  throw new PersonaError(
    `No persona file found. Looked for ${DEFAULT_FILENAMES.join(', ')} in ${process.cwd()} ` +
      `and ${home}.\nRun \`persa init\` to make one.`
  );
}

export function homeDir() {
  return process.env.HOME || process.env.USERPROFILE || '.';
}

export async function loadPersona(explicitPath) {
  const file = resolvePersonaPath(explicitPath);
  let raw;
  try {
    raw = await readFile(file, 'utf8');
  } catch (err) {
    throw new PersonaError(`Could not read ${file}: ${err.message}`);
  }
  return { file, ...parsePersona(raw, file) };
}

export function parsePersona(raw, file = '<string>') {
  let doc;
  try {
    doc = YAML.parse(raw);
  } catch (err) {
    throw new PersonaError(`${file} is not valid YAML: ${err.message}`);
  }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw new PersonaError(`${file} should contain a YAML mapping (key: value pairs).`);
  }
  return { source: raw, persona: normalize(doc, file) };
}

/** Describe a value in an error message without lying about it. */
function show(v) {
  if (typeof v === 'number' && !Number.isFinite(v)) return String(v);
  if (Array.isArray(v)) return `a list (${v.length} item${v.length === 1 ? '' : 's'})`;
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    return keys.length ? `a mapping with key "${keys[0]}"` : 'an empty mapping';
  }
  return JSON.stringify(v);
}

const asText = v => (v == null ? '' : String(v).trim());

/**
 * A scalar field. Without this a colon in a tagline turns the value into a
 * YAML mapping, which String()s to "[object Object]" straight into the prompt.
 */
function asScalar(v, field, fail) {
  if (v == null) return '';
  if (typeof v === 'object') {
    const key = Array.isArray(v) ? null : Object.keys(v)[0];
    fail(
      key == null
        ? `${field} is ${show(v)}, not a line of text.`
        : `${field} is a mapping, not a line of text — YAML read the colon in ` +
            `"${key}: ${String(v[key] ?? '')}" as a key. Quote the whole value.`
    );
  }
  return String(v).trim();
}

/**
 * Coerce a field to a list of strings, refusing anything that isn't text.
 *
 * This exists mostly for one failure: `- Money: ask me before spending` is a
 * mapping in YAML, not a sentence, and quietly becomes "[object Object]" if
 * you String() it. Rules are written in prose, so colons are common.
 */
function asList(v, field, fail) {
  if (v == null) return [];
  const items = Array.isArray(v) ? v : [v];
  return items
    .filter(x => x != null)
    .map((x, i) => {
      const at = Array.isArray(v) ? `${field}[${i}]` : field;
      if (typeof x === 'object') {
        const key = Array.isArray(x) ? null : Object.keys(x)[0];
        if (key == null) fail(`${at} is ${show(x)}, not a sentence.`);
        const rest = String(x[key] ?? '');
        fail(
          `${at} is a mapping, not a sentence — YAML read the colon in ` +
            `"${key}: ${rest}" as a key. Quote the whole line:\n` +
            `    - "${key}: ${rest}"`
        );
      }
      if (typeof x === 'boolean' || typeof x === 'number') {
        fail(`${at} is ${show(x)}, not a sentence. If you meant it literally, quote it: - "${x}".`);
      }
      return String(x).trim();
    })
    .filter(Boolean);
}

/**
 * Fill in defaults and reject anything malformed. Returns a persona object
 * with every field present, so the rest of the codebase never checks for
 * undefined.
 */
export function normalize(doc, file = '<persona>') {
  const warn = [];
  const fail = msg => {
    throw new PersonaError(`${file}: ${msg}`);
  };

  if (doc.persa != null && Number(doc.persa) !== SPEC_VERSION) {
    warn.push(`persa: ${doc.persa} is not a version this build knows (expected ${SPEC_VERSION}); reading it anyway.`);
  }

  const name = asScalar(doc.name, '`name`', fail);
  if (!name) fail('`name` is required — it is what the agent calls itself.');

  const voice = {};
  const rawVoice = doc.voice ?? {};
  if (typeof rawVoice !== 'object' || Array.isArray(rawVoice)) fail('`voice` should be a mapping of trait: number.');
  for (const [key, value] of Object.entries(rawVoice)) {
    if (!TRAIT_NAMES.includes(key)) {
      warn.push(`unknown voice trait "${key}" ignored (known: ${TRAIT_NAMES.join(', ')}).`);
      continue;
    }
    if (value == null) {
      fail(`voice.${key} has no value. Give it a number from 0 to 100, or delete the line — an omitted trait says nothing.`);
    }
    // Number('') and Number(null) are both 0, which would silently pin a
    // trait to its most extreme low band. Only accept a real number.
    if (typeof value !== 'number' && !(typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)))) {
      fail(`voice.${key} should be a number from 0 to 100, got ${JSON.stringify(value)}.`);
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 100) fail(`voice.${key} should be a number from 0 to 100, got ${show(value)}.`);
    // Traits resolve to one of five bands, so a fraction means nothing — and
    // an editor slider would round it anyway. Round here so the file, the UI
    // and the compiled prompt never disagree.
    if (!Number.isInteger(n)) warn.push(`voice.${key}: ${n} rounded to ${Math.round(n)} — traits are whole numbers.`);
    voice[key] = Math.round(n);
  }

  const rawStyle = doc.style ?? {};
  if (typeof rawStyle !== 'object' || Array.isArray(rawStyle)) fail('`style` should be a mapping.');
  const emoji = asText(rawStyle.emoji) || 'sparing';
  if (!(emoji in EMOJI_RULES)) fail(`style.emoji should be one of ${Object.keys(EMOJI_RULES).join(', ')}, got "${emoji}".`);

  const rawRules = doc.rules ?? {};
  if (typeof rawRules !== 'object' || Array.isArray(rawRules)) fail('`rules` should be a mapping with `always` and/or `never` lists.');

  if (doc.examples != null && !Array.isArray(doc.examples)) {
    fail(`\`examples\` should be a list of \`- user:\` / \`reply:\` pairs, got ${show(doc.examples)}.`);
  }
  const examples = (doc.examples ?? []).map((ex, i) => {
    if (!ex || typeof ex !== 'object' || Array.isArray(ex)) {
      fail(`examples[${i}] should be a mapping with \`user\` and \`reply\`, got ${show(ex)}.`);
    }
    const user = asScalar(ex.user, `examples[${i}].user`, fail);
    const reply = asScalar(ex.reply, `examples[${i}].reply`, fail);
    if (!user || !reply) fail(`examples[${i}] needs both \`user\` and \`reply\`.`);
    return { user, reply };
  });

  return {
    persa: SPEC_VERSION,
    name,
    tagline: asScalar(doc.tagline, 'tagline', fail),
    voice,
    style: {
      emoji,
      address_user_as: asScalar(rawStyle.address_user_as, 'style.address_user_as', fail),
      greeting: asScalar(rawStyle.greeting, 'style.greeting', fail),
      notes: asList(rawStyle.notes, 'style.notes', fail)
    },
    rules: {
      always: asList(rawRules.always, 'rules.always', fail),
      never: asList(rawRules.never, 'rules.never', fail)
    },
    boundaries: asList(doc.boundaries, 'boundaries', fail),
    examples,
    warnings: warn
  };
}

/** Serialize back to YAML, in the canonical field order. */
export function toYaml(persona) {
  const out = {
    persa: SPEC_VERSION,
    name: persona.name
  };
  if (persona.tagline) out.tagline = persona.tagline;
  if (Object.keys(persona.voice || {}).length) out.voice = persona.voice;

  const style = {};
  if (persona.style?.emoji && persona.style.emoji !== 'sparing') style.emoji = persona.style.emoji;
  if (persona.style?.address_user_as) style.address_user_as = persona.style.address_user_as;
  if (persona.style?.greeting) style.greeting = persona.style.greeting;
  if (persona.style?.notes?.length) style.notes = persona.style.notes;
  if (Object.keys(style).length) out.style = style;

  const rules = {};
  if (persona.rules?.always?.length) rules.always = persona.rules.always;
  if (persona.rules?.never?.length) rules.never = persona.rules.never;
  if (Object.keys(rules).length) out.rules = rules;

  if (persona.boundaries?.length) out.boundaries = persona.boundaries;
  if (persona.examples?.length) out.examples = persona.examples;

  return YAML.stringify(out, { lineWidth: 0 });
}

/**
 * Write a persona back over an existing file, in place.
 *
 * Rebuilding the document from `toYaml` would be simpler, but a persona file
 * is something a person hand-writes and annotates — losing their comments, or
 * a key this version of Persa doesn't model, the first time they nudge a
 * slider is not an acceptable trade. So we edit the parsed document and leave
 * everything we don't manage exactly where it was.
 */
export function mergeIntoYaml(source, persona) {
  const doc = YAML.parseDocument(source);
  if (doc.errors?.length || !YAML.isMap(doc.contents)) return toYaml(persona);

  const put = (path, value) => {
    const empty = value == null || value === '' || (Array.isArray(value) && value.length === 0);
    // deleteIn throws if an intermediate container is missing, and there is
    // nothing to delete in that case anyway.
    if (empty) {
      if (doc.hasIn(path)) doc.deleteIn(path);
      return;
    }
    // `voice:` written with nothing under it parses as a null scalar, and the
    // library refuses to hang a child off that. Replace it with a mapping.
    if (path.length > 1 && !YAML.isMap(doc.getIn([path[0]], true))) {
      if (doc.has(path[0])) doc.set(path[0], doc.createNode({}));
    }
    if (Array.isArray(value)) setList(doc, path, value);
    else doc.setIn(path, value);
  };
  // Drop a container we emptied, but only if nothing unmanaged is left in it.
  const prune = key => {
    const node = doc.get(key, true);
    if (YAML.isMap(node) && node.items.length === 0 && !node.comment && !node.commentBefore) doc.delete(key);
  };

  doc.set('persa', SPEC_VERSION);
  put(['name'], persona.name);
  const hadTrait = trait => doc.hasIn(['voice', trait]);
  put(['tagline'], persona.tagline);

  for (const trait of TRAIT_NAMES) {
    const value = persona.voice?.[trait];
    // 50 compiles to nothing, so never introduce one — but if the file already
    // says 50, that is the user's line (and possibly their comment) to keep.
    put(['voice', trait], value === 50 && !hadTrait(trait) ? undefined : value);
  }
  prune('voice');

  // `sparing` is the default and compiles to nothing, so don't write it into
  // a file that never mentioned emoji.
  const emoji = persona.style?.emoji;
  put(['style', 'emoji'], emoji === 'sparing' && !doc.hasIn(['style', 'emoji']) ? '' : emoji);
  put(['style', 'address_user_as'], persona.style?.address_user_as);
  put(['style', 'greeting'], persona.style?.greeting);
  put(['style', 'notes'], persona.style?.notes);
  prune('style');

  put(['rules', 'always'], persona.rules?.always);
  put(['rules', 'never'], persona.rules?.never);
  prune('rules');

  put(['boundaries'], persona.boundaries);
  put(['examples'], persona.examples);

  return doc.toString({ lineWidth: 0 });
}

/**
 * Replace a list, keeping the comments on items that are still there.
 *
 * `setIn` with a plain array swaps in a whole new node, which throws away
 * every `# why this rule exists` the user wrote. Rules are exactly the kind of
 * thing people annotate, so match surviving items by value and reuse their
 * nodes.
 */
function setList(doc, path, values) {
  const existing = doc.getIn(path, true);
  if (!YAML.isSeq(existing)) {
    doc.setIn(path, values);
    return;
  }

  const spare = existing.items.slice();
  const items = values.map(value => {
    const i = spare.findIndex(node => YAML.isScalar(node) && node.value === value);
    if (i === -1) return doc.createNode(value);
    return spare.splice(i, 1)[0];
  });

  // Nothing moved and nothing changed: leave the node exactly as it was.
  if (items.length === existing.items.length && items.every((node, i) => node === existing.items[i])) return;
  existing.items = items;
}

/**
 * One in-flight write per file. Two saves racing on a read-modify-write can
 * interleave and leave the file half from each.
 */
const writeQueue = new Map();

export function savePersona(file, persona) {
  const previous = writeQueue.get(file) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(() => writeOnce(file, persona));
  writeQueue.set(file, next);
  // Don't let the queue pin the last result forever.
  next.catch(() => {}).then(() => {
    if (writeQueue.get(file) === next) writeQueue.delete(file);
  });
  return next;
}

async function writeOnce(file, persona) {
  let existing = null;
  try {
    existing = await readFile(file, 'utf8');
  } catch {
    // New file — nothing to preserve.
  }
  const text = existing ? mergeIntoYaml(existing, persona) : toYaml(persona);

  // Write beside the target and rename: a crash or a concurrent reader then
  // sees either the old file or the new one, never a half-written one.
  const tmp = `${file}.persa-${process.pid}.tmp`;
  try {
    await writeFile(tmp, text, 'utf8');
    await rename(tmp, file);
  } catch (e) {
    await rm(tmp, { force: true }).catch(() => {});
    throw e;
  }
  return file;
}
