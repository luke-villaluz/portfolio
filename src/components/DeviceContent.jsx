import CameraGallery from './CameraGallery.jsx'
import PhoneClock from './PhoneClock.jsx'
import SpotifyPlayer from './SpotifyPlayer.jsx'

/**
 * Renders the content that goes inside a device screen, chosen by the device's
 * `content` descriptor (see src/data/devices.js). Add a new `kind` here to
 * support a new type of screen content.
 */
export default function DeviceContent({ content }) {
  switch (content.kind) {
    case 'image':
      return <img src={content.src} alt={content.alt} />
    case 'gallery':
      return <CameraGallery photos={content.photos} />
    case 'spotify':
      return <SpotifyPlayer playlistId={content.playlistId} trackCount={content.trackCount} />
    case 'clock':
      return <PhoneClock />
    default:
      return null
  }
}
