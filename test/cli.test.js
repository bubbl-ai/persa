/**
 * The CLI, run the way a person runs it.
 *
 * These spawn the real binary rather than importing its functions, because
 * the things that break in a CLI are the things importing skips: argument
 * parsing, exit codes, and what lands on stdout versus stderr. `install` is
 * the command most worth covering, since it is what a new user meets first.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const CLI = fileURLToPath(new URL('../src/cli.js', import.meta.url));

let dir;
let persona;

test.before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'persa-cli-'));
  persona = path.join(dir, 'persona.yaml');
  await writeFile(persona, [
    'persa: 1',
    'name: Juniper',
    'tagline: a blunt second opinion',
    'voice:',
    '  directness: 90',
    '  warmth: 20',
    'rules:',
    '  always:',
    '    - Lead with the answer.',
    ''
  ].join('\n'));
});

test.after(async () => { if (dir) await rm(dir, { recursive: true, force: true }); });

const persa = (...args) => run(process.execPath, [CLI, ...args], { cwd: dir });

test('install prints the steps for a paste target, then the text', async () => {
  const { stdout } = await persa('install', 'grok');
  assert.match(stdout, /Installing Juniper in Grok/);
  assert.match(stdout, /1\. Open Grok and go to Custom Agents\./);
  assert.match(stdout, /4\. Save, then start a conversation with that agent\./);
  assert.match(stdout, /You are Juniper/, 'the compiled text follows the steps');
  assert.match(stdout, /characters/, 'and says how long it is against the limit');
  assert.doesNotMatch(stdout, /persa serve/, 'a paste target is not told to run a server');
});

test('install tells a connector target where its URL comes from', async () => {
  const { stdout } = await persa('install', 'claude');
  assert.match(stdout, /In Claude, open Settings, then Connectors\./);
  assert.match(stdout, /persa serve --http/);
  assert.match(stdout, /cannot reach/, 'and is honest that localhost is not reachable from a cloud agent');
  assert.match(stdout, /You are Juniper/, 'the paste-instead text is still offered');
});

test('install names the agents when you do not', async () => {
  await assert.rejects(persa('install'), err => {
    assert.match(err.stderr, /Which agent\?/);
    assert.match(err.stderr, /persa install grok/);
    return true;
  });
});

test('install refuses an agent it does not know', async () => {
  await assert.rejects(persa('install', 'clippy'), err => {
    assert.match(err.stderr, /Unknown target "clippy"/);
    return true;
  });
});

test('every target can be installed, and says something useful', async () => {
  const { stdout: list } = await persa('check');
  assert.match(list, /Juniper/);
  for (const id of ['grok', 'muse', 'instinct', 'claude', 'chatgpt', 'plain']) {
    const { stdout } = await persa('install', id);
    assert.match(stdout, /^Installing Juniper in /, `${id} names what it is doing`);
    assert.match(stdout, /^ {2}1\. /m, `${id} has a first step`);
    assert.match(stdout, /You are Juniper/, `${id} includes the compiled text`);
  }
});

test('the usage text lists install', async () => {
  const { stdout } = await persa('help');
  assert.match(stdout, /persa install <target>/);
});
