'use client'

import { motion } from 'framer-motion'

import { SectionWrapper } from '@/components/shared'
import { strings } from '@/lib/i18n'

const { events: s } = strings

const MAPS_URLS = {
  groom: 'https://maps.app.goo.gl/xBVg6Gs3JPenCaC89',
  brideParty: 'https://maps.app.goo.gl/MXZQYyDs5KQZcRbK7',
  brideCeremony: 'https://maps.app.goo.gl/86qSi22YiJLT7XkR6',
} as const

const LocationLink = ({
  location,
  mapsUrl,
}: {
  location: string
  mapsUrl: string
}) => (
  <a
    className='hover:text-gold-dark mt-2 text-sm font-medium text-wine underline transition-colors'
    href={mapsUrl}
    rel='noopener noreferrer'
    target='_blank'>
    {location}
    <svg
      className='mb-1 ml-1.5 inline h-3 w-3 shrink-0'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'>
      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
      <polyline points='15 3 21 3 21 9' />
      <line x1='10' x2='21' y1='14' y2='3' />
    </svg>
  </a>
)

const Calendar = () => {
  const days = s.calendarDays
  // June 2026 starts on Monday. 01 = Mon.
  const dates = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className='relative mx-auto w-full max-w-[320px] rounded-3xl border border-gold/20 bg-white/90 p-6 shadow-[0_0_40px_rgba(212,175,55,0.15)] backdrop-blur-md sm:p-8'>
      {/* Decorative corner accents */}
      <div className='absolute top-3 left-3 h-4 w-4 border-t border-l border-gold/40' />
      <div className='absolute top-3 right-3 h-4 w-4 border-t border-r border-gold/40' />
      <div className='absolute bottom-3 left-3 h-4 w-4 border-b border-l border-gold/40' />
      <div className='absolute right-3 bottom-3 h-4 w-4 border-r border-b border-gold/40' />

      <div className='mb-6 text-center'>
        <h4 className='font-serif text-2xl text-wine'>{s.calendarMonth}</h4>
      </div>
      <div className='mb-2 grid grid-cols-7 gap-x-2 gap-y-4 text-center text-sm'>
        {days.map((d) => (
          <div key={d} className='text-xs font-medium text-wine/60 sm:text-sm'>
            {d}
          </div>
        ))}
        {dates.map((d) => {
          const isWeddingDay = d === 8 || d === 9

          return (
            <div
              key={d}
              className='relative flex h-8 items-center justify-center'>
              {isWeddingDay && (
                <div className='absolute inset-0 z-0 flex scale-125 items-center justify-center rounded-full bg-wine text-cream shadow-md' />
              )}
              <span
                className={`relative z-10 ${isWeddingDay ? 'font-bold text-cream' : 'text-text-secondary'}`}>
                {d}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const EventDetailsSection = () => {
  return (
    <div className='relative bg-cream-dark'>
      <div className='pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-gold/5 blur-[80px]' />
      <SectionWrapper className='relative z-10 overflow-hidden px-6 py-12 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-6xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          <div className='mb-16 text-center'>
            <p className='font-script text-5xl text-wine sm:text-6xl'>
              {s.saveTheDate}
            </p>
            <p className='mt-4 text-sm tracking-[0.2em] text-text-muted uppercase'>
              {s.attendInvitation}
            </p>
          </div>

          <div className='grid items-center gap-12 lg:grid-cols-3'>
            {/* Nhà Trai */}
            <div className='order-2 space-y-8 text-center lg:order-1 lg:text-right'>
              <h3 className='inline-block border-b border-wine/20 pb-4 font-serif text-2xl text-wine lg:block'>
                {s.groomSide}
              </h3>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  {s.partyLabel}
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {s.groom.party.time}
                </p>
                <p className='text-text-secondary'>
                  {s.groom.party.date} | {s.groom.party.fullDate}
                </p>
                <p className='text-sm text-text-muted'>{s.groom.party.lunar}</p>
                <LocationLink
                  location={s.groom.party.location}
                  mapsUrl={MAPS_URLS.groom}
                />
              </div>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  {s.groom.ceremony.label}
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {s.groom.ceremony.time}
                </p>
                <p className='text-text-secondary'>
                  {s.groom.ceremony.date} | {s.groom.ceremony.fullDate}
                </p>
                <p className='text-sm text-text-muted'>
                  {s.groom.ceremony.lunar}
                </p>
                <LocationLink
                  location={s.groom.ceremony.location}
                  mapsUrl={MAPS_URLS.groom}
                />
              </div>
            </div>

            {/* Calendar */}
            <div className='order-1 flex justify-center lg:order-2'>
              <Calendar />
            </div>

            {/* Nhà Gái */}
            <div className='order-3 space-y-8 text-center lg:text-left'>
              <h3 className='inline-block border-b border-wine/20 pb-4 font-serif text-2xl text-wine lg:block'>
                {s.brideSide}
              </h3>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  {s.partyLabel}
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {s.bride.party.time}
                </p>
                <p className='text-text-secondary'>
                  {s.bride.party.date} | {s.bride.party.fullDate}
                </p>
                <p className='text-sm text-text-muted'>{s.bride.party.lunar}</p>
                <LocationLink
                  location={s.bride.party.location}
                  mapsUrl={MAPS_URLS.brideParty}
                />
              </div>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  {s.bride.ceremony.label}
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {s.bride.ceremony.time}
                </p>
                <p className='text-text-secondary'>
                  {s.bride.ceremony.date} | {s.bride.ceremony.fullDate}
                </p>
                <p className='text-sm text-text-muted'>
                  {s.bride.ceremony.lunar}
                </p>
                <LocationLink
                  location={s.bride.ceremony.location}
                  mapsUrl={MAPS_URLS.brideCeremony}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
