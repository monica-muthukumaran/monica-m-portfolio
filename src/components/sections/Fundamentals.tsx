import { fundamentals, practice } from '../../data/fundamentals'
import { Reveal } from '../primitives/Reveal'
import './fundamentals.css'

/**
 * A strip, not a section.
 *
 * Sits under the stack graph inside Engineering: the graph says what is used,
 * this says what is reasoned about. Two rows of names and one sentence — the
 * proof is a click away in the project pages, and repeating it here only made
 * the homepage longer.
 */
export function Fundamentals() {
  return (
    <section className="fundamentals" aria-labelledby="fundamentals-heading">
      <h3 id="fundamentals-heading" className="fundamentals__heading t-label">
        Fundamentals
      </h3>

      <div className="fundamentals__rows">
        {fundamentals.groups.map((group, i) => (
          <Reveal key={group.label} delay={i * 0.06}>
            <div className="fundamentals__row">
              <span className="fundamentals__row-label">{group.label}</span>
              <ul className="fundamentals__tags">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {practice && (
        <Reveal delay={0.12}>
          <p className="fundamentals__note">
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
