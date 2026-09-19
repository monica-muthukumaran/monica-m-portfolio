import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import {
  cachePath,
  graphReasoning,
  socialDomains,
  socialEvents,
  socialServices,
  type ServiceNode,
  type StreamEvent,
} from '../../data/systems'
import { Signature } from '../visuals/Signature'
import { Reveal } from '../primitives/Reveal'
import { MaskText } from '../primitives/MaskText'
import { useEnvironment } from '../../hooks/useEnvironment'
import { useOnscreen } from '../../hooks/useOnscreen'
import { clamp } from '../../lib/math'
import { NodeChip, Readout, StateLegend, StudyBlock, useReadout, useWalk } from './Study'
import './social.css'

/* ============================================================
   01 — The graph, growing
   ============================================================ */

const GRAPH_STEPS = [
  'One node. A person, and nothing else yet.',
  'Three relationships, each a different kind: a mutual connection, a one-way follow, an interaction.',
  'Content hangs off the person who wrote it — another edge, not another table.',
  'And an edge that is not a person at all. A shared interest is what makes a recommendation possible.',
]

function GraphGrowth() {
  const { reduced } = useEnvironment()
  const ref = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    const next = clamp(Math.floor(v * (GRAPH_STEPS.length + 0.4)), 0, GRAPH_STEPS.length - 1)
    setStage((current) => (current === next ? current : next))
  })

  const shown = reduced ? GRAPH_STEPS.length - 1 : stage

  return (
    <div className="grow" ref={ref}>
      <div className="grow__field">
        <Signature kind="graph" bands={[]} stage={shown} complete={reduced} title="Distributed Social Platform" />
      </div>

      <div className="grow__caption">
        <ol className="grow__steps">
          {GRAPH_STEPS.map((step, i) => (
            <li key={i} className={i === shown ? 'is-active' : i < shown ? 'is-past' : ''}>
              <span className="grow__steps-mark" aria-hidden="true" />
              <span className="grow__steps-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function DomainStrip() {
  const { active, setActive } = useReadout()

  return (
    <div className="domains">
      <Reveal>
        <p className="domains__bridge">
          Once that graph is a product rather than a drawing, it is five things — and each one is a different kind of
          problem.
        </p>
      </Reveal>
      <ul className="domains__list">
        {socialDomains.map((node, i) => (
          <li key={node.id}>
            <Reveal delay={i * 0.04}>
              <NodeChip node={node} active={active?.id === node.id} onActivate={setActive} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ============================================================
   02 — Why a graph
   ============================================================ */

function GraphReasoning() {
  const { reduced } = useEnvironment()
  const { cursor, replay } = useWalk(graphReasoning.chain.length, 'hops', reduced, 520)

  return (
    <div className="hops">
      <ol className="hops__chain">
        {graphReasoning.chain.map((hop, i) => (
          <li key={hop.label} className={`hops__hop ${i <= cursor ? 'is-lit' : ''} ${i === graphReasoning.chain.length - 1 ? 'is-answer' : ''}`}>
            <span className="hops__dot" aria-hidden="true" />
            <span className="hops__label">{hop.label}</span>
            <span className="hops__detail">{hop.detail}</span>
          </li>
        ))}
      </ol>

      <div className="hops__prose">
        <span className="hops__framing t-label">{graphReasoning.framing}</span>
        <p className="hops__body">{graphReasoning.body}</p>
        <p className="hops__caveat">{graphReasoning.caveat}</p>
        {!reduced && (
          <button type="button" className="hops__replay" onClick={replay}>
            Traverse it again
          </button>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   03 — Kafka fan-out
   ============================================================ */

const LANES = [
  { id: 'feed', label: 'Feed service' },
  { id: 'notification', label: 'Notification service' },
  { id: 'analytics', label: 'Analytics' },
]

function KafkaFanout() {
  const ref = useOnscreen<HTMLDivElement>()
  const [event, setEvent] = useState<StreamEvent | null>(null)

  const lit = (laneId: string) => (event ? event.consumer.toLowerCase().includes(laneId) : false)

  return (
    <div className="bus" ref={ref}>
      <div className="bus__diagram">
        <div className="bus__source">
          <span className="bus__source-label">{event?.producer ?? 'Post service'}</span>
          <span className="bus__source-event">{event?.event ?? 'PostCreated'}</span>
        </div>

        <div className="bus__rail" aria-hidden="true">
          <span className="bus__rail-tag">Kafka</span>
          <span className="bus__rail-line" />
        </div>

        <ul className="bus__lanes">
          {LANES.map((lane, i) => (
            <li key={lane.id} className={`bus__lane ${lit(lane.id) ? 'is-lit' : ''}`} style={{ ['--i' as string]: i }}>
              <span className="bus__lane-link" aria-hidden="true" />
              <span className="bus__lane-label">{lane.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bus__table">
        <ul className="bus__events">
          {socialEvents.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                className={`bus__event ${event?.id === e.id ? 'is-active' : ''}`}
                onPointerEnter={() => setEvent(e)}
                onFocus={() => setEvent(e)}
                onClick={() => setEvent(event?.id === e.id ? null : e)}
                aria-pressed={event?.id === e.id}
              >
                <span className="bus__event-name">{e.event}</span>
                <span className="bus__event-route">
                  {e.producer} <span aria-hidden="true">→</span> {e.consumer}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="bus__purpose" aria-live="polite">
          {event ? (
            <>
              <span className="t-label">Why this consumer cares</span>
              <p>{event.purpose}</p>
            </>
          ) : (
            <p className="bus__purpose--idle">
              Hover an event to follow it. The producer never learns who read it — which is the point of putting a
              broker here instead of a call.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   04 — Redis
   ============================================================ */

function CacheFork() {
  const [branch, setBranch] = useState<'hit' | 'miss'>('hit')
  const path = branch === 'hit' ? cachePath.hit : cachePath.miss

  return (
    <div className="cache">
      <div className="switch" role="group" aria-label="Cache outcome">
        <button type="button" onClick={() => setBranch('hit')} aria-pressed={branch === 'hit'}>
          Cache hit
        </button>
        <button type="button" onClick={() => setBranch('miss')} aria-pressed={branch === 'miss'}>
          Cache miss
        </button>
      </div>

      <div className="cache__fork" data-branch={branch}>
        <span className="cache__node cache__node--start">Feed request</span>
        <span className="cache__link" aria-hidden="true" />
        <span className="cache__node cache__node--gate">{cachePath.question}</span>

        <div className="cache__branches">
          <div className={`cache__branch ${branch === 'hit' ? 'is-taken' : ''}`}>
            <span className="cache__branch-tag">{cachePath.hit.label}</span>
            {cachePath.hit.steps.map((s) => (
              <span key={s} className="cache__node">
                {s}
              </span>
            ))}
          </div>

          <div className={`cache__branch ${branch === 'miss' ? 'is-taken' : ''}`}>
            <span className="cache__branch-tag">{cachePath.miss.label}</span>
            {cachePath.miss.steps.map((s) => (
              <span key={s} className="cache__node">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="cache__prose">
        <p className="cache__note">{path.note}</p>
        <p className="cache__body">{cachePath.body}</p>
      </div>
    </div>
  )
}

/* ============================================================
   05 — Service map
   ============================================================ */

function ServiceMap() {
  const [active, setActive] = useState<ServiceNode | null>(null)
  const tiers = [0, 1, 2, 3]
  const linked = (id: string) => Boolean(active?.edges?.includes(id))

  return (
    <div className="map">
      <div className="map__grid">
        {tiers.map((tier) => (
          <div key={tier} className="map__tier">
            {tier > 0 && <span className="map__tier-link" aria-hidden="true" />}
            <ul className="map__row">
              {socialServices
                .filter((s) => s.tier === tier)
                .map((service) => (
                  <li key={service.id}>
                    <NodeChip
                      node={service}
                      active={active?.id === service.id}
                      onActivate={(n) => setActive(n as ServiceNode | null)}
                      className={linked(service.id) ? 'node--linked' : ''}
                    />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="map__side">
        <Readout
          node={active}
          fallback="Hover a service to see what it owns. Anything it depends on lights up with it — which is the only honest way to read a map like this."
        />
        <StateLegend states={['built']} />
      </div>
    </div>
  )
}

/* ============================================================
   The study
   ============================================================ */

export function SocialStudy() {
  return (
    <div className="study study--social" id="study-social">
      <div className="shell">
        <div className="study__head">
          <div>
            <p className="study__kicker">Coding Shuttle · Cohort 5.0</p>
            <h3 className="study__title">
              <MaskText lines={['A network is', 'a shape before', 'it is a feature.']} />
            </h3>
          </div>
          <Reveal delay={0.08}>
            <p className="study__lede">
              Two problems wearing one interface: a graph, where the questions are about paths, and a firehose, where
              one write has to reach three places and the writer must not wait for any of them.
            </p>
          </Reveal>
        </div>

        <div className="study__blocks">
          <StudyBlock
            tag="The graph"
            title="Nodes and relationships, not rows and foreign keys."
            lede="Scroll. The graph grows one relationship at a time, because that is how the model was actually arrived at."
          >
            <GraphGrowth />
            <DomainStrip />
          </StudyBlock>

          <StudyBlock
            tag="Neo4j"
            title="The query nobody wants to write in SQL."
            lede="Five hops from a person to a recommendation. In a graph that is one traversal; in a relational schema it is a self-join for every arrow."
          >
            <GraphReasoning />
          </StudyBlock>

          <StudyBlock
            tag="Kafka"
            title="One write. Three things that care, and none of them in the way."
          >
            <KafkaFanout />
          </StudyBlock>

          <StudyBlock tag="Redis" title="A feed is read far more often than it is written.">
            <CacheFork />
          </StudyBlock>

          <StudyBlock
            tag="Services"
            title="One entrance, and behind it services that do not call each other."
          >
            <ServiceMap />
          </StudyBlock>
        </div>
      </div>
    </div>
  )
}
