import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { profile } from '../../data/profile'
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

        {/* A lead at display weight, then the remainder set in two columns.
            Three stacked paragraphs of equal size was a wall of text with no
            hierarchy inside it — the thing that makes an "About me" read as one. */}
        <Reveal>
          <p className="statement__lead">{lead}</p>
        </Reveal>

        <div className="statement__rest">
          {rest.map((para, i) => (
            <Reveal key={i} delay={0.06 + i * 0.06} as="p" className="statement__para">
              {para}
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="statement__now">
            <span className="statement__now-label">Currently</span>
            Application Development Programmer Analyst 2 at <strong>Citi</strong>, Capital Markets — Java, Spring Boot
            and Kafka.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
