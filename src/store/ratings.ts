import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useInsights } from './insights'

export type Rating = 'down' | 'up' | 'double-up'

type RatingsState = {
  ratings: Record<string, Record<string, Rating>>
  toggleRating: (profileId: string, titleId: string, rating: Rating) => void
  getRating: (profileId: string, titleId: string) => Rating | undefined
}

export const useRatings = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: {},
      toggleRating: (profileId, titleId, rating) => {
        const next = get().ratings[profileId]?.[titleId] === rating ? null : rating
        set((state) => {
          const profileRatings = { ...state.ratings[profileId] }
          if (next === null) delete profileRatings[titleId]
          else profileRatings[titleId] = next
          return { ratings: { ...state.ratings, [profileId]: profileRatings } }
        })
        useInsights.getState().track({ type: 'rate', titleId, profileId, rating: next })
      },
      getRating: (profileId, titleId) => get().ratings[profileId]?.[titleId],
    }),
    { name: 'braincells-ratings', partialize: (state) => ({ ratings: state.ratings }) },
  ),
)

export const selectRating = (profileId: string, titleId: string) =>
  (state: RatingsState) => state.ratings[profileId]?.[titleId]
