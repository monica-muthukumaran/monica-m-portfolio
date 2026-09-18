import { useEffect } from 'react'
import { setScroller } from '../lib/scroller'

/**
 * Lenis smooth scrolling.
 *
 * Loaded on demand and only when motion is enabled and the pointer is fine —
 * native momentum scrolling on touch devices is better than anything a library
 * does to it, and hijacking it is the most common way a "premium" site becomes
 * unusable on a phone.
 *
 * Nothing needs to be told about the smoothed position: the pinned scenes are
 * CSS `position: sticky`, and the scrubbed values come from motion's `useScroll`,
 * both of which read the real scroll position the browser reports.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    let lenis: InstanceType<typeof import('lenis').default> | null = null
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return

      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
        syncTouch: false,
      })

      setScroller(lenis as never)
      document.documentElement.classList.add('lenis-active')

      const raf = (time: number) => {
        lenis?.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      lenis?.destroy()
      setScroller(null)
      document.documentElement.classList.remove('lenis-active')
    }
  }, [enabled])
}
