import { useEffect, useRef } from 'react'
import { useEnvironment } from '../../hooks/useEnvironment'
import { lerp } from '../../lib/math'
import './cursor.css'

/**
 * A dot that tracks the pointer exactly and a ring that lags behind it.
 *
 * The ring is the only part that carries state: it expands and inverts over
 * anything interactive, and reads a label from `data-cursor` when an element
 * wants to say what it does. Mounted only on fine pointers — there is no
 * "mobile version" of a cursor, so there is no code path for one.
 */
export function Cursor() {
  const { fine, reduced } = useEnvironment()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!fine || reduced) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const eased = { ...target }
    let frame = 0
    let visible = false

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        dot.current?.classList.add('is-visible')
        ring.current?.classList.add('is-visible')
      }

      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        'a, button, [data-cursor], input, summary',
      )
      const ringEl = ring.current
      if (!ringEl) return

      if (el) {
        ringEl.classList.add('is-active')
        const text = el.dataset.cursor
        if (label.current) label.current.textContent = text ?? ''
        ringEl.classList.toggle('has-label', Boolean(text))
      } else {
        ringEl.classList.remove('is-active', 'has-label')
        if (label.current) label.current.textContent = ''
      }
    }

    const onLeave = () => {
      visible = false
      dot.current?.classList.remove('is-visible')
      ring.current?.classList.remove('is-visible')
    }

    const tick = () => {
      eased.x = lerp(eased.x, target.x, 0.16)
      eased.y = lerp(eased.y, target.y, 0.16)
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)
    document.documentElement.classList.add('has-custom-cursor')

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [fine, reduced])

  if (!fine || reduced) return null

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} className="cursor-ring__label" />
      </div>
    </>
  )
}
