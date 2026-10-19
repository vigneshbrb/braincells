import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Title } from '../../catalog'
import { IconButton } from '../IconButton/IconButton'
import { PosterCard } from '../PosterCard/PosterCard'

export interface RowProps {
  title: string
  titles: Title[]
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
  className?: string
  renderCard?: (title: Title, openerTabIndex: number) => ReactNode
}

export function Row({ title, titles, onPlay, onAdd, onOpen, className = '', renderCard }: RowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(titles.length > 0)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    if (el.scrollWidth === 0 && el.clientWidth === 0) {
      setCanScrollRight(titles.length > 0)
    } else {
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }
  }, [titles.length])

  useEffect(() => {
    updateScroll()
    const el = containerRef.current
    if (!el) return

    const handleResize = () => updateScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateScroll])

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLButtonElement) || !event.target.matches('[data-row-card-opener]')) return
    const buttons = Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-row-card-opener]') ?? [])
    const index = buttons.indexOf(event.target)
    if (index < 0) return
    let next = index
    if (event.key === 'ArrowRight') next = Math.min(index + 1, buttons.length - 1)
    else if (event.key === 'ArrowLeft') next = Math.max(index - 1, 0)
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = buttons.length - 1
    else return
    event.preventDefault()
    setActiveIndex(next)
    buttons[next].focus()
    buttons[next].scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
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
          onKeyDown={handleKeyDown}
          onFocus={(event) => {
            const buttons = Array.from(containerRef.current?.querySelectorAll('[data-row-card-opener]') ?? [])
            const index = buttons.indexOf(event.target)
            if (index >= 0) setActiveIndex(index)
          }}
          className="flex gap-2 overflow-x-auto scroll-smooth px-6 py-4 no-scrollbar snap-x snap-mandatory sm:gap-4 sm:px-12"
        >
          {titles.map((item, index) => (
            <div key={item.id} className="snap-start shrink-0">
              {renderCard ? renderCard(item, index === activeIndex ? 0 : -1) : <PosterCard title={item} onPlay={onPlay} onAdd={onAdd} onOpen={onOpen} openerTabIndex={index === activeIndex ? 0 : -1} layoutId={`title-${title}-${item.id}`} />}
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
