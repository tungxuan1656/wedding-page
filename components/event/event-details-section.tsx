'use client'

import { motion } from 'framer-motion'

import { SectionWrapper } from '@/components/shared'

const EVENTS = {
  groom: {
    party: {
      time: '16:30',
      date: 'Thứ Hai',
      fullDate: '08/06/2026',
      lunar: '23/4 âm lịch (Bính Ngọ)',
      location: 'Sân đình thôn Gia Lương, xã Đông Anh, TP Hà Nội',
    },
    ceremony: {
      title: 'Lễ Thành Hôn',
      time: '10:30',
      date: 'Thứ Ba',
      fullDate: '09/06/2026',
      lunar: '24/4 âm lịch',
      location: 'Sân đình thôn Gia Lương, xã Đông Anh, TP Hà Nội',
    },
  },
  bride: {
    party: {
      time: '16:30',
      date: 'Thứ Hai',
      fullDate: '08/06/2026',
      lunar: '23/4 âm lịch (Bính Ngọ)',
      location: 'Tại Tư Gia Nhà Gái',
    },
    ceremony: {
      title: 'Lễ Vu Quy',
      time: '09:00',
      date: 'Thứ Ba',
      fullDate: '09/06/2026',
      lunar: '24/4 âm lịch',
      location: 'Tư gia nhà gái, thôn Gia Lương, xã Đông Anh, TP Hà Nội',
    },
  },
}

const Calendar = () => {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
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
        <h4 className='font-serif text-2xl text-wine'>Tháng 6</h4>
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
              Save The Date
            </p>
            <p className='mt-4 text-sm tracking-[0.2em] text-text-muted uppercase'>
              Tham dự lễ thành hôn của chúng mình
            </p>
          </div>

          <div className='grid items-center gap-12 lg:grid-cols-3'>
            {/* Nhà Trai */}
            <div className='order-2 space-y-8 text-center lg:order-1 lg:text-right'>
              <h3 className='inline-block border-b border-wine/20 pb-4 font-serif text-2xl text-wine lg:block'>
                Sự kiện Nhà Trai
              </h3>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  Tiệc Mời Khách
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {EVENTS.groom.party.time}
                </p>
                <p className='text-text-secondary'>
                  {EVENTS.groom.party.date} | {EVENTS.groom.party.fullDate}
                </p>
                <p className='text-sm text-text-muted'>
                  {EVENTS.groom.party.lunar}
                </p>
                <p className='mt-2 text-sm font-medium'>
                  {EVENTS.groom.party.location}
                </p>
              </div>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  {EVENTS.groom.ceremony.title}
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {EVENTS.groom.ceremony.time}
                </p>
                <p className='text-text-secondary'>
                  {EVENTS.groom.ceremony.date} |{' '}
                  {EVENTS.groom.ceremony.fullDate}
                </p>
                <p className='text-sm text-text-muted'>
                  {EVENTS.groom.ceremony.lunar}
                </p>
                <p className='mt-2 text-sm font-medium'>
                  {EVENTS.groom.ceremony.location}
                </p>
              </div>
            </div>

            {/* Calendar */}
            <div className='order-1 flex justify-center lg:order-2'>
              <Calendar />
            </div>

            {/* Nhà Gái */}
            <div className='order-3 space-y-8 text-center lg:text-left'>
              <h3 className='inline-block border-b border-wine/20 pb-4 font-serif text-2xl text-wine lg:block'>
                Sự kiện Nhà Gái
              </h3>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  Tiệc Mời Khách
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {EVENTS.bride.party.time}
                </p>
                <p className='text-text-secondary'>
                  {EVENTS.bride.party.date} | {EVENTS.bride.party.fullDate}
                </p>
                <p className='text-sm text-text-muted'>
                  {EVENTS.bride.party.lunar}
                </p>
                <p className='mt-2 text-sm font-medium'>
                  {EVENTS.bride.party.location}
                </p>
              </div>

              <div className='space-y-2'>
                <p className='text-gold-dark text-sm font-semibold tracking-widest uppercase'>
                  {EVENTS.bride.ceremony.title}
                </p>
                <p className='font-serif text-3xl text-wine'>
                  {EVENTS.bride.ceremony.time}
                </p>
                <p className='text-text-secondary'>
                  {EVENTS.bride.ceremony.date} |{' '}
                  {EVENTS.bride.ceremony.fullDate}
                </p>
                <p className='text-sm text-text-muted'>
                  {EVENTS.bride.ceremony.lunar}
                </p>
                <p className='mt-2 text-sm font-medium'>
                  {EVENTS.bride.ceremony.location}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
