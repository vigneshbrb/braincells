import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { featured, posterStyle, type Title } from '../../catalog'
import { useMotion } from '../../motion'
import { useProfiles } from '../../store/profiles'
import { selectMyList, useMyList } from '../../store/myList'
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
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const title = titles[index % titles.length]
  const titleIds = useMyList(selectMyList(activeProfileId))
  const isInList = useMemo(() => (titleIds || []).includes(title.id), [titleIds, title.id])
  const toggleTitle = useMyList((state) => state.toggleTitle)
  const fade = { duration: reduced ? 0 : 0.45, ease: fadeUp.transition.ease }

  const handleToggle = useCallback(() => {
    toggleTitle(activeProfileId, title.id)
  }, [activeProfileId, title.id, toggleTitle])

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
      className="relative h-[70vh] min-h-[36rem] overflow-hidden"
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
        className="absolute inset-x-6 bottom-20 max-w-xl space-y-3 sm:inset-x-auto sm:bottom-[20%] sm:left-12 sm:space-y-4"
      >
        <h2 className="text-3xl font-bold sm:text-6xl">{title.name}</h2>
        <p className="text-sm text-text/90 sm:text-lg">{title.synopsis}</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={() => navigate(`/watch/${title.id}`)}>▶ Play</Button>
          <Button className="bg-surface/80!" onClick={handleToggle}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isInList ? 'check' : 'plus'}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                {isInList ? '✓' : '+'}
              </motion.span>
            </AnimatePresence>
            <span className="ml-1.5">{isInList ? 'In My List' : 'My List'}</span>
          </Button>
          <Button className="bg-surface/80!" onClick={(event) => onMoreInfo?.(title, event.currentTarget)}>More Info</Button>
        </div>
      </motion.div>

      <IconButton
        label={muted ? 'Unmute' : 'Mute'}
        aria-pressed={!muted}
        onClick={() => setMuted((m) => !m)}
        className="absolute right-6 bottom-4 bg-surface/60! sm:bottom-[20%]"
      >
        {muted ? '🔇' : '🔊'}
      </IconButton>
    </section>
  )
}
