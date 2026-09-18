import { motion } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { useEnvironment } from '../../hooks/useEnvironment'

type Props = {
  /** One entry per visual line. Lines are authored, never measured. */
  lines: readonly (string | ReactNode)[]
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  /** Play on mount rather than on scroll — the hero only. */
  immediate?: boolean
  /**
   * Hide from assistive tech. Use when the same words are already exposed
   * nearby as plain text — otherwise a screen reader reads the heading twice.
   */
  ariaHidden?: boolean
}

/**
 * The site's primary reveal: each line sits in a clipping box and rises into it.
 *
 * Under reduced motion the transform is dropped entirely and the line fades,
 * which keeps the staggered rhythm without any movement.
 */
export function MaskText({
  lines,
  as: Tag = 'div',
  className,
  delay = 0,
  stagger = 0.075,
  immediate = false,
  ariaHidden = false,
}: Props) {
  const { reduced } = useEnvironment()

  const viewport = immediate ? undefined : { once: true, margin: '0px 0px -12% 0px' }
  const animateProps = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport }

  return (
    <Tag className={className} aria-hidden={ariaHidden || undefined}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="line-mask"
          initial="hidden"
          {...animateProps}
          transition={{ delay: delay + i * stagger }}
        >
          <motion.span
            style={{ display: 'block', willChange: 'transform' }}
            variants={
              reduced
                ? { hidden: { opacity: 0 }, shown: { opacity: 1 } }
                : { hidden: { y: '108%' }, shown: { y: '0%' } }
            }
            transition={
              reduced
                ? { duration: 0.24, ease: 'linear' }
                : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  )
}
