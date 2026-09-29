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

Hosted on Cloudflare as an assets-only Worker, configured in `wrangler.jsonc`
(custom domain `lukevillaluz.com`, SPA fallback so deep links work).

**Normally you don't run anything.** `.github/workflows/deploy.yml` deploys on
every push to `main`: GitHub spins up a fresh Linux machine, installs the
dependencies, lints, builds (which resizes any new photos), and runs
`wrangler deploy`. Push a folder of photos and the live site updates itself.

### One-time setup

The workflow needs permission to talk to your Cloudflare account. Credentials
never get committed — they live in GitHub's encrypted secrets, which workflows
can read and people can't.

1. **Make a Cloudflare API token.** Cloudflare dashboard → My Profile → API
   Tokens → Create Token → use the **Edit Cloudflare Workers** template →
   Create. Copy the token; it's shown exactly once.
2. **Grab your account ID.** It's in the URL when you're in the Cloudflare
   dashboard (`dash.cloudflare.com/<account-id>/…`), and on the Workers
   overview page.
3. **Add both to GitHub.** Repo → Settings → Secrets and variables → Actions →
   New repository secret, twice:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

Push to `main` and watch it run under the repo's **Actions** tab. A failed step
shows its logs there — that's where to look when a deploy doesn't land.

### Deploying by hand

Still works, and it's what to fall back on if CI is broken:

```bash
npm run build
npx wrangler deploy
```

### What the workflow does, step by step

| Step | Why |
| --- | --- |
| `actions/checkout` | copies the repo onto the runner |
| `actions/setup-node` | installs the Node version in `.node-version`, caches npm |
| `npm ci` | installs *exactly* what `package-lock.json` pins, so you deploy what you tested |
| `npm run lint` | a broken build fails here instead of on the live site |
| `npm run build` | `prebuild` resizes new photos, then Vite bundles into `dist/` |
| `wrangler-action` | uploads `dist/` to Cloudflare |

## Structure

```
index.html            # page shell, fonts, meta, link-preview tags, favicon
public/
  og-image.jpg        # link-preview thumbnail (served unhashed at /og-image.jpg)
scripts/
  build-photos.mjs    # resizes src/assets/photos/ before every dev/build
.github/workflows/
  deploy.yml          # build + deploy on every push to main
src/
  main.jsx            # React entry: asset gate + router
  App.jsx             # route table (/, /about, /work, /photos)
  index.css           # global tokens + resets
  data/               # ← all the content lives here
    devices.js        # the landing page: every device, in display order
    profile.js        # name, bio, contact links
    work.js           # experience + projects on the Work page
    photoAlbums.generated.js  # GENERATED, gitignored — see scripts/build-photos.mjs
  pages/
    Home.jsx/.css     # the device grid
    About.jsx/.css    # bio + contact
    Work.jsx/.css     # experience + projects
    Photos.jsx/.css   # one strip per album folder
  components/
    Device.jsx/.css       # generic: frame image + content behind its screen window
    DeviceContent.jsx     # picks the content component by `content.kind`
    CameraGallery.jsx/.css # the photo shown in the camera's LCD
    SpotifyPlayer.jsx/.css # iPod Spotify embed
    PhoneClock.jsx/.css    # flip-phone LCD clock
    Subpage.jsx/.css       # shared layout for About / Work / Photos
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
    camera/           # the cover photo shown inside the camera on the landing page
    photos/           # ← your albums, one folder per trip (see its README)
    photos-optimized/ # GENERATED, gitignored — resized copies of the above
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
- **Add a photo album:** make a folder in `src/assets/photos/` and drop the
  photos in. See [Photo albums](#photo-albums) below.
- **Change the photo in the camera's LCD:** replace the file in
  `src/assets/camera/`.

## Photo albums

Each folder in `src/assets/photos/` becomes a section on `/photos` — folder
name as the heading, its photos as a horizontal strip, a divider, then the next
album. Clicking the camera on the landing page opens it.

```
src/assets/photos/
  Palouse/                    ->  "Palouse"
  gifford pinchot forest/     ->  "Gifford Pinchot Forest"
```

Adding a trip is: make the folder, drop photos in, commit, push. No code
change, no resizing, no list to keep in sync. `src/assets/photos/README.md`
covers naming and ordering in full.

**How it works.** `scripts/build-photos.mjs` runs before every `npm run dev`
and `npm run build` (via the `predev` / `prebuild` scripts npm runs
automatically). It walks the album folders, resizes every photo to the same
pixel height — width follows each photo's own aspect ratio, so portrait shots
and panoramas line up at equal height without being cropped — re-encodes them
as WebP into `src/assets/photos-optimized/`, and writes
`src/data/photoAlbums.generated.js` with each photo's final dimensions so the
page reserves the right space and the strip doesn't jump while loading.

Both outputs are gitignored: they're derived from your originals and rebuilt on
every machine and in CI, so only the originals are committed. A photo already
processed is skipped on later builds unless you've changed it, and deleting an
original removes its optimized copy on the next build.

To change how tall photos render, edit `--photo-height` in `Photos.css`; to
change the exported resolution, edit `OUTPUT_HEIGHT` in the script.

## Images

Everything ships as WebP, and the first-load overlay waits for the device
frames plus the first content image before revealing the page — so asset size
is directly how long a visitor stares at a spinner.

Album photos are exempt: they're resized automatically, lazy-loaded, and live
on `/photos` rather than the landing page, so they never delay first paint.
Drop full-size exports in and let the build handle them.

For the handful of images that *are* committed at their final size, keep
exports small:

- **Frames:** export at roughly 2× their `maxWidth` in `devices.js`, WebP
  quality ~88 (they need alpha for the transparent screen window).
- **Camera cover / laptop photo:** ~1200px on the long edge, WebP quality ~82.

The landing page totals ~400 KB. Before optimizing it was ~2.3 MB.

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
