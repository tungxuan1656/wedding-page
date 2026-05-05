'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { SectionWrapper } from '@/components/shared'

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
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ]

  return (
    <div className='bg-cream'>
      <SectionWrapper className='px-6 py-12 sm:px-8 md:px-12'>
        <motion.div
          className='mx-auto max-w-3xl rounded-4xl border border-wine/10 bg-wine p-8 text-center text-cream shadow-xl shadow-wine/5'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          <h2 className='mb-6 text-sm font-semibold tracking-[0.25em] text-gold-light uppercase'>
            Đếm ngược tới ngày chung đôi
          </h2>
          <div className='flex justify-center gap-4 sm:gap-8'>
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className='flex min-w-[60px] flex-col items-center sm:min-w-[80px]'>
                <span className='font-serif text-4xl text-gold sm:text-5xl lg:text-6xl'>
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className='mt-2 text-xs tracking-widest text-cream/70 uppercase sm:text-sm'>
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
