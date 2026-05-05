type LoadingSkeletonProps = {
  /** Number of skeleton lines to render. Defaults to 3. */
  lines?: number
  /** Optional heading skeleton above the lines. */
  heading?: boolean
  className?: string
}

export const LoadingSkeleton = ({
  lines = 3,
  heading = false,
  className,
}: LoadingSkeletonProps) => {
  return (
    <div
      aria-label='Đang tải nội dung'
      aria-live='polite'
      className={`flex flex-col items-center gap-4 py-16 ${className ?? ''}`}
      role='status'>
      {heading && (
        <div className='h-8 w-48 animate-pulse rounded-lg bg-beige-dark' />
      )}
      <div className='flex flex-col gap-3'>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className='h-4 animate-pulse rounded bg-beige-dark'
            style={{ width: `${60 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    </div>
  )
}
