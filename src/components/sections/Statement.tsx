import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { profile } from '../../data/profile'
import { experience } from '../../data/experience'
import { Eyebrow } from '../primitives/Eyebrow'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import './statement.css'

type Word = { text: string; em: boolean }

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: Word
  index: number
  total: number
  progress: MotionValue<number>
}) {
  // Each word owns a slice of the scroll range, with a generous overlap so the
  // sentence resolves as a wave rather than a row of independent fades.
  const start = index / total
  const end = start + 1.6 / total
  const opacity = useTransform(progress, [start, end], [0.14, 1])

  return (
    <motion.span className={`statement__word ${word.em ? 'em' : ''}`} style={{ opacity }}>
      {word.text}
    </motion.span>
  )
}

/**
 * Where I work now, as a panel rather than a closing sentence.
 *
 * This is the first fact a visitor scans for, and the bottom of three
 * paragraphs is the wrong place for the thing everybody is looking for.
 * Everything in it is read from experience.ts, so the panel and the timeline
 * further down the page can never disagree with each other.
 */
function NowPanel() {
  const current = experience.find((role) => role.current)
  const previous = experience.find((role) => !role.current)
  if (!current) return null

  return (
    <aside className="now" aria-label="Current role">
      <span className="now__tag t-label">Currently</span>

      <p className="now__company">{current.company}</p>
      <p className="now__role">{current.role}</p>

      <dl className="now__facts">
        <div>
          <dt>Since</dt>
          <dd className="num">{current.period.split('—')[0].trim()}</dd>
        </div>
        <div>
          <dt>Team</dt>
          <dd>{current.location}</dd>
        </div>
        <div>
          <dt>Local</dt>
          <dd className="num">{profile.timezone}</dd>
        </div>
      </dl>

      <div className="now__stack">
        <span className="t-label">Day to day</span>
        <ul>
          {current.stack.slice(0, 5).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {previous && (
        <p className="now__before">
          <span className="now__before-label">Before</span>
          {previous.company} · <span className="num">{previous.period}</span>
        </p>
      )}
    </aside>
  )
}

export function Statement() {
  const { reduced } = useEnvironment()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  })

  const parts = profile.statement as readonly { text: string; em?: boolean }[]
  const words: Word[] = parts.flatMap((part) =>
    part.text.split(' ').map((text) => ({ text, em: Boolean(part.em) })),
  )

  const [lead, ...rest] = profile.intro

  return (
    <section className="section statement" data-ground="bone" aria-labelledby="statement-heading">
      <div className="shell">
        <Eyebrow index="01">Introduction</Eyebrow>

        <div ref={ref}>
          <h2 className="statement__line" id="statement-heading">
            {reduced
              ? words.map((w, i) => (
                  <span key={i} className={`statement__word ${w.em ? 'em' : ''}`}>
                    {w.text}
                  </span>
                ))
              : words.map((w, i) => (
                  <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
                ))}
          </h2>
        </div>

        {/* Prose on the left, the current role on the right. The panel answers
            the question a visitor actually arrives with. */}
        <div className="statement__panels">
          <div className="statement__prose">
            <Reveal>
              <p className="statement__lead">{lead}</p>
            </Reveal>
            {rest.map((para, i) => (
              <Reveal key={i} delay={0.06 + i * 0.06} as="p" className="statement__para">
                {para}
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.08}>
            <NowPanel />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
