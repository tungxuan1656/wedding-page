'use client'

import { motion } from 'framer-motion'

import { SectionWrapper } from '@/components/shared'
import { strings } from '@/lib/i18n'

const { family: s } = strings

const FamilySide = ({ info }: { info: typeof s.groom | typeof s.bride }) => (
  <div className='flex flex-col items-center space-y-4 text-center'>
    <h3 className='font-serif text-3xl text-wine'>{info.title}</h3>
    <p className='font-script text-4xl text-wine drop-shadow-sm sm:text-5xl'>
      {info.name}
    </p>
    <div className='h-px w-12 bg-gold/50' />
    <div className='space-y-2 text-text-secondary'>
      <p>
        {s.labels.father}{' '}
        <span className='font-medium text-text-primary'>{info.father}</span>
      </p>
      <p>
        {s.labels.mother}{' '}
        <span className='font-medium text-text-primary'>{info.mother}</span>
      </p>
    </div>
    <p className='mt-2 text-sm text-text-muted'>{info.address}</p>
  </div>
)

export const FamilySection = () => {
  return (
    <div className='relative overflow-hidden bg-cream'>
      {/* Subtle background glow */}
      <div className='pointer-events-none absolute top-1/2 left-1/2 h-64 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[100px]' />

      <SectionWrapper className='relative z-10 px-6 py-12 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-5xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          <div className='mb-12 space-y-4 text-center'>
            <p className='text-sm font-semibold tracking-[0.35em] text-wine-light uppercase'>
              {s.sectionEyebrow}
            </p>
          </div>

          <div className='relative grid gap-12 md:grid-cols-2'>
            <FamilySide info={s.groom} />

            {/* Divider for desktop */}
            <div className='absolute top-[10%] bottom-[10%] left-1/2 hidden w-px -translate-x-1/2 bg-beige-dark md:block' />

            {/* Divider for mobile */}
            <div className='mx-auto h-px w-1/2 bg-beige-dark md:hidden' />

            <FamilySide info={s.bride} />
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
