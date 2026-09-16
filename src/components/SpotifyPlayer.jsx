import { useTrackedAsset } from '../lib/assetGate.js'
import './SpotifyPlayer.css'

/**
 * Spotify playlist embed filling the iPod screen.
 *
 * The iframe simply fills the screen: below ~330px tall the embed renders its
 * compact layout, whose tracklist is its *own* scroll container. So the whole
 * playlist is reachable no matter how many songs it has, and nothing here has
 * to know the track count — add or remove songs freely, no code change.
 *
 * @param {string} playlistId - Spotify playlist id (the part after /playlist/)
 */
export default function SpotifyPlayer({ playlistId }) {
  const src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
  // let the page loader wait for this embed to finish loading
  const onLoad = useTrackedAsset()
  return (
    <iframe
      className="spotify-player"
      title="Spotify playlist"
      src={src}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      onLoad={onLoad}
    />
  )
}
