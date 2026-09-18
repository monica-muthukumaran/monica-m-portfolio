import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useEnvironment } from '../../hooks/useEnvironment'
import './eyebrow.css'

type Props = {
  index: string
  children: ReactNode
}

/**
 * Section marker: an index, a label, and a rule that draws itself across the
 * remaining width. The drawing rule is the only ornament the sections share.
 */
export function Eyebrow({ index, children }: Props) {
  const { reduced } = useEnvironment()

  return (
    <div className="eyebrow">
      <span className="eyebrow__index num">{index}</span>
      <span className="eyebrow__label">{children}</span>
      <motion.span
        className="eyebrow__rule"
        aria-hidden="true"
        initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
        whileInView={reduced ? { opacity: 1 } : { scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={reduced ? { duration: 0.24 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
