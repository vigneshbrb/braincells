import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/auth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const email = useAuth((state) => state.email)
  if (!email) return <Navigate to="/signin" replace />
  return <>{children}</>
}
