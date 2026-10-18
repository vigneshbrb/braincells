import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { byGenre } from '../../catalog'
import { Row } from './Row'

const focusTitles = byGenre('Focus')

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

it('renders the row title and poster cards', () => {
  render(
    <MemoryRouter>
      <Row title="Focus" titles={focusTitles} />
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: 'Focus' })).toBeTruthy()
  expect(screen.getAllByTestId('poster-card').length).toBe(focusTitles.length)
})

it('hides the left arrow when at the start of the row', () => {
  render(
    <MemoryRouter>
      <Row title="Focus" titles={focusTitles} />
    </MemoryRouter>,
  )

  expect(screen.queryByTestId('row-prev')).toBeNull()
  expect(screen.getByTestId('row-next')).toBeTruthy()
})

it('scrolls by one visible page on right arrow click and updates arrow visibility', () => {
  render(
    <MemoryRouter>
      <Row title="Focus" titles={focusTitles} />
    </MemoryRouter>,
  )

  const scroller = screen.getByTestId('row-scroller')
  const scrollBySpy = vi.fn()
  scroller.scrollBy = scrollBySpy

  Object.defineProperty(scroller, 'clientWidth', { value: 800, configurable: true })
  Object.defineProperty(scroller, 'scrollWidth', { value: 2000, configurable: true })
  Object.defineProperty(scroller, 'scrollLeft', { value: 0, writable: true, configurable: true })

  const nextBtn = screen.getByTestId('row-next')
  fireEvent.click(nextBtn)

  expect(scrollBySpy).toHaveBeenCalledWith({ left: 800, behavior: 'smooth' })

  // Simulate scrolling
  scroller.scrollLeft = 800
  fireEvent.scroll(scroller)

  const prevBtn = screen.getByTestId('row-prev')
  expect(prevBtn).toBeTruthy()

  fireEvent.click(prevBtn)
  expect(scrollBySpy).toHaveBeenCalledWith({ left: -800, behavior: 'smooth' })
})

it('renders nothing when titles array is empty', () => {
  const { container } = render(
    <MemoryRouter>
      <Row title="Empty" titles={[]} />
    </MemoryRouter>,
  )

  expect(container.firstChild).toBeNull()
})
