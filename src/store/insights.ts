import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { byId, genres, type Genre } from '../catalog'
import type { Rating } from './ratings'
import { useProfiles } from './profiles'

export const regions = ['Asia Pacific', 'Europe', 'North America', 'Other'] as const
export type Region = (typeof regions)[number]

type EventType = 'play' | 'pause' | 'complete' | 'search' | 'rate' | 'add'
export type UsageEvent = {
  type: EventType
  titleId: string | null
  profileId: string
  region: Region
  timestamp: number
  seconds?: number
  rating?: Rating | null
  query?: string
}
type TrackInput = Pick<UsageEvent, 'type' | 'titleId' | 'seconds' | 'rating' | 'query'> & { profileId?: string }

type InsightsState = {
  events: UsageEvent[]
  region: Region
  setRegion: (region: Region) => void
  track: (event: TrackInput) => void
}

export const useInsights = create<InsightsState>()(
  persist(
    (set, get) => ({
      events: [],
      region: 'Asia Pacific',
      setRegion: (region) => set({ region }),
      track: (input) => {
        const event: UsageEvent = {
          ...input,
          profileId: input.profileId ?? useProfiles.getState().activeId ?? 'default',
          region: get().region,
          timestamp: Date.now(),
        }
        set((state) => ({ events: [...state.events, event].slice(-5000) }))
      },
    }),
    { name: 'braincells-insights', partialize: ({ events, region }) => ({ events, region }) },
  ),
)

export function aggregate(events: UsageEvent[], region: Region) {
  const regional = events.filter((event) => event.region === region)
  const genreSeconds = new Map<Genre, number>(genres.map((genre) => [genre, 0]))
  const latestRatings = new Map<string, Rating | null>()
  const ratings: Record<Rating, number> = { down: 0, up: 0, 'double-up': 0 }
  let watchSeconds = 0
  let plays = 0
  let completes = 0

  for (const event of regional) {
    if (event.type === 'play') plays++
    if (event.type === 'complete') completes++
    if ((event.type === 'pause' || event.type === 'complete') && event.titleId) {
      const seconds = Number.isFinite(event.seconds) ? Math.max(0, event.seconds ?? 0) : 0
      watchSeconds += seconds
      for (const genre of byId(event.titleId)?.genres ?? []) {
        genreSeconds.set(genre, (genreSeconds.get(genre) ?? 0) + seconds)
      }
    }
    if (event.type === 'rate' && event.titleId) {
      latestRatings.set(`${event.profileId}:${event.titleId}`, event.rating ?? null)
    }
  }

  for (const rating of latestRatings.values()) {
    if (rating) ratings[rating]++
  }

  return {
    watchSeconds,
    completionRate: plays ? Math.min(100, Math.round((completes / plays) * 100)) : 0,
    ratings,
    topGenres: [...genreSeconds]
      .map(([genre, seconds]) => ({ genre, seconds }))
      .filter(({ seconds }) => seconds > 0)
      .sort((a, b) => b.seconds - a.seconds),
  }
}
