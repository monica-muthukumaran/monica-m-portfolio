import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { nav, profile } from '../../data/profile'
import { scrollToId } from '../../lib/scroller'
import { useEnvironment } from '../../hooks/useEnvironment'
import './nav.css'

export function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [active, setActive] = useState<string>('')
  const [open, setOpen] = useState(false)
  const { reduced } = useEnvironment()
  const panel = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  /* The bar condenses once the hero is behind us. One passive listener,
     one boolean — no scroll position in React state. */
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > window.innerHeight * 0.72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Active section. rootMargin biases toward the section occupying the
     upper-middle of the viewport, which is where the eye actually is. */
  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* Overlay: lock scroll, trap focus, close on Escape. */
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const raf = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('a, button')?.focus())

    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header className={`nav ${condensed ? 'is-condensed' : ''}`}>
        <div className="nav__inner">
          <button className="nav__mark" onClick={() => scrollToId('top')} aria-label="Back to top">
            <span className="nav__mark-glyph" aria-hidden="true">
              MM
            </span>
            <span className="nav__mark-name">{profile.name}</span>
          </button>

          <nav className="nav__links" aria-label="Sections">
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav__link ${active === item.id ? 'is-active' : ''}`}
                    onClick={() => go(item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <a className="nav__cta" href={profile.contact.resume} target="_blank" rel="noreferrer">
            Résumé
            <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
          </a>

          <button
            ref={trigger}
            className="nav__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-overlay"
          >
            {open ? 'Close' : 'Index'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-overlay"
            className="nav-overlay"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={reduced ? { duration: 0.2 } : { duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="nav-overlay__list">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.18 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button onClick={() => go(item.id)}>
                    <span className="nav-overlay__index num">0{i + 1}</span>
                    <span className="nav-overlay__label">{item.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="nav-overlay__foot">
              <a href={profile.contact.resume} target="_blank" rel="noreferrer">
                Résumé
              </a>
              <a href={profile.contact.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
