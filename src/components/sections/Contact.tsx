import { ArrowUpRight, Mail, FileText } from 'lucide-react'
import { GithubMark, LinkedinMark } from '../primitives/BrandIcons'
import { profile } from '../../data/profile'
import { Eyebrow } from '../primitives/Eyebrow'
import { MaskText } from '../primitives/MaskText'
import { Reveal } from '../primitives/Reveal'
import { Magnetic } from '../primitives/Magnetic'
import './contact.css'

const links = [
  {
    label: 'GitHub',
    value: profile.contact.githubHandle,
    href: profile.contact.github,
    Icon: GithubMark,
    cursor: 'Open',
  },
  {
    label: 'LinkedIn',
    value: profile.contact.linkedinHandle,
    href: profile.contact.linkedin,
    Icon: LinkedinMark,
    cursor: 'Open',
  },
  {
    label: 'Email',
    value: profile.contact.email,
    href: `mailto:${profile.contact.email}`,
    Icon: Mail,
    cursor: 'Write',
  },
  {
    label: 'Résumé',
    value: 'PDF · one page',
    href: profile.contact.resume,
    Icon: FileText,
    cursor: 'Read',
  },
]

export function Contact() {
  const year = new Date().getFullYear()

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-heading">
      <div className="shell">
        <Eyebrow index="07">Contact</Eyebrow>

        <div className="contact__statement">
          <span className="contact__kicker t-label">{profile.closing.kicker}</span>
          <h2 id="contact-heading" className="contact__headline">
            <MaskText lines={[profile.closing.headline[0], <em key="e" className="em">{profile.closing.headline[1]}</em>]} />
          </h2>
          <Reveal delay={0.12}>
            <p className="contact__sub t-lead">{profile.closing.sub}</p>
          </Reveal>
        </div>

        <ul className="contact__links">
          {links.map(({ label, value, href, Icon, cursor }, i) => (
            <Reveal key={label} as="li" delay={i * 0.05}>
              <a
                className="contact__link"
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                data-cursor={cursor}
              >
                <span className="contact__link-icon" aria-hidden="true">
                  <Icon size={16} />
                </span>
                <span className="contact__link-label">{label}</span>
                <span className="contact__link-value t-mono">{value}</span>
                <Magnetic strength={7} radius={60}>
                  <span className="contact__link-arrow" aria-hidden="true">
                    <ArrowUpRight size={20} strokeWidth={1.5} />
                  </span>
                </Magnetic>
              </a>
            </Reveal>
          ))}
        </ul>

        <footer className="contact__footer">
          <div className="contact__footer-left">
            <span className="t-mono">
              © {year} {profile.name}
            </span>
            <span className="t-mono contact__footer-place">
              {profile.location} · {profile.timezone}
            </span>
          </div>
          <div className="contact__footer-right">
            <span className="t-mono">
              Built with React, Vite and a great deal of restraint about animation.
            </span>
          </div>
        </footer>
      </div>
    </section>
  )
}
