import { beforeEach, expect, it } from 'vitest'
import { aggregate, useInsights, type UsageEvent } from './insights'
import { useProfiles } from './profiles'

beforeEach(() => {
  useInsights.setState({ events: [], region: 'Asia Pacific' })
  useProfiles.setState({ activeId: 'profile-1' })
  localStorage.removeItem('braincells-insights')
})

it('records profile and selected region, persists events, and keeps the newest 5000', () => {
  const seeded: UsageEvent[] = Array.from({ length: 5000 }, (_, index) => ({
    type: 'play', titleId: `title-${index}`, profileId: 'profile-1', region: 'Asia Pacific', timestamp: index,
  }))
  useInsights.setState({ events: seeded })
  const { track, setRegion } = useInsights.getState()
  track({ type: 'play', titleId: 'title-5000' })
  setRegion('Europe')
  useProfiles.setState({ activeId: 'profile-2' })
  track({ type: 'search', titleId: null, query: 'focus' })

  const events = useInsights.getState().events
  expect(events).toHaveLength(5000)
  expect(events[0].titleId).toBe('title-2')
  expect(events[events.length - 1]).toMatchObject({ type: 'search', titleId: null, profileId: 'profile-2', region: 'Europe', query: 'focus' })
  expect(events[events.length - 1]?.timestamp).toEqual(expect.any(Number))
  expect(JSON.parse(localStorage.getItem('braincells-insights')!).state.events).toHaveLength(5000)
})

it('aggregates watch time, genres, completions, and latest ratings by region', () => {
  const { track, setRegion } = useInsights.getState()
  track({ type: 'play', titleId: 'deep-work-sprint' })
  track({ type: 'pause', titleId: 'deep-work-sprint', seconds: 90 })
  track({ type: 'complete', titleId: 'deep-work-sprint', seconds: 30 })
  track({ type: 'rate', titleId: 'deep-work-sprint', rating: 'up' })
  track({ type: 'rate', titleId: 'deep-work-sprint', rating: 'double-up' })
  setRegion('Europe')
  track({ type: 'play', titleId: 'sleep-reset' })
  track({ type: 'pause', titleId: 'sleep-reset', seconds: 60 })
  track({ type: 'rate', titleId: 'sleep-reset', rating: 'down' })

  const asia = aggregate(useInsights.getState().events, 'Asia Pacific')
  const europe = aggregate(useInsights.getState().events, 'Europe')
  expect(asia.watchSeconds).toBe(120)
  expect(asia.completionRate).toBe(100)
  expect(asia.ratings).toEqual({ down: 0, up: 0, 'double-up': 1 })
  expect(asia.topGenres[0]).toMatchObject({ genre: 'Focus', seconds: 120 })
  expect(europe.watchSeconds).toBe(60)
  expect(europe.completionRate).toBe(0)
  expect(europe.ratings).toEqual({ down: 1, up: 0, 'double-up': 0 })
  expect(europe.topGenres[0]).toMatchObject({ genre: 'Health', seconds: 60 })
})
