# Installing a persona into an agent

Two routes. If the agent speaks MCP, use route 1 — it updates itself. Otherwise paste.

What each product supports changes often, and Persa cannot check any of it for you. Everything below about Muse, Grok, Instinct and ChatGPT — dates, caps, slot counts, which screen a setting lives on — is secondhand and current as of **September 2026**. Treat it as a pointer, verify against the product, and if something has moved, the fix is usually one line in [`src/targets.js`](../src/targets.js).

---

## Meta Muse

**Route: MCP (preferred), or a remembered message.**

Muse runs on its own VM and documents a Custom Connector feature: give it an MCP server URL and it builds a client, tests the tools, and saves the result as a skill. Meta opened the developer connector platform on 19 September 2026.

```bash
persa serve --http --port 8787
# → MCP endpoint: http://127.0.0.1:8787/mcp
```

Muse runs in Meta's cloud, so `127.0.0.1` won't reach it. Expose the endpoint on a hostname Muse can resolve — a tunnel (`cloudflared tunnel --url http://localhost:8787`, `ngrok http 8787`) for a quick trial, or a small always-on box if you want it permanent. Then add that URL as a Custom Connector.

**Bear in mind** you are putting an endpoint on the public internet. Persa serves one thing — your persona text — and accepts no writes, so the blast radius is small, but it is still readable by anyone who finds the URL. Don't put anything in your persona you wouldn't hand to a stranger. If you'd rather not host anything:

```bash
persa render --target muse
```

and send that to Muse once, asking it to remember it.

---

## Grok — Custom Agents

**Route: paste.**

xAI's Custom Agents (March 2026) are named personas with their own instruction set; you get up to four slots and pick one when you start a conversation. System instructions are capped at **4,000 characters**.

```bash
persa render --target grok
```

Paste into **Grok → Custom Agents → your agent → System instructions**. `persa check` tells you in advance whether you're over the cap and what Persa would drop to get under it.

Grok Bot (August 2026) — the always-on variant with its own cloud computer — takes the same instruction text.

---

## Instinct

**Route: a text message.**

Instinct has no dashboard and no settings screen; you reach it by text or call. So the personality goes in the same way everything else does — as a message.

```bash
persa render --target instinct
```

Send it as a single message. Persa frames this target as a request from you ("Here's how I want you to talk and behave with me from now on…") rather than as a system prompt, and holds it to **1,200 characters**, which is a judgement call about what belongs in one text, not a documented product limit. Raise it in `src/targets.js` if your agent handles more.

Expect to re-send it occasionally. A message-based instruction lives in whatever memory the product keeps, and you don't control that.

---

## Claude

**Route: MCP (preferred), or project instructions.**

For Claude Desktop or Claude Code, add the server to your MCP config:

```json
{
  "mcpServers": {
    "persa": {
      "command": "persa",
      "args": ["serve", "/absolute/path/to/persona.yaml"]
    }
  }
}
```

Use an absolute path — the MCP client's working directory is not yours. If `persa` isn't on your PATH, use `"command": "node"` with `"args": ["/absolute/path/to/persa/src/cli.js", "serve", "/absolute/path/to/persona.yaml"]`.

Claude honours the `instructions` field an MCP server sends on initialize, so the personality applies without a tool call. That field is sent once per connection, so a stdio client picks up a later edit on its next restart; the tool and resources are always re-read from disk.

To paste instead: `persa render --target claude` into **Project → Set project instructions**.

---

## ChatGPT

**Route: paste.**

```bash
persa render --target chatgpt
```

**Settings → Personalization → Custom instructions → "How would you like ChatGPT to respond?"** That box holds about 1,500 characters, which is what Persa targets.

---

## Anything else

```bash
persa render --target plain
```

No markdown headings, no product-specific framing — safe for a box that strips formatting.

If the agent speaks MCP, `persa serve` works regardless of whether Persa has heard of it.

---

## Adding a target

A target is six fields. Add one to `TARGETS` in [`src/targets.js`](../src/targets.js):

```js
newthing: {
  id: 'newthing',
  label: 'New Thing — settings',
  limit: 2000,          // or null for no practical cap
  framing: 'system',    // 'system' = a prompt field; 'message' = you send it in chat
  markdown: true,       // false when the field eats formatting
  where: 'New Thing → Settings → Personality.'
}
```

It shows up in `persa render --target`, in `persa check`, and as a tab in `persa edit` immediately. No other file needs to change.
