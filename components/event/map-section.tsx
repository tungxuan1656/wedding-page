'use client'

import { motion } from 'framer-motion'

import { SectionWrapper } from '@/components/shared'

export const MapSection = () => {
  return (
    <div className='relative overflow-hidden bg-cream'>
      <SectionWrapper className='relative z-10 px-6 py-12 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-4xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          <div className='mb-10 text-center'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-wine/10'>
              <svg
                className='text-wine'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                <circle cx='12' cy='10' r='3' />
              </svg>
            </div>
            <h2 className='mb-4 font-script text-5xl text-wine drop-shadow-sm'>
              Bản đồ chỉ đường
            </h2>
            <p className='mx-auto max-w-md text-sm text-text-secondary'>
              Sân đình thôn Gia Lương, xã Đông Anh, TP Hà Nội
            </p>
          </div>

          <div className='relative h-[400px] w-full overflow-hidden rounded-3xl border-4 border-white shadow-[0_0_30px_rgba(212,175,55,0.15)] md:h-[500px]'>
            <iframe
              allowFullScreen={true}
              height='100%'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4111326442654!2d105.8652495760814!3d21.13601558406734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350171bb572f6d%3A0x8e83348126b8df81!2zU8OibiDEkMOsbmggR2lhIEzGsMahbmc!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s'
              style={{ border: 0 }}
              title='Bản đồ đường đi'
              width='100%'
            />
          </div>

          <div className='mt-8 text-center'>
            <a
              className='inline-flex min-h-12 items-center justify-center rounded-full border border-gold bg-wine px-8 py-3 text-sm font-semibold text-cream shadow-lg shadow-wine/20 transition-all hover:bg-gold hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'
              href='https://maps.app.goo.gl/YourMapLinkHere'
              rel='noopener noreferrer'
              target='_blank'>
              Mở trong Google Maps
            </a>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
