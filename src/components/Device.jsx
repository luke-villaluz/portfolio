import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Device.css'

/** A link that renders an <a> for external URLs and a router <Link> otherwise. */
function DeviceLink({ to, className, label, children }) {
  const external = /^https?:\/\//.test(to)
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className} aria-label={label}>
      {children}
    </Link>
  )
}

/**
 * Renders a device frame (PNG with a transparent screen "window") with
 * arbitrary content layered *behind* the frame, so the frame's bezel
 * overlaps the content edges — giving a real "inside the device" look.
 *
 * @param {string}  frame     - imported frame PNG (transparent screen window)
 * @param {string}  alt       - alt text for the frame
 * @param {object}  screenRect - screen-window rect as percentages of the frame:
 *                             { left, top, width, height }
 * @param {string}  label    - caption shown under the device
 * @param {number}  maxWidth - max render width of the device in px
 * @param {number}  bleed    - % to expand the screen outward so content tucks
 *                             fully under the bezel (hides the anti-aliased edge)
 * @param {string}  screenClassName - extra class on the screen element (for
 *                             content-specific styling, e.g. a scrollable embed)
 * @param {number}  initialScrollFrac - if set, the screen scrolls to
 *                             (fraction * screen width) px on mount. Used to open
 *                             a scrollable embed already scrolled past its header.
 * @param {string}  to        - if set, the device links here (route or external URL)
 * @param {'wrap'|'overlay'} linkMode - 'wrap' (default) makes the whole device a
 *                             link; 'overlay' puts the link *behind* the screen so
 *                             an interactive screen (e.g. an iframe) still works and
 *                             only the device body navigates.
 * @param {node}    children - content placed inside the screen window
 */
export default function Device({
  frame,
  alt,
  screenRect,
  label,
  maxWidth = 520,
  bleed = 0.8,
  screenClassName = '',
  initialScrollFrac,
  to,
  linkMode = 'wrap',
  children,
}) {
  const screenRef = useRef(null)

  useLayoutEffect(() => {
    if (initialScrollFrac == null) return
    const el = screenRef.current
    if (!el) return
    const apply = () => {
      el.scrollTop = initialScrollFrac * el.clientWidth
    }
    apply()
    // re-apply if the layout settles/resizes so it stays past the header
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [initialScrollFrac])

  const stage = (
    <div className="device__stage">
      {/* body-only link: sits behind the screen so an interactive screen still
          works; clicks on the device body/bezel navigate */}
      {to && linkMode === 'overlay' && (
        <DeviceLink to={to} label={label} className="device__overlay-link" />
      )}

      {/* content sits behind the frame, bled outward under the bezel */}
      <div
        ref={screenRef}
        className={`device__screen ${screenClassName}`.trim()}
        style={{
          left: `${screenRect.left - bleed}%`,
          top: `${screenRect.top - bleed}%`,
          width: `${screenRect.width + bleed * 2}%`,
          height: `${screenRect.height + bleed * 2}%`,
        }}
      >
        {children}
      </div>

      {/* frame on top; bezel overlaps content edges */}
      <img className="device__frame" src={frame} alt={alt} />
    </div>
  )

  return (
    <figure className="device" style={{ maxWidth }}>
      {to && linkMode === 'wrap' ? (
        <DeviceLink to={to} label={label} className="device__link">
          {stage}
        </DeviceLink>
      ) : (
        stage
      )}

      {label && <figcaption className="device__label">{label}</figcaption>}
    </figure>
  )
}
