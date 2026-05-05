'use client'

import { STORY_COPY } from './story-copy'

type StoryImageSlotProps = {
  chapterIndex: number
  slotIndex: number
}

export const StoryImageSlot = ({
  chapterIndex,
  slotIndex,
}: StoryImageSlotProps) => {
  const label = STORY_COPY.imageSlotLabel(slotIndex)

  return (
    <div className='flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-beige bg-cream-dark p-4 text-center'>
      <span className='text-xs font-medium tracking-wider text-text-muted uppercase'>
        {label}
      </span>
      <span className='mt-1 text-[10px] text-text-muted/70'>
        Chương {chapterIndex + 1}
      </span>
    </div>
  )
}
