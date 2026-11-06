# Sharing and portable character cards — November 6, 2026

Status: published and verified at https://persa.bubblai.com. Actual waving/singing remains pending new animation assets.

## Requested changes

1. **Share** replaces Copy character link on the spotlight, all 18 tiles and
   detail dialogs. A user click opens the device share sheet when the browser
   exposes Web Share. Unsupported or failed sharing shows a selectable clean URL
   and Copy link button. Cancelling the device sheet does not copy or open a
   fallback. Clipboard denial selects the URL for manual copying.
2. **Actual waving/singing is pending.** The current 18 assets are flattened
   still images. CSS moves each entire image; it cannot articulate a hand or
   mouth faithfully. No animation assets or video-generation tool were available
   for this update. New layered rigs or short animated assets are needed for
   those gestures. Existing finite poses remain, labeled **Preview motion
   on/off**, with reduced-motion, visibility and drag protections. No audio or
   animation transfer to Muse is claimed.
3. **Clean paths** use `/character/lionelmessi` and equivalent compact IDs for
   all 18 characters. Old `?character=lionel-messi`, compact query IDs and
   hyphenated path aliases still select the correct preset. Browsing normalizes
   to the clean path while preserving UTM parameters/hash and history state.
   Collection links keep `collection.html?view=saved&character=<id>` so saved
   views are preserved. Vercel rewrites and the local preview allow only known
   character slugs; unknown paths return 404. Trailing slashes redirect with 308
   while preserving campaign parameters before the character rewrite. All links are in
   [Character links](CHARACTER_LINKS.md).
4. **How it works** is a compact three-step section below the spotlight:
   choose a character, Open in Muse and Send, then choose an avatar and Select.
   The old homepage Setup options button is removed. Detail views have concise
   inline guidance and optional download/copy controls.
5. **Jump to** is removed. Arrows, swipe/drag, keyboard browsing, direct links
   and the full inline collection remain.
6. **Save character as HTML** downloads a standalone card with an embedded
   preview, the current tone, complete personality/avatar instructions and a
   real Open in Muse link. It has no external page dependencies and opens offline;
   using Muse still needs an internet connection. If the image fetch fails, the
   card retains the complete combo without a preview. The same current handoff
   supplies both the link and copy fallback. JSON backup remains available.

HTML is a portable browser package, not a verified Muse import format or an
installation mechanism. Opening it does not contact Muse or change any account.
The user opens Muse, presses Send and selects an avatar. Login transfer and native
mobile Muse setup are still unverified. No new native Muse request, avatar
activation, or personality/account change was performed for this website update.
All 18 personas, visual recipes, artwork and complete handoff builders are unchanged.

## Implementation and references

`web/character-links.js` owns canonical URLs and aliases; `vercel.json` and
`scripts/preview-web.js` serve the known paths. `web/app.js` owns native-share
fallbacks and captures the selected character/tone before fetching the optional
preview for download. `web/character-package.js` builds the escaped standalone
HTML, validates the matching Muse URL/prompt, and allows only embedded PNG/WebP/JPEG.
The script-free card still has its primary link and selectable fallback text.

Web Share requires a user action and has browser-dependent availability; see
[MDN's share API reference](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share).
Routing uses [Vercel rewrites](https://vercel.com/docs/routing/rewrites) and explicit
[`trailingSlash: false`](https://vercel.com/docs/project-configuration/vercel-json#trailingslash).

## Verification

- Full Node suite: **106/106 passed**. New focused tests cover route compatibility,
  all 18 served paths, unknown/missing-path behavior, exact tuned HTML handoffs,
  injection escaping and raster-only embedding.
- Website build, both JavaScript syntax checks and `git diff --check` passed.
- Standalone HTML browser checks: **10/10 passed** across 390×844, 320×568 and
  1280×900; offline embedded image, no overflow/network dependencies, exact tuned
  prompt and link, clipboard success/denial, and JavaScript-disabled fallback.
  The initial run found that `.button` overrode `hidden`; an explicit hidden rule
  fixed it. Initial and final evidence are retained separately.
- Integrated website browser checks: **45/45 passed** before publication,
  including all 18 clean routes/reloads, legacy aliases, campaign/history state,
  unknown-route 404, sharing success/cancel/error/unavailable, clipboard denial,
  tile/detail/collection actions, six desktop/mobile layouts, tuned HTML download,
  failed-preview HTML fallback, motion preferences and image recovery. Zero
  uncaught browser errors or Muse requests. Screenshots visually checked with
  active portraits and primary controls visible down to 320×568.
- Four final local smoke checks passed: seven served-file byte matches, touch
  swipe with campaign/hash preservation, vertical scrolling without a character
  change, and no browser errors/Muse requests.
- Vercel deployment and GitHub tests succeeded for `67aca00021e0c7b4bf52fe1369e57318081647a2`.
  The initial production browser run passed 43/45 checks. It found that a
  slash-suffixed character campaign URL returned 404 on Vercel while local
  preview accepted it. A hosting-only fix explicitly sets `trailingSlash: false`
  and mirrors the 308/query-preserving behavior in local preview. The eight
  focused route/link tests passed after adding regression assertions.
  The other initial failed assertion checked reduced-motion state immediately
  after emulating the OS setting. A focused check waited for the media change
  event (observed after 8.8ms) and passed with the button disabled and animation
  stopped; no application code changed. Existing finite poses and persistent off
  behavior also passed. Keep both original failures in the evidence.
- Final targeted live checks: **23/23 passed** after the hosting fix. All 18
  slash-suffixed URLs returned 308 then 200 and preserved campaign parameters;
  compact/hyphen aliases retained selection, query and hash across reload;
  unknown routes stayed 404. Eight served files, including the catalog, matched
  the local build byte for byte. The 43 initially passing checks plus the motion
  follow-up and route-fix checks cover all 45 original cases. No uncaught browser
  errors or Muse requests. Live screenshots at desktop, 390px and 320px were
  visually inspected; no active-avatar clipping or horizontal overflow.

## Publication

Implementation: `67aca00021e0c7b4bf52fe1369e57318081647a2` on `main`.
Trailing-slash fix: `e59e9754d577a046665486898c4ecefd8cc1a9ae`.
Production remains [persa.bubblai.com](https://persa.bubblai.com).
[Deployment](https://github.com/bubbl-ai/persa/actions/runs/42149557392)
and [CI](https://github.com/bubbl-ai/persa/actions/runs/42149557396) succeeded.
The trailing-slash [fix deployment](https://github.com/bubbl-ai/persa/actions/runs/42149940708)
and [fix CI](https://github.com/bubbl-ai/persa/actions/runs/42149940748) also succeeded.
The existing Vercel project and workflow were reused; the historical Sites
hosting record was left unchanged.

Local evidence is outside Git in
`/Users/zachwang/bubbl/persa-test-results/2026-11-06-share/` and
`/Users/zachwang/bubbl/persa-test-results/2026-11-06-sharing/`.
Browser tests use isolated Chromium. Native sharing is mocked to test success,
cancellation and failures; they do not send a message to anyone. They do not
establish physical iOS/Safari or native Muse behavior.
