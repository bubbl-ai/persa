import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/mcp.js';

async function personaFile(yaml) {
  const dir = await mkdtemp(path.join(tmpdir(), 'persa-'));
  const file = path.join(dir, 'persona.yaml');
  await writeFile(file, yaml, 'utf8');
  return file;
}

async function connect(file) {
  const { server } = await createServer(file);
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '1.0.0' });
  await Promise.all([client.connect(clientT), server.connect(serverT)]);
  return { client, server };
}

test('the server advertises the personality in its instructions', async () => {
  const file = await personaFile('name: Sable\nvoice: { directness: 95 }\n');
  const { client, server } = await connect(file);
  assert.match(client.getInstructions(), /You are Sable/);
  assert.match(client.getInstructions(), /Be blunt/);
  await server.close();
});

test('get_personality returns the compiled text', async () => {
  const file = await personaFile('name: Sable\nvoice: { verbosity: 5 }\n');
  const { client, server } = await connect(file);
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map(t => t.name), ['get_personality']);
  const res = await client.callTool({ name: 'get_personality', arguments: {} });
  assert.match(res.content[0].text, /one or two sentences/);
  await server.close();
});

test('edits to the persona file are picked up without a restart', async () => {
  const file = await personaFile('name: Sable\n');
  const { client, server } = await connect(file);
  await writeFile(file, 'name: Remy\nvoice: { humor: 95 }\n', 'utf8');
  const res = await client.callTool({ name: 'get_personality', arguments: {} });
  assert.match(res.content[0].text, /You are Remy/);
  assert.match(res.content[0].text, /playful and irreverent/);
  await server.close();
});

test('both resources and the prompt are readable', async () => {
  const file = await personaFile('name: Sable\ntagline: dry\n');
  const { client, server } = await connect(file);
  const current = await client.readResource({ uri: 'persona://current' });
  assert.match(current.contents[0].text, /You are Sable/);
  const source = await client.readResource({ uri: 'persona://source' });
  assert.match(source.contents[0].text, /name: Sable/);
  const prompt = await client.getPrompt({ name: 'personality' });
  assert.match(prompt.messages[0].content.text, /You are Sable/);
  await server.close();
});
