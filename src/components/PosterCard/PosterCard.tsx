import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { posterStyle, type Title } from '../../catalog'
import { useMotion } from '../../motion'
import { useProfiles } from '../../store/profiles'
import { selectMyList, useMyList } from '../../store/myList'
import { Button } from '../Button/Button'
import { RatingControl } from '../RatingControl/RatingControl'

export const HOVER_DELAY = 300

export interface PosterCardProps {
  title: Title
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
  layoutId?: string
  className?: string
  progress?: number
  openerTabIndex?: number
}

export function PosterCard({ title, onPlay, onAdd, onOpen, layoutId, className = '', progress, openerTabIndex }: PosterCardProps) {
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const { reduced } = useMotion()
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const titleIds = useMyList(selectMyList(activeProfileId))
  const isInList = useMemo(() => (titleIds || []).includes(title.id), [titleIds, title.id])
  const toggleTitle = useMyList((state) => state.toggleTitle)

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTitle(activeProfileId, title.id)
    onAdd?.(title)
  }, [activeProfileId, title, toggleTitle, onAdd])

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleMouseEnter = () => {
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      setHovered(true)
    }, HOVER_DELAY)
  }

  const handleMouseLeave = () => {
    clearTimer()
    setHovered(false)
  }

  const handleFocus = () => {
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      setHovered(true)
    }, HOVER_DELAY)
  }

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    clearTimer()
    setHovered(false)
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  return (
    <motion.article
      data-testid="poster-card"
      data-hovered={hovered}
      aria-label={title.name}
      layoutId={layoutId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      animate={{
        scale: reduced ? 1 : hovered ? 1.15 : 1,
        zIndex: hovered ? 20 : 1,
      }}
      transition={{ duration: reduced ? 0 : 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      style={posterStyle(title.posterSeed)}
      className={`relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-card p-3 shadow-elevated sm:w-44 sm:p-4 ${className}`}
    >
      {onOpen && (
        <button
          type="button"
          aria-label={`More info about ${title.name}`}
          data-row-card-opener=""
          tabIndex={openerTabIndex}
          className="absolute inset-0 z-0 rounded-card focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-highlight"
          onClick={(event) => onOpen(title, event.currentTarget, layoutId ?? `title-${title.id}`)}
        />
      )}
      <div className="pointer-events-none relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between text-xs font-semibold">
          <span className="rounded-control bg-background/60 px-1.5 py-0.5 backdrop-blur-xs">
            {title.maturity}
          </span>
          <span className="text-text/80">{title.duration}m</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-heading text-base font-bold leading-tight drop-shadow-md">
            {title.name}
          </h4>

          {hovered && (
            <motion.div
              data-testid="poster-card-actions"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.15 }}
              className="pointer-events-auto flex flex-col gap-2 pt-1"
            >
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Play"
                  className="size-8 p-0! text-xs font-bold"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onPlay) onPlay(title)
                    else navigate(`/watch/${title.id}`)
                  }}
                >
                  ▶
                </Button>
                <Button
                  aria-label={isInList ? 'Remove from My List' : 'Add to My List'}
                  className="size-8 bg-surface/80! p-0! text-xs font-bold"
                  onClick={handleToggle}
                >
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
                </Button>
              </div>
              <RatingControl titleId={title.id} />
            </motion.div>
          )}
        </div>
      </div>
      {typeof progress === 'number' && (
        <div
          data-testid="poster-progress-track"
          className="absolute inset-x-0 bottom-0 h-1.5 bg-surface/80"
        >
          <motion.div
            data-testid="poster-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            transition={{ duration: reduced ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-full bg-highlight"
          />
        </div>
      )}
    </motion.article>
  )
}
