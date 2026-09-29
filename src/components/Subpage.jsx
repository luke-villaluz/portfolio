import { Link } from 'react-router-dom'
import { PROFILE } from '../data/profile.js'
import './Subpage.css'

/**
 * Shared layout for interior pages (About, Work, …): a back link to the
 * landing page, an optional page title, and a centered content column.
 *
 * @param {string}  title    - page heading
 * @param {boolean} wide     - use the wider column (for galleries rather than
 *                             prose, which reads better narrow)
 * @param {node}    children - page content
 */
export default function Subpage({ title, wide = false, children }) {
  return (
    <div className="subpage">
      <Link to="/" className="subpage__back">
        ← {PROFILE.name}
      </Link>

      <main className={`subpage__content${wide ? ' subpage__content--wide' : ''}`}>
        {title && <h1 className="subpage__title">{title}</h1>}
        {children}
      </main>
    </div>
  )
}
