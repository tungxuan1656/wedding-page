import Link from 'next/link'

import { strings } from '@/lib/i18n'

const {
  errors: { notFound: s },
} = strings

export default function NotFound() {
  return (
    <main
      className='flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center'
      id='main-content'>
      <h1 className='font-serif text-4xl text-wine md:text-5xl'>{s.heading}</h1>
      <p className='mt-4 text-lg text-text-secondary'>{s.message}</p>
      <Link
        className='mt-8 inline-block rounded-lg bg-wine px-6 py-3 font-medium text-cream transition-colors hover:bg-wine-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'
        href='/'>
        {s.backHome}
      </Link>
    </main>
  )
}
