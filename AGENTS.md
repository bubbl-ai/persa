# Working on Persa

## Product scope

- Muse is the primary product. Every website preset pairs a personality with a matching avatar prompt. Grok Bot personality copying is secondary.
- Avatar direction, approved October 6, 2026: one shared cream plush Muse-style base character, wearing a different costume for each named preset. Preserve its face, hood, material, color, and body proportions; express the preset through clothing, headwear, and props. This replaces the older individual-likeness direction. Do not invent a different base animal or human face per preset. If a costume preview cannot be produced, keep an explicit unavailable state rather than falling back to old likeness artwork.
- Website direction approved October 9, 2026: the spotlight stage is the homepage. Keep its presentation separate from the shared app state; `web/app.js` owns the catalog, personality controls, favorites, copy/download, and dialogs. The full grid and saved collection live at `/collection.html`; `/spotlight.html` redirects to the homepage. No character animation or audio is part of this version.
- Keep all 18 candidates available until the user selects the launch ten. `launchSelection` is metadata, not a gallery filter.
- Describe Muse setup honestly: users copy and paste instructions, then choose and select a generated avatar in Muse. The earlier desktop tests covered the previous likeness prompts, not this costume collection. Shared reference artwork does not guarantee identical independent Muse generations. Do not retry safety-refused image requests through another service; preserve the history when a user requests a materially different design. Saved personality summaries can retain stale settings when the new prompt omits a preference. Direct import and mobile setup remain unverified. See `docs/MUSE_AVATAR_DESIGN.md`, `docs/MUSE_VALIDATION.md`, and `docs/MUSE_BATCH_VALIDATION.md` for scope and limits.
- Preserve the existing CLI/library and MCP interfaces when changing the website.

## Repository map

- `src/`: shared compiler, persona adapters, CLI, local editor, and MCP server.
- `web/`: static website and committed avatar assets.
- `characters/catalog.js`: personalities and authored sample replies; `characters/avatar-design.js`: the versioned shared base, costumes, and Muse avatar prompts.
- `characters/image-generation.json`: original art prompts and generation outcomes. Preserve refusal history and superseded attempts. Active costume replacements must identify the same preset, shared base, and design version as the catalog. `characters/avatar-design-generation.json` records the shared reference's provenance.
- `scripts/`: website build and local preview.
- `test/`: Node test suite. `dist/` is generated and must stay untracked.

## Development and verification

Use Node 20 or newer and `npm ci`. For website work, run `npm run build:web`, `node --check web/app.js`, `node --check web/spotlight.js`, and `npm run preview:web`; the preview is at `http://127.0.0.1:4173` and needs a rebuild after changes.

Run `npm test` when compiler, build, or other tested behavior changes. Add focused regression tests for actual failure modes. Check affected browser flows at desktop and mobile widths, including missing or failed images when touching avatar rendering. Run `git diff --check` before committing. The existing CI primarily covers the Node suite and package installation; report browser checks separately.

## Implementation rules

- Reuse the compiler in the browser; do not duplicate trait-to-prompt logic. Keep its imports free of Node-only dependencies.
- Examples are authored samples, not live model responses. Saved combos are browser-local; downloads do not imply import or cloud sync.
- Keep art files inside `web/avatars/` and provenance in the character manifest. Never claim a failed generation produced an image or relabel an unrelated preview as the requested likeness.
- Validate asset references during the build and handle image failures in the UI. Preserve character access and prompt copying even when a preview is unavailable.
- Keep changes scoped, preserve dependency versions unless needed, and never commit credentials or generated deployment archives.

## Documentation and publishing

Update `README.md`, `CHANGELOG.md`, and relevant setup/contributor notes when behavior changes. Clearly separate implemented features from remaining work and record meaningful checks with their limits.

Production is `https://persa.bubblai.com`, verified live on Vercel October 10, 2026. `.github/workflows/deploy.yml` deploys every push to `main` and supports manual dispatch. It uses the repository's `VERCEL_TOKEN` secret with the configured team `team_vxb6Ht1oOuDB78rW3TuLsNTs` and project `prj_LjXOUGH8w5JS1WgD2LGPVYEnyDQa` (scope `tonyhaoyu2000-2063s-projects`, project `persa`). Reuse this workflow and project; the local CLI's default account may be unrelated. Team and hostname setup are complete, so do not ask to select them again.

`vercel.json` builds with `npm ci` and `npm run build:web`, then serves only `dist/`. The deployment workflow pulls production settings, runs `vercel build --prod`, and uploads `.vercel/output` with `vercel deploy --prebuilt --prod`. `.vercelignore` applies to source uploads, not this prebuilt workflow. Check both deployment and test workflow results after pushing; they run independently. Never print or commit deployment credentials. Use the exact Vercel DNS records and scope any future DNS change to this subdomain.

Preserve `.openai/hosting.json` as the previous Sites deployment's identity and history; do not republish, redirect, or delete that Site during routine Vercel work. Saved combos are origin-specific and do not transfer automatically between domains. Record actual deployment results and keep the live canonical URL separate from historical Sites records.
