import './CameraGallery.css'

/**
 * Camera LCD content.
 *
 * `photos` is an array of image URLs (auto-loaded from src/assets/camera/ in
 * src/data/devices.js). It currently shows the first photo — this component is
 * the single place to grow into a carousel/slideshow when more camera photos
 * are added.
 *
 * @param {string[]} photos - camera photo URLs
 */
export default function CameraGallery({ photos }) {
  const photo = photos[0]
  if (!photo) return null
  return <img className="camera-gallery" src={photo} alt="Photo by Luke" />
}
