'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { STORY_COPY } from './story-copy'

type StoryImageSlotProps = {
  chapterIndex: number
  slotIndex: number
}

export const StoryImageSlot = ({
  chapterIndex,
  slotIndex,
}: StoryImageSlotProps) => {
  const shouldReduceMotion = useReducedMotion()
  const label = STORY_COPY.imageSlotLabel(slotIndex)

  return (
    <motion.div
      className='flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-beige bg-cream-dark p-4 text-center'
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay: slotIndex * 0.08,
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}>
      <span className='text-xs font-medium tracking-wider text-text-muted uppercase'>
        {label}
      </span>
      <span className='mt-1 text-[10px] text-text-muted/70'>
        Chương {chapterIndex + 1}
      </span>
    </motion.div>
  )
}
