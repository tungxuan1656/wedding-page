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
          className='mx-auto flex max-w-6xl flex-col gap-12'
          initial='hidden'
          variants={containerVariants}>
          <motion.div
            suppressHydrationWarning
            className='max-w-3xl space-y-6'
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
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
