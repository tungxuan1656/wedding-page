'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useEffect, useState } from 'react'

import { GuestPersonalization } from '@/components/guest'
import { HERO_COPY } from '@/components/hero/hero-copy'
import { SectionWrapper } from '@/components/shared'
import type { GuestData } from '@/lib/guests'

type HeroSectionProps = {
  guest: GuestData | null
}

export const HeroSection = ({ guest }: HeroSectionProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
          animate={isMounted ? 'visible' : 'hidden'}
          className='mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-start md:justify-between'
          initial='hidden'
          variants={containerVariants}>
          <div className='w-full space-y-12 md:max-w-2xl'>
            <motion.div
              suppressHydrationWarning
              className='space-y-6'
              variants={itemVariants}>
              <p className='text-sm font-semibold tracking-[0.35em] text-gold-light uppercase'>
                {HERO_COPY.eyebrow}
              </p>
              <div className='space-y-4'>
                <h1
                  className='font-script text-6xl leading-tight font-normal text-balance sm:text-7xl md:text-8xl'
                  id='hero-heading'>
                  {HERO_COPY.coupleNames}
                </h1>
                <div className='h-px w-24 bg-gold/70' />
                <p className='max-w-2xl text-base leading-7 text-cream/85 sm:text-lg'>
                  {guest ? (
                    <>
                      {HERO_COPY.invitation.leading}{' '}
                      <span className='font-semibold text-gold-light'>
                        {guest.name}
                      </span>{' '}
                      {HERO_COPY.invitation.trailing}
                    </>
                  ) : (
                    HERO_COPY.intro
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
            className='relative aspect-[3/4] w-full max-w-[400px] overflow-hidden rounded-2xl border border-cream/20 bg-cream/5 shadow-2xl md:w-2/5'
            variants={itemVariants}>
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 text-cream/30'>
              <svg
                className='h-12 w-12 opacity-50'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                />
              </svg>
              <span className='text-xs font-medium tracking-widest uppercase'>
                Ảnh cưới của bạn
              </span>
            </div>
            {/* 
              Future: Replace with <Image src="/images/hero-portrait.webp" ... />
            */}
          </motion.div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
