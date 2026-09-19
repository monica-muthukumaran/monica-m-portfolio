import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react'
import { principles } from '../../data/principles'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { clamp } from '../../lib/math'
import './thinking.css'

/**
 * One principle.
 *
 * Each item owns its own scroll range and reports where it sits relative to
 * the reading line, which is what drives everything: a rule draws itself down
 * the gutter beside it, the number brightens as it arrives and dims as it
 * leaves, and the items either side of the one being read fall back. Nothing
 * is ever hidden — a dimmed item is still legible, it is just not the one in
 * focus.
 */
function Principle({ principle, onEnter }: { principle: (typeof principles)[number]; onEnter: () => void }) {
  const { reduced, fine } = useEnvironment()
  const ref = useRef<HTMLLIElement>(null)
  const [focused, setFocused] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.35'] })

  // The rule draws across the item's own range, so the column reads as one
  // line being written down the page rather than six separate bars.
  const draw = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const glow = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0.35, 1, 1, 0.5])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!fine || reduced) return
    const isFocused = v > 0.18 && v < 0.96
    // Compared outside the updater deliberately: a setState updater has to be
    // pure, and telling the parent from inside one is a render-phase update to
    // a different component.
    if (isFocused === focused) return
    setFocused(isFocused)
    if (isFocused) onEnter()
  })

  const still = reduced || !fine

  return (
    <li ref={ref} className={`thinking__item ${focused ? 'is-focused' : ''} ${still ? 'is-still' : ''}`}>
      <div className="thinking__item-inner">
        {/* The rule is the animation, and it is also the only thing separating
            one principle from the next — structure before motion. */}
        <span className="thinking__rail" aria-hidden="true">
          <motion.span className="thinking__rail-fill" style={still ? { scaleY: 1 } : { scaleY: draw }} />
        </span>

        <motion.span className="thinking__n num" aria-hidden="true" style={still ? undefined : { opacity: glow }}>
          {principle.n}
        </motion.span>

        <div className="thinking__content">
          <h3 className="thinking__title">
            <MaskText lines={[principle.title]} />
          </h3>
          <Reveal delay={0.06} y={14}>
            <p className="thinking__body">{principle.body}</p>
          </Reveal>
          <Reveal delay={0.12} y={14}>
            {/* The rule and the serif italic already mark this out as the case
                that earned the principle. A label above it said so twice. */}
            <p className="thinking__evidence">{principle.evidence}</p>
          </Reveal>
        </div>
      </div>
    </li>
  )
}

export function Thinking() {
  const listRef = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(1)
  const { fine, reduced } = useEnvironment()

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.75', 'end 0.9'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!fine || reduced) return
    const next = clamp(Math.ceil(v * principles.length), 1, principles.length)
    setReached((current) => (current === next ? current : next))
  })

  const still = reduced || !fine

  return (
    <section className="section thinking" id="thinking" data-ground="bone" aria-labelledby="thinking-heading">
      <div className="shell">
        <Eyebrow index="04">How I think</Eyebrow>

        <div className="thinking__layout">
          <div className="thinking__aside">
            <div className="thinking__aside-inner">
              {/* The eyebrow already names the section. This keeps the heading
                  level in the document — h2 above the principles' h3s — without
                  putting a second display line under one that says the same
                  thing. The note carries the aside on its own now, so it is set
                  a size up. */}
              <h2 id="thinking-heading" className="sr-only">
                How I think
              </h2>
              <Reveal delay={0.1}>
                <p className="thinking__aside-note">
                  None of these were opinions first. Each one is what was left after something went wrong in a way I
                  could not argue with.
                </p>
              </Reveal>

              <div className="thinking__counter" aria-hidden="true">
                <div className="thinking__counter-read">
                  {/* A rolling odometer rather than a number swap: the digits
                      slide, which makes the count read as driven by the scroll
                      instead of re-rendered by it. */}
                  <span className="thinking__counter-window">
                    <motion.span
                      className="thinking__counter-reel"
                      animate={{ y: `${-(reached - 1) * (100 / principles.length)}%` }}
                      transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {principles.map((p) => (
                        <span key={p.n} className="thinking__counter-digit num">
                          {p.n}
                        </span>
                      ))}
                    </motion.span>
                  </span>
                  <span className="thinking__counter-of num">/ {String(principles.length).padStart(2, '0')}</span>
                </div>

                <span className="thinking__meter">
                  <motion.span
                    className="thinking__meter-fill"
                    style={still ? { scaleX: 1 } : { scaleX: progress }}
                  />
                </span>
              </div>
            </div>
          </div>

          <ol className="thinking__list" ref={listRef}>
            {principles.map((p) => (
              <Principle key={p.n} principle={p} onEnter={() => setReached(Number(p.n))} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
