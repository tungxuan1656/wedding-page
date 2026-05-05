'use client'

import './globals.css'

import { useEffect, useRef } from 'react'

export default function GlobalError({
  error: _error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <html lang='vi'>
      <body
        className='flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center font-sans text-wine'
        id='main-content'
        role='alert'>
        <h1
          ref={headingRef}
          className='font-serif text-3xl md:text-4xl'
          tabIndex={-1}>
          Đã xảy ra lỗi
        </h1>
        <p className='mt-4 text-text-secondary'>
          Có lỗi không mong muốn xảy ra. Vui lòng thử lại.
        </p>
        <button
          className='mt-8 inline-block rounded-lg bg-wine px-6 py-3 font-medium text-cream transition-colors hover:bg-wine-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine'
          onClick={() => unstable_retry()}>
          Thử lại
        </button>
      </body>
    </html>
  )
}
