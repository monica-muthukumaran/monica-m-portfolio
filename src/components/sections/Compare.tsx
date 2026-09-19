import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { comparison } from '../../data/systems'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import './compare.css'

/**
 * The two Coding Shuttle systems, argued against each other.
 *
 * They arrive from opposite sides and converge on one word, because the point
 * of putting them next to each other is that the techniques are the same and
 * the tolerance for error is not.
 */
export function Compare() {
  const { reduced } = useEnvironment()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.65'] })

  // Opposite travel, converging on zero. Under reduced motion neither column
  // moves and the merge line simply fades in with everything else.
  const leftX = useTransform(scrollYProgress, [0, 0.75], ['-8%', '0%'])
  const rightX = useTransform(scrollYProgress, [0, 0.75], ['8%', '0%'])
  const mergeOpacity = useTransform(scrollYProgress, [0.55, 0.95], [0, 1])
  const mergeScale = useTransform(scrollYProgress, [0.55, 0.95], [0.94, 1])

  return (
    <section className="section compare" aria-labelledby="compare-heading">
      <div className="shell" ref={ref}>
        <h2 id="compare-heading" className="t-h2 compare__heading">
          <MaskText lines={comparison.heading} />
        </h2>

        <div className="compare__pair">
          <motion.div className="compare__side" style={reduced ? undefined : { x: leftX }}>
            <Reveal>
              <div className="compare__card">
                <span className="compare__key t-label">{comparison.left.key}</span>
                <p className="compare__challenge-label">The challenge</p>
                <ul className="compare__challenge">
                  {comparison.left.challenge.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="compare__line">{comparison.left.line}</p>
              </div>
            </Reveal>
          </motion.div>

          <motion.div className="compare__side" style={reduced ? undefined : { x: rightX }}>
            <Reveal delay={0.06}>
              <div className="compare__card">
                <span className="compare__key t-label">{comparison.right.key}</span>
                <p className="compare__challenge-label">The challenge</p>
                <ul className="compare__challenge">
                  {comparison.right.challenge.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="compare__line">{comparison.right.line}</p>
              </div>
            </Reveal>
          </motion.div>
        </div>

        <motion.div
          className="compare__merge"
          style={reduced ? undefined : { opacity: mergeOpacity, scale: mergeScale }}
        >
          <span className="compare__merge-rule" aria-hidden="true" />
          <p className="compare__merge-word">{comparison.merge}</p>
          <span className="compare__merge-rule" aria-hidden="true" />
        </motion.div>

        <Reveal delay={0.1}>
          <p className="compare__closing measure">{comparison.closing}</p>
        </Reveal>
      </div>
    </section>
  )
}
