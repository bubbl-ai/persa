// The shared app owns catalog, personality, favorites, dialogs, and setup.
import { cutoutFor } from './cutouts.js';
export function mountSpotlight({ characters, saved, getHandoff, initialCharacterId, onSelect }) {
  const stage = document.querySelector('#stage');
  // The whole card turns: a swipe may start on the plush, the name or a button.
  const swipeArea = stage.closest('.showcase') || stage;
  const slidesRoot = document.querySelector('#slides');
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const message = document.querySelector('#stage-message');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('#motion-toggle');
  let motionEnabled = true, poseFrame;
  try { motionEnabled = localStorage.getItem('persa.preview-motion') !== 'off'; } catch {}
  let slides = [], selected = 0, settleTimer, drag, savedRecords = saved;
  let ignoreClickUntil = 0, wheelSum = 0, wheelLocked = false, wheelLast = 0, wheelTurnedAt = 0, wheelTimer;

  function stopPose() {
    cancelAnimationFrame(poseFrame);
    slides.forEach(slide => slide.classList.remove('is-posing'));
  }

  function playPose() {
    stopPose();
    if (!motionEnabled || reducedMotion.matches || document.hidden || drag) return;
    const slide = slides[selected], image = slide?.querySelector('img');
    if (!image?.complete || !image.naturalWidth || slide.classList.contains('has-failed')) return;
    poseFrame = requestAnimationFrame(() => slide.classList.add('is-posing'));
  }

  function updateMotion() {
    stopPose();
    motionToggle.disabled = reducedMotion.matches;
    motionToggle.setAttribute('aria-pressed', String(motionEnabled && !reducedMotion.matches));
    motionToggle.textContent = reducedMotion.matches ? 'Motion reduced' : motionEnabled ? 'Preview motion on' : 'Preview motion off';
    motionToggle.title = reducedMotion.matches ? 'Your device preference reduces motion' : 'Toggle short avatar preview poses';
    // The hover loops in cards.css read this, so the toggle and the device setting stop them too.
    document.body.classList.toggle('persa-motion-off', !motionEnabled || reducedMotion.matches);
    playPose();
  }

  function cancelDrag() {
    const pointer = drag;
    drag = null;
    stage.classList.remove('is-dragging');
    swipeArea.classList.remove('is-dragging');
    slidesRoot.style.removeProperty('--drag-x');
    if (pointer && swipeArea.hasPointerCapture(pointer.id)) swipeArea.releasePointerCapture(pointer.id);
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
    // The cut-out when there is one; the original picture on a white plate otherwise.
    if (load && !image.hasAttribute('src')) image.src = (!slide.classList.contains('is-plain') && cutoutFor(characters[index])) || characters[index].avatar.preview;
  }

  function settle() {
    stage.classList.remove('is-moving');
    document.querySelector('#announcement').textContent = `${characters[selected].name}, ${selected + 1} of ${characters.length}. ${characters[selected].tags.join(', ')}.`;
    playPose();
  }

  function selectCharacter(index, animate = true) {
    if (!characters.length) return;
    cancelDrag();
    stopPose();
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
    // The page takes the selected character's colour (night.css). Not data-character: the
    // page's click handling reads that attribute on the way up from any click.
    document.body.dataset.pop = character.id;
    document.querySelector('#character-name').textContent = character.name;
    // The card sizes the name from its length, so every name is one line and the buttons never move.
    document.querySelector('#character-name').style.setProperty('--name-len', character.name.length);
    // One element per word, so the card can show them as separate labels.
    document.querySelector('#stage-personality').replaceChildren(...character.tags.map(tag => {
      const label = document.createElement('span');
      label.textContent = tag;
      return label;
    }));
    const count = `${String(selected + 1).padStart(2, '0')} / ${characters.length}`;
    document.querySelector('#stage-count').textContent = count;
    document.querySelector('#page-count').textContent = count;
    document.querySelector('#spotlight-use').dataset.museCharacter = character.id;
    document.querySelector('#spotlight-download').dataset.downloadHtml = character.id;
    document.querySelector('#spotlight-download').setAttribute('aria-label', `Save ${character.name} as HTML`);
    document.querySelector('#spotlight-copy').dataset.copyCharacter = character.id;
    const detailsButton = document.querySelector('#spotlight-customize');
    detailsButton.dataset.character = character.id;
    detailsButton.textContent = character.fixedVoice ? 'Meet Turkey' : 'Tune personality';
    document.querySelector('#spotlight-save').dataset.save = character.id;
    document.querySelector('#spotlight-share').dataset.shareCharacter = character.id;
    document.querySelector('#spotlight-share').setAttribute('aria-label', `Share ${character.name}`);
    updateSaved(savedRecords);
    onSelect?.(character);
    if (moving) settleTimer = setTimeout(settle, 550); else settle();
  }

  function makeSlide(character, index) {
    const slide = document.createElement('div');
    slide.className = 'slide is-away';
    slide.dataset.character = character.id;
    const sway = ['taylor-swift', 'michael-jackson', 'olivia-rodrigo', 'drake'];
    const bow = ['charlie-chaplin', 'mona-lisa', 'harry-potter', 'wednesday'];
    const bounce = ['spongebob', 'hello-kitty', 'mrbeast', 'lionel-messi'];
    slide.dataset.pose = sway.includes(character.id) ? 'sway' : bow.includes(character.id) ? 'bow' : bounce.includes(character.id) ? 'bounce' : 'pose';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${character.name}, ${index + 1} of ${characters.length}`);
    const fallback = document.createElement('span');
    fallback.className = 'image-fallback';
    fallback.textContent = `${character.name} preview is unavailable. You can still browse the wardrobe.`;
    if (!cutoutFor(character)) slide.classList.add('is-plain');
    if (character.avatar?.preview) {
      const image = document.createElement('img');
      image.alt = `Shared plush Muse in a ${character.name} costume`;
      image.draggable = false;
      image.width = 1254; image.height = 1254; image.decoding = 'async';
      image.addEventListener('error', () => {
        // A cut-out that will not load falls back to the original picture once.
        if (!slide.classList.contains('is-plain') && cutoutFor(character)) { slide.classList.add('is-plain'); image.src = character.avatar.preview; return; }
        slide.classList.add('has-failed'); slide.classList.remove('is-posing');
      });
      image.addEventListener('load', () => { if (index === selected && !stage.classList.contains('is-moving')) playPose(); });
      image.addEventListener('animationend', () => slide.classList.remove('is-posing'));
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
  selected = Math.max(0, characters.findIndex(character => character.id === (initialCharacterId || 'taylor-swift')));
  selectCharacter(selected, false);
  previous.disabled = next.disabled = characters.length < 2;
  stage.setAttribute('aria-busy', 'false');
  document.querySelector('#character-info').setAttribute('aria-busy', 'false');
  for (const id of ['spotlight-customize', 'spotlight-save', 'spotlight-download', 'spotlight-copy', 'spotlight-share']) document.getElementById(id).disabled = false;
  updateMotion();
  motionToggle.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    try { localStorage.setItem('persa.preview-motion', motionEnabled ? 'on' : 'off'); } catch {}
    updateMotion();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPose(); });
  message.hidden = true;

  previous.addEventListener('click', () => selectCharacter(selected - 1));
  next.addEventListener('click', () => selectCharacter(selected + 1));
  document.querySelector('.showcase').addEventListener('keydown', event => {
    if (event.target.matches('select,input,textarea') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); selectCharacter(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  swipeArea.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { cancelDrag(); return; }
    if (characters.length < 2 || event.button !== 0 || event.target.closest('select,input,textarea')) return;
    cancelDrag();
    const onControl = !!event.target.closest('button,a');
    if (!onControl) stopPose();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startedAt: event.timeStamp, horizontal: false,
      onPlush: !onControl && stage.contains(event.target) };
  });
  swipeArea.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) { cancelDrag(); return; }
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      // Leave vertical gestures and pinch zoom to the browser.
      if (Math.abs(dy) >= Math.abs(dx)) { cancelDrag(); return; }
      if (Math.abs(dx) < Math.abs(dy) * 1.25) return;
      drag.horizontal = true;
      stopPose();
      swipeArea.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
      swipeArea.classList.add('is-dragging');
    }
    slidesRoot.style.setProperty('--drag-x', `${dx}px`);
  });
  swipeArea.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const elapsed = Math.max(1, event.timeStamp - drag.startedAt);
    const threshold = Math.max(32, Math.min(64, stage.clientWidth * .14));
    const flick = Math.abs(dx) >= 20 && elapsed <= 250 && Math.abs(dx) / elapsed >= .4;
    const advance = drag.horizontal && (Math.abs(dx) >= threshold || flick);
    // A tap on the plush (no drag, no scroll) plays its move again: the way a phone gets what a mouse gets from hovering.
    const tapped = drag.onPlush && !drag.horizontal && Math.abs(dx) < 10 && Math.abs(event.clientY - drag.y) < 10 && elapsed < 500;
    // A swipe that began on a button turns the card; it must not also press the button.
    if (drag.horizontal) ignoreClickUntil = event.timeStamp + 400;
    cancelDrag();
    if (advance) selectCharacter(selected + (dx < 0 ? 1 : -1));
    else if (tapped) playPose();
  });
  swipeArea.addEventListener('click', event => {
    if (event.timeStamp > ignoreClickUntil) return;
    event.preventDefault(); event.stopPropagation();
  }, true);
  // A mouse dragging the "Open in Muse" link would start a link drag and end the swipe.
  swipeArea.addEventListener('dragstart', event => event.preventDefault());
  for (const type of ['pointercancel', 'lostpointercapture']) swipeArea.addEventListener(type, event => {
    // Touch starts with implicit capture on the hit child. Transferring it to
    // the card emits a bubbling lostpointercapture on that child, not a cancel.
    if (drag?.id === event.pointerId && (type === 'pointercancel' || event.target === swipeArea)) cancelDrag();
  });
  // Sideways scroll turns the card too: two fingers on a trackpad, a Magic Mouse, or Shift + wheel.
  // One gesture is one character. A trackpad keeps sending its fading momentum after the fingers
  // lift, so the card waits for the gesture to end (a pause), or for a clearly new push, before
  // it turns again. Up and down is left to the page.
  swipeArea.addEventListener('wheel', event => {
    if (characters.length < 2 || event.ctrlKey || event.metaKey) return;
    let dx = event.deltaX, dy = event.deltaY;
    if (event.shiftKey && !dx) { dx = dy; dy = 0; }
    if (!dx || Math.abs(dx) <= Math.abs(dy)) return;
    // Handled here, so the browser does not read it as "go back a page".
    event.preventDefault();
    if (event.deltaMode === 1) dx *= 16; else if (event.deltaMode === 2) dx *= swipeArea.clientWidth;
    const size = Math.abs(dx);
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelSum = 0; wheelLast = 0; wheelLocked = false; }, 180);
    if (wheelLocked && event.timeStamp - wheelTurnedAt > 320 && size > wheelLast * 1.6 + 6) { wheelLocked = false; wheelSum = 0; }
    wheelLast = size;
    if (wheelLocked) return;
    wheelSum += dx;
    if (Math.abs(wheelSum) < 48) return;
    const step = wheelSum > 0 ? 1 : -1;
    wheelSum = 0; wheelLocked = true; wheelTurnedAt = event.timeStamp;
    selectCharacter(selected + step);
  }, { passive: false });
  window.addEventListener('blur', cancelDrag);
  window.addEventListener('resize', cancelDrag);
  reducedMotion.addEventListener('change', () => {
    if (characters.length) {
      clearTimeout(settleTimer);
      stage.classList.remove('is-moving');
      updateMotion();
    }
  });
  return {
    updateSaved,
    retryImage,
    selectCharacter(id, animate = false) {
      const index = characters.findIndex(character => character.id === id);
      if (index !== -1) selectCharacter(index, animate);
    },
    get selectedId() { return characters[selected].id; }
  };
}
