import { useEffect, useRef } from 'react'

/**
 * Toggles a class while the element is anywhere near the viewport.
 *
 * Used to park looping CSS animations. An `infinite` keyframe animation keeps
 * running when its element is thousands of pixels off-screen — it still burns
 * compositor time and never lets the page reach an idle frame. The canvas field
 * already pauses itself via IntersectionObserver; this gives the CSS loops the
 * same discipline.
 */
export function useOnscreen<T extends HTMLElement>(rootMargin = '300px') {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-onscreen', entry.isIntersecting),
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return ref
}
