import { LoadingSkeleton } from '@/components/shared'

export default function StoryLoading() {
  return (
    <main className='flex min-h-[70vh] flex-col items-center gap-12 px-4 py-16'>
      <LoadingSkeleton heading aria-label='Loading story' lines={4} />
      <LoadingSkeleton aria-label='Loading chapter 1' lines={3} />
      <LoadingSkeleton aria-label='Loading chapter 2' lines={3} />
    </main>
  )
}
