import { useEffect, useRef, useState } from 'react'
import { exploring } from '../../data/exploring'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { clamp } from '../../lib/math'
import './exploring.css'

/** Authored placement, in percent of the field. Laid out by eye, not by force. */
const PLACEMENT = [
  { x: 2, y: 4 },
  { x: 40, y: 20 },
  { x: 4, y: 40 },
  { x: 62, y: 1 },
  { x: 33, y: 56 },
  { x: 2, y: 72 },
  { x: 71, y: 38 },
  { x: 55, y: 76 },
  { x: 76, y: 60 },
]

export function Exploring() {
  const { fine, reduced } = useEnvironment()
  const fieldRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const interactive = fine && !reduced

  /* Pointer repulsion. One RAF loop, one pass over nine elements, written
     straight to style — no React state in the movement path. */
  useEffect(() => {
    if (!interactive) return
    const field = fieldRef.current
    if (!field) return
    const items = Array.from(field.querySelectorAll<HTMLElement>('.exploring__item'))
    let frame = 0
    const pointer = { x: -9999, y: -9999 }

    const onMove = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(apply)
    }

    const apply = () => {
      for (const el of items) {
        const cx = el.offsetLeft + el.offsetWidth / 2
        const cy = el.offsetTop + el.offsetHeight / 2
        const dx = cx - pointer.x
        const dy = cy - pointer.y
        const dist = Math.hypot(dx, dy)
        const push = clamp(1 - dist / 260, 0, 1)
        const scale = 1 + push * 0.045
        el.style.transform = `translate3d(${(dx / (dist || 1)) * push * 22}px, ${
          (dy / (dist || 1)) * push * 22
        }px, 0) scale(${scale})`
        el.style.setProperty('--near', String(push))
      }
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      for (const el of items) {
        el.style.transform = 'translate3d(0,0,0) scale(1)'
        el.style.setProperty('--near', '0')
      }
    }

    field.addEventListener('pointermove', onMove)
    field.addEventListener('pointerleave', onLeave)
    return () => {
      field.removeEventListener('pointermove', onMove)
      field.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [interactive])

  return (
    <section className="section exploring" aria-labelledby="exploring-heading">
      <div className="shell">
        <Eyebrow index="06">Currently exploring</Eyebrow>

        <div className="exploring__head">
          <h2 id="exploring-heading" className="t-h2 exploring__heading">
            <MaskText lines={['What has my', 'attention now.']} />
          </h2>
          <Reveal delay={0.08}>
            <p className="t-lead exploring__note">
              Open questions rather than finished skills. Most of them are here because something I built ran into their
              edges.
            </p>
          </Reveal>
        </div>

        {interactive ? (
          <div className="exploring__field" ref={fieldRef}>
            {exploring.map((item, i) => (
              <button
                key={item.label}
                className={`exploring__item exploring__item--w${item.w} ${active === i ? 'is-open' : ''}`}
                style={{ left: `${PLACEMENT[i].x}%`, top: `${PLACEMENT[i].y}%` }}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                aria-expanded={active === i}
              >
                <span className="exploring__label">{item.label}</span>
                <span className="exploring__tip">{item.note}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Not another label-over-caption list — three other sections already
                use that shape. A cloud set at mixed sizes, with one readout that
                answers whichever term you press. */}
            <div className="exploring__cloud">
              {exploring.map((item, i) => (
                <button
                  key={item.label}
                  className={`exploring__chip exploring__chip--w${item.w} ${active === i ? 'is-open' : ''}`}
                  onClick={() => setActive(active === i ? null : i)}
                  aria-pressed={active === i}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="exploring__readout" aria-live="polite">
              {active !== null ? exploring[active].note : 'Press any of these to read why it is on the list.'}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
