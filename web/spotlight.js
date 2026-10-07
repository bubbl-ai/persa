const stage = document.querySelector('#stage');
const slidesRoot = document.querySelector('#slides');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const picker = document.querySelector('#character-select');
const message = document.querySelector('#stage-message');
const retry = document.querySelector('#retry');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let characters = [], slides = [], selected = 0, settleTimer, pointerStart;

function position(index) {
  const length = characters.length;
  const distance = (index - selected + length) % length;
  return distance > length / 2 ? distance - length : distance;
}

function prepareImage(index) {
  const slide = slides[index];
  const image = slide.querySelector('img');
  if (!image || image.hasAttribute('src')) return;
  image.fetchPriority = index === selected ? 'high' : 'low';
  image.src = characters[index].avatar.preview;
}

function settle() {
  stage.classList.remove('is-moving');
  document.querySelector('#announcement').textContent = `${characters[selected].name}, ${selected + 1} of ${characters.length}.`;
}

function selectCharacter(index, animate = true) {
  if (!characters.length) return;
  selected = (index + characters.length) % characters.length;
  clearTimeout(settleTimer);
  const moving = animate && !reducedMotion.matches;
  stage.classList.toggle('is-moving', moving);
  const character = characters[selected];
  slides.forEach((slide, i) => {
    const offset = position(i);
    slide.style.setProperty('--slot', offset);
    slide.classList.toggle('is-active', offset === 0);
    slide.classList.toggle('is-away', Math.abs(offset) > 1);
    slide.setAttribute('aria-hidden', String(offset !== 0));
    if (Math.abs(offset) <= 1) prepareImage(i);
  });
  document.querySelector('#character-name').textContent = character.name;
  document.querySelector('#character-subtitle').textContent = character.subtitle;
  document.querySelector('#character-kicker').textContent = 'Personality + Muse costume';
  document.querySelector('#character-tags').replaceChildren(...character.tags.map(tag => {
    const span = document.createElement('span'); span.textContent = tag; return span;
  }));
  const count = `${String(selected + 1).padStart(2, '0')} / ${characters.length}`;
  document.querySelector('#stage-count').textContent = count;
  document.querySelector('#page-count').textContent = count;
  picker.value = character.id;
  if (moving) settleTimer = setTimeout(settle, 550); else settle();
}

function makeSlide(character, index) {
  const slide = document.createElement('div');
  slide.className = 'slide is-away';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `${character.name}, ${index + 1} of ${characters.length}`);
  const fallback = document.createElement('span');
  fallback.className = 'image-fallback';
  fallback.textContent = `${character.name} preview is unavailable. You can still browse the wardrobe.`;
  if (character.avatar?.preview) {
    const image = document.createElement('img');
    image.alt = `Shared plush Muse in a ${character.name} costume`;
    image.width = 1254; image.height = 1254; image.decoding = 'async';
    image.addEventListener('error', () => slide.classList.add('has-failed'));
    slide.append(image);
  } else slide.classList.add('has-failed');
  slide.append(fallback);
  return slide;
}

async function loadWardrobe() {
  retry.hidden = true;
  message.hidden = false;
  message.textContent = 'Opening the wardrobe…';
  stage.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('/catalog.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    const data = await response.json();
    if (!Array.isArray(data.characters) || !data.characters.length) throw new Error('Empty catalog');
    characters = data.characters;
    slides = characters.map(makeSlide);
    slidesRoot.replaceChildren(...slides);
    picker.replaceChildren(...characters.map(character => {
      const option = document.createElement('option'); option.value = character.id; option.textContent = character.name; return option;
    }));
    selected = Math.max(0, characters.findIndex(character => character.id === 'taylor-swift'));
    selectCharacter(selected, false);
    previous.disabled = next.disabled = characters.length < 2;
    picker.disabled = false;
    stage.setAttribute('aria-busy', 'false');
    document.querySelector('#character-info').setAttribute('aria-busy', 'false');
    message.hidden = true;
  } catch {
    message.textContent = 'The wardrobe couldn’t load. Please try again.';
    retry.hidden = false;
    stage.setAttribute('aria-busy', 'false');
    document.querySelector('#character-info').setAttribute('aria-busy', 'false');
  }
}

previous.addEventListener('click', () => selectCharacter(selected - 1));
next.addEventListener('click', () => selectCharacter(selected + 1));
picker.addEventListener('change', () => selectCharacter(characters.findIndex(character => character.id === picker.value)));
retry.addEventListener('click', loadWardrobe);
document.querySelector('.showcase').addEventListener('keydown', event => {
  if (event.target.matches('select,input,textarea') || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); selectCharacter(selected + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
stage.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
  pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointerup', event => {
  if (!pointerStart || event.pointerId !== pointerStart.id) return;
  const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) selectCharacter(selected + (dx < 0 ? 1 : -1));
});
stage.addEventListener('pointercancel', () => { pointerStart = null; });
reducedMotion.addEventListener('change', () => { if (characters.length) { clearTimeout(settleTimer); settle(); } });
loadWardrobe();
