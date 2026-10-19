import { motion } from 'framer-motion'
import { useMotion } from '../../motion'
import { useProfiles } from '../../store/profiles'
import { selectRating, useRatings, type Rating } from '../../store/ratings'

const choices: { rating: Rating; label: string; icon: string }[] = [
  { rating: 'down', label: 'Thumbs down', icon: '👎' },
  { rating: 'up', label: 'Thumbs up', icon: '👍' },
  { rating: 'double-up', label: 'Double thumbs up', icon: '👍👍' },
]

export function RatingControl({ titleId }: { titleId: string }) {
  const profileId = useProfiles((state) => state.activeId) || 'default'
  const selected = useRatings(selectRating(profileId, titleId))
  const toggleRating = useRatings((state) => state.toggleRating)
  const { reduced } = useMotion()

  return (
    <div role="group" aria-label="Rate title" className="flex items-center gap-1">
      {choices.map(({ rating, label, icon }) => (
        <button
          key={rating}
          type="button"
          aria-label={label}
          aria-pressed={selected === rating}
          onClick={(event) => { event.stopPropagation(); toggleRating(profileId, titleId, rating) }}
          className={`grid size-8 place-items-center rounded-control bg-background/80 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${selected === rating ? 'ring-2 ring-highlight' : ''}`}
        >
          <motion.span
            aria-hidden="true"
            animate={{ scale: selected === rating && !reduced ? 1.2 : 1 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 18 }}
          >{icon}</motion.span>
        </button>
      ))}
    </div>
  )
}
