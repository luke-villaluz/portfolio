import { createContext, useCallback, useContext, useId, useLayoutEffect } from 'react'

/**
 * Context for AssetGateProvider (see AssetGateProvider.jsx). Tracks async
 * assets that live in the DOM (iframes, embeds, media) and can only signal
 * readiness once mounted — complementing the URL-based image preloading in
 * useAssetsReady.
 */
export const AssetGateContext = createContext(null)

/** True once every tracked asset has loaded. Safe to call with no provider. */
export function useAssetGateReady() {
  const ctx = useContext(AssetGateContext)
  return ctx ? ctx.ready : true
}

/**
 * Register the calling component as an async asset the gate must wait for.
 * Returns an onLoad handler to attach to the element (e.g. an <iframe>);
 * the gate keeps waiting until it fires. Unmounting also resolves it.
 *
 * @returns {() => void} onLoad handler
 */
export function useTrackedAsset() {
  const ctx = useContext(AssetGateContext)
  const id = useId()
  const register = ctx?.register
  const resolve = ctx?.resolve

  // Depend on the stable register/resolve callbacks, not the whole context
  // value (which changes identity as `ready` flips) — otherwise this effect
  // would re-run on every provider render, re-registering the asset in a loop.
  //
  // Register in a layout effect (synchronous, during commit) rather than a
  // passive effect: a warm-cache <iframe> can fire its async `load` a frame
  // before a passive effect runs, so the onLoad -> resolve would land before
  // register and be lost, leaving the asset stuck pending until the failsafe.
  useLayoutEffect(() => {
    if (!register || !resolve) return undefined
    register(id)
    return () => resolve(id)
  }, [register, resolve, id])

  return useCallback(() => resolve?.(id), [resolve, id])
}
