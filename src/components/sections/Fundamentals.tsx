import { systemDesign, algorithms, practice, type Fundamental } from '../../data/fundamentals'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import './fundamentals.css'

function Column({ label, items }: { label: string; items: readonly Fundamental[] }) {
  return (
    <div className="fundamentals__column">
      <h4 className="fundamentals__column-title t-label">{label}</h4>
      <ol className="fundamentals__list">
        {items.map((item, i) => (
          <Reveal key={item.title} as="li" delay={Math.min(i, 6) * 0.05}>
            <article className="fundamental">
              <span className="fundamental__n num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h5 className="fundamental__title">{item.title}</h5>
              <p className="fundamental__body">{item.body}</p>
              <p className="fundamental__where">{item.where}</p>
            </article>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

/**
 * Sits inside the Engineering section rather than standing alone: the stack
 * graph says what is used, this says how it is reasoned about. Both belong to
 * the same answer, and the navigation stays five items long.
 */
export function Fundamentals() {
  return (
    <section className="fundamentals" aria-labelledby="fundamentals-heading">
      <div className="fundamentals__head">
        <span className="t-label fundamentals__eyebrow">Fundamentals</span>
        <h3 id="fundamentals-heading" className="fundamentals__heading">
          <MaskText lines={['What I reach for,', 'and where it showed up.']} />
        </h3>
        <Reveal delay={0.08}>
          <p className="t-body fundamentals__note">
            Every portfolio claims these, so the claim is worth nothing. Each one below names the decision, the
            trade-off it bought, and the system it was made in.
          </p>
        </Reveal>
      </div>

      <div className="fundamentals__grid">
        <Column label="System design" items={systemDesign} />
        <Column label="Data structures & algorithms" items={algorithms} />
      </div>

      {practice && (
        <Reveal>
          <p className="fundamentals__practice t-mono">
            Regular practice ·{' '}
            <a href={practice.href} target="_blank" rel="noreferrer">
              {practice.label} / {practice.handle}
            </a>
          </p>
        </Reveal>
      )}
    </section>
  )
}
