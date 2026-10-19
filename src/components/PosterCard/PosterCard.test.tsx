import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { byGenre } from '../../catalog'
import { useRatings } from '../../store/ratings'
import { HOVER_DELAY, PosterCard } from './PosterCard'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches: reduced,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

beforeEach(() => {
  vi.useFakeTimers()
  mockNavigate.mockClear()
  useRatings.setState({ ratings: {} })
})

it('rates from hover actions without opening the title', () => {
  stubReducedMotion(true)
  const onOpen = vi.fn()
  render(<MemoryRouter><PosterCard title={sampleTitle} onOpen={onOpen} /></MemoryRouter>)
  fireEvent.mouseEnter(screen.getByTestId('poster-card'))
  act(() => vi.advanceTimersByTime(HOVER_DELAY))
  fireEvent.click(screen.getByRole('button', { name: 'Thumbs down' }))
  expect(useRatings.getState().getRating('default', sampleTitle.id)).toBe('down')
  expect(onOpen).not.toHaveBeenCalled()
})

it('keeps rating actions available while keyboard focus moves inside the card', () => {
  stubReducedMotion(true)
  render(<MemoryRouter><PosterCard title={sampleTitle} onOpen={vi.fn()} /></MemoryRouter>)
  const opener = screen.getByRole('button', { name: `More info about ${sampleTitle.name}` })
  fireEvent.focus(opener)
  act(() => vi.advanceTimersByTime(HOVER_DELAY))
  const down = screen.getByRole('button', { name: 'Thumbs down' })
  fireEvent.blur(opener, { relatedTarget: down })
  fireEvent.focus(down)
  expect(screen.getByRole('button', { name: 'Thumbs down' })).toBeTruthy()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const sampleTitle = byGenre('Focus')[0]

it('renders title metadata and applies gradient posterStyle', () => {
  stubReducedMotion(false)
  render(
    <MemoryRouter>
      <PosterCard title={sampleTitle} />
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: sampleTitle.name })).toBeTruthy()
  expect(screen.getByText(sampleTitle.maturity)).toBeTruthy()
  expect(screen.getByText(`${sampleTitle.duration}m`)).toBeTruthy()
  expect(screen.getByTestId('poster-card').getAttribute('data-hovered')).toBe('false')
  expect(screen.queryByTestId('poster-card-actions')).toBeNull()
})

it('reveals Play and Add quick actions after hovering 300 ms', () => {
  stubReducedMotion(false)
  const onPlay = vi.fn()
  const onAdd = vi.fn()

  render(
    <MemoryRouter>
      <PosterCard title={sampleTitle} onPlay={onPlay} onAdd={onAdd} />
    </MemoryRouter>,
  )

  const card = screen.getByTestId('poster-card')
  fireEvent.mouseEnter(card)

  act(() => vi.advanceTimersByTime(HOVER_DELAY - 1))
  expect(screen.queryByTestId('poster-card-actions')).toBeNull()
  expect(card.getAttribute('data-hovered')).toBe('false')

  act(() => vi.advanceTimersByTime(1))
  expect(screen.getByTestId('poster-card-actions')).toBeTruthy()
  expect(card.getAttribute('data-hovered')).toBe('true')

  const playBtn = screen.getByRole('button', { name: 'Play' })
  const addBtn = screen.getByRole('button', { name: /Add to My List/i })
  expect(playBtn).toBeTruthy()
  expect(addBtn).toBeTruthy()

  fireEvent.click(playBtn)
  expect(onPlay).toHaveBeenCalledWith(sampleTitle)

  fireEvent.click(addBtn)
  expect(onAdd).toHaveBeenCalledWith(sampleTitle)
})

it('cancels hover timer when mouse leaves before 300 ms', () => {
  stubReducedMotion(false)
  render(
    <MemoryRouter>
      <PosterCard title={sampleTitle} />
    </MemoryRouter>,
  )

  const card = screen.getByTestId('poster-card')
  fireEvent.mouseEnter(card)
  act(() => vi.advanceTimersByTime(HOVER_DELAY / 2))

  fireEvent.mouseLeave(card)
  act(() => vi.advanceTimersByTime(HOVER_DELAY))

  expect(screen.queryByTestId('poster-card-actions')).toBeNull()
  expect(card.getAttribute('data-hovered')).toBe('false')
})

it('navigates to watch page when play button clicked without onPlay callback', () => {
  stubReducedMotion(false)
  render(
    <MemoryRouter>
      <PosterCard title={sampleTitle} />
    </MemoryRouter>,
  )

  fireEvent.mouseEnter(screen.getByTestId('poster-card'))
  act(() => vi.advanceTimersByTime(HOVER_DELAY))

  fireEvent.click(screen.getByRole('button', { name: 'Play' }))
  expect(mockNavigate).toHaveBeenCalledWith(`/watch/${sampleTitle.id}`)
})
