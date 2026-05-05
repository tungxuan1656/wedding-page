import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tx-va-wedding.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Hành trình yêu — Xuân Tùng & Vân Anh'
  const description =
    'Câu chuyện tình yêu 10 năm của Xuân Tùng & Vân Anh — từ lần đầu gặp đến ngày trọng đại.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/story`,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
