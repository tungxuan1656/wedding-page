'use client'

import { useEffect, useRef } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <main
      className='flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center'
      id='main-content'
      role='alert'>
      <h1
        ref={headingRef}
        className='font-serif text-3xl text-wine md:text-4xl'
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
    </main>
  )
}
