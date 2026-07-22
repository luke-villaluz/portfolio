import { useCallback, useEffect, useMemo, useState } from 'react'
import { AssetGateContext } from './assetGate.js'

/**
 * Tracks async DOM assets (iframes, embeds, media) and reports when they've
 * all finished loading. Descendants call useTrackedAsset() to register; the
 * gate is "ready" once every registered asset resolves — or once maxWait
 * elapses, so a hung third-party embed can never block the page forever.
 *
 * @param {number} maxWait - failsafe (ms) after which the gate reports ready
 */
export default function AssetGateProvider({ children, maxWait = 8000 }) {
  const [pending, setPending] = useState(() => new Set())
  const [primed, setPrimed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const register = useCallback((id) => {
    setPending((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const resolve = useCallback((id) => {
    setPending((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  // Don't report ready until after the first paint: child register effects run
  // before this parent effect, but priming on the next frame keeps an empty
  // initial `pending` from briefly reading as ready. Failsafe caps the wait.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPrimed(true))
    const timer = setTimeout(() => setTimedOut(true), maxWait)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [maxWait])

  const ready = timedOut || (primed && pending.size === 0)
  const value = useMemo(() => ({ register, resolve, ready }), [register, resolve, ready])
  return <AssetGateContext.Provider value={value}>{children}</AssetGateContext.Provider>
}
