'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

import { SectionWrapper } from '@/components/shared'
import { strings } from '@/lib/i18n'

const { giftRegistry: s } = strings

const CopyIcon = () => (
  <svg
    className='h-4 w-4'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'>
    <path
      d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </svg>
)

const CheckIcon = () => (
  <svg
    className='h-4 w-4 text-green-600'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'>
    <path
      d='M5 13l4 4L19 7'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </svg>
)

type AccountData = {
  title: string
  bankName: string
  accountName: string
  accountNumber: string
  qrImage: string
}

const AccountCard = ({ data }: { data: AccountData }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <div className='flex flex-col items-center rounded-3xl border border-gold/20 bg-white/60 p-8 shadow-[0_0_40px_rgba(212,175,55,0.05)] backdrop-blur-md'>
      <h4 className='mb-6 font-serif text-2xl text-wine'>{data.title}</h4>
      <div className='relative mb-8 aspect-4/5 w-52 overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-md'>
        {/* Replace src with real QR image path when available */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${s.qrCodeAlt} - ${data.bankName} - ${data.accountName}`}
          className='h-full w-full object-contain'
          src={data.qrImage}
        />
      </div>

      <div className='w-full space-y-1.5 text-center'>
        <p className='font-medium text-text-primary'>{data.bankName}</p>
        <p className='text-sm text-text-secondary'>{data.accountName}</p>
        <div className='mt-4 ml-4 flex items-center justify-center gap-1'>
          <p className='font-mono text-xl tracking-wider text-wine'>
            {data.accountNumber}
          </p>
          <button
            aria-label={s.copyAccountLabel}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-cream text-text-secondary transition-all hover:bg-gold/20 hover:text-wine active:scale-95'
            type='button'
            onClick={handleCopy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}

export const GiftRegistrySection = () => {
  return (
    <div className='relative overflow-hidden bg-cream'>
      {/* Decorative background elements */}
      <div className='pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-gold/5 blur-[100px]' />
      <div className='pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-wine/5 blur-[100px]' />

      <SectionWrapper className='relative z-10 px-6 py-16 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-5xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          <div className='mb-16 text-center'>
            <h2 className='font-script text-5xl text-wine sm:text-6xl'>
              {s.heading}
            </h2>
            <div className='mx-auto mt-6 h-px w-24 bg-gold/30' />
            <p className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary'>
              {s.description}
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
            <AccountCard data={s.groom} />
            <AccountCard data={s.bride} />
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
