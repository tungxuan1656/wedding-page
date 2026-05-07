'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { SectionWrapper } from '@/components/shared'
import { strings } from '@/lib/i18n'

const { countdown: s } = strings

const TARGET_DATE = new Date('2026-06-08T16:30:00+07:00').getTime()

export const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = TARGET_DATE - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isMounted) return null

  const timeUnits = [
    { label: s.units.days, value: timeLeft.days },
    { label: s.units.hours, value: timeLeft.hours },
    { label: s.units.minutes, value: timeLeft.minutes },
    { label: s.units.seconds, value: timeLeft.seconds },
  ]

  return (
    <div className='bg-cream'>
      <SectionWrapper className='px-6 py-12 sm:px-8 md:px-12'>
        <motion.div
          className='relative mx-auto max-w-3xl overflow-hidden rounded-4xl border border-gold/30 bg-wine/95 p-6 text-center text-cream shadow-[0_0_40px_rgba(212,175,55,0.15)] backdrop-blur-md sm:p-8'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          {/* Subtle glowing orb in background */}
          <div className='pointer-events-none absolute top-0 left-1/2 h-32 w-full max-w-md -translate-x-1/2 rounded-full bg-gold/10 blur-[60px]' />

          <h2 className='relative mb-4 text-xs font-semibold tracking-wider text-gold-light uppercase sm:mb-8 sm:text-sm'>
            {s.heading}
          </h2>
          <div className='relative flex justify-center gap-3 sm:gap-8'>
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className='flex min-w-12.5 flex-col items-center sm:min-w-20'>
                <span className='font-serif text-4xl font-bold text-gold-light drop-shadow-sm sm:text-5xl lg:text-6xl'>
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className='mt-2 text-[10px] tracking-widest text-white uppercase sm:text-sm'>
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
