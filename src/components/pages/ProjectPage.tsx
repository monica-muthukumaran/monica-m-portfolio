import { useEffect } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '../../data/projects'
import { diagrams } from '../../data/diagrams'
import { Signature } from '../visuals/Signature'
import { PaymentStudy } from '../systems/PaymentStudy'
import { SocialStudy } from '../systems/SocialStudy'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { navigate, projectPath } from '../../lib/router'
import './projectpage.css'

/**
 * One project, on its own page.
 *
 * The summary above the fold is deliberately short — a brief, four
 * architecture lines, the metrics and the drawing. Anything longer belongs in
 * the case study underneath, which is opt-in by scrolling rather than
 * unavoidable on the way to the rest of the site.
 */
export function ProjectPage({ id }: { id: string }) {
  const project = projects.find((p) => p.id === id)

  // Keep the document title in step with the route, so a back button and a
  // browser history entry both say something useful.
  useEffect(() => {
    if (!project) return
    const previous = document.title
    document.title = `${project.name} — Monica Muthukumaran`
    return () => {
      document.title = previous
    }
  }, [project])

  if (!project) return <NotFound />

  const next = projects[(projects.findIndex((p) => p.id === id) + 1) % projects.length]

  return (
    <article className="page">
      <PageNav project={project} />

      <header className="page__head section">
        <div className="shell">
          <div className="page__id">
            <span className="page__index num">{project.index}</span>
            <span className="page__context">{project.context}</span>
            <span className="page__year num">{project.year}</span>
          </div>

          <MaskText lines={[project.name]} as="h1" className="page__name" />

          {project.credential && (
            <p className="page__credential">
              <span className="page__credential-issuer">{project.credential.label}</span>
              <span className="page__credential-detail">{project.credential.detail}</span>
            </p>
          )}

          <Reveal delay={0.06}>
            <p className="page__concept">{project.concept}</p>
          </Reveal>

          {project.status && (
            <Reveal delay={0.08}>
              <p className="page__status">{project.status}</p>
            </Reveal>
          )}

          {project.award && (
            <Reveal delay={0.1}>
              <p className="page__award">
                <span className="page__award-mark" aria-hidden="true" />
                <span className="page__award-title">
                  {project.award.title} <span className="num">{project.award.year}</span>
                </span>
                <span className="page__award-placement">{project.award.placement}</span>
              </p>
            </Reveal>
          )}
        </div>
      </header>

      <div className="page__body">
        <div className="shell">
          <div className="page__grid">
            <div className="page__text">
              <Reveal>
                <p className="page__brief">{project.brief}</p>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="page__arch">
                  <span className="t-label">Architecture</span>
                  <ul>
                    {project.architecture.map((line, i) => (
                      <li key={i}>
                        <span className="page__arch-tick" aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="page__tech">
                  <span className="t-label">Built with</span>
                  <ul>
                    {project.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {/* Never merged into the row above. What is in the repository
                      and what the system is designed around are two different
                      claims, and only one of them is code. */}
                  {project.techDesigned && (
                    <>
                      <span className="t-label page__tech-second">Designed around</span>
                      <ul className="page__tech-designed">
                        {project.techDesigned.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Reveal>
            </div>

            <div className="page__visual">
              <div className="page__visual-frame">
                <span className="page__visual-tag t-label">System</span>
                <Signature
                  kind={project.signature ?? 'bands'}
                  bands={diagrams[project.id] ?? []}
                  stage={3}
                  complete
                  title={project.name}
                />
              </div>
            </div>
          </div>

          <dl className="page__metrics">
            {project.impact.map((m) => (
              <Reveal key={m.label} as="div" delay={0.04}>
                <dt className="num">{m.value}</dt>
                <dd>{m.label}</dd>
              </Reveal>
            ))}
          </dl>

          {project.note && (
            <Reveal>
              <aside className="page__note">
                <span className="t-label">{project.note.label}</span>
                <p>{project.note.body}</p>
              </aside>
            </Reveal>
          )}

          {project.links && (
            <Reveal>
              <ul className="page__links">
                {project.links.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noreferrer">
                      {label}
                      <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>

      {project.study === 'payment' && <PaymentStudy />}
      {project.study === 'social' && <SocialStudy />}

      <footer className="page__foot section">
        <div className="shell">
          <button className="page__next" onClick={() => navigate(projectPath(next.id))}>
            <span className="t-label">Next</span>
            <span className="page__next-name">{next.name}</span>
            <span className="page__next-concept">{next.concept}</span>
          </button>
        </div>
      </footer>
    </article>
  )
}

/** A slim bar, not the site nav — on a project page there is one way back. */
function PageNav({ project }: { project: Project }) {
  return (
    <div className="page__bar">
      <div className="shell page__bar-inner">
        <button className="page__back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
          All work
        </button>
        <span className="page__bar-title">{project.name}</span>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="page page--missing section">
      <div className="shell">
        <h1 className="t-h2">No such project.</h1>
        <p className="t-lead measure">The link may be out of date, or the project may have been archived.</p>
        <button className="page__back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
          All work
        </button>
      </div>
    </div>
  )
}
