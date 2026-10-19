import { useMemo, useEffect, useRef, useState } from 'react'
import { byId, type Title } from '../../catalog'
import { useProfiles } from '../../store/profiles'
import { selectMyList, useMyList } from '../../store/myList'
import { IconButton } from '../IconButton/IconButton'
import { PosterCard } from '../PosterCard/PosterCard'

export interface MyListRowProps {
  onPlay?: (title: Title) => void
  onAdd?: (title: Title) => void
  onOpen?: (title: Title, opener: HTMLButtonElement, layoutId: string) => void
  className?: string
}

export function MyListRow({ onPlay, onAdd, onOpen, className = '' }: MyListRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const titleIds = useMyList(selectMyList(activeProfileId))
  const myListTitles = useMemo(
    () => (titleIds || []).map((id) => byId(id)).filter((t): t is Title => t !== undefined),
    [titleIds],
  )

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(myListTitles.length > 0)

  const updateScroll = () => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    if (el.scrollWidth === 0 && el.clientWidth === 0) {
      setCanScrollRight(myListTitles.length > 0)
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
  }, [myListTitles])

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

  if (myListTitles.length === 0) return null

  return (
    <section aria-label="My List" data-testid="mylist-row" className={`relative space-y-2 ${className}`}>
      <h3 className="px-6 text-xl font-bold font-heading text-text sm:px-12">My List</h3>

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
            data-testid="mylist-row-prev"
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-surface/80! backdrop-blur-xs"
          >
            ‹
          </IconButton>
        )}

        <div
          ref={containerRef}
          data-testid="mylist-row-scroller"
          onScroll={updateScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 py-4 no-scrollbar snap-x snap-mandatory sm:px-12"
        >
          {myListTitles.map((title) => (
            <div key={title.id} className="snap-start shrink-0">
              <PosterCard
                title={title}
                onPlay={onPlay}
                onAdd={onAdd}
                onOpen={onOpen}
                layoutId={`mylist-${title.id}`}
              />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <IconButton
            label="Next"
            data-testid="mylist-row-next"
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
