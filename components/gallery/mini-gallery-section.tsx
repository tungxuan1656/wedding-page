'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { ImageModal, SectionWrapper } from '@/components/shared'
import { strings } from '@/lib/i18n'

const { gallery: s } = strings

const photos = [
  {
    id: 1,
    src: '/images/og-image.png',
    ratio: 'aspect-4/5',
    alt: `${s.photoAlt} 1`,
  },
  {
    id: 2,
    src: '/images/og-image.png',
    ratio: 'aspect-square',
    alt: `${s.photoAlt} 2`,
  },
  {
    id: 3,
    src: '/images/og-image.png',
    ratio: 'aspect-4/5',
    alt: `${s.photoAlt} 3`,
  },
  {
    id: 4,
    src: '/images/og-image.png',
    ratio: 'aspect-3/2',
    alt: `${s.photoAlt} 4`,
  },
  {
    id: 5,
    src: '/images/og-image.png',
    ratio: 'aspect-square',
    alt: `${s.photoAlt} 5`,
  },
  {
    id: 6,
    src: '/images/og-image.png',
    ratio: 'aspect-4/5',
    alt: `${s.photoAlt} 6`,
  },
  {
    id: 7,
    src: '/images/og-image.png',
    ratio: 'aspect-square',
    alt: `${s.photoAlt} 7`,
  },
  {
    id: 8,
    src: '/images/og-image.png',
    ratio: 'aspect-3/4',
    alt: `${s.photoAlt} 8`,
  },
  {
    id: 9,
    src: '/images/og-image.png',
    ratio: 'aspect-4/5',
    alt: `${s.photoAlt} 9`,
  },
  {
    id: 10,
    src: '/images/og-image.png',
    ratio: 'aspect-square',
    alt: `${s.photoAlt} 10`,
  },
]

export const PhotoGallerySection = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openModal = (index: number) => {
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  return (
    <div className='relative overflow-hidden bg-wine text-cream'>
      {/* Background glow effects */}
      <div className='absolute top-0 left-0 h-64 w-full bg-linear-to-b from-wine-dark to-transparent opacity-50' />
      <div className='pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]' />

      <SectionWrapper className='relative z-10 overflow-hidden px-6 py-12 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-6xl'
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}>
          <div className='mb-12 space-y-6 text-center md:mb-16'>
            <h2 className='font-script text-5xl leading-tight text-balance text-gold-light drop-shadow-sm sm:text-6xl lg:text-7xl'>
              {s.heading}
            </h2>
            <p className='mx-auto max-w-lg text-sm leading-relaxed text-cream/80 italic md:text-base'>
              {s.quote}
            </p>
          </div>

          {/* Masonry Grid */}
          <div className='mb-12 columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4'>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                aria-label={`${s.openPhotoLabel} ${photo.alt}`}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-wine-dark/50 shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                role='button'
                tabIndex={0}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                onClick={() => openModal(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openModal(index)
                  }
                }}>
                <div className={`${photo.ratio} relative w-full`}>
                  <Image
                    fill
                    alt={photo.alt}
                    className='object-cover opacity-85 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 group-hover:opacity-100'
                    src={photo.src}
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-wine-dark/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
                </div>
              </motion.div>
            ))}
          </div>

          <div className='text-center'>
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        '0 0 20px rgba(223,192,138,0.25)',
                        '0 0 45px rgba(223,192,138,0.45)',
                        '0 0 20px rgba(223,192,138,0.25)',
                      ],
                    }
              }
              className='inline-block rounded-full'
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}>
              <Link
                className='inline-flex min-h-14 items-center justify-center rounded-full border-2 border-gold bg-gold-light px-10 py-4 text-base font-semibold text-wine backdrop-blur-sm transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
                href='/story'>
                {s.ctaStory}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </SectionWrapper>

      <ImageModal
        images={photos}
        initialIndex={selectedIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
