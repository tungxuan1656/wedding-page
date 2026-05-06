'use client'

import { useEffect, useRef, useState } from 'react'

const AUDIO_SRC =
  'https://assets.cinelove.me/mp3/3a627e88-dbcc-46bd-8b9d-160e5fe75e14.mp3'
const VOLUME = 0.2

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.volume = VOLUME
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }

  return (
    <button
      aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      className='fixed top-6 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-wine/80 text-cream shadow-lg backdrop-blur-sm transition-all hover:bg-wine active:scale-95 md:top-8 md:right-8'
      type='button'
      onClick={toggle}>
      {isPlaying ? (
        // Pause icon
        <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
        </svg>
      ) : (
        // Music note icon
        <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 3v10.55A4 4 0 1014 17V7h4V3h-6z' />
        </svg>
      )}
    </button>
  )
}
