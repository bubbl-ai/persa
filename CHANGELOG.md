# Changelog

## Unreleased

- Muse character website (2026-10-05): add a public, mobile-friendly gallery
  pairing personalities with matching Muse avatar prompts for all 18 launch
  candidates. The final ten remain unselected. Twelve generated previews are
  included; six declined image requests retain an explicit unavailable state.
- Add four tone controls backed by the shared compiler, authored example
  replies, device-local saved combos, reset, JSON download, combined and
  individual prompt copying, and secondary Grok Bot description copying.
  Muse setup currently uses copy and paste; direct import and persistence
  remain unverified.
- Add static website build/preview scripts and Sites hosting configuration.
  Extract the shared `PersonaError` to keep browser compiler imports free of
  Node filesystem dependencies while preserving existing exports.
- Document the public website URL, repository structure, asset provenance,
  local setup, validation results, and pending integration work. Site access
  was changed from owner-only to public on 2026-10-05.
- `persa install <target>` prints what a person actually does to install a
  persona in one agent: the numbered steps in that product's own words,
  followed by the compiled text and how it measures against the limit.
- Targets now carry `steps` and `how` beside their limit and framing, so the
  instructions for an agent live with the agent rather than in prose.
- `createServer` accepts `{ load }` as well as a file path, so anything
  embedding Persa can serve a persona it holds itself.
- Documentation audit (2026-10-02): use the source install path while npm is
  unpublished; clarify MCP refresh behavior, YAML save limitations, compiler
  and loader APIs, test coverage, and HTTP/editor security limitations. Refresh
  agent setup notes against primary sources and distinguish configured budgets
  from verified product limits.

## 0.1.0 — initial repository version

The persona file, the compiler, six targets, the local editor, and the MCP
server. As of 2026-10-02, this version has no Git tag or GitHub release and
`persa` is not available from the public npm registry.
