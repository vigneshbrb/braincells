import { beforeEach, expect, it } from 'vitest'
import { useRatings } from './ratings'
import { useInsights } from './insights'

beforeEach(() => {
  useRatings.setState({ ratings: {} })
  localStorage.removeItem('braincells-ratings')
  useInsights.setState({ events: [], region: 'Europe' })
})

it('sets each sentiment and clears a repeated choice', () => {
  const { toggleRating, getRating } = useRatings.getState()
  for (const rating of ['down', 'up', 'double-up'] as const) {
    toggleRating('profile-1', 'deep-work-sprint', rating)
    expect(getRating('profile-1', 'deep-work-sprint')).toBe(rating)
  }
  toggleRating('profile-1', 'deep-work-sprint', 'double-up')
  expect(getRating('profile-1', 'deep-work-sprint')).toBeUndefined()
  expect(useInsights.getState().events.filter((event) => event.type === 'rate').map((event) => event.rating))
    .toEqual(['down', 'up', 'double-up', null])
})

it('keeps ratings separate by profile and restores them from storage', async () => {
  const { toggleRating, getRating } = useRatings.getState()
  toggleRating('profile-1', 'deep-work-sprint', 'up')
  expect(getRating('profile-2', 'deep-work-sprint')).toBeUndefined()
  const saved = localStorage.getItem('braincells-ratings')
  expect(saved).toContain('deep-work-sprint')

  useRatings.setState({ ratings: {} })
  localStorage.setItem('braincells-ratings', saved!)
  await useRatings.persist.rehydrate()
  expect(useRatings.getState().getRating('profile-1', 'deep-work-sprint')).toBe('up')
  expect(useRatings.getState().getRating('profile-2', 'deep-work-sprint')).toBeUndefined()
})
