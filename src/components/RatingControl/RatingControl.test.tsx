import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useProfiles } from '../../store/profiles'
import { useRatings } from '../../store/ratings'
import { RatingControl } from './RatingControl'

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
  useRatings.setState({ ratings: {} })
  useProfiles.setState({ activeId: 'profile-1' })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('shows the selected rating, clears it, and follows the active profile', () => {
  render(<RatingControl titleId="deep-work-sprint" />)
  const up = screen.getByRole('button', { name: 'Thumbs up' })
  fireEvent.click(up)
  expect(up.getAttribute('aria-pressed')).toBe('true')
  fireEvent.click(up)
  expect(up.getAttribute('aria-pressed')).toBe('false')
  fireEvent.click(screen.getByRole('button', { name: 'Double thumbs up' }))
  expect(screen.getByRole('button', { name: 'Double thumbs up' }).getAttribute('aria-pressed')).toBe('true')
  act(() => useProfiles.setState({ activeId: 'profile-2' }))
  expect(screen.getByRole('button', { name: 'Double thumbs up' }).getAttribute('aria-pressed')).toBe('false')
})
