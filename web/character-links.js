const canonicalOrigin = 'https://persa.bubblai.com';
const characterIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function checkId(id) {
  if (typeof id !== 'string' || !characterIdPattern.test(id)) throw new TypeError('Invalid character ID');
}

// Shared links identify a preset. Browser-local tone changes are never embedded.
export function characterShareUrl(id) {
  checkId(id);
  const url = new URL('/', canonicalOrigin);
  url.searchParams.set('character', id);
  return url.href;
}

export function characterIdFromUrl(href, characters) {
  try {
    const id = new URL(href).searchParams.get('character');
    return characters.some(character => character.id === id) ? id : null;
  } catch { return null; }
}

// Browsing changes only the character; keep campaign parameters and page anchors.
export function withCharacterInUrl(href, id) {
  checkId(id);
  const url = new URL(href);
  url.searchParams.set('character', id);
  return url.href;
}
