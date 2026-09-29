import Subpage from '../components/Subpage.jsx'
import { ALBUMS } from '../data/photoAlbums.generated.js'
import './Photos.css'

/**
 * One section per folder in src/assets/photos/ — the folder name becomes the
 * heading and its photos become a horizontal strip, with a divider between
 * albums. Adding a trip means adding a folder; nothing here changes.
 *
 * The album list is generated at build time by scripts/build-photos.mjs.
 */
export default function Photos() {
  return (
    <Subpage title="Photos" wide>
      {ALBUMS.length === 0 && (
        <p className="photos__empty">
          No albums yet — add a folder of photos to <code>src/assets/photos/</code>.
        </p>
      )}

      {/* keyed on the folder name, which the filesystem already guarantees is
          unique — two differently-named folders can slugify to the same string */}
      {ALBUMS.map((album) => (
        <section key={album.name} className="photos__album">
          <h2 className="photos__album-name">{album.name}</h2>

          {/* Horizontal strip. Every photo is exported to the same pixel
              height, so widths vary with each photo's own aspect ratio and
              nothing gets cropped. */}
          <ul className="photos__strip">
            {album.photos.map((photo) => (
              <li key={photo.src} className="photos__item">
                <img
                  src={photo.src}
                  // real dimensions reserve the right space before the photo
                  // loads, so the strip doesn't jump around while scrolling
                  width={photo.width}
                  height={photo.height}
                  alt={`${album.name} — photo by Luke`}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Subpage>
  )
}
