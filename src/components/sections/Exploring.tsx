import { useEffect, useRef, useState } from 'react'
import { exploring, offHours } from '../../data/exploring'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { useOnscreen } from '../../hooks/useOnscreen'
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

        <OffHours />
      </div>
    </section>
  )
}

/**
 * A knight's move, drawn on a board fragment.
 *
 * The board is the point: a knight is the only piece whose move you cannot
 * read off a straight line, which is the most honest thing a chess motif can
 * say in one drawing. The path strokes itself on hover and on scroll.
 */
function ChessMotif() {
  const cells = Array.from({ length: 9 }, (_, i) => ({ c: i % 3, r: Math.floor(i / 3) }))
  return (
    <svg className="off__art" viewBox="0 0 120 120" role="img" aria-label="A knight’s move across a board">
      <g className="off__board">
        {cells.map(({ c, r }) => (
          <rect key={`${c}${r}`} x={6 + c * 36} y={6 + r * 36} width={36} height={36} data-dark={(c + r) % 2 === 0} />
        ))}
      </g>
      {/* Down two, across one. */}
      <path className="off__path" d="M 24 24 L 24 96 L 96 96" fill="none" />
      <circle className="off__from" cx={24} cy={24} r={5} />
      <circle className="off__to" cx={96} cy={96} r={5} />
    </svg>
  )
}

/** A contour that draws itself — one unbroken line, the way a sketch starts. */
function PencilMotif() {
  return (
    <svg className="off__art" viewBox="0 0 120 120" role="img" aria-label="A single continuous drawn line">
      <path
        className="off__stroke"
        d="M 16 92 C 26 46 46 20 64 26 C 82 32 76 66 58 72 C 40 78 34 56 48 44 C 62 32 92 38 104 66"
        fill="none"
      />
      <circle className="off__nib" cx={16} cy={92} r={3.5} />
    </svg>
  )
}

/**
 * The part of the page that is not about engineering at all.
 *
 * Two drawings, two captions, and a line that changes register at the end. It
 * is the last thing before the contact section, so it is allowed to be the one
 * place on the site where nothing is being argued.
 */
function OffHours() {
  const { reduced } = useEnvironment()
  const ref = useOnscreen<HTMLDivElement>()

  return (
    <div className={`off ${reduced ? 'is-still' : ''}`} ref={ref}>
      <Reveal>
        <div className="off__head">
          <span className="off__tag t-label">{offHours.heading}</span>
          <p className="off__lede">{offHours.lede}</p>
        </div>
      </Reveal>

      <ul className="off__list">
        {offHours.items.map((item, i) => (
          <li key={item.label}>
            <Reveal delay={0.06 + i * 0.08}>
              <figure className="off__item">
                <span className="off__art-wrap" aria-hidden="true">
                  {item.motif === 'chess' ? <ChessMotif /> : <PencilMotif />}
                </span>
                <figcaption className="off__caption">
                  <h3 className="off__label">{item.label}</h3>
                  <p className="off__note">
                    {item.note.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                  <p className="off__aside">{item.aside}</p>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <p className="off__closing">
          {offHours.closing.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </Reveal>
    </div>
  )
}
