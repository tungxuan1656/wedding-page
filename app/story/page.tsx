import dynamic from 'next/dynamic'

const StoryPageShell = dynamic(
  () =>
    import('@/components/story/story-page-shell').then(
      (mod) => mod.StoryPageShell,
    ),
  {
    loading: () => (
      <div className='flex min-h-screen items-center justify-center bg-cream'>
        <div className='h-8 w-8 animate-pulse rounded-full bg-wine/20' />
      </div>
    ),
  },
)

export default function StoryPage() {
  return <StoryPageShell />
}
