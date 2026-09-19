import { useEffect, useState } from 'react'

/**
 * A hash router in forty lines, because the alternative is a dependency.
 *
 * Two routes exist: '/' and '/work/:id'. Hash routing rather than history
 * routing specifically so the site keeps working when it is served as static
 * files from anywhere — no rewrite rule, no 404 on a deep link, no server.
 */

export type Route = { name: 'home' } | { name: 'project'; id: string }

/**
 * Only a hash beginning with '/' is a route. The page also uses plain anchor
 * hashes — the skip link is `#main` — and treating one of those as a route
 * would navigate a reader off the project they are reading the moment they
 * pressed Tab.
 */
const parse = (hash: string): Route | null => {
  const path = hash.replace(/^#/, '')
  // No hash at all is the homepage — this is the state a visitor arrives in,
  // and the one the browser returns them to when they press back from the
  // first project they opened.
  if (path === '') return { name: 'home' }
  if (!path.startsWith('/')) return null
  const match = /^\/work\/([\w-]+)$/.exec(path)
  return match ? { name: 'project', id: match[1] } : { name: 'home' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { name: 'home' } : (parse(window.location.hash) ?? { name: 'home' }),
  )

  useEffect(() => {
    const onHash = () => {
      const next = parse(window.location.hash)
      if (next) setRoute(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}

/**
 * Navigate, and put the new page at its top.
 *
 * The scroll reset has to happen after the hash change, or the browser
 * restores the previous page's offset on top of it — which lands a visitor
 * halfway down a project they have not started reading.
 */
export function navigate(path: string) {
  if (window.location.hash === `#${path}`) return
  window.location.hash = path
  requestAnimationFrame(() => window.scrollTo(0, 0))
}

export const projectPath = (id: string) => `/work/${id}`
