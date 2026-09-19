import type { DiagramBand } from '../../data/diagrams'
import { socialGraph } from '../../data/systems'
import type { Signature as SignatureKind } from '../../data/projects'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { useOnscreen } from '../../hooks/useOnscreen'
import './signature.css'

/**
 * Per-project system drawing.
 *
 * Four projects rendered by one diagram component read as four instances of a
 * template. So each project is drawn in the form its own domain has: evidence
 * converging in bands, a transaction moving down a lane, a graph spreading
 * out, a hierarchy resolving downward.
 *
 * Colour is not the variable — vermilion stays the only accent on the site,
 * and four accent hues would make it decorative. Shape is the variable.
 *
 * Every motif takes the same contract as ArchitectureDiagram: `stage` draws
 * bands 0..stage as the story is told, `complete` ignores it and draws the
 * whole system (mobile, reduced motion, print).
 */

type Props = {
  kind: SignatureKind
  bands: readonly DiagramBand[]
  stage: number
  complete?: boolean
  title: string
}

const W = 780

export function Signature({ kind, bands, stage, complete = false, title }: Props) {
  if (kind === 'lanes') return <LaneMotif bands={bands} stage={stage} complete={complete} title={title} />
  if (kind === 'graph') return <GraphMotif stage={stage} complete={complete} title={title} />
  if (kind === 'tree') return <TreeMotif bands={bands} stage={stage} complete={complete} title={title} />
  return <ArchitectureDiagram bands={bands} stage={stage} complete={complete} title={title} />
}

/* ============================================================
   Lanes — the payment gateway.
   One object moving down a track, past stations that each have to be
   survivable on their own. The spine is the transaction; the plates are
   what happens to it.
   ============================================================ */

const LANE_TOP = 26
const LANE_H = 78
const LANE_GAP = 40
const SPINE_X = 44
const PLATE_X = 96

