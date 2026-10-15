# Persa

[![tests](https://github.com/bubbl-ai/persa/actions/workflows/ci.yml/badge.svg)](https://github.com/bubbl-ai/persa/actions/workflows/ci.yml)

**A personality layer for personal agents.** Write down how you want an agent to talk to you — once — and install it into Muse, Grok, Instinct, Claude, ChatGPT, or anything else with a text box.

**Try the Muse character website:** [persa.bubblai.com](https://persa.bubblai.com). The spotlight homepage is public on Vercel under Bubbl's domain: anyone with the link can view it. Each character pairs a personality with a matching avatar prompt. All 18 characters have a direct **Open in Muse** link; the [all-character handoff report](docs/MUSE_ALL_CHARACTER_HANDOFF.md) records validation, known avatar-quality limitations and deployment status. One click takes the chosen combo from Persa to a prepared Muse message. Users still press Send and choose an avatar in Muse.

Personal agents in 2026 are good at doing things and bad at sounding like anything. Most ship one house voice; the ones that let you change it make you write a system prompt from scratch, per agent, and rewrite it when you change your mind. Persa makes the personality a small file you own, and handles the rest.

```
$ node src/cli.js init
$ node src/cli.js edit            # sliders in a browser, live preview
$ node src/cli.js install grok    # the steps for that agent, and the text
$ node src/cli.js serve           # or let MCP-capable agents just read it
```

These commands run from a source checkout; see [Install](#install). The repository version is `0.1.0`, with further changes listed under [Unreleased](CHANGELOG.md). As of October 2, 2026, there is no published `persa` package on npm or tagged GitHub release.

## Current product focus

**Direction updated October 6, 2026: Meta Muse remains Persa's primary focus. Every preset dresses one shared Muse-style plush character in a different costume and pairs it with a personality layer.** Grok Bot personality compatibility is secondary.

### Default Muse character combos

- Each preset is one complete character combo: **personality layer + Muse avatar**. The personality defines the character's voice, tone, response style, and behavioral preferences; the avatar gives that same character its visual identity.
- The supplied people and characters below define the candidate pool for the first batch of default Muse combos. Each selected character gets both a personality and a matching avatar prompt.
- The visual direction is one cream plush Muse-style base with the same face, hood, and body proportions throughout the collection. Clothing, headwear, and props express each named character. See the [avatar design contract](docs/MUSE_AVATAR_DESIGN.md).
- Every preset has a direct **Open in Muse** link on the stage, tile and personality detail dialog. The primary action skips setup instructions; **Setup options** retains copying, downloads and help when needed. The user presses **Send** in Muse, reviews the options and clicks **Select**. See the [all-character implementation and release record](docs/MUSE_ALL_CHARACTER_HANDOFF.md); automatic combo installation is not implemented.
- Users browse and choose the combo as a single preset. Personality instructions and avatar prompts may require different technical steps to apply, but both belong to the selected Muse character.

The shortest flow is: choose a character → **Open in Muse** → press Send → choose an avatar and click Select. Previewing examples, tuning the voice and opening setup instructions are optional. Direct links carry the current draft or saved tone settings. Users can save combos in the current browser, and Grok Bot reuses the personality as a secondary copy option. The message explicitly asks Muse to replace the prior character's voice, tone and emoji settings while preserving unrelated preferences. Barbie and SpongeBob explicitly allow sparing emoji instead of inheriting an old no-emoji preference. Requests and observed persistence are distinct; see the [current handoff report](docs/MUSE_ALL_CHARACTER_HANDOFF.md) and [historical batch validation](docs/MUSE_BATCH_VALIDATION.md).

A separate October 12 [prompt-engineering experiment](docs/MUSE_PROMPT_ENGINEERING.md)
captured and reviewed 84 options from 21 requests. Uploading the shared base
with experimental prompts improved visible face/hood/material similarity, but
hand, clothing and proportion variation remained. That experiment included
text-only screens and attached-reference requests. The October 14 shortcut adapted three preferred recipes to a
downloaded workspace reference; their default messages remain unchanged.
The other 15 now use their authored catalog costumes with a shared preservation
recipe, tested separately. Neither old results nor website availability
establish stable fixed-character dressing or identical gallery previews.

### First default Muse batch: candidate roster

**Keep all 18 supplied candidates; choose 10 default Muse combos for launch later.** The launch selection has not been made. Every selected preset includes both components.

| Group | Candidates |
| --- | --- |
| Public figures (11) | Mark Zuckerberg; Taylor Swift; Charlie Chaplin; Michael Jackson; Olivia Rodrigo; Marilyn Monroe; Drake; Lionel Messi; Kylie Jenner; MrBeast; Dwayne “The Rock” Johnson |
| Fictional and art characters (7) | Mona Lisa; Barbie; Wednesday Addams; Harry Potter; SpongeBob; Hello Kitty; The Joker |

### Integration questions to validate

Primary-source review and earlier desktop tests: October 5, 2026. Native avatar-generation repeat evidence: October 12, 2026 (Asia/Taipei). Link handoff experiment: October 14, 2026 (Asia/Shanghai).

- **Muse avatars:** Meta describes reference-media-driven avatars, but cautions that its research examples do not all represent avatars available in the Muse app. The earlier desktop Mona Lisa test verified prompt-based avatar generation and selection. On October 14, actual clicked `https://muse.ai/?prompt=…` links prefilled two test messages; sending each returned four native avatar candidates without manual image upload. The first required recovery from a rejected `/tmp` reference path. The revised workspace-first request succeeded with one visible generation event after the temporary connector was removed. User-facing activity showed the verified image passed as the native reference; this is not an independent guarantee of backend conditioning. The link is observed signed-in desktop behavior, not a documented integration contract. No public avatar-import API or actual mobile workflow has been verified. See the [handoff report](docs/MUSE_ONE_CLICK_VALIDATION.md), [Bringing Your Muse to Life](https://research.meta.ai/blog/bringing-your-muse-to-life), and the [earlier test record](docs/MUSE_VALIDATION.md).
- **Muse combo behavior:** The [initial Mona Lisa test](docs/MUSE_VALIDATION.md) and [batch validation](docs/MUSE_BATCH_VALIDATION.md) verified avatar activation/persistence for 13 older likeness-based combos. The [October 14 repeat matrix](docs/MUSE_HANDOFF_RELIABILITY.md) covers three current costumes; the [October 15 record](docs/MUSE_ALL_CHARACTER_HANDOFF.md) separately tracks compatibility for the additional 15. Sequential preset replacement can retain omitted preferences, so the wrapper explicitly replaces the authored voice/emoji settings. Fresh side chats share account context. Automatic application, current-costume selection/persistence, removal and synchronization remain unverified.
- **Secondary Grok Bot compatibility:** Official guidance puts durable preferences in the Bot's Description and supports sharing an existing Bot through a template link. Recipients review it and add their own copy in Grok Bot. This is a possible personality distribution path; generating those templates directly from Persa has not been verified. The existing `grok` compiler target describes a different Custom Agent flow, so its 4,000-character budget is not a verified Grok Bot limit. See [Create and manage Bots](https://docs.x.ai/grok-bot/bots) and [Templates for Grok Bot](https://x.ai/bot/guides/templates-for-grok-bot).

### Website status — October 15, 2026

The website implementation lives in [`web/`](web/), with paired character definitions in [`characters/catalog.js`](characters/catalog.js). The homepage at `/` has a white, borderless spotlight stage with the featured personality's three adjectives beneath the portrait. The stage has direct **Open in Muse**, **Tune personality**, save and optional **Setup options** controls. All 18 character tiles appear below the spotlight with their own direct Muse links; **All characters** scrolls to that grid. The standalone grid remains at `/collection.html`, and saved combos are available at `/collection.html?view=saved`. The old `/spotlight.html` demo link redirects to the homepage.

Sites version **6** was published successfully on October 9, 2026 (Asia/Taipei), from source commit `f5de98c1c43fdfdfeff9e14b69106ece6c2a7517`, with the existing public audience unchanged. The costume artwork first shipped in version 4; version 6 makes the approved stage the homepage and connects the existing combo controls. See the [publication record](docs/MUSE_AVATAR_DESIGN.md#publication-status).

Vercel production at **[persa.bubblai.com](https://persa.bubblai.com)** was verified on October 10. The [first successful auto-deploy run](https://github.com/bubbl-ai/persa/actions/runs/38014634795) deployed source `1e6fc0f2622aefe8bc38a78cefbcbb9bd69ef057`. Public HTTPS, all 18 previews, prompt copying, saving, and desktop/mobile browsing passed live checks. Pushes to `main` now deploy through GitHub Actions. See [Vercel deployment](#vercel-deployment).

The [initial October 14 link experiment](docs/MUSE_ONE_CLICK_VALIDATION.md)
transferred personality text without applying it and returned eight candidates
from two Mona Lisa requests. The subsequent implementation adds the shortcut
for Mona Lisa, Taylor Swift and Mark Zuckerberg, using the actual personality
application payload and a shared reference downloaded inside Muse's workspace.
The [three-preset reliability report](docs/MUSE_HANDOFF_RELIABILITY.md) retains
the native repeats and verified October 14 release. The October 15 user-requested
expansion covers all 18 presets and removes the setup dialog from the primary
route; see [its separate validation and release record](docs/MUSE_ALL_CHARACTER_HANDOFF.md).
The link does not send the message or activate an avatar automatically, and
these experiments have separate counts.

| Area | Current behavior |
| --- | --- |
| Spotlight homepage | Browse all 18 costumes on a white, borderless stage with a sliding center portrait, subtle spotlight, and the selected preset's three personality adjectives. Use the selected combo, tune its personality, or save it. Supports next/previous, mobile swipe, keyboard navigation, direct selection, and reduced motion. It reuses static artwork; there is no character animation or audio. |
| Full collection | All 18 tiles appear below the homepage spotlight and remain available at `/collection.html`. Stage and grid share dialogs, personality settings, and saved state; saving preserves the stage selection and the originating control's focus. A single plush Muse base wears a distinct character-inspired costume for each preset. The launch ten have not been selected. |
| Combo preview | Matching avatar, character description, traits, and three authored example replies. Examples illustrate the original preset; they are not live model responses and do not change with the sliders. |
| Tone controls | Warmth, humor, directness, and response length update the compiled personality instructions immediately. Reset restores that character's defaults. |
| My collection | Saves favorites and voice settings in this browser's `localStorage`, separately for each website origin. A new domain starts with an empty collection; previous saves remain on the old domain. There is no account or cross-device sync; clearing browser storage removes them. |
| Muse setup | Every character has a direct **Open in Muse** link from the stage, tile and detail dialog, carrying the current compiled personality and a reference-based avatar request. No setup dialog is required. Users press **Send** and later choose an option and click **Select**. **Setup options** keeps complete-combo copy, separate component copying and help available. Native mobile and completed-login handoff are unverified; generated figures can differ from previews. |
| Download | Optional setup controls export the persona, compiled personality, costume/base metadata, legacy text-only avatar prompt and complete combo as JSON. Every catalog preset includes `museHandoff` with the exact message, URL, version and reference metadata. There is no JSON import or restore control yet. |
| Grok Bot | Secondary option to copy personality text for a Bot's Description. It uses the `plain` compiler target, independently of the CLI's older `grok` Custom Agent target. |

The October 6 collection uses one shared reference image and separate costume edits. The shortcut reuses that base, the three original tested recipes and a shared preservation recipe for the other 15 authored costumes; it does not replace legacy catalog avatar prompts. Complete-combo copy, link, displayed instructions and export use one shared builder. The separate text-only avatar control omits the image reference and is labeled accordingly. Artwork, personality definitions, character IDs, favorites and saved tone settings are preserved.

The October 10 homepage layout update changes no avatar assets or prompts. Current art-generation and Muse prompts explicitly exclude human hair, so costume-specific hairstyles are still absent; this layout update does not address that artwork limitation. See the [design contract](docs/MUSE_AVATAR_DESIGN.md#shared-design).

The image manifest retains earlier likeness attempts, refusals, and rejected unrelated substitutes as history. Current costume art uses versioned paths and matching preset/base metadata. A missing costume stays explicitly unavailable; the build never silently falls back to an old human or franchise-shaped avatar. Gallery artwork illustrates an intended appearance, not an avatar already installed in Muse.

If an image request fails in the browser, the stage, grid, and character dialog show a readable error state. **Tune personality** or a character tile opens the character dialog, where **Retry image** retries its preview, the stage image, and its homepage tile. Reopening the character also retries the dialog image. Personality tuning and copying remain available while the image is unavailable.

The remaining product work is to choose the launch ten, improve fixed-character stability, expand repeated native coverage beyond the original three presets, and test mobile Muse and completed-login transfer. The link enters the account's existing Main chat; shared account and conversation context affect the evidence. Automatic combo activation, current-costume selection/persistence and removal remain outside this handoff matrix. Persa does not connect to a Muse account API or synchronize later changes. See the [current validation and release status](docs/MUSE_ALL_CHARACTER_HANDOFF.md), [historical transfer limits](docs/MUSE_ONE_CLICK_VALIDATION.md), and [design scope](docs/MUSE_AVATAR_DESIGN.md).

### Run the website

```bash
npm ci
npm run build:web
npm run preview:web
# Open http://127.0.0.1:4173
```

Run these commands from the repository root with Node 20 or newer. The preview server binds to `127.0.0.1:4173` and serves the last build; rebuild after source changes. Opening `web/index.html` directly does not supply the generated catalog or shared compiler files.

### Vercel deployment

The [`Deploy to Vercel` workflow](.github/workflows/deploy.yml) publishes this
repository on every push to `main`, and can also be dispatched manually from
GitHub Actions. The configured Vercel scope is `tonyhaoyu2000-2063s-projects`,
with project `persa`:

| Hosting identifier | Value |
| --- | --- |
| Production URL | `https://persa.bubblai.com` |
| Vercel team ID | `team_vxb6Ht1oOuDB78rW3TuLsNTs` |
| Vercel project ID | `prj_LjXOUGH8w5JS1WgD2LGPVYEnyDQa` |
| GitHub repository secret | `VERCEL_TOKEN` |

The workflow uses Node 24 and the repository root. The versioned
[`vercel.json`](vercel.json) provides these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Other (`null`) |
| Install command | `npm ci` |
| Build command | `npm run build:web` |
| Output directory | `dist` |
| Application environment variables | None required |

The app is a static website; `npm start` runs the CLI and is not the hosting
command. Keep the `.html` routes and standard static-file routing. No SPA
catch-all rewrite is needed. [Vercel configuration reference](https://vercel.com/docs/project-configuration/vercel-json).

GitHub Actions authenticates with the repository secret, pulls production
settings, runs `vercel build --prod`, then uploads the build with
`vercel deploy --prebuilt --prod`. Contributors do not need a local Vercel login
or a Vercel team seat to trigger this workflow by pushing to `main`. This does
not grant them Vercel dashboard access. The workflow serializes production
deployments without canceling an in-progress run. Check its result after a push;
the `tests` workflow runs separately and does not gate deployment.

`.vercelignore` limits ordinary CLI source uploads. The Actions workflow uploads
prebuilt output instead, so it does not depend on that source allowlist. Keep the
token in GitHub secrets and preserve the configured project identifiers. A local
CLI account that only shows `Invisible Product Inc` is a different scope and
should not be used to create a replacement project.

Cloudflare DNS for `persa.bubblai.com` resolves through the CNAME
`ba15cd8cbd77e8a6.vercel-dns-017.com`. Public HTTPS was verified with a trusted
certificate and no login requirement. Keep any future DNS changes scoped to
`persa` and use the current values returned by this Vercel project.
[Vercel custom-domain guide](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

The new domain has a separate saved collection. Favorites and tone settings
on the ChatGPT Sites origin do not transfer automatically. JSON downloads
remain available for reference, but there is no JSON import/restore control.
The previous Sites deployment is retained as history. The migration did not
retire or redirect that address.

### How the website fits the repository

| Location | Responsibility |
| --- | --- |
| [`characters/catalog.js`](characters/catalog.js) | Character identity, persona definitions, matching Muse avatar prompt, preview path, and authored sample replies. `launchSelection` is empty; it records a future selection and does not filter the current gallery. |
| [`characters/avatar-design.js`](characters/avatar-design.js) | Versioned shared Muse base, 18 costume descriptions, and paired Muse avatar prompts. |
| [`src/muse-handoff.js`](src/muse-handoff.js) | Browser-safe prepared-message builder for all 18 named presets, using the existing Muse compiler and fixed public reference URL/checksum. Original three default payloads remain unchanged; the other 15 use authored catalog costumes. One payload supplies direct links, complete-combo copying, displayed instructions and export. |
| [`characters/image-generation.json`](characters/image-generation.json) | Exact art prompts, output paths, and historical outcomes. Active costume replacements use `kind: "muse-costume"` with matching `subjectId`, `baseId`, and `designVersion`; earlier attempts are preserved. |
| [`characters/avatar-design-generation.json`](characters/avatar-design-generation.json) | Shared reference image provenance and exact generation prompt. |
| [`web/avatars/`](web/avatars/) | Current costume PNG previews and historical source art. The build ships only currently referenced images and their shared base. |
| [`web/app.js`](web/app.js), [`web/styles.css`](web/styles.css), [`web/index.html`](web/index.html) | Static browser app, responsive layout, dialogs, local saving, clipboard actions, and downloads. |
| [`web/spotlight.js`](web/spotlight.js), [`web/spotlight.css`](web/spotlight.css) | Homepage stage controller and styles scoped away from shared dialogs. Receives catalog/favorites from `app.js`; initially prepares only the center stage image and its neighbors. The inline grid independently lazy-loads its previews. Saving keeps the selected stage character and focus. |
| [`web/collection.html`](web/collection.html), [`web/spotlight.html`](web/spotlight.html) | Full/saved collection entry point and redirect for the former demo URL. Both active views use the same app, compiler, and storage key. |
| [`scripts/build-web.js`](scripts/build-web.js), [`scripts/avatar-assets.js`](scripts/avatar-assets.js) | Validate character and image IDs, replacement subjects, shared-base/design IDs, statuses, persona data, asset/preview path agreement, PNG headers and dimensions, and launch IDs; compile the Muse prompts; rebuild `dist/` with the app, catalog, and shared compiler. Missing or invalid declared images fail the build; retired assets are removed from the output. |
| [`src/compile.js`](src/compile.js), [`src/traits.js`](src/traits.js), [`src/targets.js`](src/targets.js), [`src/errors.js`](src/errors.js) | Shared personality compiler used by both the website and CLI. Extracting `PersonaError` avoids pulling Node filesystem code into the browser; `src/persona.js` still re-exports it for existing callers. |
| [`scripts/preview-web.js`](scripts/preview-web.js) | Local static preview server. |
| [`vercel.json`](vercel.json), [`.vercelignore`](.vercelignore) | Vercel static build/output settings and an allowlist for CLI source uploads. |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Production auto-deploy from `main` using a repository secret and prebuilt output. |
| [`.openai/hosting.json`](.openai/hosting.json) | Existing Sites project identity and `dist/` hosting configuration. Site access is managed separately in Sites. |

The website has no application backend, model calls, or application API-key requirement. The existing CLI editor and MCP server remain separate tools. Generated `dist/` output is ignored by Git; the npm package still distributes the CLI/library rather than the website source. GitHub Actions builds for Vercel using `vercel.json` and deploys with the repository's hosting token. The previous Sites deployment used its own publication workflow.

### Website verification

The October 15 all-character/direct-link implementation passed **82 Node tests**
and the website build. Native prefill checks for all 18 and one compatibility
request for each of the new 15 are recorded separately in the
[all-character report](docs/MUSE_ALL_CHARACTER_HANDOFF.md), along with current
browser QA, baseline restoration and deployment status. One request per new
preset does not establish repeated stability.

The October 14 handoff implementation passed **78/78 Node tests**, the build,
syntax/whitespace checks and **33/33 isolated browser checks**. Browser checks
covered all 18 supported/fallback flows, current and saved tone, link/copy/export
agreement, clipboard failure, keyboard/focus behavior and 1440/390/320px layouts.
Muse navigations in those UI checks were intercepted locally; they are not
native integration or real mobile tests. The [reliability report](docs/MUSE_HANDOFF_RELIABILITY.md)
records the separate native matrix, account restoration and deployment status.

The October 14 native handoff matrix completed **9/9 requests** across its three
presets, with a median wait of about **88 seconds**. All **36/36 candidates**
met the practical visible-identity and usability criteria; all nine saved-style
checks passed after reload. This small single-account result supports the
limited guided trial, not guaranteed future success or stable full figures.
Hands, clothing and proportions varied; two Mark laptops opened, native
thumbs-up reactions remained despite saved no-emoji settings, and one memory
history edit recovered automatically. See the [full findings and release status](docs/MUSE_HANDOFF_RELIABILITY.md).

The October 12 [prompt-engineering follow-up](docs/MUSE_PROMPT_ENGINEERING.md)
kept three screens (12 options), nine original reference confirmations
(36 options) and nine revised confirmations (36 options) separate. All 84
outputs were reviewed. Revised wording improved dress coverage, but hand/hood
variation remains; obscured bodies were not inferred from clothing. No avatar
was selected. That experiment changed no active prompts, artwork or website behavior.

The October 12 native Muse check used three unchanged avatar-only prompts in three fresh side chats each, in one existing desktop account: 9 requests and 36 captured/reviewed options. Every request returned recognizable plush-family/costume candidates, but fixed face/body identity varied and all 36 backgrounds missed the requested lilac. A separate reference-image probe returned 4 options from 1 request. Neither test selected an avatar or submitted personality text; no new activation/persistence evidence follows. These checks changed no website code, prompts or art. See the [native avatar validation](docs/MUSE_NATIVE_AVATAR_VALIDATION.md).

The October 10 white-stage and inline-collection update passed all 72 tests, the website build, JavaScript syntax checks, and whitespace checks. Browser checks covered all 18 stage captions, all 18 tile images and 54 visible tile adjectives at 1440/390/320px, the same-page collection link, synchronized stage/tile saves without replacing tile nodes or moving focus, tile tuning/copying and saved-tone reload, and image recovery in the stage, tile, and dialog. The earlier homepage flow checks were also rerun successfully, including 54 prompt-copy actions, JSON export, saved-collection removal, clipboard fallback, reduced motion, mobile swipes, and catalog retry. No horizontal overflow or browser page errors were observed. These are Persa checks, not a new Muse integration test; production uses the existing main-branch Vercel workflow.

The October 10 Vercel verification checked the public HTTPS domain against the
repository's deployed HTML, JavaScript, and CSS. All 18 stage images decoded,
the combined prompt copied successfully over HTTPS, favorites survived reload,
the full/saved grids worked, and the old demo route redirected to `/`. Desktop
and 390/320px mobile checks passed, including swipes and dialogs, with no browser
page errors. The first auto-deploy run and the separate Node/packaging CI run
both succeeded. This was a hosting verification, not a new Muse integration test.

The October 9 homepage integration passed all 72 tests, the build, JavaScript syntax checks, and whitespace checks. Browser checks covered 54 prompt-copy actions across all 18 stage characters, adjusted-tone persistence and JSON export, independent drafts/reset, focus and stage selection after saving, removing the last favorite, the old demo redirect, help, clipboard denial, reduced motion, rapid navigation, image retry, catalog retry, and 390/320px layouts with touch swiping. The app makes one catalog request and initially loads three stage images. These checks cover Persa, not native Muse behavior.

The October 7 spotlight demo passed browser checks for all 18 images, next/previous wraparound, quick repeated navigation, direct selection, keyboard controls, actual touch swipes at 390px and 320px, vertical scrolling without changing characters, reduced motion, image failures, catalog retry, and the existing gallery. The demo initially loads three images. Build, JavaScript syntax, and whitespace checks passed. No new Muse integration test was performed.

The October 6 costume update passed all 72 tests, the website build, JavaScript syntax checks, and `git diff --check`. Browser checks rendered all 18 new previews and verified 54 clipboard actions, JSON export, saved tone settings, reset, unavailable images, retry recovery, and 1440/390/320px layouts. All 18 images were visually reviewed against the shared base and wardrobe. See the [costume verification record](docs/MUSE_AVATAR_DESIGN.md#verification--october-6-2026). At that release, the new prompts had not yet been tested inside Muse; the limited October 12 native results are recorded above.

The October 5 build passed `npm run build:web`, `node --check web/app.js`, all 61 existing tests via `npm test`, and `git diff --check`. Browser checks passed for all 18 cards, all 12 available images, unavailable previews, live prompt tuning, save/reload/reset, both combined and avatar-only clipboard actions, JSON download, the empty saved collection, and Escape-to-close behavior. Layouts were checked at 1440, 390, and 320 pixels without horizontal overflow or browser page errors.

Those browser checks were run with a temporary Playwright harness outside the repository. They are a recorded validation of this build, not a committed browser test suite or CI job. They do not establish end-to-end Muse integration.

The avatar repair adds seven committed regression tests in [`test/avatar-assets.test.js`](test/avatar-assets.test.js) for named avatar prompts, shipped asset references, replacement provenance, declined requests, malformed manifests, unsafe or mismatched paths, invalid/missing PNGs, and rejection of unrelated substitutes. That repair brought the suite to 68 tests. The costume design adds four regression tests for the shared base, versioned provenance, and preventing fallback to retired likenesses, bringing the suite to 72 passing tests. Browser validation also covers narrow mobile layouts, simulated image-request failure, copying while an image is unavailable, and recovery in both the dialog and gallery through **Retry image**. Image loading tests alone do not verify the design; artwork also needs visual review for a consistent base and the requested costume.

Separate [initial](docs/MUSE_VALIDATION.md) and [batch](docs/MUSE_BATCH_VALIDATION.md) signed-in Muse tests on October 5 (UTC) verified avatar selection and persistence for 13 previous likeness-based combos in desktop Chrome. All 18 default combo and personality-only clipboard outputs matched the repository. The batch report records saved-style checks, stale-setting failures, visual caveats, and the five avatars that were not retried. These are historical manual integration results from one account. They do not validate the new costume prompts or guarantee perfect personality adherence.

---

## The idea in one screen

A persona is a short YAML file:

```yaml
persa: 1
name: Sable
tagline: a dry chief of staff who tells me the thing I don't want to hear

voice:            # 0–100. Anything near 50 is neutral and costs nothing.
  warmth: 25
  verbosity: 15
  directness: 90
  challenge: 80

style:
  emoji: never
  greeting: no greeting — open with the answer

rules:
  always:
    - Lead with the decision, then the reasoning.
  never:
    - Never use corporate filler — "leverage", "circle back", "reach out".

boundaries:
  - Ask me before sending anything to another person.
```

Persa compiles it into the prompt each agent actually wants:

```
You are Sable — a dry chief of staff who tells me the thing I don't want to hear.
Hold this voice in every reply, including one-line ones, unless I explicitly ask you to drop it.

## Boundaries — these override everything else
- Ask me before sending anything to another person.

## Voice
- Keep a cool, professional distance. Acknowledge how something lands, briefly, then move on.
- Be brief. Lead with the answer; add detail only if I ask for it.
- Be blunt. Skip the cushioning entirely, even when the answer isn't one I want.
- Push back when I'm wrong. Say so plainly and explain why.
- Never use emoji.
- How you open a conversation: no greeting — open with the answer.

## Always
- Lead with the decision, then the reasoning.

## Never
- Never use corporate filler — "leverage", "circle back", "reach out".
```

Two things make this more than a text file you could have written yourself.

**Sliders near the middle compile to nothing.** A persona that only cares about bluntness produces a prompt about bluntness. Most hand-written system prompts spend half their length telling the model to be averagely normal about traits nobody thought about, which dilutes the parts that matter.

**Every line has a priority, so character budgets degrade gracefully.** Persa budgets 4,000 characters for Grok and 1,200 for an Instinct message; see the [verification notes](docs/INSTALL.md) for which limits are confirmed. When the text has to shrink, Persa drops examples first, then wording notes, then the "always" list, then "never", then voice instructions. `check` lists the removed sections and counts; `render` warns on stderr, and the library returns the removed lines in `stats.removed`. Your identity line and your `boundaries` are the last things standing: they are only ever lost if the budget is too small to hold them at all, and then `check` prints `CUT` and `render` warns on stderr.

```
$ persa check
Sable — /Users/you/persona.yaml
  "a dry chief of staff who tells me the thing I don't want to hear"

  ok   Grok — Custom Agent            1208 / 4000 chars
  ok   Meta Muse                             1334 chars
  trim Instinct — text message        1151 / 1200 chars
       dropped 1 from examples, 1 from wording
  ok   Claude — Project instructions         1208 chars
  ok   ChatGPT — Custom instructions  1208 / 1500 chars
  ok   Plain text — any agent                1196 chars
```

---

## Install

Node 20 or newer. The CLI/library has no build step and two dependencies. The website uses the separate build command above.

Install from the repository until an npm release is available:

```bash
git clone https://github.com/bubbl-ai/persa
cd persa
npm ci
npm test
node src/cli.js init --preset chief-of-staff
node src/cli.js edit
```

The remaining examples use the `persa` command. To put this checkout on your PATH:

```bash
npm link
```

Or replace `persa` with `node src/cli.js` while working in the checkout.

`persa edit` serves a page at `http://127.0.0.1:4747` and prints the URL for you to open — a slider per trait, and a live preview per agent. The editor makes no outbound requests: the page talks to the local process, and the process reads and writes one file. Saving preserves comments and unknown keys in most of the document, but rebuilds example entries; comments and extra keys inside those entries are lost. See [save behavior](docs/SPEC.md) and [Security](SECURITY.md).

![the editor](https://raw.githubusercontent.com/bubbl-ai/persa/main/docs/editor.png)

---

## Getting it into an agent

There are two ways in, and which one you get depends on the agent.

### 1. MCP — the agent reads it itself

If the agent speaks MCP, it can fetch the persona from Persa. Run:

```bash
persa serve                       # stdio, for local clients
persa serve --http --port 8787    # a URL, for hosted agents
```

The server puts the personality in three places, because different clients pick up different things:

| surface | what it is |
| --- | --- |
| `instructions` on initialize | clients that honour it apply the personality with no tool call at all |
| the `get_personality` tool | asks the agent to fetch the persona at the start of a conversation; the client decides whether to call it |
| `persona://current`, `persona://source`, and a `personality` prompt | for clients that surface resources and prompts to the user |

The tool, resource reads and prompt requests re-read the persona file. Editing it — or hitting Save in the editor — reaches those surfaces on their next call, with no server restart. A new chat message does not itself trigger a fetch; ask the agent to call `get_personality` again after a change.

The exception is `instructions`, which MCP sends during the initialize handshake. A client that only reads `instructions` keeps the personality it initialized with until it reinitializes. This applies to both stdio and HTTP: HTTP creates a fresh server for each request, but ordinary requests do not resend initialization instructions.

For **Claude Desktop**, add to your local MCP config:

```json
{ "mcpServers": { "persa": { "command": "persa", "args": ["serve", "/absolute/path/to/persona.yaml"] } } }
```

For **Claude Code**, use the setup command in [docs/INSTALL.md](docs/INSTALL.md). Clients may truncate initialization instructions; Claude Code documents a default 2,048-character cap that Persa's `check` does not cover. Calling `get_personality` retrieves the full compiled text.

For **Meta Muse**, try asking it to create a Custom Connector for a publicly reachable Persa `/mcp` URL and verify that `get_personality` returns your persona. Automatic MCP compatibility and skill creation have not been verified; see [docs/INSTALL.md](docs/INSTALL.md) for current sources and hosting requirements.

### 2. Paste — for everything else

Grok, Instinct and most consumer agents have a settings field or a chat box, not a connector list.

```bash
persa render --target grok        # → your agent's instruction field, if available
persa render --target instinct    # → text it to Instinct as one message
persa render --target chatgpt     # → Settings → Personalization
persa render --target plain       # → any box at all
```

Or use the **Copy** button in `persa edit`, which shows you the exact text, the character count against that agent's limit, and where it goes.

`--target instinct` is framed as a message from you ("Here's how I want you to talk and behave with me from now on…") rather than a system prompt, because that is how a messaging-native agent receives it.

Full per-agent notes, including what each product currently supports: **[docs/INSTALL.md](docs/INSTALL.md)**.

---

## The trait vocabulary

Seven scales. Each has five bands; the middle band is empty on purpose.

| trait | 0 | 100 |
| --- | --- | --- |
| `warmth` | clinical | warm |
| `formality` | casual | formal |
| `humor` | serious | playful |
| `verbosity` | terse | expansive |
| `directness` | diplomatic | blunt |
| `energy` | calm | enthusiastic |
| `challenge` | agreeable | challenging |

Every sentence a trait can produce lives in [`src/traits.js`](src/traits.js), in plain English. If a phrasing doesn't land for you, edit it there; that is the intended way to extend Persa.

Four presets to start from: `chief-of-staff`, `warm-friend`, `coach`, `butler`. See them with `persa presets`.

---

## Commands

| | |
| --- | --- |
| `persa init [file] [--preset <name>] [--out <file>] [--global] [--force]` | create a persona file; `--force` overwrites an existing file |
| `persa edit [file] [--port 4747]` | start the editor and print its URL |
| `persa render [file] [--target <id>] [--out <file>]` | print the personality for one agent; defaults to `plain` |
| `persa install <target> [file]` | the steps for one agent, then the text |
| `persa check [file]` | validate, and show the fit for every agent |
| `persa serve [file] [--http [--port 8787] [--host 127.0.0.1]]` | run the MCP server; port and host require HTTP |
| `persa presets` | list the starting points |
| `persa where [file]` | print the resolved persona path |
| `persa help` / `persa --version` | show usage / the version |

A persona file is found automatically: `./persona.yaml`, `./persona.yml`, `./.persa.yaml`, then `~/.persa/persona.yaml`. `persa init --global` writes the last one, which is usually what you want for a personality that follows you across projects.

`init --global` cannot be combined with a file path or `--out`. The short flags are `-t` for `--target`, `-o` for `--out`, and `-p` for `--port`. CLI ports must be 1–65535. `check` returns a nonzero exit status for invalid input, but trimming and `CUT` are reports, not exit failures.

Persa is also a library:

```js
import { loadPersona, compile } from 'persa';
const { persona } = await loadPersona();
const { text, stats } = compile(persona, 'grok');
```

---

## What Persa deliberately isn't

- **Not a memory system.** It carries voice and rules, not facts about you. The agents already have somewhere to put those.
- **Not a jailbreak.** `boundaries` are constraints you add on top of an agent's own rules; nothing here removes them.
- **Not a runtime.** Persa never sits between you and the agent, never sees your conversations, and never needs an API key. It compiles text and serves it.

## Caveats worth knowing

- **Character budgets and install steps need product checks.** The values in [`src/targets.js`](src/targets.js) are Persa's configured budgets; Instinct's 1,200 is a writing target, not a product limit. [docs/INSTALL.md](docs/INSTALL.md) records primary sources and unresolved limits. Some built-in `install` steps still differ from the current product docs.
- **Paste targets are snapshots.** Change your persona and you have to re-paste. MCP tools, resources and prompts read the current file when called; initialization instructions require reinitialization.
- **How well a personality sticks is the model's business, not Persa's.** The anchor line ("hold this voice in every reply") helps; nothing makes it certain.

## Tests

```bash
npm test
```

68 tests covering avatar asset integrity and replacement records, the compiler's budget invariants, the persona format's failure modes, the save round trip (comments, unknown keys, concurrent writes), the editor's HTTP API, MCP surfaces through the SDK's in-memory client transport, and the CLI itself, spawned the way a person runs it. CI runs Node 20, 22 and 24 and checks a clean install of the packed package. The suite does not exercise browser flows or MCP over its stdio or HTTP transport end to end.

## Contributing

Corrections to a target's character limit or install steps are the most useful
thing anyone can send: those details move, and this repository cannot check
them for you. [CONTRIBUTING.md](CONTRIBUTING.md) has the rest, including the
two rules that keep personas short. [AGENTS.md](AGENTS.md) records repository
guidance for coding agents, including product scope, asset provenance, checks,
and the Vercel migration alongside the previous Sites publication workflow.

## License

MIT.
