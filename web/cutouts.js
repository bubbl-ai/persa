// The home page shows each plush cut out of its white ground, standing on the
// character's own colour (cards.css). One WebP with transparency per id, in
// /cutouts/. They are derived pictures: the catalog, the detail view, the saved
// collection, downloads and every Muse handoff keep the original artwork.
//
// An id that is not listed here (a character added later) keeps its original
// picture, and the page gives it a white plate instead of a bare colour.
const CUTOUTS = new Set([
  "wednesday",
  "taylor-swift",
  "mark-zuckerberg",
  "jensen-huang",
  "turkey",
  "hailey-bieber",
  "mona-lisa",
  "barbie",
  "harry-potter",
  "charlie-chaplin",
  "michael-jackson",
  "olivia-rodrigo",
  "marilyn-monroe",
  "drake",
  "lionel-messi",
  "kylie-jenner",
  "mrbeast",
  "the-rock",
  "spongebob",
  "hello-kitty",
  "joker"
]);

export function cutoutFor(character) {
  return character && CUTOUTS.has(character.id) ? `/cutouts/${character.id}.webp` : null;
}
