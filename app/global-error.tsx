'use client'

import './globals.css'

export default function GlobalError({
  error: _error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang='vi'>
      <body className='flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center font-sans text-wine'>
        <h1 className='font-serif text-3xl md:text-4xl'>Đã xảy ra lỗi</h1>
        <p className='mt-4 text-text-secondary'>
          Có lỗi không mong muốn xảy ra. Vui lòng thử lại.
        </p>
        <button
          className='mt-8 inline-block rounded-lg bg-wine px-6 py-3 font-medium text-cream transition-colors hover:bg-wine-light'
          onClick={() => unstable_retry()}>
          Thử lại
        </button>
      </body>
    </html>
  )
}
