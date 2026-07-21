import macbookFrame from '../assets/frames/macbook_frame.png'
import cameraFrame from '../assets/frames/a6700_frame.png'
import ipodFrame from '../assets/frames/ipod_frame.png'
import phoneFrame from '../assets/frames/cats22_frame.png'
import meCoding from '../assets/images/me_coding.jpg'

// All camera photos, auto-loaded from src/assets/camera/. Drop new photos into
// that folder and they appear here (sorted by filename); Vite fingerprints each
// for cache-busting. No import lines to maintain.
const cameraPhotos = Object.entries(
  import.meta.glob('../assets/camera/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
    eager: true,
    import: 'default',
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

/**
 * The devices shown on the landing page, in display order.
 *
 * Each entry describes a device for the <Device> component:
 *  - frame:      imported frame PNG (transparent screen "window")
 *  - alt:        alt text for the frame image
 *  - label:      caption under the device
 *  - maxWidth:   max render width in px
 *  - bleed?:     % the screen content extends under the bezel (default in Device)
 *  - screenClassName?: extra class on the screen (content-specific styling)
 *  - initialScrollFrac?: open a scrollable screen already scrolled down
 *  - to?:        route path this device links to when clicked (omit = not clickable)
 *  - screenRect: screen-window rect as % of the (cropped) frame
 *  - content:    what to show inside — see DeviceContent for the kinds
 *
 * To add/reorder/edit a device, change this array — nothing else.
 */
export const DEVICES = [
  {
    id: 'laptop',
    frame: macbookFrame,
    alt: 'MacBook',
    label: 'my laptop',
    maxWidth: 560,
    bleed: 0.4,
    to: '/work',
    screenRect: { left: 9.09, top: 2.15, width: 81.82, height: 86.56 }, // frame 1221x744
    content: { kind: 'image', src: meCoding, alt: 'Luke coding' },
  },
  {
    id: 'camera',
    frame: cameraFrame,
    alt: 'Sony a6700 camera',
    label: 'my camera',
    maxWidth: 480,
    screenRect: { left: 14.93, top: 32.68, width: 52.19, height: 60.14 }, // frame 958x557
    content: { kind: 'gallery', photos: cameraPhotos },
  },
  {
    id: 'music',
    frame: ipodFrame,
    alt: 'iPod',
    label: 'my music',
    maxWidth: 360,
    screenClassName: 'music-screen',
    // body/clickwheel opens the Spotify profile; the screen stays interactive
    to: 'https://open.spotify.com/user/jz20zkn2e54x9zk6yxlce7kct?si=d7e173c26bf34b2e',
    linkMode: 'overlay',
    screenRect: { left: 7.44, top: 4.62, width: 85.53, height: 39.08 }, // frame 712x1190
    content: { kind: 'spotify', playlistId: '1CLnJlObG8nj2l7cofacn1' },
  },
  {
    id: 'phone',
    frame: phoneFrame,
    alt: 'Phone',
    label: 'my phone',
    maxWidth: 300,
    screenClassName: 'phone-screen',
    to: '/about',
    screenRect: { left: 27.39, top: 34.86, width: 45.87, height: 23.69 }, // frame 303x591
    content: { kind: 'clock' },
  },
]
