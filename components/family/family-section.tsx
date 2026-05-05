'use client'

import { motion } from 'framer-motion'

import { SectionWrapper } from '@/components/shared'

const FAMILY_INFO = {
  groom: {
    title: 'Nhà Trai',
    name: 'Đoàn Xuân Tùng',
    father: 'Đoàn Xuân Phung',
    mother: 'Nguyễn Thị Thành',
    address: 'Thôn Gia Lương, xã Đông Anh, TP Hà Nội',
  },
  bride: {
    title: 'Nhà Gái',
    name: 'Nguyễn Vân Anh',
    father: 'Nguyễn Trọng Ngọc',
    mother: 'Trần Thị Tuyết Lăng',
    address: 'Thôn Gia Lương, xã Đông Anh, TP Hà Nội',
  },
}

const FamilySide = ({ info }: { info: typeof FAMILY_INFO.groom }) => (
  <div className='flex flex-col items-center space-y-4 text-center'>
    <h3 className='font-serif text-3xl text-wine'>{info.title}</h3>
    <div className='h-px w-12 bg-gold/50' />
    <div className='space-y-2 text-text-secondary'>
      <p>
        Ông:{' '}
        <span className='font-medium text-text-primary'>{info.father}</span>
      </p>
      <p>
        Bà: <span className='font-medium text-text-primary'>{info.mother}</span>
      </p>
    </div>
    <p className='mt-2 text-sm text-text-muted'>{info.address}</p>
    <div className='mt-6'>
      <p className='mt-4 font-script text-4xl text-wine-light sm:text-5xl'>
        {info.name}
      </p>
    </div>
  </div>
)

export const FamilySection = () => {
  return (
    <div className='bg-cream'>
      <SectionWrapper className='relative px-6 py-16 sm:px-8 md:px-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-5xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}>
          <div className='mb-12 space-y-4 text-center'>
            <p className='text-sm font-semibold tracking-[0.35em] text-wine-light uppercase'>
              WEDDING
            </p>
          </div>

          <div className='relative grid gap-12 md:grid-cols-2'>
            <FamilySide info={FAMILY_INFO.groom} />

            {/* Divider for desktop */}
            <div className='absolute top-[10%] bottom-[10%] left-1/2 hidden w-px -translate-x-1/2 bg-beige-dark md:block' />

            {/* Divider for mobile */}
            <div className='mx-auto h-px w-1/2 bg-beige-dark md:hidden' />

            <FamilySide info={FAMILY_INFO.bride} />
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  )
}
