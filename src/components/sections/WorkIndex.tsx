import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../../data/projects'
import { diagrams } from '../../data/diagrams'
import { Signature } from '../visuals/Signature'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { navigate, projectPath } from '../../lib/router'
import './workindex.css'

/**
 * The work section on the homepage: four rows, not four scenes.
 *
 * The projects used to be four pinned, scroll-driven scenes stacked into the
 * main scroll, which made the homepage a very long read before a visitor
 * reached anything else. They live on their own pages now. What is left here
 * is an index — enough to choose from, and nothing that has to be read.
 *
 * On a fine pointer the hovered row's system is drawn in the panel beside the
 * list, so the index still shows four different shapes rather than four
 * identical rows of text.
 */
export function WorkIndex() {
  const { fine, reduced } = useEnvironment()
  const [hovered, setHovered] = useState(0)

  const preview = projects[hovered]

  return (
    <section className="section workindex" id="work" aria-labelledby="work-heading">
      <div className="shell">
        <Eyebrow index="02">Selected work</Eyebrow>

        <div className="workindex__head">
          <h2 id="work-heading" className="t-h2 workindex__heading">
            <MaskText lines={['Four systems, and', 'what each one argues.']} />
          </h2>
          <Reveal delay={0.1}>
            <p className="workindex__intro">
              Each exists because of a specific disagreement with how the problem is normally solved. Open one to read
              the argument.
            </p>
          </Reveal>
        </div>

        <div className="workindex__body">
          <ol className="workindex__list">
            {projects.map((p, i) => (
              <li key={p.id}>
                <Reveal delay={Math.min(i, 4) * 0.05}>
                  <a
                    className="entry"
                    href={`#${projectPath(p.id)}`}
                    onPointerEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(projectPath(p.id))
                    }}
                  >
                    <span className="entry__index num">{p.index}</span>

                    <span className="entry__main">
                      <span className="entry__name">{p.name}</span>
                      {/* The one award on the site. It belongs on the card,
                          not only on the page behind it — a visitor who never
                          clicks through should still see it. */}
                      {p.award && (
                        <span className="entry__award">
                          <span className="entry__award-mark" aria-hidden="true" />
                          <span className="entry__award-title">
                            {p.award.title} <span className="num">{p.award.year}</span>
                          </span>
                          <span className="entry__award-placement">{p.award.placement}</span>
                        </span>
                      )}
                      <span className="entry__concept">{p.concept}</span>
                      <span className="entry__tech">
                        {p.tech.slice(0, 4).join(' / ')}
                        {p.tech.length > 4 && ' / …'}
                      </span>
                    </span>

                    <span className="entry__meta">
                      <span className="entry__kind">{p.kind}</span>
                      <span className="entry__year num">{p.year}</span>
                    </span>

                    <span className="entry__go" aria-hidden="true">
                      <ArrowUpRight size={16} strokeWidth={1.5} />
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Desktop only. On a phone this would be a fifth thing to scroll
              past on the way to choosing, and the drawing is already the first
              thing on the project page itself. */}
          {fine && (
            <aside className="workindex__preview" aria-hidden="true">
              <div className="workindex__preview-frame">
                <span className="workindex__preview-tag t-label">{preview.name}</span>
                <Signature
                  key={preview.id}
                  kind={preview.signature ?? 'bands'}
                  bands={diagrams[preview.id] ?? []}
                  stage={3}
                  complete
                  title={preview.name}
                />
              </div>
              {!reduced && <p className="workindex__preview-hint t-mono">Hover to preview · click to open</p>}
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
