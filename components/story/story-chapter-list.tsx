import { StoryChapterCard } from './story-chapter-card'
import { STORY_CHAPTERS } from './story-copy'

export const StoryChapterList = () => {
  return (
    <div className='flex flex-col gap-16 sm:gap-20 md:gap-24'>
      {STORY_CHAPTERS.map((chapter, index) => (
        <StoryChapterCard key={chapter.year} chapter={chapter} index={index} />
      ))}
    </div>
  )
}
