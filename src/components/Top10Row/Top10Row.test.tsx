import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Top10Row } from './Top10Row'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('keeps ranks readable and title actions usable with reduced motion', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
  const onOpen = vi.fn()
  render(<MemoryRouter><Top10Row onOpen={onOpen} /></MemoryRouter>)

  const row = screen.getByRole('region', { name: 'Top 10' })
  expect(row.textContent).toContain('Rank 1')
  fireEvent.click(screen.getByRole('button', { name: 'More info about Deep Work Sprint' }))
  expect(onOpen).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'deep-work-sprint', rank: 1 }),
    expect.any(HTMLButtonElement),
    'top10-deep-work-sprint',
  )
})
