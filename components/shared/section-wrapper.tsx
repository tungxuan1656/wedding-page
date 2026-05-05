'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionWrapperProps = {
  animate?: boolean
  children: ReactNode
  className?: string
  id?: string
}

export const SectionWrapper = ({
  animate = true,
  children,
  className,
  id,
}: SectionWrapperProps) => {
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = animate && !shouldReduceMotion

  return (
    <motion.section
      className={className}
      id={id}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}>
      {children}
    </motion.section>
  )
}
