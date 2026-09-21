import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { serveEditor } from '../src/editor.js';
import { serveHttp } from '../src/mcp.js';

async function personaFile(yaml) {
  const dir = await mkdtemp(path.join(tmpdir(), 'persa-'));
  const file = path.join(dir, 'persona.yaml');
  await writeFile(file, yaml, 'utf8');
  return file;
}

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

test('the editor saves without destroying comments or unknown keys', async () => {
  const file = await personaFile('persa: 1\n# keep me\nname: Sable\nvoice:\n  warmth: 25\n  sarcasm: 70\n');
  const { server, url } = await serveEditor(file, { port: 0 });
  try {
    const state = await (await fetch(`${url}/api/state`)).json();
    assert.match(state.warnings.join(' '), /sarcasm/, 'file warnings should reach the UI');

    const res = await post(`${url}/api/save`, { name: 'Vesper', voice: { warmth: 80 } });
    assert.equal((await res.json()).ok, true);

    const after = await readFile(file, 'utf8');
    assert.match(after, /# keep me/);
    assert.match(after, /sarcasm: 70/);
    assert.match(after, /warmth: 80/);
    assert.match(after, /name: Vesper/);
  } finally {
    server.close();
  }
});

test('the editor refuses to save a persona with no name', async () => {
  const file = await personaFile('persa: 1\nname: Sable\n');
  const { server, url } = await serveEditor(file, { port: 0 });
  try {
    const res = await post(`${url}/api/save`, { name: '' });
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /`name` is required/);
    assert.match(await readFile(file, 'utf8'), /name: Sable/, 'the file must be left alone');
  } finally {
    server.close();
  }
});

test('the editor preview is the same text the compiler produces', async () => {
  const file = await personaFile('persa: 1\nname: Sable\n');
  const { server, url } = await serveEditor(file, { port: 0 });
  try {
    const { compile } = await import('../src/compile.js');
    const { normalize } = await import('../src/persona.js');
    const doc = { name: 'Sable', tagline: 'dry', voice: { directness: 95 }, rules: { never: ['No filler.'] } };
    const { renders } = await (await post(`${url}/api/preview`, doc)).json();
    for (const id of Object.keys(renders)) {
      assert.equal(renders[id].text, compile(normalize(doc), id).text, `${id} preview drifted from render`);
    }
  } finally {
    server.close();
  }
});

test('a malformed save body is rejected without touching the file', async () => {
  const file = await personaFile('persa: 1\nname: Sable\n');
  const before = await readFile(file, 'utf8');
  const { server, url } = await serveEditor(file, { port: 0 });
  try {
    const bad = await fetch(`${url}/api/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json at all'
    });
    assert.equal(bad.status, 400);
    assert.equal(await readFile(file, 'utf8'), before);
  } finally {
    server.close();
  }
});

test('/health reports the persona on disk right now, not the one loaded at boot', async () => {
  const file = await personaFile('persa: 1\nname: Sable\n');
  const server = await serveHttp(file, { port: 0 });
  const { port } = server.address();
  try {
    const first = await (await fetch(`http://127.0.0.1:${port}/health`)).json();
    assert.equal(first.persona, 'Sable');

    await writeFile(file, 'persa: 1\nname: Zeno\n', 'utf8');
    const second = await (await fetch(`http://127.0.0.1:${port}/health`)).json();
    assert.equal(second.persona, 'Zeno');

    await writeFile(file, 'name: [broken\n : : :\n', 'utf8');
    const broken = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(broken.status, 503);
    assert.equal((await broken.json()).ok, false);
  } finally {
    server.close();
  }
});
