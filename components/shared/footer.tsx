import { HERO_COPY } from '@/components/hero/hero-copy'

export const Footer = () => {
  return (
    <footer className='bg-wine px-6 py-16 text-center text-cream sm:px-8 md:py-24'>
      <div className='mx-auto max-w-2xl space-y-8'>
        <div className='mx-auto h-px w-24 bg-gold/40' />

        <p className='font-script text-4xl sm:text-5xl'>
          {HERO_COPY.coupleNames}
        </p>

        <p className='text-base leading-relaxed text-cream/75'>
          Cảm ơn bạn đã ghé thăm trang thiệp cưới của chúng mình. Sự hiện diện
          và tình cảm của bạn là món quà quý giá nhất trong ngày trọng đại này.
          Chúng mình rất mong được gặp bạn!
        </p>

        <div className='mx-auto h-px w-24 bg-gold/40' />

        <p className='text-xs tracking-[0.25em] text-cream/40 uppercase'>
          08 · 06 · 2026
        </p>
      </div>
    </footer>
  )
}
