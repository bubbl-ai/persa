import { compile } from './core/compile.js';
import { TRAITS, TRAIT_NAMES } from './core/traits.js';

const icons = {
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m21 15-5-5L5 21"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  back: '<path d="m14 6-6 6 6 6"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const app = document.querySelector('#app');
const STORE_KEY = 'persa.muse-combos.v1';
let characters = [], saved = {}, current = null, drafts = {}, sampleIndex = 0, view = 'explore', dialog, returnFocus, toastTimer;

function readSaved() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    const result = {};
    for (const character of characters) {
      const item = raw?.[character.id];
      if (!item || typeof item !== 'object') continue;
      const voice = { ...character.persona.voice };
      for (const trait of TRAIT_NAMES) {
        const value = item.voice?.[trait];
        if (Number.isInteger(value) && value >= 0 && value <= 100) voice[trait] = value;
      }
      result[character.id] = { voice };
    }
    return result;
  } catch { return {}; }
}

function persist(next) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); saved = next; return true; }
  catch { notify('Your browser could not save this. Download the combo to keep a copy.'); return false; }
}

function notify(message) {
  let node = dialog?.open ? dialog.querySelector('.toast') : document.querySelector('#toast');
  if (!node) { node=document.createElement('div');node.className='toast';node.setAttribute('role','status');node.setAttribute('aria-live','polite');dialog.append(node); }
  node.textContent = message; node.classList.add('visible'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('visible'), 3500);
}

