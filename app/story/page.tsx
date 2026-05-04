import Link from 'next/link'

import { HERO_COPY } from '@/components/hero/hero-copy'

export default function StoryPage() {
  return (
    <main className='min-h-screen bg-cream px-6 py-16 sm:px-8 md:px-12'>
      <div className='mx-auto max-w-3xl space-y-6 rounded-[2rem] border border-beige bg-white/80 p-8 shadow-sm'>
        <p className='text-sm font-semibold tracking-[0.25em] text-wine-light uppercase'>
          {HERO_COPY.ctaStory}
        </p>
        <h1 className='font-serif text-4xl text-wine sm:text-5xl'>
          Xuân Tùng & Vân Anh
        </h1>
        <p className='text-base leading-7 text-text-secondary'>
          {HERO_COPY.storyPlaceholder}
        </p>
        <Link
          className='inline-flex min-h-12 items-center justify-center rounded-full bg-wine px-6 py-3 text-sm font-semibold text-cream transition hover:bg-wine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'
          href='/'>
          Quay lại thiệp cưới
        </Link>
      </div>
    </main>
  )
}
