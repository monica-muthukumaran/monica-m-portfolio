type LenisLike = {
  raf: (t: number) => void
  destroy: () => void
  on: (e: string, cb: () => void) => void
  scrollTo: (target: string | number | HTMLElement, opts?: Record<string, unknown>) => void
}

let instance: LenisLike | null = null

export const setScroller = (l: LenisLike | null) => {
  instance = l
}

/**
 * Anchor navigation.
 *
 * Moves the viewport, then moves focus — otherwise keyboard and screen-reader
 * users stay at the top of the document while the page scrolls away underneath
 * them. `preventScroll` stops the focus call from undoing the smooth motion.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const focusTarget = () => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  if (instance) {
    instance.scrollTo(el, { offset: 0, duration: 1.15, onComplete: focusTarget })
    return
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  window.setTimeout(focusTarget, reduced ? 0 : 600)
}
