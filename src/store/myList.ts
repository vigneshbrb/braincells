import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { byId } from '../catalog'
import type { Title } from '../catalog'
import { useInsights } from './insights'

export interface MyListState {
  list: Record<string, string[]>
  toggleTitle: (profileId: string, titleId: string) => void
  addTitle: (profileId: string, titleId: string) => void
  removeTitle: (profileId: string, titleId: string) => void
  isInList: (profileId: string, titleId: string) => boolean
  getList: (profileId: string) => Title[]
  clearList: () => void
}

export const useMyList = create<MyListState>()(
  persist(
    (set, get) => ({
      list: {},
      toggleTitle: (profileId: string, titleId: string) => {
        const adding = !(get().list[profileId] || []).includes(titleId)
        set((state) => {
          const current = state.list[profileId] || []
          const exists = current.includes(titleId)
          return {
            list: {
              ...state.list,
              [profileId]: exists
                ? current.filter((id) => id !== titleId)
                : [...current, titleId],
            },
          }
        })
        if (adding) useInsights.getState().track({ type: 'add', titleId, profileId })
      },
      addTitle: (profileId: string, titleId: string) => {
        const adding = !(get().list[profileId] || []).includes(titleId)
        set((state) => {
          const current = state.list[profileId] || []
          if (current.includes(titleId)) return state
          return {
            list: {
              ...state.list,
              [profileId]: [...current, titleId],
            },
          }
        })
        if (adding) useInsights.getState().track({ type: 'add', titleId, profileId })
      },
      removeTitle: (profileId: string, titleId: string) => {
        set((state) => ({
          list: {
            ...state.list,
            [profileId]: (state.list[profileId] || []).filter((id) => id !== titleId),
          },
        }))
      },
      isInList: (profileId: string, titleId: string) => {
        return (get().list[profileId] || []).includes(titleId)
      },
      getList: (profileId: string) => {
        return (get().list[profileId] || [])
          .map((id) => byId(id))
          .filter((title): title is Title => title !== undefined)
      },
      clearList: () => set({ list: {} }),
    }),
    { name: 'braincells-mylist' },
  ),
)

export function selectMyList(profileId: string) {
  return (state: MyListState) => state.list[profileId]
}
