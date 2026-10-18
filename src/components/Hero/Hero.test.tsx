import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { featured } from '../../catalog'
import { Hero, PLAY_DELAY, ROTATE_INTERVAL } from './Hero'

const play = vi.fn(() => Promise.resolve())

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches: reduced,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

beforeEach(() => {
  vi.useFakeTimers()
  play.mockClear()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play)
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function renderHero() {
  render(<MemoryRouter><Hero /></MemoryRouter>)
}

it('renders the featured title with Play and More Info actions', () => {
  stubReducedMotion(false)
  renderHero()
  const [first] = featured()

  expect(screen.getByRole('heading', { name: first.name })).toBeTruthy()
  expect(screen.getByText(first.synopsis)).toBeTruthy()
  expect(screen.getByRole('button', { name: /Play/ })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'More Info' })).toBeTruthy()
  expect(screen.getByTestId('hero-poster').getAttribute('data-visible')).toBe('true')
})

it('autoplays the muted trailer after the delay and fades the poster out', () => {
  stubReducedMotion(false)
  renderHero()
  const video = screen.getByTestId('hero-video') as HTMLVideoElement

  act(() => vi.advanceTimersByTime(PLAY_DELAY - 1))
  expect(play).not.toHaveBeenCalled()

  act(() => vi.advanceTimersByTime(1))
  expect(play).toHaveBeenCalledOnce()
  expect(video.muted).toBe(true)
  expect(screen.getByTestId('hero-poster').getAttribute('data-visible')).toBe('false')

  fireEvent.click(screen.getByRole('button', { name: 'Unmute' }))
  expect(video.muted).toBe(false)
  expect(screen.getByRole('button', { name: 'Mute' })).toBeTruthy()
})

it('does not autoplay when reduced motion is set', () => {
  stubReducedMotion(true)
  renderHero()

  act(() => vi.advanceTimersByTime(PLAY_DELAY * 4))
  expect(play).not.toHaveBeenCalled()
  expect(screen.getByTestId('hero-poster').getAttribute('data-visible')).toBe('true')
})

it('rotates titles on a timer and pauses while hovered', () => {
  stubReducedMotion(true)
  renderHero()
  const [first, second, third] = featured()

  act(() => vi.advanceTimersByTime(ROTATE_INTERVAL))
  expect(screen.getByRole('heading', { name: second.name })).toBeTruthy()

  fireEvent.mouseEnter(screen.getByTestId('hero'))
  act(() => vi.advanceTimersByTime(ROTATE_INTERVAL * 2))
  expect(screen.getByRole('heading', { name: second.name })).toBeTruthy()

  fireEvent.mouseLeave(screen.getByTestId('hero'))
  act(() => vi.advanceTimersByTime(ROTATE_INTERVAL))
  expect(screen.getByRole('heading', { name: third.name })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: first.name })).toBeNull()
})
