import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../../App'
import { byGenre } from '../../catalog'
import { useAuth } from '../../store/auth'

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
  useAuth.setState({ email: 'viewer@example.com' })
  window.history.replaceState({}, '', '/browse')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('opens from a card, traps focus, and restores scroll and focus after Esc', async () => {
  render(<App />)
  const title = byGenre('Focus')[0]
  const opener = screen.getAllByRole('button', { name: `More info about ${title.name}` })[0]
  opener.focus()
  fireEvent.click(opener)

  const dialog = screen.getByRole('dialog', { name: title.name })
  expect(dialog).toBeTruthy()
  expect(document.body.style.overflow).toBe('hidden')
  const close = within(dialog).getByRole('button', { name: 'Close' })
  expect(document.activeElement).toBe(close)

  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  const buttons = within(dialog).getAllByRole('button')
  expect(document.activeElement).toBe(buttons[buttons.length - 1])
  fireEvent.keyDown(document, { key: 'Escape' })

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  expect(document.body.style.overflow).toBe('')
  expect(document.activeElement).toBe(opener)
})

it('opens from More Info and closes on backdrop click', async () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'More Info' }))
  expect(screen.getByRole('dialog')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close title details' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
})

it('lists up to six other titles from the selected title’s primary genre', () => {
  render(<App />)
  const title = byGenre('Focus')[0]
  fireEvent.click(screen.getAllByRole('button', { name: `More info about ${title.name}` })[0])

  const section = within(screen.getByRole('dialog')).getByRole('region', { name: 'More like this' })
  const names = within(section).getAllByRole('button').map((button) => button.textContent)
  expect(names.length).toBeLessThanOrEqual(6)
  expect(names).not.toContain(title.name)
  expect(names.every((name) => byGenre('Focus').some((candidate) => candidate.name === name))).toBe(true)
})
