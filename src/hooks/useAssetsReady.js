import { useEffect, useState } from 'react'
import { preloadImages } from '../lib/preloadImages.js'

/**
 * Returns `false` until all given image URLs have loaded (or failed), then
 * `true`. Use to gate a page behind a loader so it never appears half-drawn.
 *
 * @param {string[]} urls        - image URLs to wait for
 * @param {number}   minDuration - keep waiting at least this long (ms) so a
 *                                 fast/cached load doesn't flash the loader
 * @returns {boolean} ready
 */
export function useAssetsReady(urls, minDuration = 350) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      preloadImages(urls),
      new Promise((resolve) => setTimeout(resolve, minDuration)),
    ]).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
    // urls is a stable module-level array; intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ready
}
