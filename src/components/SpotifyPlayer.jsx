import { useLayoutEffect, useRef, useState } from 'react'
import { useTrackedAsset } from '../lib/assetGate.js'
import './SpotifyPlayer.css'

// Height the embed is laid out at before being scaled down to the iPod screen.
// Below ~352px tall Spotify switches to a cramped compact card with a blank
// band under it; at 352 it renders its full layout (header + a tracklist that
// scrolls inside the embed), so any playlist length works.
const EMBED_HEIGHT = 352

/**
 * Spotify playlist embed filling the iPod screen.
 *
 * The iframe is laid out at EMBED_HEIGHT and scaled (CSS transform) so that
 * height fits the screen, with its width chosen to span the screen exactly.
 *
 * @param {string} playlistId - Spotify playlist id (the part after /playlist/)
 */
export default function SpotifyPlayer({ playlistId }) {
  const src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
  // let the page loader wait for this embed to finish loading
  const onLoad = useTrackedAsset()
  const ref = useRef(null)
  const [size, setSize] = useState(null)

  useLayoutEffect(() => {
    const screen = ref.current?.parentElement
    if (!screen) return
    const measure = () => {
      const { clientWidth: w, clientHeight: h } = screen
      if (!w || !h) return
      const scale = h / EMBED_HEIGHT
      setSize({ scale, width: w / scale })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(screen)
    return () => ro.disconnect()
  }, [])

  const style = size
    ? {
        width: size.width,
        height: EMBED_HEIGHT,
        transform: `scale(${size.scale})`,
      }
    : undefined

  return (
    <iframe
      ref={ref}
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
