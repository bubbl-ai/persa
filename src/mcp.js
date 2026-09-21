/**
 * The MCP server.
 *
 * For agents that speak MCP (Meta Muse custom connectors, Claude, and a
 * growing list of others) this is the whole install: point the agent at the
 * server and it picks the personality up on its own. Three surfaces, because
 * different clients pick up different things:
 *
 *   - `instructions` on initialize — clients that honour it apply the
 *     personality with no tool call at all;
 *   - a `get_personality` tool — described so an agent calls it at the start
 *     of a conversation;
 *   - `persona://current` and `persona://source` resources, plus a
 *     `personality` prompt, for clients that surface those to the user.
 *
 * The persona file is re-read on every request, so editing it (or saving
 * from `persa edit`) takes effect immediately.
 */
import http from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { loadPersona } from './persona.js';
import { compile } from './compile.js';

const TOOL_DESCRIPTION =
  'Fetch the personality the user wants you to have: their preferred voice, tone, and the ' +
  'behavioural rules they expect you to follow. Call this at the start of a conversation, ' +
  'and again if the user mentions changing how you talk. Apply the result to every reply.';

async function currentPersona(personaPath) {
  const { persona, source, file } = await loadPersona(personaPath);
  return { persona, source, file, text: compile(persona, 'plain').text };
}

/** Build a fresh McpServer bound to a persona file. */
export async function createServer(personaPath) {
  const initial = await currentPersona(personaPath);

  const server = new McpServer(
    { name: 'persa', version: '0.1.0', title: `Persa — ${initial.persona.name}` },
    {
      instructions:
        `This user has a defined personality for their agents, named ${initial.persona.name}. ` +
        `Adopt it for this entire conversation:\n\n${initial.text}`
    }
  );

  server.registerTool(
    'get_personality',
    { title: 'Get my agent personality', description: TOOL_DESCRIPTION, inputSchema: {} },
    async () => {
      const { text } = await currentPersona(personaPath);
      return { content: [{ type: 'text', text }] };
    }
  );

  server.registerResource(
    'personality',
    'persona://current',
    {
      title: 'Agent personality',
      description: 'The compiled personality the user wants their agents to have.',
      mimeType: 'text/markdown'
    },
    async uri => {
      const { persona } = await currentPersona(personaPath);
      const { text } = compile(persona, 'claude');
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] };
    }
  );

  server.registerResource(
    'personality-source',
    'persona://source',
    {
      title: 'Persona source (YAML)',
      description: 'The raw persona file, for editing or inspection.',
      mimeType: 'application/yaml'
    },
    async uri => {
      const { source } = await currentPersona(personaPath);
      return { contents: [{ uri: uri.href, mimeType: 'application/yaml', text: source }] };
    }
  );

  server.registerPrompt(
    'personality',
    { title: 'Adopt my personality', description: 'Load the user\'s agent personality into this conversation.' },
    async () => {
      const { text } = await currentPersona(personaPath);
      return {
        messages: [{ role: 'user', content: { type: 'text', text } }]
      };
    }
  );

  return { server, persona: initial.persona, file: initial.file };
}

/** Serve over stdio — the usual local install. */
export async function serveStdio(personaPath) {
  const { server, persona, file } = await createServer(personaPath);
  await server.connect(new StdioServerTransport());
  // stdout is the protocol channel, so status goes to stderr.
  process.stderr.write(`persa: serving "${persona.name}" from ${file} over stdio\n`);
  return server;
}

/**
 * Serve over streamable HTTP — the remote install, for agents that take a URL
 * (Muse custom connectors, hosted clients). Stateless: one server and
 * transport per request, so there is no session state to lose.
 */
export async function serveHttp(personaPath, { port = 8787, host = '127.0.0.1', path: endpoint = '/mcp' } = {}) {
  // Fail fast on a broken persona rather than at the first request.
  const { persona, file } = await currentPersona(personaPath);

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
    if (url.pathname === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, persona: persona.name }));
      return;
    }
    if (url.pathname !== endpoint) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end(`Persa MCP server. Connect to ${endpoint}.\n`);
      return;
    }
    try {
      const { server } = await createServer(personaPath);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on('close', () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, await readBody(req));
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: String(err?.message ?? err) }, id: null }));
      }
    }
  });

  await new Promise(resolve => httpServer.listen(port, host, resolve));
  process.stderr.write(
    `persa: serving "${persona.name}" from ${file}\n` + `      MCP endpoint: http://${host}:${port}${endpoint}\n`
  );
  return httpServer;
}

async function readBody(req) {
  if (req.method !== 'POST') return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return undefined;
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
