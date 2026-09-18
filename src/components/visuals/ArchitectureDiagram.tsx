import type { DiagramBand } from '../../data/diagrams'
import './architecture.css'

const W = 780
const PAD_X = 96
const PAD_TOP = 34
const BAND_H = 74
const BAND_GAP = 52
const BOX_GAP = 16

type Props = {
  bands: readonly DiagramBand[]
  /** Bands 0..stage are drawn. -1 draws nothing, bands.length-1 draws all. */
  stage: number
  /** Ignore `stage` and draw the whole system. Used on mobile and for print. */
  complete?: boolean
  title: string
}

export function ArchitectureDiagram({ bands, stage, complete = false, title }: Props) {
  const height = PAD_TOP * 2 + bands.length * BAND_H + (bands.length - 1) * BAND_GAP
  const innerW = W - PAD_X - 34

  return (
    <figure className="arch" aria-labelledby={`${title}-diagram-title`}>
      <svg
        className="arch__svg"
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-labelledby={`${title}-diagram-title`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={`${title}-diagram-title`}>{`${title} — system architecture`}</title>

        {bands.map((band, bi) => {
          const visible = complete || bi <= stage
          const y = PAD_TOP + bi * (BAND_H + BAND_GAP)
          const count = band.boxes.length
          const boxW = (innerW - BOX_GAP * (count - 1)) / count
          const busY = y + BAND_H + BAND_GAP / 2
          const hasBus = bi < bands.length - 1
          const busAccent = band.accent || bands[bi + 1]?.accent

          return (
            <g
              key={bi}
              className="arch__band"
              data-visible={visible}
              style={{ transitionDelay: `${visible ? bi * 70 : 0}ms` }}
            >
              {/* Band tag */}
              <text className="arch__tag" x={0} y={y + BAND_H / 2} dominantBaseline="middle">
                {band.tag.toUpperCase()}
              </text>

              {band.boxes.map((box, i) => {
                const x = PAD_X + i * (boxW + BOX_GAP)
                return (
                  <g key={i} className={`arch__box ${box.accent ? 'is-accent' : ''}`}>
                    <rect x={x} y={y} width={boxW} height={BAND_H} rx={1} />
                    <text className="arch__label" x={x + 14} y={y + (box.sub ? 28 : BAND_H / 2 + 1)}>
                      {box.label}
                    </text>
                    {box.sub && (
                      <text className="arch__sub" x={x + 14} y={y + 48}>
                        {box.sub}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Bus down to the next band: stubs out of each box, one shared
                  rule, then a single feed into the band below. */}
              {hasBus &&
                (() => {
                  const nextCount = bands[bi + 1].boxes.length
                  const nextBoxW = (innerW - BOX_GAP * (nextCount - 1)) / nextCount
                  const from = band.boxes.map((_, i) => PAD_X + i * (boxW + BOX_GAP) + boxW / 2)
                  const to = bands[bi + 1].boxes.map((_, i) => PAD_X + i * (nextBoxW + BOX_GAP) + nextBoxW / 2)
                  // The rule has to span every stub on both sides, or a band
                  // holding a single box leaves the one below it unconnected.
                  const all = [...from, ...to]
                  const left = Math.min(...all)
                  const right = Math.max(...all)

                  return (
                    <g className={`arch__bus ${busAccent ? 'is-accent' : ''}`}>
                      {from.map((x, i) => (
                        <line key={`f${i}`} x1={x} y1={y + BAND_H} x2={x} y2={busY} />
                      ))}
                      {left !== right && <line x1={left} y1={busY} x2={right} y2={busY} />}
                      {to.map((x, i) => (
                        <line key={`t${i}`} x1={x} y1={busY} x2={x} y2={busY + BAND_GAP / 2} />
                      ))}
                    </g>
                  )
                })()}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
