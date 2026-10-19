import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { posterStyle, titles, type Title } from '../../catalog'
import { useMotion } from '../../motion'
import { useProfiles } from '../../store/profiles'
import { selectMyList, useMyList } from '../../store/myList'
import { Button } from '../Button/Button'

interface TitleModalProps {
  title: Title
  layoutId?: string
  opener: HTMLElement
  onClose: () => void
  onSelect: (title: Title) => void
}

export function TitleModal({ title, layoutId, opener, onClose, onSelect }: TitleModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const { reduced } = useMotion()
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const titleIds = useMyList(selectMyList(activeProfileId))
  const isInList = useMemo(() => (titleIds || []).includes(title.id), [titleIds, title.id])
  const toggleTitle = useMyList((state) => state.toggleTitle)
  const similar = titles.filter((candidate) =>
    candidate.id !== title.id && candidate.genres.includes(title.genres[0]),
  ).slice(0, 6)

  const handleToggle = useCallback(() => {
    toggleTitle(activeProfileId, title.id)
  }, [activeProfileId, title.id, toggleTitle])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [])
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (opener.isConnected) opener.focus()
    }
  }, [onClose, opener])

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-8 sm:py-12" data-testid="title-modal-root">
      <motion.button
        type="button"
        aria-label="Close title details"
        tabIndex={-1}
        className="fixed inset-0 cursor-default bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="title-modal-heading"
        layoutId={layoutId}
        initial={layoutId ? false : { opacity: 0, scale: reduced ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-3xl overflow-hidden rounded-card bg-surface shadow-elevated"
      >
        <div style={posterStyle(title.posterSeed)} className="relative flex min-h-56 items-end p-6 sm:min-h-72">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          <h2 id="title-modal-heading" className="relative font-heading text-3xl font-bold sm:text-4xl">{title.name}</h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-background/80 text-2xl focus-visible:outline-2 focus-visible:outline-highlight"
          >×</button>
        </div>
        <div className="space-y-5 p-6">
          <p className="flex flex-wrap gap-3 text-sm text-muted">
            <span>{title.year}</span><span>{title.maturity}</span><span>{title.duration} min</span>
          </p>
          <p>{title.synopsis}</p>
          <p className="text-sm text-muted">{title.genres.join(' · ')}</p>
          <div className="flex gap-3">
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
          </div>
          {similar.length > 0 && (
            <section aria-label="More like this" className="space-y-3">
              <h3 className="font-heading text-xl font-bold">More like this</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {similar.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => onSelect(candidate)}
                    style={posterStyle(candidate.posterSeed)}
                    className="flex aspect-[3/2] items-end rounded-control p-3 text-left font-semibold shadow-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
                  >{candidate.name}</button>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  )
}
