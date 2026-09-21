/**
 * Loading, validating and normalizing a persona file.
 *
 * A persona is a small YAML document. Everything except `name` is optional,
 * and anything you leave out simply produces nothing in the compiled prompt.
 */
import { readFile, writeFile } from 'node:fs/promises';
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

const asText = v => (v == null ? '' : String(v).trim());

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
        const key = Object.keys(x)[0];
        const rest = key == null ? '' : String(x[key] ?? '');
        fail(
          `${at} is a mapping, not a sentence — YAML read the colon in ` +
            `"${key}: ${rest}" as a key. Quote the whole line:\n` +
            `    - "${key}: ${rest}"`
        );
      }
      if (typeof x === 'boolean' || typeof x === 'number') {
        fail(`${at} is ${JSON.stringify(x)}, not a sentence. If you meant it literally, quote it: - "${x}".`);
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

  const name = asText(doc.name);
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
    if (!Number.isFinite(n) || n < 0 || n > 100) fail(`voice.${key} should be a number from 0 to 100, got ${JSON.stringify(value)}.`);
    voice[key] = n;
  }

  const rawStyle = doc.style ?? {};
  if (typeof rawStyle !== 'object' || Array.isArray(rawStyle)) fail('`style` should be a mapping.');
  const emoji = asText(rawStyle.emoji) || 'sparing';
  if (!(emoji in EMOJI_RULES)) fail(`style.emoji should be one of ${Object.keys(EMOJI_RULES).join(', ')}, got "${emoji}".`);

  const rawRules = doc.rules ?? {};
  if (typeof rawRules !== 'object' || Array.isArray(rawRules)) fail('`rules` should be a mapping with `always` and/or `never` lists.');

  const examples = (Array.isArray(doc.examples) ? doc.examples : []).map((ex, i) => {
    if (!ex || typeof ex !== 'object') fail(`examples[${i}] should be a mapping with \`user\` and \`reply\`.`);
    const user = asText(ex.user);
    const reply = asText(ex.reply);
    if (!user || !reply) fail(`examples[${i}] needs both \`user\` and \`reply\`.`);
    return { user, reply };
  });

  return {
    persa: SPEC_VERSION,
    name,
    tagline: asText(doc.tagline),
    voice,
    style: {
      emoji,
      address_user_as: asText(rawStyle.address_user_as),
      greeting: asText(rawStyle.greeting),
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
    } else {
      doc.setIn(path, value);
    }
  };
  // Drop a container we emptied, but only if nothing unmanaged is left in it.
  const prune = key => {
    const node = doc.get(key, true);
    if (YAML.isMap(node) && node.items.length === 0 && !node.comment && !node.commentBefore) doc.delete(key);
  };

  doc.set('persa', SPEC_VERSION);
  put(['name'], persona.name);
  put(['tagline'], persona.tagline);

  for (const trait of TRAIT_NAMES) put(['voice', trait], persona.voice?.[trait]);
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

export async function savePersona(file, persona) {
  let existing = null;
  try {
    existing = await readFile(file, 'utf8');
  } catch {
    // New file — nothing to preserve.
  }
  await writeFile(file, existing ? mergeIntoYaml(existing, persona) : toYaml(persona), 'utf8');
  return file;
}
