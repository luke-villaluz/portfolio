/**
 * Preload a list of image URLs. Resolves once every image has settled
 * (loaded *or* errored) so a broken/missing asset never blocks the app.
 *
 * @param {string[]} urls - image URLs (falsy entries are skipped)
 * @returns {Promise<void>}
 */
export function preloadImages(urls) {
  return Promise.all(
    urls.filter(Boolean).map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = resolve
          img.src = src
          // already cached: onload may not fire, so resolve now
          if (img.complete) resolve()
        }),
    ),
  ).then(() => undefined)
}
