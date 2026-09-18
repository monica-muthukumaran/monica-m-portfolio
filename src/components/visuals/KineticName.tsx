import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useEnvironment } from '../../hooks/useEnvironment'

type Props = {
  lines: readonly string[]
  className?: string
  delay?: number
}

/**
 * The name, set as individual letters that lift toward the pointer.
 *
 * This replaced a canvas particle field. A floating dot-and-line network is the
 * house style of generated portfolios, and there was already a second one in
 * the engineering section — so the decorative copy went and the meaningful one
 * stayed. Here the typography is the interaction: nothing moves until the
 * pointer does, and what moves is the word itself.
 *
 * Only `transform` is animated. Weight is deliberately left alone — Instrument
 * Sans changes advance width with weight, so animating it would reflow the line
 * and make the name jitter.
 */
export function KineticName({ lines, className, delay = 0.16 }: Props) {
  const root = useRef<HTMLSpanElement>(null)
  const { fine, reduced } = useEnvironment()

  useEffect(() => {
    if (!fine || reduced) return
    const el = root.current
    if (!el) return

    const letters = Array.from(el.querySelectorAll<HTMLElement>('.kinetic__ch'))
    if (!letters.length) return

    // Cached because reading a rect per letter per frame is 40 forced layouts.
    let boxes: { x: number; y: number }[] = []
    const measure = () => {
      boxes = letters.map((l) => {
        const r = l.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      })
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('scroll', measure, { passive: true })

    const REACH = 260
    let frame = 0
    const target = { x: -9999, y: -9999 }
    const current: number[] = new Array(letters.length).fill(0)
    let running = false

    const tick = () => {
      let moving = false
      for (let i = 0; i < letters.length; i++) {
        const b = boxes[i]
        if (!b) continue
        const d = Math.hypot(b.x - target.x, b.y - target.y)
        const want = d > REACH ? 0 : (1 - d / REACH) ** 2
        const next = current[i] + (want - current[i]) * 0.16
        if (Math.abs(next - current[i]) > 0.0008) moving = true
        current[i] = next
        letters[i].style.transform = `translate3d(0, ${-next * 18}px, 0)`
      }
      if (moving) {
        frame = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!running) {
        running = true
        frame = requestAnimationFrame(tick)
      }
    }

    const onLeave = () => {
      target.x = -9999
      target.y = -9999
      if (!running) {
        running = true
        frame = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', measure)
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [fine, reduced])

  return (
    <span className={className} ref={root} aria-hidden="true">
      {lines.map((line, li) => (
        <motion.span
          key={li}
          className="line-mask"
          initial={reduced ? { opacity: 0 } : undefined}
          animate={reduced ? { opacity: 1 } : undefined}
          transition={reduced ? { duration: 0.3, delay: li * 0.06 } : undefined}
        >
          <motion.span
            className="kinetic__line"
            initial={reduced ? false : { y: '110%' }}
            animate={reduced ? false : { y: '0%' }}
            transition={{ duration: 1, delay: delay + li * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {Array.from(line).map((ch, ci) => (
              <span className="kinetic__ch" key={ci}>
                {ch}
              </span>
            ))}
          </motion.span>
        </motion.span>
      ))}
    </span>
  )
}
