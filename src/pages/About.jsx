import Subpage from '../components/Subpage.jsx'
import { PROFILE } from '../data/profile.js'
import './About.css'

export default function About() {
  const { bio, contact } = PROFILE
  const telHref = `tel:${contact.phone.replace(/[^0-9+]/g, '')}`

  return (
    <Subpage title="About">
      <p className="about__bio">{bio}</p>

      <ul className="about__contact">
        <li>
          <span className="about__label">Email</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        <li>
          <span className="about__label">LinkedIn</span>
          <a href={contact.linkedin.url} target="_blank" rel="noreferrer">
            {contact.linkedin.handle}
          </a>
        </li>
        <li>
          <span className="about__label">GitHub</span>
          <a href={contact.github.url} target="_blank" rel="noreferrer">
            {contact.github.handle}
          </a>
        </li>
        <li>
          <span className="about__label">Phone</span>
          <a href={telHref}>{contact.phone}</a>
        </li>
      </ul>
    </Subpage>
  )
}
