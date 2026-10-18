import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const maxProfiles = 5

export type Profile = {
  id: string
  name: string
}

type ProfilesState = {
  profiles: Profile[]
  activeId: string | null
  addProfile: (name: string) => void
  removeProfile: (id: string) => void
  selectProfile: (id: string) => void
}

export const defaultProfiles: Profile[] = [{ id: 'default', name: 'You' }]

export const useProfiles = create<ProfilesState>()(
  persist(
    (set) => ({
      profiles: defaultProfiles,
      activeId: null,
      addProfile: (name) =>
        set((state) => {
          const trimmed = name.trim()
          if (!trimmed || state.profiles.length >= maxProfiles) return state
          const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
          return { profiles: [...state.profiles, { id, name: trimmed }] }
        }),
      removeProfile: (id) =>
        set((state) => {
          if (state.profiles.length <= 1) return state
          return {
            profiles: state.profiles.filter((profile) => profile.id !== id),
            activeId: state.activeId === id ? null : state.activeId,
          }
        }),
      selectProfile: (id) => set({ activeId: id }),
    }),
    { name: 'braincells-profiles' },
  ),
)
