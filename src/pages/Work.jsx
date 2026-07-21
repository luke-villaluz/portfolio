import Subpage from '../components/Subpage.jsx'
import { EXPERIENCE, PROJECTS } from '../data/work.js'
import './Work.css'

/**
 * Renders an entry's body: an optional blurb paragraph and/or a bullet list.
 * A bullet may be a plain string, or a { text, url } object to render a link.
 */
function EntryBody({ bullets, blurb }) {
  return (
    <>
      {blurb && <p className="work__blurb">{blurb}</p>}
      {bullets?.length > 0 && (
        <ul className="work__bullets">
          {bullets.map((point) =>
            typeof point === 'string' ? (
              <li key={point}>{point}</li>
            ) : (
              <li key={point.text}>
                <a href={point.url} target="_blank" rel="noreferrer">
                  {point.text}
                </a>
              </li>
            ),
          )}
        </ul>
      )}
    </>
  )
}

export default function Work() {
  return (
    <Subpage title="Work">
      <section className="work__section">
        <h2 className="work__heading">Experience</h2>
        {EXPERIENCE.map((job) => (
          <article key={job.company} className="work__entry">
            <div className="work__entry-head">
              <h3 className="work__name">{job.company}</h3>
              <span className="work__meta">
                {[job.role, job.period].filter(Boolean).join(' · ')}
              </span>
            </div>
            <EntryBody bullets={job.bullets} blurb={job.blurb} />
          </article>
        ))}
      </section>

      <section className="work__section">
        <h2 className="work__heading">Projects</h2>
        {PROJECTS.map((project) => (
          <article key={project.name} className="work__entry">
            <h3 className="work__name">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noreferrer">
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>
            <EntryBody bullets={project.bullets} blurb={project.blurb} />
          </article>
        ))}
      </section>
    </Subpage>
  )
}
