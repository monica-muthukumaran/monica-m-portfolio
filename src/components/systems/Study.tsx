import { useEffect, useState, type ReactNode } from 'react'
import { buildStates, type BuildState, type SystemNode } from '../../data/systems'
import { Reveal } from '../primitives/Reveal'
import './study.css'

/**
 * Shared chrome for the two long-form case studies.
 *
 * The site already has section headings; these are a level below that, so they
 * are set as mono tags rather than more display type. The point of the block is
 * the drawing inside it.
 */

export function StudyBlock({
  tag,
  title,
  lede,
  children,
}: {
  tag: string
  title: string
  lede?: string
  children: ReactNode
}) {
  return (
    <section className="study-block">
      <Reveal>
        <header className="study-block__head">
          <span className="study-block__tag t-label">{tag}</span>
          <h4 className="study-block__title">{title}</h4>
          {lede && <p className="study-block__lede">{lede}</p>}
        </header>
      </Reveal>
      {children}
    </section>
  )
}

/**
 * The honesty key.
 *
 * Every node in these studies is drawn in one of three states, and this says
 * what they mean. It is the most important element on the page: without it the
 * drawings would imply that all of this is running code, which is not true of
 * the payment gateway and would be the one claim on the site worth doubting.
 */
export function StateLegend({ states = ['built', 'designed', 'studied'] }: { states?: readonly BuildState[] }) {
  return (
    <Reveal>
      <ul className="legend" aria-label="How to read this drawing">
        {states.map((s) => (
          <li key={s} className="legend__item" data-state={s}>
            <span className="legend__mark" aria-hidden="true" />
            <span className="legend__label">{buildStates[s].label}</span>
            <span className="legend__blurb">{buildStates[s].blurb}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

/** A node in a flow. Hover, focus or press to fill the readout beside it. */
export function NodeChip({
  node,
  active,
  onActivate,
  className = '',
}: {
  node: SystemNode
  active: boolean
  onActivate: (node: SystemNode | null) => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`node ${active ? 'is-active' : ''} ${className}`}
      data-state={node.state}
      onPointerEnter={() => onActivate(node)}
      onFocus={() => onActivate(node)}
      onClick={() => onActivate(active ? null : node)}
      aria-pressed={active}
    >
      <span className="node__mark" aria-hidden="true" />
      <span className="node__label">{node.label}</span>
      <span className="node__role">{node.role}</span>
    </button>
  )
}

/** The panel a NodeChip writes into. Holds its height so nothing reflows. */
export function Readout({ node, fallback }: { node: SystemNode | null; fallback: string }) {
  return (
    <div className="readout" aria-live="polite">
      {node ? (
        <>
          <span className="readout__state t-label" data-state={node.state}>
            {buildStates[node.state].label}
          </span>
          <p className="readout__body">{node.note ?? node.role}</p>
        </>
      ) : (
        <p className="readout__body readout__body--idle">{fallback}</p>
      )}
    </div>
  )
}

/** Small hook for the single-selection readout pattern these blocks all share. */
export function useReadout() {
  const [active, setActive] = useState<SystemNode | null>(null)
  return { active, setActive }
}

/**
 * Walks a cursor along a path, one step at a time, restarting whenever `key`
 * changes. Under reduced motion it jumps straight to the end — the walk is
 * the thing being removed, not the information.
 */
export function useWalk(length: number, key: string, reduced: boolean, interval = 460) {
  const [cursor, setCursor] = useState(length - 1)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reduced) {
      setCursor(length - 1)
      return
    }
    setCursor(0)
    let step = 0
    const id = window.setInterval(() => {
      step += 1
      setCursor(step)
      if (step >= length - 1) window.clearInterval(id)
    }, interval)
    return () => window.clearInterval(id)
  }, [length, key, run, reduced, interval])

  return { cursor, replay: () => setRun((r) => r + 1) }
}
