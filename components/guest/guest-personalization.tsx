import Image from 'next/image'

import type { GuestData } from '@/lib/guests'

type GuestPersonalizationProps = {
  guest: GuestData
}

export const GuestPersonalization = ({ guest }: GuestPersonalizationProps) => {
  return (
    <div className='grid gap-5 rounded-4xl border border-cream/15 bg-cream/10 p-5 backdrop-blur-sm sm:p-6 md:grid-cols-[minmax(0,1fr)_160px] md:items-center'>
      <div className='space-y-3'>
        <p className='text-sm font-semibold tracking-[0.25em] text-gold-light uppercase'>
          Lời nhắn riêng
        </p>
        <div className='space-y-2'>
          <h2 className='font-serif text-3xl text-cream sm:text-4xl'>
            Xin chào {guest.name}
          </h2>
          <p className='text-sm leading-7 text-cream/85 sm:text-base'>
            {guest.message}
          </p>
        </div>
      </div>

      {guest.photo ? (
        <div className='mx-auto w-full max-w-40 overflow-hidden rounded-[1.75rem] border border-cream/20 bg-cream/5'>
          <Image
            alt={guest.photo.alt}
            className='h-full w-full object-cover'
            height={guest.photo.height}
            src={guest.photo.src}
            width={guest.photo.width}
          />
        </div>
      ) : null}
    </div>
  )
}
