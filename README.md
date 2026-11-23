# art

Navy Nunnapat's illustration and comics site. Plain HTML/CSS/JS, no build
step. Served by GitHub Pages at https://navybluecheese.github.io/art/
(and at `yourdomain.com/art/` automatically if a custom domain is ever set
on the main site).

## Files

```
index.html        the whole page
style.css         layout and colours (variables at the top)
gallery.js        the click-to-enlarge viewer
favicon.svg
images/full/      web-sized images (max 2400 px, WebP)
images/thumb/     gallery thumbnails (max 900 px, WebP)
images/og.jpg     preview image used when the link is shared
```

## Adding a piece

1. Export it, then make two WebP copies: one at most 2400 px on the long
   side for `images/full/`, one at most 900 px for `images/thumb/`, both
   with the same file name (e.g. `ill-30.webp`). Squoosh (squoosh.app) does
   this in the browser.
2. In `index.html`, copy an existing `<a class="tile" ...>` block in the
   right section, change the file names, set `--r` to width ÷ height, and
   update `width`, `height`, and `alt`.
3. The `data-i` numbers set the viewer's order. They don't need to be
   consecutive, only increasing in the order you want.

## Preview locally

From this folder: `python -m http.server` and open http://localhost:8000.
(Opening index.html by double-clicking also works.)
