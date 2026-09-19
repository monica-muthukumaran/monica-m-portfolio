import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import { certification } from '../../data/certification'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { Magnetic } from '../primitives/Magnetic'
import { useEnvironment } from '../../hooks/useEnvironment'
import './certification.css'

/**
 * Structured learning, kept in proportion.
 *
 * Deliberately smaller than a project scene: no display heading of its own
 * height, no pinned column, one plate. The projects above are the evidence and
 * this is the receipt, and the layout is the argument for that ordering.
 */
export function Certification() {
  const { reduced } = useEnvironment()
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDivElement>(null)
  const asset = certification.asset

  /* Lightbox: lock scroll, trap focus, close on Escape. Same contract as the
     nav overlay — there is only one modal behaviour on this site. */
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !dialog.current) return
      const focusables = dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
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
    const raf = requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>('button')?.focus())

    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  return (
    <section className="section cert" id="certification" aria-labelledby="cert-heading">
      <div className="shell">
        <Eyebrow index="06">Certification</Eyebrow>

        <div className="cert__grid">
          <div className="cert__body">
            <h2 id="cert-heading" className="cert__heading">
              <MaskText lines={['The course is the proof', 'of study. The systems', 'are the proof of work.']} />
            </h2>
            <Reveal delay={0.08}>
              <p className="cert__summary">{certification.summary}</p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="cert__covered">
                <span className="t-label">Covered by the programme</span>
                <ul>
                  {certification.covered.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="cert__covered-note">
                  A syllabus, not a claim. What I built with it is two sections up, and each part of those is marked
                  with whether it is implemented or designed.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <aside className="cert__plate">
              <span className="cert__plate-tag t-label">Credential</span>

              <p className="cert__issuer">{certification.issuer}</p>
              <p className="cert__programme">{certification.programme}</p>

              <dl className="cert__facts">
                <div>
                  <dt>Cohort</dt>
                  <dd className="num">{certification.cohort}</dd>
                </div>
                <div>
                  <dt>Completed</dt>
                  <dd className="num">{certification.completed}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>Project-based</dd>
                </div>
              </dl>

              <div className="cert__actions">
                {/* The button exists only when the certificate does. Until the
                    file is added, linking to the issuer is the honest state —
                    a rendered look-alike would be a fabricated document. */}
                {asset && (
                  <Magnetic strength={7}>
                    <button type="button" className="cert__view" onClick={() => setOpen(true)}>
                      View Certificate
                    </button>
                  </Magnetic>
                )}

                {certification.verifyUrl && (
                  <a className="cert__link" href={certification.verifyUrl} target="_blank" rel="noreferrer">
                    Verify
                    <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                )}

                <a className="cert__link" href={certification.issuerUrl} target="_blank" rel="noreferrer">
                  {certification.issuer}
                  <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {open && asset && (
          <motion.div
            className="cert-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${certification.issuer} — ${certification.programme} certificate`}
            ref={dialog}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.18 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              className="cert-modal__frame"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: reduced ? 0.18 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className="cert-modal__bar">
                <span className="t-label">
                  {certification.issuer} · {certification.programme} · {certification.cohort}
                </span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close certificate">
                  <X size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </header>

              {asset.kind === 'pdf' ? (
                <object className="cert-modal__pdf" data={asset.src} type="application/pdf" aria-label={asset.alt}>
                  <a href={asset.src} target="_blank" rel="noreferrer">
                    Open the certificate
                  </a>
                </object>
              ) : (
                <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} decoding="async" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
