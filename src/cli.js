#!/usr/bin/env node
/**
 * persa — a personality layer for personal agents.
 *
 * Six commands, no configuration: init, edit, render, check, serve, presets.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPersona, resolvePersonaPath, PersonaError, homeDir } from './persona.js';
import { compile, compileAll } from './compile.js';
import { TARGETS, TARGET_IDS } from './targets.js';
import { serveStdio, serveHttp } from './mcp.js';
import { serveEditor } from './editor.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRESET_DIR = path.join(ROOT, 'presets');
const VERSION = '0.1.0';

const USAGE = `persa ${VERSION} — give your personal agents a personality you choose.

  persa init [--preset <name>] [--out <file>]   create a persona file
  persa edit [file] [--port 4747]               open the editor in a browser
  persa render [file] --target <id>             print the personality for one agent
  persa check [file]                            validate, and show the fit for every agent
  persa serve [file] [--http] [--port 8787]     run the MCP server
  persa presets                                 list the starting points

Targets: ${TARGET_IDS.join(', ')}
A persona file is found automatically: ./persona.yaml, then ~/.persa/persona.yaml.
`;

/** Flags that are on/off. Without this list they would eat the next token. */
const BOOLEAN_FLAGS = new Set(['global', 'force', 'http', 'help', 'version']);

/** Every flag Persa understands. An unknown one is a typo, not a value. */
const KNOWN_FLAGS = new Set([...BOOLEAN_FLAGS, 'preset', 'out', 'target', 'port', 'host']);

const SHORT_FLAGS = { '-t': 'target', '-o': 'out', '-p': 'port' };

/** Addresses that are only reachable from this machine. */
const LOOPBACK = new Set(['127.0.0.1', 'localhost', '::1', '[::1]', '0:0:0:0:0:0:0:1']);

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [key, inline] = a.slice(2).split('=');
      const next = argv[i + 1];
      if (!KNOWN_FLAGS.has(key)) {
        throw new PersonaError(`Unknown flag --${key}. Known flags: ${[...KNOWN_FLAGS].sort().map(f => '--' + f).join(', ')}.`);
      }
      if (inline !== undefined) flags[key] = inline;
      else if (BOOLEAN_FLAGS.has(key)) flags[key] = true;
      else if (next && !next.startsWith('--')) flags[key] = argv[++i];
      else flags[key] = true;
    } else if (SHORT_FLAGS[a]) {
      // `-t` with nothing after it must not silently become undefined, and
      // must not swallow a following flag.
      const value = argv[i + 1];
      flags[SHORT_FLAGS[a]] = value === undefined || value.startsWith('-') ? true : argv[++i];
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

const out = s => process.stdout.write(s + '\n');
const err = s => process.stderr.write(s + '\n');

/** A flag that needs a value: `--port` alone parses as `true`, which is not one. */
function flagText(flags, key) {
  const v = flags[key];
  if (v === undefined) return undefined;
  if (v === true || String(v).trim() === '') {
    throw new PersonaError(`--${key} needs a value.`);
  }
  return String(v);
}

function flagPort(flags, key, fallback) {
  const v = flagText(flags, key);
  if (v === undefined) return fallback;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new PersonaError(`--${key} should be a port number from 1 to 65535, got "${v}".`);
  }
  return n;
}

async function listPresets() {
  const files = await readdir(PRESET_DIR);
  return files.filter(f => f.endsWith('.yaml')).map(f => f.replace(/\.yaml$/, ''));
}

async function cmdPresets() {
  for (const name of await listPresets()) {
    const { persona } = await loadPersona(path.join(PRESET_DIR, name + '.yaml'));
    out(`  ${name.padEnd(16)} ${persona.name} — ${persona.tagline}`);
  }
  out('\nStart from one with:  persa init --preset <name>');
}

async function cmdInit(flags, positional) {
  const presets = await listPresets();
  const preset = flags.preset === undefined ? 'chief-of-staff' : flagText(flags, 'preset');
  if (!presets.includes(preset)) {
    throw new PersonaError(`No preset called "${preset}". Available: ${presets.join(', ')}.`);
  }

  const where = flags.out !== undefined ? flagText(flags, 'out') : positional[0];
  if (flags.global && where) {
    throw new PersonaError('--global writes to ~/.persa/persona.yaml, so it cannot be combined with a path.');
  }

  const target = flags.global
    ? path.join(homeDir(), '.persa', 'persona.yaml')
    : path.resolve(where || 'persona.yaml');

  if (existsSync(target) && statSync(target).isDirectory()) {
    throw new PersonaError(`${target} is a directory. Give a file path, e.g. ${path.join(target, 'persona.yaml')}.`);
  }
  if (existsSync(target) && !flags.force) {
    throw new PersonaError(`${target} already exists. Use --force to overwrite, or give another path.`);
  }

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await readFile(path.join(PRESET_DIR, preset + '.yaml'), 'utf8'), 'utf8');

  out(`Wrote ${target} (from the "${preset}" preset).`);
  out('');
  const relative = path.relative(process.cwd(), target);
  const rel = !relative || relative.startsWith('..') ? target : relative;
  out('Next:');
  out(`  persa edit ${rel}`.padEnd(40) + ' # tune it in the browser');
  out('  persa check'.padEnd(40) + ' # see how it fits each agent');
  out('  persa serve'.padEnd(40) + ' # hand it to an MCP-capable agent');
}

