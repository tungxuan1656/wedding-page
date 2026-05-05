'use client'

import { HERO_COPY } from '@/components/hero/hero-copy'
import { SectionWrapper } from '@/components/shared'

export const RsvpSection = () => {
  return (
    <div className='bg-cream'>
      <SectionWrapper
        aria-labelledby='rsvp-heading'
        className='px-6 py-12 sm:px-8 md:px-12 md:py-20'
        id='rsvp'>
        <div className='mx-auto max-w-4xl rounded-4xl border border-beige/60 bg-white/90 p-8 text-center shadow-xl shadow-wine/5 transition-all duration-300 hover:shadow-wine/10 md:p-12'>
          <h2
            className='text-sm font-semibold tracking-[0.25em] text-wine-light uppercase'
            id='rsvp-heading'>
            {HERO_COPY.ctaRsvp}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary'>
            {HERO_COPY.rsvpPlaceholder}
          </p>
        </div>
      </SectionWrapper>
    </div>
  )
}
