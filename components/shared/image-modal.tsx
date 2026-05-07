'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { strings } from '@/lib/i18n'

const { imageModal: s } = strings

export type ImageItem = {
  src: string
  alt: string
}

type ImageModalProps = {
  images: ImageItem[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export const ImageModal = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pinchStartRef = useRef({ distance: 0, scale: 1 })
  const dragStartRef = useRef({
    x: 0,
    y: 0,
    posX: 0,
    posY: 0,
    isDragging: false,
  })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setScale(1)
      setPosition({ x: 0, y: 0 })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialIndex])

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length) return
      setCurrentIndex(index)
      setScale(1)
      setPosition({ x: 0, y: 0 })
    },
    [images.length],
  )

  const handlePrev = useCallback(
    () => goTo(currentIndex - 1),
    [currentIndex, goTo],
  )
  const handleNext = useCallback(
    () => goTo(currentIndex + 1),
    [currentIndex, goTo],
  )

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handlePrev, handleNext])

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()

    const delta = e.deltaY < 0 ? 0.15 : -0.15

    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 1), 4)
      if (next <= 1) setPosition({ x: 0, y: 0 })

      return next
    })
  }, [])

  // Pinch zoom helpers
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY

    return Math.hypot(dx, dy)
  }

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        setIsPinching(true)

        pinchStartRef.current = {
          distance: getTouchDistance(e.touches),
          scale,
        }
      } else if (e.touches.length === 1 && scale > 1) {
        dragStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          posX: position.x,
          posY: position.y,
          isDragging: true,
        }
      }
    },
    [scale, position],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault()

        const distance = getTouchDistance(e.touches)
        const ratio = distance / pinchStartRef.current.distance
        const newScale = Math.min(
          Math.max(pinchStartRef.current.scale * ratio, 1),
          4,
        )
        setScale(newScale)
        if (newScale <= 1) setPosition({ x: 0, y: 0 })
      } else if (
        e.touches.length === 1 &&
        dragStartRef.current.isDragging &&
        scale > 1
      ) {
        e.preventDefault()

        const dx = e.touches[0].clientX - dragStartRef.current.x
        const dy = e.touches[0].clientY - dragStartRef.current.y

        setPosition({
          x: dragStartRef.current.posX + dx,
          y: dragStartRef.current.posY + dy,
        })
      }
    },
    [isPinching, scale],
  )

  const handleTouchEnd = useCallback(() => {
    setIsPinching(false)
    dragStartRef.current.isDragging = false
    if (scale <= 1) setPosition({ x: 0, y: 0 })
  }, [scale])

  // Double click to zoom in/out
  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setScale(2.5)
    }
  }, [scale])

  // Mouse drag for panning when zoomed
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 1) {
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          posX: position.x,
          posY: position.y,
          isDragging: true,
        }
      }
    },
    [scale, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragStartRef.current.isDragging && scale > 1) {
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y

        setPosition({
          x: dragStartRef.current.posX + dx,
          y: dragStartRef.current.posY + dy,
        })
      }
    },
    [scale],
  )

  const handleMouseUp = useCallback(() => {
    dragStartRef.current.isDragging = false
  }, [])

  const currentImage = images[currentIndex]

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          ref={containerRef}
          animate={{ opacity: 1 }}
          className='fixed inset-0 z-50 flex touch-none items-center justify-center'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-wine-dark/95 backdrop-blur-md'
            onClick={onClose}
          />

          {/* Close button */}
          <button
            aria-label={s.closeLabel}
            className='absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-wine-dark/60 text-cream backdrop-blur-sm transition-colors hover:bg-wine-dark hover:text-gold'
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}>
            <svg
              fill='none'
              height='20'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='20'>
              <line x1='18' x2='6' y1='6' y2='18' />
              <line x1='6' x2='18' y1='6' y2='18' />
            </svg>
          </button>

          {/* Image counter */}
          <div className='absolute top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-wine-dark/60 px-4 py-1.5 text-xs font-medium text-cream backdrop-blur-sm'>
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                aria-label={s.prevLabel}
                className='absolute left-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-wine-dark/60 text-cream backdrop-blur-sm transition-colors hover:bg-wine-dark hover:text-gold disabled:opacity-30 disabled:hover:bg-wine-dark/60 disabled:hover:text-cream sm:left-4 md:h-12 md:w-12'
                disabled={currentIndex === 0}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}>
                <svg
                  fill='none'
                  height='20'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  width='20'>
                  <polyline points='15 18 9 12 15 6' />
                </svg>
              </button>
              <button
                aria-label={s.nextLabel}
                className='absolute right-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-wine-dark/60 text-cream backdrop-blur-sm transition-colors hover:bg-wine-dark hover:text-gold disabled:opacity-30 disabled:hover:bg-wine-dark/60 disabled:hover:text-cream sm:right-4 md:h-12 md:w-12'
                disabled={currentIndex === images.length - 1}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}>
                <svg
                  fill='none'
                  height='20'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  width='20'>
                  <polyline points='9 18 15 12 9 6' />
                </svg>
              </button>
            </>
          )}

          {/* Image container */}
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className={`relative z-10 mx-4 h-[80vh] w-full max-w-5xl ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
            exit={{ scale: 0.9, opacity: 0 }}
            initial={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}>
            <div
              className='relative h-full w-full'
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition:
                  isPinching || dragStartRef.current.isDragging
                    ? 'none'
                    : 'transform 0.2s ease-out',
              }}>
              <Image
                fill
                priority
                alt={currentImage.alt}
                className='object-contain'
                draggable={false}
                sizes='100vw'
                src={currentImage.src}
              />
            </div>
          </motion.div>

          {/* Zoom hint */}
          <div className='absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-wine-dark/60 px-3 py-1 text-[10px] text-cream/60 backdrop-blur-sm sm:text-xs'>
            {s.zoomHint}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
