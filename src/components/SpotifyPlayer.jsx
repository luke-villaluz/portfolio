import { useTrackedAsset } from '../lib/assetGate.js'
import './SpotifyPlayer.css'

/**
 * Spotify playlist embed sized to sit inside the iPod screen.
 *
 * The iPod's Device screen is the scroll viewport (its config in
 * src/data/devices.js sets screenClassName="music-screen" + initialScrollFrac):
 * this iframe is rendered tall enough to contain the entire tracklist and the
 * screen scrolls through it, opening already scrolled past the cover art.
 *
 * @param {string} playlistId - Spotify playlist id (the part after /playlist/)
 * @param {number} [trackCount] - number of songs in the playlist; sizes the
 *   iframe to end right after the last track (see SpotifyPlayer.css). Falls
 *   back to a sensible default if omitted.
 */
export default function SpotifyPlayer({ playlistId, trackCount }) {
  const src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
  // let the page loader wait for this embed to finish loading
  const onLoad = useTrackedAsset()
  // drive the CSS height calc off the playlist length so removing/adding songs
  // never leaves blank space or clips the last track
  const style = trackCount ? { '--sp-track-count': trackCount } : undefined
  return (
    <iframe
      className="spotify-player"
      title="Spotify playlist"
      src={src}
      style={style}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      onLoad={onLoad}
    />
  )
}
