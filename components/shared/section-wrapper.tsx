'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionWrapperProps = {
  children: ReactNode
  className?: string
  id?: string
}

export const SectionWrapper = ({
  children,
  className,
  id,
}: SectionWrapperProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      className={className}
      id={id}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}>
      {children}
    </motion.section>
  )
}
