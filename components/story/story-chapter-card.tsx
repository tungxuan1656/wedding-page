import { SectionWrapper } from '@/components/shared/section-wrapper'

import { StoryImageSlot } from './story-image-slot'
import type { StoryChapter } from './story-types'

type StoryChapterCardProps = {
  chapter: StoryChapter
  index: number
}

export const StoryChapterCard = ({ chapter, index }: StoryChapterCardProps) => {
  const headingId = `chapter-${chapter.year}-heading`

  return (
    <SectionWrapper aria-labelledby={headingId} className='relative'>
      <div className='flex flex-col gap-8 md:flex-row md:gap-12'>
        {/* Year marker */}
        <div className='flex shrink-0 flex-row items-baseline gap-3 md:w-32 md:flex-col md:items-start md:gap-1'>
          <span className='font-serif text-5xl leading-none font-bold text-wine md:text-6xl'>
            {chapter.year}
          </span>
          <span className='text-sm font-semibold tracking-wider text-gold uppercase'>
            Chương {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Content */}
        <div className='flex flex-1 flex-col gap-6'>
          <h2
            className='font-serif text-2xl font-semibold text-wine sm:text-3xl'
            id={headingId}>
            {chapter.title}
          </h2>

          <div className='flex flex-col gap-4'>
            {chapter.paragraphs.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className='text-base leading-7 text-text-secondary'>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image placeholder grid */}
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4'>
            {Array.from({ length: chapter.imageSlotCount }).map((_, sIndex) => (
              <StoryImageSlot
                key={sIndex}
                chapterIndex={index}
                slotIndex={sIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
