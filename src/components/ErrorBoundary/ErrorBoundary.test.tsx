import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('offers a retry that remounts content after a render error', () => {
  const logged = vi.spyOn(console, 'error').mockImplementation(() => {})
  let shouldFail = true

  function Page() {
    if (shouldFail) throw new Error('Temporary failure')
    return <h1>Page loaded</h1>
  }

  render(<ErrorBoundary><Page /></ErrorBoundary>)
  expect(screen.getByRole('alert').textContent).toContain('Something went wrong')
  shouldFail = false
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(screen.getByRole('heading', { name: 'Page loaded' })).toBeTruthy()
  expect(logged).toHaveBeenCalled()
})
