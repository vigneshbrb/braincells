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

it('keeps one card opener in the tab order and moves focus with arrow keys', () => {
  render(<MemoryRouter><Row title="Focus" titles={focusTitles} onOpen={vi.fn()} /></MemoryRouter>)
  const openers = screen.getAllByRole('button', { name: /More info about/ })
  expect(openers.map((button) => button.tabIndex)).toEqual(openers.map((_, index) => index === 0 ? 0 : -1))

  openers[0].focus()
  fireEvent.keyDown(openers[0], { key: 'ArrowRight' })
  expect(document.activeElement).toBe(openers[1])
  expect(openers[0].tabIndex).toBe(-1)
  expect(openers[1].tabIndex).toBe(0)

  fireEvent.keyDown(openers[1], { key: 'End' })
  expect(document.activeElement).toBe(openers[openers.length - 1])
  fireEvent.keyDown(openers[openers.length - 1], { key: 'Home' })
  expect(document.activeElement).toBe(openers[0])
})