async function cmdRender(file, flags) {
  const { persona } = await loadPersona(file);
  const id = flags.target === undefined ? 'plain' : flagText(flags, 'target');
  const { text, stats, target } = compile(persona, id);

  const warnAboutFit = () => {
    if (stats.removed.length) {
      err(`[persa] trimmed ${stats.removed.length} line(s) to fit ${target.label}'s ${stats.limit}-character limit.`);
    }
    if (stats.truncated) err('[persa] still over the limit after trimming — shorten your rules or the tagline.');
  };

  if (flags.out) {
    const dest = path.resolve(flagText(flags, 'out'));
    try {
      await writeFile(dest, text + '\n', 'utf8');
    } catch (e) {
      throw new PersonaError(`Could not write ${dest}: ${e.code ?? e.message}.`);
    }
    err(`Wrote ${dest} (${stats.length} characters for ${target.label}).`);
    warnAboutFit();
    return;
  }
  out(text);
  if (stats.removed.length || stats.truncated) err('');
  warnAboutFit();
}

async function cmdCheck(file) {
  const { persona, file: found } = await loadPersona(file);
  out(`${persona.name} — ${found}`);
  if (persona.tagline) out(`  "${persona.tagline}"`);
  for (const w of persona.warnings) err(`  warning: ${w}`);
  out('');

  for (const r of compileAll(persona)) {
    const t = TARGETS[r.id];
    const budget = r.stats.limit ? `${r.stats.length} / ${r.stats.limit}` : `${r.stats.length}`;
    const mark = r.stats.truncated ? 'CUT ' : r.stats.removed.length ? 'trim' : 'ok  ';
    out(`  ${mark} ${t.label.padEnd(30)} ${budget.padStart(11)} chars`);
    if (r.stats.removed.length) {
      const by = r.stats.removed.reduce((acc, x) => ((acc[x.section] = (acc[x.section] || 0) + 1), acc), {});
      out(`       dropped ${Object.entries(by).map(([k, v]) => `${v} from ${k}`).join(', ')}`);
    }
    if (r.stats.truncated) out(`       over the limit even after trimming — shorten the rules or the tagline`);
  }
  out('');
  out('Copy one with:  persa render --target <id>');
}

async function cmdEdit(file, flags) {
  const port = flagPort(flags, 'port', 4747);
  const { url, file: found } = await withFriendlyListenErrors(port, () => serveEditor(file, { port }));
  out(`Persa editor: ${url}`);
  out(`Editing ${found}. Open the URL in a browser; Ctrl-C to stop.`);
}

async function cmdServe(file, flags) {
  if (!flags.http) {
    for (const flag of ['port', 'host']) {
      if (flags[flag] !== undefined) {
        throw new PersonaError(`--${flag} only applies to \`serve --http\`. Plain \`serve\` speaks over stdio, which has no address.`);
      }
    }
    return serveStdio(file);
  }
  const port = flagPort(flags, 'port', 8787);
  const host = flags.host === undefined ? '127.0.0.1' : flagText(flags, 'host');
  if (!LOOPBACK.has(host)) {
    err(`[persa] binding to ${host} — this endpoint will be reachable from other machines.`);
  }
  return withFriendlyListenErrors(port, () => serveHttp(file, { port, host }));
}

/** An in-use port is a normal thing to hit; it should not print a stack trace. */
async function withFriendlyListenErrors(port, start) {
  try {
    return await start();
  } catch (e) {
    if (e?.code === 'EADDRINUSE') {
      throw new PersonaError(`Port ${port} is already in use. Pick another with --port.`);
    }
    if (e?.code === 'EACCES') {
      throw new PersonaError(`Not allowed to bind port ${port}. Ports below 1024 usually need root; pick a higher --port.`);
    }
    if (e?.code === 'EADDRNOTAVAIL' || e?.code === 'ENOTFOUND' || e?.code === 'EINVAL') {
      throw new PersonaError(`Could not bind ${e.address ?? 'that address'}:${port} — ${e.code}. Check --host.`);
    }
    if (e?.syscall === 'listen' || e?.syscall === 'getaddrinfo') {
      throw new PersonaError(`Could not start the server on port ${port}: ${e.code ?? e.message}.`);
    }
    throw e;
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === 'help') return out(USAGE);
  if (command === '--version' || command === 'version' || command === '-v') return out(VERSION);

  const { flags, positional } = parseArgs(rest);
  const file = positional[0];
  if (flags.help) return out(USAGE);

  switch (command) {
    case 'init':
      return cmdInit(flags, positional);
    case 'presets':
      return cmdPresets();
    case 'render':
      return cmdRender(file, flags);
    case 'check':
      return cmdCheck(file);
    case 'edit':
      return cmdEdit(file, flags);
    case 'serve':
      return cmdServe(file, flags);
    case 'where':
      return out(resolvePersonaPath(file));
    default:
      err(`Unknown command "${command}".\n`);
      out(USAGE);
      process.exitCode = 1;
  }
}

// `persa check | head` closes stdout early. That is a normal way to use a
// CLI, not an error worth a stack trace.
for (const stream of [process.stdout, process.stderr]) {
  stream.on('error', e => {
    if (e?.code === 'EPIPE') process.exit(0);
    throw e;
  });
}

main().catch(e => {
  if (e?.code === 'EPIPE') process.exit(0);
  err(e instanceof PersonaError ? `persa: ${e.message}` : `persa: ${e?.stack || e}`);
  process.exitCode = 1;
});
