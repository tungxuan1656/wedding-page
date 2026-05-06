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

    const playAudio = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          // Remove listener once played
          window.removeEventListener('click', playAudio)
          window.removeEventListener('touchstart', playAudio)
          window.removeEventListener('scroll', playAudio)
        })
        .catch(() => {
          // Still blocked
        })
    }

    // Try to autoplay immediately
    playAudio()

    // Add listeners for interaction to unlock audio
    window.addEventListener('click', playAudio)
    window.addEventListener('touchstart', playAudio)
    window.addEventListener('scroll', playAudio)

    return () => {
      audio.pause()
      audio.src = ''
      window.removeEventListener('click', playAudio)
      window.removeEventListener('touchstart', playAudio)
      window.removeEventListener('scroll', playAudio)
    }
  }, [])

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the window listener

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
      className={`fixed top-6 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-wine/80 text-cream shadow-lg backdrop-blur-sm transition-all hover:bg-wine active:scale-95 md:top-8 md:right-8`}
      type='button'
      onClick={toggle}>
      <svg
        className={`h-5 w-5 ${isPlaying ? 'animate-spin' : ''}`}
        fill='currentColor'
        viewBox='0 0 24 24'>
        <path d='M12 3v10.55A4 4 0 1014 17V7h4V3h-6z' />
      </svg>
    </button>
  )
}
