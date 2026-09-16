# Luke Villaluz — Portfolio

A landing page where each part of the portfolio lives "inside" a real device —
a MacBook, a Sony a6700 camera, an iPod, and a flip phone. Clicking a device
opens the matching page.

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

## Deploy

Deployed to Cloudflare as an assets-only Worker, configured in `wrangler.jsonc`
(custom domain `lukevillaluz.com`, SPA fallback so deep links work).

```bash
npm run build
npx wrangler deploy
```

## Structure

```
index.html            # page shell, fonts, meta, link-preview tags, favicon
public/
  og-image.jpg        # link-preview thumbnail (served unhashed at /og-image.jpg)
src/
  main.jsx            # React entry: asset gate + router
  App.jsx             # route table (/, /about, /work)
  index.css           # global tokens + resets
  data/               # ← all the content lives here
    devices.js        # the landing page: every device, in display order
    profile.js        # name, bio, contact links
    work.js           # experience + projects on the Work page
  pages/
    Home.jsx/.css     # the device grid
    About.jsx/.css    # bio + contact
    Work.jsx/.css     # experience + projects
  components/
    Device.jsx/.css       # generic: frame image + content behind its screen window
    DeviceContent.jsx     # picks the content component by `content.kind`
    CameraGallery.jsx/.css # camera photo(s)
    SpotifyPlayer.jsx/.css # iPod Spotify embed
    PhoneClock.jsx/.css    # flip-phone LCD clock
    Subpage.jsx/.css       # shared layout for About / Work
    Loader.jsx/.css        # first-load overlay
  hooks/
    useAssetsReady.js   # waits on a list of image URLs
  lib/
    preloadImages.js    # image preloading
    assetGate.js        # context + hooks for DOM assets (iframes, media)
    AssetGateProvider.jsx
  assets/
    frames/           # device frame images (transparent screen window)
    images/           # single images (e.g. laptop)
    camera/           # camera photos — see below
```

`src/data/` is the single source of truth for what the site says.

## Common edits

- **Change the name or bio:** `src/data/profile.js`.
- **Change experience / projects:** `src/data/work.js`. A bullet is either a
  plain string or `{ text, url }` to render a link.
- **Change the Spotify playlist:** the `playlistId` on the `music` device (the
  part after `/playlist/` in the share URL). Playlist must be public. Adding or
  removing songs needs no code change — the embed scrolls its own tracklist.
- **Add / reorder / remove a device:** edit the `DEVICES` array in
  `src/data/devices.js`. Each device's `content.kind` is one of `image`,
  `gallery`, `spotify`, `clock` (see `DeviceContent.jsx`).
- **Add camera photos:** drop files into `src/assets/camera/`. They load
  automatically (sorted by filename) via `import.meta.glob` — no code change.

## Images

Everything ships as WebP, and the first-load overlay waits for the device
frames plus the first content image before revealing the page — so asset size
is directly how long a visitor stares at a spinner. Keep exports small:

- **Photos:** ~1200px on the long edge, WebP quality ~82. They render at a few
  hundred pixels; a full-size camera export is ~10× bigger than it needs to be.
- **Frames:** export at roughly 2× their `maxWidth` in `devices.js`, WebP
  quality ~88 (they need alpha for the transparent screen window).

The current set totals ~400 KB. Before optimizing it was ~2.3 MB.

## How the "inside the device" effect works

Each frame image has a transparent screen "window". `Device` places the content
absolutely behind the frame and layers the frame on top, so the bezel overlaps
the content edges. The window rect (`screenRect`, in % of the frame) and a small
`bleed` (content tucked under the bezel) are configured per device in
`devices.js`.

## Adding a new frame

Measure the transparent window rect as percentages of the (content-cropped)
frame image and add it as `screenRect`. The originals were measured with a small
Python/Pillow script (flood-fill the interior transparent region).
