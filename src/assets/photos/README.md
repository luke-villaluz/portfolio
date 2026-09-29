# Photos

One folder per album. The folder name becomes the heading on `/photos`, and the
images inside become that album's horizontal strip.

```
photos/
  Palouse/                    ->  "Palouse"
    001.jpg
    002.jpg
  gifford pinchot forest/     ->  "Gifford Pinchot Forest"
    sunrise.jpg
```

To add a trip: make a folder, drop the photos in, commit, push. Nothing else —
no code change, no resizing, no list to update anywhere.

## Naming

- **Album heading** comes from the folder name. A folder that's already
  capitalised is left alone (`Palouse`, `SLO`); an all-lowercase one gets title
  cased (`gifford pinchot forest` → `Gifford Pinchot Forest`). Dashes and
  underscores become spaces.
- **Album order** is alphabetical. To force a different order, prefix folders
  with numbers — `01-Palouse`, `02-Gifford Pinchot Forest`. The number is
  stripped from the heading.
- **Photo order** within an album is by filename, sorted naturally, so
  `1.jpg, 2.jpg, 10.jpg` come out in that order rather than `1, 10, 2`.

## Sizes

Drop in whatever your camera or Lightroom produces — full-size exports are
fine. `scripts/build-photos.mjs` runs before every build and resizes each photo
to a fixed height (width follows the photo's own aspect ratio, so portrait
shots and panoramas sit in the same row at the same height, uncropped) and
re-encodes it as WebP.

The results land in `src/assets/photos-optimized/`, which is gitignored — only
the originals in this folder are committed. Deleting a photo here removes its
optimized copy on the next build.
