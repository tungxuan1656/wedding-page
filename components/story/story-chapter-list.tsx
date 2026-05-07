import { strings } from '@/lib/i18n'

import { StoryChapterCard } from './story-chapter-card'

const { story: s } = strings

export const StoryChapterList = () => {
  return (
    <div className='flex flex-col gap-16 sm:gap-20 md:gap-24'>
      {s.chapters.map((chapter, index) => (
        <StoryChapterCard key={chapter.year} chapter={chapter} index={index} />
      ))}
    </div>
  )
}
