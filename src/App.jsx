import { Navigate, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Work from './pages/Work.jsx'
import Photos from './pages/Photos.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/work" element={<Work />} />
      <Route path="/photos" element={<Photos />} />
      {/* unknown path: send them to the landing page rather than rendering it
          under a URL that doesn't exist */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
