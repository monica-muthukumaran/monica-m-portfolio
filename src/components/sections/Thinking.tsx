import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { principles } from '../../data/principles'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { clamp } from '../../lib/math'
import './thinking.css'

export function Thinking() {
  const ref = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(1)
  const { fine, reduced } = useEnvironment()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.85'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!fine || reduced) return
    const next = clamp(Math.ceil(v * principles.length), 1, principles.length)
    setReached((current) => (current === next ? current : next))
  })

  return (
    <section className="section thinking" id="thinking" data-ground="bone" aria-labelledby="thinking-heading">
      <div className="shell">
        <Eyebrow index="04">How I think</Eyebrow>

        <div className="thinking__layout">
          <div className="thinking__aside">
            <div className="thinking__aside-inner">
              <h2 id="thinking-heading" className="t-h2 thinking__heading">
                <MaskText lines={['Six habits', 'that survived', 'contact with', 'production.']} />
              </h2>
              <Reveal delay={0.1}>
                <p className="t-body thinking__aside-note">
                  None of these were opinions first. Each one is what was left after something went wrong in a way I
                  could not argue with.
                </p>
              </Reveal>
              <div className="thinking__counter t-mono" aria-hidden="true">
                <span className="thinking__counter-now num">{String(reached).padStart(2, '0')}</span>
                <span className="thinking__counter-of num">/ {String(principles.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <ol className="thinking__list" ref={ref}>
            {principles.map((p) => (
              <li key={p.n} className="thinking__item">
                <Reveal y={26}>
                  <div className="thinking__item-inner">
                    <span className="thinking__n num" aria-hidden="true">
                      {p.n}
                    </span>
                    <div className="thinking__content">
                      <h3 className="thinking__title">{p.title}</h3>
                      <p className="thinking__body">{p.body}</p>
                      <p className="thinking__evidence">
                        <span className="thinking__evidence-tag t-label">In practice</span>
                        {p.evidence}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
