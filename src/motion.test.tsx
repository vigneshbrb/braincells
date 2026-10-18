import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { useMotion } from './motion'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('removes entrance transforms, durations, and stagger when reduced motion is enabled', () => {
  const listeners = new Set<() => void>()
  let reduced = false
  vi.stubGlobal('matchMedia', () => ({
    get matches() { return reduced },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }))

  const { result } = renderHook(() => useMotion())
  expect(result.current.fadeUp.transition.duration).toBeGreaterThan(0)
  expect(result.current.stagger.transition.staggerChildren).toBeGreaterThan(0)

  act(() => {
    reduced = true
    listeners.forEach((listener) => listener())
  })

  expect(result.current.fadeUp.initial).toEqual(result.current.fadeUp.animate)
  expect(result.current.scaleIn.initial).toEqual(result.current.scaleIn.animate)
  expect(result.current.fadeUp.transition.duration).toBe(0)
  expect(result.current.scaleIn.transition.duration).toBe(0)
  expect(result.current.stagger.transition.staggerChildren).toBe(0)
})
