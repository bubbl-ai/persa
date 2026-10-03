# Installing a persona into an agent

Two routes: connect an MCP client, or paste compiled text into the agent's instructions or a message. An MCP client must fetch the persona again to see later edits; connecting alone does not guarantee it will apply every rule.

**Documentation checked: 2 October 2026.** Links below identify the product documentation used for this review. These are documentation checks, not end-to-end tests in signed-in accounts. The character budgets in [`src/targets.js`](../src/targets.js) are Persa's configured values; a value of `null` means Persa does not trim, not that the receiving product has no limits. Where a current product limit or screen could not be verified, that is stated explicitly.

---

## Meta Muse

**Route: a Custom Connector to try, or a remembered message.**

Meta documents [creating a Custom Connector by asking Muse in a conversation](https://www.meta.com/help/artificial-intelligence/1687253048996149/). Its [technical overview](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) describes a dedicated cloud VM and connectors Muse writes for APIs or CLIs. These sources do not establish that adding Persa's MCP URL always works or automatically saves a reusable skill. Verify the result in your account.

```bash
persa serve --http --port 8787
# → MCP endpoint: http://127.0.0.1:8787/mcp
```

Muse runs in Meta's cloud, so `127.0.0.1` won't reach your machine. Expose the endpoint on a hostname Muse can resolve — a tunnel (`cloudflared tunnel --url http://localhost:8787`, `ngrok http 8787`) for a quick trial, or a host of your own. Ask Muse to create a Custom Connector using the public `/mcp` URL and call `get_personality`. Check that it returns your actual persona before relying on it; ask it to fetch the persona again after you edit it.

**Bear in mind** the CLI HTTP server has no authentication. Anyone who can reach it can read the compiled persona and original YAML, including comments and extra keys, through its MCP resources. The health endpoint also reports the local file path. Use an access-controlled proxy for private content. If you'd rather not host anything:

```bash
persa render --target muse
```

and send that to Muse once, asking it to remember it.

---

## Grok — Custom Agents

**Route: paste.**

Persa's `grok` target is labelled **Grok — Custom Agent** and compiles system-style text with a **4,000-character budget**. The current Custom Agents menu, four-slot count, and product-enforced character limit were not verified in official documentation during this review. Confirm the instruction field and its limit in your account.

```bash
persa render --target grok
```

Paste into the agent's instruction field if your account provides one. `persa check` tells you whether Persa would trim the text to fit its configured budget and what it would drop.

[Grok Bot](https://docs.x.ai/grok-bot/overview) is separately documented as an agent with a persistent cloud computer that you interact with through messages. Reusing persona text there is possible as a request, but this guide has not verified that it uses the same instruction field or limit as the `grok` target.

---

## Instinct

**Route: a text message.**

[Instinct's official site](https://instinct.com/) describes interacting by text or call. Send the personality as a message; a persistent personality setting and its limits have not been verified.

```bash
persa render --target instinct
```

Send it as a single message. Persa frames this target as a request from you ("Here's how I want you to talk and behave with me from now on…") rather than as a system prompt, and holds it to **1,200 characters**, which is a judgement call about what belongs in one text, not a documented product limit. Raise it in `src/targets.js` if your agent handles more.

Expect to re-send it occasionally. A message-based instruction lives in whatever memory the product keeps, and you don't control that.

---

## Claude

**Route: MCP (preferred), or project instructions.**

For Claude Desktop's local MCP support, add the server to `claude_desktop_config.json`:

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

For Claude Code, use its [MCP setup command](https://code.claude.com/docs/en/mcp):

```bash
claude mcp add --transport stdio persa -- persa serve /absolute/path/to/persona.yaml
```

Claude Code documents loading MCP server instructions at session start, with **2,048-character truncation by default**. Persa does not account for that client-side cap in `persa check`. Ask Claude to call `get_personality` and apply the returned persona, especially for longer personas. Do not assume every Claude client automatically applies the complete initialize instructions.

Persa sends initialize instructions once per initialization. Restart or reconnect a client that relies on them after an edit. Tools, resources and the `personality` prompt re-read the file when called; a later chat message by itself does not ensure another call.

For a remote URL, Claude's [custom connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) currently directs individual users to **Customize → Connectors → + Add → Add custom connector**. Team and Enterprise setup has an organization-admin step. The URL must be reachable from Anthropic's cloud, even when using Claude Desktop. The local stdio configuration above is a separate route.

To paste instead: `persa render --target claude` into **Project → Set project instructions**, as documented in [Claude's project guide](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects).

---

## ChatGPT

**Route: paste.**

```bash
persa render --target chatgpt
```

Paste into the custom instructions control under **Settings → Personalization**. [Official OpenAI documentation](https://learn.chatgpt.com/docs/prompting) recommends that location for preferences across chats, and notes that [available personalization controls vary by surface](https://learn.chatgpt.com/docs/personalize).

Persa uses a **1,500-character budget**. The exact current field label and character cap were not established by the official pages checked for this review; confirm them in your client before pasting.

---

## Anything else

```bash
persa render --target plain
```

No markdown headings, no product-specific framing — safe for a box that strips formatting.

If the agent supports a compatible MCP transport, try `persa serve` even when Persa has no named target for it. Verify that the client can call `get_personality` and receives the expected text.

---

## Adding a target

A target has eight fields. Add one to `TARGETS` in [`src/targets.js`](../src/targets.js):

```js
newthing: {
  id: 'newthing',
  label: 'New Thing — settings',
  limit: 2000,          // Persa's character budget; null disables trimming
  framing: 'system',    // 'system' = a prompt field; 'message' = you send it in chat
  markdown: true,       // false when the field eats formatting
  where: 'New Thing → Settings → Personality.',
  how: 'paste',        // or 'connect' for an MCP URL
  steps: [
    'Open New Thing and find its Personality settings.',
    'Paste the text and save.'
  ]
}
```

It shows up in `persa render --target`, in `persa check`, and as a tab in `persa edit` immediately. `persa install` prints `steps`; `where` appears in the editor. Cite the product's current setup documentation here, state whether the budget is verified or chosen, and run `npm test` after changing a target.
