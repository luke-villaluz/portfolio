import './Loader.css'

/**
 * Full-screen overlay shown while assets load. Stays mounted and fades out
 * (rather than unmounting) so the page it covers is already laid out and
 * appears instantly when it clears.
 *
 * @param {boolean} show - whether the loader is visible
 */
export default function Loader({ show }) {
  return (
    <div
      className={`loader${show ? '' : ' loader--hidden'}`}
      role="status"
      aria-live="polite"
      aria-hidden={!show}
    >
      <div className="loader__spinner" />
      <span className="loader__text">Loading…</span>
    </div>
  )
}
