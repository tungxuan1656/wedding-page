'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className='flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center'>
      <h1 className='font-serif text-3xl text-wine md:text-4xl'>
        Đã xảy ra lỗi
      </h1>
      <p className='mt-4 text-text-secondary'>
        Có lỗi không mong muốn xảy ra. Vui lòng thử lại.
      </p>
      <button
        className='mt-8 inline-block rounded-lg bg-wine px-6 py-3 font-medium text-cream transition-colors hover:bg-wine-light'
        onClick={() => unstable_retry()}>
        Thử lại
      </button>
    </main>
  )
}
