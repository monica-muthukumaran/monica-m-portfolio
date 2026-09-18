import { useRef, type ReactNode } from 'react'
import { useEnvironment } from '../../hooks/useEnvironment'

type Props = {
  children: ReactNode
  /** Maximum displacement in px. */
  strength?: number
  /** Activation radius in px beyond the element's own box. */
  radius?: number
  className?: string
}

/**
 * Pointer magnetism. Reads pointer position against the element's box and
 * translates toward it, releasing with a slight overshoot.
 *
 * Writes directly to style.transform on a composited layer rather than going
 * through React state — a magnetic button that re-renders on pointermove is a
 * magnetic button that drops frames.
 */
export function Magnetic({ children, strength = 10, radius = 90, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const { fine, reduced } = useEnvironment()
  const frame = useRef(0)

  if (!fine || reduced) {
    return <span className={className}>{children}</span>
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const distance = Math.hypot(dx, dy)
      const reach = Math.max(rect.width, rect.height) / 2 + radius
      const pull = Math.max(0, 1 - distance / reach)
      el.style.transition = 'transform 120ms linear'
      el.style.transform = `translate3d(${(dx / reach) * strength * pull * 2}px, ${(dy / reach) * strength * pull * 2}px, 0)`
    })
  }

  const release = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.transition = 'transform 520ms cubic-bezier(0.34, 1.32, 0.64, 1)'
    el.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', willChange: 'transform' }}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
      onBlur={release}
    >
      {children}
    </span>
  )
}
