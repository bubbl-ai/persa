import { characterShareUrl } from './character-links.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

// The download is a portable browser page, not a Muse import format. Reuse the
// caller's current compiled handoff so the link and fallback keep the same tone.
export function buildCharacterPackage({ character, handoff, previewDataUrl = null }) {
  if (!character || typeof character.name !== 'string' || !character.name.trim()) {
    throw new TypeError('A named character is required');
  }
  const shareUrl = characterShareUrl(character.id);
  if (!handoff || handoff.characterId !== character.id || typeof handoff.prompt !== 'string' || !handoff.prompt.trim()) {
    throw new TypeError('A complete matching Muse handoff is required');
  }
  let museUrl;
  try { museUrl = new URL(handoff.url); } catch { throw new TypeError('Invalid Muse handoff URL'); }
  if (museUrl.origin !== 'https://muse.ai' || museUrl.pathname !== '/' || museUrl.username || museUrl.password
      || museUrl.hash || museUrl.searchParams.getAll('prompt').length !== 1
      || museUrl.searchParams.get('prompt') !== handoff.prompt) {
    throw new TypeError('Muse handoff URL must contain the same complete prompt');
  }
  // Raster-only embedded previews keep saved files independent of network
  // requests and prevent active SVG/HTML or arbitrary remote URL injection.
  if (previewDataUrl !== null && (typeof previewDataUrl !== 'string'
      || !/^data:image\/(?:png|webp|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(previewDataUrl))) {
    throw new TypeError('Preview must be an embedded PNG, WebP or JPEG');
  }
  const name = escapeHtml(character.name);
  const tags = Array.isArray(character.tags) ? character.tags.map(escapeHtml).join(' · ') : '';
  const preview = previewDataUrl
    ? `<img class="portrait" src="${previewDataUrl}" alt="Muse-style plush in a ${name} costume" width="640" height="640">`
    : '<div class="portrait-placeholder"><span aria-hidden="true">✦</span><p>Personality + avatar instructions</p></div>';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <title>${name} · Persa for Muse AI</title>
  <style>
    :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #26232c; background: #f7f6f9; line-height: 1.55; }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    body { margin: 0; padding: 28px 18px; }
    main { max-width: 760px; margin: auto; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
    .brand { font-size: 24px; letter-spacing: -.06em; font-weight: 750; text-decoration: none; color: #26232c; }
    .label { color: #6d6578; font-size: 13px; }
    .card { background: white; border: 1px solid #ece8ef; border-radius: 24px; padding: 24px; box-shadow: 0 12px 40px #28203306; }
    .hero { text-align: center; }
    .portrait { display: block; width: min(100%, 340px); height: auto; margin: -10px auto 0; object-fit: contain; }
    .portrait-placeholder { padding: 32px 0; color: #7c639b; }
    .portrait-placeholder span { font-size: 56px; }
    .portrait-placeholder p { margin: 8px 0; }
    h1 { margin: 6px 0; font-size: clamp(28px, 6vw, 38px); letter-spacing: -.04em; line-height: 1.15; overflow-wrap: anywhere; }
    .tags { margin: 8px 0 20px; color: #71667e; }
    .button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 11px 20px; background: #72538f; color: white; border: 0; border-radius: 999px; font: inherit; font-weight: 650; text-decoration: none; cursor: pointer; }
    .button:hover { background: #5d4178; }
    .button:focus-visible, a:focus-visible, summary:focus-visible, textarea:focus-visible { outline: 3px solid #a58ac0; outline-offset: 4px; }
    .guide { margin: 26px 0 0; padding-top: 20px; border-top: 1px solid #ece8ef; }
    h2 { margin: 0 0 14px; font-size: 18px; letter-spacing: -.02em; }
    ol { padding-left: 22px; margin: 0; }
    li { padding: 0 0 12px 6px; }
    li strong { display: block; }
    li span, .note { color: #716977; font-size: 14px; }
    .note { margin: 14px 0 0; }
    details { margin-top: 20px; padding: 16px; border: 1px solid #ece8ef; border-radius: 16px; }
    summary { cursor: pointer; font-weight: 600; }
    details p { margin: 12px 0; font-size: 14px; color: #716977; }
    textarea { width: 100%; min-height: 260px; resize: vertical; margin-bottom: 12px; border: 1px solid #d8d0df; border-radius: 10px; padding: 12px; background: #faf9fc; color: #37313e; font: 13px/1.55 ui-monospace, SFMono-Regular, Consolas, monospace; }
    #copy-status { min-height: 1.55em; margin-bottom: 0; }
    .character-link { display: block; margin: 18px 0 0; text-align: center; color: #72538f; text-underline-offset: 3px; }
    footer { padding: 20px 4px; text-align: center; font-size: 12px; color: #7d7584; }
    @media (max-width: 400px) { body { padding: 18px 12px; } .card { padding: 18px; } header { flex-wrap: wrap; } }
    @media print { body { background: white; } .card { box-shadow: none; } details { display: none; } }
  </style>
</head>
<body>
  <main>
    <header><a class="brand" href="https://persa.bubblai.com/">persa</a><span class="label">Made for Muse AI · Saved character</span></header>
    <article class="card">
      <div class="hero">
        ${preview}
        <h1>${name}</h1>
        <p class="tags">${tags}</p>
        <a class="button" id="open-muse" href="${escapeHtml(museUrl.href)}" target="_blank" rel="noopener noreferrer">Open in Muse ↗</a>
      </div>
      <section class="guide" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol>
          <li><strong>Open in Muse</strong><span>Your saved personality and avatar instructions open in Muse. Sign in if needed.</span></li>
          <li><strong>Press Send</strong><span>Check the prepared message, then send it to apply the personality and generate avatar options.</span></li>
          <li><strong>Choose your avatar</strong><span>Pick an option and click Select. Check the saved personality and try a conversation.</span></li>
        </ol>
        <p class="note">This HTML file keeps your current combo available in your browser, including any tone changes. An internet connection is needed to open Muse. It does not install a character or import a file into Muse.</p>
      </section>
      <details id="fallback">
        <summary>If the instructions do not appear</summary>
        <p>Save any existing Muse draft you want to keep, clear it, then try Open in Muse again. You can also copy the complete instructions below and paste them into Muse.</p>
        <label for="combo-prompt">Complete personality + avatar instructions</label>
        <textarea id="combo-prompt" readonly spellcheck="false">${escapeHtml(handoff.prompt)}</textarea>
        <button class="button" id="copy-prompt" type="button" hidden>Copy complete combo</button>
        <p id="copy-status" role="status" aria-live="polite">You can select this text and use your device’s Copy action.</p>
      </details>
      <a class="character-link" href="${escapeHtml(shareUrl)}">View ${name} on Persa</a>
    </article>
    <footer>Muse generates a new avatar; it may differ from this preview. Independent celebrity-inspired costumes. Not affiliated with Meta, Muse, or the people depicted.</footer>
  </main>
  <script>
    const button = document.getElementById('copy-prompt');
    const prompt = document.getElementById('combo-prompt');
    const status = document.getElementById('copy-status');
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(prompt.value);
        status.textContent = 'Complete combo copied. Paste it into Muse and press Send.';
      } catch {
        prompt.focus();
        prompt.select();
        prompt.setSelectionRange(0, prompt.value.length);
        status.textContent = 'Instructions selected. Use your device’s Copy action, then paste into Muse.';
      }
    });
  </script>
</body>
</html>`;
}
