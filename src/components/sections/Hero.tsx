import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { profile } from '../../data/profile'
import { KineticName } from '../visuals/KineticName'
import { useEnvironment } from '../../hooks/useEnvironment'
import { scrollToId } from '../../lib/scroller'
import { useOnscreen } from '../../hooks/useOnscreen'
import './hero.css'

/** Her local time, because a portfolio is also a way of being reachable. */
function LocalTime() {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const update = () => setNow(fmt.format(new Date()))
    update()
    const id = window.setInterval(update, 20_000)
    return () => window.clearInterval(id)
  }, [])

  if (!now) return null
  return (
    <span className="hero__time">
      <span className="num">{now}</span> IST
    </span>
  )
}

export function Hero() {
  const { reduced } = useEnvironment()
  const sectionRef = useOnscreen<HTMLElement>()

  const fade = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.25 : 0.85, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section className="hero" id="top" aria-label="Introduction" ref={sectionRef}>
      {/* The column rules the rest of the page is set against, stated once. */}
      <div className="hero__rules" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero__inner shell">
        <motion.div className="hero__meta" {...fade(0.08)}>
          <span className="hero__meta-role">{profile.role}</span>
          <span className="hero__meta-sep" aria-hidden="true" />
          <span>{profile.location}</span>
          <LocalTime />
        </motion.div>

        <div className="hero__body">
          <h1 className="hero__name">
            <span className="sr-only">{profile.name}</span>
            <KineticName lines={[profile.first, profile.last]} className="hero__name-lines" />
          </h1>

          <motion.p className="hero__lede" {...fade(0.68)}>
            {profile.positioning[0]} <span className="em">{profile.positioning[1]}</span>
          </motion.p>
        </div>

        <motion.div className="hero__foot" {...fade(0.82)}>
          <p className="hero__sub">{profile.heroSub}</p>

          <button className="hero__cue" onClick={() => scrollToId('work')} aria-label="Scroll to selected work">
            <span className="hero__cue-label">Selected work</span>
            <span className="hero__cue-track" aria-hidden="true">
              <span className="hero__cue-thumb" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
