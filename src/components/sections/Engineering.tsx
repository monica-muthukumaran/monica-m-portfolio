import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { stackNodes, stackEdges } from '../../data/stack'
import { Eyebrow } from '../primitives/Eyebrow'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import { useOnscreen } from '../../hooks/useOnscreen'
import { Fundamentals } from './Fundamentals'
import './engineering.css'

/* Cropped to the content. The old 1000x620 box left ~25% dead margin
   around the nodes, which is most of why the section read as empty. */
const VIEW = '62 44 862 588'

export function Engineering() {
  const [selected, setSelected] = useState('spring')
  const [hovered, setHovered] = useState<string | null>(null)
  const { reduced, fine } = useEnvironment()
  const graphRef = useOnscreen<HTMLDivElement>()

  const byId = useMemo(() => Object.fromEntries(stackNodes.map((n) => [n.id, n])), [])
  const active = hovered ?? selected
  const node = byId[selected]

  const neighbours = useMemo(() => {
    const set = new Set<string>()
    for (const [a, b] of stackEdges) {
      if (a === active) set.add(b)
      if (b === active) set.add(a)
    }
    return set
  }, [active])

  return (
    <section className="section engineering" id="engineering" aria-labelledby="engineering-heading">
      <div className="shell">
        <Eyebrow index="03">Engineering</Eyebrow>

        <div className="engineering__head">
          <h2 id="engineering-heading" className="t-h2 engineering__heading">
            The stack, as it actually connects.
          </h2>
          <Reveal delay={0.08}>
            <p className="t-lead measure">
              Not a list of logos. This is roughly the shape of the systems I work in — pick anything in it and it will
              tell you what I have built with it.
            </p>
          </Reveal>
        </div>

        <div className="engineering__body">
          <Reveal className="engineering__graph-wrap">
            <div ref={graphRef} className="engineering__graph-inner">
            <svg
              className={`engineering__graph ${reduced ? 'is-still' : ''}`}
              viewBox={VIEW}
              role="group"
              aria-label="Interactive diagram of the technologies used, and how they connect"
            >
              <g className="engineering__edges">
                {stackEdges.map(([a, b], i) => {
                  const na = byId[a]
                  const nb = byId[b]
                  if (!na || !nb) return null
                  const live = active === a || active === b
                  return (
                    <line
                      key={i}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      className={live ? 'is-live' : ''}
                      style={{ animationDelay: `${(i % 6) * -0.9}s` }}
                    />
                  )
                })}
              </g>

              <g>
                {stackNodes.map((n) => {
                  const isActive = active === n.id
                  const isNeighbour = neighbours.has(n.id)
                  const dim = !isActive && !isNeighbour

                  return (
                    <g
                      key={n.id}
                      className={`engineering__node ${isActive ? 'is-active' : ''} ${dim ? 'is-dim' : ''}`}
                      transform={`translate(${n.x} ${n.y})`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected === n.id}
                      aria-label={`${n.label}. ${n.years}. Show what I built with it.`}
                      onClick={() => setSelected(n.id)}
                      onPointerEnter={() => setHovered(n.id)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(n.id)}
                      onBlur={() => setHovered(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelected(n.id)
                        }
                      }}
                    >
                      {/* Generous hit area — the mark is not the target. */}
                      <rect className="engineering__hit" x={-62} y={-26} width={124} height={52} rx={2} />
                      <rect
                        className="engineering__mark"
                        x={n.weight === 2 ? -5 : -4}
                        y={n.weight === 2 ? -5 : -4}
                        width={n.weight === 2 ? 10 : 8}
                        height={n.weight === 2 ? 10 : 8}
                      />
                      <text className="engineering__label" y={26} textAnchor="middle">
                        {n.label}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>
            </div>

            <ul className="engineering__index">
              {stackNodes.map((n) => (
                <li key={n.id}>
                  <button
                    className={active === n.id ? 'is-active' : ''}
                    aria-pressed={selected === n.id}
                    onClick={() => setSelected(n.id)}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="engineering__panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0.18 : 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="engineering__panel-head">
                  <h3 className="engineering__panel-title">{node.label}</h3>
                  <span className="t-mono">{node.years}</span>
                </div>
                <ul className="engineering__built">
                  {node.built.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <p className="engineering__hint t-mono">
              {fine && !reduced
                ? 'Hover to trace connections · click to read'
                : 'Tap a technology to read what I built with it'}
            </p>
          </div>
        </div>

        <Fundamentals />
      </div>
    </section>
  )
}
