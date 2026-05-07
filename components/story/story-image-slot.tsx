'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { strings } from '@/lib/i18n'

const { story: s } = strings

type StoryImageSlotProps = {
  chapterIndex: number
  slotIndex: number
}

export const StoryImageSlot = ({
  chapterIndex,
  slotIndex,
}: StoryImageSlotProps) => {
  const label = `${s.imageSlotLabel} ${String(slotIndex + 1).padStart(2, '0')}`
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = mounted && !shouldReduceMotion

  return (
    <motion.div
      aria-label={label}
      className='flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-beige bg-cream-dark p-4 text-center'
      initial={shouldAnimate ? { opacity: 0, scale: 1.03 } : false}
      role='img'
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}>
      <span className='text-xs font-medium tracking-wider text-text-muted uppercase'>
        {label}
      </span>
      <span className='mt-1 text-[10px] text-text-muted/70'>
        {s.imageSlotChapter} {chapterIndex + 1}
      </span>
    </motion.div>
  )
}
