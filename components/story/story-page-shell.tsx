'use client'

import Link from 'next/link'

import { strings } from '@/lib/i18n'

import { StoryChapterList } from './story-chapter-list'

const { story: s } = strings

export const StoryPageShell = () => {
  return (
    <main className='min-h-screen bg-cream' id='main-content'>
      {/* Intro header */}
      <section
        aria-labelledby='story-heading'
        className='px-6 pt-16 pb-10 sm:px-8 sm:pt-20 md:px-12 md:pt-24'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='mb-4 text-sm font-semibold tracking-[0.25em] text-wine-light uppercase'>
            {s.eyebrow}
          </p>
          <h1
            className='mb-6 font-serif text-4xl text-wine sm:text-5xl md:text-6xl'
            id='story-heading'>
            {s.title}
          </h1>
          <p className='mx-auto max-w-xl text-base leading-7 text-text-secondary'>
            {s.intro}
          </p>
        </div>
      </section>

      {/* Decorative divider */}
      <div className='mx-auto max-w-3xl px-6 sm:px-8 md:px-12'>
        <div className='h-px w-full bg-gradient-to-r from-transparent via-beige-dark to-transparent' />
      </div>

      {/* Chapter list */}
      <section
        aria-label={s.chapterSectionLabel}
        className='px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24'>
        <div className='mx-auto max-w-4xl'>
          <StoryChapterList />
        </div>
      </section>

      {/* Footer / back link */}
      <section className='px-6 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-24'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-8 h-px w-full bg-gradient-to-r from-transparent via-beige-dark to-transparent' />
          <Link
            className='inline-flex min-h-12 items-center justify-center rounded-full border border-wine bg-transparent px-6 py-3 text-sm font-semibold text-wine transition hover:bg-wine hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'
            href='/'>
            {s.backLink}
          </Link>
        </div>
      </section>
    </main>
  )
}
