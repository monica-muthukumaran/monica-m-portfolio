import { useEffect } from 'react'

/**
 * Publishes the ground the fixed chrome is currently sitting on.
 *
 * The page alternates ink and bone sections, and anything `position: fixed` —
 * the navigation, the cursor — floats above whichever one happens to be under
 * it. Without this, the nav is a dark slab with white text sitting on a bone
 * section, which is the single most obvious way an otherwise careful page looks
 * unfinished.
 *
 * Sets `data-ground-active` on <html>, read by nav.css and cursor.css.
 */
export function useGroundTracker() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section'))
    if (!sections.length) return

    let frame = 0
    let last = ''

    // Looked up once. This used to run inside the scroll frame — a DOM query
    // on every frame of every scroll, for a node that never changes.
    const bar = document.querySelector('.nav__inner')

    // Only a bone section can change the answer; ink is the default. That is
    // two elements to measure per frame rather than every section on the page,
    // and each measurement forces layout.
    const boneSections = sections.filter((s) => s.dataset.ground === 'bone')

    // Probe the vertical centre of the bar itself, not an arbitrary offset, so
    // the inversion happens when most of the bar has crossed the seam rather
    // than when its top edge has.
    const probeY = () => {
      if (!bar) return 40
      const r = bar.getBoundingClientRect()
      return r.top + r.height / 2
    }

    const measure = () => {
      frame = 0
      const y = probeY()
      let ground = 'ink'
      for (const s of boneSections) {
        const r = s.getBoundingClientRect()
        if (r.top <= y && r.bottom > y) {
          ground = 'bone'
          break
        }
      }
      if (ground !== last) {
        last = ground
        document.documentElement.dataset.groundActive = ground
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      delete document.documentElement.dataset.groundActive
    }
  }, [])
}
