import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  email: string | null
  signIn: (email: string) => void
  signOut: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      signIn: (email) => set({ email }),
      signOut: () => set({ email: null }),
    }),
    { name: 'braincells-auth' },
  ),
)
