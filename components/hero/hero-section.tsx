'use client'

import Link from 'next/link'

import { HERO_COPY, HERO_MAP_EMBED_URL } from '@/components/hero/hero-copy'
import { SectionWrapper } from '@/components/shared'

const EVENT_CARDS = [HERO_COPY.reception, HERO_COPY.ceremony]

export const HeroSection = () => {
  return (
    <div className='bg-cream'>
      <SectionWrapper className='overflow-hidden bg-linear-to-b from-wine via-wine-dark to-wine px-6 py-16 text-cream sm:px-8 md:min-h-screen md:px-12 md:py-20'>
        <div className='mx-auto flex max-w-6xl flex-col gap-12 md:justify-center'>
          <div className='max-w-3xl space-y-6'>
            <p className='text-sm font-semibold tracking-[0.35em] text-gold-light uppercase'>
              {HERO_COPY.eyebrow}
            </p>
            <div className='space-y-4'>
              <h1 className='font-serif text-5xl leading-tight font-semibold text-balance sm:text-6xl md:text-7xl'>
                {HERO_COPY.coupleNames}
              </h1>
              <div className='h-px w-24 bg-gold/70' />
              <p className='max-w-2xl text-base leading-7 text-cream/85 sm:text-lg'>
                {HERO_COPY.intro}
              </p>
            </div>
          </div>

          <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start'>
            <div className='space-y-6'>
              <div className='grid gap-4 sm:grid-cols-2'>
                {EVENT_CARDS.map((event) => (
                  <article
                    key={event.label}
                    className='rounded-3xl border border-cream/15 bg-cream/10 p-5 backdrop-blur-sm'>
                    <p className='text-sm tracking-[0.25em] text-gold-light uppercase'>
                      {event.label}
                    </p>
                    <p className='mt-3 font-serif text-3xl text-cream'>
                      {event.solarDate}
                    </p>
                    <p className='mt-2 text-sm leading-6 text-cream/80'>
                      {event.lunarDate}
                    </p>
                  </article>
                ))}
              </div>

              <div className='flex flex-col gap-3 sm:flex-row'>
                <a
                  className='inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-wine transition hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light'
                  href='#rsvp'>
                  {HERO_COPY.ctaRsvp}
                </a>
                <Link
                  className='inline-flex min-h-12 items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream'
                  href='/story'>
                  {HERO_COPY.ctaStory}
                </Link>
              </div>
            </div>

            <div className='rounded-[2rem] border border-cream/15 bg-cream/95 p-4 text-text-primary shadow-2xl shadow-wine-dark/30'>
              <div className='space-y-3 px-2 pt-2 pb-3'>
                <p className='text-sm font-semibold tracking-[0.25em] text-wine-light uppercase'>
                  {HERO_COPY.venue.label}
                </p>
                <h2 className='font-serif text-2xl text-wine'>
                  {HERO_COPY.venue.name}
                </h2>
                <p className='text-sm leading-6 text-text-secondary'>
                  {HERO_COPY.venue.address}
                </p>
              </div>
              <div className='overflow-hidden rounded-3xl border border-beige bg-beige/30'>
                <iframe
                  allowFullScreen
                  className='h-72 w-full border-0'
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  src={HERO_MAP_EMBED_URL}
                  title='Bản đồ Sân đình thôn Gia Lương'
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className='px-6 py-12 sm:px-8 md:px-12 md:py-16'
        id='rsvp'>
        <div className='mx-auto max-w-4xl rounded-[2rem] border border-beige bg-white/80 p-8 shadow-sm'>
          <p className='text-sm font-semibold tracking-[0.25em] text-wine-light uppercase'>
            {HERO_COPY.ctaRsvp}
          </p>
          <p className='mt-4 max-w-2xl text-base leading-7 text-text-secondary'>
            {HERO_COPY.rsvpPlaceholder}
          </p>
        </div>
      </SectionWrapper>
    </div>
  )
}
