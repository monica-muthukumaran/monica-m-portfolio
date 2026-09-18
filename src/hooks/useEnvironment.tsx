import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Environment = {
  /** prefers-reduced-motion: reduce */
  reduced: boolean
  /** A precise pointer on a desktop-width viewport. */
  fine: boolean
  /** Enough viewport in both axes to hold a pinned scene without clipping it. */
  roomy: boolean
  /** True once the page has committed its first paint. */
  ready: boolean
  /** Shorthand: rich scroll choreography is allowed. */
  cinematic: boolean
}

const EnvironmentContext = createContext<Environment>({
  reduced: true,
  fine: false,
  roomy: false,
  ready: false,
  cinematic: false,
})

const query = (q: string) => (typeof window === 'undefined' ? false : window.matchMedia(q).matches)

function useMediaQuery(q: string, initial: boolean) {
  const [matches, setMatches] = useState(initial)
  useEffect(() => {
    const mql = window.matchMedia(q)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [q])
  return matches
}

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', query('(prefers-reduced-motion: reduce)'))
  // Must be resolved synchronously on the first render. Starting it at `false`
  // mounts the flat variant of every scene, then swaps to the pinned one a tick
  // later — which re-parents the element that useScroll has already measured,
  // and the scroll progress silently stays at 0 for the rest of the session.
  const fine = useMediaQuery(
    '(pointer: fine) and (min-width: 900px)',
    query('(pointer: fine) and (min-width: 900px)'),
  )
  // A pinned scene gets exactly one screen, and the tallest column is the one
  // carrying the award badge plus a six-line result. Measured, that overflows
  // at 802px, so the cut is 840 — re-measure this if the header grows again.
  // Below it the flat, scrollable telling is the honest layout, not a clipped
  // one.
  const roomy = useMediaQuery(
    '(pointer: fine) and (min-width: 900px) and (min-height: 840px)',
    query('(pointer: fine) and (min-width: 900px) and (min-height: 840px)'),
  )
  const [ready, setReady] = useState(false)

  // Defer everything animation-related until after the browser has had a
  // chance to paint the hero. The name is the LCP element; nothing may
  // compete with it for the main thread.
  useEffect(() => {
    let raf = 0
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setReady(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const value = useMemo<Environment>(
    () => ({ reduced, fine, roomy, ready, cinematic: !reduced && ready }),
    [reduced, fine, roomy, ready],
  )

  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>
}

export const useEnvironment = () => useContext(EnvironmentContext)
