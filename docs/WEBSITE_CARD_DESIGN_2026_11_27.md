# Homepage card design — November 27, 2026

Status: published November 27, 2026. Live checks are recorded at the end.

Most visitors arrive on a phone from TikTok and Instagram. The homepage is now a
dark page where each character owns a colour, and the spotlight is one card in
that colour. No character, personality, handoff payload, link or analytics tag
changes. `/collection.html` keeps the light design and every control.

## What a visitor sees

1. **A dark page.** The second line of the heading takes the selected
   character's colour. The heading and the opening paragraph keep their exact
   words.
2. **One card.** The spotlight, the name, the three words and the buttons sit on
   one card in the character's colour. The plush is lifted off its white ground
   and stands on that colour. The name is one line, sized from its length.
3. **The whole card turns.** A sideways swipe can start on the plush, the name
   or a button (a swipe that starts on a button does not press it). A sideways
   trackpad scroll or Shift + wheel turns one character per gesture. Arrows and
   arrow keys work as before.
4. **Livelier poses.** The four whole-image poses are larger. They play once on
   arrival, again when the plush is tapped, and loop while a mouse rests on the
   card or a tile. Reduced motion stops them. The artwork is still one flat
   picture, so nothing waves or sings.
5. **Tiles on colour.** Each tile shows the plush on its colour, the name, one
   line and **Open in Muse** in that colour. Tapping the tile opens the popup.
6. **A matching popup.** On the homepage the character popup is dark, uses the
   character's colour, shows the cut-out, and has pill controls and filled
   sliders.
7. **A lean page.** One main action, and only what a visitor needs beside it.
   The list of what is hidden is below.

## What this replaces

These earlier direction notes no longer describe the homepage. They still
describe `/collection.html` where it applies.

- October 10: "a white, borderless spotlight stage".
- November 3: "Use white avatar surfaces without brightness/blend/masking
  filters." The original artwork is untouched and still ships; the homepage
  shows a derived cut-out of it. No blend, brightness or CSS mask is applied.
- November 6: "compact inline **How it works** below the stage".
- October 19: "a swipe hint immediately below the stage".
- November 26: the homepage row headed **Trending**.

Still in force: the exact heading and opening text, the name and primary action
above the fold down to 320×568, swipe, keyboard and arrows, vertical scrolling
and pinch zoom, `web/app.js` owning state and `web/spotlight.js` the stage,
character links, the usage counter, and the unavailable state for a character
without artwork.

## Files

All new sheets load on the homepage only, after `spotlight.css`, in this order.

| File | What it holds |
|---|---|
| `web/night.css` | The dark page and one colour per character id (`--pop`). |
| `web/cards.css` | The card, the tiles, the poses, the count of Muse opens, the no-picture state. |
| `web/popup.css` | The character popup on the homepage. |
| `web/lean.css` | Everything the homepage hides. One line per item. |
| `web/cutouts.js` | Which character ids have a cut-out. |
| `web/cutouts/<id>.webp` | The cut-outs: 1000×1000 WebP with transparency. |

