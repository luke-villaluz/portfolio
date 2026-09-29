# Photos

One folder per album. The folder name becomes the heading on `/photos`, and the
images inside become that album's horizontal strip.

```
photos/
  Palouse/                    ->  "Palouse"
    001.jpg
    002.jpg
  Gifford Pinchot Forest/     ->  "Gifford Pinchot Forest"
    sunrise.jpg
```

To add a trip: make a folder, drop the photos in, commit, push. Nothing else —
no code change, no resizing, no list to update anywhere.

## Naming

- **Album heading is the folder name, exactly as you type it.** Nothing is
  capitalised, reworded, or stripped — name the folder `Gifford Pinchot Forest`
  and that's the heading. Name it `gifford pinchot forest` and that's the
  heading too.
- **Album order** is alphabetical by folder name.
- **Photo order** within an album is by filename, sorted naturally, so
  `1.jpg, 2.jpg, 10.jpg` come out in that order rather than `1, 10, 2`.

## Sizes

Drop in whatever your camera or Lightroom produces — full-size exports are
fine. `scripts/build-photos.mjs` runs before every build and resizes each photo
to a fixed height (width follows the photo's own aspect ratio, so portrait
shots and panoramas sit in the same row at the same height, uncropped) and
re-encodes it as WebP.

## What gets committed

**Your originals in this folder are gitignored.** They're ~10MB each, and git
keeps every version of every file forever, so committing them would bloat the
repo permanently — one trip is ~200MB. Keep them in Lightroom or on your
backup drive.

What *is* committed is `src/assets/photos-optimized/` — the resized WebP copies,
around 100KB each — plus the generated album list. That's what the site serves,
and it's what CI builds from, so deploys don't need your originals at all.

So the flow after dropping a folder in here is:

```bash
npm run photos    # resize the new photos (npm run dev/build does this too)
git add -A
git commit -m "Add Palouse photos"
git push
```

If you ever delete *every* album, the script leaves the generated files alone
(it can't tell that apart from a fresh clone) — delete
`src/assets/photos-optimized/` and `src/data/photoAlbums.generated.js` by hand.
Removing one album out of several prunes normally.
