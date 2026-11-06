const canonicalOrigin = 'https://persa.bubblai.com';
const characterIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function checkId(id) {
  if (typeof id !== 'string' || !characterIdPattern.test(id)) throw new TypeError('Invalid character ID');
}

export function characterSlug(id) {
  checkId(id);
  return id.replaceAll('-', '');
}

// Shared links identify a preset. Browser-local tone changes are never embedded.
export function characterShareUrl(id) {
  return new URL(`/character/${characterSlug(id)}`, canonicalOrigin).href;
}

export function characterIdFromUrl(href, characters) {
  try {
    const url = new URL(href);
    const path = decodeURIComponent(url.pathname);
    // A character path takes precedence over an old query parameter. Do not
    // let an unknown or malformed path silently select a different character.
    const pathMatch = path.match(/^\/character\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
    const id = path.startsWith('/character/') ? pathMatch?.[1] : url.searchParams.get('character');
    return characters.find(character => character.id === id || characterSlug(character.id) === id)?.id || null;
  } catch { return null; }
}

// Keep the saved/full collection context; the homepage uses clean character
// paths. Both forms preserve incoming campaign parameters and page anchors.
export function withCharacterInUrl(href, id) {
  checkId(id);
  const url = new URL(href);
  if (url.pathname === '/collection.html') {
    url.searchParams.set('character', id);
  } else {
    url.pathname = `/character/${characterSlug(id)}`;
    url.searchParams.delete('character');
  }
  return url.href;
}
