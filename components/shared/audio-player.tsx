'use client'

import { useEffect, useRef, useState } from 'react'

const AUDIO_SRC = '/audios/beautiful-in-white-westlife.mp3'
const VOLUME = 0.15

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const startedRef = useRef(false)

  // Play on first user interaction — satisfies browser autoplay policy
  useEffect(() => {
    const tryPlay = () => {
      if (startedRef.current) return

      const audio = audioRef.current
      if (!audio) return

      audio.volume = VOLUME

      audio
        .play()
        .then(() => {
          startedRef.current = true
          setIsPlaying(true)
        })
        .catch((err) => {
          console.log('Play blocked:', err)
        })
    }

    const events = ['click', 'keydown', 'touchstart', 'scroll'] as const

    events.forEach((e) => {
      document.addEventListener(e, tryPlay, { once: true })
    })

    return () => {
      events.forEach((e) => {
        document.removeEventListener(e, tryPlay)
      })
    }
  }, [])

  // Sync state if audio pauses/ends unexpectedly
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = false
    audio.play()

    const onPause = () => setIsPlaying(false)
    audio.addEventListener('pause', onPause)

    return () => audio.removeEventListener('pause', onPause)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = VOLUME

      audio
        .play()
        .then(() => {
          startedRef.current = true
          setIsPlaying(true)
        })
        .catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} loop src={AUDIO_SRC} />
      <button
        aria-label={
          isPlaying ? 'Pause background music' : 'Play background music'
        }
        className='fixed top-6 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-wine/80 text-cream shadow-lg backdrop-blur-sm transition-all hover:bg-wine active:scale-95 md:top-8 md:right-8'
        type='button'
        onClick={toggle}>
        <svg
          className={`h-5 w-5 ${isPlaying ? 'animate-spin-slow' : ''}`}
          fill='currentColor'
          viewBox='0 0 24 24'>
          <path d='M12 3v10.55A4 4 0 1014 17V7h4V3h-6z' />
        </svg>
      </button>
    </>
  )
}
