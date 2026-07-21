# Luke Villaluz — Portfolio

A landing page where each part of the portfolio lives "inside" a real device —
a MacBook, a Sony a6700 camera, an iPod, and a flip phone.

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build (dist/)
npm run preview  # preview the production build
npm run lint     # ESLint
npm run format   # Prettier (writes src/)
```

Requires Node (installed via Homebrew: `brew install node`).

## Structure

```
index.html            # page shell, fonts, meta, favicon
src/
  main.jsx            # React entry
  App.jsx             # renders the device grid from the config
  App.css             # page / header / grid layout only
  index.css           # global tokens + resets
  data/
    devices.js        # ← THE config: site name + every device
  components/
    Device.jsx/.css       # generic: frame PNG + content behind its screen window
    DeviceContent.jsx     # picks the content component by `content.kind`
    CameraGallery.jsx/.css # camera photo(s)
    SpotifyPlayer.jsx/.css # iPod Spotify embed
    PhoneClock.jsx/.css    # flip-phone LCD clock
  assets/
    frames/           # device frame PNGs (transparent screen window)
    images/           # single images (e.g. laptop)
    camera/           # camera photos — see below
```

`src/data/devices.js` is the single source of truth for what's on the page.

## Common edits

- **Change the name:** `SITE.name` in `src/data/devices.js`.
- **Change the Spotify playlist:** the `playlistId` on the `music` device (the
  part after `/playlist/` in the share URL). Playlist must be public.
- **Add / reorder / remove a device:** edit the `DEVICES` array. Each device's
  `content.kind` is one of `image`, `gallery`, `spotify`, `clock` (see
  `DeviceContent.jsx`).
- **Add camera photos:** drop image files into `src/assets/camera/`. They load
  automatically (sorted by filename) via `import.meta.glob` — no code change.

## How the "inside the device" effect works

Each frame PNG has a transparent screen "window". `Device` places the content
absolutely behind the frame and layers the frame on top, so the bezel overlaps
the content edges. The window rect (`screenRect`, in % of the frame) and a small
`bleed` (content tucked under the bezel) are configured per device in
`devices.js`.

## Adding a new frame

Measure the transparent window rect as percentages of the (content-cropped)
frame PNG and add it as `screenRect`. The originals were measured with a small
Python/Pillow script (flood-fill the interior transparent region).
