import { LoadingSkeleton } from '@/components/shared'

export default function StoryLoading() {
  return (
    <main className='flex min-h-[70vh] flex-col items-center gap-12 px-4 py-16'>
      <LoadingSkeleton heading lines={4} />
      <LoadingSkeleton lines={3} />
      <LoadingSkeleton lines={3} />
    </main>
  )
}
