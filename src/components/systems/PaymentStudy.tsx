import { useState } from 'react'
import { RotateCw } from 'lucide-react'
import {
  buildStates,
  failures,
  paymentConsumers,
  paymentSpine,
  saga,
  scale,
  webhook,
  type FailureScenario,
} from '../../data/systems'
import { Reveal } from '../primitives/Reveal'
import { MaskText } from '../primitives/MaskText'
import { useEnvironment } from '../../hooks/useEnvironment'
import { useOnscreen } from '../../hooks/useOnscreen'
import { NodeChip, Readout, StateLegend, StudyBlock, useReadout, useWalk } from './Study'
import './payment.css'

/* ============================================================
   01 — The path of one payment
   ============================================================ */

function EventFlow() {
  const { active, setActive } = useReadout()
  const ref = useOnscreen<HTMLDivElement>()

  return (
    <div className="flow" ref={ref}>
      <div className="flow__stack">
        <ol className="flow__spine">
          {paymentSpine.map((node, i) => (
            <li key={node.id} style={{ ['--i' as string]: i }}>
              <Reveal delay={i * 0.04}>
                <NodeChip node={node} active={active?.id === node.id} onActivate={setActive} />
              </Reveal>
              <span className="flow__link" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="flow__fan">
            <span className="flow__fan-tag t-label">One event · five consumers</span>
            <ul className="flow__consumers">
              {paymentConsumers.map((node, i) => (
                <li key={node.id} style={{ ['--i' as string]: i }}>
                  <NodeChip node={node} active={active?.id === node.id} onActivate={setActive} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <aside className="flow__side">
        <Readout
          node={active}
          fallback="Hover or press any part of the system to read what it is responsible for — and whether it exists yet."
        />
        <StateLegend />
      </aside>
    </div>
  )
}

/* ============================================================
   02 — Payments don't fail politely
   ============================================================ */

function FailurePath({ scenario }: { scenario: FailureScenario }) {
  const { reduced } = useEnvironment()
  const { cursor, replay } = useWalk(scenario.path.length, scenario.id, reduced)

  return (
    <div className="lab__stage">
      <ol className="lab__path">
        {scenario.path.map((step, i) => {
          const lit = i <= cursor
          const isPivot = i === scenario.pivot
          const isEnd = i === scenario.path.length - 1
          return (
            <li
              key={step}
              className={`lab__step ${lit ? 'is-lit' : ''} ${isPivot ? 'is-pivot' : ''} ${isEnd ? 'is-end' : ''}`}
            >
              <span className="lab__step-mark" aria-hidden="true" />
              <span className="lab__step-label">{step}</span>
              {isPivot && cursor >= i && (
                <span className="lab__merge" key={`${scenario.id}-${cursor >= i}`}>
                  {scenario.mechanism}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="lab__verdict">
        <p className="lab__answer">{scenario.answer}</p>
        <p className="lab__detail">{scenario.detail}</p>
        <div className="lab__foot">
          <span className="lab__state t-label" data-state={scenario.state}>
            {buildStates[scenario.state].label}
          </span>
          {!reduced && (
            <button type="button" className="lab__replay" onClick={replay}>
              <RotateCw size={12} strokeWidth={1.75} aria-hidden="true" />
              Run it again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FailureLab() {
  const [index, setIndex] = useState(0)
  const scenario = failures[index]

  return (
    <div className="lab">
      <ol className="lab__menu">
        {failures.map((f, i) => (
          <li key={f.id}>
            <button
              type="button"
              className={`lab__pick ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
            >
              <span className="lab__pick-index num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="lab__pick-title">{f.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <FailurePath scenario={scenario} />
    </div>
  )
}

/* ============================================================
   03 — SAGA
   ============================================================ */

function SagaTrack() {
  const [failing, setFailing] = useState(false)
  const steps = saga.steps

  return (
    <div className="saga">
      <div className="switch" role="group" aria-label="Transaction outcome">
        <button type="button" onClick={() => setFailing(false)} aria-pressed={!failing}>
          Everything works
        </button>
        <button type="button" onClick={() => setFailing(true)} aria-pressed={failing}>
          Step {saga.failAt + 1} fails
        </button>
      </div>

      <ol className="saga__track" data-failing={failing}>
        {steps.map((step, i) => {
          const state = !failing || i < saga.failAt ? 'done' : i === saga.failAt ? 'failed' : 'skipped'
          return (
            <li key={step.label} className="saga__step" data-state={state} style={{ ['--i' as string]: i }}>
              <span className="saga__step-rule" aria-hidden="true" />
              <span className="saga__step-index num">{String(i + 1).padStart(2, '0')}</span>
              <span className="saga__step-label">{step.label}</span>
              <span className="saga__step-detail">{step.detail}</span>
            </li>
          )
        })}
      </ol>

      <div className="saga__outcome" data-failing={failing}>
        {failing ? (
          <>
            <span className="saga__outcome-tag t-label">Compensating, in reverse</span>
            <ol className="saga__comp">
              {steps
                .slice(0, saga.failAt)
                .reverse()
                .map((step, i) => (
                  <li key={step.compensation} style={{ ['--i' as string]: i }}>
                    <span className="saga__comp-from">{step.label}</span>
                    <span className="saga__comp-arrow" aria-hidden="true" />
                    <span className="saga__comp-to">{step.compensation}</span>
                  </li>
                ))}
            </ol>
            <p className="saga__note">{saga.closing}</p>
          </>
        ) : (
          <>
            <span className="saga__outcome-tag t-label">Committed</span>
            <p className="saga__note">
              Four local transactions in four services, each one committed on its own. Nothing here was held open
              waiting for the others — which is the only reason this scales, and the entire reason the failure path
              has to be written by hand.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   04 — Webhooks
   ============================================================ */

function WebhookLane() {
  const { reduced } = useEnvironment()
  const [signed, setSigned] = useState(true)
  const { active, setActive } = useReadout()
  const lane = webhook.lane
  const gate = lane.findIndex((n) => n.id === 'signature')
  const stop = signed ? lane.length - 1 : gate
  const { cursor } = useWalk(stop + 1, signed ? 'signed' : 'unsigned', reduced)

  return (
    <div className="hook">
      <div className="switch" role="group" aria-label="Incoming webhook">
        <button type="button" onClick={() => setSigned(true)} aria-pressed={signed}>
          Signed event
        </button>
        <button type="button" onClick={() => setSigned(false)} aria-pressed={!signed}>
          Unsigned event
        </button>
      </div>

      <ol className="hook__lane" data-rejected={!signed}>
        {lane.map((node, i) => {
          const reached = i <= cursor
          const rejected = !signed && i === gate && cursor >= gate
          return (
            <li key={node.id} className={`hook__cell ${reached ? 'is-reached' : ''} ${rejected ? 'is-rejected' : ''}`}>
              <NodeChip node={node} active={active?.id === node.id} onActivate={setActive} className="node--lane" />
              {i < lane.length - 1 && <span className="hook__link" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>

      <div className="hook__foot">
        <Readout
          node={active}
          fallback={
            signed
              ? 'The event is verified, recorded, published — and the work belongs to a consumer.'
              : 'The signature does not check out. The event is rejected at the gate and never reaches the bus.'
          }
        />
        <p className="hook__note">{webhook.note}</p>
      </div>
    </div>
  )
}

/* ============================================================
   05 — Scale
   ============================================================ */

function ScaleFrame() {
  return (
    <div className="scale">
      <Reveal>
        <p className="scale__claim">{scale.claim}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="scale__disclaimer">
          <span className="scale__disclaimer-mark" aria-hidden="true" />
          {scale.disclaimer}
        </p>
      </Reveal>
      <ul className="scale__points">
        {scale.points.map((p, i) => (
          <li key={p.label}>
            <Reveal delay={0.04 * i}>
              <div className="scale__point" data-state={p.state}>
                <span className="scale__point-state t-label">{buildStates[p.state].label}</span>
                <h5 className="scale__point-label">{p.label}</h5>
                <p className="scale__point-body">{p.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ============================================================
   The study
   ============================================================ */

export function PaymentStudy() {
  return (
    <div className="study study--payment" id="study-payment">
      <div className="shell">
        <div className="study__head">
          <div>
            <p className="study__kicker">Coding Shuttle · Cohort 5.0</p>
            <h3 className="study__title">
              <MaskText lines={['Payments don’t', 'fail politely.']} />
            </h3>
          </div>
          <Reveal delay={0.08}>
            <p className="study__lede">
              Distributed systems turn a simple payment into a coordination problem. Everything below is one of the
              places that problem shows up — and what the design does about it.
            </p>
          </Reveal>
        </div>

        <div className="study__blocks">
          <StudyBlock
            tag="Architecture"
            title="The path of one payment."
            lede="Read top to bottom. Past the broker nothing is waiting on anything — which is the whole architectural claim, and the reason a slow settlement cannot fail an authorisation."
          >
            <EventFlow />
          </StudyBlock>

          <StudyBlock
            tag="Reliability"
            title="Five ways a payment goes wrong, and what catches each one."
            lede="Pick a failure. The path is what the request actually does, and the mechanism is named where it takes effect."
          >
            <FailureLab />
          </StudyBlock>

          <StudyBlock tag="SAGA" title="No transaction spans four services, so the rollback is written by hand." lede={saga.premise}>
            <SagaTrack />
          </StudyBlock>

          <StudyBlock
            tag="Webhooks"
            title="An event arrives from outside. Prove it is real before believing it."
          >
            <WebhookLane />
          </StudyBlock>

          <StudyBlock tag="Scale" title={scale.heading}>
            <ScaleFrame />
          </StudyBlock>
        </div>
      </div>
    </div>
  )
}