function imageMarkup(character, detail = false) {
  if (character.avatar.preview) return `<img src="${esc(character.avatar.preview)}" alt="Cute illustrated ${esc(character.name)} Muse avatar" width="1254" height="1254" ${detail ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  return `<div class="unavailable" style="height:100%">${icon('image')}<p>Avatar preview unavailable</p><small>Personality + avatar prompt included</small></div>`;
}

function card(character) {
  const isSaved = !!saved[character.id];
  return `<article class="card">
    <button class="save-card ${isSaved ? 'saved' : ''}" data-save="${character.id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${esc(character.name)}${isSaved ? ' from' : ' to'} My collection" aria-pressed="${isSaved}">${icon('heart')}</button>
    <button class="card-open" data-character="${character.id}" id="card-${character.id}" aria-label="Preview ${esc(character.name)} personality and avatar">
      <div class="card-art">${imageMarkup(character)}<span class="card-category">${character.category === 'People' ? 'Familiar face' : 'Fiction & art'}</span></div>
      <div class="card-body"><h2 class="card-title">${esc(character.name)}</h2><p class="card-subtitle">${esc(character.subtitle)}</p><div class="tags">${character.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div><div class="card-line"><span>Personality + avatar</span><span>Meet ${character.id === 'the-rock' ? 'The Rock' : esc(character.name.split(' ')[0])}</span></div></div>
    </button>
  </article>`;
}

function renderPage() {
  const list = characters.filter(c => view !== 'saved' || saved[c.id]).sort((a, b) => Number(!!b.avatar.preview) - Number(!!a.avatar.preview));
  app.innerHTML = `<div class="shell"><header class="topbar"><a class="brand" href="/" aria-label="Persa home"><img src="/favicon.svg" alt="" width="33" height="33">persa</a><nav class="navigation" aria-label="Main navigation"><button class="nav-button ${view === 'explore' ? 'active' : ''}" data-view="explore" aria-current="${view === 'explore' ? 'page' : 'false'}">Explore</button><button class="nav-button ${view === 'saved' ? 'active' : ''}" data-view="saved" aria-current="${view === 'saved' ? 'page' : 'false'}">${icon('heart')}My collection ${Object.keys(saved).length ? `<span class="saved-count">${Object.keys(saved).length}</span>` : ''}</button><button class="text-button" data-how>How it works</button></nav><div class="made-for">${icon('spark')} Made for Muse</div></header>
    <main><section class="intro"><div><div class="eyebrow">A familiar face. A different kind of company.</div><h1>${view === 'saved' ? 'Your kind of <span>company.</span>' : 'Find your <span>Muse.</span>'}</h1><p>${view === 'saved' ? 'Your saved characters, with the personality settings you chose.' : 'A personality you connect with. An avatar to match.<br>Choose a character and make your Muse feel more like you.'}</p></div><div class="intro-aside"><strong>One character. The whole combo.</strong>A matching personality and avatar,<br>ready to take into Muse.</div></section>
    <section aria-labelledby="collection-title"><div class="collection-head"><h2 class="collection-title" id="collection-title">${view === 'saved' ? 'My collection' : 'The character collection'} <span> / ${list.length}</span></h2><span class="collection-note">${view === 'saved' ? 'Saved on this device' : 'Choose a character to meet them'}</span></div><div class="grid">${list.length ? list.map(card).join('') : `<div class="empty">${icon('heart')}<h2>A place for your favorites.</h2><p>Save a character and your tone settings to find them here.</p><button class="button primary" data-view="explore">Explore characters</button></div>`}</div></section></main>
    <footer class="footer"><div><strong>persa</strong> &nbsp; A little more personality.</div><div>Independent character interpretations. Not affiliated with Muse or the people and franchises shown.</div></footer></div>`;
}

function getPersona() { return { ...current.persona, voice: { ...current.persona.voice, ...drafts[current.id] } }; }
function personalityPrompt() { return compile(getPersona(), 'muse').text; }
function comboPrompt() {
  return `I'd like to use this Persa character combo for my Muse: ${current.name}. Please apply the personality below as my style preferences, and use the matching avatar prompt to help me set up its appearance. If you cannot change the avatar directly, tell me how to do it in this app.\n\nPERSONALITY\n\n${personalityPrompt()}\n\nMATCHING AVATAR\n\n${current.avatar.prompt}`;
}

function dialogHeader(label, back = false) {
  return `<div class="dialog-top"><span class="dialog-label">${back ? '<button class="icon-button" data-back aria-label="Back to character">'+icon('back')+'</button>' : icon('spark')}${esc(label)}</span><button class="icon-button" data-close aria-label="Close">${icon('close')}</button></div>`;
}

function showDialog(html, labelId) {
  dialog.innerHTML = html;
  dialog.setAttribute('aria-labelledby', labelId);
  if (!dialog.open) { returnFocus = document.activeElement; dialog.showModal(); document.body.style.overflow = 'hidden'; }
  dialog.scrollTop = 0;
  dialog.querySelector('[data-close]')?.focus({ preventScroll: true });
}

function renderDetail() {
  const c = current, voice = getPersona().voice, sample = c.samples[sampleIndex];
  const knobs = ['warmth', 'humor', 'directness', 'verbosity'];
  showDialog(`${dialogHeader('Your Muse character')}
    <div class="detail"><section class="detail-visual"><div class="detail-art">${imageMarkup(c, true)}</div><h2 class="detail-name" id="dialog-title">${esc(c.name)}</h2><p class="detail-description">${esc(c.description)}</p><div class="tags">${c.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div><div class="combo-label">${icon('check')} Personality and matching avatar included</div></section>
    <section class="detail-controls"><h3 class="section-label">A feel for their voice</h3><div class="sample-tabs" role="group" aria-label="Example conversation"><button class="sample-tab ${sampleIndex === 0 ? 'active' : ''}" data-sample="0" aria-pressed="${sampleIndex === 0}">A busy day</button><button class="sample-tab ${sampleIndex === 1 ? 'active' : ''}" data-sample="1" aria-pressed="${sampleIndex === 1}">Honest advice</button><button class="sample-tab ${sampleIndex === 2 ? 'active' : ''}" data-sample="2" aria-pressed="${sampleIndex === 2}">A little win</button></div><div class="conversation"><div class="sample-user">${esc(sample.user)}</div><p class="sample-reply">${esc(sample.reply)}</p></div><p class="sample-caption">Illustrative replies for this preset. Muse's responses will vary.</p>
    <div class="tune-head"><h3 class="section-label">Make it your kind of ${c.id === 'the-rock' ? 'Rock' : esc(c.name.split(' ')[0])}</h3><button class="reset" data-reset>Reset tone</button></div><div class="sliders">${knobs.map(trait => `<label class="slider"><span class="slider-top">${trait.charAt(0).toUpperCase()+trait.slice(1)}<output id="value-${trait}">${voice[trait]}</output></span><input type="range" min="0" max="100" step="1" value="${voice[trait]}" data-trait="${trait}" aria-label="${trait}" aria-describedby="ends-${trait}"><span class="slider-ends" id="ends-${trait}"><span>${TRAITS[trait].low}</span><span>${TRAITS[trait].high}</span></span></label>`).join('')}</div>
    <details class="prompt-details"><summary>The personality instructions ${icon('chevron')}</summary><pre class="prompt-text" id="personality-text">${esc(personalityPrompt())}</pre></details></section></div>
    <div class="detail-bottom"><span class="detail-bottom-note">Your character. Your way.</span><div class="actions"><button class="save-detail ${saved[c.id] ? 'saved' : ''}" data-save-current>${icon(saved[c.id] ? 'check' : 'heart')}<span>${saved[c.id] ? 'Save changes' : 'Save combo'}</span></button><button class="button primary" data-setup>Use in Muse ${icon('spark')}</button></div></div>`, 'dialog-title');
}

function openCharacter(id) {
  const found = characters.find(c => c.id === id); if (!found) return;
  current = found; sampleIndex = 0;
  if (!drafts[id]) drafts[id] = { ...(saved[id]?.voice || found.persona.voice) };
  renderDetail();
}

function renderSetup() {
  showDialog(`${dialogHeader('Take your character into Muse', true)}<section class="setup"><p class="eyebrow">Personality + matching avatar</p><h2 id="dialog-title">Meet your ${esc(current.name)}.</h2><p class="setup-intro">Your combo contains the personality you chose and a matching avatar prompt. Take both into the same Muse conversation.</p>
    <div class="setup-step"><span class="step-number">1</span><div class="step-content"><h3>Copy your character combo</h3><p>One message includes both parts, with your tone adjustments.</p><button class="button primary" data-copy="combo">${icon('copy')} Copy personality + avatar</button></div></div>
    <div class="setup-step"><span class="step-number">2</span><div class="step-content"><h3>Open Muse and paste</h3><p>Send the message and ask Muse to use the personality and help set up the avatar.</p><a class="button outline" href="https://muse.ai/" target="_blank" rel="noopener noreferrer">Open Muse ${icon('spark')}</a></div></div>
    <div class="setup-step"><span class="step-number">3</span><div class="step-content"><h3>Make sure it feels right</h3><p>Try a short conversation and check the avatar. You can adjust the personality here and send an updated combo whenever you like.</p></div></div>
    <div class="setup-note">Persa copies the setup instructions. You apply them in Muse; a direct avatar import is not available here yet. The preview illustrates the intended look, and Muse may create a different result.</div>
    <details class="prompt-details"><summary>View the complete combo ${icon('chevron')}</summary><pre class="prompt-text">${esc(comboPrompt())}</pre></details>
    <div class="copy-options"><button class="button secondary" data-copy="personality">${icon('copy')} Personality only</button><button class="button secondary" data-copy="avatar">${icon('copy')} Avatar prompt only</button></div>
    <div class="setup-links"><button class="text-button" data-download>${icon('download')} Download combo</button><button class="text-button" data-save-current>${icon('heart')} Save on this device</button></div>
    <details class="grok-details"><summary>Also use the personality with Grok Bot</summary><p>Copy the personality into your Bot's Description under Edit Profile. The avatar prompt in this combo is intended for Muse.</p><button class="button secondary" data-copy="grok">${icon('copy')} Copy Bot description</button></details></section>`, 'dialog-title');
}

function showHow() {
  showDialog(`${dialogHeader('A little more personality')}<section class="setup"><p class="eyebrow">Made for your Muse</p><h2 id="dialog-title">One character. Two parts.</h2><div class="how-steps"><div><h3>Find someone you connect with</h3><p>Every character pairs a personality with a matching avatar prompt. Preview a few example replies and the intended look.</p></div><div><h3>Make the tone yours</h3><p>Adjust warmth, humor, directness, and response length. Your changes update the personality instructions; the example replies show the original preset.</p></div><div><h3>Take the combo into Muse</h3><p>Copy the combined message, open Muse, and paste it into a conversation. Ask Muse to adopt the personality and help you set up the avatar.</p></div><div><h3>Keep your favorites close</h3><p>Saved combos stay in this browser on this device. Download a combo if you want a backup or to take it somewhere else.</p></div></div><p class="setup-note">Persa provides style preferences and avatar prompts. It does not change Muse's permissions or guarantee that every instruction persists between conversations.</p></section>`, 'dialog-title');
}

async function copyText(kind, button) {
  const text = kind === 'avatar' ? current.avatar.prompt : kind === 'personality' ? personalityPrompt() : kind === 'grok' ? compile(getPersona(), { markdown: false, framing: 'system', limit: null }).text : comboPrompt();
  try {
    await navigator.clipboard.writeText(text);
    const old = button.innerHTML; button.innerHTML = `${icon('check')} Copied`;
    setTimeout(() => { if (button.isConnected) button.innerHTML = old; }, 1800);
    notify(kind === 'combo' ? 'Combo copied. Paste it into Muse to get started.' : 'Copied to your clipboard.');
  } catch {
    showDialog(`${dialogHeader('Copy your instructions', true)}<section class="setup copy-fallback"><h2 id="dialog-title">Copy the text below.</h2><p class="setup-intro">This browser could not copy automatically. Select the text and use your device's Copy action.</p><textarea aria-label="Instructions to copy" readonly>${esc(text)}</textarea></section>`, 'dialog-title');
    const textarea=dialog.querySelector('textarea');textarea.focus();textarea.select();
  }
}

function saveCurrent() {
  if (!persist({ ...saved, [current.id]: { voice: { ...getPersona().voice } } })) return;
  renderPage();
  const button=dialog.querySelector('[data-save-current]');
  if(button){button.classList.add('saved');button.innerHTML=`${icon('check')}<span>Saved on this device</span>`;}
  notify('Combo and tone settings saved on this device.');
}

function toggleSave(id) {
  const c=characters.find(item=>item.id===id);if(!c)return;
  const next={...saved},removing=!!next[id];
  if(removing)delete next[id];else next[id]={voice:{...(drafts[id]||c.persona.voice)}};
  if(persist(next)){renderPage();notify(removing?'Removed from My collection.':'Combo saved on this device.');document.querySelector(`[data-save="${id}"]`)?.focus({preventScroll:true});}
}

function downloadCombo() {
  const exportData={persaCharacter:1,id:current.id,name:current.name,persona:getPersona(),museAvatar:{prompt:current.avatar.prompt},personalityPrompt:personalityPrompt()};
  const url=URL.createObjectURL(new Blob([JSON.stringify(exportData,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=`persa-${current.id}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Combo downloaded.');
}

async function start() {
  try {
    const response=await fetch('/catalog.json');if(!response.ok)throw new Error('Catalog unavailable');
    const data=await response.json();characters=data.characters;
    if(!Array.isArray(characters)||!characters.length)throw new Error('Empty catalog');
    saved=readSaved();renderPage();
    dialog=document.createElement('dialog');dialog.id='character-dialog';document.body.append(dialog);
    const toast=document.createElement('div');toast.id='toast';toast.className='toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.append(toast);
    dialog.addEventListener('close',()=>{document.body.style.overflow='';const target=current?document.querySelector(`#card-${current.id}`):null;(returnFocus?.isConnected?returnFocus:target)?.focus({preventScroll:true});});
    dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
    document.addEventListener('click',e=>{
      const button=e.target.closest('button');if(!button)return;
      if(button.hasAttribute('data-close'))dialog.close();
      else if(button.dataset.character)openCharacter(button.dataset.character);
      else if(button.dataset.save)toggleSave(button.dataset.save);
      else if(button.dataset.view){view=button.dataset.view;renderPage();document.querySelector(`[data-view="${view}"]`)?.focus({preventScroll:true});}
      else if(button.hasAttribute('data-how'))showHow();
      else if(button.hasAttribute('data-back'))renderDetail();
      else if(button.hasAttribute('data-sample')){sampleIndex=Number(button.dataset.sample);renderDetail();dialog.querySelector(`[data-sample="${sampleIndex}"]`)?.focus({preventScroll:true});}
      else if(button.hasAttribute('data-reset')){drafts[current.id]={...current.persona.voice};renderDetail();dialog.querySelector('[data-reset]')?.focus({preventScroll:true});notify('Original tone restored.');}
      else if(button.hasAttribute('data-save-current'))saveCurrent();
      else if(button.hasAttribute('data-setup'))renderSetup();
      else if(button.dataset.copy)copyText(button.dataset.copy,button);
      else if(button.hasAttribute('data-download'))downloadCombo();
    });
    dialog.addEventListener('input',e=>{
      const trait=e.target.dataset.trait;if(!TRAIT_NAMES.includes(trait))return;
      drafts[current.id][trait]=Number(e.target.value);
      dialog.querySelector(`#value-${trait}`).textContent=e.target.value;
      dialog.querySelector('#personality-text').textContent=personalityPrompt();
      const save=dialog.querySelector('[data-save-current]');if(save){save.classList.remove('saved');save.innerHTML=`${icon('heart')}<span>Save changes</span>`;}
    });
  }catch(error){app.innerHTML='<main class="fatal"><h1>We could not load the collection.</h1><p>Please check your connection and try again.</p><button class="button primary" id="retry">Try again</button></main>';document.querySelector('#retry').onclick=()=>location.reload();console.error(error);}
}
start();
