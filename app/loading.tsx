import { LoadingSkeleton } from '@/components/shared'

export default function Loading() {
  return (
    <main className='flex min-h-[70vh] items-center justify-center'>
      <LoadingSkeleton heading aria-label='Loading home page' lines={2} />
    </main>
  )
}
