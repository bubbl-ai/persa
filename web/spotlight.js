// The shared app owns catalog, personality, favorites, dialogs, and setup.
export function mountSpotlight({ characters, saved, getHandoff }) {
  const stage = document.querySelector('#stage');
  const slidesRoot = document.querySelector('#slides');
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const picker = document.querySelector('#character-select');
  const message = document.querySelector('#stage-message');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let slides = [], selected = 0, settleTimer, drag, savedRecords = saved;

  function cancelDrag() {
    const pointer = drag;
    drag = null;
    stage.classList.remove('is-dragging');
    slidesRoot.style.removeProperty('--drag-x');
    if (pointer && stage.hasPointerCapture(pointer.id)) stage.releasePointerCapture(pointer.id);
  }

  function position(index) {
    const length = characters.length;
    const distance = (index - selected + length) % length;
    return distance > length / 2 ? distance - length : distance;
  }

  function prepareImage(index, load = true) {
    const slide = slides[index];
    const image = slide.querySelector('img');
    if (!image) return;
    image.fetchPriority = index === selected ? 'high' : 'low';
    if (load && !image.hasAttribute('src')) image.src = characters[index].avatar.preview;
  }

  function settle() {
    stage.classList.remove('is-moving');
    document.querySelector('#announcement').textContent = `${characters[selected].name}, ${selected + 1} of ${characters.length}. ${characters[selected].tags.join(', ')}.`;
  }

  function selectCharacter(index, animate = true) {
    if (!characters.length) return;
    cancelDrag();
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
      prepareImage(i, Math.abs(offset) <= 1);
    });
    document.querySelector('#character-name').textContent = character.name;
    document.querySelector('#character-subtitle').textContent = character.subtitle;
    document.querySelector('#character-kicker').textContent = 'Personality + Muse avatar';
    document.querySelector('#stage-personality').textContent = character.tags.join(' · ');
    const count = `${String(selected + 1).padStart(2, '0')} / ${characters.length}`;
    document.querySelector('#stage-count').textContent = count;
    document.querySelector('#page-count').textContent = count;
    picker.value = character.id;
    document.querySelector('#spotlight-use').dataset.museCharacter = character.id;
    document.querySelector('#spotlight-setup').dataset.setupCharacter = character.id;
    document.querySelector('#spotlight-customize').dataset.character = character.id;
    document.querySelector('#spotlight-save').dataset.save = character.id;
    updateSaved(savedRecords);
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
      image.draggable = false;
      image.width = 1254; image.height = 1254; image.decoding = 'async';
      image.addEventListener('error', () => slide.classList.add('has-failed'));
      slide.append(image);
    } else slide.classList.add('has-failed');
    slide.append(fallback);
    return slide;
  }

  function updateSaved(records) {
    savedRecords = records;
    const character = characters[selected], isSaved = !!records[character.id];
    const button = document.querySelector('#spotlight-save');
    button.classList.toggle('saved', isSaved);
    button.setAttribute('aria-pressed', String(isSaved));
    button.setAttribute('aria-label', `${isSaved ? 'Remove' : 'Save'} ${character.name} ${isSaved ? 'from' : 'to'} My collection`);
    button.title = isSaved ? 'Remove from My collection' : 'Save to My collection';
    const count = document.querySelector('#spotlight-saved-count');
    count.textContent = Object.keys(records).length;
    count.hidden = Object.keys(records).length === 0;
    const handoff = getHandoff(character);
    const link = document.querySelector('#spotlight-use');
    if (handoff) {
      link.href = handoff.url;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.tabIndex = -1;
    }
  }

  function retryImage(id) {
    const index = characters.findIndex(character => character.id === id);
    const image = slides[index]?.querySelector('img');
    if (!image) return;
    image.removeAttribute('src');
    slides[index].classList.remove('has-failed');
    prepareImage(index);
  }

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
  for (const id of ['spotlight-customize', 'spotlight-save', 'spotlight-setup']) document.getElementById(id).disabled = false;
  document.querySelector('[data-how]').disabled = false;
  message.hidden = true;

  previous.addEventListener('click', () => selectCharacter(selected - 1));
  next.addEventListener('click', () => selectCharacter(selected + 1));
  picker.addEventListener('change', () => selectCharacter(characters.findIndex(character => character.id === picker.value)));
  document.querySelector('.showcase').addEventListener('keydown', event => {
    if (event.target.matches('select,input,textarea') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); selectCharacter(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { cancelDrag(); return; }
    if (characters.length < 2 || event.button !== 0 || event.target.closest('button,a,select,input,textarea')) return;
    cancelDrag();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startedAt: event.timeStamp, horizontal: false };
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) { cancelDrag(); return; }
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      // Leave vertical gestures and pinch zoom to the browser.
      if (Math.abs(dy) >= Math.abs(dx)) { cancelDrag(); return; }
      if (Math.abs(dx) < Math.abs(dy) * 1.25) return;
      drag.horizontal = true;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
    }
    slidesRoot.style.setProperty('--drag-x', `${dx}px`);
  });
  stage.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const elapsed = Math.max(1, event.timeStamp - drag.startedAt);
    const threshold = Math.max(32, Math.min(64, stage.clientWidth * .14));
    const flick = Math.abs(dx) >= 20 && elapsed <= 250 && Math.abs(dx) / elapsed >= .4;
    const advance = drag.horizontal && (Math.abs(dx) >= threshold || flick);
    cancelDrag();
    if (advance) selectCharacter(selected + (dx < 0 ? 1 : -1));
  });
  for (const type of ['pointercancel', 'lostpointercapture']) stage.addEventListener(type, event => {
    // Touch starts with implicit capture on the hit child. Transferring it to
    // the stage emits a bubbling lostpointercapture on that child, not a cancel.
    if (drag?.id === event.pointerId && (type === 'pointercancel' || event.target === stage)) cancelDrag();
  });
  window.addEventListener('blur', cancelDrag);
  window.addEventListener('resize', cancelDrag);
  reducedMotion.addEventListener('change', () => { if (characters.length) { clearTimeout(settleTimer); settle(); } });
  return { updateSaved, retryImage };
}
