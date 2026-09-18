import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { experience, education, certifications, recognition } from '../../data/experience'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { useEnvironment } from '../../hooks/useEnvironment'
import './experience.css'

export function Experience() {
  const track = useRef<HTMLDivElement>(null)
  const { reduced } = useEnvironment()

  const { scrollYProgress } = useScroll({ target: track, offset: ['start 0.72', 'end 0.7'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <section className="section experience" id="experience" aria-labelledby="experience-heading">
      <div className="shell">
        <Eyebrow index="05">Experience</Eyebrow>

        <div className="experience__head">
          <h2 id="experience-heading" className="t-h2 experience__heading">
            <MaskText lines={['Five years of', 'shipping things', 'other people rely on.']} />
          </h2>
        </div>

        <div className="experience__track" ref={track}>
          <div className="experience__spine" aria-hidden="true">
            <motion.span
              className="experience__spine-fill"
              style={reduced ? { scaleY: 1 } : { scaleY: fill }}
            />
          </div>

          <ol className="experience__roles">
            {experience.map((role, i) => (
              <li key={role.id} className="role">
                <Reveal y={22} delay={i * 0.04}>
                  <div className="role__inner">
                    <span className={`role__dot ${role.current ? 'is-current' : ''}`} aria-hidden="true" />

                    <div className="role__meta">
                      <span className="role__period t-mono">{role.period}</span>
                      <h3 className="role__company">{role.company}</h3>
                      <span className="role__location t-mono">{role.location}</span>
                      {role.current && <span className="role__badge">Current</span>}
                    </div>

                    <div className="role__body">
                      <p className="role__title t-h3">{role.role}</p>
                      <p className="role__summary">{role.summary}</p>

                      <ul className="role__responsibilities">
                        {role.responsibilities.map((r, j) => (
                          <li key={j}>{r}</li>
                        ))}
                      </ul>

                      <div className="role__systems">
                        <span className="t-label">Systems</span>
                        <ul>
                          {role.systems.map((s) => (
                            <li key={s.name}>
                              <strong>{s.name}</strong>
                              <span>{s.detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <ul className="role__stack">
                        {role.stack.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}

            <li className="role role--education">
              <Reveal y={22}>
                <div className="role__inner">
                  <span className="role__dot" aria-hidden="true" />
                  <div className="role__meta">
                    <span className="role__period t-mono">{education.period}</span>
                    <h3 className="role__company">{education.institution}</h3>
                    <span className="role__location t-mono">{education.detail}</span>
                  </div>
                  <div className="role__body">
                    <p className="role__title t-h3">{education.degree}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          </ol>
        </div>

        <Reveal>
          <div className="experience__foot">
            <div>
              <span className="t-label">Certifications</span>
              <ul>
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="t-label">Recognition</span>
              <ul>
                {recognition.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
