'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import { SectionWrapper } from '@/components/shared'

export const MiniGallerySection = () => {
  return (
    <div className='bg-wine text-cream'>
      <SectionWrapper className='relative overflow-hidden px-6 py-20 sm:px-8 md:px-12 md:py-32'>
        <motion.div
          className='mx-auto max-w-5xl'
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            {/* Images layout */}
            <div className='relative mx-auto h-[500px] w-full max-w-md'>
              {/* Image 1: Tall arched */}
              <motion.div
                className='absolute top-0 left-0 z-10 h-4/5 w-2/3 overflow-hidden rounded-t-full border-4 border-cream/20 shadow-2xl'
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileInView={{ y: 0, opacity: 1 }}>
                <div className='relative flex h-full w-full items-center justify-center bg-cream/10'>
                  {/* Placeholder for real image */}
                  <Image
                    fill
                    alt='Ảnh cưới 1'
                    className='object-cover opacity-80 mix-blend-luminosity'
                    src='/images/og-image.png' // Using existing placeholder
                  />
                </div>
              </motion.div>

              {/* Image 2: Rectangle overlapping */}
              <motion.div
                className='absolute right-0 bottom-0 z-20 h-3/5 w-1/2 overflow-hidden rounded-3xl border-4 border-wine shadow-2xl'
                initial={{ x: 20, opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                whileInView={{ x: 0, opacity: 1 }}>
                <div className='relative flex h-full w-full items-center justify-center bg-beige'>
                  {/* Placeholder for real image */}
                  <Image
                    fill
                    alt='Ảnh cưới 2'
                    className='object-cover opacity-90'
                    src='/images/og-image.png' // Using existing placeholder
                  />
                </div>
              </motion.div>
            </div>

            {/* Quote and CTA */}
            <div className='relative z-30 space-y-8 text-center lg:text-left'>
              <h2 className='font-script text-5xl leading-tight text-gold-light sm:text-6xl lg:text-7xl'>
                Khoảnh khắc gặp được em...
              </h2>
              <p className='mx-auto max-w-md font-serif text-lg leading-relaxed text-cream/90 italic md:text-xl lg:mx-0'>
                "...anh đã quyết định sẽ cùng em đi đến hết cuộc đời."
              </p>
              <div className='pt-8'>
                <Link
                  className='inline-flex min-h-12 items-center justify-center rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
                  href='/story'>
                  Xem hành trình 10 năm của chúng mình
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
