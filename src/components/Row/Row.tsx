import { useEffect, useRef, useState } from 'react'
import type { Title } from '../../catalog'
import { IconButton } from '../IconButton/IconButton'
import { PosterCard } from '../PosterCard/PosterCard'

export interface RowProps {
  title: string
  titles: Title[]
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  className?: string
}

export function Row({ title, titles, onPlay, onAdd, className = '' }: RowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(titles.length > 0)

  const updateScroll = () => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    if (el.scrollWidth === 0 && el.clientWidth === 0) {
      setCanScrollRight(titles.length > 0)
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
  }, [titles])

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

  if (titles.length === 0) return null

  return (
    <section aria-label={title} data-testid="row" className={`relative space-y-2 ${className}`}>
      <h3 className="px-6 text-xl font-bold font-heading text-text sm:px-12">{title}</h3>

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
            data-testid="row-prev"
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-surface/80! backdrop-blur-xs"
          >
            ‹
          </IconButton>
        )}

        <div
          ref={containerRef}
          data-testid="row-scroller"
          onScroll={updateScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 py-4 no-scrollbar snap-x snap-mandatory sm:px-12"
        >
          {titles.map((item) => (
            <div key={item.id} className="snap-start shrink-0">
              <PosterCard title={item} onPlay={onPlay} onAdd={onAdd} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <IconButton
            label="Next"
            data-testid="row-next"
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
