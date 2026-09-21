#!/usr/bin/env node
/**
 * persa — a personality layer for personal agents.
 *
 * Six commands, no configuration: init, edit, render, check, serve, presets.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [key, inline] = a.slice(2).split('=');
      const next = argv[i + 1];
      if (inline !== undefined) flags[key] = inline;
      else if (next && !next.startsWith('--')) flags[key] = argv[++i];
      else flags[key] = true;
    } else if (a === '-o') {
      flags.out = argv[++i];
    } else if (a === '-t') {
      flags.target = argv[++i];
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

const out = s => process.stdout.write(s + '\n');
const err = s => process.stderr.write(s + '\n');

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

async function cmdInit(flags) {
  const presets = await listPresets();
  const preset = flags.preset === true ? 'chief-of-staff' : flags.preset || 'chief-of-staff';
  if (!presets.includes(preset)) {
    throw new PersonaError(`No preset called "${preset}". Available: ${presets.join(', ')}.`);
  }

  const target = flags.global
    ? path.join(homeDir(), '.persa', 'persona.yaml')
    : path.resolve(flags.out || 'persona.yaml');

  if (existsSync(target) && !flags.force) {
    throw new PersonaError(`${target} already exists. Use --force to overwrite, or --out to write elsewhere.`);
  }

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await readFile(path.join(PRESET_DIR, preset + '.yaml'), 'utf8'), 'utf8');

  out(`Wrote ${target} (from the "${preset}" preset).`);
  out('');
  const rel = path.relative(process.cwd(), target) || target;
  out('Next:');
  out(`  persa edit ${rel}`.padEnd(40) + '# tune it in the browser');
  out('  persa check'.padEnd(40) + '# see how it fits each agent');
  out('  persa serve'.padEnd(40) + '# hand it to an MCP-capable agent');
}

async function cmdRender(file, flags) {
  const { persona } = await loadPersona(file);
  const id = flags.target === true || !flags.target ? 'plain' : flags.target;
  const { text, stats, target } = compile(persona, id);

  if (flags.out) {
    await writeFile(path.resolve(flags.out), text + '\n', 'utf8');
    err(`Wrote ${flags.out} (${stats.length} characters for ${target.label}).`);
    return;
  }
  out(text);
  if (stats.removed.length) {
    err(`\n[persa] trimmed ${stats.removed.length} line(s) to fit ${target.label}'s ${stats.limit}-character limit.`);
  }
  if (stats.truncated) err(`\n[persa] still over the limit after trimming — shorten your rules.`);
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
  const port = Number(flags.port) || 4747;
  const { url, file: found } = await serveEditor(file, { port });
  out(`Persa editor: ${url}`);
  out(`Editing ${found}. Ctrl-C to stop.`);
}

async function cmdServe(file, flags) {
  if (flags.http) {
    const port = Number(flags.port) || 8787;
    await serveHttp(file, { port, host: flags.host || '127.0.0.1' });
  } else {
    await serveStdio(file);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { flags, positional } = parseArgs(rest);
  const file = positional[0];

  if (!command || command === 'help' || flags.help) return out(USAGE);
  if (command === '--version' || command === 'version') return out(VERSION);

  switch (command) {
    case 'init':
      return cmdInit(flags);
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

main().catch(e => {
  err(e instanceof PersonaError ? `persa: ${e.message}` : `persa: ${e?.stack || e}`);
  process.exitCode = 1;
});
