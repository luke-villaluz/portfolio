import { useEffect } from 'react'
import Device from '../components/Device.jsx'
import DeviceContent from '../components/DeviceContent.jsx'
import Loader from '../components/Loader.jsx'
import { useAssetsReady } from '../hooks/useAssetsReady.js'
import { useAssetGateReady } from '../lib/assetGate.js'
import { DEVICES, PRELOAD_IMAGES } from '../data/devices.js'
import { PROFILE } from '../data/profile.js'
import './Home.css'

// Session-scoped: the loader is a first-visit concern. Once the page has fully
// loaded once, returning to Home via client-side nav shouldn't re-show it.
// A full page refresh re-evaluates the module and resets this.
let sessionLoadComplete = false

export default function Home() {
  // hold the loader over the (already-rendered) page until frames + first
  // content images have loaded, plus the Spotify embed (tracked via the
  // asset gate), so nothing shows half-drawn
  const imagesReady = useAssetsReady(PRELOAD_IMAGES)
  const embedsReady = useAssetGateReady()
  const ready = imagesReady && embedsReady

  useEffect(() => {
    if (ready) sessionLoadComplete = true
  }, [ready])

  const showLoader = !sessionLoadComplete && !ready

  return (
    <>
      <Loader show={showLoader} />

      <div className="page">
        <header className="page__header">
          <h1 className="page__name">{PROFILE.name}</h1>
        </header>

        <main className="grid">
          {DEVICES.map(({ id, content, ...device }) => (
            <Device key={id} {...device}>
              <DeviceContent content={content} />
            </Device>
          ))}
        </main>
      </div>
    </>
  )
}
