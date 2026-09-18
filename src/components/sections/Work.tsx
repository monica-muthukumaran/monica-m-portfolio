import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { projects, type Project } from '../../data/projects'
import { diagrams } from '../../data/diagrams'
import { ArchitectureDiagram } from '../visuals/ArchitectureDiagram'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { clamp } from '../../lib/math'
import './work.css'

const STEPS = ['Problem', 'Solution', 'Architecture', 'Result'] as const

function StepBody({ project, step }: { project: Project; step: number }) {
  // The problem is the hook, so it is set larger than the answer to it —
  // otherwise all four steps are the same grey paragraph in a row.
  if (step === 0) return <p className="project__prose project__prose--lead">{project.problem}</p>
  if (step === 1) return <p className="project__prose">{project.solution}</p>
  if (step === 2)
    return (
      <ul className="project__arch">
        {project.architecture.map((line, i) => (
          <li key={i}>
            <span className="project__arch-tick" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>
    )
  return (
    <div className="project__result">
      <dl className="project__metrics">
        {project.impact.map((m) => (
          <div key={m.label}>
            <dt className="num">{m.value}</dt>
            <dd>{m.label}</dd>
          </div>
        ))}
      </dl>
      {project.note && (
        <div className="project__note">
          <span className="t-label">{project.note.label}</span>
          <p>{project.note.body}</p>
        </div>
      )}
    </div>
  )
}

function ProjectVisual({ project, stage, complete }: { project: Project; stage: number; complete: boolean }) {
  const { reduced } = useEnvironment()

  if (project.image) {
    return (
      <motion.div
        className="project__image"
        initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
        whileInView={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={reduced ? { duration: 0.25 } : { duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    )
  }

  return (
    <ArchitectureDiagram
      bands={diagrams[project.id] ?? []}
      stage={stage}
      complete={complete}
      title={project.name}
    />
  )
}

function ProjectScene({ project, order }: { project: Project; order: number }) {
  const { roomy, reduced } = useEnvironment()
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  const pinned = roomy && !reduced

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return
    // Four steps across the scene, with the last one holding to the end so the
    // result is readable rather than glimpsed.
    const next = clamp(Math.floor(v * (STEPS.length + 0.35)), 0, STEPS.length - 1)
    setStep((current) => (current === next ? current : next))
  })

  const header = (
    <header className="project__header">
      <div className="project__id">
        <span className="project__index num">{project.index}</span>
        <span className="project__context">{project.context}</span>
        <span className="project__year num">{project.year}</span>
      </div>
      <MaskText lines={[project.name]} as="h3" className="project__name t-h2" />
      <p className="project__concept">{project.concept}</p>
      {project.award && (
        <p className="project__award">
          <span className="project__award-mark" aria-hidden="true" />
          <span className="project__award-text">
            <span className="project__award-title">
              {project.award.title} <span className="num">{project.award.year}</span>
            </span>
            <span className="project__award-placement">{project.award.placement}</span>
          </span>
        </p>
      )}
      <ul className="project__tech">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </header>
  )

  /* ---- Mobile / reduced motion: the same story, told linearly ---- */
  if (!pinned) {
    return (
      <article className="project project--flat" aria-labelledby={`project-${project.id}`}>
        <Reveal>
          <div className="project__flat-visual">
            <div className="project__flat-scroll">
              <ProjectVisual project={project} stage={3} complete />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div id={`project-${project.id}`}>{header}</div>
        </Reveal>
        <div className="project__flat-steps">
          {STEPS.map((label, i) => (
            <Reveal key={label} delay={0.04 * i}>
              <section className="project__flat-step">
                <h4 className="project__flat-label">
                  <span className="num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {label}
                </h4>
                <StepBody project={project} step={i} />
              </section>
            </Reveal>
          ))}
        </div>
      </article>
    )
  }

  /* ---- Desktop: text anchored, system assembling beside it ---- */
  return (
    <article
      className="project project--scene"
      ref={ref}
      aria-labelledby={`project-${project.id}`}
      style={{ ['--scene-len' as string]: `${STEPS.length * 85 + 60}vh` }}
    >
      <div className="project__sticky">
        <div className="project__grid">
          <div className="project__text">
            <div id={`project-${project.id}`}>{header}</div>

            <div className="project__steps">
              <ol className="project__stepbar" aria-hidden="true">
                {STEPS.map((label, i) => (
                  <li key={label} className={i === step ? 'is-active' : i < step ? 'is-past' : ''}>
                    <span className="project__stepbar-rule" />
                    <span className="project__stepbar-label">{label}</span>
                  </li>
                ))}
              </ol>

              <div className="project__panel">
                {STEPS.map((label, i) => (
                  <div key={label} className="project__panel-item" data-active={i === step} aria-hidden={i !== step}>
                    <StepBody project={project} step={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="project__visual">
            <div className="project__visual-frame">
              <span className="project__visual-tag t-label">
                {project.image ? 'Interface' : 'System'} · {String(order).padStart(2, '0')}
              </span>
              <ProjectVisual project={project} stage={step} complete={false} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']

export function Work() {
  // Derived so archiving or restoring a project never leaves the heading lying.
  const n = projects.length
  const count = COUNT_WORDS[n] ?? String(n)
  const headline = n === 1 ? [`${count} system, and`, 'what it argues.'] : [`${count} systems, and`, 'what each one argues.']

  return (
    <section className="section work" id="work" aria-labelledby="work-heading">
      <div className="shell">
        <Eyebrow index="02">Selected work</Eyebrow>
        <h2 id="work-heading" className="work__heading t-h2">
          <MaskText lines={headline} />
        </h2>
        <Reveal delay={0.1}>
          <p className="work__intro t-lead measure">
            {n === 1 ? 'This exists' : 'Each of these exists'} because of a specific disagreement with how the problem
            is normally solved. The architecture is the argument.
          </p>
        </Reveal>
      </div>

      <div className="work__scenes">
        {projects.map((p, i) => (
          <ProjectScene key={p.id} project={p} order={i + 1} />
        ))}
      </div>
    </section>
  )
}
