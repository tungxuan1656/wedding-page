'use client'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export const FloatingCta = () => {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Show after scrolling past the initial hero view (e.g., 300px)
    if (latest > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  })

  return (
    <motion.div
      animate={{
        y: isVisible ? 0 : 150,
        opacity: isVisible ? 1 : 0,
      }}
      className='fixed inset-x-4 bottom-6 z-50 md:hidden'
      initial={{ y: 150, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
      <Link
        className='flex w-full items-center justify-center rounded-full border border-gold-light/30 bg-wine px-6 py-4 text-center font-medium tracking-wide text-cream shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-transform active:scale-95'
        href='/story'>
        Xem hành trình 10 năm
        <svg
          className='ml-2 h-5 w-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path
            d='M14 5l7 7m0 0l-7 7m7-7H3'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
          />
        </svg>
      </Link>
    </motion.div>
  )
}
