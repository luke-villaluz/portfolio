import Device from '../components/Device.jsx'
import DeviceContent from '../components/DeviceContent.jsx'
import { DEVICES } from '../data/devices.js'
import { PROFILE } from '../data/profile.js'
import './Home.css'

export default function Home() {
  return (
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
  )
}
