import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { featured, posterStyle, type Title } from '../../catalog'
import { useMotion } from '../../motion'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

export const PLAY_DELAY = 1500
export const ROTATE_INTERVAL = 12000

interface HeroProps {
  titles?: Title[]
  onMoreInfo?: (title: Title, opener: HTMLButtonElement) => void
}

export function Hero({ titles = featured(), onMoreInfo }: HeroProps) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const { reduced, fadeUp } = useMotion()
  const title = titles[index % titles.length]
  const fade = { duration: reduced ? 0 : 0.45, ease: fadeUp.transition.ease }

  useEffect(() => {
    setPlaying(false)
    if (reduced || !title) return
    const timer = window.setTimeout(() => {
      videoRef.current?.play()?.catch(() => setPlaying(false))
      setPlaying(true)
    }, PLAY_DELAY)
    return () => window.clearTimeout(timer)
  }, [title, reduced])

  useEffect(() => {
    if (paused || titles.length < 2) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % titles.length), ROTATE_INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, paused, titles.length])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted, title])

  if (!title) return null

  return (
    <section
      aria-label="Featured"
      data-testid="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[70vh] min-h-96 overflow-hidden"
    >
      <video
        ref={videoRef}
        data-testid="hero-video"
        src={title.trailerUrl}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      <AnimatePresence initial={false}>
        <motion.div
          key={title.id}
          data-testid="hero-poster"
          data-visible={!playing}
          style={posterStyle(title.posterSeed)}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        />
      </AnimatePresence>

      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        key={title.id}
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={fade}
        className="absolute bottom-[20%] left-6 max-w-xl space-y-4 sm:left-12"
      >
        <h2 className="text-4xl font-bold sm:text-6xl">{title.name}</h2>
        <p className="text-base text-text/90 sm:text-lg">{title.synopsis}</p>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/watch/${title.id}`)}>▶ Play</Button>
          <Button className="bg-surface/80!" onClick={(event) => onMoreInfo?.(title, event.currentTarget)}>More Info</Button>
        </div>
      </motion.div>

      <IconButton
        label={muted ? 'Unmute' : 'Mute'}
        aria-pressed={!muted}
        onClick={() => setMuted((m) => !m)}
        className="absolute right-6 bottom-[20%] bg-surface/60!"
      >
        {muted ? '🔇' : '🔊'}
      </IconButton>
    </section>
  )
}
