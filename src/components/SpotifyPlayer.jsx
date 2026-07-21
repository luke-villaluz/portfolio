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
 */
export default function SpotifyPlayer({ playlistId }) {
  const src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
  return (
    <iframe
      className="spotify-player"
      title="Spotify playlist"
      src={src}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  )
}
