'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Image from 'next/image'

import { GuestPersonalization } from '@/components/guest'
import { SectionWrapper } from '@/components/shared'
import type { GuestData } from '@/lib/guests'
import { strings } from '@/lib/i18n'

const { hero: s } = strings

type HeroSectionProps = {
  guest: GuestData | null
}

export const HeroSection = ({ guest }: HeroSectionProps) => {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <div className='bg-cream'>
      <SectionWrapper
        aria-labelledby='hero-heading'
        className='overflow-hidden bg-linear-to-b from-wine via-wine-dark to-wine px-6 py-16 text-cream sm:px-8 md:px-12 md:py-32'>
        <motion.div
          suppressHydrationWarning
          animate='visible'
          className='mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-start md:justify-between'
          initial='hidden'
          variants={containerVariants}>
          <div className='w-full space-y-12 md:max-w-2xl'>
            <motion.div
              suppressHydrationWarning
              className='space-y-6'
              variants={itemVariants}>
              <p className='text-sm font-semibold tracking-[0.35em] text-gold-light uppercase'>
                {s.eyebrow}
              </p>
              <div className='space-y-4'>
                <h1
                  className='font-script text-6xl leading-tight font-normal text-balance sm:text-7xl md:text-8xl'
                  id='hero-heading'>
                  {s.groomName}
                  <span className='mx-4 inline-block scale-65 align-middle text-gold-light opacity-80 md:mx-8'>
                    &
                  </span>
                  {s.brideName}
                </h1>
                <div className='h-px w-24 bg-gold/70' />
                <p className='max-w-2xl text-base leading-7 text-cream/85 sm:text-lg'>
                  {guest ? (
                    <>
                      {s.invitation.leading}{' '}
                      <span className='font-semibold text-gold-light'>
                        {guest.name}
                      </span>{' '}
                      {s.invitation.trailing}
                    </>
                  ) : (
                    s.intro
                  )}
                </p>
              </div>
            </motion.div>

            {guest ? (
              <motion.div variants={itemVariants}>
                <GuestPersonalization guest={guest} />
              </motion.div>
            ) : null}
          </div>

          <motion.div
            className='group relative aspect-3/4 w-full max-w-100 overflow-hidden rounded-2xl border-2 border-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:w-2/5'
            variants={itemVariants}>
            <Image
              fill
              priority
              alt='Tùng & Vân — Ảnh cưới'
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 40vw'
              src='/images/hero-portrait.webp'
            />
            {/* Subtle color-correcting overlay to unify the red tones */}
            <div className='pointer-events-none absolute inset-0 bg-wine/5 mix-blend-multiply' />

            {/* Premium inner border decoration */}
            <div className='pointer-events-none absolute inset-3 rounded-xl border border-gold/20' />

            {/* Glossy overlay for a glass-like finish */}
            <div className='pointer-events-none absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-white/10' />
          </motion.div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
