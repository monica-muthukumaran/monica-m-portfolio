import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useEnvironment } from '../../hooks/useEnvironment'

type Props = {
  children: ReactNode
  delay?: number
  /** Travel distance in px. Ignored under reduced motion. */
  y?: number
  className?: string
  as?: 'div' | 'li' | 'p' | 'span' | 'section'
}

export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const { reduced } = useEnvironment()
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={reduced ? { duration: 0.24, delay: delay * 0.4 } : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}

/** Staggers direct children of a list. Capped so the last item still feels connected. */
export function RevealList({ children, className, step = 0.06 }: { children: ReactNode[]; className?: string; step?: number }) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={Math.min(i, 8) * step}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
