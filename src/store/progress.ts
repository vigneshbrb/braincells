import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Title } from '../catalog'

export interface ProgressEntry {
  position: number
  duration: number
  updatedAt: number
}

export interface ContinueWatchingItem {
  title: Title
  progress: ProgressEntry
  percentage: number
}

export interface ProgressState {
  progress: Record<string, Record<string, ProgressEntry>>
  setProgress: (profileId: string, titleId: string, position: number, duration: number) => void
  removeProgress: (profileId: string, titleId: string) => void
  getProgress: (profileId: string, titleId: string) => ProgressEntry | undefined
  clearProgress: () => void
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      setProgress: (profileId: string, titleId: string, position: number, duration: number) => {
        if (!profileId || !titleId || duration <= 0) return
        const ratio = position / duration
        if (ratio >= 0.95) {
          set((state) => {
            const profileProgress = { ...(state.progress[profileId] || {}) }
            delete profileProgress[titleId]
            return {
              progress: {
                ...state.progress,
                [profileId]: profileProgress,
              },
            }
          })
          return
        }
        set((state) => ({
          progress: {
            ...state.progress,
            [profileId]: {
              ...(state.progress[profileId] || {}),
              [titleId]: {
                position,
                duration,
                updatedAt: Date.now(),
              },
            },
          },
        }))
      },
      removeProgress: (profileId: string, titleId: string) =>
        set((state) => {
          const profileProgress = { ...(state.progress[profileId] || {}) }
          delete profileProgress[titleId]
          return {
            progress: {
              ...state.progress,
              [profileId]: profileProgress,
            },
          }
        }),
      getProgress: (profileId: string, titleId: string) => {
        return get().progress[profileId]?.[titleId]
      },
      clearProgress: () => set({ progress: {} }),
    }),
    { name: 'braincells-progress' },
  ),
)

export function getContinueWatchingList(
  profileProgress: Record<string, ProgressEntry> | undefined,
  allTitles: Title[],
): ContinueWatchingItem[] {
  if (!profileProgress) return []
  return Object.entries(profileProgress)
    .filter(([, entry]) => entry.duration > 0 && entry.position / entry.duration < 0.95)
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
    .map(([titleId, entry]) => {
      const title = allTitles.find((t) => t.id === titleId)
      if (!title) return null
      return {
        title,
        progress: entry,
        percentage: Math.round((entry.position / entry.duration) * 100),
      }
    })
    .filter((item): item is ContinueWatchingItem => item !== null)
}
