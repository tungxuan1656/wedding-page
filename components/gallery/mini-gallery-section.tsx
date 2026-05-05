'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import { SectionWrapper } from '@/components/shared'

const photos = [
  { id: 1, src: '/images/og-image.png', ratio: 'aspect-[4/5]' },
  { id: 2, src: '/images/og-image.png', ratio: 'aspect-[1/1]' },
  { id: 3, src: '/images/og-image.png', ratio: 'aspect-[4/5]' },
  { id: 4, src: '/images/og-image.png', ratio: 'aspect-[3/2]' },
  { id: 5, src: '/images/og-image.png', ratio: 'aspect-[1/1]' },
  { id: 6, src: '/images/og-image.png', ratio: 'aspect-[4/5]' },
  { id: 7, src: '/images/og-image.png', ratio: 'aspect-[1/1]' },
  { id: 8, src: '/images/og-image.png', ratio: 'aspect-[3/4]' },
  { id: 9, src: '/images/og-image.png', ratio: 'aspect-[4/5]' },
  { id: 10, src: '/images/og-image.png', ratio: 'aspect-[1/1]' },
]

export const PhotoGallerySection = () => {
  return (
    <div className='relative overflow-hidden bg-wine text-cream'>
      {/* Background glow effects */}
      <div className='absolute top-0 left-0 h-64 w-full bg-gradient-to-b from-wine-dark to-transparent opacity-50' />
      <div className='pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]' />

      <SectionWrapper className='relative z-10 overflow-hidden px-6 py-12 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-6xl'
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}>
          <div className='mb-12 space-y-6 text-center md:mb-16'>
            <h2 className='font-script text-5xl leading-tight text-gold-light drop-shadow-sm sm:text-6xl lg:text-7xl'>
              Khoảnh khắc hạnh phúc
            </h2>
            <p className='mx-auto max-w-lg text-sm leading-relaxed text-cream/80 italic md:text-base'>
              "...anh đã quyết định sẽ cùng em đi đến hết cuộc đời."
            </p>
          </div>

          {/* Masonry Grid */}
          <div className='mb-12 columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4'>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className={`group relative overflow-hidden rounded-2xl border border-gold/20 bg-wine-dark/50 shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}>
                <div className={`${photo.ratio} relative w-full`}>
                  <Image
                    fill
                    alt={`Ảnh cưới ${photo.id}`}
                    className='object-cover opacity-85 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 group-hover:opacity-100'
                    src={photo.src}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-wine-dark/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
                </div>
              </motion.div>
            ))}
          </div>

          <div className='text-center'>
            <Link
              className='inline-flex min-h-12 items-center justify-center rounded-full border border-gold/50 bg-wine-dark/30 px-8 py-3 text-sm font-semibold text-gold backdrop-blur-sm transition-all hover:bg-gold hover:text-wine hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
              href='/story'>
              Xem hành trình 10 năm của chúng mình
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
