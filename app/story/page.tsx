import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { strings } from '@/lib/i18n'

const {
  meta: { story: storyMeta },
} = strings

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tx-va-wedding.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: storyMeta.title,
    description: storyMeta.description,
    openGraph: {
      title: storyMeta.title,
      description: storyMeta.description,
      url: `${SITE_URL}/story`,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: storyMeta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: storyMeta.title,
      description: storyMeta.description,
      images: ['/images/og-image.png'],
    },
  }
}

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