function LaneMotif({ bands, stage, complete, title }: Omit<Props, 'kind'>) {
  const ref = useOnscreen<HTMLElement>()
  const height = LANE_TOP * 2 + bands.length * LANE_H + (bands.length - 1) * LANE_GAP
  const plateW = W - PLATE_X - 20
  const spineTop = LANE_TOP + LANE_H / 2
  const spineBottom = height - LANE_TOP - LANE_H / 2

  return (
    <figure className="sig sig--lanes" ref={ref} aria-labelledby={`${title}-sig-title`}>
      <svg className="sig__svg" viewBox={`0 0 ${W} ${height}`} role="img" aria-labelledby={`${title}-sig-title`}>
        <title id={`${title}-sig-title`}>{`${title} — one payment moving through the system`}</title>

        {/* The track itself, drawn once and always present. */}
        <line className="sig__spine" x1={SPINE_X} y1={spineTop} x2={SPINE_X} y2={spineBottom} />

        {/* The transaction. One token, travelling, so the drawing has a subject
            rather than being a picture of boxes. */}
        <g className="sig__token" style={{ ['--travel' as string]: `${spineBottom - spineTop}px` }}>
          <rect x={SPINE_X - 4} y={spineTop - 4} width={8} height={8} />
        </g>

        {bands.map((band, bi) => {
          const visible = complete || bi <= stage
          const y = LANE_TOP + bi * (LANE_H + LANE_GAP)
          const mid = y + LANE_H / 2
          const count = band.boxes.length
          const cellW = plateW / count

          return (
            <g
              key={bi}
              className={`sig__lane ${band.accent ? 'is-accent' : ''}`}
              data-visible={visible}
              style={{ transitionDelay: `${visible ? bi * 80 : 0}ms` }}
            >
              {/* Station marker on the spine — a diamond where the payment's
                  state actually changes, a dot where it only passes through. */}
              {band.accent ? (
                <rect className="sig__stop is-accent" x={SPINE_X - 5} y={mid - 5} width={10} height={10} transform={`rotate(45 ${SPINE_X} ${mid})`} />
              ) : (
                <circle className="sig__stop" cx={SPINE_X} cy={mid} r={4} />
              )}
              <line className="sig__stub" x1={SPINE_X} y1={mid} x2={PLATE_X} y2={mid} />

              <text className="sig__tag" x={0} y={mid - 16}>
                {band.tag.toUpperCase()}
              </text>

              <rect className="sig__plate" x={PLATE_X} y={y} width={plateW} height={LANE_H} />

              {band.boxes.map((box, i) => {
                const cx = PLATE_X + i * cellW
                return (
                  <g key={i} className={`sig__cell ${box.accent ? 'is-accent' : ''}`}>
                    {i > 0 && <line className="sig__divider" x1={cx} y1={y + 12} x2={cx} y2={y + LANE_H - 12} />}
                    <text className="sig__label" x={cx + 16} y={y + 32}>
                      {box.label}
                    </text>
                    {box.sub && (
                      <text className="sig__sub" x={cx + 16} y={y + 54}>
                        {box.sub}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

/* ============================================================
   Graph — the social platform.
   Nodes and labelled relationships, grown one narrative step at a time.
   ============================================================ */

const GH = 500

function GraphMotif({ stage, complete, title }: Omit<Props, 'kind' | 'bands'>) {
  const ref = useOnscreen<HTMLElement>()
  const pos = (id: string) => {
    const n = socialGraph.nodes.find((x) => x.id === id)!
    return { x: (n.x / 100) * W, y: (n.y / 100) * GH }
  }

  return (
    <figure className="sig sig--graph" ref={ref} aria-labelledby={`${title}-sig-title`}>
      <svg className="sig__svg" viewBox={`0 0 ${W} ${GH}`} role="img" aria-labelledby={`${title}-sig-title`}>
        <title id={`${title}-sig-title`}>{`${title} — connections as a property graph`}</title>

        {socialGraph.edges.map((e, i) => {
          const a = pos(e.from)
          const b = pos(e.to)
          const visible = complete || e.at <= stage
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          // Keep the relationship label upright rather than upside-down on
          // edges that run right-to-left.
          let angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
          if (angle > 90 || angle < -90) angle += 180

          return (
            <g key={i} className="sig__edge" data-visible={visible} style={{ transitionDelay: `${visible ? e.at * 90 : 0}ms` }}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <text className="sig__rel" x={mx} y={my - 7} textAnchor="middle" transform={`rotate(${angle} ${mx} ${my - 7})`}>
                {e.label}
              </text>
            </g>
          )
        })}

        {socialGraph.nodes.map((n) => {
          const p = pos(n.id)
          const visible = complete || n.at <= stage
          const r = n.kind === 'person' ? 26 : 19
          return (
            <g
              key={n.id}
              className={`sig__node is-${n.kind} ${n.id === 'a' ? 'is-root' : ''}`}
              data-visible={visible}
              style={{ transitionDelay: `${visible ? n.at * 90 + 40 : 0}ms`, ['--o' as string]: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r={r} />
              <text className="sig__node-label" x={p.x} y={p.y + r + 20} textAnchor="middle">
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

/* ============================================================
   Tree — the taxonomy engine.
   A hierarchy resolving downward, drawn with elbow connectors, because that
   is the shape a classification actually has.
   ============================================================ */

const T_TOP = 26
const T_ROW = 60
const T_LEAD = 12
const T_INDENT = 46
const T_STEM = 18

function TreeMotif({ bands, stage, complete, title }: Omit<Props, 'kind'>) {
  const ref = useOnscreen<HTMLElement>()

  // Every box gets its own row, so the drawing reads as an outline rather than
  // as bands that happen to be indented. `parent` is the row this one hangs
  // off — the last row one level up, which is what an outline actually means.
  const rows = bands.flatMap((band, depth) =>
    band.boxes.map((box, i) => ({ box, depth, first: i === 0, tag: band.tag, accent: band.accent })),
  )
  const parentOf = rows.map((row, i) => {
    for (let j = i - 1; j >= 0; j -= 1) if (rows[j].depth === row.depth - 1) return j
    return -1
  })

  const rowY = (i: number) => T_TOP + i * (T_ROW + T_LEAD)
  const height = T_TOP * 2 + rows.length * (T_ROW + T_LEAD)

  return (
    <figure className="sig sig--tree" ref={ref} aria-labelledby={`${title}-sig-title`}>
      <svg className="sig__svg" viewBox={`0 0 ${W} ${height}`} role="img" aria-labelledby={`${title}-sig-title`}>
        <title id={`${title}-sig-title`}>{`${title} — a product resolving to a node in the hierarchy`}</title>

        {rows.map((row, i) => {
          const visible = complete || row.depth <= stage
          const y = rowY(i)
          const x = 34 + row.depth * T_INDENT
          const parent = parentOf[i]

          return (
            <g
              key={i}
              className={`sig__row ${row.accent ? 'is-accent' : ''}`}
              data-visible={visible}
              style={{ transitionDelay: `${visible ? row.depth * 80 : 0}ms` }}
            >
              {/* Elbow to the level above: down the parent's stem, then in. */}
              {parent >= 0 && (
                <path
                  className="sig__elbow"
                  d={`M ${34 + rows[parent].depth * T_INDENT + T_STEM} ${rowY(parent) + T_ROW} V ${y + T_ROW / 2} H ${x}`}
                  fill="none"
                />
              )}

              <rect className="sig__branch" x={x} y={y} width={W - x - 20} height={T_ROW} />
              <text className="sig__label" x={x + 16} y={row.box.sub ? y + 25 : y + T_ROW / 2 + 1}>
                {row.box.label}
              </text>
              {row.box.sub && (
                <text className="sig__sub" x={x + 16} y={y + 44}>
                  {row.box.sub}
                </text>
              )}
              {row.first && (
                <text className="sig__depth" x={W - 36} y={y + 25} textAnchor="end">
                  {row.tag.toUpperCase()}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
