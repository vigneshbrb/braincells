import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const ease = [0.2, 0.8, 0.2, 1] as const

function subscribe(listener: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const media = window.matchMedia(query)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}

function getSnapshot() {
  return typeof window.matchMedia === 'function' && window.matchMedia(query).matches
}

export function useMotion() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false)

  return {
    reduced,
    fadeUp: {
      initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: reduced ? 0 : 0.25, ease },
    },
    scaleIn: {
      initial: reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: reduced ? 0 : 0.25, ease },
    },
    stagger: {
      transition: { staggerChildren: reduced ? 0 : 0.08, duration: 0 },
    },
    micro: { duration: reduced ? 0 : 0.15, ease },
  }
}
