import { useEffect, useRef, useState } from 'react'
import { titles, type Title } from '../../catalog'
import { useProfiles } from '../../store/profiles'
import { getContinueWatchingList, useProgress } from '../../store/progress'
import { IconButton } from '../IconButton/IconButton'
import { PosterCard } from '../PosterCard/PosterCard'

export interface ContinueRowProps {
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
  className?: string
}

export function ContinueRow({ onPlay, onAdd, onOpen, className = '' }: ContinueRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const progressMap = useProgress((state) => state.progress)
  const continueItems = getContinueWatchingList(progressMap[activeProfileId], titles)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(continueItems.length > 0)

  const updateScroll = () => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    if (el.scrollWidth === 0 && el.clientWidth === 0) {
      setCanScrollRight(continueItems.length > 0)
    } else {
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }
  }

  useEffect(() => {
    updateScroll()
    const el = containerRef.current
    if (!el) return

    const handleResize = () => updateScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [continueItems])

  const scrollLeft = () => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
  }

  const scrollRight = () => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
  }

  if (continueItems.length === 0) return null

  return (
    <section aria-label="Continue Watching" data-testid="continue-row" className={`relative space-y-2 ${className}`}>
      <h3 className="px-6 text-xl font-bold font-heading text-text sm:px-12">Continue Watching</h3>

      <div className="group relative">
        {canScrollLeft && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-background to-transparent"
          />
        )}

        {canScrollLeft && (
          <IconButton
            label="Previous"
            data-testid="continue-row-prev"
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-surface/80! backdrop-blur-xs"
          >
            ‹
          </IconButton>
        )}

        <div
          ref={containerRef}
          data-testid="continue-row-scroller"
          onScroll={updateScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 py-4 no-scrollbar snap-x snap-mandatory sm:px-12"
        >
          {continueItems.map(({ title, percentage }) => (
            <div key={title.id} className="snap-start shrink-0">
              <PosterCard
                title={title}
                progress={percentage}
                onPlay={onPlay}
                onAdd={onAdd}
                onOpen={onOpen}
                layoutId={`continue-${title.id}`}
              />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <IconButton
            label="Next"
            data-testid="continue-row-next"
            onClick={scrollRight}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-surface/80! backdrop-blur-xs"
          >
            ›
          </IconButton>
        )}

        {canScrollRight && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-background to-transparent"
          />
        )}
      </div>
    </section>
  )
}
