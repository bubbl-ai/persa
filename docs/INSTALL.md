# Installing a persona into an agent

Two routes: connect an MCP client, or paste compiled text into the agent's instructions or a message. An MCP client must fetch the persona again to see later edits; connecting alone does not guarantee it will apply every rule.

**CLI setup documentation checked: 2 October 2026; Muse handoff notes updated: 15 October 2026 (Asia/Shanghai); Grok Bot notes checked: 5 October 2026 (UTC).** Links below identify the product documentation used for these reviews. The [initial](MUSE_VALIDATION.md) and [batch](MUSE_BATCH_VALIDATION.md) desktop Muse tests cover older likeness-based combos. The [October 14 reliability report](MUSE_HANDOFF_RELIABILITY.md) covers three costume presets; the [October 15 all-character record](MUSE_ALL_CHARACTER_HANDOFF.md) tracks the expanded direct links, compatibility checks and release status. The other routes below remain documentation checks. Character budgets in [`src/targets.js`](../src/targets.js) are Persa's configured values; `null` means Persa does not trim, not that the receiving product has no limits.

---

## Meta Muse

### Website character combos

The [Persa website](https://persa.bubblai.com) is public on Vercel. Its homepage
has a white, borderless spotlight stage, the selected personality's three
adjectives and all 18 character tiles below. Browse with arrows, a horizontal
swipe or the character picker. **Tune personality** opens the voice controls;
**Open in Muse** opens the selected combo directly in Muse. **All characters**
scrolls to the tiles. The standalone collection remains at `/collection.html`,
and **Saved** opens `/collection.html?view=saved`. The old `/spotlight.html`
address redirects to the homepage.

This checkout has direct **Open in Muse** links for **all 18 presets**, on the
stage, every tile and the personality detail dialog. The
[all-character record](MUSE_ALL_CHARACTER_HANDOFF.md) records native validation
and whether this implementation has been deployed. The shortest flow is:

1. Click **Open in Muse** on the chosen character. No setup dialog is required.
   The prepared message contains its current personality and instructions to
   use Persa's shared image as the avatar reference. Opening the link does not
   send anything.
2. Review the message in Muse and press **Send**. It asks Muse to save the
   selected style and generate native costume candidates.
3. Review the options, choose one and click **Select** to activate it. Check
   the saved personality and try a short conversation.

Personality tuning is optional. Tone edits, reset and saved preferences update
the direct links, so the selected settings travel with the character. This is
one click from Persa to the prepared message, not one-click application inside
Muse. The optional **Setup options** control opens copying, downloads and help.

If Muse opens with an empty composer, including after login, return to Persa,
open **Setup options**, click **Copy complete combo**, and paste that message
into Muse. An existing unsent Muse draft can take precedence over the prepared
message; review that draft before clearing the composer and reopening the link,
or use complete-combo copy. If clipboard
access is denied, Persa shows the complete text for manual copying. The copied
message, prepared link, displayed complete combo and download use the same
payload and current tone settings.

All 18 use the direct-link flow. Mona Lisa, Taylor Swift and Mark Zuckerberg
retain their exact previously tested payloads. The other 15 use their authored
costumes with a shared preservation recipe. Availability is separate from
repeated native validation and from choosing the eventual launch ten.

The shortcut asks Muse to download the public shared base directly inside its
workspace, verify its checksum and pass that file to the native generator.
If it cannot obtain or use the reference, the message tells it to stop the
avatar step and explain the problem. No manual image attachment is included
in the intended shortcut. The separate **Text-only avatar prompt** control
omits the reference and retains the legacy prompt; use the complete combo for
the reference-based setup. **Personality only** remains available independently.

The link uses an observed `?prompt=` behavior, not a documented Muse API
contract. It enters the existing Main chat. Actual mobile devices/native apps
and successful handoff through completed login remain unverified. Desktop
responsive layout checks do not establish those flows. No custom connector,
Persa sign-in or API token is required by this website shortcut.

Each costume dresses the same cream plush Muse-style companion. The previews
show the intended costume, not an identical avatar that Muse will reuse.
Native generations can change hands, face details, garments and proportions.
Current prompts exclude human hair. A missing preview does not prevent setup;
if an image fails to load, reopen its character and use **Retry image**. See
[the design contract](MUSE_AVATAR_DESIGN.md).

Saved combos and tone settings belong to this browser and website origin;
saving in Persa does not update Muse. JSON downloads preserve the persona,
compiled personality, legacy text-only avatar prompt and complete combo. Every
catalog preset also includes `museHandoff` with the exact version,
prepared message, URL and reference metadata. There is no JSON import or
restore control. The same saved collection and character dialogs are used by
the stage and tiles; saving keeps the stage selection and originating focus.

Keep the evidence for each route separate:

- Earlier [initial](MUSE_VALIDATION.md) and [batch](MUSE_BATCH_VALIDATION.md)
  desktop tests verified selection/persistence for 13 older likeness-based
  avatars. They found stale preferences when changing characters. The new
  message explicitly replaces prior voice, tone and emoji settings while
  preserving unrelated preferences; see the new report for observed results.
- The October 12 [unchanged-prompt check](MUSE_NATIVE_AVATAR_VALIDATION.md)
  reviewed 36 options from 9 text-only requests for the three current costume
  presets. The separate [prompt-engineering experiment](MUSE_PROMPT_ENGINEERING.md)
  reviewed 84 options from 21 requests, including attachment-based reference
  recipes. Neither selected a candidate or applied personality text.
- The initial October 14 [link experiment](MUSE_ONE_CLICK_VALIDATION.md)
  returned 8 options from 2 Mona Lisa requests without manual attachment. It
  transferred personality text but explicitly prohibited applying it.
- The [October 14 reliability matrix](MUSE_HANDOFF_RELIABILITY.md) separately tested
  the actual three-preset personality-application payload delivered by URL.
  Its completed 9 requests/36 options are not part of the older 84-output count.
  It retains the original active avatar and does not test current-costume
  selection or automatic activation.
- The [October 15 all-character record](MUSE_ALL_CHARACTER_HANDOFF.md) covers
  all-18 prefill checks and one new production-payload compatibility request
  per additional preset. One request per new costume is not a repeated
  stability rate. Barbie/SpongeBob explicitly ask to replace a previous
  no-emoji setting with sparing emoji; observed persistence is checked separately.

The native avatar entry point observed in earlier tests was the pencil beside
the profile avatar → **Change avatar**, which prefills “Change your avatar to…”
in the composer. The website shortcut instead opens a prepared combo message.
Neither Persa nor a JSON download provides a verified avatar import API or
synchronizes subsequent changes automatically.

Vercel migration to `persa.bubblai.com` was verified on October 10. The domain
has a separate saved collection from the previous
[Sites address](https://persa-muse-characters.archerx03.chatgpt.site); old saves
remain on that origin. See the [website status](../README.md#website-status--october-15-2026)
and [deployment notes](../README.md#vercel-deployment).

### CLI and connector route

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

The website's secondary **Copy Bot description** option uses Persa's `plain`
target for the selected personality. Paste that text into the Bot's Description
under Edit Profile, following [Create and manage Bots](https://docs.x.ai/grok-bot/bots)
(reviewed October 5, 2026). This is separate from the CLI Custom Agent target
and its configured 4,000-character budget. The website does not create a Bot,
generate a template link, or apply its Muse avatar to Grok.

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