`web/spotlight.js` sets `body[data-pop]` to the selected id (not
`data-character`, which the page's click handling reads), draws the three
words as one span each, and turns the card. `web/app.js` uses the cut-out for
homepage tiles and the popup, and falls back to the original picture if a
cut-out fails to load. Removing the four `<link>` lines in `web/index.html`
returns the white page; the scripts tolerate their absence.

## Rules that keep it even

- One spacing scale, `--s1` to `--s7` (4, 8, 12, 16, 20, 24, 44 and 64 wide).
  Inside the card nothing is further apart than `--s5`. The card to the next
  section is `--s7`.
- One left and right edge for the header, the heading, the card and the tiles.
- Every cut-out is framed the same way, so the name sits the same distance
  under every character and nothing jumps on a swipe.
- Controls are round. Tiles are 24, the card 36 on phones and 40 wide.
- No shadows.

## Adding or changing a character

1. **Colour.** Add one line to `web/night.css` for the id. Pick a colour light
   enough for dark ink and different from its neighbours.
2. **Cut-out.** Without one, the character still works: the homepage shows the
   original picture on a white plate. To make one on a Mac, lift the subject
   with Apple's on-device segmentation, then frame it.

   ```swift
   // cut.swift — usage: swift cut.swift <out dir> <picture.png>...
   import Foundation
   import Vision
   import CoreImage
   import AppKit
   let args = CommandLine.arguments
   let ctx = CIContext()
   for path in args.dropFirst(2) {
     let url = URL(fileURLWithPath: path)
     guard let src = CIImage(contentsOf: url) else { continue }
     let handler = VNImageRequestHandler(ciImage: src, options: [:])
     let req = VNGenerateForegroundInstanceMaskRequest()
     try handler.perform([req])
     guard let obs = req.results?.first else { continue }
     let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
     let dest = URL(fileURLWithPath: args[1]).appendingPathComponent(url.deletingPathExtension().lastPathComponent + ".png")
     try ctx.writePNGRepresentation(of: CIImage(cvPixelBuffer: buf), to: dest, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
   }
   ```

   ```python
   # frame.py — the figure 880 of 1000 tall (at most 900 wide), centred, feet on y=960
   from PIL import Image
   import sys
   im = Image.open(sys.argv[1]).convert('RGBA')
   box = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
   fig = im.crop(box)
   k = min(880 / fig.height, 900 / fig.width)
   fig = fig.resize((round(fig.width * k), round(fig.height * k)), Image.LANCZOS)
   out = Image.new('RGBA', (1000, 1000), (0, 0, 0, 0))
   out.alpha_composite(fig, (round(500 - fig.width / 2), 960 - fig.height))
   out.save(sys.argv[2], 'WEBP', quality=88, method=6)
   ```

   Save it as `web/cutouts/<id>.webp` and add the id to `web/cutouts.js`.
   Check the edge on a light, a coloured and a dark ground. A cut-out is a
   derived picture: re-cut it whenever the original changes.
3. **No artwork.** Do nothing. The card says the preview is unavailable in dark
   ink on the character's colour, and tiles use a dim tint of that colour.

`test/cutouts.test.js` checks that every listed cut-out exists, is a WebP with
transparency at 1000×1000, and belongs to a catalog character.

## What the homepage hides

Everything below is hidden in `web/lean.css`, not deleted. The scripts still
write to several of these controls, and `/collection.html` shows all of them.
Deleting a line there brings its item back.

- On the card: the swipe hint and the Preview motion switch. Share sits beside
  the heart.
- In the header: **Saved**, until something is saved, and the **?** link.
- On the page: **How it works** and the **Trending** row of new additions.
- On every tile: the category label, the heart, the three words, the
  "Personality + costume" line and Share.
- In the popup: the top label, the costume sentence, the check line, the
  personality instructions drawer, **Save character as HTML**, **More ways to
  save** and Share.

**What that costs.** With **More ways to save** hidden, nothing on the homepage
leads to the copy-by-hand screen (the complete combo, the JSON backup, the Grok
text). It remains on `/collection.html`. If Muse opens without the message
filled in, a homepage visitor cannot copy the combo by hand. Restoring one link
is a one-line change in `web/lean.css`.

## Not in this release

An order by use ("trending") with per-character counts was prototyped on local
data only. It needs a durable store and is not part of this release. The
homepage requests nothing new from the server, and the only number it shows is
the measured count of Muse opens from [the usage counter](USAGE_COUNTER.md).

## Verification before publishing

All 119 tests passed (the 117 existing ones and two new cut-out checks), with
`npm run build:web`, `node --check web/app.js`, `node --check web/spotlight.js`
and `git diff --check`. Browser checks on the built site covered all 21
characters at 320×568, 375×667, 390×844, 430×932 and 1280×900: every cut-out
loads, the name and **Open in Muse** stay above the fold, the page never
scrolls sideways, and no script error is raised. Also checked: arrows, the
popup for a tunable character and for Turkey, a character link on reload, the
count of Muse opens shown and hidden, and `/collection.html` unchanged.
Marketing requests were blocked and no Muse link was opened.

Not checked: real devices, screen readers, and native Muse behavior.
