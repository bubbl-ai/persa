/**
 * The local editor.
 *
 * `persa edit` opens a one-page UI on localhost: sliders on the left, the
 * compiled prompt on the right, a copy button per target. Nothing leaves the
 * machine — the page talks to this process, and this process reads and writes
 * one YAML file. All compiling happens here rather than in the browser, so
 * the preview is exactly the text `persa render` produces.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPersona, savePersona, normalize, toYaml } from './persona.js';
import { compile } from './compile.js';
import { TARGETS, TARGET_IDS } from './targets.js';
import { TRAITS, TRAIT_NAMES } from './traits.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export async function serveEditor(personaPath, { port = 4747, host = '127.0.0.1' } = {}) {
  const loaded = await loadPersona(personaPath);
  const file = loaded.file;

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

      if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
        const html = await readFile(path.join(HERE, 'editor', 'index.html'), 'utf8');
        return send(res, 200, 'text/html; charset=utf-8', html);
      }

      if (req.method === 'GET' && url.pathname === '/api/state') {
        const { persona } = await loadPersona(file);
        return json(res, 200, {
          file,
          persona,
          traits: TRAIT_NAMES.map(id => ({ id, low: TRAITS[id].low, high: TRAITS[id].high })),
          targets: TARGET_IDS.map(id => ({ ...TARGETS[id] }))
        });
      }

      if (req.method === 'POST' && url.pathname === '/api/preview') {
        const persona = normalize(await body(req), 'editor');
        const renders = {};
        for (const id of TARGET_IDS) {
          const { text, stats } = compile(persona, id);
          renders[id] = { text, ...stats };
        }
        return json(res, 200, { renders, yaml: toYaml(persona), warnings: persona.warnings });
      }

      if (req.method === 'POST' && url.pathname === '/api/save') {
        const persona = normalize(await body(req), 'editor');
        await savePersona(file, persona);
        return json(res, 200, { ok: true, file });
      }

      return send(res, 404, 'text/plain', 'not found');
    } catch (err) {
      return json(res, 400, { error: String(err?.message ?? err) });
    }
  });

  await new Promise(resolve => server.listen(port, host, resolve));
  return { server, url: `http://${host}:${port}`, file };
}

function send(res, status, type, payload) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(payload);
}

function json(res, status, payload) {
  send(res, status, 'application/json', JSON.stringify(payload));
}

async function body(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
